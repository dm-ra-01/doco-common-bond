---
title: Non-Conformity Log
sidebar_position: 2
---

# Non-Conformity Log

> **Note:** This log tracks deviations from our policies or the ISO standard
> found during audits or daily operations. All entries include the source audit
> slug for cross-referencing.

**Last Reviewed:** 2026-03-06

| ID     | Date       | Source                                            | Description (summary)                                                                                            | Root Cause                                                                  | Corrective Action                                                       | Status         |
| :----- | :--------- | :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------------- |
| NC-003 | 2026-03-04 | Internal Technical Audit (`260304-acl`)           | Hardcoded service-account email in RLS policies — bypasses RBAC with no JWT role, no audit trail, no rotation    | Architectural design flaw from early prototype                              | [CA-003](./corrective-actions.md#ca-003-service-account-rbac-migration) | ✅ Closed      |
| NC-004 | 2026-03-05 | ISO 27001 Docs Audit (`260305-iso27001-preaudit`) | 20 documentation gaps in ISMS: placeholder fields, no approval blocks, incomplete Risk Register, SoA stub        | Documentation in draft/template state                                       | [CA-004](./corrective-actions.md#ca-004-isms-documentation-uplift)      | 🔄 In Progress |
| NC-005 | 2026-03-06 | Audit Process Audit (`260306-audit-process`)      | No PR/review gate before audit branches merge to main; no global audit registry; missing per-app audit workflows | Process gaps — audit workflow developed iteratively without full governance | [CA-005](./corrective-actions.md#ca-005-audit-process-governance)       | ✅ Closed      |

## Notes

### NC-003 — Detail

Hardcoded service-account email (`allocator_py_admin@commonbond.com`) was
present in RLS policies, bypassing RBAC with no JWT role, no audit trail, and no
rotation mechanism.

### NC-005 — Detail

Three distinct process gaps were identified by the `260306-audit-process` audit:

- **PROC-01** — No PR/review gate exists before audit branches merge to `main`.
  All commits during this session were pushed directly to `main`.
- **PROC-03** — No global audit registry exists. Audits are scattered across
  individual repository `docs/audits/` directories with no central index.
- **PROC-14** — `workforce-frontend` and `preference-frontend` have no dedicated
  audit workflows. The `/audit` slash command was previously scoped only to
  `receptor-planner`.
