# Contribuindo com a Biblioteca de Agentes OpenCode

Obrigado pelo seu interesse em contribuir!

**Idioma:** [English](./CONTRIBUTING.md) | [Português](./CONTRIBUTING.pt-BR.md)

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
4. Crie seção de documentação em `docs/DOMAINS.pt-BR.md`
5. Envie PR

---

## Processo de Pull Request

1. Faça fork do repositório
2. Crie uma branch de feature: `git checkout -b dominio/nome-do-agente`
3. Faça alterações e teste com `./scripts/validate.sh`
4. Commit com mensagens claras
5. Push e abra um PR

---

## Convenções de Nomenclatura de Agentes

- **Arquivos**: `kebab-case.md` (ex: `security-auditor.md`)
- **ID do Agente**: Derivado do nome do arquivo sem extensão
- **Domínios**: substantivos singulares em minúsculas

---

## Lista de Verificação de Qualidade

- [ ] Descrição tem 10-200 caracteres
- [ ] Modo é válido (`primary`, `subagent`, ou `all`)
- [ ] Ferramentas estão explicitamente definidas
- [ ] Prompt é claro e específico
- [ ] Agente segue o Princípio de Responsabilidade Única
- [ ] Script de validação passa

---

## Código de Conduta

- Seja respeitoso e inclusivo
- Foque em feedback construtivo
- Siga o estilo de código existente
