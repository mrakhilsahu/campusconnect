const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// Teacher: Get all registered students for an event
exports.getRegisteredStudents = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the teacher who created this event can view
    if (event.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get all registrations for this event
    const registrations = await Registration.find({
      event: req.params.eventId,
    }).populate("student", "name email");

    // Get already marked attendance
    const attendanceRecords = await Attendance.find({
      event: req.params.eventId,
    });

    // Map attendance by student id for easy lookup
    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      attendanceMap[record.student.toString()] = record.present;
    });

    const students = registrations.map((reg) => ({
      studentId: reg.student._id,
      name: reg.student.name,
      email: reg.student.email,
      rollNo: reg.rollNo,
      branch: reg.branch,
      year: reg.year,
      present: attendanceMap[reg.student._id.toString()] ?? null,
    }));

    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Teacher: Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { present } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only creator teacher can mark attendance
    if (event.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Upsert: update if exists, create if not
    const attendance = await Attendance.findOneAndUpdate(
      { event: eventId, student: studentId },
      {
        event: eventId,
        student: studentId,
        markedBy: req.user.userId,
        collegeId: req.user.collegeId,
        present,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Attendance marked", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Student: Get my attendance for an event
exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      event: req.params.eventId,
      student: req.user.userId,
    });

    if (!attendance) {
      return res.status(200).json({ present: null });
    }

    res.status(200).json({ present: attendance.present });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
