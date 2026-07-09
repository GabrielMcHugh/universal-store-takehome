# Design Decisions & Reasoning

This document explains the key architectural and implementation decisions made during the Universal Store take-home assessment. It is intended to help reviewers understand **what was built**, **why it was built that way**, and **how it maps to the assessment criteria**.

---

## Architecture overview

The solution is four application services plus supporting infrastructure, orchestrated via Docker Compose:

```
┌─────────────────────┐
│  Product Landing    │  React app (port 8080)
│  Page (PLP)         │  Single consumer of the BFF
└──────────┬──────────┘
           │ GET /products/in-stock
           ▼
┌─────────────────────┐
│  PLP BFF            │  Express (port 5000)
│                     │  Fetches catalog + inventory, merges in-stock products
└─────┬─────────┬─────┘
      │         │
      ▼         ▼
┌──────────┐ ┌────────────┐
│ Catalog  │ │ Inventory  │   Express APIs (ports 3000 / 4000)
│ + Mongo  │ │ + Mongo    │   Independent domain services
└──────────┘ └────────────┘
```

| Service | Port | Responsibility |
|---------|------|----------------|
| Catalog | 3000 | Product metadata (sku, title, price, image) |
| Inventory | 4000 | Stock quantities by SKU |
| PLP BFF | 5000 | Aggregates catalog + inventory; exposes one PLP-facing endpoint |
| Product Landing Page | 8080 | Renders in-stock products |

Each backend service has its own MongoDB instance. There is no shared database, so a server-side join must happen over HTTP — not in a single query.

### Run the stack

```bash
docker compose up --build
```

- PLP: http://localhost:8080
- BFF API docs: http://localhost:5000/docs
- Catalog API docs: http://localhost:3000/docs
- Inventory API docs: http://localhost:4000/docs

For local development without Docker, see `dev-local.sh`.

---

## How this maps to the assessment criteria

| Criterion | How it is addressed |
|-----------|---------------------|
| Clean, well-structured TypeScript | Factory pattern for Express apps; pure merge function in BFF; typed models and explicit response shapes; shared validation modules |
| Test-driven development | Catalog and inventory endpoints were test-first (supertest); BFF merge logic has unit tests; layered integration, Postman, and E2E coverage |
| Minimise tight coupling | BFF isolates the frontend from catalog/inventory; each service owns its domain type; merge logic lives in one place |
| Documentation | This file, per-service READMEs, OpenAPI specs at `/docs` on each API |
| Type annotations and strict typing | TypeScript throughout; Zod schemas on frontend and backend; lean, explicit API responses instead of raw Mongo serialisation |

---

## Key design decisions

### 1. Test-driven development

**Decision:** Write failing tests before implementing catalog endpoints.

**Why:** The assessment explicitly calls for TDD. Starting with tests defined the expected HTTP contract (status codes, response shapes, error cases) before any route logic was written. That kept implementation focused and gave immediate feedback when endpoints were complete.

**Outcome:** `app.test.ts` files in catalog, inventory, and plp-bff; frontend component tests with mocked data.

---

### 2. Express app factory pattern (`createApp` + `server.ts`)

**Decision:** Split each Express service into a factory (`app.ts`) and an entrypoint (`server.ts`).

**Why:** The original `app.ts` combined three concerns: reading environment variables, connecting to MongoDB, and binding to a port. Supertest only needs the Express app object. Separating them means unit tests can inject config (e.g. disable rate limiting) without starting a server or database connection.

**Outcome:** Testable HTTP layer across catalog, inventory, and plp-bff.

---

### 3. Catalog model aligned with inventory

**Decision:** Model catalog items with `sku` as the unique identifier, matching the inventory service's shape.

**Why:** Both services key on SKU. Keeping the identifier consistent makes the merge straightforward and mirrors how a real product domain would work — one SKU across catalog and stock systems.

**Fields:** `sku`, `title`, `price`, `image`.

---

### 4. PLP BFF instead of client-side aggregation

