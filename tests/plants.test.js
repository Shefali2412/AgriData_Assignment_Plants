const request = require('supertest');
const app = require('../src/app');


describe('GET /plants', () => {
  it('should return all plants when no parameters are provided', async () => {
    const res = await request(app).get('/plants');
    expect(res.statusCode).toBe(200);
    // When you alter the plant collection, feel free to update this number.
    expect(res.body.length).toEqual(11);
  });

  it('should return plants with height >= 1.0 when min_height is set', async () => {
    const res = await request(app).get('/plants?min_height=1.0');
    expect(res.statusCode).toBe(200);
    const allHeightsAbove1 = res.body.every(plant => plant.height >= 1.0);
    expect(allHeightsAbove1).toBe(true);
  });

  it('should return only sold plants when sold=true is set', async () => {
    const res = await request(app).get('/plants?sold=true');
    expect(res.statusCode).toBe(200);
    // Expect plants from batches with status 'sold'
    const allPlantsFromSoldBatches = res.body.every(plant =>
      ['B0123', 'B0394'].includes(plant.batch_id)
    );
    expect(allPlantsFromSoldBatches).toBe(true);
  });

  it('should return an error if min_height is negative', async () => {
    const res = await request(app).get('/plants?min_height=-1');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Invalid min_height parameter');
  });

  it('should return an error if min_height is not a valid float', async () => {
    const res = await request(app).get('/plants?min_height=abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Invalid min_height parameter');
  });
});

describe('GET /plants/:plant_id/price', () => {
  it('should return the price of a plant when the plant is sold', async () => {
    const res = await request(app).get('/plants/p1/price');
    expect(res.statusCode).toBe(200);
    expect(parseFloat(res.body.price)).toEqual(30.00); // Example: B0394 batch price is 120 / 4 plants
  });

  it('should return an error if the plant is not sold', async () => {
    const res = await request(app).get('/plants/p5/price'); // Plant from growing batch B0190
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Plant is not sold');
  });

  it('should return 404 if the plant_id does not exist', async () => {
    const res = await request(app).get('/plants/invalid_id/price');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual('Plant not found');
  });
});
