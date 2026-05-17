const express = require("express");
const cors = require("cors");

const app = express();

// ✅ FIX CORS (ALLOW ALL LOCAL PORTS)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ROUTES
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrations"));

app.get("/", (req, res) => {
  res.send("CampusConnect API running");
});

module.exports = app;