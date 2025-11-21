# Use official Python lightweight image
FROM python:3.11-slim

# Disable Python buffering
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /backend

# Install system dependencies (needed for psycopg2, numpy, TensorFlow, OpenCV)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    python3-dev \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Upgrade pip (important for TensorFlow)
RUN pip install --upgrade pip

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create necessary directories
RUN mkdir -p staticfiles media

# Collect static files (with error handling)
RUN python manage.py collectstatic --noinput || echo "Skipping collectstatic - will run after deployment"

# Expose Django/Gunicorn port
EXPOSE 8000

# Start Gunicorn server
CMD ["gunicorn", "cropdetector.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120"]