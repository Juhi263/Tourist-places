const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  cost: Number,
  category: String, // Example: Historical, Beach, Hill Station
  rating: Number,
  image: String, // Image URL
});

module.exports = mongoose.model("Place", PlaceSchema);
