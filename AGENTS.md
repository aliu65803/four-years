# Agent Boundaries

Agents working in this repository must not read or modify these paths unless the user explicitly asks for it in the current thread:

- `.env`
- `.env.*`
- `secrets/`
- `*.pem`
- `*.key`
- `*.p12`
- production database dumps
- Clerk, Supabase, Anthropic, or Vercel dashboard exports

Default expectations:

- Treat all secret material as off-limits.
- Prefer `.env.example` when documenting configuration.
- Do not rotate, print, or copy credentials.
- Do not add new dependencies or deploy configuration without explaining why.
