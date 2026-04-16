# Agent Generator - Changelog

All notable changes to this agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1] - 2026-04-16

### Added
- Initial version of agent-generator
- Single-agent design combining Plan + Build behavior for agent creation
- Workflow: Analyze → Propose → Wait for Approval → Implement
- File creation: STATUS.md, CHANGELOG.md, {agent}.md
- Automatic validation with ./scripts/validate.sh

### Design Decisions

### v0.1
- **Decision:** Single agent instead of Plan/Build split
- **Reason:** OpenCode already has Tab to switch modes. Redundant to replicate. Better to have focused agent on creation.

- **Decision:** Use subagent mode
- **Reason:** Agent should be invoked via @mention for specific tasks, not as primary conversation agent.

- **Decision:** Combine Plan's analysis with Build's execution
- **Reason:** Agent creation benefits from proposing first (like Plan) then implementing (like Build), but with confirmation gate.

---

## Migration Notes

### Upgrading to v0.1
First release. No migration needed.
