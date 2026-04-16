# Agent Development Guide

This guide explains how to develop, version, and release new agents for the OpenCode Agents Library.

**Language:** [English](./DEVELOPMENT.md) | [Português](./DEVELOPMENT.pt-BR.md)

---

## Overview

Each agent follows a lifecycle:

```
Planning → Drafting → Testing → Released → (Enhancements) → v2.0
```

This library uses a **versioned development approach** that allows you to track progress and maintain historical versions for future reference.

---

## Development vs Installation

This repository contains both **development files** and **agent files**:

| File Type | Purpose | Install? |
|-----------|---------|----------|
| `{agent}.md` | Agent definition | YES - copy to `~/.config/opencode/agents/` |
| `STATUS.md` | Development tracking | NO - repository only |
| `CHANGELOG.md` | Version history | NO - repository only |
| `releases/` | Previous versions | NO - repository only |

### Correct Installation

```bash
# Correct - only the agent file
cp src/agents/{domain}/{agent-name}.md ~/.config/opencode/agents/

# Wrong - copying the whole folder includes non-agent files
cp -r src/agents/{domain} ~/.config/opencode/agents/
```

---

## Development Workflow

### 1. Planning Phase

Create the agent structure:

```bash
# Create domain directory
mkdir -p src/agents/{domain}

# Copy templates (for development tracking)
cp src/shared/templates/STATUS.md src/agents/{domain}/
cp src/shared/templates/CHANGELOG.md src/agents/{domain}/
```

Edit `STATUS.md`:
- Set initial version (e.g., `v0.1` or `v1.0`)
- Define the agent's purpose and scope
- List tasks in the roadmap

### 2. Drafting Phase

Create the agent file: `src/agents/{domain}/{agent-name}.md`

**Important:** Use `permission` instead of the deprecated `tools` field.

```yaml
---
description: Brief description of what the agent does
mode: subagent  # or primary, all
permission:
  write: deny
  edit: deny
  bash:
    "*": deny
  webfetch: deny
---

You are a {role}. Focus on:
- {capability 1}
- {capability 2}
```

### 3. Testing Phase

Validate the agent:

```bash
./scripts/validate.sh
```

Test the agent in OpenCode by linking only the agent file:

```bash
# Global (only the .md file)
cp src/agents/{domain}/{agent-name}.md ~/.config/opencode/agents/

# Project-specific (only the .md file)
cp src/agents/{domain}/{agent-name}.md .opencode/agents/
```

### 4. Releasing Phase

When ready to release:

1. Update `CHANGELOG.md` with version info
2. Update `STATUS.md` status to `✅ Released`
3. Update `agents.json` with new domain/agent
4. Update `docs/DOMAINS.md`
5. Commit and create PR

---

## Permission Reference

OpenCode uses `permission` to control agent access. Use strings `"allow"`, `"deny"`, or `"ask"`:

```yaml
permission:
  write: deny       # File creation
  edit: deny        # File modification
  bash: deny       # Shell commands (use patterns below)
  webfetch: deny    # Web requests
```

### Bash Permissions with Patterns

```yaml
bash:
  "*": deny           # Deny all by default
  "git *": ask        # Ask for git commands
  "grep *": allow     # Allow grep
  "./scripts/*": allow # Allow scripts
```

---

## Versioning Strategy

### Semantic Versioning

Agent versions follow [SemVer](https://semver.org/):

- **Major (v1.0 → v2.0):** Breaking changes
- **Minor (v1.0 → v1.1):** New features, backward compatible
- **Patch (v1.0.0 → v1.0.1):** Bug fixes

### Version Retention

When releasing a new version:

1. Copy current agent to `releases/v{prev}/`
2. Move relevant notes to `releases/v{prev}/notes/`
3. Update `CHANGELOG.md`
4. Start new development in main files

### Full Release Structure

```
src/agents/{domain}/
├── {agent-name}.md       # Current version (INSTALL THIS)
├── STATUS.md            # Development status (repository only)
├── CHANGELOG.md         # Version history (repository only)
├── notes/               # Development notes (repository only)
│   └── {YYYY-MM-DD}.md
└── releases/           # Previous versions (repository only)
    └── v1/
        ├── {agent-name}.md
        └── notes/
```

---

## Creating a New Version (v2.0, etc.)

When you want to enhance an existing agent:

1. **Start new development:**
   - Update `STATUS.md` with new version number
   - Change status to 🔴 Planning

2. **Preserve history:**
   ```bash
   mkdir -p src/agents/{domain}/releases/v1
   cp src/agents/{domain}/{agent-name}.md src/agents/{domain}/releases/v1/
   ```

3. **Document decisions:**
   - Add to `CHANGELOG.md`
   - Create notes in `STATUS.md`

4. **Release when ready:**
   - Move previous version to `releases/`
   - Update `STATUS.md` → ✅ Released
   - Update `CHANGELOG.md`

---

## Domain Reservation

Some domains are reserved for future agents:

| Domain | Status | Purpose |
|--------|--------|---------|
| `debug` | Reserved | Debugging assistance |
| `exploration` | Reserved | Codebase exploration |
| `planning` | Reserved | Planning and analysis |

These directories exist but contain no agents yet.

---

## Best Practices

### Agent Design
- Follow [SOLID principles](./ARCHITECTURE.md#design-principles)
- Single responsibility per agent
- Clear, descriptive identifier (kebab-case)
- Use `permission` (not deprecated `tools`)

### Version Control
- Commit `STATUS.md` changes regularly
- Document all design decisions in `CHANGELOG.md`
- Keep notes for future reference

### Installation
- Only copy `{agent}.md` files to `~/.config/opencode/agents/`
- Do NOT copy STATUS.md, CHANGELOG.md, or other development files

### Testing
- Always run `./scripts/validate.sh`
- Test in isolation before releasing
- Consider edge cases

---

## Quick Reference

| Task | Command |
|------|---------|
| Validate agents | `./scripts/validate.sh` |
| Install agent globally | `cp src/agents/{domain}/{agent}.md ~/.config/opencode/agents/` |
| Install agent project | `cp src/agents/{domain}/{agent}.md .opencode/agents/` |

---

## See Also

- [DOMAINS.md](./DOMAINS.md) - Domain organization
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design principles
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [Agent Schema](../shared/configs/agent-schema.json) - Configuration schema
- [OpenCode Agents Docs](https://opencode.ai/docs/agents/) - Official documentation
