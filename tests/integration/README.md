## Cross-service integration tests

Requires catalog and inventory running:

```bash
docker-compose up catalog inventory
cd tests/integration && npm install && npm run test:integration

### What's tested

- The merged output of `catalog` and `inventory` endpoints, ensuring only products with available stock are included.
- That every SKU in `inventory` is present in `catalog` (validating no inventory exists for nonexistent products).

These checks ensure basic cross-service data consistency and integrity.