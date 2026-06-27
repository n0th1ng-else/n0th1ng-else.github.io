# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## Project

Personal homepage / info hub. SvelteKit (Svelte 5) app, `@sveltejs/adapter-node`, built into a Docker image and deployed to Northflank. Package manager: **pnpm 9**, Node **>= 22.19**.

Key areas:

- `src/routes` — pages and `api/v1/*` endpoints.
- `src/lib/server` — server-only logic (data access, scraping, Cloudinary, env).
- `articles/<year>/<slug>.md` — the **canonical** source for published blog articles (git is the source of truth).
- `docs/` — RFC/ERD design documents (see below).

## Docs-first workflow (required)

**Every new feature or non-trivial change begins with a design document in `docs/` before any code is written.**

1. Copy `docs/_template.md` to `docs/<NNNN>-<slug>.md` (next sequential number, e.g. `docs/0002-...`).
2. Fill in, at minimum:
   - **Motivation** — the problem, why now, intended outcome.
   - **Diagram** — at least one [Mermaid](https://mermaid.js.org/) diagram (architecture, ER, sequence, or flow) embedded in a ` ```mermaid ` block.
   - **Plan** — the detailed, phased implementation plan.
   - **Verification** — how the change is proven to work end-to-end.
3. Link the new doc from `docs/README.md`.
4. Only then implement, referencing the doc.

Treat these docs as living records of _why_ decisions were made — update them when the design changes.

## Conventions

- TypeScript everywhere; server-only modules live under `src/lib/server`.
- Validate external/runtime input with `zod`.
- Formatting/linting: `pnpm format`, `pnpm lint`, type-check with `pnpm check`. Run these before considering work done.
- Do not commit secrets; runtime config comes from environment variables (see `src/lib/server/env.ts`).

## Workflow guardrails

- Work on a feature branch off `dev`; never commit or push on the author's behalf unless explicitly asked — leave changes for review.
- Published article content is owned by `articles/*.md` in git. Anything that serves articles must treat the markdown as canonical.
