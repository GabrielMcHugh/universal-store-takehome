#!/usr/bin/env bash

# Run all Universal Store services locally without Docker.
# Opens each service in its own terminal window (Windows + Git Bash).
#
# - Catalog:   http://localhost:3000
# - Inventory: http://localhost:4000
# - PLP:       http://localhost:8080
#
# Prerequisites (run once):
#   cd services/catalog && npm install
#   cd services/inventory && npm install
#   cd services/product-landing-page && npm install
#
# Usage:
#   chmod +x dev-local.sh
#   ./dev-local.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Free a port by killing whatever process is listening on it (Windows).
# Ignores errors when nothing is bound to the port.
kill_port() {
  local port="$1"
  powershell.exe -NoProfile -Command \
    "Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }" \
    || true
}

echo "Stopping any previous local instances on ports 3000, 4000, 8080..."
kill_port 3000
kill_port 4000
kill_port 8080
sleep 1

# Open a new cmd window for each service (reliable on Windows + Git Bash).
open_window() {
  local title="$1"
  local dir="$2"
  local cmd="$3"
  local win_dir
  win_dir="$(cygpath -w "$dir")"

  powershell.exe -NoProfile -Command \
    "Start-Process -FilePath 'cmd.exe' -WorkingDirectory '$win_dir' -ArgumentList '/k','title $title && $cmd'"
}

echo "Opening catalog in a new window (http://localhost:3000)..."
open_window "Catalog" "$ROOT/services/catalog" "npm run dev"

echo "Opening inventory in a new window (http://localhost:4000)..."
open_window "Inventory" "$ROOT/services/inventory" "npm run dev"

echo "Opening PLP in a new window (http://localhost:8080)..."
# Use npx react-scripts directly — npm start hardcodes PORT=3000 with Unix syntax
open_window "PLP" "$ROOT/services/product-landing-page" "set PORT=8080&& npx react-scripts start"

echo ""
echo "All services launched in separate windows."
echo "Open http://localhost:8080 in your browser."
echo "Close each terminal window to stop that service."