const express = require("express");
const router = express.Router();

const {
  getRegisteredStudents,
  markAttendance,
  getMyAttendance,
} = require("../controllers/attendanceController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// Teacher: view registered students + their attendance status
router.get(
  "/:eventId/students",
  protect,
  restrictTo("TEACHER"),
  getRegisteredStudents
);

// Teacher: mark one student's attendance
router.patch(
  "/:eventId/students/:studentId",
  protect,
  restrictTo("TEACHER"),
  markAttendance
);

// Student: check my own attendance for an event
router.get(
  "/:eventId/my",
  protect,
  restrictTo("STUDENT"),
  getMyAttendance
);

module.exports = router;
