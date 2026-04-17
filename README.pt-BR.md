# Biblioteca de Agentes OpenCode

Uma coleção curada de agentes e times personalizados para o [OpenCode](https://opencode.ai), organizados por domínio seguindo princípios SOLID e padrões de Clean Code.

**Idioma:** [English](./README.md) | [Português](./README.pt-BR.md)

---

## Quick Start

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joaocaetanoramos/opencode-agents-library.git
cd opencode-agents-library
```

2. Vincule o CLI globalmente:
```bash
npm link
```

3. Use de qualquer projeto:
```bash
agents-cli install -g -a code-reviewer docs-writer
```

### Modo Interativo

Execute sem argumentos para menu interativo:
```bash
agents-cli
```

---

## Uso do CLI

### Comandos

| Comando | Descrição |
|---------|-----------|
| `agents-cli install` | Instalar agentes (interativo ou especificado) |
| `agents-cli team install` | Instalar times completos |
| `agents-cli team list` | Listar times disponíveis |
| `agents-cli remove` | Remover agentes instalados |
| `agents-cli list` | Listar todos os agentes disponíveis e instalados |
| `agents-cli check` | Verificar status do OpenCode |
| `agents-cli help` | Mostrar ajuda |

### Comandos de Time

| Comando | Descrição |
|---------|-----------|
| `agents-cli team list` | Listar todos os times disponíveis |
| `agents-cli team install saas` | Instalar time SaaS |
| `agents-cli team install saas-builder-docker` | Instalar time SaaS com Docker/Dokploy |
| `agents-cli team install team-builder` | Instalar time de criação de times |

### Opções

| Opção | Descrição |
|-------|-----------|
| `-g, --global` | Instalar no diretório global |
| `-p, --project` | Instalar no diretório do projeto |
| `-a, --agent` | Especificar nome(s) do(s) agente(s) |
| `-A, --all` | Selecionar todos os agentes |

### Exemplos

```bash
agents-cli install                     # Interativo (modo projeto)
agents-cli install -g                 # Interativo (modo global)
agents-cli install -g -a code-reviewer # Instalar específico no global
agents-cli team install saas           # Instalar time SaaS
agents-cli team install saas-builder-docker -g  # Instalar time Docker no global
agents-cli remove -a code-reviewer
agents-cli list
```

O CLI usa **symlinks** ao invés de copiar arquivos:
- Agentes estão sempre atualizados com o repositório
- Basta executar `git pull` para atualizar todos os agentes
- Não precisa de backup

---

## Agentes Disponíveis

### Por Domínio

| Domínio | Agentes |
|---------|---------|
| **security** | `security-auditor` |
| **documentation** | `docs-writer` |
| **code-review** | `code-reviewer`, `sdd-compliance` |
| **planning** | `architect`, `requirements-analyzer` |
| **coding** | `code-generator`, `test-generator` |
| **creation** | `agent-builder` |
| **infrastructure** | `docker-specialist` |

### Times

| Time | Descrição | Agentes |
|------|-----------|---------|
| **saas** | Time completo de desenvolvimento SaaS | architect, code-generator, sdd-compliance + mais |
| **saas-builder-docker** | SaaS com deploy Docker/Dokploy | Todos os agentes do saas + docker-specialist |
| **team-builder** | Meta-time para criar novos times | agent-builder, architect, docs-writer |

---

## Desenvolvimento vs Instalação

Este repositório contém **arquivos de desenvolvimento** (STATUS.md, CHANGELOG.md) e **arquivos de agente**.

**Apenas instale os arquivos `.md` de agente** - o CLI faz isso automaticamente.

---

## Estrutura do Projeto

```
opencode-agents-library/
├── src/
│   ├── agents/
│   │   ├── security/           # Agentes de segurança
│   │   ├── documentation/      # Agentes de documentação
│   │   ├── code-review/        # Agentes de revisão de código
│   │   ├── planning/           # Agentes de planejamento
│   │   ├── coding/             # Agentes de codificação
│   │   ├── creation/           # Criação de agentes
│   │   ├── infrastructure/     # Agentes de infraestrutura
│   │   └── teams/              # Times pré-configurados
│   │       ├── saas/
│   │       ├── saas-builder-docker/
│   │       └── team-builder/
│   ├── cli/                    # Código fonte do CLI
│   ├── shared/                 # Prompts e configurações compartilhados
│   └── scripts/                # Scripts utilitários
├── bin/
│   └── agents.js               # Ponto de entrada do CLI
├── docs/                      # Documentação
├── package.json
└── agents.json                # Índice de agentes e times
```

---

## Criando Novos Agentes

Consulte o [Guia de Desenvolvimento](docs/DEVELOPMENT.md) para instruções completas.

**Resumo:**
1. Use `@agent-builder create a new agent` para começar
2. Ou crie manualmente o agente em `src/agents/[domínio]/[nome-do-agente]/`
3. Siga o schema `permission` (não o deprecated `tools`)
4. Crie `STATUS.md` e `CHANGELOG.md` para acompanhar o desenvolvimento
5. Execute `./scripts/validate.sh` para verificar

---

## Estrutura de Arquivos do Agente

Cada agente tem sua própria subpasta:

```
src/agents/{domínio}/{nome-do-agente}/
├── {nome-do-agente}.md    # Arquivo principal do agente (instalado)
├── STATUS.md              # Acompanhamento de desenvolvimento
└── CHANGELOG.md           # Histórico de versão
```

---

## Estrutura de Time

Times têm documentação adicional:

```
src/agents/teams/{nome-do-time}/
├── {nome-do-time}.md           # Líder do time (instalado)
├── {nome-do-time}.team.md     # Arquivo do time (para CLI)
├── STATUS.md
├── CHANGELOG.md
└── docs/
    ├── OVERVIEW.md            # Documentação do time
    └── available-tools.md    # Ferramentas disponíveis para o time
```

---

## Validando Agentes

```bash
./scripts/validate.sh
```

---

## Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

---

## Licença

MIT