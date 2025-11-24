#!/bin/sh
# Entrypoint script for Live Streaming Service

echo "====================================="
echo "Live Streaming Service Starting..."
echo "====================================="

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run the migration to add processed field
echo "Running database migration..."
if [ -f "./migration_add_processed_field.sql" ]; then
  npx prisma db execute --file ./migration_add_processed_field.sql --schema ./prisma/schema.prisma || echo "Migration may have already been applied or failed"
fi

# Run Prisma migrations (if any)
echo "Running Prisma migrations..."
npx prisma migrate deploy || echo "No migrations to run or migration failed"

echo "====================================="
echo "Starting Live Streaming Service..."
echo "====================================="

# Start the application
exec node src/index.js