**Decision:** Extract in-stock merging into a dedicated Backend-for-Frontend (`plp-bff`) rather than having the React app call catalog and inventory directly.

**Why:**
- The PLP only needs **products in stock** — one endpoint, one response shape.
- The frontend should not know catalog and inventory URLs, CORS rules, or merge logic.
- Catalog and inventory remain internal services the browser never talks to.
- If upstream APIs change, only the BFF needs updating — not the React app.
- Separate MongoDB instances make a database join impossible anyway; HTTP aggregation is the correct approach.

**Evolution:** Merge logic was first prototyped in the frontend, then moved to a BFF once the coupling cost became clear. The BFF fetches both sources in parallel (`upstream.ts`) and applies a pure merge function (`getInStockProducts.ts`).

**Trade-off considered:** A dedicated "InStock" domain microservice would make sense if multiple consumers needed the same merged view. For a single PLP, a BFF is simpler and sufficient.

---

### 5. Loose coupling between services

**Decision:** Each service owns its domain type. The composed `InStockProduct` type exists only in the BFF and frontend — not in catalog or inventory.

**Why:** Tight coupling would mean catalog or inventory knowing about each other's shapes. Keeping types separate means each service can evolve independently. The BFF is the only place that knows how to combine them.

---

### 6. Zod for runtime API validation (frontend)

**Decision:** Validate BFF responses with Zod schemas before using them in the UI.

**Why:** TypeScript types are erased at runtime. Zod gives runtime guarantees that the API response matches the expected shape, with clear error messages when it does not. This avoids hand-written type guards and boilerplate.

---

### 7. Jotai atoms for shared frontend state

**Decision:** Use Jotai atoms (`productsAtom`, `loadingAtom`, `errorAtom`, `loadProductsAtom`) instead of local `useState` in a single component.

**Why:** A product landing page will likely grow across multiple components. Putting shared fetch state in one place early avoids rewiring later. The `loadProductsAtom` write-only atom encapsulates the fetch → set flow.

---

### 8. AbortSignal on fetch (React Strict Mode)

**Decision:** Thread an `AbortSignal` through the fetch wrapper and load atom.

**Why:** React Strict Mode double-invokes effects in development, which caused duplicate catalog/inventory fetches. Aborting the in-flight request when the effect cleans up prevents race conditions and unnecessary load on upstream services.

---

### 9. Layered testing strategy

**Decision:** Split tests by layer rather than relying on one end-to-end path for everything.

| Layer | What it tests | Tooling |
|-------|---------------|---------|
| Unit | Route handlers, SKU validation, merge logic, React components | Jest, supertest, React Testing Library |
| Cross-service integration | BFF merge against real catalog + inventory over HTTP | Jest (`tests/integration/`) |
| Contract / per-route | Individual endpoint shapes, 404 cases, field validation | Postman + Newman (`tests/postman/`) |
| End-to-end | Full browser path through the PLP | Playwright (`tests/e2e/`) |

**Why test catalog + inventory without the UI?**

The PLP is one consumer of catalog and inventory. Testing those services together (via the BFF) proves their HTTP contracts align — same SKUs, mergeable data, in-stock rules work on real responses. The PLP gets component tests with mocked APIs for loading/error/render paths.

Splitting layers means when a test fails, you know whether the bug is in the APIs, the merge logic, or the UI. Cross-service tests also run faster and more reliably than always going through React.

**Postman vs Jest (intentional overlap):**

- **Newman** adds explicit per-route coverage (`GET /catalog/:sku`, `GET /inventory/:sku`, 404 cases) and a runnable collection for manual debugging by reviewers.
- **Jest integration** is the only test that verifies the in-stock merge produces the expected 3 products from seeded data.

Both run in CI. The overlap is deliberate for demo and reviewer ergonomics.

---

### 10. CI pipeline (GitHub Actions)

**Decision:** Three-job pipeline — dependency audit, unit tests (matrix per service), integration + Postman + E2E (docker compose stack).

**Why:** Unit tests are fast and run in parallel per service. Integration and E2E need the full stack, so they share a `docker compose up` step. Node modules and Playwright browsers are cached to keep runs practical.

