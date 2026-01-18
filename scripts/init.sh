#!/bin/bash

# script to create a postgres container, init db, tables and seed mock data

echo "Running init script..."

docker stop bondsports-pg

docker rm bondsports-pg 

docker run --name bondsports-pg -e POSTGRES_PASSWORD=password --network api-net -d -p 5432:5432 postgres


Wait for Postgres to be ready
echo "Waiting for Postgres to start..."
until docker exec bondsports-pg pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Postgres container started."

# Run the SQL command
docker exec -i bondsports-pg psql -U postgres -a < ./scripts/seed.sql

echo "Done."