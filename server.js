require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   SECURITY MIDDLEWARE
========================= */

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later."
  }
});

app.use(limiter);

/* =========================
   NATURE DATABASE
========================= */

const natureData = [
  {
    name: "Neem",
    type: "Leaf",
    category: "Medicine",
    benefits: [
      "Antibacterial",
      "Skin treatment",
      "Immune support"
    ]
  },
  {
    name: "Ginger",
    type: "Root",
    category: "Medicine",
    benefits: [
      "Digestion",
      "Cold relief",
      "Anti-inflammatory"
    ]
  },
  {
    name: "Garlic",
    type: "Bulb",
    category: "Medicine",
    benefits: [
      "Heart health",
      "Immune support",
      "Blood circulation"
    ]
  },
  {
    name: "Rice",
    type: "Food",
    category: "Nutrition",
    benefits: [
      "Energy source",
      "Carbohydrates",
      "Nutrition"
    ]
  },
  {
    name: "Beans",
    type: "Food",
    category: "Nutrition",
    benefits: [
      "Protein",
      "Fiber",
      "Energy"
    ]
  },
  {
    name: "Moringa",
    type: "Leaf",
    category: "Medicine",
    benefits: [
      "Blood sugar support",
      "Vitamins",
      "Immune boosting"
    ]
  },
  {
    name: "Turmeric",
    type: "Root",
    category: "Medicine",
    benefits: [
      "Anti-inflammatory",
      "Pain relief",
      "Antioxidant"
    ]
  },
  {
    name: "Onion",
    type: "Bulb",
    category: "Nutrition",
    benefits: [
      "Heart support",
      "Digestion",
      "Immune support"
    ]
  }
];

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Nature Core API Running",
    status: "secure",
    version: "1.0.0",
    server: "online",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/healthcheck", (req, res) => {
  res.json({
    server: "online",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* =========================
   GET ALL NATURE DATA
========================= */

app.get("/nature", (req, res) => {
  const search = req.query.search;

  if (search) {
    const filtered = natureData.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.benefits.join(" ").toLowerCase().includes(search.toLowerCase())
      );
    });

    return res.json(filtered);
  }

  res.json(natureData);
});

/* =========================
   GET MEDICINE DATA
========================= */

app.get("/medicine", (req, res) => {
  const medicine = natureData.filter(
    (item) => item.category === "Medicine"
  );

  res.json(medicine);
});

/* =========================
   GET NUTRITION DATA
========================= */

app.get("/nutrition", (req, res) => {
  const nutrition = natureData.filter(
    (item) => item.category === "Nutrition"
  );

  res.json(nutrition);
});

/* =========================
   GET CATEGORIES
========================= */

app.get("/categories", (req, res) => {
  const categories = [
    ...new Set(natureData.map((item) => item.category))
  ];

  res.json(categories);
});

/* =========================
   GET TYPES
========================= */

app.get("/types", (req, res) => {
  const types = [
    ...new Set(natureData.map((item) => item.type))
  ];

  res.json(types);
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
