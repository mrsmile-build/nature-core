require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

const natureData = require("./data/natureData");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

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
    timestamp: new Date()
  });
});

app.get("/nature", (req, res) => {

  const search = req.query.search?.toLowerCase();

  if (!search) {
    return res.json(natureData);
  }

  const results = natureData.filter(item =>

    item.name.toLowerCase().includes(search) ||

    item.category.toLowerCase().includes(search) ||

    item.type.toLowerCase().includes(search) ||

    item.conditions.some(condition =>
      condition.toLowerCase().includes(search)
    ) ||

    item.benefits.some(benefit =>
      benefit.toLowerCase().includes(search)
    ) ||

    item.properties.some(property =>
      property.toLowerCase().includes(search)
    )
  );

  res.json(results);
});

app.get("/nature/:id", (req, res) => {

  const item = natureData.find(
    plant => plant.id === parseInt(req.params.id)
  );

  if (!item) {
    return res.status(404).json({
      error: "Plant not found"
    });
  }

  res.json(item);
});

app.get("/premium", (req, res) => {

  const premiumPlants = natureData.filter(
    item => item.level === "premium"
  );

  res.json(premiumPlants);
});

app.get("/free", (req, res) => {

  const freePlants = natureData.filter(
    item => item.level === "free"
  );

  res.json(freePlants);
});

app.get("/conditions", (req, res) => {

  const conditions = [];

  natureData.forEach(item => {
    item.conditions.forEach(condition => {
      if (!conditions.includes(condition)) {
        conditions.push(condition);
      }
    });
  });

  res.json(conditions);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
