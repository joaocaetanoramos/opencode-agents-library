# Arquitetura

## Visão Geral

A Biblioteca de Agentes OpenCode segue princípios de arquitetura modular, permitindo fácil extensão e manutenção.

**Idioma:** [English](./ARCHITECTURE.md) | [Português](./ARCHITECTURE.pt-BR.md)

---

## Estrutura de Alto Nível

```
opencode-agents-library/
├── src/
│   ├── agents/           # Agentes específicos por domínio
│   │   └── [domínio]/     # Cada domínio tem sua própria pasta
│   ├── shared/           # Componentes reutilizáveis
│   │   ├── prompts/       # Templates de prompt compartilhados
│   │   ├── configs/       # Schema e validação
│   │   └── templates/    # Templates de desenvolvimento (STATUS.md, CHANGELOG.md)
│   └── scripts/          # Automação
├── cli/                  # CLI manager (Node.js)
├── docs/                 # Documentação
├── reference/            # Materiais de referência
│   └── opencode-internal/ # Referência de agentes internos do OpenCode
└── .github/              # CI/CD
```

---

## Princípios de Design

### Princípio de Responsabilidade Única (SRP)

Cada agente tem um propósito único e bem definido:
- `security-auditor` só lida com segurança
- `docs-writer` só lida com documentação

### Princípio Aberto/Fechado (OCP)

Agentes são **abertos para extensão, fechados para modificação**:
- Adicione novos agentes sem alterar os existentes
- Adicione novos domínios sem modificar a estrutura core

### Princípio de Substituição de Liskov (LSP)

Todos os agentes seguem o mesmo schema e podem ser substituídos:
- Mesma estrutura YAML frontmatter
- Mesmas regras de validação
- Mesma interface para o OpenCode

### Princípio de Segregação de Interface (ISP)

Domínios são separados por responsabilidade:
- Agentes de segurança não lidam com documentação
- Cada domínio tem capacidades específicas e direcionadas

### Princípio de Inversão de Dependência (DIP)

Componentes compartilhados vivem em `src/shared/`:
- Prompts e configs são externalizados
- Agentes referenciam recursos compartilhados, não uns aos outros

---

## Detalhes dos Componentes

### Agentes (`src/agents/`)

Cada agente é um arquivo Markdown com YAML frontmatter.

```
---
description: Obrigatório
mode: subagent|primary|all
permission: {...}
---

Conteúdo do prompt do sistema...
```

Cada pasta de domínio também pode conter:
- `STATUS.md` - Acompanhamento de desenvolvimento da próxima versão
- `CHANGELOG.md` - Histórico de versões
- `releases/` - Versões lançadas anteriormente

### Prompts Compartilhados (`src/shared/prompts/`)

Templates de prompt reutilizáveis referenciados por agentes:
- `base-system.md` - Instruções base do sistema
- `review-guidelines.md` - Critérios comuns de revisão

### Configs Compartilhadas (`src/shared/configs/`)

Schema e configurações de validação:
- `agent-schema.json` - JSON Schema para validação

### Templates de Desenvolvimento (`src/shared/templates/`)

Templates para desenvolvimento de agentes:
- `STATUS.md` - Acompanhamento de progresso de desenvolvimento
- `CHANGELOG.md` - Template de histórico de versões

Consulte o [Guia de Desenvolvimento](./DEVELOPMENT.md) para uso.

### Scripts (`src/scripts/`)

Utilitários de automação:
- `validate.sh` - Valida todos os agentes contra o schema

### CLI (`cli/`)

Ferramenta CLI interativa para gerenciamento de agentes:
- `install.js` - Ponto de entrada usando Node.js + Inquirer
- Usa symlinks ao invés de copiar arquivos
- Agentes permanecem atualizados com o repositório

Consulte [cli/README.md](../cli/README.md) para detalhes.

---

## Pontos de Extensão

| Extensão | Localização | Processo |
|---------|------------|---------|
| Novo domínio | `src/agents/[domínio]/` | Criar pasta + agente |
| Novo agente | `src/agents/[domínio]/[agente].md` | Seguir schema |
| Novo prompt | `src/shared/prompts/[nome].md` | Referenciar no agente |
| Nova validação | `src/scripts/` | Adicionar ao validate.sh |
| CLI Manager | `cli/` | Editar install.js |

---

## Fluxo de Validação

```
Arquivo do Agente (.md)
    ↓
Extração do Frontmatter
    ↓
Validação JSON Schema (agent-schema.json)
    ↓
Passa/Falha
```

---

## Invocação de Agente

```
Usuário: @nome-do-agente [tarefa]
    ↓
OpenCode corresponde agente pelo nome
    ↓
Carrega configuração do agente
    ↓
Executa com ferramentas/permissões especificadas
```

---

## Ciclo de Vida do Agente

Agentes seguem um ciclo de desenvolvimento:

```
Planejamento → Rascunho → Testes → Lançado → (Melhorias) → v2.0
```

Para estratégia detalhada de versionamento e fluxo de desenvolvimento, consulte o [Guia de Desenvolvimento](./DEVELOPMENT.md).

---

## Considerações Futuras

- Integração com servidor MCP
- Encadeamento/composição de agentes
- Granularidades de permissão customizadas
- Modelos específicos por domínio