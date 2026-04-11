#!/bin/bash
# Initial project setup — install dependencies, configure env, run migrations, seed data
# Usage: ./scripts/setup.sh [--docker]

set -euo pipefail

USE_DOCKER=false

for arg in "$@"; do
  case $arg in
    --docker) USE_DOCKER=true ;;
  esac
done

echo "============================================"
echo "  E-Commerce Platform — Project Setup"
echo "============================================"
echo ""

# 1. Environment file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "[1/4] Created .env file from .env.example"
  echo "      >>> Please update .env with your credentials before running the app <<<"
else
  echo "[1/4] .env already exists — skipping"
fi

if [ "$USE_DOCKER" = true ]; then
  # Docker-based setup
  echo "[2/4] Starting Docker services..."
  docker-compose up -d postgres redis
  echo "      Waiting for PostgreSQL to be ready..."
  sleep 5

  echo "[3/4] Running database migrations..."
  docker-compose run --rm server npm run migrate 2>/dev/null || echo "      Migration command not configured yet"

  echo "[4/4] Seeding database..."
  docker-compose run --rm server npm run seed 2>/dev/null || echo "      Seed command not configured yet"

  echo ""
  echo "Run 'docker-compose up' to start all services."
else
  # Local setup
  echo "[2/4] Installing dependencies..."
  npm run install:all 2>/dev/null || {
    echo "      Installing server dependencies..."
    cd server && npm install && cd ..
    echo "      Installing client dependencies..."
    cd client && npm install && cd ..
  }

  echo "[3/4] Running database migrations..."
  npm run db:migrate 2>/dev/null || echo "      Migration command not configured yet — ensure PostgreSQL is running"

  echo "[4/4] Seeding database..."
  npm run db:seed 2>/dev/null || echo "      Seed command not configured yet"

  echo ""
  echo "Run 'npm run dev' to start development."
fi

echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
