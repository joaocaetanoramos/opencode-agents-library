# Biblioteca de Agentes OpenCode

Uma coleção curada de agentes personalizados para o [OpenCode](https://opencode.ai), organizados por domínio e seguindo princípios SOLID.

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
| `agents-cli remove` | Remover agentes instalados |
| `agents-cli list` | Listar todos os agentes disponíveis e instalados |
| `agents-cli check` | Verificar status do OpenCode |
| `agents-cli help` | Mostrar ajuda |

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
agents-cli install -A -g              # Instalar todos no global
agents-cli install -a code-reviewer docs-writer security-auditor
agents-cli remove -a code-reviewer
agents-cli list
agents-cli check
```

O CLI usa **symlinks** ao invés de copiar arquivos:
- Agentes estão sempre atualizados com o repositório
- Basta executar `git pull` para atualizar todos os agentes
- Não precisa de backup

---

## Agentes Disponíveis

| Agente | Domínio | Descrição |
|--------|---------|-----------|
| `security-auditor` | security | Identifica vulnerabilidades e riscos de segurança |
| `docs-writer` | documentation | Cria e mantém documentação técnica |
| `code-reviewer` | code-review | Revisa código quanto à qualidade e boas práticas |
| `agent-generator` | creation | Gera novos agentes seguindo a metodologia do repositório |

---

## Desenvolvimento vs Instalação

Este repositório contém **arquivos de desenvolvimento** (STATUS.md, CHANGELOG.md) e **arquivos de agente**.

**Apenas instale os arquivos `.md` de agente** - o CLI faz isso automaticamente.

---

## Estrutura do Projeto

```
opencode-agents-library/
├── src/
│   ├── agents/              # Definições de agentes por domínio
│   │   ├── security/
│   │   ├── documentation/
│   │   ├── code-review/
│   │   └── creation/
│   ├── cli/                 # Código fonte do CLI
│   │   └── index.js
│   ├── shared/              # Prompts e configurações compartilhados
│   │   ├── prompts/
│   │   ├── configs/
│   │   └── templates/
│   └── scripts/             # Scripts utilitários
├── bin/
│   └── agents.js             # Ponto de entrada do CLI
├── package.json              # Configuração do pacote npm
├── docs/                    # Documentação
├── reference/               # Materiais de referência
└── agents.json             # Índice de agentes
```

---

## Criando Novos Agentes

Consulte o [Guia de Desenvolvimento](docs/DEVELOPMENT.md) para instruções completas.

**Resumo:**
1. Use `@agent-generator crie um novo agente` para começar
2. Ou crie manualmente `src/agents/[domínio]/[nome-do-agente].md`
3. Siga o schema `permission` (não o deprecated `tools`)
4. Use `STATUS.md` e `CHANGELOG.md` para acompanhar o desenvolvimento
5. Execute `./scripts/validate.sh` para verificar

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