#!/bin/bash
# Database backup script
# Creates a compressed, timestamped PostgreSQL dump
# Usage: ./scripts/backup-db.sh [--s3]

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="ecommerce_${TIMESTAMP}.sql.gz"
UPLOAD_TO_S3=false
MAX_LOCAL_BACKUPS=10

for arg in "$@"; do
  case $arg in
    --s3) UPLOAD_TO_S3=true ;;
  esac
done

mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."

# Dump and compress
docker-compose exec -T postgres pg_dump -U postgres ecommerce | gzip > "$BACKUP_DIR/$BACKUP_FILE"

FILESIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
echo "Backup created: $BACKUP_DIR/$BACKUP_FILE ($FILESIZE)"

# Upload to S3 if requested
if [ "$UPLOAD_TO_S3" = true ]; then
  S3_BUCKET="${AWS_BACKUP_BUCKET:-ecommerce-backups}"
  echo "Uploading to s3://$S3_BUCKET/db-backups/$BACKUP_FILE ..."
  aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$S3_BUCKET/db-backups/$BACKUP_FILE"
  echo "S3 upload complete"
fi

# Rotate old local backups — keep only the most recent
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/ecommerce_*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_LOCAL_BACKUPS" ]; then
  REMOVE_COUNT=$((BACKUP_COUNT - MAX_LOCAL_BACKUPS))
  echo "Rotating: removing $REMOVE_COUNT old backup(s)..."
  ls -1t "$BACKUP_DIR"/ecommerce_*.sql.gz | tail -n "$REMOVE_COUNT" | xargs rm -f
fi

echo "Backup complete!"
