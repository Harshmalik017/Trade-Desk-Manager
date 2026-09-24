# Phase 4: Client portal, proposals and billing

**Status:** Planned
**Goal:** Let premium clients see progress themselves and let the owner bill and report professionally.

## Scope

- Read-only client portal (Export and Import separately)
- Status report PDF per client and per case
- Proposal PDF generated from the pitch tool
- Retainer usage meter (bills used vs plan limit)
- Invoicing with GST and payment tracking

## Checklist

- [ ] Client role and invite flow; each client sees only their own data
- [ ] Portal views: summary, export bills, import bills, document requests
- [ ] Monthly and case-wise status report PDF (Premium package deliverable)
- [ ] Proposal PDF with package, price, scope and disclaimer
- [ ] Retainer meter: bills handled this month vs limit (15 / 40 / 75), warning at 80%
- [ ] Invoice generation with GST fields, numbering series, PDF
- [ ] Payment status (paid, due, overdue) and dashboard fee KPIs from real data
- [ ] Optional online payments (UPI / payment gateway) after legal and tax review
- [ ] Client notifications when status changes or documents are needed

## Acceptance criteria

- A client can never see another client's data (verified by tests).
- Reports and proposals match on-screen numbers exactly.
- Retainer meter matches the count of bills touched in the billing month.
- Invoices follow the owner's approved GST format.

## Dependencies

Phase 2 auth and roles, Phase 3 follow-up data for reports.

## Open questions

- Exact GST and invoicing setup for the consultancy (confirm with the owner's accountant).
- Whether clients should upload documents themselves or only view requests.
