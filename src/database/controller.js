const { readFileSync } = require('fs');

// Utility function to read a JSON file
function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

// Get all plants, with optional filtering
function getPlants(query = {}) {
  const plants = readJson('src/database/collections/plants.json')['plants'];
  const batches = readJson('src/database/collections/batches.json')['batches'];

  let filteredPlants = plants;

  // Apply min_height filter if present
  if (query.min_height) {
    const minHeight = parseFloat(query.min_height);
    if (isNaN(minHeight) || minHeight < 0) {
      throw new Error('Invalid min_height parameter');
    }
    filteredPlants = filteredPlants.filter(plant => plant.height >= minHeight);
  }

  // Apply sold filter if present
  if (query.sold === 'true') {
    const soldBatchIds = batches
      .filter(batch => batch.status === 'sold')
      .map(batch => batch.batch_id);
    filteredPlants = filteredPlants.filter(plant => soldBatchIds.includes(plant.batch_id));
  }

  return filteredPlants;
}

// Get the price of a specific plant
function getPlantPrice(plantId) {
  const plants = readJson('src/database/collections/plants.json')['plants'];
  const batches = readJson('src/database/collections/batches.json')['batches'];
  const sales = readJson('src/database/collections/sales.json')['sales'];

  // Find the plant by plant_id
  const plant = plants.find(p => p.plant_id === plantId);
  if (!plant) {
    return null; // Plant not found
  }

  // Find the batch for this plant
  const batch = batches.find(b => b.batch_id === plant.batch_id);
  if (!batch || batch.status !== 'sold') {
    return { error: 'Plant is not sold' }; // Batch not sold
  }

  // Find the sales information for this batch
  const sale = sales.find(s => s.batch_id === batch.batch_id);
  if (!sale) {
    return null; // No price found for this batch
  }

  // Calculate price per plant
  const batchPlants = plants.filter(p => p.batch_id === batch.batch_id);
  const pricePerPlant = (sale.batch_price / batchPlants.length).toFixed(2);
  
  return { price: pricePerPlant };
}

function getBatches() {
  return readJson('src/database/collections/batches.json')['batches'];
}

module.exports = { getPlants, getPlantPrice, getBatches };
