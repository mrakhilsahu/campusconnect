const Registration = require("../models/Registration");

// Student: get my registered events
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user.userId,
    }).populate("event");

    const events = registrations
      .filter((r) => r.event) // skip if event was deleted
      .map((r) => ({
        ...r.event.toObject(),
        rollNo: r.rollNo,
        branch: r.branch,
        year: r.year,
      }));

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
