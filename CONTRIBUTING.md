# Contributing to OpenCode Agents Library

Thank you for your interest in contributing!

**Language:** [English](./CONTRIBUTING.md) | [Português](./CONTRIBUTING.pt-BR.md)

---

## How to Contribute

### Adding a New Agent

1. **Create the agent file:**
   ```bash
   # For a new domain
   mkdir -p src/agents/[new-domain]
   touch src/agents/[new-domain]/[agent-name].md

   # For existing domain
   touch src/agents/[existing-domain]/[agent-name].md
   ```

2. **Follow the agent schema:**
   ```yaml
   ---
   description: Clear description of what the agent does
   mode: subagent  # or 'primary' or 'all'
   tools:
     write: false
     edit: false
     bash: false
   ---

   You are a [role]. Focus on:
   - [Specific capability 1]
   - [Specific capability 2]
   ```

3. **Validate:**
   ```bash
   ./scripts/validate.sh
   ```

4. **Update `agents.json`:**
   - Add new domain if created
   - Add agent to domain's agent list

### Adding a New Domain

1. Create directory: `src/agents/[new-domain]/`
2. Add at least one agent
3. Update `agents.json` with domain entry
4. Create documentation section in `docs/DOMAINS.md`
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
- [ ] Tools are explicitly set (not relying on defaults)
- [ ] Prompt is clear and specific
- [ ] Agent follows Single Responsibility Principle
- [ ] Validation script passes

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow existing code style
