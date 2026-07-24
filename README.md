# F1 Dashboard

A live and historical Formula 1 dashboard built on the [OpenF1](https://openf1.org) API. Shows a live-session banner when a session is in progress, and a browsable list of recent sessions otherwise.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Web app:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Data fetching:** TanStack Query (React Query)
- **API:** [OpenF1](https://api.openf1.org/v1) — no auth required

## Structure

```
apps/
  web/          Next.js app
  mobile/       placeholder (Stage 4)
packages/
  api-client/   OpenF1Client — typed fetch wrapper
  types/        shared TypeScript types
  hooks/        shared React Query hooks
  tokens/       design tokens (colors, typography, spacing)
```

## Getting started

```bash
pnpm install
pnpm dev
```

The web app runs at [http://localhost:3000](http://localhost:3000).

## Design

Dark mode only. Flat surfaces, hairline borders instead of shadows, color reserved for meaning (live indicators, timing signals) rather than decoration. All colors are defined once in `packages/tokens` and consumed via Tailwind theme tokens — no hardcoded hex values in components.
