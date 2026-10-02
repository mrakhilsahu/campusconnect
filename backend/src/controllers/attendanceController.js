const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const AppError = require("../utils/AppError");

const getOwnedEvent = async (eventId, user) => {
  const event = await Event.findOne({
    _id: eventId,
    collegeId: user.collegeId,
  });

  if (!event) throw new AppError("Event not found", 404);

  if (event.createdBy.toString() !== user.userId) {
    throw new AppError("Access denied", 403);
  }

  return event;
};

exports.getRegisteredStudents = async (req, res) => {
  await getOwnedEvent(req.params.eventId, req.user);

  const [registrations, attendanceRecords] = await Promise.all([
    Registration.find({
      event: req.params.eventId,
      collegeId: req.user.collegeId,
    }).populate("student", "name email"),

    Attendance.find({
      event: req.params.eventId,
      collegeId: req.user.collegeId,
    }),
  ]);

  const attendanceMap = new Map(
    attendanceRecords.map((record) => [
      record.student.toString(),
      record.present,
    ])
  );

  const students = registrations
    .filter((registration) => registration.student)
    .map((registration) => ({
      studentId: registration.student._id,
      name: registration.student.name,
      email: registration.student.email,
      rollNo: registration.rollNo,
      branch: registration.branch,
      year: registration.year,
      present:
        attendanceMap.get(registration.student._id.toString()) ?? null,
    }));

  res.json({ students });
};

exports.markAttendance = async (req, res) => {
  const { eventId, studentId } = req.params;

  if (typeof req.body.present !== "boolean") {
    throw new AppError("'present' must be true or false", 400);
  }

  await getOwnedEvent(eventId, req.user);

  const registration = await Registration.findOne({
    event: eventId,
    student: studentId,
    collegeId: req.user.collegeId,
  });

  if (!registration) {
    throw new AppError(
      "This student is not registered for the event",
      400
    );
  }

  const attendance = await Attendance.findOneAndUpdate(
    {
      event: eventId,
      student: studentId,
    },
    {
      event: eventId,
      student: studentId,
      markedBy: req.user.userId,
      collegeId: req.user.collegeId,
      present: req.body.present,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  res.json({
    message: "Attendance marked",
    attendance,
  });
};

exports.getMyAttendance = async (req, res) => {
  const attendance = await Attendance.findOne({
    event: req.params.eventId,
    student: req.user.userId,
    collegeId: req.user.collegeId,
  });

  res.json({
    present: attendance?.present ?? null,
  });
};