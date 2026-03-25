const express = require("express");
const router = express.Router();

const { getMyRegistrations } = require("../controllers/registrationController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/my", protect, restrictTo("STUDENT"), getMyRegistrations);

module.exports = router;
