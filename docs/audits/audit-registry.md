---
title: Audit Registry
sidebar_position: 1
---

# Audit Registry

> **PROC-03 Implementation.** This registry is the canonical, cross-ecosystem
> index of all technical audits conducted across the Common Bond and Receptor
> platform. Each entry links to the source `audit.md` and `recommendations.md`
> where they live inside the relevant repository's `docs/audits/` folder.

**Last Updated:** 2026-03-06 | **Maintained by:** Engineering Leadership

---

## How to Read This Registry

| Column        | Meaning                                               |
| :------------ | :---------------------------------------------------- |
| **Slug**      | Unique audit identifier in `YYMMDD-short-name` format |
| **Scope**     | Repository / subsystem covered                        |
| **Auditor**   | Who performed the audit                               |
| **Status**    | `✅ Complete` · `🔄 In Progress` · `📋 Planned`       |
| **NC Raised** | Non-conformity log entries raised as a result         |
| **Report**    | Links to `audit.md` and `recommendations.md`          |

---

## Active Registry

### 🗓️ 2026-03-06

| Slug                   | Title                    | Scope                                         | Auditor     | Status      | NC Raised                                                                      | Report                                                                                                                                        |
| :--------------------- | :----------------------- | :-------------------------------------------- | :---------- | :---------- | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `260306-audit-process` | Audit Process Meta-Audit | All repositories — global engineering process | Antigravity | ✅ Complete | [NC-005](/docs/compliance/iso27001/assurance/nonconformity-log#nc-005--detail) | [audit.md](../audits/archive/260306-audit-process/audit.md) · [recommendations.md](../audits/archive/260306-audit-process/recommendations.md) |

### 🗓️ 2026-03-05

| Slug                       | Title                                      | Scope                                                           | Auditor     | Status         | NC Raised                                                                      | Report                                                                                                                                                                                                                                                            |
| :------------------------- | :----------------------------------------- | :-------------------------------------------------------------- | :---------- | :------------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260305-iso27001-preaudit` | ISO 27001 Pre-Review Audit                 | `common-bond` ISMS documentation                                | Antigravity | ✅ Complete    | [NC-004](/docs/compliance/iso27001/assurance/nonconformity-log#nc-004--detail) | [audit.md](../audits/260305-iso27001-preaudit/audit.md) · [recommendations.md](../audits/260305-iso27001-preaudit/recommendations.md)                                                                                                                             |
| `260305-graphql-state`     | GraphQL & State Management Audit           | `planner-frontend`, `workforce-frontend`, `preference-frontend` | Antigravity | ✅ Complete    | —                                                                              | [audit.md](https://github.com/dm-ra-01/planner-frontend/blob/main/docs/audits/archive/260305-graphql-state/audit.md) · [recommendations.md](https://github.com/dm-ra-01/planner-frontend/blob/main/docs/audits/archive/260305-graphql-state/recommendations.md)   |
| `260305-match-backend`     | Match-Backend ↔ Supabase Integration Audit | `backend/match-backend`, `supabase-receptor`                    | Antigravity | 🔄 In Progress | —                                                                              | [audit.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260305-match-backend/audit.md) · [recommendations.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260305-match-backend/recommendations.md) |

### 🗓️ 2026-03-04

| Slug         | Title                                 | Scope                                | Auditor     | Status      | NC Raised                                                                      | Report                                                                                                                                                                                                                                        |
| :----------- | :------------------------------------ | :----------------------------------- | :---------- | :---------- | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260304-acl` | Access Control & Authentication Audit | `supabase-receptor` — RLS, JWT, RBAC | Antigravity | ✅ Complete | [NC-003](/docs/compliance/iso27001/assurance/nonconformity-log#nc-003--detail) | [audit.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260304-acl/audit.md) · [recommendations.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260304-acl/recommendations.md) |

---

## Coverage Summary

```
Repository                   Audits   Last Audit
─────────────────────────────────────────────────
supabase-receptor              2       2026-03-05
backend/match-backend          1       2026-03-05
planner-frontend               1       2026-03-05
workforce-frontend             0       —
preference-frontend            0       —
backend/receptor-planner       0       —
common-bond (ISMS docs)        2       2026-03-06
────────────────────────────────────── ─────────
Total                          6+      2026-03-06
```

> **Coverage gaps addressed:** `workforce-frontend`, `preference-frontend`, and
> `receptor-planner` now have fully operational audit workflows (implemented via
> [REC-14](../audits/audit-process-audit/recommendations.md)).

---

## Adding a New Entry

When an agent completes a new audit, they must:

1. Add a row to the **Active Registry** table above under the correct date
   heading.
2. Update the **Coverage Summary** table.
3. If a Non-Conformity was raised, cross-reference the
   [Non-Conformity Log](/docs/compliance/iso27001/assurance/nonconformity-log).
4. Commit this file along with the audit branch merge.

This file is the **PROC-03** implementation — see
[CA-005](/docs/compliance/iso27001/assurance/corrective-actions) for the full
corrective action plan.
