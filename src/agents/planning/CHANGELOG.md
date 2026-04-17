# Planning Domain - Changelog

> **⚠️ DEVELOPMENT FILE** - This file is for version history only.
> Do NOT install this file in OpenCode. Only install the individual agent .md files.

All notable changes to this domain are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1] - 2026-04-17

### Added
- `architect.md` - Analyzes requirements and generates Software Design Document (SDD)
- Domain structure with reusable planning agents

### Design Decisions

#### v0.1
- **Decision:** Create modular planning agents independent of any team
- **Reason:** Agents should be reusable across different team configurations

- **Decision:** Use standardized SDD format
- **Reason:** Enables interoperability between different team leaders and agents

- **Decision:** Documentation references via configurable path
- **Reason:** Each team can have its own available-tools.md

---

## Migration Notes

### Upgrading to v0.1
_Initial release - no migration needed_
