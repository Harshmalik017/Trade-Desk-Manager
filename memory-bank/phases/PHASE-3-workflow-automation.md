# Phase 3: Bank coordination workflow and automation

**Status:** Planned
**Goal:** Reduce manual chasing. Every bill has a clear next action and nothing goes stale.

## Scope

- Bank follow-up log (who was contacted, when, outcome, next date)
- Reminders and ageing alerts
- Bulk import of bills from CSV / Excel exports
- Message templates for banks and clients
- Saved views and search

## Checklist

- [ ] `follow_ups` table and UI on bill detail (contact, channel, outcome, next follow-up date)
- [ ] "Stale bill" rule: open bill with no follow-up in 7 days flagged on dashboard
- [ ] Daily reminder job (email or in-app) for due and overdue bills
- [ ] Bulk import: upload CSV / Excel, column mapping, validation report, dry run, then commit
- [ ] De-duplication on lane + reference number per client
- [ ] Template library: bank follow-up email, client document request, status update (with variables)
- [ ] WhatsApp and email hand-off links with prefilled text
- [ ] Global search across clients, references, parties
- [ ] Saved filters (for example "Export, with bank, overdue")
- [ ] Per-bank notes (branch contact, submission process)

## Acceptance criteria

- Importing a 200-row file shows errors per row and can be undone before commit.
- Each open bill shows its last follow-up and next follow-up date.
- Reminders fire once per due date and can be snoozed.
- Templates never omit the AD Bank disclaimer in client-facing text.

## Dependencies

Phase 2 database, auth and audit trail.
