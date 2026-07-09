## Cross-service integration tests

Should be run as part of CI



Requires catalog and inventory running:

```bash
docker-compose up catalog inventory
cd tests/integration && npm install && npm run test:integration
