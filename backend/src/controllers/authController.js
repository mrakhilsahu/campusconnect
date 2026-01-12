const bcrypt = require("bcryptjs");
const User = require("../models/User");
const College = require("../models/College");
const generateToken = require("../utils/generateToken");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, collegeCode } = req.body;

    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const college = await College.findOne({ code: collegeCode });

    if (!college || !college.isActive) {
      return res.status(400).json({ message: "Invalid college code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "STUDENT",
      collegeId: college._id,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
