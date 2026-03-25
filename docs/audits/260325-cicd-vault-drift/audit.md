# CI/CD Vault Configuration Drift Ecosystem Audit

**Date:** 2026-03-25\
**Scope:** All Receptor repositories with deploy workflows — `preferencer-frontend`, `planner-frontend`, `website-frontend`, `workforce-frontend`, `match-backend`, plus `receptor-infra` (infrastructure source of truth)\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO 27001 A.8.25 (Secure development life cycle), A.8.32 (Change management)

---

## Executive Summary

This audit investigates the root causes of persistent CI/CD deployment failures following implementation of the `260319-cicd-workflow-health` audit findings (DR-24, DR-15, DR-28). **11 findings** identified: **1 Critical**, **5 High**, **3 Medium**, **1 Low**, **1 newly discovered**. Live Vault interrogation (2026-03-25) confirmed that 6 of 7 expected JWT roles exist and the `github-app-deploy-bot` secret is present with correct keys. The remaining blockers are: 1 missing JWT role (`ci-website-frontend`), inconsistent `vault-action` path format across repos, a broken policy mount path for `ci-supabase-receptor`, and no declarative Vault configuration in version control.

| Repository / Area | Coverage | Issues Found | Overall |
| --- | --- | --- | --- |
| `receptor-infra` — Vault configuration | ✅ | 5 | ❌ |
| All deploy workflows — vault-action config | ✅ | 3 | ⚠️ |
| Frontend CI — supabase readiness | ✅ | 1 | ⚠️ |
| Cross-cutting — agentic operability | ✅ | 2 | ❌ |

---

## 1. receptor-infra — Vault Configuration Gaps

### 1.1 Vault JWT Roles

**Strengths (verified live):**

- 6 of 7 expected JWT roles exist: `ci-match-backend`, `ci-planner-frontend`, `ci-preference-frontend`, `ci-workforce-frontend`, `ci-receptor-planner`, `ci-supabase-receptor`.
- All use correct `bound_audiences: https://vault.commonbond.au`, `bound_claims_type: glob`, and matching `token_policies`.
- JWT auth is correctly configured with `oidc_discovery_url: https://token.actions.githubusercontent.com`.

**Gaps:**

- `VD-01` — 1 JWT role is missing: `ci-website-frontend`. All other roles exist with correct configuration. None of the 7 roles are documented in `receptor-infra` (no bootstrap script, no policy files in version control).

### 1.2 Vault Secret Path: github-app-deploy-bot

**Strengths (verified live):**

- `secret/infrastructure/github-app-deploy-bot` exists with keys `app_id` and `private_key`.

**Gaps:**

- `VD-02` — Although the secret exists, it is not documented anywhere in `receptor-infra`. The path does not appear in any bootstrap script, ADR, or YAML manifest. Agents cannot discover it without cluster access.

### 1.3 No Declarative Vault Role Management

**Gaps:**

- `VD-03` — No `vault/roles/` directory, no HCL policy files, no idempotent bootstrap script. Vault configuration exists only on the live cluster.

### 1.4 Policy Mount Path Error

**Gaps:**

- `VD-11` — `ci-supabase-receptor` policy references paths under `infrastructure/` mount (e.g. `infrastructure/data/supabase`) which does not exist. The correct mount is `secret/` (e.g. `secret/data/supabase/staging`). This breaks Vault access for supabase-receptor CI to staging/production secrets.

---

## 2. Deploy Workflows — vault-action Configuration Inconsistency

### 2.1 Path Format Drift

**Strengths:**

- All deploy workflows correctly use `hashicorp/vault-action@v3` with JWT auth and `jwtGithubAudience: https://vault.commonbond.au`.
- Live Vault policies are written against REST API paths (`secret/data/infrastructure/...`).

**Gaps:**

- `VD-04` — Path format is inconsistent: `preferencer-frontend` uses logical path with `kv-version: 2` (action internally adds `/data/`); all others use explicit `/data/` path without `kv-version` (passed as-is). Both approaches work independently but the ecosystem must standardise on one to prevent future confusion. 6 rounds of path changes in commit history.

- `VD-05` — `preferencer-frontend` fetches both `private_key` and `app_id` from Vault. The other 4 repos read `DEPLOY_BOT_APP_ID` from GitHub Secrets, creating split-brain potential.

### 2.2 Shared Workflow Absent

**Gaps:**

- `VD-06` — Deploy YAML is copy-pasted across 5 repos with no shared reusable workflow.

---

## 3. Frontend CI — Supabase Readiness

**Gaps:**

- `VD-07` — `ci-resilience.yml` supabase status parsing fails with ANSI codes/stderr interleaving.

---

## 4. Cross-Cutting Observations

**Gaps:**

- `VD-08` — No agent-readable infrastructure contracts. ~40 incorrect vault fix commits in 6 days.
- `VD-09` — No pre-flight CI validation of vault-action parameters against documented configuration.
- `VD-10` — Prior audit `260319-cicd-workflow-health` (Closed) caused this drift because implementation lacked Vault bootstrap verification gate.

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity |
| --- | --- | --- | --- | --- |
| VD-08 | All repos | — | Architectural Drift | 🔴 Critical |
| VD-01 | `receptor-infra` | Vault JWT roles | Security | 🟠 High |
| VD-03 | `receptor-infra` | — (missing directory) | Process Gap | 🟠 High |
| VD-04 | All deploy repos | `.github/workflows/deploy.yml` | Architectural Drift | 🟠 High |
| VD-06 | All deploy repos | `.github/workflows/deploy.yml` | Process Gap | 🟠 High |
| VD-10 | `common-bond` audits | `260319-cicd-workflow-health/` | Process Gap | 🟠 High |
| VD-11 | `receptor-infra` | Vault policy `ci-supabase-receptor` | Security | 🟠 High |
| VD-02 | `receptor-infra` | — (undocumented) | Process Gap | 🟡 Medium |
| VD-05 | 4 of 5 deploy repos | `.github/workflows/deploy.yml` | Architectural Drift | 🟡 Medium |
| VD-07 | Frontend repos | `.github/workflows/ci-resilience.yml` | Process Gap | 🟡 Medium |
| VD-09 | All deploy repos | — (missing CI gate) | Process Gap | 🟢 Low |
