---
title: Audit Registry
sidebar_position: 1
---

# Audit Registry

> **PROC-03 Implementation.** This registry is the canonical, cross-ecosystem
> index of all technical audits conducted across the Common Bond and Receptor
> platform. Each entry links to the source `audit.md` and `recommendations.md`
> where they live inside the relevant repository's `docs/audits/` folder.

**Last Updated:** 2026-03-25 | **Maintained by:** Engineering Leadership

---

## How to Read This Registry

| Column        | Meaning                                                                               |
| :------------ | :------------------------------------------------------------------------------------ |
| **Slug**      | Unique audit identifier in `YYMMDD-short-name` format                                 |
| **Scope**     | Repository / subsystem covered                                                        |
| **Auditor**   | Who performed the audit                                                               |
| **Status**    | `✅ Closed` · `🔄 Implementing` · `📋 Findings Issued` · `🔄 Drafting` · `📋 Planned` |
| **NC Raised** | Non-conformity log entries raised as a result                                         |
| **Report**    | Links to `audit.md` and `recommendations.md`                                          |

---

## Active Registry

### 🗓️ 2026-03-28

| Slug | Title | Scope | Auditor | Status | NC Raised | Report |
| :--- | :---- | :---- | :------ | :----- | :-------- | :----- |
| `260328-infra-hosting` | Infrastructure Hosting Strategy Audit | Cross-ecosystem — `receptor-infra`, `supabase-receptor`, `documentation/common-bond` (ISMS) | Ryan Ammendolea | 🔄 Implementing | 13 findings | [audit.md](../audits/260328-infra-hosting/audit.md) · [recommendations.json](../audits/260328-infra-hosting/recommendations.json) |

### 🗓️ 2026-03-26

| Slug | Title | Scope | Auditor | Status | NC Raised | Report |
| :--- | :---- | :---- | :------ | :----- | :-------- | :----- |
| `260326-k3s-stability` | k3s Cluster Stability & Gold Standard Audit | `receptor-infra` — k3s control plane, Vault, Falco, storage, monitoring, network policies, provisioning, documentation | Ryan Ammendolea | 🟥 Superseded | 46 findings · See 260328 | [audit.md](../audits/260326-k3s-stability/audit.md) · [recommendations.md](../audits/260326-k3s-stability/recommendations.md) |

### 🗓️ 2026-03-25

| Slug | Title | Scope | Auditor | Status | NC Raised | Report |
| :--- | :---- | :---- | :------ | :----- | :-------- | :----- |
| `260325-agentic-platform-engineering` | Agentic Platform Engineering Readiness Audit | Ecosystem-wide (9 repositories) | Ryan Ammendolea | 🔄 Drafting | — | [audit.md](../audits/260325-agentic-platform-engineering/audit.md) · [recommendations.json](../audits/260325-agentic-platform-engineering/recommendations.json) |
| `260325-cicd-vault-drift` | CI/CD Vault Configuration Drift Ecosystem Audit | Cross-ecosystem — `receptor-infra`, `preferencer-frontend`, `planner-frontend`, `website-frontend`, `workforce-frontend`, `match-backend` | Ryan Ammendolea | ✅ Closed | — | [audit.md](../audits/archive/260325-cicd-vault-drift/audit.md) · [recommendations.md](../audits/archive/260325-cicd-vault-drift/recommendations.md) · [re-audit.md](../audits/archive/260325-cicd-vault-drift/re-audit.md) |

### 🗓️ 2026-03-19

| Slug | Title | Scope | Auditor | Status | NC Raised | Report |
| :--- | :---- | :---- | :------ | :----- | :-------- | :----- |
| `260319-cicd-workflow-health` | CI/CD Workflow Health Audit | Cross-ecosystem — `supabase-receptor`, `planner-frontend`, `preference-frontend`, `workforce-frontend`, `match-backend`, `planner-backend`, `website-frontend` | Ryan Ammendolea | ✅ Closed | — | [audit.md](../audits/archive/260319-cicd-workflow-health/audit.md) · [recommendations.md](../audits/archive/260319-cicd-workflow-health/recommendations.md) · [re-audit.md](../audits/archive/260319-cicd-workflow-health/re-audit.md) |

### 🗓️ 2026-03-16

| Slug | Title | Scope | Auditor | Status | NC Raised | Report |
| :--- | :---- | :---- | :------ | :----- | :-------- | :----- |
| `260316-terraform-iac-gap` | Terraform Infrastructure-as-Code Gap Audit | `receptor-infra` — Azure resources (KV, storage), `supabase-receptor` k3s storage redundancy | Ryan Ammendolea | ✅ Closed | — | [audit.md](../audits/archive/260316-terraform-iac-gap/audit.md) · [recommendations.md](../audits/archive/260316-terraform-iac-gap/recommendations.md) · [re-audit.md](../audits/archive/260316-terraform-iac-gap/re-audit.md) |

