# OpenCode Agents Library

A curated collection of custom agents for [OpenCode](https://opencode.ai), organized by domain and following SOLID principles.

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joaoramos/opencode-agents-library.git
cd opencode-agents-library
```

2. Link agents to your OpenCode config:

**Global installation:**
```bash
cp -r src/agents/* ~/.config/opencode/agents/
```

**Project-specific:**
```bash
cp -r src/agents/* .opencode/agents/
```

### Usage

After installation, invoke agents via `@mention`:

```
@security-auditor review this code for vulnerabilities
@docs-writer generate API documentation
@code-reviewer analyze this PR
```

## Available Agents

### Security
| Agent | Description |
|-------|-------------|
| `security-auditor` | Identifies security vulnerabilities and risks |

### Documentation
| Agent | Description |
|-------|-------------|
| `docs-writer` | Creates and maintains technical documentation |

### Code Review
| Agent | Description |
|-------|-------------|
| `code-reviewer` | Reviews code for quality and best practices |

## Project Structure

```
opencode-agents-library/
├── src/
│   ├── agents/              # Agent definitions by domain
│   │   ├── security/
│   │   ├── documentation/
│   │   └── code-review/
│   ├── shared/              # Shared prompts and configs
│   │   ├── prompts/
│   │   └── configs/
│   └── scripts/             # Utility scripts
├── docs/                    # Documentation
├── .github/                 # GitHub workflows
└── agents.json             # Agent index
```

## Adding New Agents

See [DOMAINS.md](docs/DOMAINS.md) for detailed instructions.

**Summary:**
1. Create agent file in `src/agents/[domain]/[agent-name].md`
2. Follow the schema in `src/shared/configs/agent-schema.json`
3. Update `agents.json` with new domain/agent
4. Run `scripts/validate.sh` to verify

## Validating Agents

```bash
./scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
