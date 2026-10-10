const User = require("../models/User");
const College = require("../models/College");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

/**
 * Builds a JSON-serializable snapshot of real CampusConnect data that the
 * requesting user (req.user, populated from a verified JWT) is authorized
 * to see. The AI is later instructed to answer ONLY from this snapshot.
 *
 * IMPORTANT: every query here is scoped by req.user.userId / req.user.collegeId
 * taken from the authenticated session — never from anything the client sends
 * in the chat message itself. This is what keeps one student from asking the
 * assistant about another student's data, or about another college's events.
 */
async function buildContext(user) {
  const college = await College.findById(user.collegeId).select("name code");

  const base = {
    currentUser: {
      role: user.role,
      college: college ? college.name : "Unknown college",
    },
  };

  if (user.role === "STUDENT") {
    return { ...base, ...(await buildStudentContext(user)) };
  }

  if (user.role === "TEACHER") {
    return { ...base, ...(await buildTeacherContext(user)) };
  }

  if (user.role === "ADMIN") {
    return { ...base, ...(await buildAdminContext(user)) };
  }

  return base;
}

async function buildStudentContext(user) {
  const profile = await User.findById(user.userId).select("name email");

  const upcomingEvents = await Event.find({
    status: "APPROVED",
    collegeId: user.collegeId,
    date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  })
    .sort({ date: 1 })
    .limit(15)
    .select("title description date time location category mode capacity");

  // seats left, computed per event (capacity is optional / unlimited)
  const eventsWithSeats = await Promise.all(
    upcomingEvents.map(async (e) => {
      let seatsLeft = null;
      if (e.capacity) {
        const count = await Registration.countDocuments({ event: e._id, collegeId: user.collegeId });
        seatsLeft = Math.max(e.capacity - count, 0);
      }
      return {
        id: e._id.toString(),
        title: e.title,
        date: e.date,
        time: e.time,
        location: e.location,
        category: e.category,
        mode: e.mode,
        capacity: e.capacity ?? "unlimited",
        seatsLeft,
      };
    })
  );

  const myRegistrations = await Registration.find({ student: user.userId, collegeId: user.collegeId })
    .populate("event", "title date status location")
    .sort({ createdAt: -1 })
    .limit(25);

  const myAttendanceRecords = await Attendance.find({ student: user.userId, collegeId: user.collegeId });
  const attendanceByEvent = {};
  myAttendanceRecords.forEach((a) => {
    attendanceByEvent[a.event.toString()] = a.present;
  });

  const myEvents = myRegistrations
    .filter((r) => r.event)
    .map((r) => ({
      title: r.event.title,
      date: r.event.date,
      location: r.event.location,
      status: r.event.status,
      rollNo: r.rollNo,
      branch: r.branch,
      year: r.year,
      attendance:
        attendanceByEvent[r.event._id.toString()] === undefined
          ? "not marked yet"
          : attendanceByEvent[r.event._id.toString()]
          ? "present"
          : "absent",
    }));

  return {
    profile: profile ? { name: profile.name, email: profile.email } : {},
    upcomingCollegeEvents: eventsWithSeats,
    myRegisteredEvents: myEvents,
  };
}

async function buildTeacherContext(user) {
  const profile = await User.findById(user.userId).select("name email");

  const myEvents = await Event.find({ createdBy: user.userId, collegeId: user.collegeId })
    .sort({ createdAt: -1 })
    .limit(25)
    .select("title date status capacity");

  const myEventsWithStats = await Promise.all(
    myEvents.map(async (e) => {
      const registrationCount = await Registration.countDocuments({ event: e._id, collegeId: user.collegeId });
      const presentCount = await Attendance.countDocuments({ event: e._id, collegeId: user.collegeId, present: true });
      const absentCount = await Attendance.countDocuments({ event: e._id, collegeId: user.collegeId, present: false });
      return {
        id: e._id.toString(),
        title: e.title,
        date: e.date,
        status: e.status,
        capacity: e.capacity ?? "unlimited",
        registrationCount,
        attendanceMarked: presentCount + absentCount,
        presentCount,
        absentCount,
      };
    })
  );

  return {
    profile: profile ? { name: profile.name, email: profile.email } : {},
    myEvents: myEventsWithStats,
  };
}

async function buildAdminContext(user) {
  const [totalStudents, totalTeachers, pending, approved, rejected] = await Promise.all([
    User.countDocuments({ collegeId: user.collegeId, role: "STUDENT" }),
    User.countDocuments({ collegeId: user.collegeId, role: "TEACHER" }),
    Event.find({ collegeId: user.collegeId, status: "PENDING" })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title date createdBy"),
    Event.find({ collegeId: user.collegeId, status: "APPROVED" })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title date createdBy"),
    Event.find({ collegeId: user.collegeId, status: "REJECTED" })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title date createdBy"),
  ]);

  const totalEventCounts = {
    pending: await Event.countDocuments({ collegeId: user.collegeId, status: "PENDING" }),
    approved: await Event.countDocuments({ collegeId: user.collegeId, status: "APPROVED" }),
    rejected: await Event.countDocuments({ collegeId: user.collegeId, status: "REJECTED" }),
  };

  const mapEvent = (e) => ({
    title: e.title,
    date: e.date,
    createdBy: e.createdBy?.name || "Unknown",
  });

  return {
    stats: {
      totalStudents,
      totalTeachers,
      eventCounts: totalEventCounts,
    },
    recentPendingEvents: pending.map(mapEvent),
    recentApprovedEvents: approved.map(mapEvent),
    recentRejectedEvents: rejected.map(mapEvent),
  };
}

module.exports = { buildContext };
