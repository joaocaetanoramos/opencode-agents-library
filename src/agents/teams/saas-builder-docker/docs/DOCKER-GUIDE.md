# Docker Guide

Production-ready Docker patterns for SaaS projects built with saas-builder-docker team.

## Table of Contents

1. [Docker Patterns](#docker-patterns)
2. [Service Templates](#service-templates)
3. [docker-compose Patterns](#docker-compose-patterns)
4. [Best Practices](#best-practices)

---

## Docker Patterns

### Multi-Stage Builds

Use multi-stage builds to reduce final image size and attack surface.

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Non-Root Users

Always run containers as non-root for security.

```dockerfile
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001

# Switch to non-root user
USER nodeapp

# For Go/Rust, use numeric UID
RUN adduser -S appuser -u 1001
USER 1001
```

### Health Checks

Add explicit health checks for orchestration reliability.

```dockerfile
# HTTP-based health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# For Python/FastAPI
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# For databases
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD pg_isready -U postgres || exit 1
```

### Image Optimization

| Technique | Benefit |
|-----------|---------|
| Alpine base images | ~5MB vs ~130MB for Ubuntu |
| Multi-stage builds | 90% smaller images |
| Layer ordering | Better cache utilization |
| .dockerignore | Smaller build context |
| No install dev deps | Reduced attack surface |

```dockerfile
# Good: Minimal layers
FROM alpine:3.18
RUN apk add --no-cache nodejs npm
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]

# Bad: Multiple RUN statements
FROM alpine:3.18
RUN apk add nodejs
RUN apk add npm
RUN npm install -g some-tool
```

---

## Service Templates

### Node.js/TypeScript Backend

```dockerfile
# Dockerfile.backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001

COPY --from=builder --chown=nodeapp:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/package*.json ./

USER nodeapp
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

### React/Vue Frontend

```dockerfile
# Dockerfile.frontend
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Go Backend

```dockerfile
# Dockerfile.backend
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Download modules first (better cache)
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM scratch

# CA certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 8080

# No USER directive - scratch image

ENTRYPOINT ["./main"]
```

### Rust Backend

```dockerfile
# Dockerfile.backend
FROM rust:1.75-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache musl-dev openssl-dev pkgconfig

# Copy manifests first (better cache)
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && \
    cargo build --release && rm -rf src

# Copy source and build
COPY src ./src
RUN touch src/main.rs && cargo build --release

# Production stage
FROM alpine:3.18

WORKDIR /app

COPY --from=builder /app/target/release/main .
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

RUN adduser -S appuser -u 1001
USER 1001

EXPOSE 8080

CMD ["./main"]
```

### Python Backend

```dockerfile
# Dockerfile.backend
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Production stage
FROM python:3.12-slim

WORKDIR /app

# Install only runtime dependencies
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

# Create non-root user
RUN useradd -m -u 1001 appuser
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## docker-compose Patterns

### Full Stack Template

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ============ Backend ============
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ${PROJECT_NAME:-saas}_backend
    ports:
      - "${BACKEND_PORT:-3000}:3000"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - API_KEY=${API_KEY}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    restart: unless-stopped
    networks:
      - backend-network

  # ============ Frontend ============
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ${PROJECT_NAME:-saas}_frontend
    ports:
      - "${FRONTEND_PORT:-80}:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - frontend-network

  # ============ Database ============
  db:
    image: postgres:15-alpine
    container_name: ${PROJECT_NAME:-saas}_db
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    ports:
      - "${DB_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - backend-network

  # ============ Redis ============
  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME:-saas}_redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT:-6379}:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - backend-network

  # ============ Nginx (Reverse Proxy) ============
  nginx:
    image: nginx:alpine
    container_name: ${PROJECT_NAME:-saas}_nginx
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "${HTTP_PORT:-80}:80"
      - "${HTTPS_PORT:-443}:443"
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - frontend-network
      - backend-network

# ============ Volumes ============
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

# ============ Networks ============
networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true
```

### Environment Variables

```bash
# .env - Never commit this file
# Project
PROJECT_NAME=my-saas
NODE_ENV=production

# Backend
BACKEND_PORT=3000

# Frontend
FRONTEND_PORT=80

# Database
DB_USER=saas_user
DB_PASSWORD=secure_password_here
DB_NAME=saas_db
DB_PORT=5432

# Redis
REDIS_PASSWORD=redis_password_here
REDIS_PORT=6379

# Security
JWT_SECRET=your-jwt-secret-key-min-32-chars
API_KEY=your-api-key

# Nginx
HTTP_PORT=80
HTTPS_PORT=443
```

### Volume Management

```yaml
# Named volumes for persistent data
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

# Bind mounts for development
develop:
  volumes:
    - ./src:/app/src:ro
  environment:
    - WATCH=1

# Temp volumes for testing
test:
  volumes:
    - test_data:/tmp/test
```

### Networking

```yaml
# Internal network for backend services (no external access)
backend-network:
  driver: bridge
  internal: true

# Frontend network with external access
frontend-network:
  driver: bridge

# Service connectivity
services:
  backend:
    networks:
      - backend-network

  nginx:
    networks:
      - frontend-network
      - backend-network
```

---

## Best Practices

### .dockerignore Patterns

```dockerignore
# Version control
.git
.gitignore

# Environment files
.env
.env.*
*.env

# Dependencies
node_modules
__pycache__
*.pyc
target
vendor

# Build artifacts
dist
build
*.egg-info

# Development files
.dockerignore
docker-compose*.yml
Dockerfile*
*.md
coverage
.nyc_output
*.log

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Secrets
*.pem
*.key
credentials.json
```

### Build Context Optimization

| Pattern | Before | After |
|---------|--------|-------|
| No `.dockerignore` | 500MB | 50MB |
| Ordered COPY | Full rebuild | Cache hit |
| Multi-stage | 1GB | 100MB |
| Alpine base | 130MB | 5MB |

```bash
# Optimize build context order
# 1. Most stable files first
COPY package*.json ./
RUN npm ci

# 2. Source code last (changes often)
COPY src ./src

# 3. Verify context size
docker build --progress=plain .
# Check: "Transferring builder: 50MB"
```

### Secret Management

```yaml
# Bad: Secrets in environment variables
environment:
  - API_KEY=super_secret_key

# Good: Use Docker secrets (Swarm) or bind mounts
environment:
  - API_KEY_FILE=/run/secrets/api_key
configs:
  - api_key: /path/to/api_key

# Best for development: .env file (gitignored)
env_file:
  - .env

# Kubernetes: Use Secrets
# api-key: <base64-encoded>
```

### Logging

```yaml
# Structured JSON logging
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # Cloud logging
  backend:
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: "{{.Name}}"
```

```dockerfile
# Application logging format
# Good: JSON for log aggregation
LOG_FORMAT=json

# Backend: morgan for Express
# Backend: winston for Node.js
# Backend: zap for Go
# Backend: tracing for Rust
```

### Security Checklist

- [ ] Run as non-root user
- [ ] Use specific image tags (not `latest`)
- [ ] Scan images for vulnerabilities
- [ ] No secrets in Dockerfile
- [ ] Read-only root filesystem
- [ ] No privileged mode
- [ ] Dropcapabilities
- [ ] Health checks defined
- [ ] Minimal base image (Alpine/scratch)
- [ ] No debug ports exposed

---

## Quick Reference

### Common Commands

```bash
# Build
docker-compose build
docker-compose build --no-cache backend

# Start/Stop
docker-compose up -d
docker-compose down
docker-compose down -v  # Remove volumes

# Logs
docker-compose logs -f backend
docker-compose logs --tail=100 backend

# Rebuild
docker-compose up -d --build

# Scale
docker-compose up -d --scale backend=3
```

### Port Reference

| Service | Internal | Default External |
|---------|----------|-------------------|
| Frontend | 80 | 80 |
| Backend API | 3000 | 3000 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |
| Nginx HTTP | 80 | 80 |
| Nginx HTTPS | 443 | 443 |