**Not done:** Docker layer caching — more involved; noted as a future optimisation.

---

### 11. Security hardening (ACSC Essential Eight)

Improvements were aligned to the [ACSC Essential Eight](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight), with detailed control mapping against the Information Security Manual (ISM) where relevant.

| Control | Implementation |
|---------|----------------|
| **#2 Patch applications** | `npm audit --audit-level=high` in CI; Mongo image pinned to `mongo:7.0` |
| **#4 User application hardening** | SKU path parameters validated against a strict allowlist pattern before any database query. Queries use a fixed shape (`{ sku: validatedString }`) rather than dynamic user-built filter objects — mitigates NoSQL injection. Rate limiting (100 req/min/IP) via `express-rate-limit`. Helmet for security headers. |
| **#5 Restrict administrative privileges** | MongoDB ports removed from `docker-compose.yml` so databases are not exposed to the host |

**Other hardening:**
- CORS restricted to `CLIENT_URL`
- Inventory `GET /inventory/:sku` returns 404 for missing SKUs (not an empty result), consistent with catalog
- `mongo-sanitize` not added — queries are not built from dynamic user filter objects, so the risk is low

**Not implemented (out of scope for take-home):** Authentication, authorisation, full heartbeat/uptime monitoring.

---

### 12. Explicit API responses and OpenAPI

**Decision:** Return lean, typed response objects from endpoints instead of raw Mongoose documents. Add OpenAPI specs and Swagger UI at `/docs` on each service.

**Why:** Raw Mongo serialisation leaks internal fields (`_id`, `__v`). Explicit mapping keeps the public contract stable and documented. OpenAPI gives reviewers and future consumers a machine-readable contract.

**Production note:** Swagger exposes the full API surface. In production, protect `/docs` with basic auth, disable in non-prod, or keep on an internal network.

---

### 13. Error handling and logging

**Decision:** Centralised error handler middleware, async route wrapper, and basic request logging on catalog and inventory.

**Why:** Consistent error shapes (400 for invalid input, 404 for missing resources, 502 from BFF when upstream fails) make debugging and client handling predictable. Logging is a stub — in production this would feed into Sumo Logic, Datadog, or similar.

**Not done:** Logging middleware on plp-bff (noted under "if I had more time").

---

## Production considerations

These were considered but not fully implemented in the take-home scope:

### Rate limiting at scale
- Per-IP limits require `trust proxy` when behind a reverse proxy, so `req.ip` reads the real client from `X-Forwarded-For`.
- Multiple containers behind a load balancer need a shared store (e.g. Redis) for global enforcement.
- IP-based limits work for anonymous public APIs but not for authenticated partners, mobile carrier NAT, or corporate offices sharing one IP — API-key-based identity is better there.
- The primary rate limiter should sit on an API gateway; per-service limits are sufficient for this project.

### Monitoring
- Heartbeat endpoint stubs added but not wired to Pingdom or similar.

### BFF traffic routing
- In production, BFF traffic would get its own route/rate-limit policy separate from direct catalog/inventory access (which would be internal only).

---

## What I would do with more time

- Logging middleware on plp-bff
- Docker layer caching in CI
- More failure-mode tests (DB down, upstream timeout, invalid input, CORS)
- Dedicated InStock microservice if multiple consumers emerge
- PLP UI styled closer to the Universal Store site
- System design write-up: hosting, scaling, CDN for images, read replicas, cache layer on BFF

---

## Per-service documentation

| Service | README | OpenAPI |
|---------|--------|---------|
| Catalog | `services/catalog/README.md` | http://localhost:3000/docs |
| Inventory | `services/inventory/README.md` | http://localhost:4000/docs |
| PLP BFF | `services/plp-bff/README.md` | http://localhost:5000/docs |
| Integration tests | `tests/integration/README.md` | — |
| E2E tests | `tests/e2e/README.md` | — |
| Postman collection | `tests/postman/` | Import into Postman or run via Newman |
