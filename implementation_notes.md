# Write your design choices here
## Project Overview
This project implemnts a simple Express server with APIs to manage plant information using three JSON files as a mock database: `plants.json`, `batches.json`, and `sales.json`.

## API Endpoints
1. **GET /plants**
   - Returns a list of plants.
   - Supports query parameters: `min_height` (float) and `sold` (boolean).
   
2. **GET /plants/:plant_id/price**
   - Returns the selling price of a specified plant.   

## Implementation Steps

1. **Setup Express Server**
   - Created an Express server in `app.js` with routes for the specified endpoints.

2. **Data Retrieval**
   - Implemented `controller.js` to read data from the JSON files using `fs` module.
   - Functions created: `getPlants`, `getSales`, `getBatches`.

3. **Add Query Parameter Handling**
   - Implemented filtering logic in the `/plants` endpoint to handle `min_height` and `sold` query parameters.

4. **Error Handling**
   - Added appropriate error handling for invalid input for `min_height` and responses for plant price retrieval.

5. **Testing Setup**
   - **Testing Frameworks**: Jest and Supertest were chosen for testing.
   - **Installation**:
     ```bash
     npm install jest supertest
     ```

6. **Write Tests**
   - Created test cases in `plants.test.js` for both endpoints to validate expected behavir:
     - Fetching all plants.
     - Filtering by `min_height`.
     - Filtering sold plants.
     - Fetching plant price for sold and unsold plants.
     - Handling invalid plant IDs.

7. **Run Tests**
   - To run tests, used the following command:
     ```bash
     npm run test
     ```