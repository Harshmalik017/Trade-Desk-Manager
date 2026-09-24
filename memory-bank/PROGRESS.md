# Progress and Active Context

## Active context

- Phase 1 (frontend UI on mock data) is complete and builds cleanly.
- Next up: Phase 2 kickoff. Confirm the backend stack (TRD section 7) and write ADR-001.

## Changelog

| Date | Change |
|---|---|
| 2026-09-25 | HTML mockup created and approved as the design reference |
| 2026-09-25 | Converted to Next.js 15 project: dashboard, clients, bill tracker (export and import), pitch tool |
| 2026-09-25 | Memory bank created: INDEX, PRD, TRD, MODULES, PROGRESS, five phase plans |

## Decisions

| ID | Decision | Status |
|---|---|---|
| D1 | Export and Import always separate in UI and data | Accepted |
| D2 | Plain CSS with tokens instead of a CSS framework, to keep Phase 1 dependency-light | Accepted |
| D3 | Mock data with a fixed demo date for repeatable demos | Accepted (remove in Phase 2) |
| D4 | Backend as Next.js Route Handlers + PostgreSQL + Prisma | Proposed, confirm in Phase 2 |

## Known gaps in Phase 1

- No persistence; refresh resets changes.
- "Add client", "Log bank follow-up" and "Copy client update" are placeholders showing a toast.
- Fonts are loaded from Google Fonts via `<link>`; switch to `next/font` on deploy.
- No automated tests yet (planned from Phase 2).

## Next steps

1. Phase 2 kickoff: confirm stack, define the Prisma schema, set up the database.
2. Build auth and roles, then bills and clients APIs, then wire the UI to them.
