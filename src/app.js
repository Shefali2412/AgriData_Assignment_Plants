const express = require('express');
const { getPlants, getPlantPrice, getBatches } = require('./database/controller.js');

const app = express();

// Endpoint #1: GET /plants with optional query parameters
app.get('/plants', (req, res) => {
  try {
    const result = getPlants(req.query); // Pass query parameters to the controller
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint #2: GET /plants/:plant_id/price
app.get('/plants/:plant_id/price', (req, res) => {
  const plantId = req.params.plant_id;
  const result = getPlantPrice(plantId);

  if (!result) {
    return res.status(404).json({ message: 'Plant not found' });
  } else if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.status(200).json(result);
});

// Bonus Endpoint: GET /batches
app.get('/batches', (req, res) => {
  const result = getBatches();
  res.status(200).json(result);
});

module.exports = app;
