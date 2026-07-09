# AGENTS.md

Personal site for [frytg.digital](https://www.frytg.digital/) — Hugo static site, Tailwind CSS v4, Vite, Nub.

## Dev environment

Task runner: [just](https://github.com/casey/just). All project commands live in the root `justfile` — run `just` to list them.

- Install dependencies: `nub install`
- Run locally: `just dev` (Vite + Hugo server)
- Production build: `just build`
- Lint: `just lint`

## Project layout

- `justfile` — task runner recipes (build, dev, lint, deploy)
- `content/` — Markdown pages and blog posts
- `layouts/` — Hugo templates
- `assets/css/` — Tailwind theme and styles (`main.css` is the source of truth for tokens)
- `public/` — build output (do not edit by hand)

## Design

Read [DESIGN.md](./DESIGN.md) before changing UI, colors, typography, or layout. Match existing tokens and patterns; do not introduce new accent colors, shadows, or rounded components unless DESIGN.md is updated first.

## Code style

- Format with Biome/Prettier conventions already in the repo
- Keep changes scoped; this is a small static site, not a component library
- Do not commit secrets (`.env.sops.yaml`, decrypted env files)
