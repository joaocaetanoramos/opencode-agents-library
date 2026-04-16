# OpenCode Internal Agents Reference

This folder contains the internal prompts and configurations from the OpenCode codebase, for reference and study purposes.

**Source:** [anomalyco/opencode](https://github.com/anomalyco/opencode) - `packages/opencode/src/agent/`

## Files

### Prompts (`prompts/`)

| File | Agent | Type | Description |
|------|-------|------|-------------|
| `explore.txt` | `explore` | subagent | File search specialist for codebase exploration |
| `compaction.txt` | `compaction` | system (hidden) | Compacts long context into summaries |
| `summary.txt` | `summary` | system (hidden) | Creates session summaries |
| `title.txt` | `title` | system (hidden) | Generates short session titles |

### Agent Definitions

| File | Description |
|------|-------------|
| `agent.ts` | TypeScript source showing how built-in agents are configured |

### Generation

| File | Description |
|------|-------------|
| `generate.txt` | Prompt used to generate new agents via `opencode agent create` |

## Built-in Agents Summary

### Primary Agents

- **build** - Default agent with full tool access
- **plan** - Read-only for analysis, denies edits, asks for bash

### Subagents

- **general** - Multi-step tasks, full access except todo
- **explore** - Fast codebase search, read-only

### Hidden System Agents

- **compaction** - Auto-compacts context
- **title** - Auto-generates session titles
- **summary** - Auto-creates session summaries

## Key Takeaways for Creating Agents

1. Agents can be defined as:
   - **Markdown files** (`.md`) with YAML frontmatter - for custom agents
   - **Inline in TypeScript** - for built-in agents

2. Key frontmatter fields:
   ```yaml
   description: What the agent does
   mode: primary|subagent|all
   permission: {...}
   prompt: path/to/prompt.txt (optional)
   hidden: true|false
   ```

3. Permissions follow glob patterns:
   ```yaml
   permission:
     edit: deny
     bash:
       "*": ask
       "git status": allow
   ```
