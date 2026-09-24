# Memory Bank Index: BillClear Desk

Read this file first in every session. It tells you where everything is and what state the project is in.

## Snapshot

| Item | Value |
|---|---|
| Product | BillClear Desk, a client and bill management desk for EDPMS / IDPMS regularisation services |
| Owner | Former HDFC Bank Trade Desk Manager, now running an independent trade-compliance consultancy |
| Users | Owner and associates (internal); premium exporter and importer clients (later, read-only) |
| Current phase | **Phase 1 complete + go-to-market UX enhancements** (multi-page marketing website, mock admin login, interactive pitch-ready flow). **Phase 2 (backend) is next.** |
| Stack (Phase 1) | Next.js 15 App Router, React 19, TypeScript, plain CSS with design tokens, Lucide icons, shadcn-style reusable UI primitives |
| Data | In-memory mock data (`src/lib/mock-data.ts`), no persistence yet |

## Read order

1. `INDEX.md` (this file)
2. `PRD.md` - what we build and why
3. `TRD.md` - how it is built, conventions, data model
4. `MODULES.md` - every module, its routes, components and status
5. `phases/PHASE-N-*.md` - the plan and checklist for each phase
6. `PROGRESS.md` - what changed last and what to do next

## File map

| File | Purpose |
|---|---|
| `PRD.md` | Product requirements: problem, users, scope, packages and pricing, success metrics |
| `TRD.md` | Technical requirements: architecture, folder layout, data model, state, design system |
| `MODULES.md` | Module catalogue with owners of routes, components, data and phase status |
| `PROGRESS.md` | Running log, active context and next steps |
| `phases/PHASE-1-frontend-ui.md` | Frontend UI on mock data (done) |
| `phases/PHASE-2-backend.md` | API, database, auth, file storage, audit trail |
| `phases/PHASE-3-workflow-automation.md` | Bank follow-up log, reminders, bulk import, templates |
| `phases/PHASE-4-client-portal-billing.md` | Client portal, proposals PDF, retainer metering, invoicing |
| `phases/PHASE-5-hardening-launch.md` | Security review, compliance, monitoring, pilot and launch |

## Glossary

| Term | Meaning |
|---|---|
| EDPMS | Export Data Processing and Monitoring System (RBI). Tracks export bills against realisation of proceeds |
| IDPMS | Import Data Processing and Monitoring System (RBI). Tracks import bills against outward remittance |
| AD Bank | Authorised Dealer bank that handles the client's foreign exchange transactions |
| SB | Shipping Bill (export document) |
| BoE | Bill of Entry (import document) |
| EGM | Export General Manifest |
| BRC / e-BRC | Bank Realisation Certificate |
| FIRC | Foreign Inward Remittance Certificate |
| Form A1 | Application form for import remittances |
| Regularisation | Getting a pending or mismatched bill matched and closed in the bank / RBI system |
| Lane | One of the two work streams: Export (EDPMS) or Import (IDPMS). Always shown separately |

## Ground rules

- Export and Import are **always separate** in UI, data and reports.
- Final regularisation is **subject to verification and processing by the concerned AD Bank / authority**. The product never promises an outcome and must show this note in client-facing output.
- Demo data uses fictional clients. Never commit real client data to the repo.
- Update `PROGRESS.md` at the end of every working session.
