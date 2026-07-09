# Product Landing Page

React app that displays in-stock products. Runs on port **8080** via Docker Compose.

On load, it fetches merged product data from the PLP BFF (`GET /products/in-stock`) and renders a card grid with image, title, SKU, price, and remaining quantity.

See the root [DECISIONS.md](../../DECISIONS.md) for architecture and design rationale.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_BFF_URL` | `http://localhost:5000` | Base URL for the PLP BFF |

## Local development

```bash
npm install
npm start    # http://localhost:3000 (standalone, without Docker)
npm test
```

When running outside Docker, ensure the BFF is reachable at `REACT_APP_BFF_URL`.

With the full stack:

```bash
docker compose up --build
# PLP at http://localhost:8080
```

## Project structure

| Path | Purpose |
|------|---------|
| `src/api/productsClient.ts` | Fetches and validates BFF responses (Zod) |
| `src/atoms/productAtoms.ts` | Shared fetch state (Jotai) |
| `src/hooks/useProduct.ts` | Hook that triggers product load |
| `src/components/` | `ProductCatalog`, `ProductList`, `ProductCard` |
