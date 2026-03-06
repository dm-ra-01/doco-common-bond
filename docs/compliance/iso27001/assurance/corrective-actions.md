---
title: Corrective Actions
sidebar_position: 3
---

# Corrective Actions

## 1. Process

When a Non-Conformity is identified, we:

1. **React:** Take immediate action to control and correct it.
2. **Evaluate:** Determine the root cause to prevent recurrence.
3. **Implement:** Put permanent corrective actions in place.
4. **Review:** Verify effectiveness after a set period.

## 2. Action Log

### CA-003: Service Account RBAC Migration

- **Related NC:** [NC-003](./nonconformity-log.md)
- **Root Cause:** The `allocator_py_admin@commonbond.com` email was embedded
  directly into Supabase RLS policy SQL as a service identity during early
  prototype development, before a formal RBAC architecture was established. This
  approach had no credential rotation mechanism, no audit trail, and effectively
  granted cross-tenant read access.
- **Action:** Replace the hardcoded email identity with a JWT-claim-based service
  identity integrated into the `app_metadata` RBAC architecture. Implement
  strict scope validation so the service account operates only within its
  required access boundaries (ARCH-1B from ACL Modernisation Audit).
- **Implementation:** ACL Modernisation Audit (`260304-acl`) Phase 1–3 completed
  2026-03-05. Two-layer delegation constraint architecture (ARCH-2) implemented;
  `func_has_global_role` replaces all email-based checks. Re-audit
  (`260305-adversarial`) confirmed no hardcoded email references remain.
- **Verification:** Adversarial re-audit 2026-03-05 — all RLS policies reviewed;
  all pytest tests passing; no `allocator_py_admin` references in active policy
  SQL. Evidence: `supabase-receptor/docs/audits/archive/260305-adversarial/re-audit.md`.
- **Status:** ✅ Closed.

---

### CA-004: ISMS Documentation Uplift

- **Related NC:** [NC-004](./nonconformity-log.md)
- **Root Cause:** ISO 27001 ISMS documentation was created as a well-structured
  skeleton but not fully populated as operational records. Placeholder fields,
  missing approval blocks, and an incomplete Risk Register remained from the
  initial drafting phase.
- **Action:** Systematically complete all 20 gaps identified in the pre-review
  audit (`260305-iso27001-preaudit`), following the prioritised recommendations
  in `docs/audits/260305-iso27001-preaudit/recommendations.md`.
- **Progress (2026-03-05):** Phase 1 of recommendations implemented: approval
  blocks added to 8 policy documents (REC-01); 4 mandatory artefacts drafted
  (REC-05); asset register created (REC-11); audit schedule documented (REC-10).
  Risk Register expanded from 5 to 12 risks with owner column.
- **Progress (2026-03-06):** ISMS `internal-audit.md` updated with completed
  audit programme evidence (DOC-14 gap addressed). Non-conformity log and
  corrective actions expanded. Treatment plan updated with verification evidence.
- **Remaining:** SoA stub (DOC-12 — critical); Incident Response Plan (DOC-17);
  Data Classification Scheme (DOC-17); Supplier Security Register (DOC-17).
  Target: Q2 2026.
- **Status:** 🔄 In Progress.

---

### CA-005: Audit Process Governance

- **Related NC:** [NC-005](./nonconformity-log.md)
- **Root Cause:** The audit workflow was developed incrementally across multiple
  repositories without a global governance layer. Critically, prior to March
  2026, **all audit work was committed directly to `main`** — the first four
  audits (`260304-acl`, `260305-match-backend`, `260305-graphql-state`,
  `260305-iso27001-preaudit`) have no separate audit branches. Feature branch
  enforcement, PR gates, a global audit registry, and dedicated workflows for
  all applications were retrofitted rather than designed-in from the start.
- **Action:** Implement the 14 recommendations from the Audit Process Audit
  (`260306-audit-process`) in five phases:
  - **Phase 1** (✅ Done): Fix agent-visible bugs — stale headings, frontmatter,
    session summary formatting.
  - **Phase 2** (Open): Add Definition of Done checklists and git verification
    steps to all audit workflows.
  - **Phase 3** (Open): Add PR merge gate to all six implement-audit workflows.
  - **Phase 4** (Open): Create global audit registry (`docs/audits/audit-registry.md`),
    global cross-ecosystem audit workflow, and dedicated workflows for
    workforce-frontend and preference-frontend.
  - **Phase 5** (Open): Add Deno Edge Function audit scope and `deno check`
    type-safety gate to supabase-receptor workflows.
- **Target:** Phase 2–3: Q2 2026. Phase 4–5: Q3 2026.
- **Status:** 🔄 Open — Phase 1 complete.
