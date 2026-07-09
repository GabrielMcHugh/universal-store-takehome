#!/usr/bin/env bash

# Run all Universal Store services locally without Docker.
# - Catalog:   http://localhost:3000  (in-memory Mongo via mongodb-memory-server)
# - Inventory: http://localhost:4000  (in-memory Mongo via mongodb-memory-server)
# - PLP:       http://localhost:8080  (React frontend)
#
# Prerequisites (run once):
#   cd services/catalog && npm install
#   cd services/inventory && npm install
#   cd services/product-landing-page && npm install
#
# Usage:
#   chmod +x dev-local.sh   # first time only
#   ./dev-local.sh

# Exit on error, unset variables, and pipeline failures
set -euo pipefail

# Resolve repo root from this script's location
ROOT="$(cd "$(dirname "$0")" && pwd)"

# Stop all background services when the script exits or receives Ctrl+C
cleanup() {
  echo ""
  echo "Stopping services..."
  kill "$CATALOG_PID" "$INVENTORY_PID" "$PLP_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Catalog API — seeds and serves product metadata
echo "Starting catalog (http://localhost:3000)..."
(cd "$ROOT/services/catalog" && npm run dev) &
CATALOG_PID=$!

# Inventory API — seeds and serves stock levels
echo "Starting inventory (http://localhost:4000)..."
(cd "$ROOT/services/inventory" && npm run dev) &
INVENTORY_PID=$!

# Product Landing Page — queries catalog + inventory on load
# PORT=8080 avoids clashing with catalog on 3000
echo "Starting PLP (http://localhost:8080)..."
(cd "$ROOT/services/product-landing-page" && PORT=8080 npm start) &
PLP_PID=$!

echo ""
echo "All services starting. Open http://localhost:8080"
echo "Press Ctrl+C to stop."

# Keep the script alive until all background processes finish
wait