### 🗓️ 2026-03-12

| Slug | Title | Scope | Auditor | Status | NC Raised | Report |
| :--- | :---- | :---- | :------ | :----- | :-------- | :----- |
| `260312-cicd-environments` | CI/CD Infrastructure & Environment Architecture Audit | `supabase-receptor`, `preference-frontend`, `planner-frontend`, `workforce-frontend`, `match-backend`, `planner-backend` — cross-ecosystem | Ryan Ammendolea | ✅ Closed | — | [audit.md](../audits/archive/260312-cicd-environments/audit.md) · [recommendations.md](../audits/archive/260312-cicd-environments/recommendations.md) · [re-audit.md](../audits/archive/260312-cicd-environments/re-audit.md) |

### 🗓️ 2026-03-11

| Slug                            | Title                                 | Scope                                                                                                                                                                | Auditor         | Status      | NC Raised | Report                                                                                                                                                          |
| :------------------------------ | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- | :---------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260311-testing-efficiency`     | Testing Efficiency & Modularity Audit | `backend/planner-backend`, `backend/match-backend`, `frontend/planner-frontend`, `frontend/workforce-frontend`, `frontend/preference-frontend`, `supabase-receptor` | Ryan Ammendolea | ✅ Closed       | —         | [audit.md](../audits/archive/260311-testing-efficiency/audit.md) · [recommendations.json](../audits/archive/260311-testing-efficiency/recommendations.json)      |
| `260311-about-us-documentation` | About-Us Documentation Audit          | `documentation/common-bond` — `docs/about-us/`, `sidebars.ts`, `docusaurus.config.ts`                                                                                | Ryan Ammendolea | ✅ Closed   | —         | [audit.md](../audits/archive/260311-about-us-documentation/audit.md) · [recommendations.md](../audits/archive/260311-about-us-documentation/recommendations.md) |

### 🗓️ 2026-03-10

| Slug                                  | Title                              | Scope                                          | Auditor         | Status    | NC Raised | Report                                                                                                                                                                      |
| :------------------------------------ | :--------------------------------- | :--------------------------------------------- | :-------------- | :-------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260310-agent-infra-consolidation`    | Agent Infrastructure Consolidation | All 9 repos — `.agents`/`.agent` directories   | Ryan Ammendolea | ✅ Closed | —         | [audit.md](../audits/archive/260310-agent-infra-consolidation/audit.md) · [recommendations.md](../audits/archive/260310-agent-infra-consolidation/recommendations.md)       |
| `260310-agent-workflow-json-refactor` | Agent Workflow JSON Refactor Audit | `dev-environment/.agents/` — workflows, skills | Ryan Ammendolea | ✅ Closed | —         | [audit.md](../audits/archive/260310-agent-workflow-json-refactor/audit.md) · [recommendations.md](../audits/archive/260310-agent-workflow-json-refactor/recommendations.md) |

### 🗓️ 2026-03-09

