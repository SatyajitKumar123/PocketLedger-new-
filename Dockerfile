# 1. Use an official Python runtime as a parent image
FROM python:3.12-slim-bullseye

# 2. Set environment variables
# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# 3. Set work directory inside the container
WORKDIR /app

# 4. Install system dependencies (needed for Postgres/other libs)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the project code into the container
COPY . .

# 7. (Optional) Run command is handled by docker-compose, 
# but this is a good default for production
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]