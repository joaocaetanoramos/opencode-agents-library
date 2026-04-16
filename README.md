# OpenCode Agents Library

A curated collection of custom agents for [OpenCode](https://opencode.ai), organized by domain and following SOLID principles.

---

## Biblioteca de Agentes OpenCode

Uma coleção curada de agentes personalizados para o [OpenCode](https://opencode.ai), organizados por domínio e seguindo princípios SOLID.

---

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joaoramos/opencode-agents-library.git
cd opencode-agents-library
```

2. Link agents to your OpenCode config:

**Global installation:**
```bash
cp -r src/agents/* ~/.config/opencode/agents/
```

**Project-specific:**
```bash
cp -r src/agents/* .opencode/agents/
```

### Uso / Usage

After installation, invoke agents via `@mention`:

```
@security-auditor review this code for vulnerabilities
@docs-writer generate API documentation
@code-reviewer analyze this PR
```

---

## Quick Start (Português)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joaoramos/opencode-agents-library.git
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

## Available Agents

| Agent | Description |
|-------|-------------|
| `security-auditor` | Identifies security vulnerabilities and risks |
| `docs-writer` | Creates and maintains technical documentation |
| `code-reviewer` | Reviews code for quality and best practices |

---

## Agentes Disponíveis

| Agente | Descrição |
|--------|----------|
| `security-auditor` | Identifica vulnerabilidades e riscos de segurança |
| `docs-writer` | Cria e mantém documentação técnica |
| `code-reviewer` | Revisa código quanto à qualidade e boas práticas |

---

## Project Structure

```
opencode-agents-library/
├── src/
│   ├── agents/              # Agent definitions by domain
│   │   ├── security/
│   │   ├── documentation/
│   │   └── code-review/
│   ├── shared/              # Shared prompts and configs
│   │   ├── prompts/
│   │   └── configs/
│   └── scripts/             # Utility scripts
├── docs/                    # Documentation
├── .github/                 # GitHub workflows
└── agents.json             # Agent index
```

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

## Adding New Agents

See [DOMAINS.md](docs/DOMAINS.md) for detailed instructions.

**Summary:**
1. Create agent file in `src/agents/[domain]/[agent-name].md`
2. Follow the schema in `src/shared/configs/agent-schema.json`
3. Update `agents.json` with new domain/agent
4. Run `scripts/validate.sh` to verify

---

## Adicionando Novos Agentes

Consulte [DOMAINS.md](docs/DOMAINS.md) para instruções detalhadas.

**Resumo:**
1. Crie o arquivo do agente em `src/agents/[domínio]/[nome-do-agente].md`
2. Siga o schema em `src/shared/configs/agent-schema.json`
3. Atualize `agents.json` com o novo domínio/agente
4. Execute `scripts/validate.sh` para verificar

---

## Validating Agents

```bash
./scripts/validate.sh
```

---

## Validando Agentes

```bash
./scripts/validate.sh
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

---

## License

MIT
