# Domínios

Este documento descreve a organização por domínios e como estendê-la.

**Idioma:** [English](./DOMAINS.md) | [Português](./DOMAINS.pt-BR.md)

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

## Princípios de Domínio

| Princípio | Aplicação |
|-----------|----------|
| **Responsabilidade Única** | Cada domínio tem um propósito focado |
| **Aberto/Fechado** | Estender via novos agentes, não modificação |
| **Substituição de Liskov** | Agentes podem ser trocados dentro do mesmo domínio |
| **Segregação de Interface** | Específico por domínio, não agentes genéricos |
| **Inversão de Dependência** | Configs compartilhados em `src/shared/` |

---

## Adicionando Agentes a Domínio Existente

1. Crie arquivo: `src/agents/[dominio]/[novo-agente].md`
2. Siga o schema do agente
3. Atualize entrada do domínio em `agents.json`
4. Valide e commit
