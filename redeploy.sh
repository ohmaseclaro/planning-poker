#!/bin/bash

# Pull latest changes from git repository
git pull

# Build the Docker image
docker build -t planning-poker:latest .

# Stop and remove the existing container if it exists
docker stop planning-poker && docker rm planning-poker

# Run the new container
docker run -d \
  --name planning-poker \
  -p 5074:3000 \
  -e VITE_SOCKET_URL=https://yottaa-test.site \
  --restart always \
  planning-poker:latest