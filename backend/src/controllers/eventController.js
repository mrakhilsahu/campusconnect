const Event = require("../models/Event");
const Registration = require("../models/Registration");

/* ======================
   TEACHER CONTROLLERS
====================== */

// TEACHER: Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, capacity } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      capacity,
      createdBy: req.user.userId,
      collegeId: req.user.collegeId,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Event created successfully (Waiting for admin approval)",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// TEACHER: View own events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   ADMIN CONTROLLERS
====================== */

// ADMIN: View pending events
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "PENDING",
      collegeId: req.user.collegeId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: View approved events
exports.getApprovedEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find({
      status: "APPROVED",
      collegeId: req.user.collegeId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: View rejected events
exports.getRejectedEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find({
      status: "REJECTED",
      collegeId: req.user.collegeId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Approve event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    event.status = "APPROVED";
    await event.save();

    res.status(200).json({
      message: "Event approved successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Reject event
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "REJECTED";
    await event.save();

    res.status(200).json({
      message: "Event rejected successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   STUDENT CONTROLLERS
====================== */

// STUDENT: View approved events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "APPROVED",
      collegeId: req.user.collegeId,
    })
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// STUDENT: Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { phone, branch, year, rollNo } = req.body || {};

    if (!phone || !branch || !year || !rollNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "APPROVED") {
      return res
        .status(400)
        .json({ message: "Event not open for registration" });
    }

    const registration = await Registration.create({
      student: req.user.userId,
      event: event._id,
      collegeId: req.user.collegeId,
      phone,
      branch,
      year,
      rollNo,
    });

    res.status(201).json({
      message: "Registered successfully",
      registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
