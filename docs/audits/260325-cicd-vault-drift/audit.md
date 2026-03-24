# CI/CD Vault Configuration Drift Ecosystem Audit

**Date:** 2026-03-25\
**Scope:** All Receptor repositories with deploy workflows — `preferencer-frontend`, `planner-frontend`, `website-frontend`, `workforce-frontend`, `match-backend`, plus `receptor-infra` (infrastructure source of truth)\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO 27001 A.8.25 (Secure development life cycle), A.8.32 (Change management)

---

## Executive Summary

This audit investigates the root causes of persistent CI/CD deployment failures across the ecosystem following implementation of the `260319-cicd-workflow-health` audit findings (DR-24, DR-15, DR-28). **10 findings** identified: **3 Critical**, **4 High**, **2 Medium**, **1 Low**. The core issue is that Vault JWT roles and secret paths referenced in production deploy workflows were never codified in `receptor-infra`, leading to repeated agent-driven fix-revert cycles (~40 commits across 6 repos for the same two problems). The ecosystem lacks a declarative source of truth for Vault configuration, making agentic operations fundamentally unreliable.

| Repository / Area | Coverage | Issues Found | Overall |
| --- | --- | --- | --- |
| `receptor-infra` — Vault configuration | ✅ | 4 | ❌ |
| All deploy workflows — vault-action config | ✅ | 3 | ❌ |
| Frontend CI — supabase readiness | ✅ | 1 | ⚠️ |
| Cross-cutting — agentic operability | ✅ | 2 | ❌ |

---

## 1. receptor-infra — Vault Configuration Gaps

### 1.1 Vault JWT Roles

**Strengths:**

- `github-actions-role` and `receptor-infra-tf-ci` are documented with bound claims, policies, and bootstrap commands in `docs/security/vault-configuration.md`.
- ADR-008 correctly designs the OIDC JWT auth flow.

**Gaps:**

- `VD-01` — `docs/security/vault-configuration.md` lines 289–302: Five JWT roles referenced in production deploy workflows have no documented creation procedure, no bootstrap script, and no policy definition anywhere in `receptor-infra`: `ci-preference-frontend`, `ci-planner-frontend`, `ci-website-frontend`, `ci-workforce-frontend`, `ci-match-backend`. The `ci-website-frontend` role is confirmed missing from live Vault (GitHub Actions error: `role "ci-website-frontend" could not be found`).

### 1.2 Vault Secret Path: github-app-deploy-bot

**Gaps:**

- `VD-02` — The secret path `secret/infrastructure/github-app-deploy-bot` (referenced by all 5 deploy workflows) does not appear in `vault-supabase-bootstrap.sh`, `vault-configuration.md`, any ADR, any bootstrap script, or any YAML manifest. The documented GitHub App path is `secret/ci/github-app` (used by VSO for runner auth). `github-app-deploy-bot` was likely created ad-hoc via SSH and never recorded.

### 1.3 No Declarative Vault Role Management

**Gaps:**

- `VD-03` — There is no `vault/roles/` directory, no HCL policy files, and no idempotent bootstrap script for JWT roles. Vault roles are created via one-off SSH commands that are not captured in version control. This prevents agents from validating workflow configurations against the source of truth (because no source of truth exists in the file system).

---

## 2. Deploy Workflows — vault-action Configuration Inconsistency

### 2.1 Path Format Drift

**Strengths:**

- All 5 deploy workflows correctly use `hashicorp/vault-action@v3` with JWT auth method and the correct `jwtGithubAudience`.

**Gaps:**

- `VD-04` — The `vault-action` `secrets` path is inconsistent across repos. `preferencer-frontend` uses the logical path `secret/infrastructure/...` with `kv-version: 2`. All other repos use `secret/data/infrastructure/...` without `kv-version`. The commit history shows 6 rounds of path changes across the ecosystem, alternating between these two formats. Expected behaviour: `vault-action@v3` with `kv-version: 2` uses the logical path and appends `/data/` internally. Without `kv-version`, the action auto-detects but may produce `secret/data/data/...` if handed an explicit `/data/` path.

- `VD-05` — `preferencer-frontend` fetches both `private_key` and `app_id` from Vault. The other 4 repos still read `DEPLOY_BOT_APP_ID` from `secrets.*` (GitHub Repository Secrets). This creates a split-brain: the app ID and private key can become mismatched if the Vault secret is updated without also updating the GitHub secret.

### 2.2 Shared Workflow Absent

**Gaps:**

- `VD-06` — The deploy workflow YAML is duplicated across 5 repositories with no shared reusable workflow. Each copy drifts independently, as evidenced by the inconsistent path format in VD-04. A single reusable workflow (e.g. in `receptor-infra/.github/workflows/deploy-gitops.yml`) would eliminate this class of drift entirely.

---

## 3. Frontend CI — Supabase Readiness

### 3.1 Status Polling

**Gaps:**

- `VD-07` — `ci-resilience.yml` (all frontends): the `supabase status -o env` output is piped through `grep '^ANON_KEY='` which fails when the output contains ANSI escape codes, leading whitespace, or stderr interleaving. The `planner-frontend` CI run (23477490024) shows 120 consecutive failures despite Supabase being fully started. The readiness gate and key extraction must be a single robust script, not inline shell with fragile grep patterns — and it should be shared, not copied to 3+ repos.

---

## 4. Cross-Cutting Observations

### 4.1 Agentic Operability

**Gaps:**

- `VD-08` — The ecosystem lacks agent-readable infrastructure contracts. When an AI agent encounters a Vault-related CI failure, it cannot determine the correct configuration because Vault roles, policies, and secret paths exist only on the live cluster (accessible via SSH + root token). The result is a guess-commit-fail loop: commit history across 6 repos shows ~40 vault-related fix commits in 6 days, most of which were incorrect.

- `VD-09` — No `vault-action` contract validation exists in CI. There is no pre-flight check that validates a workflow's `role`, `secrets` path, and `jwtGithubAudience` against documented Vault configuration before the workflow runs. Errors are only discovered at runtime after a commit to `main`.

### 4.2 Prior Audit Regression

**Gaps:**

- `VD-10` — The `260319-cicd-workflow-health` audit (✅ Closed) produced findings DR-24/DR-15/DR-28 that required Vault OIDC integration for deploy workflows. The implementation of these findings created the current failures because the prerequisite Vault infrastructure (roles, policies, secret path) was never provisioned. The audit's Definition of Done did not include a Vault bootstrap verification gate.

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity |
| --- | --- | --- | --- | --- |
| VD-01 | `receptor-infra` | `docs/security/vault-configuration.md` | Security | 🔴 Critical |
| VD-02 | `receptor-infra` | — (missing file) | Security | 🔴 Critical |
| VD-08 | All repos | — | Architectural Drift | 🔴 Critical |
| VD-03 | `receptor-infra` | — (missing directory) | Process Gap | 🟠 High |
| VD-04 | All deploy repos | `.github/workflows/deploy.yml` | Architectural Drift | 🟠 High |
| VD-06 | All deploy repos | `.github/workflows/deploy.yml` | Process Gap | 🟠 High |
| VD-10 | `common-bond` audits | `260319-cicd-workflow-health/` | Process Gap | 🟠 High |
| VD-05 | 4 of 5 deploy repos | `.github/workflows/deploy.yml` | Architectural Drift | 🟡 Medium |
| VD-07 | `planner-frontend`, `preference-frontend`, `workforce-frontend` | `.github/workflows/ci-resilience.yml` | Process Gap | 🟡 Medium |
| VD-09 | All deploy repos | — (missing CI gate) | Process Gap | 🟢 Low |
