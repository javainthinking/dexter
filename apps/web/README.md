# @dexter/web

Vercel-hosted Next.js front-end for Dexter. Shares the agent core with the
CLI and WhatsApp Worker via the ports/adapters layering in `../../src`.

## Architecture

```
apps/web/                        Next.js 16 App Router
├── app/
│   ├── layout.tsx               Root Server Component
│   ├── page.tsx                 Landing
│   ├── chat/page.tsx            Client UI, consumes SSE
│   └── api/agent/route.ts       Runs real AgentRunnerController, streams events
├── lib/
│   └── session.ts               sessionId cookie + per-session ChatHistory cache
├── next.config.ts               webpack extensionAlias (.js → .ts), externalDir
├── vercel.json                  framework + functions.maxDuration=300
└── .env.local → ../../.env      Symlink for local dev (gitignored)
```

The route handler uses `@dexter/core/*` tsconfig path aliases to import
from the repo-root `src/`. Adapters get assembled in
`src/entrypoints/web/compose.ts`. Current mode: **local** (SQLite vector
index + filesystem). Phase 3 will add **cloud** mode (Postgres + Vercel
Blob) and switch automatically when `DATABASE_URL` is set.

## Running locally

From repo root:

```bash
bun install
bun --filter @dexter/web dev
```

The dev server runs at <http://localhost:3000>. Open `/chat` and ask
something like "What is the current price of AAPL?".

### Environment variables

The agent needs API keys (OPENAI_API_KEY, FINANCIAL_DATASETS_API_KEY, …).
Next.js auto-loads `apps/web/.env.local` and **does not** look at the
repo-root `.env`. Pick one of:

**Option A — once the project is linked to Vercel (recommended):**

```bash
cd apps/web
vercel link            # one-time, attaches to the Vercel project
vercel env pull .env.local --yes
```

`vercel env pull` writes a fresh `.env.local` (including any OIDC token)
and is the canonical source of truth. Re-run whenever secrets change or
the OIDC token expires (~12h).

**Option B — purely local, no Vercel account:**

```bash
ln -sf ../../.env apps/web/.env.local   # symlink to the repo-root .env the CLI already uses
```

`.env.local` is gitignored by Next.js convention either way.

### Auth env vars (NextAuth v4)

```env
# Required in production. Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=...
# Public deployment URL — Vercel auto-injects in prod; set explicitly in preview
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional — omit to disable the "Continue with Google" button)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# SMTP for the 6-digit email-code flow. If SMTP_PASS is missing the dev
# environment falls back to surfacing the code directly on the sign-in
# page so testing still works.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@dexter.app
SMTP_PASS=...
MAIL_FROM=Dexter <noreply@dexter.app>
```

Auth uses four database tables — `dexter_users` / `dexter_accounts` /
`dexter_auth_sessions` / `dexter_verification_tokens` — all created by
the Drizzle migration (`bun run db:migrate`).

### Why webpack instead of Turbopack?

The root agent code uses TypeScript ESM with explicit `.js` extensions on
imports (the only style Bun + Node accept at runtime). Turbopack in
Next.js 16 does not yet rewrite `.js → .ts` automatically for files
outside the app directory, so dev currently runs via `next dev --webpack`
with `resolve.extensionAlias` enabled. We can switch back to Turbopack
once that resolution lands (or after a one-time migration that strips
`.js` suffixes in `src/`).

## Deploying to Vercel

1. Import the repo into Vercel.
2. **Set Root Directory to `apps/web`** in the project settings.
3. Add secrets either via the dashboard or CLI:
   ```bash
   echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY production preview --sensitive
   echo "$FINANCIAL_DATASETS_API_KEY" | vercel env add FINANCIAL_DATASETS_API_KEY production preview --sensitive
   # …repeat for every key the agent needs
   ```
   Then `vercel env pull apps/web/.env.local --yes` to mirror them locally.
4. The `vercel.json` here pins the agent route to `maxDuration: 300`,
   matching the Fluid Compute ceiling.

**Caveats — known limits in this Phase 2 deployment**

- Memory writes (long-term + daily markdown files) and the SQLite vector
  index go to ephemeral function disk. Restarts wipe them. Phase 3 swaps
  to Vercel Blob + Neon Postgres.
- Multi-turn chat history is stored in a module-scope `Map`, so it does
  not survive cold starts and is not shared across instances.
- The browser tool is disabled on Web. fetch + search still work.

## Phase 3 preview

Adapter package additions:
- `src/adapters/blob/vercel-blob.ts`
- `src/adapters/storage/postgres/{memory-vector-db,session-meta,cron-storage}.ts`
- `src/adapters/secrets/db-encrypted.ts`
- `src/adapters/scheduler/vercel-cron.ts`

`composeWebPorts({ mode: 'cloud', ... })` will auto-select them when
`DATABASE_URL` is present. No route-handler changes required.
