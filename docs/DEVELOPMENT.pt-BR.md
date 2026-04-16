# Guia de Desenvolvimento de Agentes

Este guia explica como desenvolver, versionar e lançar novos agentes para a OpenCode Agents Library.

**Idioma:** [English](./DEVELOPMENT.md) | [Português](./DEVELOPMENT.pt-BR.md)

---

## Visão Geral

Cada agente segue um ciclo de vida:

```
Planejamento → Rascunho → Testes → Lançado → (Melhorias) → v2.0
```

Esta biblioteca usa uma **abordagem de desenvolvimento versionada** que permite rastrear o progresso e manter versões históricas para referência futura.

---

## Desenvolvimento vs Instalação

Este repositório contém tanto **arquivos de desenvolvimento** quanto **arquivos de agente**:

| Tipo de Arquivo | Propósito | Instalar? |
|----------------|-----------|-----------|
| `{agente}.md` | Definição do agente | SIM - copie para `~/.config/opencode/agents/` |
| `STATUS.md` | Acompanhamento de desenvolvimento | NÃO - só no repositório |
| `CHANGELOG.md` | Histórico de versões | NÃO - só no repositório |
| `releases/` | Versões anteriores | NÃO - só no repositório |

### Instalação Correta

```bash
# Correto - apenas o arquivo do agente
cp src/agents/{dominio}/{agente}.md ~/.config/opencode/agents/

# Errado - copiar toda a pasta inclui arquivos não-agente
cp -r src/agents/{dominio} ~/.config/opencode/agents/
```

---

## Fluxo de Desenvolvimento

### 1. Fase de Planejamento

Crie a estrutura do agente:

```bash
# Criar diretório do domínio
mkdir -p src/agents/{dominio}

# Copiar templates (para acompanhamento de desenvolvimento)
cp src/shared/templates/STATUS.md src/agents/{dominio}/
cp src/shared/templates/CHANGELOG.md src/agents/{dominio}/
```

Edite o `STATUS.md`:
- Defina a versão inicial (ex: `v0.1` ou `v1.0`)
- Descreva o propósito e escopo do agente
- Liste as tarefas no roadmap

### 2. Fase de Rascunho

Crie o arquivo do agente: `src/agents/{dominio}/{nome-agente}.md`

**Importante:** Use `permission` em vez do campo `tools` (deprecated).

```yaml
---
description: Breve descrição do que o agente faz
mode: subagent  # ou primary, all
permission:
  write: deny
  edit: deny
  bash:
    "*": deny
  webfetch: deny
---

You are a {role}. Focus on:
- {capability 1}
- {capability 2}
```

### 3. Fase de Testes

Valide o agente:

```bash
./scripts/validate.sh
```

Teste o agente no OpenCode linkando apenas o arquivo do agente:

```bash
# Global (apenas o arquivo .md)
cp src/agents/{dominio}/{agente}.md ~/.config/opencode/agents/

# Projeto específico (apenas o arquivo .md)
cp src/agents/{dominio}/{agente}.md .opencode/agents/
```

### 4. Fase de Lançamento

Quando pronto para lançar:

1. Atualize `CHANGELOG.md` com info da versão
2. Atualize `STATUS.md` para `✅ Released`
3. Atualize `agents.json` com novo domínio/agente
4. Atualize `docs/DOMAINS.md`
5. Commit e crie PR

---

## Referência de Permissões

O OpenCode usa `permission` para controlar o acesso do agente. Use strings `"allow"`, `"deny"`, ou `"ask"`:

```yaml
permission:
  write: deny       # Criação de arquivos
  edit: deny        # Modificação de arquivos
  bash: deny       # Comandos shell (use padrões abaixo)
  webfetch: deny   # Requisições web
```

### Permissões de Bash com Padrões

```yaml
bash:
  "*": deny           # Negar todos por padrão
  "git *": ask        # Perguntar para comandos git
  "grep *": allow     # Permitir grep
  "./scripts/*": allow # Permitir scripts
```

