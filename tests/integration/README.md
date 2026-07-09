## Cross-service integration tests

Should be run as part of CI.

Requires the full stack (catalog, inventory, and plp-bff):

```bash
docker-compose up
cd tests/integration && npm install && npm run test:integration
```

Tests `GET /products/in-stock` on the PLP BFF, which merges catalog and inventory data.
