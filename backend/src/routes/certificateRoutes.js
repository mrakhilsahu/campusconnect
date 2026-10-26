const express = require("express");
const { issueCertificate, verifyCertificate } = require("../controllers/certificateController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.get("/verify/:certificateId", asyncHandler(verifyCertificate));
router.get("/:eventId", protect, restrictTo("STUDENT"), asyncHandler(issueCertificate));
module.exports = router;
