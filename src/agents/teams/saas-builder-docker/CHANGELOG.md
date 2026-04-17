# SaaS Builder Docker Team - Changelog

> **⚠️ DEVELOPMENT FILE** - This file is for version history only.
> Do NOT install this file in OpenCode. Only use team files for installation.

All notable changes to this team are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1] - 2026-04-17

### Added
- Team leader: `saas-builder-docker.md`
- Team file: `saas-builder-docker.team.md`
- docker-specialist agent (in infrastructure domain)
- Docker documentation (draft)
- Dokploy documentation (draft)

### Design Decisions

#### Docker-First SaaS
- **Decision:** Docker is enabled by default for this team
- **Reason:** Modern SaaS deployment best practices

#### Multi-Service Architecture
- **Decision:** Generate docker-compose with multiple services
- **Reason:** Scalability and isolation (backend, frontend, db, redis, nginx)

#### Integration with Existing Agents
- **Decision:** Reuse modular agents from other domains
- **Reason:** DRY - agents are shared across teams

#### Dokploy Support
- **Decision:** Include Dokploy deployment configuration
- **Reason:** Simplified Docker deployment for SaaS

---

## Migration Notes

### Upgrading to v0.1 (from saas team)
- This is a specialized version of the saas team
- Adds docker-specialist for Docker generation
- Adds Dokploy support
- Install via: `opencode team install saas-builder-docker`
