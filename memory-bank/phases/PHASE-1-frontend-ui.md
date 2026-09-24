# Phase 1: Frontend UI (mock data)

**Status:** Complete
**Goal:** A polished, clickable Next.js frontend that demonstrates the whole workflow and can be used to pitch.

## Scope

- App shell, navigation, light and dark theme
- Dashboard, Clients, Client detail, Bill tracker (Export and Import), Pitch tool
- In-memory state so status changes and document ticks feel real

## Checklist

- [x] Project setup: Next.js 15, TypeScript strict, ESLint
- [x] Design tokens and global styles ported from the HTML mockup
- [x] Types, constants, packages and mock data
- [x] `DeskProvider` context (status and document mutations)
- [x] Dashboard with KPIs, lane cards, follow-up table
- [x] Clients list and detail with lane-separated bills
- [x] Bill tracker for Export (EDPMS) and Import (IDPMS) with filters
- [x] Document checklist per lane with "Missing" flags
- [x] Pitch tool: slider, package cards, retainers, proposal text with copy
- [x] Public landing page with pricing and CTA to admin login
- [x] Colorful multi-page marketing website (Home, About, Services, Pricing, Connect)
- [x] Mock admin login and protected app routes for demo flow
- [x] Pitch-ready interactions (channel, urgency, onboarding timeline)
- [x] Reusable shadcn-style `components/ui` primitives and lucide icon integration
- [x] Tailwind CSS and PostCSS wired for reusable variant-based UI and responsive pages
- [x] Mobile-responsive header with hamburger menu for public and app navigation
- [x] Marketing images placed from `public/` including consultant profile (Nikhil Goswami)
- [x] Responsive layout and safe-area handling
- [x] Memory bank created

## Acceptance criteria

- `npm run build`, `npm run typecheck` and `npm run lint` all pass.
- Export and Import never appear mixed in one table.
- Changing a bill's status or ticking a document updates the dashboard and client views immediately.
- Proposal text always contains the AD Bank disclaimer.

## Handoff to Phase 2

- `src/lib/types.ts` is the seed for the API contract and database schema.
- `DeskProvider` is the single seam to replace with real data access.
- Placeholder actions (add client, log follow-up, copy client update) need real endpoints.
