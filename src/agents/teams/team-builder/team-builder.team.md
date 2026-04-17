---
description: Creates new teams following the repository methodology with versioning support
version: 1.0.0
team_leader: team-builder
---

# Team Builder

This team specializes in creating new agent teams following the repository methodology.

## Team Members

### Team Leader
| Agent | File | Purpose |
|-------|------|---------|
| `team-builder` | `team-builder.md` | Orchestrates team creation |

### Agents (from modular domains)

| Agent | Domain | Purpose |
|-------|--------|---------|
| `agent-builder` | creation | Creates individual agents |
| `architect` | planning | Designs architecture for teams |
| `docs-writer` | documentation | Creates team documentation |

## Workflow

```
User
  │
  ▼
team-builder (Team Leader)
  │
  ├──► agent-builder ────► Creates team structure
  │
  ├──► architect ───────► Designs team workflow
  │
  └──► docs-writer ─────► Creates documentation
```

### Phases

| Phase | Agent | Output |
|-------|-------|--------|
| 1. Analysis | (team leader) | Team requirements |
| 2. Design | `architect` | Team structure |
| 3. Implementation | `agent-builder` | Team files |
| 4. Documentation | `docs-writer` | Team docs |

## Installation

```bash
# Install entire team
agents-cli team install team-builder

# This will install:
# - team-builder (team leader)
# - agent-builder (from creation/)
# - architect (from planning/)
# - docs-writer (from documentation/)
```

## Files

### Team Leader
- `team-builder.md`

### Team Documentation
- `docs/OVERVIEW.md` - Team overview
- `docs/available-tools.md` - Available tools for team building

### Modular Agents
- `src/agents/creation/agent-builder/agent-builder.md`
- `src/agents/planning/architect/architect.md`
- `src/agents/documentation/docs-writer/docs-writer.md`

## Settings

```yaml
task_file: TASKS.md
team_file: {team-name}.team.md
```

## Notes

- The team leader uses the Task tool to invoke agents
- Agents are hidden (not visible in @ menu) - only leader visible
- All agents can be reused in other teams