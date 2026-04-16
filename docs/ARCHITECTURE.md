# Architecture

## Overview

The OpenCode Agents Library follows modular architecture principles, enabling easy extension and maintenance.

---

## Arquitetura

### Visão Geral

A Biblioteca de Agentes OpenCode segue princípios de arquitetura modular, permitindo fácil extensão e manutenção.

---

## High-Level Structure

```
opencode-agents-library/
├── src/
│   ├── agents/           # Domain-specific agents
│   ├── shared/           # Reusable components
│   └── scripts/          # Automation
├── docs/                 # Documentation
└── .github/              # CI/CD
```

---

## Estrutura de Alto Nível

```
opencode-agents-library/
├── src/
│   ├── agents/           # Agentes específicos por domínio
│   ├── shared/           # Componentes reutilizáveis
│   └── scripts/          # Automação
├── docs/                 # Documentação
└── .github/              # CI/CD
```

---

## Design Principles

### Single Responsibility Principle (SRP)

Each agent has a single, well-defined purpose:
- `security-auditor` only handles security
- `docs-writer` only handles documentation

### Open/Closed Principle (OCP)

Agents are **open for extension, closed for modification**:
- Add new agents without changing existing ones
- Add new domains without modifying core structure

### Liskov Substitution Principle (LSP)

All agents follow the same schema and can be substituted:
- Same YAML frontmatter structure
- Same validation rules
- Same interface for OpenCode

### Interface Segregation Principle (ISP)

Domains are separated by concern:
- Security agents don't handle documentation
- Each domain has specific, targeted capabilities

### Dependency Inversion Principle (DIP)

Shared components live in `src/shared/`:
- Prompts and configs are externalized
- Agents reference shared resources, not each other

---

## Princípios de Design

### Princípio de Responsabilidade Única (SRP)

Cada agente tem um propósito único e bem definido:
- `security-auditor` só lida com segurança
- `docs-writer` só lida com documentação

### Princípio Aberto/Fechado (OCP)

Agentes são **abertos para extensão, fechados para modificação**:
- Adicione novos agentes sem alterar os existentes
- Adicione novos domínios sem modificar a estrutura core

### Princípio de Substituição de Liskov (LSP)

Todos os agentes seguem o mesmo schema e podem ser substituídos:
- Mesma estrutura YAML frontmatter
- Mesmas regras de validação
- Mesma interface para o OpenCode

### Princípio de Segregação de Interface (ISP)

Domínios são separados por responsabilidade:
- Agentes de segurança não lidam com documentação
- Cada domínio tem capacidades específicas e direcionadas

### Princípio de Inversão de Dependência (DIP)

Componentes compartilhados vivem em `src/shared/`:
- Prompts e configs são externalizados
- Agentes referenciam recursos compartilhados, não uns aos outros

---

## Component Details

### Agents (`src/agents/`)

Each agent is a Markdown file with YAML frontmatter.

```
---
description: Required
mode: subagent|primary|all
tools: {...}
---

System prompt content...
```

### Shared Prompts (`src/shared/prompts/`)

Reusable prompt templates referenced by agents:
- `base-system.md` - Base system instructions
- `review-guidelines.md` - Common review criteria

### Shared Configs (`src/shared/configs/`)

Schema and validation configurations:
- `agent-schema.json` - JSON Schema for validation

### Scripts (`src/scripts/`)

Automation utilities:
- `validate.sh` - Validates all agents against schema

---

## Detalhes dos Componentes

### Agentes (`src/agents/`)

Cada agente é um arquivo Markdown com YAML frontmatter.

```
---
description: Obrigatório
mode: subagent|primary|all
tools: {...}
---

Conteúdo do prompt do sistema...
```

### Prompts Compartilhados (`src/shared/prompts/`)

Templates de prompt reutilizáveis referenciados por agentes:
- `base-system.md` - Instruções base do sistema
- `review-guidelines.md` - Critérios comuns de revisão

### Configs Compartilhadas (`src/shared/configs/`)

Schema e configurações de validação:
- `agent-schema.json` - JSON Schema para validação

### Scripts (`src/scripts/`)

Utilitários de automação:
- `validate.sh` - Valida todos os agentes contra o schema

---

## Extension Points

| Extension | Location | Process |
|-----------|----------|---------|
| New domain | `src/agents/[domain]/` | Create folder + agent |
| New agent | `src/agents/[domain]/[agent].md` | Follow schema |
| New prompt | `src/shared/prompts/[name].md` | Reference in agent |
| New validation | `src/scripts/` | Add to validate.sh |

---

## Pontos de Extensão

| Extensão | Localização | Processo |
|---------|------------|---------|
| Novo domínio | `src/agents/[dominio]/` | Criar pasta + agente |
| Novo agente | `src/agents/[dominio]/[agente].md` | Seguir schema |
| Novo prompt | `src/shared/prompts/[nome].md` | Referenciar no agente |
| Nova validação | `src/scripts/` | Adicionar ao validate.sh |

---

## Validation Flow

```
Agent File (.md)
    ↓
Frontmatter Extraction
    ↓
JSON Schema Validation (agent-schema.json)
    ↓
Pass/Fail
```

---

## Fluxo de Validação

```
Arquivo do Agente (.md)
    ↓
Extração do Frontmatter
    ↓
Validação JSON Schema (agent-schema.json)
    ↓
Passa/Falha
```

---

## Agent Invocation

```
User: @agent-name [task]
    ↓
OpenCode matches agent by name
    ↓
Loads agent configuration
    ↓
Executes with specified tools/permissions
```

---

## Invocação de Agente

```
Usuário: @nome-do-agente [tarefa]
    ↓
OpenCode corresponde agente pelo nome
    ↓
Carrega configuração do agente
    ↓
Executa com ferramentas/permissões especificadas
```

---

## Future Considerations

- MCP server integration
- Agent chaining/composition
- Custom permission granularities
- Domain-specific models

---

## Considerações Futuras

- Integração com servidor MCP
- Encadeamento/composição de agentes
- Granularidades de permissão customizadas
- Modelos específicos por domínio
