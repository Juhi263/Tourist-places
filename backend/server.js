const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const placeRoutes = require("./routes/placeRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Make uploads folder public


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", placeRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
