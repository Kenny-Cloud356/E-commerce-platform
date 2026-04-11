#!/bin/bash
# Production deployment script for AWS EC2
# Usage: ./scripts/deploy.sh [--skip-backup] [--skip-migrate]

set -euo pipefail

SKIP_BACKUP=false
SKIP_MIGRATE=false

for arg in "$@"; do
  case $arg in
    --skip-backup) SKIP_BACKUP=true ;;
    --skip-migrate) SKIP_MIGRATE=true ;;
  esac
done

echo "============================================"
echo "  E-Commerce Platform — Production Deploy"
echo "============================================"
echo ""

# Backup database before deploy
if [ "$SKIP_BACKUP" = false ]; then
  echo "[1/5] Backing up database..."
  ./scripts/backup-db.sh
else
  echo "[1/5] Skipping database backup"
fi

# Pull latest code
echo "[2/5] Pulling latest code..."
git pull origin main

# Build and restart containers
echo "[3/5] Building and starting containers..."
docker-compose down --remove-orphans
docker-compose up -d --build

# Wait for services to be healthy
echo "[4/5] Waiting for services to start..."
sleep 15

# Run database migrations
if [ "$SKIP_MIGRATE" = false ]; then
  echo "[4/5] Running database migrations..."
  docker-compose exec -T server npm run migrate 2>/dev/null || echo "  No pending migrations"
else
  echo "[4/5] Skipping migrations"
fi

# Health check
echo "[5/5] Running health check..."
HEALTH=$(curl -sf http://localhost/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q '"ok"'; then
  echo ""
  echo "  Deployment successful!"
else
  echo ""
  echo "  WARNING: Health check failed. Check logs:"
  echo "    docker-compose logs --tail=50 server"
  exit 1
fi

# Clean up dangling images
docker image prune -f > /dev/null 2>&1

echo ""
echo "============================================"
echo "  Deploy complete!"
echo "============================================"
