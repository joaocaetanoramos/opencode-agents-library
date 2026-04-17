# OpenCode Agents Library

A curated collection of custom agents and teams for [OpenCode](https://opencode.ai), organized by domain following SOLID principles and Clean Code standards.

**Languages:** [English](./README.md) | [Português](./README.pt-BR.md)

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
| `agents-cli team install` | Install complete teams |
| `agents-cli team list` | List available teams |
| `agents-cli remove` | Remove installed agents |
| `agents-cli list` | List all available and installed agents |
| `agents-cli check` | Check OpenCode status |
| `agents-cli help` | Show help |

### Team Commands

| Command | Description |
|---------|-------------|
| `agents-cli team list` | List all available teams |
| `agents-cli team install saas` | Install SaaS team |
| `agents-cli team install saas-builder-docker` | Install SaaS with Docker/Dokploy |
| `agents-cli team install team-builder` | Install team builder |

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
agents-cli team install saas           # Install SaaS team
agents-cli team install saas-builder-docker -g  # Install Docker team to global
agents-cli remove -a code-reviewer
agents-cli list
```

The CLI uses **symlinks** instead of copying files:
- Agents are always up-to-date with the repository
- Just run `git pull` to update all agents
- No backup needed

---

## Available Agents

### By Domain

| Domain | Agents |
|--------|--------|
| **security** | `security-auditor` |
| **documentation** | `docs-writer` |
| **code-review** | `code-reviewer`, `sdd-compliance` |
| **planning** | `architect`, `requirements-analyzer` |
| **coding** | `code-generator`, `test-generator` |
| **creation** | `agent-builder` |
| **infrastructure** | `docker-specialist` |

### Teams

| Team | Description | Agents |
|------|-------------|--------|
| **saas** | Complete SaaS development team | architect, code-generator, sdd-compliance + more |
| **saas-builder-docker** | SaaS with Docker/Dokploy deployment | All saas agents + docker-specialist |
| **team-builder** | Meta-team for creating new teams | agent-builder, architect, docs-writer |

---

## Development vs Installation

This repository contains **development files** (STATUS.md, CHANGELOG.md) and **agent files**.

**Only install the `.md` agent files** - the CLI handles this automatically.

---

## Project Structure

```
opencode-agents-library/
├── src/
│   ├── agents/
│   │   ├── security/           # Security agents
│   │   ├── documentation/      # Documentation agents
│   │   ├── code-review/         # Code review agents
│   │   ├── planning/            # Planning agents
│   │   ├── coding/              # Coding agents
│   │   ├── creation/            # Agent creation
│   │   ├── infrastructure/      # Infrastructure agents
│   │   └── teams/               # Pre-configured teams
│   │       ├── saas/
│   │       ├── saas-builder-docker/
│   │       └── team-builder/
│   ├── cli/                     # CLI source code
│   ├── shared/                  # Shared prompts and configs
│   └── scripts/                 # Utility scripts
├── bin/
│   └── agents.js                # CLI entry point
├── docs/                        # Documentation
├── package.json
└── agents.json                  # Agent and team index
```

---

## Creating New Agents

See [Development Guide](docs/DEVELOPMENT.md) for complete instructions.

**Quick Summary:**
1. Use `@agent-builder create a new agent` to get started
2. Or manually create agent in `src/agents/[domain]/[agent-name]/`
3. Follow the `permission` schema (not deprecated `tools`)
4. Create `STATUS.md` and `CHANGELOG.md` to track development
5. Run `./scripts/validate.sh` to verify

---

## Agent File Structure

Each agent has its own subfolder:

```
src/agents/{domain}/{agent-name}/
├── {agent-name}.md    # Main agent file (installed)
├── STATUS.md          # Development tracking
└── CHANGELOG.md       # Version history
```

---

## Team Structure

Teams have additional documentation:

```
src/agents/teams/{team-name}/
├── {team-name}.md           # Team leader (installed)
├── {team-name}.team.md     # Team file (for CLI)
├── STATUS.md
├── CHANGELOG.md
└── docs/
    ├── OVERVIEW.md         # Team documentation
    └── available-tools.md  # Tools available to team
```

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