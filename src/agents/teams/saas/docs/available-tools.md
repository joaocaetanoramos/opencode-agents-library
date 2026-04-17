# Available Tools Registry

> Registry of external services and documentation that saas-architect can consult when designing a SaaS project.

## Schema

Each tool has:
- `id`: Unique identifier (kebab-case)
- `name`: Display name
- `tagline`: One-line description
- `docs`: Main documentation URL
- `sitemap`: URL to sitemap for fast page discovery (XML, MD, or TXT)
- `categories`: What the tool is used for
- `preferred_for`: When to prefer this tool over alternatives

## Tools

```yaml
tools:
  # === FRONTEND ===
  - id: nextjs
    name: Next.js
    tagline: "Framework React com SSR, Server Actions e App Router"
    docs: https://nextjs.org/docs
    sitemap: https://nextjs.org/docs/sitemap.xml
    categories: [frontend, fullstack, ssr]
    preferred_for: [ssr, seo-friendly, rapid-development, startups]

  # === DATABASE ===
  - id: supabase
    name: Supabase
    tagline: "Backend as a service com PostgreSQL, Auth, Realtime e Storage"
    docs: https://supabase.com/docs
    sitemap: https://supabase.com/docs/sitemap.xml
    categories: [database, auth, backend, realtime]
    preferred_for: [rapid-development, startups, fullstack]

  - id: prisma
    name: Prisma
    tagline: "ORM TypeScript para Node.js com type safety"
    docs: https://www.prisma.io/docs
    sitemap: https://www.prisma.io/docs/sitemap.xml
    categories: [orm, database]
    preferred_for: [type-safety, postgres, complex-queries]

  # === AUTH ===
  - id: clerk
    name: Clerk
    tagline: "Autenticação e user management descomplicado"
    docs: https://clerk.com/docs
    sitemap: https://clerk.com/docs/sitemap.md
    categories: [auth, user-management]
    preferred_for: [react, nextjs, quick-setup]

  - id: nextauth
    name: NextAuth.js
    tagline: "Autenticação completa para Next.js"
    docs: https://next-auth.js.org
    sitemap: null
    categories: [auth, nextjs]
    preferred_for: [nextjs-only, open-source]

  # === BILLING ===
  - id: stripe
    name: Stripe
    tagline: "Pagamentos, assinaturas e banking para internet"
    docs: https://stripe.com/docs
    sitemap: https://stripe.com/docs/sitemap.xml
    categories: [billing, payments, subscriptions]
    preferred_for: [production, subscription-saas, enterprise]

  - id: lemoonsqueezy
    name: LemonSqueezy
    tagline: "Payments & Billing for SaaS"
    docs: https://docs.lemonsqueezy.com
    sitemap: null
    categories: [billing, payments, subscriptions]
    preferred_for: [indie-hackers, simple-setup]

  # === UI ===
  - id: tailwind
    name: Tailwind CSS
    tagline: "Utility-first CSS framework"
    docs: https://tailwindcss.com/docs
    sitemap: null
    categories: [css, styling]
    preferred_for: [rapid-ui, custom-designs]

  - id: shadcn-ui
    name: shadcn/ui
    tagline: "Beautiful components built with Radix UI and Tailwind"
    docs: https://ui.shadcn.com/docs
    sitemap: null
    categories: [ui-components, react]
    preferred_for: [modern-ui, accessible, production]

  # === DEPLOYMENT ===
  - id: vercel
    name: Vercel
    tagline: "Deploy para Next.js e frontends"
    docs: https://vercel.com/docs
    sitemap: https://vercel.com/llms.txt
    categories: [deployment, hosting, serverless]
    preferred_for: [nextjs, frontend, serverless]

  - id: railway
    name: Railway
    tagline: "Infraestrutura moderna para desenvolvedores"
    docs: https://docs.railway.app
    sitemap: https://docs.railway.app/sitemap.xml
    categories: [deployment, backend, database]
    preferred_for: [fullstack, database, containers]

  - id: flyio
    name: Fly.io
    tagline: "Deploy apps close to your users"
    docs: https://fly.io/docs
    sitemap: null
    categories: [deployment, backend, global]
    preferred_for: [global-apps, edge-computing]

  # === EMAIL ===
  - id: resend
    name: Resend
    tagline: "Email para desenvolvedores"
    docs: https://resend.com/docs
    sitemap: null
    categories: [email, transactional]
    preferred_for: [transactional-emails, react-email]

  - id: postmark
    name: Postmark
    tagline: "Transactional email API"
    docs: https://postmarkapp.com/docs
    sitemap: null
    categories: [email, transactional]
    preferred_for: [reliability, templates]

  # === MONITORING ===
  - id: sentry
    name: Sentry
    tagline: "Error tracking e performance monitoring"
    docs: https://docs.sentry.io
    sitemap: null
    categories: [monitoring, error-tracking]
    preferred_for: [production, debugging]

  # === SEARCH ===
  - id: typesense
    name: Typesense
    tagline: "Fast, typo-tolerant search engine"
    docs: https://typesense.org/docs
    sitemap: null
    categories: [search, database]
    preferred_for: [fast-search, self-hosted]

  - id:algolia
    name: Algolia
    tagline: "Search and discovery platform"
    docs: https://www.algolia.com/doc
    sitemap: null
    categories: [search, saas]
    preferred_for: [instant-search, faceted-search]
```

## Categories Quick Reference

| Category | Tools |
|----------|-------|
| frontend | nextjs |
| database | supabase, prisma |
| auth | clerk, nextauth |
| billing | stripe, lemoonsqueezy |
| ui | tailwind, shadcn-ui |
| deployment | vercel, railway, flyio |
| email | resend, postmark |
| monitoring | sentry |
| search | typesense, algolia |

## Sitemap Reference

| Format | Tools | How to Use |
|--------|-------|------------|
| `sitemap.xml` | nextjs, supabase, stripe, prisma, railway | Parse XML directly |
| `sitemap.md` | clerk | Read markdown links |
| `llms.txt` | vercel | Read line-separated URLs |
| `null` | tailwind, shadcn-ui, nextauth, etc | Use main docs URL |

## Preferred For Use Cases

| Use Case | Recommended Stack |
|----------|-------------------|
| Rapid MVP | Next.js + Supabase + Clerk + Stripe |
| TypeScript Heavy | Next.js + Prisma + Clerk |
| Indie Hacker | Next.js + Supabase + LemonSqueezy |
| Enterprise | Next.js + Prisma + Clerk + Stripe |
| SEO Focus | Next.js + Vercel + shadcn-ui |
