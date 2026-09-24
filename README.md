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

## What is in Phase 1

| Route | Screen |
|---|---|
| `/` | Landing page with workflow summary and pricing |
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
