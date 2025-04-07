# Planning Poker

## Docker Deployment

### Prerequisites

- Docker installed on your server
- Your application built and packaged in a Docker image (e.g., `planning-poker:latest`)

### Running in Production

The application runs on port 3000 inside the container. You can map this to any port on your host machine.

#### Basic Docker Run Command

```bash
docker run -d \
  --name planning-poker \
  -p 8080:3000 \
  -e VITE_SOCKET_URL=http://your-api-domain.com \
  --restart always \
  planning-poker:latest
```

This command:

- Runs the container in detached mode (`-d`)
- Names the container `planning-poker`
- Maps host port 8080 to container port 3000 (`-p 8080:3000`)
  - Change 8080 to any port you want to use on your host
- Sets the Socket.io URL environment variable
- Configures the container to always restart (`--restart always`)
- Uses the `planning-poker:latest` image

#### Environment Variables

- `VITE_SOCKET_URL`: The URL of your Socket.io server

#### Port Mapping Explained

In the `-p 8080:3000` parameter:

- The first number (8080) is the port on your host machine
- The second number (3000) is the port inside the Docker container

You can change the host port (first number) to any available port on your system, but the container port (3000) should remain the same as that's the port your application is configured to use.

#### Health Check

You can verify that your container is running with:

```bash
docker ps
```

#### Viewing Logs

```bash
docker logs planning-poker
```

#### Stopping the Container

```bash
docker stop planning-poker
```
