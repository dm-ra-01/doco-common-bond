# Archive: Audit Programme Table (from internal-audit.md)

> Extracted from `docs/compliance/iso27001/assurance/internal-audit.md`
> before migration to `AuditRegistryDashboard` (Supabase table: `public.audits`).
> Use to verify equivalence against live Supabase data post-migration.

## Audit Programme — 2026

| Audit ID   | Audit Slug                  | Planned / Completed | Scope                                                                                        | Auditor      | Status      |
| ---------- | --------------------------- | :-----------------: | -------------------------------------------------------------------------------------------- | ------------ | ----------- |
| IA-2025-01 | (pre-workflow)              |     2025-10-12      | GitHub MFA configuration check                                                               | Ryan A (CEO) | ✅ Complete |
| IA-2026-T1 | `260228-planner-backend`   |     2026-02-28      | Receptor Planner Python backend — code quality, security, test coverage                      | Antigravity  | ✅ Complete |
| IA-2026-T2 | `260304-acl`                |     2026-03-04      | Access Control & Authentication — RLS, JWT, RBAC, multi-tenancy (supabase-receptor)         | Antigravity  | ✅ Complete |
| IA-2026-T3 | `260304-state`              |     2026-03-04      | State management & GraphQL architecture (planner-frontend, preference-frontend)              | Antigravity  | ✅ Complete |
| IA-2026-T4 | `260305-match-backend`      |     2026-03-05      | Match-backend Python service — auth, DB patterns, orchestration gate, test coverage         | Antigravity  | ✅ Complete |
| IA-2026-T5 | `260305-graphql-state`      |     2026-03-05      | GraphQL cache integrity & auth architecture (all three frontends)                            | Antigravity  | ✅ Complete |
| IA-2026-D1 | `260305-iso27001-preaudit`  |     2026-03-05      | ISO 27001 ISMS documentation — pre-certification readiness review (all sections)            | Antigravity  | ✅ Complete |
| IA-2026-P1 | `260306-audit-process`      |     2026-03-06      | Audit process itself — workflow robustness, traceability, coverage gaps (all repos)          | Antigravity  | ✅ Complete |
| IA-2026-01 | (scheduled)                 |     2026-04-15      | Full ISMS scope: governance, policies, risk management, operations, and assurance            | External/peer | Scheduled  |

## Completed Audit Evidence Detail

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
| **Scope**    | All audit and implement-audit workflows across supabase-receptor, planner-backend, match-backend, planner-frontend, workforce-frontend, preference-frontend, common-bond, icu-survival |
| **Report**   | `documentation/common-bond/docs/audits/audit-process-audit/audit.md` |
| **Key findings** | 14 findings; no global audit registry (PROC-03); no PR gate before merge (PROC-01); workforce-frontend and preference-frontend have no audit workflows (PROC-14) |
| **Evidence for** | ISO 27001 Clause 9.2 (Audit programme), Clause 10.2 (Continual improvement) |
| **Outcome**  | NC-005 raised; Phase 1 fixes applied; remaining recommendations tracked in `recommendations.md` |
