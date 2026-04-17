# Code Review Domain - Changelog

> **⚠️ DEVELOPMENT FILE** - This file is for version history only.
> Do NOT install this file in OpenCode. Only install the individual agent .md files.

All notable changes to this domain are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1] - 2026-04-17

### Added
- `sdd-compliance.md` - Validates generated code against Software Design Document (SDD)
- Domain structure with reusable review agents

### Design Decisions

#### v0.1
- **Decision:** Create modular review agents independent of any team
- **Reason:** Agents should be reusable across different team configurations

- **Decision:** Focus on SDD compliance as primary concern
- **Reason:** Ensures generated code matches intended architecture

- **Decision:** Use bash for file inspection
- **Reason:** Can verify actual file structure without web access

---

## Migration Notes

### Upgrading to v0.1
_Initial release - no migration needed_
