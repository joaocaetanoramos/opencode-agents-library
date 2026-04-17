# OpenCode Agents CLI

Interactive CLI tool to manage OpenCode agents using symlinks.

## Setup

```bash
cd cli
npm install
```

## Usage

```bash
node install.js
```

## Features

- **Install agents (global)** - Create symlinks in `~/.config/opencode/agents/`
- **Install agents (project)** - Create symlinks in `.opencode/agents/`
- **Remove agents** - Remove symlinks from global/project
- **List installed agents** - Show which agents are installed where
- **Check OpenCode status** - Detect if OpenCode is running

## Navigation

- **↑↓** - Navigate between options
- **Enter** - Select
- **Space** - Toggle checkbox selection

## How It Works

Uses symlinks instead of copying files:
- `ln -sf` creates symlinks from repository to destination
- Agents are always up-to-date with the repository
- Just run `git pull` in the repository to update all agents
- No backup needed

## Requirements

- Node.js 18+
- npm