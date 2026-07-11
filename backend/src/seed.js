const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const College = require("./models/College");
const User = require("./models/User");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let college = await College.findOne({ code: "DEMO" });

    if (!college) {
      college = await College.create({
        name: "Demo College",
        code: "DEMO",
      });

      console.log("College created");
    }

    const adminExists = await User.findOne({
      email: "admin@demo.com",
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: "admin@demo.com",
        password: hashedPassword,
        role: "ADMIN",
        collegeId: college._id,
      });

      console.log("Admin created");
    }

    console.log("Seed completed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();