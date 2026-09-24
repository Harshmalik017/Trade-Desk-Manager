# Modules

Status legend: **Done** built and working on mock data, **Planned**, **Later** beyond current plan.

| # | Module | Purpose | Routes | Key files | Status | Phase |
|---|---|---|---|---|---|---|
| M1 | App shell | Header, mobile hamburger navigation, providers, theme tokens | all | `app/layout.tsx`, `components/AppHeader.tsx`, `app/globals.css` | Done | 1 |
| M2 | Dashboard | KPIs, Export and Import lanes, today's follow-ups | `/dashboard` | `components/DashboardView.tsx`, `LaneCard.tsx`, `StatusBar.tsx`, `KpiCard.tsx` | Done | 1 |
| M2A | Marketing website | Public-facing Home, About, Services, Pricing, and Connect pages with CTA flow | `/`, `/about`, `/services`, `/pricing`, `/connect` | `components/LandingPage.tsx`, `components/AboutPage.tsx`, `components/ServicesPage.tsx`, `components/PricingPage.tsx`, `components/ConnectPage.tsx`, `app/page.tsx` | Done | 1 |
| M2B | Admin auth (mock) | Demo admin login and route protection | `/admin/login` | `context/auth-context.tsx`, `components/AdminLogin.tsx`, `components/ProtectedRoute.tsx` | Done (mock) | 1 |
| M3 | Clients | Client list, detail, bills split by lane, suggested package | `/clients`, `/clients/[id]` | `components/ClientList.tsx`, `ClientDetail.tsx` | Done | 1 |
| M4 | Bill tracker | Per-lane bill table, status filter, detail panel | `/bills/export`, `/bills/import` | `components/BillTracker.tsx`, `BillDetail.tsx`, `DueTag.tsx` | Done | 1 |
| M5 | Document checklist | Lane-specific documents with missing flags | inside M4 | `components/DocChecklist.tsx`, `lib/constants.ts` | Done | 1 |
| M6 | Pitch and packages | Package and retainer recommender, proposal text, pitch-ready controls | `/pitch`, `/pitch/[clientId]` | `components/PitchBuilder.tsx`, `PlanCard.tsx`, `lib/packages.ts`, `lib/proposal.ts` | Done | 1 |
| M7 | Toast and feedback | Lightweight confirmations | global | `components/Toast.tsx` | Done | 1 |
| M8 | Data layer | Types, mock data, context store | global | `lib/types.ts`, `lib/mock-data.ts`, `context/desk-context.tsx` | Done (mock) | 1 |
| M8A | Reusable UI primitives | Shared shadcn-style component API with Tailwind variants for consistent UI | global | `components/ui/*`, `lib/utils.ts`, `tailwind.config.ts` | Done | 1 |
| M9 | Backend API and DB | Persistence for clients, bills, documents, notes | `/api/*` | `src/server/*` (new) | Planned | 2 |
| M10 | Auth and roles | Sign-in, Owner and Associate roles | `/login` | Auth.js config (new) | Planned | 2 |
| M11 | Document storage | Upload and retrieve bill documents | inside bill detail | storage service (new) | Planned | 2 |
| M12 | Audit trail | History of changes per bill and client | bill detail | `audit_log` (new) | Planned | 2 |
| M13 | Follow-up log and reminders | Notes per bank contact, due reminders | bill detail, `/follow-ups` | new | Planned | 3 |
| M14 | Bulk import | CSV / Excel import of bills | `/import` | new | Planned | 3 |
| M15 | Message templates | Email and WhatsApp templates | `/templates` | new | Planned | 3 |
| M16 | Client portal | Read-only client view and status report PDF | `/portal/*` | new | Planned | 4 |
| M17 | Retainer meter and invoicing | Usage against plan, invoices, payments | `/billing` | new | Planned | 4 |
| M18 | Observability and compliance | Logging, monitoring, backups, DPDP readiness | infra | new | Planned | 5 |

## Module dependencies

```
M8 Data layer ──► M2 Dashboard, M3 Clients, M4 Bill tracker ──► M5 Checklist
M6 Pitch ──► M8 (client and bill counts)      M1 Shell ──► everything
Phase 2: M9 replaces the mock in M8; M10 gates all routes; M11 and M12 attach to M4
```

## Adding a module

1. Add a row here with route, files, phase.
2. Add the checklist item to the matching phase file.
3. Update `PROGRESS.md` when it ships.
