# Dokploy Guide

Production deployment patterns for SaaS projects using Dokploy with the saas-builder-docker team.

## Table of Contents

1. [Dokploy Overview](#dokploy-overview)
2. [Deployment Configuration](#deployment-configuration)
3. [Service Setup](#service-setup)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Troubleshooting](#troubleshooting)

---

## Dokploy Overview

[Dokploy](https://dokploy.com) is an open-source Platform as a Service (PaaS) that simplifies deploying Docker-based applications. It provides a self-hosted alternative to platforms like Heroku or Railway, with full control over your infrastructure.

### Why Dokploy for SaaS

| Feature | Benefit |
|---------|---------|
| Container orchestration | Manages multi-service stacks automatically |
| Automated deployments | Push-to-deploy via GitHub webhooks |
| GitHub integration | Native branch tracking and auto-deploys |
| Built-in SSL | Automatic HTTPS via Let's Encrypt |
| Zero-downtime deploys | Rolling updates without service interruption |
| Environment management | Secure variable storage per project |
| Log streaming | Real-time container logs in the dashboard |
| Rollback | One-click restore to any previous deployment |

### Architecture Overview

```
GitHub Repository
      │
      │  push / PR merge
      ▼
Dokploy Webhook Receiver
      │
      ├──► Build Stage (Docker build)
      │         │
      │         ▼
      │    Container Registry
      │         │
      └──► Deploy Stage
                │
                ├── backend   (Node/Go/Python/Rust)
                ├── frontend  (Nginx + static assets)
                ├── db        (PostgreSQL)
                ├── redis     (Redis)
                └── nginx     (Reverse proxy / SSL termination)
```

### Dokploy vs Alternatives

| Platform | Self-Hosted | Free Tier | Docker Native | GitHub Webhooks |
|----------|-------------|-----------|---------------|-----------------|
| Dokploy  | ✅ Yes      | ✅ Yes    | ✅ Yes        | ✅ Yes          |
| Heroku   | ❌ No       | ❌ Paid   | ⚠️ Limited   | ✅ Yes          |
| Railway  | ❌ No       | ✅ Yes    | ✅ Yes        | ✅ Yes          |
| Render   | ❌ No       | ✅ Yes    | ✅ Yes        | ✅ Yes          |
| Coolify  | ✅ Yes      | ✅ Yes    | ✅ Yes        | ✅ Yes          |

---

## Deployment Configuration

### docker-compose.yml Requirements

Dokploy reads your `docker-compose.yml` directly. The following structure is required for full compatibility:

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ============ Backend ============
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile         # Must be explicit
      args:
        NODE_ENV: production          # Build-time args
    container_name: ${PROJECT_NAME:-saas}_backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
    restart: unless-stopped
    networks:
      - backend-network

  # ============ Frontend ============
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL}  # Pass build-time env to frontend
    container_name: ${PROJECT_NAME:-saas}_frontend
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped
    networks:
      - backend-network

  # ============ Redis ============
  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME:-saas}_redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - backend-network

  # ============ Nginx ============
  nginx:
    image: nginx:alpine
    container_name: ${PROJECT_NAME:-saas}_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "80:80"
      - "443:443"
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
    internal: true           # No direct external access to backend services
```

### Environment Variables for Dokploy

Dokploy injects environment variables at runtime. Configure them in the Dokploy dashboard under **Project → Environment**.

#### Required Variables

```bash
# .env.example - Commit this file (no secrets)
# Copy to .env locally, configure in Dokploy dashboard for production

# ── Project ──────────────────────────────────────────────
PROJECT_NAME=my-saas

# ── Database ──────────────────────────────────────────────
DB_USER=saas_user
DB_PASSWORD=                    # Set in Dokploy dashboard
DB_NAME=saas_db
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}

# ── Redis ─────────────────────────────────────────────────
REDIS_PASSWORD=                 # Set in Dokploy dashboard
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379

# ── Security ──────────────────────────────────────────────
JWT_SECRET=                     # Set in Dokploy dashboard (min 32 chars)
API_KEY=                        # Set in Dokploy dashboard

# ── Frontend Build ────────────────────────────────────────
VITE_API_URL=https://api.yourdomain.com

# ── SMTP (optional) ───────────────────────────────────────
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=                  # Set in Dokploy dashboard
```

> **Security:** Never commit `.env` files with real values. Use `.env.example` for templates and configure secrets directly in the Dokploy dashboard.

#### Variable Precedence

```
Dokploy Dashboard  →  highest priority
docker-compose.yml →  second priority
.env file          →  lowest priority (local development only)
```

### Build Context Settings

Configure the build context in Dokploy to match your repository layout:

```
Repository Layout (recommended for Dokploy):

my-saas/
├── backend/
│   ├── Dockerfile             # Build context: ./backend
│   ├── src/
│   └── package.json
├── frontend/
│   ├── Dockerfile             # Build context: ./frontend
│   ├── src/
│   └── package.json
├── nginx/
│   └── nginx.conf
├── docker-compose.yml         # Root compose file
└── .env.example
```

| Dokploy Setting | Value |
|-----------------|-------|
| Source Type | GitHub |
| Repository | `your-org/your-repo` |
| Branch | `main` (production) |
| Build Type | `Docker Compose` |
| Compose File | `docker-compose.yml` |

### Registry Configuration

By default, Dokploy builds images locally on the server. For larger teams, configure an external registry:

```yaml
# docker-compose.yml with registry
services:
  backend:
    image: ghcr.io/your-org/your-saas-backend:${IMAGE_TAG:-latest}
    build:
      context: ./backend
      dockerfile: Dockerfile
```

```bash
# Dokploy environment variables for registry
REGISTRY_URL=ghcr.io
REGISTRY_USERNAME=your-github-username
REGISTRY_PASSWORD=                      # GitHub PAT with packages:write
IMAGE_TAG=latest                        # Override per deployment
```

---

## Service Setup

### Step 1: Connecting GitHub Repository

**In Dokploy Dashboard:**

1. Go to **Settings → Git Providers**
2. Click **Connect GitHub**
3. Authorize Dokploy on your GitHub account
4. Select the repository (or organization)

**Create a new project:**

```
Dashboard → Projects → New Project
  ├── Name: my-saas-production
  ├── Description: Production SaaS deployment
  └── Click: Create
```

**Add the application:**

```
Project → New Service → Application
  ├── Name: my-saas
  ├── Source: GitHub
  ├── Repository: your-org/my-saas
  ├── Branch: main
  ├── Build Type: Docker Compose
  └── Compose File: docker-compose.yml
```

**Configure the webhook** (auto-deploy on push):

```
Application → Settings → Webhook
  └── Copy the webhook URL → Add to GitHub:
      Repository → Settings → Webhooks → Add webhook
        ├── Payload URL: <copied URL>
        ├── Content type: application/json
        ├── Events: Just the push event
        └── Active: ✅
```

---

### Step 2: Setting Up PostgreSQL

Dokploy can manage PostgreSQL as either a **Compose service** (recommended for simple setups) or a **standalone Managed Database**.

#### Option A: Compose Service (Recommended)

The `db` service defined in `docker-compose.yml` is used as-is. Set these variables in the Dokploy dashboard:

```bash
DB_USER=saas_user
DB_PASSWORD=your_secure_password_here
DB_NAME=saas_db
DATABASE_URL=postgresql://saas_user:your_secure_password_here@db:5432/saas_db
```

#### Option B: Managed Database (Dokploy)

```
Dashboard → Project → New Service → Database → PostgreSQL
  ├── Name: my-saas-db
  ├── Docker Image: postgres:15-alpine
  ├── Database Name: saas_db
  ├── Username: saas_user
  └── Password: <generate secure password>
```

Copy the connection string provided by Dokploy and set it as `DATABASE_URL` in the application environment.

#### Running Migrations

Add a migration step to your backend startup:

```dockerfile
# Dockerfile.backend - run migrations before starting
CMD ["sh", "-c", "npm run db:migrate && node dist/index.js"]
```

Or use a dedicated migration service in compose:

```yaml
# docker-compose.yml
services:
  migrate:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: ["npm", "run", "db:migrate"]
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy
    restart: "no"               # Run once and exit
    networks:
      - backend-network
```

---

### Step 3: Setting Up Redis

#### Option A: Compose Service (Recommended)

Set in Dokploy dashboard:

```bash
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379
```

#### Option B: Managed Redis (Dokploy)

```
Dashboard → Project → New Service → Database → Redis
  ├── Name: my-saas-redis
  ├── Docker Image: redis:7-alpine
  └── Password: <generate secure password>
```

Copy the connection string and set it as `REDIS_URL` in the application environment.

---

### Step 4: Deploying the Backend Service

After connecting GitHub and configuring environment variables:

1. **Trigger initial deploy:**

```
Application → Deploy → Deploy Now
```

2. **Verify the backend is healthy:**

```
Application → Logs → Select: backend
  # Look for: "Server started on port 3000"
  # Look for: "Database connected"
  # Look for: "Redis connected"
```

3. **Check the health endpoint:**

```bash
# From Dokploy terminal or your local machine
curl https://api.yourdomain.com/health
# Expected: {"status":"ok","database":"connected","redis":"connected"}
```

4. **Expose the API domain:**

```
Application → Domains → Add Domain
  ├── Domain: api.yourdomain.com
  ├── Service: backend
  ├── Port: 3000
  ├── HTTPS: ✅ Enable (Let's Encrypt)
  └── Save
```

---

### Step 5: Deploying the Frontend Service

1. **Configure build-time variables** (must be set before the build, not at runtime):

```bash
# Dokploy environment - set BEFORE deploying frontend
VITE_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com   # if using Next.js
```

2. **Trigger the deploy** from the Dokploy dashboard.

3. **Verify the frontend is serving:**

```
Application → Logs → Select: frontend
  # Look for: "nginx/1.x.x ... started"
```

4. **Expose the frontend domain:**

```
Application → Domains → Add Domain
  ├── Domain: yourdomain.com
  ├── Service: frontend (or nginx if using the reverse proxy)
  ├── Port: 80
  ├── HTTPS: ✅ Enable (Let's Encrypt)
  └── Save
```

---

### Step 6: Nginx Configuration

Nginx acts as the reverse proxy, routing traffic between frontend and backend, handling SSL termination, and serving static assets.

```nginx
# nginx/nginx.conf

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # ── Static Frontend ─────────────────────────────────────
    location / {
        proxy_pass         http://frontend:80;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # ── Backend API ──────────────────────────────────────────
    location /api/ {
        proxy_pass         http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        'upgrade';
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }

    # ── WebSocket Support (if needed) ───────────────────────
    location /ws {
        proxy_pass         http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    $http_upgrade;
        proxy_set_header   Connection "upgrade";
    }

    # ── Health Check ─────────────────────────────────────────
    location /nginx-health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # ── Security Headers ─────────────────────────────────────
    add_header X-Frame-Options           "SAMEORIGIN"    always;
    add_header X-XSS-Protection          "1; mode=block" always;
    add_header X-Content-Type-Options    "nosniff"       always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy   "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    # ── Gzip Compression ─────────────────────────────────────
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
}
```

> **Note:** When Dokploy manages SSL via Let's Encrypt, it handles the HTTPS termination at the Traefik layer. The nginx container inside Docker only needs to listen on port 80. Do not configure SSL certificates inside the nginx container.

---

## CI/CD Pipeline

### GitHub Actions Integration

Dokploy supports two CI/CD approaches:

- **Webhook-only** — Dokploy builds and deploys directly on push (simple, no GitHub Actions needed)
- **GitHub Actions + Dokploy API** — GitHub Actions builds and tests, then triggers Dokploy deploy via API (recommended for production)

#### Recommended Workflow: GitHub Actions + Dokploy API

```yaml
# .github/workflows/deploy.yml

name: Deploy to Dokploy

on:
  push:
    branches:
      - main       # Triggers production deploy
  pull_request:
    branches:
      - main       # Triggers preview (if configured)

jobs:
  # ── Test ────────────────────────────────────────────────
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run backend tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-key-for-ci-only
          NODE_ENV: test
        run: npm test

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run frontend tests
        working-directory: ./frontend
        run: npm test

  # ── Build ────────────────────────────────────────────────
  build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/backend:latest
            ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/frontend:latest
            ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}
          build-args: |
            VITE_API_URL=${{ vars.VITE_API_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ── Deploy ───────────────────────────────────────────────
  deploy:
    name: Deploy to Dokploy
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production           # Requires manual approval if configured

    steps:
      - name: Trigger Dokploy deployment
        run: |
          curl -s -X POST \
            -H "Authorization: Bearer ${{ secrets.DOKPLOY_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"applicationId": "${{ secrets.DOKPLOY_APP_ID }}"}' \
            "${{ secrets.DOKPLOY_URL }}/api/application.deploy" \
            | jq .

      - name: Wait for deployment
        run: |
          echo "Waiting 30s for Dokploy to start deployment..."
          sleep 30

      - name: Verify deployment health
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.yourdomain.com/health)
          if [ "$STATUS" != "200" ]; then
            echo "Health check failed with status: $STATUS"
            exit 1
          fi
          echo "Deployment healthy ✅"
```

#### Required GitHub Secrets

Configure these in **GitHub → Repository → Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DOKPLOY_API_TOKEN` | Dokploy API token (Dashboard → Settings → API) |
| `DOKPLOY_APP_ID` | Application ID from Dokploy dashboard |
| `DOKPLOY_URL` | Your Dokploy instance URL (e.g., `https://deploy.yourdomain.com`) |

Configure these as **Variables** (non-secret):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Public API URL for frontend builds |

---

### Build Triggers

| Event | Behavior |
|-------|----------|
| Push to `main` | Full pipeline: test → build → deploy |
| Push to `develop` | Test + build only (no deploy) |
| Pull Request to `main` | Test only |
| Manual trigger | `workflow_dispatch` for on-demand deploy |

To add a manual trigger:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  workflow_dispatch:              # Enables "Run workflow" button in GitHub UI
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'production'
        type: choice
        options: [production, staging]
```

---

### Rollback Procedures

#### Option A: Rollback via Dokploy Dashboard (Recommended)

```
Application → Deployments → Select previous deployment → Rollback
```

Dokploy keeps the last 10 deployments by default. Each deployment is tagged with a Git commit SHA.

#### Option B: Rollback via Dokploy API

```bash
# List recent deployments
curl -s \
  -H "Authorization: Bearer $DOKPLOY_API_TOKEN" \
  "$DOKPLOY_URL/api/application.deployments?applicationId=$APP_ID" \
  | jq '.[].deploymentId'

# Rollback to a specific deployment
curl -s -X POST \
  -H "Authorization: Bearer $DOKPLOY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"applicationId\": \"$APP_ID\", \"deploymentId\": \"<deployment-id>\"}" \
  "$DOKPLOY_URL/api/application.rollback"
```

#### Option C: Rollback via Git Tag

```bash
# Tag the known-good commit
git tag -a v1.2.3 <commit-sha> -m "Last known good production state"
git push origin v1.2.3

# In Dokploy: change the branch/ref to the tag
Application → Settings → Branch → v1.2.3 → Save → Deploy
```

---

## Troubleshooting

### Container Fails to Start

**Symptom:** Container enters a restart loop or exits immediately.

```
# Check container logs in Dokploy
Application → Logs → Select service → View logs

# Or via SSH on the Dokploy server
docker logs <container-name> --tail=100
docker inspect <container-name> | jq '.[].State'
```

**Common Causes and Fixes:**

| Cause | Symptom | Fix |
|-------|---------|-----|
| Missing environment variable | `Error: JWT_SECRET is required` | Add variable in Dokploy dashboard |
| Port already in use | `bind: address already in use` | Change `ports` mapping in compose |
| Failing health check | Container marked as unhealthy | Increase `start_period` in healthcheck |
| Missing build dependency | `Cannot find module 'xyz'` | Add to `dependencies` (not `devDependencies`) |
| Build arg not set | `VITE_API_URL is not defined` | Set build arg in Dokploy before deploying |

**Debugging steps:**

```bash
# 1. Open a shell inside the running container
docker exec -it <container-name> sh

# 2. Check if environment variables are set
env | grep DATABASE_URL

# 3. Test database connectivity from inside the container
nc -zv db 5432

# 4. Test Redis connectivity
redis-cli -h redis -a $REDIS_PASSWORD ping
```

---

### Database Connection Issues

**Symptom:** Backend fails to connect to PostgreSQL on startup.

```
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: password authentication failed for user "saas_user"
Error: database "saas_db" does not exist
```

**Checklist:**

```bash
# 1. Verify the db service is healthy
docker ps --filter "name=saas_db"
# STATUS column must show: (healthy)

# 2. Verify DATABASE_URL format
# ✅ Correct:  postgresql://saas_user:password@db:5432/saas_db
# ❌ Wrong:    postgresql://saas_user:password@localhost:5432/saas_db
#              (use the service name "db", not "localhost")

# 3. Verify credentials match between db service and backend
# DB_USER in db service == DB_USER in DATABASE_URL
# DB_PASSWORD in db service == DB_PASSWORD in DATABASE_URL
# DB_NAME in db service == DB_NAME in DATABASE_URL

# 4. Check db service logs
docker logs saas_db --tail=50
```

**Network isolation check:**

```bash
# Backend must be on the same network as the db service
docker network inspect saas_backend-network
# Confirm both "saas_backend" and "saas_db" containers are listed
```

**If using Dokploy Managed Database:**

```bash
# The host is NOT "db" - use the connection string provided by Dokploy
# Example: DATABASE_URL=postgresql://user:pass@dokploy-postgres-xxx:5432/saas_db
```

---

### Environment Variable Problems

**Symptom:** Application behaves as if variables are not set, even though they exist in the dashboard.

**Checklist:**

```bash
# 1. Redeploy after adding/changing variables
#    Variables are injected at container start - a running container
#    will NOT pick up new values without a redeploy.

# 2. Check for typos in variable names
#    DATABASE_URL  ≠  DATABSE_URL
#    JWT_SECRET    ≠  JWT_SECERT

# 3. Check for quotes in values
#    ✅ Correct:  my-secret-value
#    ❌ Wrong:    "my-secret-value"   (quotes are part of the value)

# 4. Verify the variable is available inside the container
docker exec -it saas_backend env | sort

# 5. For build-time variables (ARG in Dockerfile), verify they
#    are defined as build args in docker-compose.yml
#    These must be set BEFORE the build, not just at runtime.
```

**Frontend build-time variables:**

```yaml
# docker-compose.yml - build args must be explicit
services:
  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: ${VITE_API_URL}   # Pass from env → build arg
```

```dockerfile
# Dockerfile.frontend - declare the ARG
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build                       # Variable is available during build
```

> **Key rule:** `ENV` variables in Dockerfile are available at runtime. `ARG` variables are only available during the build stage. Frontend frameworks (Vite, Next.js, CRA) embed public variables at build time, so they need `ARG`, not just `ENV`.

---

## Quick Reference

### Dokploy Dashboard Sections

| Section | Purpose |
|---------|---------|
| Projects | Manage applications and services |
| Settings → Git Providers | Connect GitHub/GitLab |
| Settings → API | Generate API tokens |
| Application → Environment | Set runtime variables |
| Application → Deployments | View history, trigger rollback |
| Application → Domains | Configure custom domains + SSL |
| Application → Logs | Real-time container logs |

### Common Commands (Dokploy Server SSH)

```bash
# View all running containers
docker ps

# View logs for a specific service
docker logs saas_backend --tail=100 --follow

# Restart a service without full redeploy
docker restart saas_backend

# Check resource usage
docker stats --no-stream

# Force pull latest images and recreate containers
docker-compose pull && docker-compose up -d --force-recreate

# Remove unused images (free disk space)
docker image prune -af
```

### Health Check Reference

| Service | Health Check Command | Expected Response |
|---------|---------------------|-------------------|
| backend | `curl http://localhost:3000/health` | `{"status":"ok"}` |
| frontend | `curl http://localhost:80/` | HTTP 200 |
| db | `pg_isready -U $DB_USER -d $DB_NAME` | `accepting connections` |
| redis | `redis-cli ping` | `PONG` |
| nginx | `curl http://localhost/nginx-health` | `healthy` |

### Port Reference

| Service | Internal Port | Notes |
|---------|--------------|-------|
| backend | 3000 | Not exposed externally — nginx proxies `/api` |
| frontend | 80 | Not exposed externally — nginx proxies `/` |
| db | 5432 | Internal only (`backend-network` is internal) |
| redis | 6379 | Internal only |
| nginx | 80, 443 | The only public-facing service |
