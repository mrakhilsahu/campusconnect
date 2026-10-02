const bcrypt = require("bcryptjs");
const User = require("../models/User");
const College = require("../models/College");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");
const { requireText, validateEmail } = require("../utils/validation");

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  collegeId: user.collegeId,
});

exports.signup = async (req, res) => {
  const name = requireText(req.body.name, "Name", 80);
  const email = validateEmail(req.body.email);
  const password = req.body.password;
  const collegeCode = requireText(
    req.body.collegeCode,
    "College code",
    30
  ).toUpperCase();
  const role = req.body.role || "STUDENT";

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 72
  ) {
    throw new AppError("Password must be between 6 and 72 characters", 400);
  }

  if (!["STUDENT", "TEACHER"].includes(role)) {
    throw new AppError("Choose a valid account type", 400);
  }

  const college = await College.findOne({
    code: collegeCode,
    isActive: true,
  });

  if (!college) throw new AppError("Invalid college code", 400);

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new AppError("Email already registered", 409);

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    collegeId: college._id,
  });

  res.status(201).json({
    token: generateToken(user),
    user: userResponse(user),
  });
};

exports.login = async (req, res) => {
  const email = validateEmail(req.body.email);
  const password = req.body.password;

  if (typeof password !== "string" || !password) {
    throw new AppError("Password is required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError("Invalid credentials", 401);

  res.json({
    token: generateToken(user),
    user: userResponse(user),
  });
};