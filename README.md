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

## How it works

Dependencies flow one way: `tokens` and `types` have no dependencies → `api-client` depends on `types` → `apps/web` depends on all three. Nothing in `packages/*` imports from `apps/web`, which is what keeps `api-client`, `tokens`, and `types` reusable for `apps/mobile` later.

Request flow for `/` (the Session Selector page):

```
Browser requests "/"
      │
      ▼
app/layout.tsx          renders <html>, wraps children in <Providers> (Query context, unused so far)
      │
      ▼
app/page.tsx             export const dynamic = "force-dynamic" — always runs fresh, never statically cached
  ├─ <main> renders immediately, wraps data-dependent content in <Suspense fallback={<SessionListSkeleton />}>
  └─ SessionSelectorContent() (async Server Component) runs on the server:
        │
        ├─ new OpenF1Client()                       (packages/api-client)
        ├─ client.getSessions({year}) ──┐
        ├─ client.getMeetings({year}) ──┤  both call openF1Fetch() → real fetch to api.openf1.org
        │                                │
        ├─ joinSessionsWithMeetings()    (apps/web/lib/sessions.ts) — merges the two arrays using
        │                                 Session/Meeting types from packages/types, sorts by date desc
        ├─ findLiveSession()             — picks the currently-live session, if any
        │
        ├─ <LiveBanner session={live}>   (only rendered if a session is live)
        ├─ <h2>Recent sessions</h2>
        └─ <SessionSelectorList sessions={joined}>          client component — owns search input state
                 │
                 └─ renders <SessionCard> per session, each a <Link href="/dashboard/[sessionKey]">
                          (route doesn't exist yet — intentional 404, Stage 2 builds it)
```

All colors/spacing/type sizes used above come from `packages/tokens` via `apps/web/tailwind.config.ts`; nothing is hardcoded in the components themselves.
