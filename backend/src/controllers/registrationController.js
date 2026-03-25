const Registration = require("../models/Registration");

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user.userId,
    }).populate("event");
  

    res.status(200).json({
      events: registrations.map((r) => r.event),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    
  }
  
};