| Slug                                        | Title                                    | Scope                                                                        | Auditor         | Status    | NC Raised | Report                                                                                                                                                                                  |
| :------------------------------------------ | :--------------------------------------- | :--------------------------------------------------------------------------- | :-------------- | :-------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260309-governance-register-infrastructure` | Governance Register Infrastructure Audit | `docs/registers/`, `docs/compliance/iso27001/` — all 10 governance registers | Ryan Ammendolea | ✅ Closed | —         | [audit.md](../audits/archive/260309-governance-register-infrastructure/audit.md) · [recommendations.md](../audits/archive/260309-governance-register-infrastructure/recommendations.md) |

### 🗓️ 2026-03-07

| Slug                      | Title                              | Scope                                                             | Auditor         | Status             | NC Raised                                                                      | Report                                                                                                                                      |
| :------------------------ | :--------------------------------- | :---------------------------------------------------------------- | :-------------- | :----------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `260307-iso27001-ai-gaps` | ISO 27001 AI-Specific Gap Analysis | `docs/compliance/iso27001/` — all sections, against AI tool usage | Ryan Ammendolea | ✅ Closed          | [NC-006](/docs/compliance/iso27001/assurance/nonconformity-log#nc-006--detail) | [audit.md](../audits/260307-iso27001-ai-gaps/audit.md) · [recommendations.md](../audits/260307-iso27001-ai-gaps/recommendations.md)         |
| `260307-ip-licensing`     | IP Ownership & Licensing Audit     | All repositories — ecosystem-wide IP attribution and licensing    | Ryan Ammendolea | 📋 Findings Issued | —                                                                              | [audit.md](../audits/archive/260307-ip-licensing/audit.md) · [recommendations.md](../audits/archive/260307-ip-licensing/recommendations.md) |

### 🗓️ 2026-03-06

| Slug                                     | Title                                      | Scope                                                                  | Auditor         | Status    | NC Raised                                                                      | Report                                                                                                                                                                            |
| :--------------------------------------- | :----------------------------------------- | :--------------------------------------------------------------------- | :-------------- | :-------- | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260306-frontend-standards`              | Frontend Engineering Standards Audit       | `docs/engineering/frontend-standards-overview.md` + all frontend repos | Ryan Ammendolea | ✅ Closed | —                                                                              | [audit.md](../audits/archive/260306-frontend-standards/audit.md) · [recommendations.md](../audits/archive/260306-frontend-standards/recommendations.md)                           |
| `260306-frontend-compliance`             | Frontend App Compliance Audit              | `planner-frontend`, `workforce-frontend`, `preference-frontend`        | Ryan Ammendolea | ✅ Closed | —                                                                              | [audit.md](../audits/archive/260306-frontend-compliance/audit.md) · [recommendations.md](../audits/archive/260306-frontend-compliance/recommendations.md)                         |
| `260306-audit-process`                   | Audit Process Meta-Audit                   | All repositories — global engineering process                          | Ryan Ammendolea | ✅ Closed | [NC-005](/docs/compliance/iso27001/assurance/nonconformity-log#nc-005--detail) | [audit.md](../audits/archive/260306-audit-process/audit.md) · [recommendations.md](../audits/archive/260306-audit-process/recommendations.md)                                     |
| `260306-receptor-ecosystem-decommission` | receptor-ecosystem Docusaurus Decommission | `documentation/receptor-ecosystem` (80 files)                          | Ryan Ammendolea | ✅ Closed | —                                                                              | [audit.md](../audits/archive/260306-receptor-ecosystem-decommission/audit.md) · [recommendations.md](../audits/archive/260306-receptor-ecosystem-decommission/recommendations.md) |

### 🗓️ 2026-03-05

| Slug                       | Title                                      | Scope                                        | Auditor         | Status             | NC Raised                                                                      | Report                                                                                                                                                                                                                                                            |
| :------------------------- | :----------------------------------------- | :------------------------------------------- | :-------------- | :----------------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260305-iso27001-preaudit` | ISO 27001 Pre-Review Audit                 | `common-bond` ISMS documentation             | Ryan Ammendolea | 📋 Findings Issued | [NC-004](/docs/compliance/iso27001/assurance/nonconformity-log#nc-004--detail) | [audit.md](../audits/260305-iso27001-preaudit/audit.md) · [recommendations.md](../audits/260305-iso27001-preaudit/recommendations.md)                                                                                                                             |
| `260305-match-backend`     | Match-Backend ↔ Supabase Integration Audit | `backend/match-backend`, `supabase-receptor` | Ryan Ammendolea | 📋 Findings Issued | —                                                                              | [audit.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260305-match-backend/audit.md) · [recommendations.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260305-match-backend/recommendations.md) |

### 🗓️ 2026-03-04

| Slug         | Title                                 | Scope                                | Auditor         | Status    | NC Raised                                                                      | Report                                                                                                                                                                                                                                        |
| :----------- | :------------------------------------ | :----------------------------------- | :-------------- | :-------- | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `260304-acl` | Access Control & Authentication Audit | `supabase-receptor` — RLS, JWT, RBAC | Ryan Ammendolea | ✅ Closed | [NC-003](/docs/compliance/iso27001/assurance/nonconformity-log#nc-005--detail) | [audit.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260304-acl/audit.md) · [recommendations.md](https://github.com/dm-ra-01/supabase-receptor/blob/main/docs/audits/archive/260304-acl/recommendations.md) |

---

## Coverage Summary

```
Repository                   Audits   Last Audit
─────────────────────────────────────────────────
supabase-receptor              6       2026-03-26
backend/match-backend          4       2026-03-26
backend/planner-backend       3       2026-03-26
planner-frontend               7       2026-03-26
workforce-frontend             6       2026-03-26
preference-frontend            6       2026-03-26
website-frontend               2       2026-03-26
common-bond (ISMS docs + eng)  6       2026-03-26
receptor-infra                 3       2026-03-26
──────────────────────────────────── ─────────
Total                          23+     2026-03-26
```

> **Coverage gaps addressed:** `workforce-frontend`, `preference-frontend`, and
> `planner-backend` now have fully operational audit workflows (implemented via
> [REC-14](../audits/archive/260306-audit-process/recommendations.md)).

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

---

## Related Registers

This is one of several registers maintained across Common Bond. See the
[**Register of Registers**](/docs/registers) for a complete index of all
registers, their owners, and review cadences.
