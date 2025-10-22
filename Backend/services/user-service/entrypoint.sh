#!/bin/sh

# Environment variable ko debug karne ke liye container ke log mein print karein
echo "--- DEBUG: DATABASE_URL inside container is -> [${DATABASE_URL}] ---"

# Original command (npm start) ko execute karein
exec "$@"