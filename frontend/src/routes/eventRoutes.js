const express = require("express");
const router = express.Router();

const {
  createEvent,
  getMyEvents,
  getAllEvents,
  registerForEvent,
} = require("../controllers/eventController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// TEACHER
router.post("/", protect, restrictTo("TEACHER"), createEvent);

// 
router.get("/my-events", protect, restrictTo("TEACHER"), getMyEvents);

// STUDENT
router.get("/", protect, getAllEvents);
router.post("/:id/register", protect, restrictTo("STUDENT"), registerForEvent);

module.exports = router;