---
description: Complete SaaS project development team - orchestrates requirements analysis, architecture, coding, review and documentation
version: 1.0.0
team_leader: saas-build
---

# SaaS Development Team

This team file defines the composition and workflow for the SaaS project development team.

## Team Members

### Team Leader
| Agent | File | Purpose |
|-------|------|---------|
| `saas-build` | `src/agents/teams/saas/saas-build.md` | Orchestrates team, conducts interview |

### Agents (from modular domains)

| Agent | Domain | Purpose |
|-------|--------|---------|
| `requirements-analyzer` | planning | Gathers and refines user requirements |
| `architect` | planning | Analyzes requirements, generates SDD |
| `code-generator` | coding | Generates code from SDD |
| `test-generator` | coding | Generates comprehensive tests |
| `sdd-compliance` | code-review | Validates code against SDD |

## Workflow

```
User
  │
  ▼
saas-build (Team Leader)
  │
  ├──► requirements-analyzer ───► Requirements Document
  │
  ├──► architect ──────────────► SDD
  │
  ├──► code-generator ─────────► Code
  │
  ├──► test-generator ─────────► Tests
  │
  └──► sdd-compliance ─────────► Validation Report
```

### Phases

| Phase | Agent | Output |
|-------|-------|--------|
| 1. Interview | (team leader) / requirements-analyzer | Requirements Document |
| 2. Architecture | `architect` | Software Design Document |
| 3. Implementation | `code-generator` | Project files |
| 4. Testing | `test-generator` | Test suite |
| 5. Validation | `sdd-compliance` | Validation report |

## Installation

```bash
# Install entire team
opencode team install saas

# This will install:
# - saas-build (team leader)
# - requirements-analyzer (from planning/)
# - architect (from planning/)
# - code-generator (from coding/)
# - test-generator (from coding/)
# - sdd-compliance (from code-review/)
```

## Files

### Team Leader
- `src/agents/teams/saas/saas-build.md`

### Team Documentation
- `src/agents/teams/saas/docs/SAAS-GENERATOR-DISCOVERY.md`
- `src/agents/teams/saas/docs/available-tools.md`

### Modular Agents
- `src/agents/planning/requirements-analyzer.md`
- `src/agents/planning/architect.md`
- `src/agents/coding/code-generator.md`
- `src/agents/coding/test-generator.md`
- `src/agents/code-review/sdd-compliance.md`

## Settings

```yaml
task_file: TASKS.md
sdd_file: SOFTWARE-DESIGN-DOCUMENT.md
requirements_file: REQUIREMENTS.md
```

## Notes

- The team leader uses the Task tool to invoke agents
- Agents are hidden (not visible in @ menu) - only leader visible
- All agents can be reused in other teams
