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

**Instalação global:**
```bash
cp -r src/agents/* ~/.config/opencode/agents/
```

**Específico por projeto:**
```bash
cp -r src/agents/* .opencode/agents/
```

### Uso

Após a instalação, invoque agentes via `@mention`:

```
@security-auditor revise este código para vulnerabilidades
@docs-writer gere documentação da API
@code-reviewer analise este PR
```

---

## Agentes Disponíveis

| Agente | Descrição |
|--------|----------|
| `security-auditor` | Identifica vulnerabilidades e riscos de segurança |
| `docs-writer` | Cria e mantém documentação técnica |
| `code-reviewer` | Revisa código quanto à qualidade e boas práticas |

---

## Estrutura do Projeto

```
opencode-agents-library/
├── src/
│   ├── agents/              # Definições de agentes por domínio
│   │   ├── security/
│   │   ├── documentation/
│   │   └── code-review/
│   ├── shared/              # Prompts e configurações compartilhados
│   │   ├── prompts/
│   │   └── configs/
│   └── scripts/             # Scripts utilitários
├── docs/                    # Documentação
├── .github/                 # Workflows do GitHub
└── agents.json              # Índice de agentes
```

---

## Adicionando Novos Agentes

Consulte [DOMAINS.pt-BR.md](docs/DOMAINS.pt-BR.md) para instruções detalhadas.

**Resumo:**
1. Crie o arquivo do agente em `src/agents/[domínio]/[nome-do-agente].md`
2. Siga o schema em `src/shared/configs/agent-schema.json`
3. Atualize `agents.json` com o novo domínio/agente
4. Execute `scripts/validate.sh` para verificar

---

## Validando Agentes

```bash
./scripts/validate.sh
```

---

## Contribuindo

Consulte [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md) para diretrizes.

---

## Licença

MIT
