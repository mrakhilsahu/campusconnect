const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(". ");
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  if (err?.code === 11000) {
    statusCode = 409;

    const fields = Object.keys(
      err.keyPattern || err.keyValue || {}
    );

    message = fields.includes("email")
      ? "Email already registered"
      : "A record with these details already exists";
  }

  if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  if (err.name === "MongoServerSelectionError") {
    statusCode = 503;
    message = "Database is temporarily unavailable";
  }

  if (statusCode >= 500) {
    console.error(
      `[${req.method} ${req.originalUrl}]`,
      err.stack || err
    );

    if (process.env.NODE_ENV === "production") {
      message = "Something went wrong. Please try again later.";
    }
  }

  const response = { message };

  if (err instanceof AppError && err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;