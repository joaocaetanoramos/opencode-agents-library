# Plano de Implementação de Equipes

> Plano para implementar organização baseada em equipes no opencode-agents-library

**Status:** 🟡 Em Progresso
**Criado:** 2026-04-17
**Última Atualização:** 2026-04-17

---

## Visão Geral

Este plano cobre a reorganização de agentes de um domínio monolítico `saas/` para uma estrutura modular baseada em equipes, permitindo reutilização de agentes entre diferentes equipes.

---

## Estado Atual

```
src/agents/saas/                    # PROBLEMA: Todos os agentes acoplados ao SAAS
├── saas-project-generator.md        # Líder de equipe (mas acoplado)
├── saas-architect.md               # Específico para SAAS (deveria ser reutilizável)
├── saas-code-generator.md          # Específico para SAAS (deveria ser reutilizável)
├── saas-validator.md               # Específico para SAAS (deveria ser reutilizável)
├── STATUS.md
├── CHANGELOG.md
docs/
├── SAAS-GENERATOR-DISCOVERY.md     # PROBLEMA: Deve estar com o agente
└── available-tools.md              # PROBLEMA: Deve estar com o agente
```

---

## Estado Desejado

```
src/agents/
├── planning/                        # NOV0: Agentes de planejamento reutilizáveis
│   ├── architect/
│   │   ├── architect.md
│   │   ├── STATUS.md
│   │   └── CHANGELOG.md
│   └── requirements-analyzer/
│       ├── requirements-analyzer.md
│       ├── STATUS.md
│       └── CHANGELOG.md
│
├── coding/                         # NOV0: Agentes de codificação reutilizáveis
│   ├── code-generator/
│   │   ├── code-generator.md
│   │   ├── STATUS.md
│   │   └── CHANGELOG.md
│   └── test-generator/
│       ├── test-generator.md
│       ├── STATUS.md
│       └── CHANGELOG.md
│
├── code-review/                    # EXISTS: Agentes de revisão reutilizáveis
│   ├── sdd-compliance/
│   │   ├── sdd-compliance.md
│   │   ├── STATUS.md
│   │   └── CHANGELOG.md
│   └── code-reviewer/
│       ├── code-reviewer.md
│       ├── STATUS.md
│       └── CHANGELOG.md
│
├── documentation/                   # EXISTS
│   └── docs-writer/
│       ├── docs-writer.md
│       ├── STATUS.md
│       └── CHANGELOG.md
│
├── security/                        # EXISTS
│   └── security-auditor/
│       ├── security-auditor.md
│       ├── STATUS.md
│       └── CHANGELOG.md
│
├── creation/                        # EXISTS
│   └── agent-builder/
│       ├── agent-builder.md
│       ├── STATUS.md
│       └── CHANGELOG.md
│
└── teams/
    ├── saas/                       # EQUIPE: SAAS
    │   ├── saas-project-generator.md  # Líder de equipe
    │   ├── saas.team.md               # Arquivo de equipe (para CLI)
    │   ├── STATUS.md
    │   ├── CHANGELOG.md
    │   └── docs/
    │       ├── SAAS-GENERATOR-DISCOVERY.md  # MOVIDO
    │       └── available-tools.md         # MOVIDO
    │
    └── team-builder/              # META-EQUIPE: Cria outras equipes
        ├── team-builder.md            # Líder de equipe
        ├── team-builder.team.md        # Arquivo de equipe
        ├── STATUS.md
        ├── CHANGELOG.md
        └── docs/
            ├── OVERVIEW.md
            └── available-tools.md
```

---

## Estrutura de Diretório de Agente

Cada agente agora tem seu próprio subdiretório:

```
src/agents/{domain}/
└── {agent-name}/
    ├── {agent-name}.md     # A definição do agente (SOMENTE isso é instalado)
    ├── STATUS.md            # Rastreamento de desenvolvimento (repositório only)
    └── CHANGELOG.md         # Histórico de versão (repositório only)
```

**Importante:** Apenas `{agent-name}.md` deve ser instalado no OpenCode.

---

## Equipe Builder (Meta-Equipe)

A equipe `team-builder` é uma meta-equipe que cria outras equipes:

### Propósito
- Cria novas equipes seguindo a metodologia do repositório
- Usa `agent-builder` para criar componentes de equipe
- Usa `architect` para projetar fluxos de trabalho
- Usa `docs-writer` para documentação

### Estrutura
```
src/agents/teams/team-builder/
├── team-builder.md           # Líder de equipe
├── team-builder.team.md      # Arquivo de equipe
├── STATUS.md
├── CHANGELOG.md
└── docs/
    ├── OVERVIEW.md
    └── available-tools.md
```

---

## CLI - Comandos de Equipe

```bash
# Listar equipes disponíveis
agents-cli team list

# Instalar uma equipe (projeto)
agents-cli team install saas

# Instalar uma equipe (global)
agents-cli team install saas -g

# Instalar meta-equipe team-builder
agents-cli team install team-builder
```

---

## Progresso

### 2026-04-17
- [x] Plano criado
- [x] Estrutura de diretórios de agentes separada (cada agente em seu próprio subdiretório)
- [x] Agente `agent-generator` renomeado para `agent-builder`
- [x] Equipe `team-builder` criada
- [x] CLI atualizada para novos caminhos de agentes
- [x] `agents.json` atualizado
- [ ] Documentação em português criada
- [ ] Teste de instalação de equipe

---

## Perguntas Abertas

- [x]team-builder deve ser uma equipe ou apenas um agente?
- [x] agent-builder deve criar equipes também?
- [x] Documentação em português necessária?

---

## Referências

- [Guia de Desenvolvimento](./DEVELOPMENT.pt-BR.md) - Metodologia de desenvolvimento de agentes
- [Arquitetura](./ARCHITECTURE.pt-BR.md) - Princípios de arquitetura modular
- [Teams](./TEAMS.pt-BR.md) - Arquivos de equipe