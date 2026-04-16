# Domains

This document describes the domain organization and how to extend it.

---

## Domínios

Este documento descreve a organização por domínios e como estendê-la.

---

## Existing Domains

### Security

**Path:** `src/agents/security/`

**Purpose:** Security auditing, vulnerability detection, and secure coding practices.

**Agents:**
- `security-auditor` - Identifies security vulnerabilities and risks

**Focus areas:**
- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues

---

### Documentação / Documentation

**Path:** `src/agents/documentation/`

**Purpose:** Technical documentation generation and maintenance.

**Agents:**
- `docs-writer` - Creates clear, comprehensive documentation

**Focus areas:**
- API documentation
- README files
- Code examples
- User guides
- Architecture documentation

---

### Code Review

**Path:** `src/agents/code-review/`

**Purpose:** Code quality analysis and best practices enforcement.

**Agents:**
- `code-reviewer` - Reviews code for quality and maintainability

**Focus areas:**
- Code quality and readability
- Performance implications
- Design patterns
- Error handling
- Test coverage

---

### Debug

**Path:** `src/agents/debug/`

**Purpose:** Investigation and troubleshooting of issues.

**Status:** Reserved for future agents

---

### Exploration

**Path:** `src/agents/exploration/`

**Purpose:** Fast codebase exploration and search.

**Status:** Reserved for future agents

---

## Domínios Existentes

### Segurança / Security

**Caminho:** `src/agents/security/`

**Propósito:** Auditoria de segurança, detecção de vulnerabilidades e práticas de codificação segura.

**Agentes:**
- `security-auditor` - Identifica vulnerabilidades e riscos de segurança

**Áreas de foco:**
- Vulnerabilidades de validação de entrada
- Falhas de autenticação e autorização
- Riscos de exposição de dados
- Vulnerabilidades de dependências
- Problemas de configuração de segurança

---

### Documentação / Documentation

**Caminho:** `src/agents/documentation/`

**Propósito:** Geração e manutenção de documentação técnica.

**Agentes:**
- `docs-writer` - Cria documentação clara e completa

**Áreas de foco:**
- Documentação de API
- Arquivos README
- Exemplos de código
- Guias do usuário
- Documentação de arquitetura

---

### Revisão de Código / Code Review

**Caminho:** `src/agents/code-review/`

**Propósito:** Análise de qualidade de código e aplicação de boas práticas.

**Agentes:**
- `code-reviewer` - Revisa código quanto à qualidade e manutenibilidade

**Áreas de foco:**
- Qualidade e legibilidade do código
- Implicações de performance
- Padrões de design
- Tratamento de erros
- Cobertura de testes

---

### Depuração / Debug

**Caminho:** `src/agents/debug/`

**Propósito:** Investigação e solução de problemas.

**Status:** Reservado para agentes futuros

---

### Exploração / Exploration

**Caminho:** `src/agents/exploration/`

**Propósito:** Exploração rápida e busca em codebases.

**Status:** Reservado para agentes futuros

---

## Creating a New Domain

### Step 1: Create Directory

```bash
mkdir -p src/agents/[new-domain]
```

### Step 2: Create Agent Files

At least one agent required per domain.

```bash
touch src/agents/[new-domain]/example-agent.md
```

### Step 3: Define Agent

Follow the schema in `src/shared/configs/agent-schema.json`:

```yaml
---
description: Clear description of agent purpose
mode: subagent
tools:
  write: false
  edit: false
  bash: false
---

You are a [role description]. Focus on:
- [Capability 1]
- [Capability 2]
```

### Step 4: Update agents.json

Add entry to the `domains` object:

```json
"[new-domain]": {
  "path": "src/agents/[new-domain]",
  "description": "Domain purpose",
  "agents": ["example-agent"]
}
```

### Step 5: Document Domain

Add section to this file following the existing format.

### Step 6: Validate

```bash
./scripts/validate.sh
```

---

## Criando um Novo Domínio

### Passo 1: Criar Diretório

```bash
mkdir -p src/agents/[novo-dominio]
```

### Passo 2: Criar Arquivos do Agente

Pelo menos um agente é necessário por domínio.

```bash
touch src/agents/[novo-dominio]/agente-exemplo.md
```

### Passo 3: Definir Agente

Siga o schema em `src/shared/configs/agent-schema.json`:

```yaml
---
description: Descrição clara do propósito do agente
mode: subagent
tools:
  write: false
  edit: false
  bash: false
---

Você é uma [descrição de papel]. Foque em:
- [Capacidade 1]
- [Capacidade 2]
```

### Passo 4: Atualizar agents.json

Adicione entrada ao objeto `domains`:

```json
"[novo-dominio]": {
  "path": "src/agents/[novo-dominio]",
  "description": "Propósito do domínio",
  "agents": ["agente-exemplo"]
}
```

### Passo 5: Documentar Domínio

Adicione seção a este arquivo seguindo o formato existente.

### Passo 6: Validar

```bash
./scripts/validate.sh
```

---

## Domain Principles

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | Each domain has a focused purpose |
| **Open/Closed** | Extend via new agents, not modification |
| **Liskov Substitution** | Agents can be swapped within same domain |
| **Interface Segregation** | Domain-specific, not generic agents |
| **Dependency Inversion** | Shared configs in `src/shared/` |

---

## Princípios de Domínio

| Princípio | Aplicação |
|-----------|----------|
| **Responsabilidade Única** | Cada domínio tem um propósito focado |
| **Aberto/Fechado** | Estender via novos agentes, não modificação |
| **Substituição de Liskov** | Agentes podem ser trocados dentro do mesmo domínio |
| **Segregação de Interface** | Específico por domínio, não agentes genéricos |
| **Inversão de Dependência** | Configs compartilhados em `src/shared/` |

---

## Adding Agents to Existing Domain

1. Create file: `src/agents/[domain]/[new-agent].md`
2. Follow agent schema
3. Update `agents.json` domain entry
4. Validate and commit

---

## Adicionando Agentes a Domínio Existente

1. Crie arquivo: `src/agents/[dominio]/[novo-agente].md`
2. Siga o schema do agente
3. Atualize entrada do domínio em `agents.json`
4. Valide e commit
