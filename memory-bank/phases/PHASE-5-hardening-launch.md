# Phase 5: Hardening, compliance and launch

**Status:** Planned
**Goal:** Make the product safe, reliable and ready for paying clients.

## Scope

- Security review and penetration checks
- Data protection and retention (DPDP Act 2023 readiness)
- Monitoring, logging, backups, disaster recovery
- Performance and accessibility pass
- Pilot with five clients, then launch

## Checklist

- [ ] Threat model and security review (auth, file access, role scoping)
- [ ] Dependency audit, secrets management, security headers, rate limits
- [ ] Privacy notice, consent capture, retention and deletion process for client data
- [ ] Data processing terms with clients; confidentiality language reviewed by counsel
- [ ] Encrypted daily backups with a tested restore
- [ ] Error tracking, uptime monitoring, structured logs (no client data in logs)
- [ ] Performance budget (LCP under 2.5s on 4G), image and font optimisation (`next/font`)
- [ ] Accessibility audit (WCAG 2.1 AA targets)
- [ ] Load test with realistic volumes (for example 75 bills per client, 100 clients)
- [ ] Onboarding guide and short training for associates
- [ ] Pilot with 5 clients, collect feedback, fix top issues
- [ ] Launch checklist, support process, changelog

## Acceptance criteria

- No critical or high security findings open.
- Restore from backup verified end to end.
- Pilot clients complete a full cycle (onboard, track, report) without manual data fixes.
- Support response and escalation process documented.

## Post-launch ideas

Multi-user firm accounts, additional AD bank playbooks, analytics on time-to-closure, integrations with accounting tools.
