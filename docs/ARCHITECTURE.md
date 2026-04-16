# Architecture

## Overview

The OpenCode Agents Library follows modular architecture principles, enabling easy extension and maintenance.

## High-Level Structure

```
opencode-agents-library/
├── src/
│   ├── agents/           # Domain-specific agents
│   ├── shared/           # Reusable components
│   └── scripts/          # Automation
├── docs/                 # Documentation
└── .github/              # CI/CD
```

## Design Principles

### Single Responsibility Principle (SRP)

Each agent has a single, well-defined purpose:
- `security-auditor` only handles security
- `docs-writer` only handles documentation

### Open/Closed Principle (OCP)

Agents are **open for extension, closed for modification**:
- Add new agents without changing existing ones
- Add new domains without modifying core structure

### Liskov Substitution Principle (LSP)

All agents follow the same schema and can be substituted:
- Same YAML frontmatter structure
- Same validation rules
- Same interface for OpenCode

### Interface Segregation Principle (ISP)

Domains are separated by concern:
- Security agents don't handle documentation
- Each domain has specific, targeted capabilities

### Dependency Inversion Principle (DIP)

Shared components live in `src/shared/`:
- Prompts and configs are externalized
- Agents reference shared resources, not each other

## Component Details

### Agents (`src/agents/`)

Each agent is a Markdown file with YAML frontmatter.

```
---
description: Required
mode: subagent|primary|all
tools: {...}
---

System prompt content...
```

### Shared Prompts (`src/shared/prompts/`)

Reusable prompt templates referenced by agents:
- `base-system.md` - Base system instructions
- `review-guidelines.md` - Common review criteria

### Shared Configs (`src/shared/configs/`)

Schema and validation configurations:
- `agent-schema.json` - JSON Schema for validation

### Scripts (`src/scripts/`)

Automation utilities:
- `validate.sh` - Validates all agents against schema

## Extension Points

| Extension | Location | Process |
|-----------|----------|---------|
| New domain | `src/agents/[domain]/` | Create folder + agent |
| New agent | `src/agents/[domain]/[agent].md` | Follow schema |
| New prompt | `src/shared/prompts/[name].md` | Reference in agent |
| New validation | `src/scripts/` | Add to validate.sh |

## Validation Flow

```
Agent File (.md)
    ↓
Frontmatter Extraction
    ↓
JSON Schema Validation (agent-schema.json)
    ↓
Pass/Fail
```

## Agent Invocation

```
User: @agent-name [task]
    ↓
OpenCode matches agent by name
    ↓
Loads agent configuration
    ↓
Executes with specified tools/permissions
```

## Future Considerations

- MCP server integration
- Agent chaining/composition
- Custom permission granularities
- Domain-specific models
