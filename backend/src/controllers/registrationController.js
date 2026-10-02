const Registration = require("../models/Registration");

exports.getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({
    student: req.user.userId,
    collegeId: req.user.collegeId,
  }).populate("event");

  const events = registrations
    .filter((registration) => registration.event)
    .map((registration) => ({
      ...registration.event.toObject(),
      rollNo: registration.rollNo,
      branch: registration.branch,
      year: registration.year,
    }));

  res.json({ events });
};
