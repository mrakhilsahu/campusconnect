const bcrypt = require("bcryptjs");
const User = require("../models/User");
const College = require("../models/College");
const generateToken = require("../utils/generateToken");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, collegeCode } = req.body;

    // Basic field check
    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Block ADMIN role from self-registration
    if (role === "ADMIN") {
      return res.status(403).json({ message: "Admin accounts cannot be created via signup" });
    }

    const college = await College.findOne({ code: collegeCode.toUpperCase() });
    if (!college || !college.isActive) {
      return res.status(400).json({ message: "Invalid college code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "STUDENT",
      collegeId: college._id,
    });

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
