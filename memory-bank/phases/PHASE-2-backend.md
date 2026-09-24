# Phase 2: Backend

**Status:** Planned (next)
**Goal:** Replace mock data with a real, secure backend so the desk can be used with real clients.

## Scope

1. Database and schema
2. Authentication and roles
3. REST API for clients, bills, documents, notes
4. Document upload and storage
5. Audit trail
6. Frontend migration from mock context to API

## Proposed stack (confirm with ADR-001)

Next.js Route Handlers, PostgreSQL, Prisma, Auth.js, Zod, S3-compatible storage.

## Draft schema

```
users        id, name, email, password_hash, role (OWNER|ASSOCIATE), created_at
clients      id, name, contact_name, phone, email, city, gstin?, ad_bank, plan, monthly_fee_inr, active, created_at
bills        id, client_id, lane (EX|IM), ref_no, bill_date, party, currency, amount, due_date,
             status (DOCS_PENDING|UNDER_REVIEW|WITH_BANK|CLOSED), assigned_to, created_at, updated_at
bill_documents  id, bill_id, doc_type, present (bool), file_key?, uploaded_by, uploaded_at
bill_notes   id, bill_id, author_id, body, created_at
audit_log    id, actor_id, entity, entity_id, action, before (json), after (json), created_at
```

Indexes: `bills(client_id, lane, status)`, `bills(due_date)`, `audit_log(entity, entity_id)`.

## API surface (draft)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/*` | Sign in and out (Auth.js) |
| GET / POST | `/api/clients` | List, create |
| GET / PATCH | `/api/clients/:id` | Read, update |
| GET / POST | `/api/bills?lane=EX&status=&clientId=` | List with filters, create |
| PATCH | `/api/bills/:id` | Update status and fields |
| PUT | `/api/bills/:id/documents/:docType` | Tick a document and optionally attach a file |
| POST | `/api/bills/:id/notes` | Add a note |
| GET | `/api/dashboard` | KPIs, lane counts, follow-ups |
| GET | `/api/bills/:id/history` | Audit trail |

All bodies validated with Zod. Errors use one shape: `{ error: { code, message } }`.

## Checklist

- [ ] ADR-001: confirm stack and hosting region
- [ ] Set up Postgres, Prisma schema, migrations, seed script (from current mock data)
- [ ] Auth.js with Owner and Associate roles, protected routes and middleware
- [ ] Clients API and Bills API with filtering and pagination
- [ ] Document tick and file upload with signed URLs
- [ ] Notes API and audit log written on every mutation
- [ ] Dashboard aggregate endpoint
- [ ] Replace `DeskProvider` mock state with real data access
- [ ] Wire placeholders: add client, log follow-up, copy client update
- [ ] Remove `DEMO_TODAY`, use real dates
- [ ] Unit tests for overdue and recommendation rules
- [ ] API integration tests and Playwright smoke test (login, change status, tick document)
- [ ] `.env.example` and deployment guide

## Acceptance criteria

- A signed-out user cannot read any client or bill data.
- Associates see only what the Owner permits; Owner sees everything.
- Status and document changes persist across refresh and appear in the audit trail with actor and time.
- The UI has no import of `mock-data.ts` except the seed script and tests.
- Export and Import stay separate in API responses and reports.

## Risks

- Real client financial data arrives in this phase: enable encryption at rest, backups, and least-privilege access from day one.
- Schema changes are costly later: review the schema with the owner before migrating.
