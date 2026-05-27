require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const natureData = require("./data/natureData");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    message: "Nature Core API Running",
    status: "secure",
    version: "2.0.0"
  });
});

app.get("/healthcheck", (req, res) => {
  res.json({
    server: "online",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/nature", (req, res) => {
  const search = req.query.search?.toLowerCase();

  if (!search) {
    return res.json(natureData);
  }

  const filtered = natureData.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.benefits.some((benefit) =>
        benefit.toLowerCase().includes(search)
      )
    );
  });

  res.json(filtered);
});

app.get("/nature/:id", (req, res) => {
  const item = natureData.find(
    (n) => n.id === parseInt(req.params.id)
  );

  if (!item) {
    return res.status(404).json({
      error: "Nature item not found"
    });
  }

  res.json(item);
});

app.get("/categories", (req, res) => {
  const categories = [
    ...new Set(natureData.map((item) => item.category))
  ];

  res.json(categories);
});

app.get("/types", (req, res) => {
  const types = [
    ...new Set(natureData.map((item) => item.type))
  ];

  res.json(types);
});

app.get("/medicine", (req, res) => {
  const medicine = natureData.filter(
    (item) => item.category === "Medicine"
  );

  res.json(medicine);
});

app.get("/nutrition", (req, res) => {
  const nutrition = natureData.filter(
    (item) => item.category === "Nutrition"
  );

  res.json(nutrition);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
