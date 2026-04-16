# Domains

This document describes the domain organization and how to extend it.

**Language:** [English](./DOMAINS.md) | [Português](./DOMAINS.pt-BR.md)

---

## Development Guide

For detailed instructions on creating, developing, and versioning agents, see the [Development Guide](./DEVELOPMENT.md).

---

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

### Creation

**Path:** `src/agents/creation/`

**Purpose:** Agent creation and generation following repository methodology.

**Agents:**
- `agent-generator` - Generates new agents with versioning support

**Focus areas:**
- Requirements analysis and agent design
- Structured agent creation (STATUS.md, CHANGELOG.md, {agent}.md)
- Following repository methodology
- Validation and quality checks

---

## Creating a New Domain

For a complete step-by-step guide including templates and versioning strategy, see the [Development Guide](./DEVELOPMENT.md).

### Quick Start

1. Create directory and copy templates:
```bash
mkdir -p src/agents/[new-domain]
cp src/shared/templates/STATUS.md src/agents/[new-domain]/
cp src/shared/templates/CHANGELOG.md src/agents/[new-domain]/
```

2. Edit `STATUS.md` and create your agent file

3. Update `agents.json` with domain entry

4. Validate:
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
