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

2. Link the CLI globally:
```bash
npm link
```

3. Use from any project:
```bash
agents-cli install -g -a code-reviewer docs-writer
```

### Interactive Mode

Run without arguments for interactive menu:
```bash
agents-cli
```

---

## CLI Usage

### Commands

| Command | Description |
|---------|-------------|
| `agents-cli install` | Install agents (interactive or specified) |
| `agents-cli remove` | Remove installed agents |
| `agents-cli list` | List all available and installed agents |
| `agents-cli check` | Check OpenCode status |
| `agents-cli help` | Show help |

### Options

| Option | Description |
|--------|-------------|
| `-g, --global` | Install to global directory |
| `-p, --project` | Install to project directory |
| `-a, --agent` | Specify agent name(s) |
| `-A, --all` | Select all agents |

### Examples

```bash
agents-cli install                     # Interactive (project mode)
agents-cli install -g                 # Interactive (global mode)
agents-cli install -g -a code-reviewer # Install specific to global
agents-cli install -A -g               # Install all to global
agents-cli install -a code-reviewer docs-writer security-auditor
agents-cli remove -a code-reviewer
agents-cli list
agents-cli check
```

The CLI uses **symlinks** instead of copying files:
- Agents are always up-to-date with the repository
- Just run `git pull` to update all agents
- No backup needed

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
│   ├── cli/                  # CLI source code
│   │   └── index.js
│   ├── shared/               # Shared prompts and configs
│   │   ├── prompts/
│   │   ├── configs/
│   │   └── templates/
│   └── scripts/              # Utility scripts
├── bin/
│   └── agents.js             # CLI entry point
├── package.json              # npm package config
├── docs/                    # Documentation
├── reference/               # External reference materials
└── agents.json             # Agent index
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