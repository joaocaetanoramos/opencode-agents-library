# Team Files Implementation Plan

> Plan for implementing team-based agent organization in opencode-agents-library

**Status:** 🟡 In Progress
**Created:** 2026-04-17
**Last Updated:** 2026-04-17

---

## Overview

This plan covers the reorganization of agents from a monolithic `saas/` domain to a modular team-based structure, enabling agent reuse across different teams.

---

## Current State

```
src/agents/saas/                    # PROBLEM: All agents coupled to SAAS
├── saas-project-generator.md        # Team leader (but coupled)
├── saas-architect.md               # SAAS-specific (should be reusable)
├── saas-code-generator.md          # SAAS-specific (should be reusable)
├── saas-validator.md               # SAAS-specific (should be reusable)
├── STATUS.md
├── CHANGELOG.md
docs/
├── SAAS-GENERATOR-DISCOVERY.md     # PROBLEM: Should be with agent
└── available-tools.md              # PROBLEM: Should be with agent
```

---

## Target State

```
src/agents/
├── planning/                        # NEW: Reusable planning agents
│   ├── architect.md               # FROM: saas-architect (adapted)
│   ├── requirements-analyzer.md   # FUTURE
│   ├── STATUS.md
│   └── CHANGELOG.md
│
├── coding/                         # NEW: Reusable coding agents
│   ├── code-generator.md          # FROM: saas-code-generator (adapted)
│   ├── test-generator.md          # FUTURE
│   ├── STATUS.md
│   └── CHANGELOG.md
│
├── review/                         # EXPAND: Reusable review agents
│   ├── sdd-compliance.md          # FROM: saas-validator (renamed)
│   ├── code-reviewer.md           # EXISTS in code-review/
│   └── (integrate code-reviewer here?)
│
├── documentation/                   # EXISTS
│   └── docs-writer.md
│
├── security/                        # EXISTS
│   └── security-auditor.md
│
├── teams/
│   └── saas/                       # NEW: SAAS team
│       ├── saas-project-generator.md  # Team leader
│       ├── saas.team.md               # Team file (for CLI)
│       ├── STATUS.md
│       ├── CHANGELOG.md
│       └── docs/
│           ├── SAAS-GENERATOR-DISCOVERY.md  # MOVED
│           └── available-tools.md         # MOVED
```

---

## Implementation Steps

### Step 1: Create Domain Structure

- [ ] Create `src/agents/planning/` directory
- [ ] Create `src/agents/coding/` directory
- [ ] Create `src/agents/teams/saas/docs/` directory
- [ ] Copy templates to new domains

### Step 2: Adapt and Move Architect

- [ ] Read current `saas-architect.md`
- [ ] Adapt for generic use (remove "saas" references)
- [ ] Move to `src/agents/planning/architect.md`
- [ ] Create `src/agents/planning/STATUS.md`
- [ ] Create `src/agents/planning/CHANGELOG.md`

### Step 3: Adapt and Move Code Generator

- [ ] Read current `saas-code-generator.md`
- [ ] Adapt for generic use (remove "saas" references)
- [ ] Move to `src/agents/coding/code-generator.md`
- [ ] Create `src/agents/coding/STATUS.md`
- [ ] Create `src/agents/coding/CHANGELOG.md`

### Step 4: Adapt and Move SDD Validator

- [ ] Read current `saas-validator.md`
- [ ] Rename to `sdd-compliance.md` (clearer purpose)
- [ ] Adapt for generic use (remove "saas" references)
- [ ] Move to `src/agents/review/sdd-compliance.md`
- [ ] Update `src/agents/review/STATUS.md` if exists

### Step 5: Create SAAS Team Directory

- [ ] Create `src/agents/teams/saas/docs/`
- [ ] Move `docs/SAAS-GENERATOR-DISCOVERY.md` to `src/agents/teams/saas/docs/`
- [ ] Move `docs/available-tools.md` to `src/agents/teams/saas/docs/`
- [ ] Create `src/agents/teams/saas/saas-project-generator.md`
- [ ] Create `src/agents/teams/saas/saas.team.md`
- [ ] Create `src/agents/teams/saas/STATUS.md`
- [ ] Create `src/agents/teams/saas/CHANGELOG.md`

