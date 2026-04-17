# Team Files

> How to create and manage agent teams in opencode-agents-library

**Language:** [English](./TEAMS.md) | Português (this page)

---

## Overview

Team files allow you to define pre-configured groups of agents that work together on specific tasks. Teams consist of a **team leader** (a primary agent) and one or more **specialized agents** (subagents).

## Why Teams?

| Without Teams | With Teams |
|--------------|------------|
| Install agents one by one | Install entire team at once |
| Agents may not work well together | Agents are pre-configured to collaborate |
| Manual configuration required | Team leader orchestrates automatically |

---

## Team Structure

```
src/agents/teams/{team-name}/
├── {team-leader}.md          # Primary agent (the leader)
├── {team-name}.team.md       # Team definition file
├── STATUS.md                  # Development tracking
├── CHANGELOG.md              # Version history
└── docs/                     # Team documentation
    ├── OVERVIEW.md
    └── available-tools.md    # Team-specific tools
```

---

## Team File Schema

```yaml
---
description: Team description
version: 1.0.0
team_leader: agent-name
---

# Team documentation
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes | Brief description of the team |
| `version` | Yes | Semantic version |
| `team_leader` | Yes | Name of the primary agent |

### Example

```yaml
# src/agents/teams/saas/saas.team.md
---
description: Complete SaaS project development team
version: 1.0.0
team_leader: saas-project-generator
---

# SaaS Development Team

This team specializes in creating complete SaaS projects.

## Workflow

1. Interview → 2. Architecture → 3. Code → 4. Review
```

---

## agents.json Configuration

Teams must be registered in `agents.json`:

```json
{
  "teams": {
    "saas": {
      "path": "src/agents/teams/saas",
      "team_leader": "saas-project-generator",
      "team_file": "saas.team.md",
      "description": "Complete SaaS project development team",
      "agents": ["architect", "code-generator", "sdd-compliance"]
    }
  }
}
```

### Fields

| Field | Description |
|-------|-------------|
| `path` | Directory path to the team files |
| `team_leader` | The primary agent that leads this team |
| `team_file` | The team definition file |
| `description` | Brief team description |
| `agents` | List of agent names used by this team |

---

## CLI Usage

```bash
# List available teams
agents-cli team list

# Install a team (project level)
agents-cli team install saas

# Install a team (global level)
agents-cli team install saas -g
```

### Interactive Mode

```bash
agents-cli
# Select "Install team" from the menu
```

---

## Creating a New Team

### Step 1: Create Team Directory

```bash
mkdir -p src/agents/teams/myteam/docs
```

### Step 2: Create Team Leader Agent

Create `{team-leader}.md` in the team directory:

```yaml
---
description: My team leader
mode: primary
permission:
  write: allow
  edit: allow
  bash:
    "*": ask
  webfetch: allow
  task:
    "*": deny
    "specialist-agent": allow
---

You are the leader of my team...
```

### Step 3: Create Team File

Create `{team-name}.team.md`:

```yaml
---
description: My custom team for specialized tasks
version: 1.0.0
team_leader: team-leader
---

# My Team

## Agents
- team-leader (this file)
- specialist-agent (from planning/)
```

### Step 4: Register in agents.json

Add to the `teams` section:

```json
{
  "teams": {
    "myteam": {
      "path": "src/agents/teams/myteam",
      "team_leader": "team-leader",
      "team_file": "myteam.team.md",
      "description": "My custom team",
      "agents": ["specialist-agent"]
    }
  }
}
```

### Step 5: Create Documentation

Add `docs/OVERVIEW.md` and other documentation as needed.

---

## Modular vs Team-Specific Agents

### Modular Agents

Agents in domains like `planning/`, `coding/`, `review/` are **modular**:

- Can be used by any team
- Have generic prompts
- Don't reference specific team leaders

### Team-Specific Agents

Team leaders are **team-specific**:

- Reference their team documentation
- Invoke team-specific subagents
- May have custom workflows

---

## Best Practices

1. **Keep agents modular** - Specialized agents should work with any team leader
2. **Document team workflow** - Add clear documentation in the team file
3. **Use semantic versioning** - Follow SemVer for team versions
4. **Register in agents.json** - Teams must be registered to appear in CLI

---

## See Also

- [Development Guide](./DEVELOPMENT.md) - Agent development methodology
- [Architecture](./ARCHITECTURE.md) - Modular architecture principles
- [CLI Source](../../src/cli/index.js) - Team installation implementation
