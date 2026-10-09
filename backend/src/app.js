const express = require("express");
const cors = require("cors");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => res.json({ name: "CampusConnect API", status: "ok" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "CampusConnect API" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
