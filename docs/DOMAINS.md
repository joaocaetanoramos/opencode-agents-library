# Domains

This document describes the domain organization and how to extend it.

## Existing Domains

### Security

**Path:** `src/agents/security/`

**Purpose:** Security auditing, vulnerability detection, and secure coding practices.

**Agents:**
- `security-auditor` - Identifies security vulnerabilities and risks

**Focus areas:**
- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues

---

### Documentation

**Path:** `src/agents/documentation/`

**Purpose:** Technical documentation generation and maintenance.

**Agents:**
- `docs-writer` - Creates clear, comprehensive documentation

**Focus areas:**
- API documentation
- README files
- Code examples
- User guides
- Architecture documentation

---

### Code Review

**Path:** `src/agents/code-review/`

**Purpose:** Code quality analysis and best practices enforcement.

**Agents:**
- `code-reviewer` - Reviews code for quality and maintainability

**Focus areas:**
- Code quality and readability
- Performance implications
- Design patterns
- Error handling
- Test coverage

---

### Debug

**Path:** `src/agents/debug/`

**Purpose:** Investigation and troubleshooting of issues.

**Status:** Reserved for future agents

---

### Exploration

**Path:** `src/agents/exploration/`

**Purpose:** Fast codebase exploration and search.

**Status:** Reserved for future agents

---

## Creating a New Domain

### Step 1: Create Directory

```bash
mkdir -p src/agents/[new-domain]
```

### Step 2: Create Agent Files

At least one agent required per domain.

```bash
touch src/agents/[new-domain]/example-agent.md
```

### Step 3: Define Agent

Follow the schema in `src/shared/configs/agent-schema.json`:

```yaml
---
description: Clear description of agent purpose
mode: subagent
tools:
  write: false
  edit: false
  bash: false
---

You are a [role description]. Focus on:
- [Capability 1]
- [Capability 2]
```

### Step 4: Update agents.json

Add entry to the `domains` object:

```json
"[new-domain]": {
  "path": "src/agents/[new-domain]",
  "description": "Domain purpose",
  "agents": ["example-agent"]
}
```

### Step 5: Document Domain

Add section to this file following the existing format.

### Step 6: Validate

```bash
./scripts/validate.sh
```

---

## Domain Principles

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | Each domain has a focused purpose |
| **Open/Closed** | Extend via new agents, not modification |
| **Liskov Substitution** | Agents can be swapped within same domain |
| **Interface Segregation** | Domain-specific, not generic agents |
| **Dependency Inversion** | Shared configs in `src/shared/` |

---

## Adding Agents to Existing Domain

1. Create file: `src/agents/[domain]/[new-agent].md`
2. Follow agent schema
3. Update `agents.json` domain entry
4. Validate and commit
