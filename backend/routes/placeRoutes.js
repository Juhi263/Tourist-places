const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// Dummy data with image URLs
const placesData = [
  {
    name: "Panchkund Chattriya",
    location: "Jodhpur, India",
    description: "A historical site features collection of 46 cenotophs(chhatris).",
    cost: 0,
    category: "Historical",
    rating: 4.6,
    image: "panchkund.jpg",
  },
  {
    name: "Ghanta Ghar",
    location: "Jodhpur, India",
    description: "The clock tower of jodhpur",
    cost: 25,
    category: "Historical",
    rating: 4.3,
    image: "ghanta ghar.jpg",
  },
  {
    name: "Mehrangarh Fort",
    location: "Jodhpur, India",
    description: "the fort of jodhpur .",
    cost: 200,
    category: "Fort",
    rating: 4.7,
    image: "mehrangarh.jpg",
  },
  {
    name: "Jaswant Thada",
    location: "Jodhpur, India",
    description: "taj mahal of marwar.",
    cost: 30,
    category: "Historical",
    rating: 4.6,
    image: "jaswant thada.jpeg",
  },
  {
    name: "Toorji ka Jhalra",
    location: "Jodhpur, India",
    description: "historical stepwell.",
    cost: 0,
    category: "Historical",
    rating: 4.3,
    image: "toorji.jpeg",
  },
  {
    name: "Surpura Bandh",
    location: "Jodhpur, India",
    description: "Water reservoir.",
    cost: 0,
    category: "Dam",
    rating: 4.6,
    image: "surpura.jpeg",
  },
  {
    name: "Pachetia Hill",
    location: "Jodhpur, India",
    description: "Notable elevation in jodhpur, with scenic views and hiking trails.",
    cost: 0,
    category: "Hill",
    rating: 4.6,
    image: "pachetia.jpeg",
  },
  {
    name: "Mandore Garden",
    location: "Jodhpur, India",
    description: "Historic site which served as capital of marwar region.",
    cost: 50,
    category: "Historical",
    rating: 4.6,
    image: "mandore.jpg",
  },
  {
    name: "Blue City",
    location: "Jodhpur, India",
    description: "Old City or Town known for the blue-painted houses.",
    cost: 0,
    category: "Town",
    rating: 4.6,
    image: "blue city.jpg",
  },
  {
    name: "Umaid Bhawan",
    location: "Jodhpur, India",
    description: "Architectural heritage also known as Chittar Palace.",
    cost: 30,
    category: "Historical",
    rating: 4.6,
    image: "umaid bhawan.jpg",
  },
  {
    name: "Tekri Hill",
    location: "Jodhpur, India",
    description: "Gives panaromic view of city and fort with trekking.",
    cost: 0,
    category: "Hill",
    rating: 4.6,
    image: "tekri.jpeg",
  },
];

// API to add places (Avoid Duplicates)
router.post("/populate", async (req, res) => {
  try {
    let addedCount = 0;
    
    for (const place of placesData) {
      const exists = await Place.findOne({ name: place.name }); // Check if place already exists
      if (!exists) {
        await Place.create(place);
        addedCount++;
      }
    }

    if (addedCount === 0) {
      return res.status(400).json({ message: "All places already exist. No new data added!" });
    }

    res.status(201).json({ message: `${addedCount} new places added successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get filtered places
router.get("/places", async (req, res) => {
  try {
    let query = {};

    if (req.query.cost) {
      query.cost = { $lte: Number(req.query.cost) };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    const places = await Place.find(query);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
