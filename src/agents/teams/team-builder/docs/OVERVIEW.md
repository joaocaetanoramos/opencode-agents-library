# Team Builder - Overview

Team Builder is a meta-team that specializes in creating new agent teams following the repository methodology.

## Purpose

When you need a new team for a specific domain (e.g., API development, data analysis, CI/CD), Team Builder can help you create it with the correct structure and documentation.

## Usage

Invoke `@team-builder` and describe what kind of team you need:

```
@team-builder I need a team for API documentation
```

The team builder will:
1. Analyze your requirements
2. Design the team structure
3. Create the team files
4. Generate documentation

## Team Structure

Teams created by team-builder follow this format:

```
src/agents/teams/{team-name}/
├── {team-name}.team.md       # Team definition
├── {team-leader}.md          # Team leader agent
├── STATUS.md                  # Development status
├── CHANGELOG.md               # Version history
└── docs/
    ├── OVERVIEW.md           # Team overview
    └── available-tools.md    # Available tools
```

## Available Tools

Team Builder uses these agents:

| Agent | Purpose |
|-------|---------|
| `agent-builder` | Creates individual agents |
| `architect` | Designs team workflows |
| `docs-writer` | Creates documentation |

## Examples

### Creating a Data Team

```
@team-builder Create a data processing team with agents for ETL, analysis, and visualization
```

### Creating a CI/CD Team

```
@team-builder Create a CI/CD team with agents for testing, deployment, and monitoring
```

## Notes

- Team Builder creates teams following the repository methodology
- Created teams can be installed via `agents-cli team install <name>`
- Each team has its own leader and modular agents