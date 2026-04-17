# Docker Specialist - Changelog

> **⚠️ DEVELOPMENT FILE** - This file is for version history only.
> Do NOT install this file in OpenCode. Only use agent files for installation.

All notable changes to this agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1] - 2026-04-17

### Added
- Initial docker-specialist agent
- Dockerfile templates (backend, frontend)
- docker-compose.yml template
- .dockerignore template

### Design Decisions

#### Stack-Agnostic
- **Decision:** Generate Dockerfiles based on SDD technology stack
- **Reason:** Works with any language/framework (Rust, Go, Node, Python, etc.)

#### Multi-stage Builds
- **Decision:** Use multi-stage builds in Dockerfiles
- **Reason:** Optimize image size and security

#### Standard Services
- **Decision:** Include postgres, redis as standard services
- **Reason:** Common SaaS requirements

---

## Migration Notes

### Upgrading to v0.1
- New agent in: `infrastructure/docker-specialist/`
- Can be used by any team that needs Docker generation
