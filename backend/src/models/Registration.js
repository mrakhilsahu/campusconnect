const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    year: {
      type: Number,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

// One registration per student per event
registrationSchema.index({ student: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1 });

module.exports = mongoose.model("Registration", registrationSchema);
