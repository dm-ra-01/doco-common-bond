---
title: Internal Audit
sidebar_position: 1
---

# Internal Audit Procedure

## 1. Purpose

To verify that the ISMS conforms to its own requirements and ISO 27001:2022
standards, and that technical controls are implemented and effective.

:::note[ISO 27001 Clause 9.2]

Clause 9.2 requires that the organisation conduct internal audits at planned
intervals to provide information on whether the ISMS conforms to its own
requirements and is effectively implemented and maintained. Audit results must
be retained as documented information.

:::

## 2. Audit Schedule

Internal audits are conducted **annually** or before significant external
audits. Technical control audits are conducted on a **rolling basis** using the
adversarial review workflow documented at
`.agents/workflows/audit.md` within each repository. This workflow constitutes
the organisation's documented internal audit procedure for technical controls
per ISO 27001 Clause 9.2.

### Audit Programme — 2026

| Audit ID   | Audit Slug                  | Planned / Completed | Scope                                                                                        | Auditor      | Status      |
| ---------- | --------------------------- | :-----------------: | -------------------------------------------------------------------------------------------- | ------------ | ----------- |
| IA-2025-01 | (pre-workflow)              |     2025-10-12      | GitHub MFA configuration check                                                               | Ryan A (CEO) | ✅ Complete |
| IA-2026-T1 | `260228-receptor-planner`   |     2026-02-28      | Receptor Planner Python backend — code quality, security, test coverage                      | Antigravity  | ✅ Complete |
| IA-2026-T2 | `260304-acl`                |     2026-03-04      | Access Control & Authentication — RLS, JWT, RBAC, multi-tenancy (supabase-receptor)         | Antigravity  | ✅ Complete |
| IA-2026-T3 | `260304-state`              |     2026-03-04      | State management & GraphQL architecture (planner-frontend, preference-frontend)              | Antigravity  | ✅ Complete |
| IA-2026-T4 | `260305-match-backend`      |     2026-03-05      | Match-backend Python service — auth, DB patterns, orchestration gate, test coverage         | Antigravity  | ✅ Complete |
| IA-2026-T5 | `260305-graphql-state`      |     2026-03-05      | GraphQL cache integrity & auth architecture (all three frontends)                            | Antigravity  | ✅ Complete |
| IA-2026-D1 | `260305-iso27001-preaudit`  |     2026-03-05      | ISO 27001 ISMS documentation — pre-certification readiness review (all sections)            | Antigravity  | ✅ Complete |
| IA-2026-P1 | `260306-audit-process`      |     2026-03-06      | Audit process itself — workflow robustness, traceability, coverage gaps (all repos)          | Antigravity  | ✅ Complete |
| IA-2026-01 | (scheduled)                 |     2026-04-15      | Full ISMS scope: governance, policies, risk management, operations, and assurance            | External/peer | Scheduled  |

After each audit is conducted, the findings are recorded in the audit report
at `docs/audits/[slug]/audit.md` within the relevant repository, and
recommendations are tracked in `docs/audits/[slug]/recommendations.md` on a
dedicated feature branch (`audit/[slug]`).

## 3. Completed Technical Audit Evidence

The following audits have been completed and provide documented evidence of
technical control implementation and effectiveness. Each is conducted using a
six-lens adversarial review methodology (Malicious User, Careless Colleague,
Future Maintainer, Ops/On-Call, Data Integrity, Interaction Effects).

### IA-2026-T2 — Access Control & Authentication (260304-acl)

| Field        | Detail |
|---|---|
| **Date**     | 2026-03-04 |
| **Scope**    | supabase-receptor: RLS policies, JWT architecture, RBAC (ACL groups), multi-tenancy, service account access |
| **Report**   | `supabase-receptor/docs/audits/archive/260304-acl/audit.md` |
| **Key findings** | Hardcoded email service bypass (NC-003, resolved); no audit trail for role changes; JWT staleness window documented |
| **Evidence for** | ISO 27001 Annex A 8.2 (Privileged access rights), 8.3 (Access restriction), 5.18 (Access rights management) |
| **Outcome**  | 15 recommendations raised; ACL modernisation audit (re-audit `260305-adversarial`) verified remediation |

### IA-2026-T4 — Match-Backend Python Service (260305-match-backend)

