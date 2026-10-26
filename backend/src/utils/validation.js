const AppError = require("./AppError");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requireText = (value, field, max = 200) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`${field} is required`, 400);
  }
  if (value.trim().length > max) {
    throw new AppError(`${field} must be ${max} characters or fewer`, 400);
  }
  return value.trim();
};

const optionalText = (value, field, max = 200) => {
  if (value === undefined || value === null || value === "") return "";
  return requireText(value, field, max);
};

const validateEmail = (value) => {
  const email = requireText(value, "Email", 120).toLowerCase();
  if (!EMAIL_REGEX.test(email)) throw new AppError("Enter a valid email address", 400);
  return email;
};

module.exports = { requireText, optionalText, validateEmail };
