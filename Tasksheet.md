# Universal Store Take Home Assessment
This project is a take-home assignment for a developer position at Universal Store. This repo contains three docker containers for three different microservices.
- Catalog
- Inventory
- Frontend

All three services have been setup and configured to run via docker-compose.
```
docker-compose up --build
```

## Catalog
The catalog service is a simple REST API that provides a list of products. The service is written in Node.js and uses Express.js as the web framework. The service is configured to run on port 3000.
The service contains two main files:
- app.ts: This file runs the express server that serves the API. You'll need to update it to implement a new /catalog endpoint
- seed.ts: This file inserts test data into the database. You'll need to update it to inject data matching whatever model you choose for the catalog.
### The catalog service provides the following endpoints that need to be implemented:
- GET /catalog - Returns a list of products
## Inventory
The inventory service is a simple REST API that provides the inventory of products. The service is written in Node.js and uses Express.js as the web framework. The service is configured to run on port 4000.
- app.ts: This file runs the express server that serves the API. This has already been implemented.
- seed.ts: This file inserts test data into the database. This has already been implemented.
### The inventory service provides the following endpoints:
- GET /inventory - Returns a list of inventory items
- GET /inventory/:sku - Returns a single inventory item by sku
## Product Landing Page
The frontend service is a simple React application that consumes the Catalog and Inventory services. The service is configured to run on port 8080.
The Product Landing Page service needs to be updated to display a list of products that are in stock. This will require querying both the catalog and inventory services then aggregating the data to determine the eligibility.

## Tasks to complete
- [x] Create a model for Catalog items.
- [x] Implement seed.ts so that it populates the database.
- [x] Implement the catalog service api so that it returns a list of all catalog items using the model you've created.
- [x] Update the PLP service to query your new catalog service on load.
- [x] Render the image, title, sku, remaining quantity and price of each item in the catalog if it has more than 0 stock.

## Assessment Criteria
- [x] Clean, well-structured TypeScript code following best practices and conventions: 
Factory pattern for Express apps; pure merge function in BFF; typed models and explicit response shapes; shared validation modules
- [x] Follow a test driven approach:
Catalog and inventory endpoints were test-first (supertest); BFF merge logic has unit tests; layered integration, Postman, and E2E coverage
- [x] An elegant solution that minimizes tight coupling: 
BFF isolates the frontend from catalog/inventory; each service owns its domain type; merge logic lives in one place
- [x] Clear and comprehensive documentation of code and decisions made:
In the processs ...
- [x] Type annotations and strict typing:
TypeScript throughout; Zod schemas on frontend and backend; lean, explicit API responses instead of raw Mongo serialisation

---

## Afterwards
- [x] More comprehensive testing (DB down, invalid input, cors, e2e on docker compose)
- [x] OpenAPI docs for endpoints
- [x] Cyber security: rate limiting, query sanitisation, validation, authentication and authorisation
    - Essential Eight/OWASPth
    - Essential 8 #4 user application hardening: input validation and query sanitisation
- [x] InStock service dedicated API
- [x] Integration tests as part of CI/Github Actions