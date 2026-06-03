const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
