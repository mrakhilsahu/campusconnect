const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

router.get("/admin-only", protect, restrictTo("ADMIN"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
