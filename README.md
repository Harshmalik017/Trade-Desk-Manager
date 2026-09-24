# BillClear Desk

Client and bill management desk for a trade-desk consultancy that helps exporters and importers
regularise, reconcile and close **EDPMS** (export) and **IDPMS** (import) bills with their AD Banks.

**Status:** Phase 1 complete (frontend UI on mock data). Phase 2 (backend) is next.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
npm run lint
```

Requires Node.js 18.18 or newer.

## Frontend image assets to add in `public/`

Generate these with ChatGPT image tools and place at the exact paths below:

| Path | Recommended size | Use |
|---|---|---|
| `public/images/landing-hero-desk.jpg` | 1600×900 | Main hero visual for landing page |
| `public/images/landing-workflow-card.jpg` | 1200×800 | Workflow explainer section |
| `public/images/pricing-plans-bg.jpg` | 1600×900 | Pricing section background texture |
| `public/images/dashboard-preview.jpg` | 1600×1000 | Dashboard preview screenshot/mockup |
| `public/images/client-success.jpg` | 1200×800 | Trust / social proof block |
| `public/images/logo-mark.png` | 512×512 (transparent) | Product logo mark for branding |
| `public/images/og-cover.jpg` | 1200×630 | Social preview image |

## What is in Phase 1

| Route | Screen |
|---|---|
| `/` | Colorful Home page with workflow summary and CTAs |
| `/about` | About page with founder-fit and operating model highlights |
| `/services` | Our Services page with execution support details |
| `/pricing` | Dedicated pricing page with packages and retainers |
| `/connect` | Connect With Us page with consultation channels |
| `/admin/login` | Admin login with mock credentials |
| `/dashboard` | Dashboard: KPIs, Export and Import lanes, today's bank follow-ups |
| `/clients` | Client list with open export and import bills and a suggested package |
| `/clients/[id]` | Client detail with export and import bills kept apart |
| `/bills/export` | Export (EDPMS) bill tracker with document checklist |
| `/bills/import` | Import (IDPMS) bill tracker with document checklist |
| `/pitch` and `/pitch/[clientId]` | Package recommender, price cards, retainers, proposal generator |

All data is mock data in `src/lib/mock-data.ts`. Changes (status, document ticks) live in memory
only and reset on refresh. Persistence arrives in Phase 2.

### Demo admin credentials

- Email: `admin@billcleardesk.demo`
- Password: `Desk@2026`

## Project memory bank

Read `memory-bank/INDEX.md` first. It links to the PRD, TRD, module map and all phase plans.

## Demo date

For a stable demo, "today" is fixed to 25 Sep 2026 in `src/lib/constants.ts` (`DEMO_TODAY`).
Replace it with `new Date()` when real data is connected.
