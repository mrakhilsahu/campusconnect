const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

app.get("/", (req, res) => res.send("CampusConnect API running"));

module.exports = app;
