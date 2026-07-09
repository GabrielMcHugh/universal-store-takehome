# Universal Store Take Home Assessment

This project is a take-home assignment for a developer position at Universal Store. It implements a product landing page backed by four services, orchestrated via Docker Compose:

| Service | Port | Role |
|---------|------|------|
| Catalog | 3000 | Product metadata |
| Inventory | 4000 | Stock quantities |
| PLP BFF | 5000 | Merges catalog + inventory for the frontend |
| Product Landing Page | 8080 | React UI |

```bash
docker compose up --build
```

- **PLP:** http://localhost:8080
- **Design decisions & reasoning:** see [DECISIONS.md](./DECISIONS.md)

## Catalog

REST API for product catalog data. See [services/catalog/README.md](./services/catalog/README.md).

- `GET /catalog` — all catalog items
- `GET /catalog/:sku` — single item by SKU

## Inventory

REST API for stock quantities. See [services/inventory/README.md](./services/inventory/README.md).

- `GET /inventory` — all inventory items
- `GET /inventory/:sku` — single item by SKU

## PLP BFF

Backend-for-frontend that merges catalog and inventory into in-stock products. See [services/plp-bff/README.md](./services/plp-bff/README.md).

- `GET /products/in-stock` — products with quantity > 0

## Product Landing Page

React application that consumes the BFF. Displays image, title, SKU, price, and remaining quantity for each in-stock product.

## Tasks to complete
- [x] Create a model for Catalog items.
- [x] Implement seed.ts so that it populates the database.
- [x] Implement the catalog service api so that it returns a list of all catalog items using the model you've created.
- [x] Update the PLP service to query your new catalog service on load.
- [x] Render the image, title, sku, remaining quantity and price of each item in the catalog if it has more than 0 stock.

## Assessment Criteria
- [ ] Clean, well-structured TypeScript code following best practices and conventions.
- [ ] Follow a test driven approach
- [ ] An elegant solution that minimizes tight coupling.
- [ ] Clear and comprehensive documentation of code and decisions made. → [DECISIONS.md](./DECISIONS.md)
- [ ] Type annotations and strict typing.

## Afterwards
- [x] More comprehensive testing (DB down, invalid input, cors, e2e on docker compose)
- [x] OpenAPI docs for endpoints
- [x] Cyber security: rate limiting, query sanitisation, validation, authentication and authorisation
    - Essential Eight/OWASPth
    - Essential 8 #4 user application hardening: input validation and query sanitisation
- [x] InStock service dedicated API
- [x] Integration tests as part of CI/Github Actions

## Production consideration
RateLimiting
- Rate limiting keys on client IP via req.ip. In production, a reverse proxy sits in front of the API, so Express must be configured with trust proxy to read the real client IP from X-Forwarded-For; otherwise all traffic appears to come from one address and per-client limits fail.
- Rate limits need a shared store (Redis) because the requests would be split across multiple containers behind a load balancer
This would ensure that the limit is enforced globally regardless of who runs the request
- Scope per api vs per api key: scoping by ip adress is good for anonymous public capis, but might not be good for authicated partnerts (such as a backend or a some other legitimate partner) and some other conditions (mobile carrier nat, corporate office with one ip)
In this case you would need an API key and you can rate limit by that identity
-If we separate the plp into BFF then we would have a separate route for traffic from it
- The primary rate limiter should be on the api gateway.
Heartbeat
- Added stubs, but would need for service monitoring
Logging
- implemented a basic logger but really would hook it up to a service like sumologic or datadog
Swagger
- protect or disable Swagger: it exposes your full API surface (routes, schemas, errors), which helps attackers. Common approaches are basic auth on /docs, only enabling it in non-prod, or keeping it on an internal network/VPN.

