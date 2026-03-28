<!-- audit-slug: 260328-infra-hosting -->

# Recommendations — Infrastructure Hosting Strategy Audit

**Branch:** `audit/260326-k3s-stability`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-28

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Strategic Decision | Full retirement of self-hosted k3s in favor of managed Supabase Cloud (Sydney) and GCP Cloud Run (Melbourne). |
| Secret Management | Transition to GCP Secret Manager (Melbourne) using OIDC-based Workload Identity Federation. |


---

## 🔴 Critical

### HOSTING-16: The self-hosted k3s stack imposes an unsustainable operational burden. Engineering bandwidth is consumed by low-level cl

Affects: `cross-ecosystem` — infrastructure-operations


- [ ] Provision Supabase Cloud (Sydney ap-southeast-2) projects for Stage/Prod and initiate migration.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/audits/260328-infra-hosting/planning/migration-planning.md`
- [x] Establish GCP Organization and Projects pinned to Melbourne (australia-southeast2).
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/audits/260328-infra-hosting/planning/migration-planning.md`
      _(Completed: 2026-03-28T07:04:25Z)_
- [ ] Execute the decommissioning of k3s nodes once primary workloads are migrated to Cloud Run.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/README.md`

## 🟠 High

### HOSTING-19: Current CI/CD relies on self-hosted ARC runners and cluster-local Vault, creating a circular dependency and maintenance 

Affects: `cross-ecosystem` — github-actions


- [x] Set up GCP Workload Identity Federation for GitHub OIDC to eliminate static secrets.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/audits/260328-infra-hosting/planning/sub-audit-recommendations.json`
      _(Completed: 2026-03-28T07:04:25Z)_
- [x] Update all repos to runs-on: ubuntu-latest and standardize on actions/cache.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci-resilience.yml`
      _(Completed: 2026-03-28T07:04:25Z)_

### HOSTING-13: Missing Cloud Adoption Policy in ISMS to govern the strategic shift to managed providers.

Affects: `documentation/common-bond` — iso27001-policies


- [ ] Create docs/compliance/iso27001/policies/cloud-adoption-policy.md documenting the move to GCP/Supabase.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/policies/cloud-adoption-policy.md`

## 🟡 Medium

### HOSTING-12: GCP, Supabase, Cloudflare, and GitHub are uncatalogued in the Supplier Security Register.

Affects: `documentation/common-bond` — iso27001-suppliers


- [ ] Update docs/compliance/iso27001/operations/supplier-register.md with all cloud providers.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/supplier-register.md`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | HOSTING-16 | Offloading the highest-maintenance services first to recover engineering velocity. |
| 2 | HOSTING-19, HOSTING-13, HOSTING-12 | Transitioning to cloud-native secrets and runners to eliminate cluster dependencies. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| HOSTING-16 | infrastructure-operations | `migration-planning.md` | Growth / Velocity | 🔴 Critical |
| HOSTING-19 | github-actions | `sub-audit-recommendations.json` | CI/CD | 🟠 High |
| HOSTING-13 | iso27001-policies | `cloud-adoption-policy.md` | Process Gap | 🟠 High |
| HOSTING-12 | iso27001-suppliers | `supplier-register.md` | Compliance | 🟡 Medium |

