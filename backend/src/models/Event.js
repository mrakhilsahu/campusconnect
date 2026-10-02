const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    location: {
      type: String,
      maxlength: 180,
      trim: true,
    },
    category: {
      type: String,
      enum: ["tech", "cultural", "sports", "workshop", ""],
      default: "",
    },
    mode: {
      type: String,
      enum: ["offline", "online", "hybrid"],
      default: "offline",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
    capacity: {
      type: Number,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

eventSchema.index({ collegeId: 1, status: 1, date: 1 });
eventSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Event", eventSchema);
