<!-- audit-slug: 260328-infra-hosting -->

# Recommendations — Infrastructure Hosting Strategy Audit

**Branch:** `audit/260328-infra-hosting`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-28

:::note This file is **auto-generated** from `recommendations.json`. Do not edit
it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`. :::

---

## Agent Clarifications (Human-Approved)

| Item               | Decision                                                                                                      |
| :----------------- | :------------------------------------------------------------------------------------------------------------ |
| Strategic Decision | Full retirement of self-hosted k3s in favor of managed Supabase Cloud (Sydney) and GCP Cloud Run (Melbourne). |
| Secret Management  | Transition to GCP Secret Manager (Melbourne) using OIDC-based Workload Identity Federation.                   |

---

## 🔴 Critical

### HOSTING-16: The self-hosted k3s stack imposes an unsustainable operational burden. Engineering bandwidth is consumed by low-level cl

Affects: `cross-ecosystem` — infrastructure-operations

- [x] Provision Supabase Cloud (Sydney ap-southeast-2) projects for Stage/Prod
      and initiate migration.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/audits/260328-infra-hosting/planning/migration-planning.md`
      _(Completed: 2026-03-28T07:42:41Z)_
- [x] Establish GCP Organization and Projects pinned to Melbourne
      (australia-southeast2).
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/audits/260328-infra-hosting/planning/migration-planning.md`
      _(Completed: 2026-03-28T07:04:25Z)_
- [x] Execute the decommissioning of k3s nodes once primary workloads are
      migrated to Cloud Run.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/README.md`
      _(Completed: 2026-03-28T07:43:29Z)_

### HOSTING-20: GCP OIDC authentication for GitHub Actions was blocked across the ecosystem due to a missing IAM role binding. The ident

Affects: `google-cloud` — iam-identity

- [x] Refactor Foundation Terraform to grant
      'roles/iam.serviceAccountTokenCreator' to specific repository
      principalSets.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/terraform/gcp/modules/foundation/main.tf`
      _(Completed: 2026-03-28T07:26:40Z)_

## 🟠 High

### HOSTING-19: Current CI/CD relies on self-hosted ARC runners and cluster-local Vault, creating a circular dependency and maintenance

Affects: `cross-ecosystem` — github-actions

- [x] Set up GCP Workload Identity Federation for GitHub OIDC to eliminate
      static secrets.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/audits/260328-infra-hosting/planning/sub-audit-recommendations.json`
      _(Completed: 2026-03-28T07:04:25Z)_
- [x] Update all repos to runs-on: ubuntu-latest and standardize on
      actions/cache.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci-resilience.yml`
      _(Completed: 2026-03-28T07:04:25Z)_
- [x] Enforce a 20-minute maximum timeout on all GitHub Actions runners
      cross-ecosystem to prevent hung processes.
      `cross-ecosystem — .github/workflows/*.yml` _(Completed:
      2026-03-28T07:42:41Z)_

### HOSTING-13: Missing Cloud Adoption Policy in ISMS to govern the strategic shift to managed providers.

Affects: `documentation/common-bond` — iso27001-policies

- [x] Create docs/compliance/iso27001/policies/cloud-adoption-policy.md
      documenting the move to GCP/Supabase.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/policies/cloud-adoption-policy.md`
      _(Completed: 2026-03-28T07:42:41Z)_

## 🟡 Medium

### HOSTING-12: GCP, Supabase, Cloudflare, and GitHub are uncatalogued in the Supplier Security Register.

Affects: `documentation/common-bond` — iso27001-suppliers

- [x] Update docs/compliance/iso27001/operations/supplier-register.md with all
      cloud providers.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/supplier-register.md`
      _(Completed: 2026-03-28T07:42:41Z)_

## 🟢 Low

### HOSTING-18: Cross-ecosystem CI/CD hardening to prevent hung runners. All workflows must have a maximum job-level timeout.

Affects: `cross-ecosystem` — github-actions

- [x] Enforce 'timeout-minutes: 20' across all GitHub Actions workflows in all
      repositories. `**/ .github/workflows/*.yml` _(Completed:
      2026-03-28T07:13:21Z)_

---

---

## Implementation Order

| Phase | Finding IDs                                    | Rationale                                                                            |
| :---- | :--------------------------------------------- | :----------------------------------------------------------------------------------- |
| 1     | HOSTING-16                                     | Offloading the highest-maintenance services first to recover engineering velocity.   |
| 2     | HOSTING-19, HOSTING-13, HOSTING-12, HOSTING-20 | Transitioning to cloud-native secrets and runners to eliminate cluster dependencies. |

---

## Severity Summary

| Finding ID | Area                      | File                             | Category               | Severity    |
| :--------- | :------------------------ | :------------------------------- | :--------------------- | :---------- |
| HOSTING-16 | infrastructure-operations | `migration-planning.md`          | Growth / Velocity      | 🔴 Critical |
| HOSTING-20 | iam-identity              | `main.tf`                        | Infrastructure Blocker | 🔴 Critical |
| HOSTING-19 | github-actions            | `sub-audit-recommendations.json` | CI/CD                  | 🟠 High     |
| HOSTING-13 | iso27001-policies         | `cloud-adoption-policy.md`       | Process Gap            | 🟠 High     |
| HOSTING-12 | iso27001-suppliers        | `supplier-register.md`           | Compliance             | 🟡 Medium   |
| HOSTING-18 | github-actions            | `*.yml`                          | Runner Resilience      | 🟢 Low      |

---

## Session Close — 2026-03-29

**Completed:** HOSTING-16-T1, HOSTING-16-T2, HOSTING-16-T3, HOSTING-19-T1,
HOSTING-19-T2, HOSTING-19-T3, HOSTING-13-T1, HOSTING-12-T1, HOSTING-18-T1,
HOSTING-20-T1 — all findings complete. **Remaining:** None — audit complete.
**Blocked:** None. **PR order note:** Single repo (`corporate-docs`) — no
cross-repo merge ordering required. `receptor-infra` Terraform changes
(HOSTING-20) were committed directly to main during earlier sessions. **Brief
for next agent:** All 6 findings fully implemented and re-audited. The re-audit
confirms the k3s cluster is retired, GCP WIF OIDC is operational across the
ecosystem, GitHub Actions uses `ubuntu-latest` with 20-minute timeouts, the
Cloud Adoption Policy and Supplier Register are updated in ISMS, and the
Terraform foundation module grants `roles/iam.serviceAccountTokenCreator`. Audit
is ready to be archived.
