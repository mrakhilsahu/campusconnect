const express = require("express");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", eventRoutes);
app.use("/api/registrations", require("./routes/registrations"));


app.get("/", (req, res) => {
  res.send("CampusConnect API running");
});

module.exports = app;