---

## Estratégia de Versionamento

### Versionamento Semântico

Versões dos agentes seguem [SemVer](https://semver.org/):

- **Major (v1.0 → v2.0):** Mudanças quebrativas
- **Minor (v1.0 → v1.1):** Novas funcionalidades, retrocompatível
- **Patch (v1.0.0 → v1.0.1):** Correções de bugs

### Retenção de Versões

Ao lançar uma nova versão:

1. Copie o agente atual para `releases/v{ant}/`
2. Mova notas relevantes para `releases/v{ant}/notes/`
3. Atualize `CHANGELOG.md`
4. Inicie novo desenvolvimento nos arquivos principais

### Estrutura Completa de Lançamento

```
src/agents/{dominio}/
├── {agente}.md         # Versão atual (INSTALE ESTE)
├── STATUS.md           # Status do desenvolvimento (só repositório)
├── CHANGELOG.md       # Histórico de versões (só repositório)
├── notes/              # Notas de desenvolvimento (só repositório)
│   └── {YYYY-MM-DD}.md
└── releases/           # Versões anteriores (só repositório)
    └── v1/
        ├── {agente}.md
        └── notes/
```

---

## Criando uma Nova Versão (v2.0, etc.)

Quando quiser melhorar um agente existente:

1. **Inicie novo desenvolvimento:**
   - Atualize `STATUS.md` com novo número de versão
   - Mude status para 🔴 Planning

2. ** Preserve o histórico:**
   ```bash
   mkdir -p src/agents/{dominio}/releases/v1
   cp src/agents/{dominio}/{agente}.md src/agents/{dominio}/releases/v1/
   ```

3. **Documente decisões:**
   - Adicione ao `CHANGELOG.md`
   - Crie notas no `STATUS.md`

4. **Lance quando pronto:**
   - Mova versão anterior para `releases/`
   - Atualize `STATUS.md` → ✅ Released
   - Atualize `CHANGELOG.md`

---

## Domínios Reservados

Alguns domínios estão reservados para agentes futuros:

| Domínio | Status | Propósito |
|---------|--------|-----------|
| `debug` | Reservado | Assistência em debugging |
| `exploration` | Reservado | Exploração de codebase |
| `planning` | Reservado | Planejamento e análise |

Estes diretórios existem mas ainda não contêm agentes.

---

## Boas Práticas

### Design de Agentes
- Siga os [princípios SOLID](./ARCHITECTURE.md#design-principles)
- Responsabilidade única por agente
- Identificador claro (kebab-case)
- Use `permission` (não `tools` que está deprecated)

### Controle de Versão
- Commit alterações no `STATUS.md` regularmente
- Documente todas as decisões de design no `CHANGELOG.md`
- Mantenha notas para referência futura

### Instalação
- Apenas copie arquivos `{agente}.md` para `~/.config/opencode/agents/`
- NÃO copie STATUS.md, CHANGELOG.md ou outros arquivos de desenvolvimento

### Testes
- Sempre execute `./scripts/validate.sh`
- Teste em isolamento antes de lançar
- Considere casos extremos

---

## Referência Rápida

| Tarefa | Comando |
|--------|---------|
| Validar agentes | `./scripts/validate.sh` |
| Instalar agente globalmente | `cp src/agents/{dominio}/{agente}.md ~/.config/opencode/agents/` |
| Instalar agente no projeto | `cp src/agents/{dominio}/{agente}.md .opencode/agents/` |

---

## Ver Também

- [DOMAINS.md](./DOMAINS.md) - Organização de domínios
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Princípios de design
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Diretrizes de contribuição
- [Agent Schema](../shared/configs/agent-schema.json) - Schema de configuração
- [Documentação de Agentes do OpenCode](https://opencode.ai/docs/agents/) - Documentação oficial
