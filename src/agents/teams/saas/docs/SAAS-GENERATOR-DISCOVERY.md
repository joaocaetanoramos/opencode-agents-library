# Discovery: SAAS Project Generator Agent(s)

> Agent(s) that create complete SaaS projects from user requirements

**Status:** 🟡 Discovery Phase
**Created:** 2026-04-17

---

## Context

The goal is to create an OpenCode agent (or set of agents) that helps users bootstrap complete SaaS projects. This document tracks the discovery and design process.

### Requirements Captured

| Requirement | Decision |
|-------------|----------|
| Scope | Complete project (stack choice + MVP features) |
| Interaction | Form/Interview style (structured questions) |
| Architecture | Orchestrator + Specialized agents |
| Code Quality | SOLID principles + Clean Code |

---

## Code Quality Standards

All generated SaaS projects MUST follow these standards:

### SOLID Principles

| Principle | Application in Generated Code |
|-----------|-------------------------------|
| **S**ingle Responsibility | Each module/class has one purpose (e.g., `AuthService` handles auth only) |
| **O**pen/Closed | Features are extensible without modifying existing code |
| **L**iskov Substitution | Interfaces are implemented correctly for polymorphism |
| **I**nterface Segregation | Small, focused interfaces (don't force unused methods) |
| **D**ependency Inversion | Depend on abstractions, not concretions |

### Clean Code Guidelines

| Guideline | Example |
|-----------|---------|
| **Meaningful names** | `getUserById()` not `getData()` |
| **Small functions** | Max 20-30 lines per function |
| **Single responsibility** | One reason to change per module |
| **Avoid nested callbacks** | Use async/await with clear error handling |
| **Comments for WHY** | Code explains what, comments explain why |
| **Consistent formatting** | ESLint + Prettier enforced |
| **No magic numbers** | Use named constants |
| **Early returns** | Handle edge cases first |

### Project Structure (Generated SaaS)

```
{service-name}/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── _components/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [...routes]/
│   ├── features/               # Feature-based modules (SOLID)
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.types.ts
│   │   ├── billing/
│   │   └── users/
│   ├── shared/                 # Shared utilities (Clean Code)
│   │   ├── lib/
│   │   │   ├── db.ts
│   │   │   └── logger.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── format-date.ts
│   │       └── validation.ts
│   └── components/             # Shared UI components
│       └── ui/
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
```

### Feature Module Structure (SOLID)

Each feature follows the same pattern:

```
features/{feature-name}/
├── {feature}.service.ts      # Business logic (SRP)
├── {feature}.controller.ts  # HTTP handling
├── {feature}.repository.ts   # Data access
├── {feature}.types.ts       # TypeScript interfaces
├── {feature}.constants.ts   # Feature constants
└── {feature}.test.ts        # Unit tests
```

### Layered Architecture

```
┌─────────────────────────────────────────┐
│           Controllers (HTTP)            │  ← Thin, only routing
├─────────────────────────────────────────┤
│           Services (Business)           │  ← Pure business logic
├─────────────────────────────────────────┤
│          Repositories (Data)            │  ← DB access only
├─────────────────────────────────────────┤
│             Data Sources                 │  ← External APIs, DB
└─────────────────────────────────────────┘
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `user-service.ts` |
| Classes | PascalCase | `UserService` |
| Functions | camelCase | `getUserById()` |
| Interfaces | PascalCase + `I` prefix (optional) | `User` or `IUser` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Types | PascalCase | `UserRole` |

---

## Phase 1: Understanding SaaS Domain

### Common SaaS Stacks

| Category | Options |
|----------|---------|
| Frontend | Next.js, React, Vue, Svelte |
| Backend | Node.js, Python/Django, Go |
| Database | PostgreSQL, MongoDB, Supabase |
| Auth | NextAuth, Clerk, Auth0, Custom |
| Billing | Stripe, Paddle, LemonSqueezy |
| Deployment | Vercel, Railway, AWS, Fly.io |
| UI Components | Shadcn/UI, Tailwind UI, Radix |

### Universal SaaS Features (MVP)

- [ ] Authentication (signup, login, password reset)
- [ ] Multi-tenancy (workspaces/organizations)
- [ ] User management (roles, permissions)
- [ ] Dashboard/Homepage
- [ ] Settings pages
- [ ] Billing/Subscription flow
- [ ] API structure (REST/GraphQL)

### Architecture Decisions a SaaS Needs

```
1. Database Schema
   - User table
   - Organization/Workspace table
   - Membership (user <-> org) table

2. Authentication Flow
   - Email/password or OAuth
   - Session management
   - Protected routes

3. Multi-tenancy Model
   - Shared database + tenant_id (simpler)
   - Separate databases per tenant (isolation)

4. Billing Model
   - Usage-based
   - Per-seat
   - Tiered plans

5. API Structure
   - REST endpoints
   - GraphQL
   - Server actions (Next.js)
```

---

## Phase 2: Interview Flow Design

### Complete Question List

The orchestrator uses these questions in order:

#### PHASE 1: Project Basics (BLOCKING - required to proceed)

| # | Question | Type | Default |
|---|----------|------|---------|
| 1.1 | What's your project name? | text | - |
| 1.2 | Describe your SaaS in one paragraph | text | - |
| 1.3 | Is this B2B, B2C, or Internal Tool? | choice | - |

#### PHASE 2: Core Features (BLOCKING - required to proceed)

| # | Question | Type | Default |
|---|----------|------|---------|
| 2.1 | Do you need multi-tenancy (organizations/workspaces)? | yes/no | no |
| 2.2 | Do you need user authentication? | yes/no | yes |
| 2.3 | Do you need billing/payment subscriptions? | yes/no | no |

#### PHASE 3: Technology Preferences (OPTIONAL - can skip with defaults)

| # | Question | Type | Default |
|---|----------|------|---------|
| 3.1 | Preferred frontend framework? | choice | Next.js |
| 3.2 | Preferred database type? | choice | PostgreSQL |
| 3.3 | Preferred auth provider? | choice | Clerk |
| 3.4 | Preferred deployment platform? | choice | Vercel |

**Available choices:**
- Frontend: Next.js, React + Vite, SvelteKit
- Database: PostgreSQL (Supabase), PostgreSQL (Prisma), MongoDB
- Auth: Clerk, NextAuth.js, Supabase Auth, Firebase
- Deployment: Vercel, Railway, Fly.io, AWS

#### PHASE 4: Business Model (OPTIONAL - can skip with defaults)

| # | Question | Type | Default |
|---|----------|------|---------|
| 4.1 | What's your pricing model? | choice | per-seat |
| 4.2 | Do you need a free tier? | yes/no | no |
| 4.3 | Do you need a trial period? | yes/no | no |
| 4.4 | Billing provider preference? | choice | Stripe |

**Pricing models:** per-seat, usage-based, tiered (3 plans), flat-rate, one-time

#### PHASE 5: User Management (OPTIONAL)

| # | Question | Type | Default |
|---|----------|------|---------|
| 5.1 | Do you need user roles/permissions? | yes/no | no |
| 5.2 | Do you need an admin panel? | yes/no | no |
| 5.3 | Do you need user invitations? | yes/no | no |

#### PHASE 6: Technical Requirements (OPTIONAL)

| # | Question | Type | Default |
|---|----------|------|---------|
| 6.1 | Scalability expectations? | choice | medium |
| 6.2 | Do you need internationalization (i18n)? | yes/no | no |
| 6.3 | Do you need accessibility (a11y) support? | yes/no | yes |

### Interview Flow Script

```
Welcome! I'll help you create a complete SaaS project.

Let's start with the basics:

1. Project name: [user input]
2. Description: [user input]
3. Type: [B2B/B2C/Internal]

Now, let's talk about features:

4. Multi-tenancy? (y/n): [user input]
5. Authentication? (y/n): [user input]
6. Billing? (y/n): [user input]

[If yes to any feature, ask relevant follow-ups]

Technology preferences (or skip for defaults):

7. Frontend: [Next.js] (default)
8. Database: [PostgreSQL] (default)
...

Based on your inputs, I'll create a complete project with:
- Technology stack: [list]
- Features: [list]
- Project structure following SOLID principles

Shall I proceed? (yes/no)
```

### Question Dependencies

```
IF 2.3 (billing) = yes
THEN ask 4.1-4.4 (business model)

IF 2.1 (multi-tenancy) = yes
THEN ask 5.1-5.3 (user management)

IF user skips technology questions
THEN use defaults: Next.js + PostgreSQL/Prisma + Clerk + Vercel
```

### Defaults Summary

| Category | Default | Rationale |
|----------|---------|-----------|
| Frontend | Next.js 14 | SSR + Server Actions, rapid development |
| Database | PostgreSQL + Prisma | Type safety, relational integrity |
| Auth | Clerk | Best developer experience, React-native |
| Billing | Stripe | Industry standard, excellent docs |
| Deployment | Vercel | One-click Next.js deploy |
| UI | shadcn/ui + Tailwind | Accessible, beautiful, customizable |

---

## Phase 3: Agent Architecture

### Multi-Agent Team Design

The SaaS generator is implemented as a team of specialized agents that communicate via OpenCode's Task tool.

```
┌─────────────────────────────────────────────────────────────────┐
│                    saas-project-generator                        │
│                    (Primary Agent - Build)                      │
│                                                                  │
│  - Orchestrates the entire workflow                              │
│  - Conducts interview with user                                  │
│  - Delegates to subagents via Task tool                          │
│  - permission.task: allows "saas-architect", "saas-code-gen",    │
│                     "saas-validator"                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│saas-architect │    │saas-code-gen    │    │saas-validator   │
│(Subagent/Hidden)   │(Subagent/Hidden)     │(Subagent/Hidden)│
├───────────────┤    ├─────────────────┤    ├─────────────────┤
│Mode: subagent │    │Mode: subagent   │    │Mode: subagent   │
│Hidden: true   │    │Hidden: true     │    │Hidden: true     │
├───────────────┤    ├─────────────────┤    ├─────────────────┤
│Read: allow    │    │Write: allow     │    │Read: allow      │
│Webfetch: allow│    │Edit: allow      │    │Bash: allow      │
│Write: deny    │    │Bash: deny       │    │Write: deny      │
│Edit: deny     │    │                 │    │Edit: deny       │
└───────────────┘    └─────────────────┘    └─────────────────┘
```

### Agent Responsibilities

| Agent | Mode | Hidden | Purpose | Permissions |
|-------|------|--------|---------|-------------|
| `saas-project-generator` | primary | No | Orchestrator, interview flow, coordinates subagents | Full (build mode) |
| `saas-architect` | subagent | Yes | Analyzes requirements, selects stack, generates SDD | read, webfetch |
| `saas-code-generator` | subagent | Yes | Generates project code from SDD | write, edit |
| `saas-validator` | subagent | Yes | Validates generated project against SDD | read, bash |

### OpenCode Task Permission Configuration

```yaml
# In saas-project-generator's permission.task
permission:
  task:
    "*": "deny"
    "saas-architect": "allow"
    "saas-code-generator": "ask"
    "saas-validator": "ask"
```

### Information Flow

```
User Input (chat)
    │
    ▼
saas-project-generator (orchestrator)
    │
    ├──► Task: saas-architect
    │         ├── Reads available-tools.md
    │         ├── Consults sitemaps via webfetch
    │         └── Returns: SDD (Software Design Document)
    │
    ├──► Task: saas-code-generator
    │         ├── Reads SDD
    │         ├── Consults doc links via webfetch
    │         └── Returns: Generated project files
    │
    └──► Task: saas-validator
              ├── Reads SDD + Generated files
              └── Returns: Validation report
```

### Task Invocation Pattern

Each subagent is invoked via OpenCode's Task tool:

```typescript
// Orchestrator (saas-project-generator) uses:
await task({
  agent: "saas-architect",
  prompt: `Analyze requirements and select stack...
           Requirements: ${userRequirements}`
});

// saas-code-generator receives SDD and generates:
await task({
  agent: "saas-code-generator",
  prompt: `Generate project based on SDD:
           ${sddContent}`
});
```

### Why Hidden Subagents?

Hidden agents are not visible in the @ mention menu but can still be invoked via the Task tool. This:
- Reduces UI clutter
- Prevents accidental manual invocation
- Keeps the workflow orchestrated by the primary agent

---

## Phase 3.5: Available Tools System

### Concept

A registry of external services/documentation that agents can consult and choose from when designing a SaaS project. This allows extensibility without modifying agent code.

### File Structure

```
docs/
├── SAAS-GENERATOR-DISCOVERY.md    # This document
└── available-tools.md            # Tool registry (YAML)
```

### Available Tools Schema

```yaml
tools:
  - id: supabase
    name: Supabase
    tagline: "Backend as a service com PostgreSQL, Auth e Realtime"
    docs: https://supabase.com/docs
    sitemap: https://supabase.com/docs/sitemap.xml  # ✅ Working
    categories: [database, auth, backend]
    preferred_for: [rapid-development, startups]

  - id: stripe
    name: Stripe
    tagline: "Pagamentos e assinaturas para internet"
    docs: https://stripe.com/docs
    sitemap: https://stripe.com/docs/sitemap.xml  # ✅ Working
    categories: [billing, payments]
    preferred_for: [production, subscription-saas]

  - id: clerk
    name: Clerk
    tagline: "Autenticação e user management descomplicado"
    docs: https://clerk.com/docs
    sitemap: https://clerk.com/docs/sitemap.md  # ❌ Use sitemap.md or llms.txt
    categories: [auth, user-management]
    preferred_for: [react, nextjs]

  - id: nextjs
    name: Next.js
    tagline: "Framework React com SSR e Server Actions"
    docs: https://nextjs.org/docs
    sitemap: https://nextjs.org/docs/sitemap.xml  # ✅ Working
    categories: [frontend, fullstack]
    preferred_for: [ssr, seo-friendly]

  - id: tailwind
    name: Tailwind CSS
    tagline: "Utility-first CSS framework"
    docs: https://tailwindcss.com/docs
    sitemap: null  # ❌ No sitemap available
    categories: [css, styling]

  - id: shadcn-ui
    name: shadcn/ui
    tagline: "Componentes React beautiful e customizáveis"
    docs: https://ui.shadcn.com/docs
    sitemap: null  # ❌ No sitemap available
    categories: [ui-components, react]
    preferred_for: [modern-ui, rapid-ui]

  - id: vercel
    name: Vercel
    tagline: "Deploy rápido para Next.js e frontends"
    docs: https://vercel.com/docs
    sitemap: https://vercel.com/llms.txt  # ❌ Use llms.txt instead
    categories: [deployment, hosting]
    preferred_for: [nextjs, static]

  - id: railway
    name: Railway
    tagline: "Infraestrutura moderna para desenvolvedores"
    docs: https://docs.railway.app
    sitemap: https://docs.railway.app/sitemap.xml  # ✅ Working
    categories: [deployment, backend, database]
    preferred_for: [fullstack, database]

  - id: prisma
    name: Prisma
    tagline: "ORM TypeScript para Node.js e PostgreSQL"
    docs: https://www.prisma.io/docs
    sitemap: https://www.prisma.io/docs/sitemap.xml  # ✅ Working
    categories: [orm, database]
    preferred_for: [type-safety, postgres]

  - id: resend
    name: Resend
    tagline: "Email para desenvolvedores"
    docs: https://resend.com/docs
    sitemap: https://resend.com/docs/sitemap.xml  # ⚠️ Untested
    categories: [email, transactional]
    preferred_for: [transactional-emails]
```

### Sitemap Alternatives

| Format | When to Use | Example |
|--------|-------------|---------|
| `sitemap.xml` | Standard (most common) | Supabase, Stripe, Prisma |
| `sitemap.md` | Markdown-based sitemap | Clerk |
| `llms.txt` | Full content index (LLM-friendly) | Vercel |
| `null` | No sitemap available | Tailwind, shadcn/ui |

**Note:** When `sitemap` is `null`, the agent should rely on the `tagline` and `docs` URL for context, and use webfetch to explore the documentation directly.

### Usage in SDD

The `saas-architect` generates a Software Design Document (SDD) that references tools:

```yaml
# software-design-document.md

## Recommended Stack

| Category | Tool | Rationale |
|----------|------|-----------|
| Frontend | Next.js 14 | SSR + Server Actions para rapid development |
| Database | Supabase | PostgreSQL + Auth + Realtime em um só |
| Auth | Supabase Auth | Integrado com DB, menos configurações |
| UI | shadcn/ui + Tailwind | Componentes beautiful, fácil customização |
| Billing | Stripe | Padrão indústria, documentação excelente |
| Deploy | Vercel | Deploy em 1-click para Next.js |

## Documentation References

### Supabase
- Auth Overview: https://supabase.com/docs/guides/auth
- Server-side Auth: https://supabase.com/docs/guides/auth/server-side/nextjs
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

### Stripe
- Checkout Session: https://stripe.com/docs/payments/checkout
- Customer Portal: https://stripe.com/docs/billing/customer/portal
- Webhooks: https://stripe.com/docs/webhooks

### shadcn/ui
- Installation: https://ui.shadcn.com/docs/installation/next
- Components: https://ui.shadcn.com/docs/components/accordion
```

### Sitemap Workflow

```
saas-architect needs to implement auth
       │
       ▼
 Fetch https://supabase.com/docs/sitemap.xml
       │
       ▼
 Parse XML → find relevant URLs
 (e.g., contains "auth" in path)
       │
       ▼
 Select most relevant pages
 (e.g., /guides/auth, /guides/auth/server-side)
       │
       ▼
 Add exact URLs to SDD
```

### Benefits

| Aspect | Benefit |
|--------|---------|
| Extensibility | Add new tools by editing YAML, no agent code changes |
| Flexibility | Agent chooses based on user requirements |
| Consultability | webfetch available when deeper docs needed |
| Fallback | Tagline provides context even without webfetch |
| Categorization | Filter by type (billing, db, auth, etc) |
| **Sitemap speed** | **Parse once, find exact pages without trial-and-error** |
| **Exact links** | **SDD points to specific page, not documentation root** |

### Benefits

| Aspect | Benefit |
|--------|---------|
| Extensibility | Add new tools by editing YAML, no agent code changes |
| Flexibility | Agent chooses based on user requirements |
| Consultability | webfetch available when deeper docs needed |
| Fallback | Tagline provides context even without webfetch |
| Categorization | Filter by type (billing, db, auth, etc) |
| **Sitemap speed** | **Parse once, find exact pages without trial-and-error** |
| **Exact links** | **SDD points to specific page, not documentation root** |

### Design Decisions

1. **YAML format** - Easy to read, write, and parse
2. **Tagline field** - Context available even without webfetch
3. **Categories array** - Enables filtering and recommendations
4. **preferred_for array** - Guides agent when multiple options exist
5. **Doc URLs** - Point to specific sections, not just homepage
6. **Sitemap URL** - Enables fast page discovery and exact link attachment

---

## Phase 4: Output Format

The generated project MUST follow Clean Architecture with SOLID principles.

### Generated Project Structure

```
{project-name}/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── _components/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [...routes]/
│   ├── features/               # Feature-based modules (SOLID)
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.types.ts
│   │   ├── billing/
│   │   └── users/
│   ├── shared/                 # Shared utilities
│   │   ├── lib/
│   │   ├── types/
│   │   └── utils/
│   └── components/             # Shared UI components
├── tests/
│   ├── unit/
│   └── integration/
├── prisma/
│   └── schema.prisma
├── eslint.config.js
├── prettier.config.js
└── package.json
```

---

## Open Questions

- [ ] Should the orchestrator use a state machine for interview flow?
- [ ] How to handle partial generation (user wants to continue later)?
- [ ] Should we support multiple project templates (e.g., simple vs enterprise)?
- [ ] How to validate generated code works without running it?
- [ ] Should we integrate with Stripe for real billing or just mock it?
- [ ] Should available-tools.md be static or dynamically fetched from a central index?
- [ ] How to version the available-tools.md as new tools become available?

---

## Next Steps

1. [ ] Define exact question list for interview flow
2. [ ] Design saas-architect's recommendation logic
3. [ ] Define code generator's template approach
4. [ ] Create `docs/available-tools.md` with comprehensive tool registry
5. [ ] Create agent specifications using agent-generator

---

## Notes

- The orchestrator (`saas-project-generator`) is `primary` mode with full permissions
- All execution agents (`saas-architect`, `saas-code-generator`, `saas-validator`) are `subagent` mode with `hidden: true`
- Communication happens via OpenCode's Task tool
- `permission.task` controls which subagents can be invoked
- The orchestrator should use `permission.task` to restrict which subagents it can call

---

*Last updated: 2026-04-17 (validated sitemaps - some tools use sitemap.md or llms.txt)*
