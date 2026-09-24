# TRD: BillClear Desk

## 1. Stack (Phase 1)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 15, App Router | Server pages wrap client views |
| UI | React 19, TypeScript (strict) | |
| Styling | Plain CSS in `src/app/globals.css` with CSS custom properties | Light and dark via `prefers-color-scheme` |
| State | React Context (`DeskProvider`) | In-memory; replaced by API data in Phase 2 |
| Fonts | Bricolage Grotesque (headings), IBM Plex Sans (body) | Loaded by `<link>` in `layout.tsx`; move to `next/font` when deploying |
| Data | `src/lib/mock-data.ts` | Fictional clients and bills |
| Tooling | ESLint (`next/core-web-vitals`), `tsc --noEmit` | |

## 2. Folder structure

```
billclear-desk/
├─ memory-bank/            Project memory (this folder)
├─ src/
│  ├─ app/                 Routes (App Router)
│  │  ├─ layout.tsx        Providers, header, fonts
│  │  ├─ globals.css       Design tokens and all styles
│  │  ├─ page.tsx          Dashboard
│  │  ├─ clients/          List and [id] detail
│  │  ├─ bills/            /bills redirects to /bills/export; export and import pages
│  │  └─ pitch/            Pitch tool and [clientId] variant
│  ├─ components/          UI building blocks and views
│  ├─ context/desk-context.tsx   Clients, bills, mutations
│  └─ lib/                 types, constants, utils, packages, proposal, mock-data
├─ package.json  tsconfig.json  next.config.mjs  .eslintrc.json
```

## 3. Data model (frontend types, `src/lib/types.ts`)

```ts
type Lane = 'EX' | 'IM';                       // Export (EDPMS) or Import (IDPMS)
type BillStatus = 'DOCS_PENDING' | 'UNDER_REVIEW' | 'WITH_BANK' | 'CLOSED';

interface Client { id; name; contact; city; bank; plan; feeInr }
interface Bill {
  id; clientId; lane: Lane;
  ref;            // Shipping Bill no. (EX) or Bill of Entry no. (IM)
  date;           // ISO date of the bill
  party;          // buyer (EX) or supplier (IM)
  ccy; amount;
  dueDate;        // realise-by (EX) or remit-by (IM), ISO date
  status: BillStatus;
  docs: boolean[] // aligned to DOC_CHECKLISTS[lane]
}
```

### Document checklists (`DOC_CHECKLISTS`)

| Export (EDPMS) | Import (IDPMS) |
|---|---|
| Commercial invoice | Commercial invoice |
| Packing list | Bill of Entry |
| Shipping bill + EGM status | Bill of Lading / AWB |
| Bank realisation advice / FIRC | SWIFT / remittance advice |
| e-BRC / BRC | Form A1 / LC documents |

## 4. Business rules in code

- **Overdue:** `daysOverdue = today - dueDate`. Greater than 0 shows a red "Nd overdue" tag; within 15 days shows amber; closed bills show "Closed".
- **Package recommendation:** bills ≤ 5 Basic, ≤ 20 Standard, otherwise Premium (from ₹18,999, final quote after case review).
- **Retainer recommendation:** ≤ 15, ≤ 40, ≤ 75; above 75 shows "custom quote".
- **Proposal text** is generated from the client's open bills and always includes the AD Bank disclaimer.

## 5. Routing

| Route | Component | Type |
|---|---|---|
| `/` | `DashboardView` | client view in server page |
| `/clients` | `ClientList` | client |
| `/clients/[id]` | `ClientDetail` | client, id from server page |
| `/bills` | redirect to `/bills/export` | server |
| `/bills/export`, `/bills/import` | `BillTracker lane="EX" / "IM"` | client |
| `/pitch`, `/pitch/[clientId]` | `PitchBuilder` | client |

## 6. Design system

- Palette tokens: petrol green brand (`--brand`), amber warning, brick red overdue, green success; separate accent colours for the Export lane (`--ex`) and Import lane (`--im`).
- Status colours: `.s0` docs pending (red), `.s1` under review (amber), `.s2` with bank (blue), `.s3` closed (green).
- Layout: max width 1120px, cards with 12px radius, tables scroll horizontally inside `.tw`.
- Accessibility: visible focus ring, `aria-current` on nav, table rows keyboard selectable, reduced-motion respected.
- Mobile: header respects safe-area insets; nav scrolls horizontally.

## 7. Phase 2 backend direction (proposal, confirm at kickoff)

| Concern | Proposal |
|---|---|
| API | Next.js Route Handlers under `src/app/api`, service layer in `src/server` |
| Database | PostgreSQL with Prisma |
| Auth | Auth.js (email + password or magic link), roles Owner / Associate, later Client |
| Files | S3-compatible object storage with signed URLs |
| Validation | Zod schemas shared by API and forms |
| Audit | `audit_log` table written on every mutation |
| Hosting | Vercel or a small VPS plus managed Postgres (region India preferred) |

Frontend migration path: replace `DeskProvider` mock state with data fetching (Server Components for reads, Server Actions or `fetch` for mutations). Types in `src/lib/types.ts` become the API contract seed.

## 8. Security and privacy (target from Phase 2)

- HTTPS only, secure cookies, CSRF protection, rate limiting on auth.
- Role-based access and per-client data scoping.
- Encrypt sensitive fields and files at rest; back up daily.
- Consent and retention policy aligned with the DPDP Act 2023 before storing real client data.
- No real client data in the repo, logs or screenshots.

## 9. Quality gates

- `npm run typecheck` and `npm run lint` pass with zero errors.
- `npm run build` succeeds.
- Manual check at 360px, 768px and 1280px in light and dark mode.
- From Phase 2: unit tests for business rules, API integration tests, Playwright smoke tests for the main flows.
