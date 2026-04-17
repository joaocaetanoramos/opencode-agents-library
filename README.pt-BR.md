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

2. Instale e execute o CLI:
```bash
cd cli
npm install
node install.js
```

3. Selecione os agentes para instalar através do menu interativo:
   - **Install (global)** - Disponível para todos os projetos
   - **Install (project)** - Disponível apenas no projeto atual

### Uso

Após a instalação, invoque agentes via `@mention`:

```
@security-auditor revise este código para vulnerabilidades
@docs-writer gere documentação da API
@code-reviewer analise este PR
@agent-generator crie um novo agente
```

---

### CLI Manager

O CLI interativo fornece:

- **Install agents (global)** - Cria symlinks em `~/.config/opencode/agents/`
- **Install agents (project)** - Cria symlinks em `.opencode/agents/`
- **Remove agents** - Remove symlinks de global/projeto
- **List installed agents** - Mostra quais agentes estão instalados onde
- **Check OpenCode status** - Detecta se o OpenCode está rodando

O CLI usa **symlinks** ao invés de copiar arquivos:
- Agentes estão sempre atualizados com o repositório
- Basta executar `git pull` para atualizar todos os agentes
- Não precisa de backup

Consulte [cli/README.md](cli/README.md) para detalhes.

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
│   ├── shared/              # Prompts e configurações compartilhados
│   │   ├── prompts/
│   │   ├── configs/
│   │   └── templates/       # Templates de desenvolvimento
│   └── scripts/             # Scripts utilitários
├── cli/                     # CLI manager (Node.js)
│   ├── install.js           # Ponto de entrada
│   └── package.json
├── docs/                    # Documentação
├── reference/              # Materiais de referência
├── .github/                # Workflows do GitHub
└── agents.json              # Índice de agentes
```

---

## Criando Novos Agentes

Consulte [Development Guide](docs/DEVELOPMENT.md) para instruções completas.

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