| Field        | Detail |
|---|---|
| **Date**     | 2026-03-05 |
| **Scope**    | match-backend: authentication, PostgREST query patterns, orchestration gate, test coverage |
| **Report**   | `supabase-receptor/docs/audits/archive/260305-match-backend/audit.md` |
| **Key findings** | TOCTOU patterns documented; empty-list guard requirements identified; timing-safe auth enforced |
| **Evidence for** | ISO 27001 Annex A 8.24 (Cryptography), 8.28 (Secure coding) |
| **Outcome**  | All critical recommendations implemented and verified via pytest |

### IA-2026-T5 — GraphQL & State Management (260305-graphql-state)

| Field        | Detail |
|---|---|
| **Date**     | 2026-03-05 |
| **Scope**    | planner-frontend, preference-frontend, workforce-frontend: Urql cacheExchange, authExchange, isEditing guards |
| **Report**   | `frontend/planner-frontend/docs/audits/archive/260305-graphql-state/audit.md` |
| **Key findings** | Schema-to-preference cacheExchange migration; authExchange enforced in preference-frontend |
| **Evidence for** | ISO 27001 Annex A 8.28 (Secure coding), 8.29 (Security testing) |
| **Outcome**  | All recommendations implemented; all TypeScript checks and unit tests passing |

### IA-2026-D1 — ISO 27001 Documentation Pre-Review (260305-iso27001-preaudit)

| Field        | Detail |
|---|---|
| **Date**     | 2026-03-05 |
| **Scope**    | All ISO 27001 ISMS documentation: governance, policies, risk management, operations, assurance |
| **Report**   | `documentation/common-bond/docs/audits/260305-iso27001-preaudit/audit.md` |
| **Key findings** | 20 findings across all sections; 4 critical gaps (missing SoA, no risk acceptance criteria, unfilled placeholders, no approval blocks) |
| **Evidence for** | ISO 27001 Clause 9.2 (Internal audit programme), 7.5 (Documented information) |
| **Outcome**  | NC-004 raised; remediation in progress — approval blocks added to all policies, risk register expanded to 12 risks |

### IA-2026-P1 — Audit Process Meta-Audit (260306-audit-process)

| Field        | Detail |
|---|---|
| **Date**     | 2026-03-06 |
| **Scope**    | All audit and implement-audit workflows across supabase-receptor, receptor-planner, match-backend, planner-frontend, workforce-frontend, preference-frontend, common-bond, icu-survival |
| **Report**   | `documentation/common-bond/docs/audits/audit-process-audit/audit.md` |
| **Key findings** | 14 findings; no global audit registry (PROC-03); no PR gate before merge (PROC-01); workforce-frontend and preference-frontend have no audit workflows (PROC-14) |
| **Evidence for** | ISO 27001 Clause 9.2 (Audit programme), Clause 10.2 (Continual improvement) |
| **Outcome**  | NC-005 raised; Phase 1 fixes applied; remaining recommendations tracked in `recommendations.md` |

## 4. Audit Process

The technical audit workflow follows these steps (documented in `.agents/workflows/audit.md`
within each repository):

1. **Scope:** Define scope based on user or risk-register priority.
2. **Research:** Read source code, schemas, and existing documentation.
3. **Adversarial Review:** Apply six adversarial lenses to surface issues that
   functional testing does not find.
4. **Record:** Write `audit.md` (findings) and `recommendations.md` (prioritised
   actions with implementation tasks).
5. **Feature Branch:** All findings and subsequent implementation committed to
   `audit/[slug]` branch for traceability.
6. **Implement:** Follow-on `implement-audit.md` workflow implements each
   recommendation with a test gate before merge.

## 5. Traditional Audit Process

For non-technical ISMS audits (documentation, governance, policy review):

1. **Plan:** Define scope and select an auditor independent of the work.
2. **Conduct:** Interview staff, review evidence (logs, configurations), observe processes.
3. **Report:** Document findings categorised as:
   - **Conformity:** Innovation / Good Practice.
   - **Non-Conformity (Major/Minor):** Failure to meet a requirement.
   - **Observation:** Opportunity for improvement.
4. **Follow-up:** Findings recorded in the Non-Conformity Log; corrective
   actions tracked in Corrective Actions.

## 6. Reporting

Audit reports are presented to Management and any Non-Conformities are entered
into the **Non-Conformity Log** and assigned a Corrective Action.
