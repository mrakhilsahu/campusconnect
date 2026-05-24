const Event = require("../models/Event");
const Registration = require("../models/Registration");

/* ===================== TEACHER ===================== */

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, capacity, mode } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "Title, description, date and location are required" });
    }

    // Date must not be in the past
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      return res.status(400).json({ message: "Event date cannot be in the past" });
    }

    // Capacity must be a positive number if provided
    if (capacity && (isNaN(capacity) || Number(capacity) < 1)) {
      return res.status(400).json({ message: "Capacity must be a positive number" });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: eventDate,
      time,
      location: location.trim(),
      category,
      capacity: capacity ? Number(capacity) : undefined,
      mode,
      createdBy: req.user.userId,
      collegeId: req.user.collegeId,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Event created successfully. Waiting for admin approval.",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY EVENTS (Teacher)
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== ADMIN ===================== */

// GET PENDING EVENTS
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
    res.status(500).json({ message: "Server error" });
  }
};

// GET APPROVED EVENTS (Admin view)
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
    res.status(500).json({ message: "Server error" });
  }
};

// GET REJECTED EVENTS (Admin view)
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
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE EVENT
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // College isolation check
    if (event.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    event.status = "APPROVED";
    await event.save();

    res.status(200).json({ message: "Event approved", event });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// REJECT EVENT
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // College isolation check (was missing before)
    if (event.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    event.status = "REJECTED";
    await event.save();

    res.status(200).json({ message: "Event rejected", event });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== STUDENT ===================== */

// GET ALL APPROVED EVENTS
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
    res.status(500).json({ message: "Server error" });
  }
};

// REGISTER FOR EVENT
exports.registerForEvent = async (req, res) => {
  try {
    const { phone, branch, year, rollNo } = req.body;

    if (!phone || !branch || !year || !rollNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate year is between 1 and 6
    if (isNaN(year) || Number(year) < 1 || Number(year) > 6) {
      return res.status(400).json({ message: "Year must be between 1 and 6" });
    }

    // Basic phone validation - must be digits, 7 to 15 chars
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Enter a valid phone number" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "APPROVED") {
      return res.status(400).json({ message: "Event is not open for registration" });
    }

    // Capacity check — if capacity is set, count current registrations
    if (event.capacity) {
      const count = await Registration.countDocuments({ event: event._id });
      if (count >= event.capacity) {
        return res.status(400).json({ message: "Event is full. No seats available." });
      }
    }

    const registration = await Registration.create({
      student: req.user.userId,
      event: event._id,
      collegeId: req.user.collegeId,
      phone,
      branch: branch.trim(),
      year: Number(year),
      rollNo: rollNo.trim(),
    });

    res.status(201).json({ message: "Registered successfully", registration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
