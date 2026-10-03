const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError(
      "Server authentication is not configured",
      500
    );
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select(
    "role collegeId isActive"
  );

  if (!user || !user.isActive) {
    throw new AppError("Invalid or expired token", 401);
  }

  req.user = {
    userId: user._id.toString(),
    role: user.role,
    collegeId: user.collegeId.toString(),
  };

  next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError("Access denied", 403);
  }

  next();
};