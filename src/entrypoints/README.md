# Entrypoints

Three surfaces, one agent core.

```
src/entrypoints/
├── cli/        Ink/React terminal UI (src/index.tsx)
├── gateway/    WhatsApp Worker (src/gateway/index.ts)
└── web/        Vercel-hosted Next.js (Phase 2+)
```

Each surface has a `compose.ts` that builds a `CorePorts` bundle from
`src/adapters/*`. The composition root is the **only** place inside an
entrypoint that imports concrete adapter implementations.

Agent core code (`src/agent`, `src/controllers`, `src/tools`, `src/skills`)
must only depend on `src/ports/*` — never on `src/adapters/*` directly.

## Phase status

| Surface | Phase 0 (this PR) | Phase 2+ |
|---|---|---|
| CLI     | composes local adapters; CLI still uses legacy code paths in parallel | unchanged |
| Gateway | composes local adapters + WhatsApp sink; legacy paths untouched | unchanged |
| Web     | stub only — `composeWebPorts` throws | Vercel Blob + Neon Postgres + SSE + Vercel Cron |
