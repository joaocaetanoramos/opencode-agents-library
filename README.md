# OpenCode Agents Library

A curated collection of custom agents for [OpenCode](https://opencode.ai), organized by domain and following SOLID principles.

**Language:** [English](./README.md) | [Português](./README.pt-BR.md)

---

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joaocaetanoramos/opencode-agents-library.git
cd opencode-agents-library
```

2. Install and run the CLI:
```bash
cd cli
npm install
node install.js
```

3. Select agents to install via the interactive menu:
   - **Install (global)** - Available for all projects
   - **Install (project)** - Available only in current project

### Usage

After installation, invoke agents via `@mention`:

```
@security-auditor review this code for vulnerabilities
@docs-writer generate API documentation
@code-reviewer analyze this PR
@agent-generator create a new agent
```

---

### CLI Manager

The interactive CLI provides:

- **Install agents (global)** - Create symlinks in `~/.config/opencode/agents/`
- **Install agents (project)** - Create symlinks in `.opencode/agents/`
- **Remove agents** - Remove symlinks from global/project
- **List installed agents** - Show which agents are installed where
- **Check OpenCode status** - Detect if OpenCode is running

The CLI uses **symlinks** instead of copying files:
- Agents are always up-to-date with the repository
- Just run `git pull` to update all agents
- No backup needed

See [cli/README.md](cli/README.md) for details.

---

## Available Agents

| Agent | Domain | Description |
|-------|--------|-------------|
| `security-auditor` | security | Identifies security vulnerabilities and risks |
| `docs-writer` | documentation | Creates and maintains technical documentation |
| `code-reviewer` | code-review | Reviews code for quality and best practices |
| `agent-generator` | creation | Generates new agents following repository methodology |

---

## Development vs Installation

This repository contains **development files** (STATUS.md, CHANGELOG.md) and **agent files**.

**Only install the `.md` agent files** - the CLI handles this automatically.

---

## Project Structure

```
opencode-agents-library/
├── src/
│   ├── agents/              # Agent definitions by domain
│   │   ├── security/
│   │   ├── documentation/
│   │   ├── code-review/
│   │   └── creation/
│   ├── shared/              # Shared prompts and configs
│   │   ├── prompts/
│   │   ├── configs/
│   │   └── templates/       # Development templates
│   └── scripts/             # Utility scripts
├── cli/                     # CLI manager (Node.js)
│   ├── install.js           # Entry point
│   └── package.json
├── docs/                    # Documentation
├── reference/              # External reference materials
├── .github/                 # GitHub workflows
└── agents.json              # Agent index
```

---

## Creating New Agents

See [Development Guide](docs/DEVELOPMENT.md) for complete instructions.

**Quick Summary:**
1. Use `@agent-generator create a new agent` to get started
2. Or manually create `src/agents/[domain]/[agent-name].md`
3. Follow the `permission` schema (not deprecated `tools`)
4. Use `STATUS.md` and `CHANGELOG.md` to track development
5. Run `./scripts/validate.sh` to verify

---

## Validating Agents

```bash
./scripts/validate.sh
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT