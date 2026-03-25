const express = require("express");
const router = express.Router();

const {
  createEvent,
  getMyEvents,

  // admin
  getPendingEvents,
  getApprovedEventsAdmin,
  getRejectedEventsAdmin,
  approveEvent,
  rejectEvent,

  // student
  getAllEvents,
  registerForEvent,
} = require("../controllers/eventController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

/*TEACHER ROUTES */
router.post("/", protect, restrictTo("TEACHER"), createEvent);
router.get("/my", protect, restrictTo("TEACHER"), getMyEvents);

/* ADMIN ROUTES */
router.get("/pending", protect, restrictTo("ADMIN"), getPendingEvents);
router.get("/approved", protect, restrictTo("ADMIN"), getApprovedEventsAdmin);
router.get("/rejected", protect, restrictTo("ADMIN"), getRejectedEventsAdmin);

router.patch("/:id/approve", protect, restrictTo("ADMIN"), approveEvent);
router.patch("/:id/reject", protect, restrictTo("ADMIN"), rejectEvent);

/* STUDENT ROUTES*/
router.get("/", protect, getAllEvents);
router.post("/:id/register", protect, restrictTo("STUDENT"), registerForEvent);

module.exports = router;
