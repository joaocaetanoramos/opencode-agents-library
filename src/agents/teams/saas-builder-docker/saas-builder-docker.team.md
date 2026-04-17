---
description: Complete SaaS project development team with Docker and Dokploy deployment support
version: 1.0.0
team_leader: saas-builder-docker
---

# SaaS Builder Docker Team

This team file defines the composition and workflow for the SaaS project development team with Docker/Dokploy support.

## Team Members

### Team Leader
| Agent | File | Purpose |
|-------|------|---------|
| `saas-builder-docker` | `saas-builder-docker.md` | Orchestrates team, conducts interview, manages Docker |

### Agents (from modular domains)

| Agent | Domain | Purpose |
|-------|--------|---------|
| `requirements-analyzer` | planning | Gathers and refines user requirements |
| `architect` | planning | Analyzes requirements, generates SDD with Docker strategy |
| `code-generator` | coding | Generates code from SDD |
| `test-generator` | coding | Generates comprehensive tests |
| `sdd-compliance` | code-review | Validates code against SDD |
| `docker-specialist` | infrastructure | Generates Dockerfiles and docker-compose.yml |

## Workflow

```
User
  │
  ▼
saas-builder-docker (Team Leader)
  │
  ├──► requirements-analyzer ───► Requirements Document
  │
  ├──► architect ──────────────► SDD (with Docker strategy)
  │
  ├──► code-generator ─────────► Code
  │
  ├──► docker-specialist ─────► Dockerfiles + Compose
  │
  ├──► test-generator ─────────► Tests
  │
  └──► sdd-compliance ─────────► Validation Report
```

### Phases

| Phase | Agent | Output |
|-------|-------|--------|
| 1. Interview | (team leader) / requirements-analyzer | Requirements Document |
| 2. Architecture | `architect` | Software Design Document (with Docker) |
| 3. Implementation | `code-generator` | Project files |
| 4. Docker | `docker-specialist` | Dockerfiles, docker-compose.yml |
| 5. Testing | `test-generator` | Test suite |
| 6. Validation | `sdd-compliance` | Validation report |

## Installation

```bash
# Install entire team
agents-cli team install saas-builder-docker

# This will install:
# - saas-builder-docker (team leader)
# - requirements-analyzer (from planning/)
# - architect (from planning/)
# - code-generator (from coding/)
# - test-generator (from coding/)
# - sdd-compliance (from code-review/)
# - docker-specialist (from infrastructure/)
```

## Files

### Team Leader
- `src/agents/teams/saas-builder-docker/saas-builder-docker.md`

### Team Documentation
- `src/agents/teams/saas-builder-docker/docs/DOCKER-GUIDE.md`
- `src/agents/teams/saas-builder-docker/docs/DOKPLOY-GUIDE.md`

### Modular Agents
- `src/agents/planning/requirements-analyzer.md`
- `src/agents/planning/architect.md`
- `src/agents/coding/code-generator.md`
- `src/agents/coding/test-generator.md`
- `src/agents/code-review/sdd-compliance.md`
- `src/agents/infrastructure/docker-specialist.md`

## Settings

```yaml
task_file: TASKS.md
sdd_file: SOFTWARE-DESIGN-DOCUMENT.md
requirements_file: REQUIREMENTS.md
docker_file: docker-compose.yml
```

## Notes

- The team leader uses the Task tool to invoke agents
- Agents are hidden (not visible in @ menu) - only leader visible
- All agents can be reused in other teams
- Docker is enabled by default for this team
