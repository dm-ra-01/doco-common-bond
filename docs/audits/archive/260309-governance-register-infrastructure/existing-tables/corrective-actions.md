# Archive: Corrective Actions Log (from corrective-actions.md)

> Extracted from `docs/compliance/iso27001/assurance/corrective-actions.md`
> before migration to `CorrectiveActionsDashboard` (Supabase table: `public.corrective_actions`).
> Use to verify equivalence against live Supabase data post-migration.

## CA-003: Service Account RBAC Migration

| Field | Detail |
|:--|:--|
| **Related NC** | NC-003 |
| **Root Cause** | `allocator_py_admin@commonbond.com` email embedded in RLS policies. No credential rotation, no audit trail, cross-tenant read access |
| **Action** | Replace hardcoded email identity with JWT-claim-based service identity in `app_metadata` RBAC architecture. ARCH-1B scope validation. |
| **Implementation** | ACL Modernisation Audit (`260304-acl`) Phase 1–3 completed 2026-03-05. `func_has_global_role` replaces all email-based checks |
| **Verification** | Adversarial re-audit 2026-03-05. All RLS policies reviewed; all pytest tests passing. Evidence: `supabase-receptor/docs/audits/archive/260305-adversarial/re-audit.md` |
| **Status** | ✅ Closed |

## CA-004: ISMS Documentation Uplift

| Field | Detail |
|:--|:--|
| **Related NC** | NC-004 |
| **Root Cause** | ISMS documentation created as skeleton — placeholder fields, missing approval blocks, incomplete Risk Register |
| **Action** | Complete all 20 gaps from `260305-iso27001-preaudit` |
| **Progress (2026-03-05)** | Approval blocks added to 8 policy documents; 4 mandatory artefacts drafted; asset register created; audit schedule documented; Risk Register expanded 5→12 risks |
| **Progress (2026-03-06)** | `internal-audit.md` updated with audit programme evidence; NC log and CAs expanded; treatment plan updated |
| **Remaining** | SoA stub (DOC-12 — critical); Incident Response Plan; Data Classification Scheme; Supplier Register. Target Q2 2026 |
| **Status** | 🔄 In Progress |

## CA-005: Audit Process Governance

| Field | Detail |
|:--|:--|
| **Related NC** | NC-005 |
| **Root Cause** | Audit workflow developed incrementally. First 4 audits committed directly to `main`. No feature branch enforcement, no PR gates, no global registry |
| **Action** | Implement 14 recommendations from `260306-audit-process` in 5 phases |
| **Phase 1** | ✅ Done — Fix agent-visible bugs (stale headings, frontmatter, session summary formatting) |
| **Phase 2** | ✅ Done — Added Definition of Done checklists and git verification steps to all workflows |
| **Phase 3** | ✅ Done — Added PR merge gate requirement to all `implement-audit-workflow.md` files |
| **Phase 4** | ✅ Done — Created global audit registry, global cross-ecosystem audit workflow, dedicated workflows for `workforce-frontend` and `preference-frontend` |
| **Phase 5** | ✅ Done — Added Deno Edge Function audit scope and `deno check` type-safety gate to `supabase-receptor` |
| **Verification** | Re-audit 2026-03-06. PRs raised across common-bond (#4), preference-frontend (#12), planner-frontend (#13), workforce-frontend (#7), supabase-receptor (#4), planner-backend (#2) |
| **Status** | ✅ Closed |
