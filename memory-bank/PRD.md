# PRD: BillClear Desk

## 1. Problem

Exporters and importers regularly end up with EDPMS / IDPMS bills that are pending, mismatched or
unreconciled with their AD Bank. Fixing them means collecting the right documents, reconciling each
bill, chasing the bank branch, and reporting status back to the client. Today this lives in
spreadsheets, WhatsApp threads and email, so follow-ups slip and clients have no clear view.

## 2. Product vision

A single desk where a trade-compliance consultant can see every client, every bill (export and
import separately), what documents are missing, what is overdue, and can send a professional
proposal in one tap.

## 3. Users

| Persona | Needs |
|---|---|
| **Owner** (ex bank trade desk manager) | Portfolio view, overdue alerts, quick pitching, fee tracking |
| **Associate** | Daily bill work: checklists, status updates, bank follow-up notes |
| **Client** (later phase) | Read-only view of their own bills and status, no chasing by phone |

## 4. Goals

1. Track every bill with lane (Export or Import), status, due date and document completeness.
2. Make the daily follow-up list obvious (overdue first).
3. Recommend the right package from the bill count and generate a proposal from live client data.
4. Give clients confidence through regular, case-wise status reporting.

## 5. Non-goals

- Not a replacement for the bank's EDPMS / IDPMS portals; the product does not file anything with RBI or banks.
- No legal or regulatory determinations; it is a tracking and coordination tool.
- No payments or invoicing in Phases 1-3.

## 6. Service catalogue (source of truth for pricing)

| Package | Price | Bills | Scope |
|---|---|---|---|
| Basic | ₹4,999 | up to 5 | Pending bills review, document verification, basic bill-wise reconciliation, discrepancy identification, bank coordination and follow-up, status updates |
| Standard | ₹9,999 | 6 to 20 | Basic plus detailed bill-wise reconciliation, invoice and shipping documents review, documentation gap identification, outstanding items tracking, multiple follow-ups, regular status reporting |
| Premium | ₹18,999 onwards | 20+ or complex | Standard plus old pending bills review, complex case handling, multiple-bank coordination, documentation assistance, repeated follow-ups, case-wise status reporting |

| Monthly retainer | Price |
|---|---|
| Up to 15 bills | ₹10,999 |
| Up to 40 bills | ₹20,999 |
| Up to 75 bills | ₹30,999 |

Mandatory note on client-facing output: *Final regularization is subject to verification and processing by the concerned AD Bank/authority.*

## 7. Functional requirements

| ID | Requirement | Phase |
|---|---|---|
| F1 | Dashboard with KPIs, Export and Import lane status, today's follow-ups | 1 |
| F2 | Client list and client detail with export and import bills separated | 1 |
| F3 | Bill tracker per lane with status filter, due/overdue tag, document checklist | 1 |
| F4 | Lane-specific document checklists (see TRD) | 1 |
| F5 | Pitch tool: bill-count slider, package and retainer recommendation, proposal text | 1 |
| F6 | Persist clients, bills, documents, notes | 2 |
| F7 | Authentication and roles (Owner, Associate) | 2 |
| F8 | Document upload and storage per bill | 2 |
| F9 | Audit trail of every status or document change | 2 |
| F10 | Bank follow-up log and reminders | 3 |
| F11 | Bulk import of bills from CSV / Excel exports | 3 |
| F12 | Message templates (email, WhatsApp) | 3 |
| F13 | Client portal (read-only) and status report PDF | 4 |
| F14 | Retainer usage meter and invoicing | 4 |

## 8. Non-functional requirements

- Responsive from 360px wide phones to desktop; the owner will pitch from a phone.
- Keyboard accessible with visible focus; respects `prefers-reduced-motion` and colour scheme.
- Client financial data must be protected (encryption, access control, audit); see Phase 2 and 5.
- Page loads under 2 seconds on a typical 4G connection.

## 9. Success metrics

- Time from client onboarding to first status report under 1 day.
- Zero bills overdue without a logged follow-up in the last 7 days.
- Proposal generated and sent in under 2 minutes.
- Pilot: 5 paying clients using the desk within 60 days of Phase 2.

## 10. Risks and open questions

| Risk / question | Note |
|---|---|
| Regulatory timelines (realisation and remittance periods) change | Do not hard-code; configurable per lane, confirm with a qualified professional |
| Client data sensitivity | Treat as confidential financial data; DPDP Act 2023 obligations apply once real data is stored |
| Bank-specific processes differ | Keep bank as a data field, allow per-bank notes |
| Scope creep into a full compliance suite | Hold to the non-goals above |
