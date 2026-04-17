# Arquivos de Equipe

> Como criar e gerenciar equipes de agentes no opencode-agents-library

**Idioma:** [English](./TEAMS.md) | Português (esta página)

---

## Visão Geral

Arquivos de equipe permitem definir grupos pré-configurados de agentes que trabalham juntos em tarefas específicas. Equipes consistem em um **líder de equipe** (agente primário) e um ou mais **agentes especializados** (subagentes).

## Por que Equipes?

| Sem Equipes | Com Equipes |
|--------------|-------------|
| Instalar agentes um por um | Instalar equipe inteira de uma vez |
| Agentes podem não funcionar bem juntos | Agentes são pré-configurados para colaborar |
| Configuração manual necessária | Líder da equipe orchastra automaticamente |

---

## Estrutura da Equipe

```
src/agents/teams/{nome-da-equipe}/
├── {líder-da-equipe}.md       # Agente primário (o líder)
├── {nome-da-equipe}.team.md   # Arquivo de definição da equipe
├── STATUS.md                  # Rastreamento de desenvolvimento
├── CHANGELOG.md               # Histórico de versão
└── docs/                      # Documentação da equipe
    ├── OVERVIEW.md
    └── available-tools.md      # Ferramentas específicas da equipe
```

---

## Esquema do Arquivo de Equipe

```yaml
---
description: Descrição da equipe
version: 1.0.0
team_leader: nome-do-agente
---

# Documentação da equipe
```

### Campos

| Campo | Obrigatório | Descrição |
|-------|-------------|-------------|
| `description` | Sim | Breve descrição da equipe |
| `version` | Sim | Versão semântica |
| `team_leader` | Sim | Nome do agente primário |

### Exemplo

```yaml
# src/agents/teams/saas/saas.team.md
---
description: Equipe completa de desenvolvimento SaaS
version: 1.0.0
team_leader: saas-project-generator
---

# Equipe de Desenvolvimento SaaS

Esta equipe é especializada em criar projetos SaaS completos.

## Workflow

1. Entrevista → 2. Arquitetura → 3. Código → 4. Revisão
```

---

## Configuração agents.json

Equipes devem ser registradas no `agents.json`:

```json
{
  "teams": {
    "saas": {
      "path": "src/agents/teams/saas",
      "team_leader": "saas-project-generator",
      "team_file": "saas.team.md",
      "description": "Equipe completa de desenvolvimento SaaS",
      "agents": ["architect", "code-generator", "sdd-compliance"]
    }
  }
}
```

### Campos

| Campo | Descrição |
|-------|-------------|
| `path` | Caminho do diretório dos arquivos da equipe |
| `team_leader` | O agente primário que lidera esta equipe |
| `team_file` | O arquivo de definição da equipe |
| `description` | Breve descrição da equipe |
| `agents` | Lista de nomes de agentes usados por esta equipe |

---

## Uso da CLI

```bash
# Listar equipes disponíveis
agents-cli team list

# Instalar uma equipe (nível projeto)
agents-cli team install saas

# Instalar uma equipe (nível global)
agents-cli team install saas -g
```

### Modo Interativo

```bash
agents-cli
# Selecione "Install team" no menu
```

---

## Criando uma Nova Equipe

### Passo 1: Criar Diretório da Equipe

```bash
mkdir -p src/agents/teams/minhaequipe/docs
```

### Passo 2: Criar Agente Líder da Equipe

Crie `{líder}.md` no diretório da equipe:

```yaml
---
description: Meu líder de equipe
mode: primary
permission:
  write: allow
  edit: allow
  bash:
    "*": ask
  webfetch: allow
  task:
    "*": deny
    "agente-especialista": allow
---

Você é o líder da minha equipe...
```

### Passo 3: Criar Arquivo de Equipe

Crie `{nome}.team.md`:

```yaml
---
description: Minha equipe personalizada para tarefas especializadas
version: 1.0.0
team_leader: líder-da-equipe
---

# Minha Equipe

## Agentes
- líder-da-equipe (este arquivo)
- agente-especialista (de planning/)
```

### Passo 4: Registrar no agents.json

Adicione à seção `teams`:

```json
{
  "teams": {
    "minhaequipe": {
      "path": "src/agents/teams/minhaequipe",
      "team_leader": "líder-da-equipe",
      "team_file": "minhaequipe.team.md",
      "description": "Minha equipe personalizada",
      "agents": ["agente-especialista"]
    }
  }
}
```

### Passo 5: Criar Documentação

Adicione `docs/OVERVIEW.md` e outra documentação conforme necessário.

---

## Agentes Modulares vs Agentes Específicos de Equipe

### Agentes Modulares

Agentes em domínios como `planning/`, `coding/`, `review/` são **modulares**:

- Podem ser usados por qualquer equipe
- Têm prompts genéricos
- Não referenciam líderes de equipe específicos

### Agentes Específicos de Equipe

Líderes de equipe são **específicos de equipe**:

- Referenciam documentação da equipe
- Invocam subagentes específicos da equipe
- Podem ter workflows personalizados

---

## Melhores Práticas

1. **Mantenha agentes modulares** - Agentes especializados devem funcionar com qualquer líder de equipe
2. **Documente o workflow da equipe** - Adicione documentação clara no arquivo da equipe
3. **Use versionamento semântico** - Siga SemVer para versões de equipes
4. **Registre no agents.json** - Equipes devem estar registradas para aparecer na CLI

---

## Ver Também

- [Guia de Desenvolvimento](./DEVELOPMENT.pt-BR.md) - Metodologia de desenvolvimento de agentes
- [Arquitetura](./ARCHITECTURE.pt-BR.md) - Princípios de arquitetura modular
- [CLI Source](../../src/cli/index.js) - Implementação da instalação de equipes