# SaaS Team - Changelog

> **⚠️ DEVELOPMENT FILE** - This file is for version history only.
> Do NOT install this file in OpenCode. Only use team files for installation.

All notable changes to this team are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1] - 2026-04-17

### Added
- Team leader: `saas-project-generator.md`
- Team file: `saas.team.md`
- Documentation moved to `docs/` directory
- Integration with modular agents from other domains

### Design Decisions

#### Modular Agent Teams
- **Decision:** Agents are now in their own domains (planning, coding, code-review)
- **Reason:** Enables agent reuse across different teams

#### Team File
- **Decision:** Create `.team.md` files for team installation via CLI
- **Reason:** One command to install entire team with dependencies

#### Team Leader References
- **Decision:** Team leader uses generic agent names (architect, code-generator)
- **Reason:** Team leader is decoupled from specific agent implementations

#### Repository Analysis on Start
- **Decision:** Team leader must analyze repository before starting
- **Reason:** Works with clean repos or existing projects that need fixes

---

## Migration Notes

### Upgrading to v0.1 (from monolithic saas/ domain)
- Agents are now in: `planning/`, `coding/`, `code-review/`
- Team leader is in: `teams/saas/saas-project-generator.md`
- Install via: `opencode team install saas`
