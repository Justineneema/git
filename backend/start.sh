#!/bin/bash
set -e

echo "Waiting for database..."
until python -c "import psycopg2; psycopg2.connect('${DATABASE_URL}')" 2>/dev/null; do
  echo "Database unavailable, retrying in 2 seconds..."
  sleep 2
done

echo "Database ready!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
gunicorn --bind 0.0.0.0:8000 cropdetector.wsgi:application
