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

2. Vincule os agentes à sua configuração do OpenCode:

**Instalação global (por agente):**
```bash
cp src/agents/{dominio}/{agente}.md ~/.config/opencode/agents/
```

**Específico por projeto (por agente):**
```bash
cp src/agents/{dominio}/{agente}.md .opencode/agents/
```

### Uso

Após a instalação, invoque agentes via `@mention`:

```
@security-auditor revise este código para vulnerabilidades
@docs-writer gere documentação da API
@code-reviewer analise este PR
@agent-generator crie um novo agente
```

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

**Apenas instale os arquivos `.md` de agente:**

```bash
# Correto
cp src/agents/security/security-auditor.md ~/.config/opencode/agents/

# Errado - copia arquivos de desenvolvimento também
cp -r src/agents/security ~/.config/opencode/agents/
```

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
│   │   └── templates/       # Templates de desenvolvimento (STATUS.md, CHANGELOG.md)
│   └── scripts/             # Scripts utilitários
├── docs/                    # Documentação
├── reference/               # Materiais de referência
├── .github/                 # Workflows do GitHub
└── agents.json              # Índice de agentes
```

---

## Criando Novos Agentes

Consulte [Development Guide](docs/DEVELOPMENT.md) para instruções completas de criação, desenvolvimento e versionamento de agentes.

**Resumo:**
1. Use `@agent-generator crie um novo agente` para começar
2. Ou crie manualmente `src/agents/[domínio]/[nome-do-agente].md`
3. Siga o schema `permission` (não o deprecated `tools`)
4. Use `STATUS.md` e `CHANGELOG.md` para acompanhar o desenvolvimento
5. Execute `scripts/validate.sh` para verificar

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
