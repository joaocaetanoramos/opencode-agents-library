# Team Builder - Available Tools

This document describes the tools available for team creation.

## Core Agents

### agent-builder (creation)

Creates individual agents following the repository methodology.

**Capabilities:**
- Analyzes requirements for new agents
- Creates agent directory structure
- Generates STATUS.md and CHANGELOG.md
- Updates agents.json

**When to use:**
- Creating new agents for a team
- Expanding existing domains

### architect (planning)

Designs team workflows and structures.

**Capabilities:**
- Analyzes team requirements
- Designs workflow patterns
- Specifies agent interactions
- Plans team expansion

**When to use:**
- Planning new team workflows
- Designing agent collaboration

### docs-writer (documentation)

Creates comprehensive team documentation.

**Capabilities:**
- Generates OVERVIEW.md
- Creates available-tools.md
- Documents team workflows
- Writes usage examples

**When to use:**
- Documenting new teams
- Creating usage guides

## Team File Schema

```yaml
---
description: Team description
version: 1.0.0
team_leader: team-leader-name
---

# Team Name

[Team documentation]
```

## Workflow Patterns

### Linear Workflow
```
leader → agent1 → agent2 → agent3
```

### Parallel Workflow
```
         → agent1 →
leader ─→ agent2 ─→ merger
         → agent3 →
```

### Hierarchical Workflow
```
leader
  ├── agent1
  │    └── subagent1a
  │    └── subagent1b
  └── agent2
```

## Best Practices

1. **Start simple** - Teams with 2-3 agents are easier to maintain
2. **Use existing agents** - Don't recreate agents that exist
3. **Document everything** - Every team needs proper docs/
4. **Plan for expansion** - Leave room for adding agents later