### Step 6: Delete Old Files

- [ ] Remove `src/agents/saas/` directory
- [ ] Remove old `docs/SAAS-GENERATOR-DISCOVERY.md`
- [ ] Remove old `docs/available-tools.md`

### Step 7: Update agents.json

- [ ] Add `planning/` domain
- [ ] Add `coding/` domain
- [ ] Add `teams/` domain
- [ ] Update/remove `saas/` domain entry

### Step 8: Update CLI

- [ ] Read current CLI code
- [ ] Add team file support (`.team.md`)
- [ ] Add team installation logic
- [ ] Update `install.js` to handle teams

### Step 9: Documentation

- [ ] Create `docs/TEAMS.md` explaining team files
- [ ] Update `docs/DEVELOPMENT.md` if needed
- [ ] Update `docs/ARCHITECTURE.md` to mention teams

### Step 10: Validation

- [ ] Run `./scripts/validate.sh`
- [ ] Fix any errors
- [ ] Test team installation via CLI

---

## Agent Adaptation Guidelines

Each agent must be adapted to work with any team leader:

### Before (Coupled)
```yaml
---
description: SaaS architect that works with saas-project-generator
---

You are invoked by saas-project-generator...
Return the SDD to saas-project-generator...
```

### After (Generic)
```yaml
---
description: Analyzes requirements and generates Software Design Document (SDD)
---

You are an architect agent. Your team leader will provide requirements.
You will receive input from your orchestrator in this format:

## Requirements
[requirements provided by team leader]

## Your Task
1. Analyze the requirements
2. Select appropriate technology stack
3. Generate a Software Design Document (SDD)

## Output
Return the complete SDD to your team leader for review.
```

---

## Team File Schema

```yaml
# src/agents/teams/saas/saas.team.md
---
description: Complete SaaS development team with planning, coding, review and documentation
version: 1.0.0
team_leader: saas-project-generator

agents:
  planning:
    - architect
  coding:
    - code-generator
  review:
    - sdd-compliance
    - code-reviewer
  documentation:
    - docs-writer

workflow:
  1_design: architect
  2_implement: code-generator
  3_review: [sdd-compliance, code-reviewer]
  4_document: docs-writer

settings:
  task_file: TASKS.md
  sdd_file: SOFTWARE-DESIGN-DOCUMENT.md
  requirements_file: REQUIREMENTS.md
```

---

## CLI Changes Required

### New Commands
```bash
# Install entire team
opencode team install saas

# Install team leader only
opencode team install saas --leader-only

# List available teams
opencode team list
```

### New Logic in install.js
1. Detect `.team.md` files
2. Parse team file to get agent list
3. Install team leader first
4. Install all agents listed in `agents:` section
5. Create necessary symlinks

---

## Files to Modify

| File | Action |
|------|--------|
| `src/agents/planning/architect.md` | Create (from adapted saas-architect) |
| `src/agents/coding/code-generator.md` | Create (from adapted saas-code-generator) |
| `src/agents/review/sdd-compliance.md` | Create (from adapted saas-validator) |
| `src/agents/teams/saas/saas-project-generator.md` | Move + adapt |
| `src/agents/teams/saas/saas.team.md` | Create |
| `src/agents/teams/saas/docs/*.md` | Move from docs/ |
| `src/agents/saas/*` | Delete |
| `docs/SAAS-GENERATOR-DISCOVERY.md` | Delete (moved) |
| `docs/available-tools.md` | Delete (moved) |
| `agents.json` | Update domains |
| `cli/install.js` | Add team support |
| `docs/TEAMS.md` | Create |

---

## Progress Log

### 2026-04-17
- Plan created
- Started implementation

---

## Open Questions

- [ ] Should code-reviewer.md be moved to review/ domain?
- [ ] What about the existing code-review/ domain?
- [ ] Future agents (requirements-analyzer, test-generator) - create stubs or just document?

---

## References

- `docs/DEVELOPMENT.md` - Agent development methodology
- `docs/ARCHITECTURE.md` - Modular architecture principles
- OpenCode Agents Documentation
