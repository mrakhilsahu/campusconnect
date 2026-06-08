const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      collegeId: user.collegeId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
