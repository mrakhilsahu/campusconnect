const Event = require("../models/Event");
const Registration = require("../models/Registration");
const AppError = require("../utils/AppError");
const { requireText, optionalText } = require("../utils/validation");

const ALLOWED_CATEGORIES = ["tech", "cultural", "sports", "workshop", ""];
const ALLOWED_MODES = ["offline", "online", "hybrid"];

const parseEventDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) throw new AppError("Enter a valid event date", 400);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) throw new AppError("Event date cannot be in the past", 400);
  return date;
};

exports.createEvent = async (req, res) => {
  const title = requireText(req.body.title, "Title", 120);
  const description = requireText(req.body.description, "Description", 3000);
  const location = optionalText(req.body.location, "Location", 180);
  const time = optionalText(req.body.time, "Time", 50);
  const date = parseEventDate(req.body.date);
  const category = req.body.category || "";
  const mode = req.body.mode || "offline";

  if (!ALLOWED_CATEGORIES.includes(category)) throw new AppError("Invalid category", 400);
  if (!ALLOWED_MODES.includes(mode)) throw new AppError("Invalid event mode", 400);

  let capacity;
  if (req.body.capacity !== undefined && req.body.capacity !== "") {
    capacity = Number(req.body.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000) {
      throw new AppError("Capacity must be a whole number between 1 and 100000", 400);
    }
  }

  const event = await Event.create({
    title, description, date, time, location, category, capacity, mode,
    createdBy: req.user.userId, collegeId: req.user.collegeId, status: "PENDING",
  });

  res.status(201).json({ message: "Event created successfully. Waiting for admin approval.", event });
};

exports.getMyEvents = async (req, res) => {
  const events = await Event.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
  res.json({ events });
};

const getAdminEvents = (status) => async (req, res) => {
  const events = await Event.find({ status, collegeId: req.user.collegeId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json({ events });
};

exports.getPendingEvents = getAdminEvents("PENDING");
exports.getApprovedEventsAdmin = getAdminEvents("APPROVED");
exports.getRejectedEventsAdmin = getAdminEvents("REJECTED");

const updateEventStatus = async (req, res, status) => {
  const event = await Event.findOne({ _id: req.params.id, collegeId: req.user.collegeId });
  if (!event) throw new AppError("Event not found", 404);
  if (event.status !== "PENDING") throw new AppError(`Event is already ${event.status.toLowerCase()}`, 409);

  event.status = status;
  await event.save();
  res.json({ message: `Event ${status.toLowerCase()}`, event });
};

exports.approveEvent = (req, res) => updateEventStatus(req, res, "APPROVED");
exports.rejectEvent = (req, res) => updateEventStatus(req, res, "REJECTED");

exports.getAllEvents = async (req, res) => {
  const { search = "", category = "", mode = "" } = req.query;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filter = { status: "APPROVED", collegeId: req.user.collegeId, date: { $gte: today } };

  if (category) {
    if (!ALLOWED_CATEGORIES.includes(category)) throw new AppError("Invalid category filter", 400);
    filter.category = category;
  }
  if (mode) {
    if (!ALLOWED_MODES.includes(mode)) throw new AppError("Invalid mode filter", 400);
    filter.mode = mode;
  }

  if (String(search).trim()) {
    const safeSearch = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
      { location: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const events = await Event.find(filter).populate("createdBy", "name email").sort({ date: 1, time: 1 });
  res.json({ events });
};

exports.registerForEvent = async (req, res) => {
  const phone = String(req.body.phone || "").trim();
  const branch = requireText(req.body.branch, "Branch / department", 100);
  const rollNo = requireText(req.body.rollNo, "Roll number", 50);
  const numericYear = Number(req.body.year);

  if (!/^\d{7,15}$/.test(phone)) throw new AppError("Enter a valid phone number", 400);
  if (!Number.isInteger(numericYear) || numericYear < 1 || numericYear > 6) {
    throw new AppError("Year must be between 1 and 6", 400);
  }

  const event = await Event.findOne({ _id: req.params.id, collegeId: req.user.collegeId, status: "APPROVED" });
  if (!event) throw new AppError("Event not found or registration is closed", 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(event.date) < today) throw new AppError("Registration is closed for this event", 400);

  if (event.registeredCount == null) {
    event.registeredCount = await Registration.countDocuments({ event: event._id });
    await event.save();
  }

  let reserved = false;
  if (event.capacity) {
    // Reserve the seat and increment the counter in one database operation.
    // This prevents two concurrent requests from taking the same last seat.
    const updated = await Event.findOneAndUpdate(
      { _id: event._id, status: "APPROVED", $expr: { $lt: ["$registeredCount", "$capacity"] } },
      { $inc: { registeredCount: 1 } },
      { new: true }
    );
    if (!updated) throw new AppError("Event is full. No seats available.", 409);
    reserved = true;
  } else {
    await Event.updateOne({ _id: event._id }, { $inc: { registeredCount: 1 } });
    reserved = true;
  }

  try {
    const registration = await Registration.create({
      student: req.user.userId, event: event._id, collegeId: req.user.collegeId,
      phone, branch, year: numericYear, rollNo,
    });
    res.status(201).json({ message: "Registered successfully", registration });
  } catch (error) {
    if (reserved) {
      await Event.updateOne({ _id: event._id, registeredCount: { $gt: 0 } }, { $inc: { registeredCount: -1 } });
    }
    throw error;
  }
};
