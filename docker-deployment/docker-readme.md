# Docker Deployment Guide

This directory contains Docker configuration files for deploying the portfolio website using Docker and Docker Compose.

## Quick Start

1. **Navigate to the docker-deployment directory:**
   ```bash
   cd docker-deployment
   ```

2. **Build and start the container:**
   ```bash
   docker compose up -d
   ```

3. **Access your website:**
   Open `http://localhost:8000` in your browser

4. **Stop the container:**
   ```bash
   docker compose down
   ```

## Configuration

### Port Configuration
The website runs on port 8000 by default. To change this:
- Edit `docker-compose.yml`
- Change `"8000:80"` to `"YOUR_PORT:80"`

### Live Configuration Editing

The `config.json` file is mounted as a bind mount, allowing you to edit it directly from your host system without rebuilding the container.

**To edit the configuration:**

1. **From the project root directory, edit config.json:**
   ```bash
   # Using your preferred editor
   code config.json
   nano config.json
   vim config.json
   ```

2. **Save your changes**

3. **Refresh your browser** - changes appear immediately!

**No need to:**
- Rebuild the container
- Restart the container
- Copy files into the container

### How It Works

The bind mount in `docker-compose.yml`:
```yaml
volumes:
  - ../config.json:/usr/share/nginx/html/config.json:ro
```

- Maps your local `config.json` directly into the container
- `:ro` makes it read-only inside the container for security
- Changes to your local file are instantly visible in the running container

## Deployment Commands

### Development
```bash
# Start in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Restart service
docker compose restart
```

### Production
```bash
# Build and start
docker compose up -d --build

# Update configuration only
# Just edit config.json and refresh browser

# Complete rebuild (if you change HTML/CSS/JS)
docker compose down
docker compose up -d --build
```

## Container Details

- **Base Image:** nginx:alpine
- **Web Server:** Nginx
- **Port:** 80 (internal), 8000 (external)
- **Document Root:** /usr/share/nginx/html/
- **Configuration:** Live-editable via bind mount

## Troubleshooting

### Container won't start
```bash
# Check if port 8000 is already in use
docker compose down
lsof -i :8000

# Use different port if needed
```

### Configuration changes not appearing
```bash
# Verify the bind mount is working
docker exec portfolio-website ls -la /usr/share/nginx/html/config.json

# Check container logs
docker compose logs portfolio-website
```

### Complete reset
```bash
# Stop and remove everything
docker compose down
docker compose up -d --build
```

## File Structure

```
docker-deployment/
├── Dockerfile              # Container build instructions
├── docker-compose.yml      # Service configuration
└── docker-readme.md        # This file
```

The Dockerfile copies all project files into the nginx container, while the docker-compose.yml adds the live configuration editing capability through bind mounts.