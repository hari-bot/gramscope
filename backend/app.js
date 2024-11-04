const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const instagramRoutes = require("./routes/instagramRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/instagram", instagramRoutes);

module.exports = app;
