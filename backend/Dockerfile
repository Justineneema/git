# Use official Python lightweight image
FROM python:3.11-slim

# Disable Python buffering
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system packages (required for psycopg2 & numpy)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    python3-dev \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirement file
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose Django/Gunicorn port
EXPOSE 8000

# Start Gunicorn server
CMD ["gunicorn", "cropdetector.wsgi:application", "--bind", "0.0.0.0:8000"]
