const express = require("express");
const { chat } = require("../controllers/aiController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.post("/chat", protect, restrictTo("STUDENT", "TEACHER", "ADMIN"), asyncHandler(chat));
module.exports = router;
