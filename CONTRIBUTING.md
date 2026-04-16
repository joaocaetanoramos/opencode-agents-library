# Contributing to OpenCode Agents Library

Thank you for your interest in contributing!

**Language:** [English](./CONTRIBUTING.md) | [Português](./CONTRIBUTING.pt-BR.md)

---

## Development Guide

For detailed instructions on creating, developing, and versioning agents, see the [Development Guide](./docs/DEVELOPMENT.md).

---

## Quick Reference

### Adding a New Agent

1. **Create directory and use templates:**
   ```bash
   mkdir -p src/agents/[domain]
   cp src/shared/templates/STATUS.md src/agents/[domain]/
   cp src/shared/templates/CHANGELOG.md src/agents/[domain]/
   ```

2. **Create the agent file:**
   ```bash
   touch src/agents/[domain]/[agent-name].md
   ```

3. **Follow the agent schema (use `permission`, not `tools`):**
   ```yaml
   ---
   description: Clear description of what the agent does
   mode: subagent  # or 'primary' or 'all'
   permission:
     write: deny
     edit: deny
     bash:
       "*": deny
     webfetch: deny
   ---

   You are a [role]. Focus on:
   - [Specific capability 1]
   - [Specific capability 2]
   ```

4. **Validate:**
   ```bash
   ./scripts/validate.sh
   ```

5. **Update `agents.json`:**
   - Add new domain if created
   - Add agent to domain's agent list

### Adding a New Domain

1. Create directory: `src/agents/[new-domain]/`
2. Copy templates and create agent
3. Update `agents.json` with domain entry
4. Update documentation in `docs/DOMAINS.md`
5. Submit PR

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b domain/agent-name`
3. Make changes and test with `./scripts/validate.sh`
4. Commit with clear messages
5. Push and open a PR

---

## Agent Naming Conventions

- **Files**: `kebab-case.md` (e.g., `security-auditor.md`)
- **Agent ID**: Derived from filename without extension
- **Domains**: lowercase, singular nouns

---

## Quality Checklist

- [ ] Description is 10-200 characters
- [ ] Mode is valid (`primary`, `subagent`, or `all`)
- [ ] Permissions use "allow/deny/ask" (not boolean true/false)
- [ ] Prompt is clear and specific
- [ ] Agent follows Single Responsibility Principle
- [ ] Validation script passes

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow existing code style
