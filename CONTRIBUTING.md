# Contributing to OpenCode Agents Library

Thank you for your interest in contributing!

---

## Contribuindo com a Biblioteca de Agentes OpenCode

Obrigado pelo seu interesse em contribuir!

---

## How to Contribute

### Adding a New Agent

1. **Create the agent file:**
   ```bash
   # For a new domain
   mkdir -p src/agents/[new-domain]
   touch src/agents/[new-domain]/[agent-name].md

   # For existing domain
   touch src/agents/[existing-domain]/[agent-name].md
   ```

2. **Follow the agent schema:**
   ```yaml
   ---
   description: Clear description of what the agent does
   mode: subagent  # or 'primary' or 'all'
   tools:
     write: false
     edit: false
     bash: false
   ---

   You are a [role]. Focus on:
   - [Specific capability 1]
   - [Specific capability 2]
   ```

3. **Validate:**
   ```bash
   ./scripts/validate.sh
   ```

4. **Update `agents.json`:**
   - Add new domain if created
   - Add agent to domain's agent list

### Adding a New Domain

1. Create directory: `src/agents/[new-domain]/`
2. Add at least one agent
3. Update `agents.json` with domain entry
4. Create documentation section in `docs/DOMAINS.md`
5. Submit PR

---

## Como Contribuir

### Adicionando um Novo Agente

1. **Crie o arquivo do agente:**
   ```bash
   # Para novo domínio
   mkdir -p src/agents/[novo-dominio]
   touch src/agents/[novo-dominio]/[nome-do-agente].md

   # Para domínio existente
   touch src/agents/[dominio-existente]/[nome-do-agente].md
   ```

2. **Siga o schema do agente:**
   ```yaml
   ---
   description: Descrição clara do que o agente faz
   mode: subagent  # ou 'primary' ou 'all'
   tools:
     write: false
     edit: false
     bash: false
   ---

   Você é um [papel]. Foque em:
   - [Capacidade específica 1]
   - [Capacidade específica 2]
   ```

3. **Valide:**
   ```bash
   ./scripts/validate.sh
   ```

4. **Atualize `agents.json`:**
   - Adicione novo domínio se criado
   - Adicione agente à lista de agentes do domínio

### Adicionando um Novo Domínio

1. Crie o diretório: `src/agents/[novo-dominio]/`
2. Adicione pelo menos um agente
3. Atualize `agents.json` com entrada do domínio
4. Crie seção de documentação em `docs/DOMAINS.md`
5. Envie PR

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b domain/agent-name`
3. Make changes and test with `./scripts/validate.sh`
4. Commit with clear messages
5. Push and open a PR

---

## Processo de Pull Request

1. Faça fork do repositório
2. Crie uma branch de feature: `git checkout -b dominio/nome-do-agente`
3. Faça alterações e teste com `./scripts/validate.sh`
4. Commit com mensagens claras
5. Push e abra um PR

---

## Agent Naming Conventions

- **Files**: `kebab-case.md` (e.g., `security-auditor.md`)
- **Agent ID**: Derived from filename without extension
- **Domains**: lowercase, singular nouns

---

## Convenções de Nomenclatura de Agentes

- **Arquivos**: `kebab-case.md` (ex: `security-auditor.md`)
- **ID do Agente**: Derivado do nome do arquivo sem extensão
- **Domínios**: substantivos singulares em minúsculas

---

## Quality Checklist

- [ ] Description is 10-200 characters
- [ ] Mode is valid (`primary`, `subagent`, or `all`)
- [ ] Tools are explicitly set (not relying on defaults)
- [ ] Prompt is clear and specific
- [ ] Agent follows Single Responsibility Principle
- [ ] Validation script passes

---

## Lista de Verificação de Qualidade

- [ ] Descrição tem 10-200 caracteres
- [ ] Modo é válido (`primary`, `subagent`, ou `all`)
- [ ] Ferramentas estão explicitamente definidas
- [ ] Prompt é claro e específico
- [ ] Agente segue o Princípio de Responsabilidade Única
- [ ] Script de validação passa

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow existing code style

---

## Código de Conduta

- Seja respeitoso e inclusivo
- Foque em feedback construtivo
- Siga o estilo de código existente
