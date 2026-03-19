# CI/CD Workflow Health Audit

**Date:** 2026-03-19\
**Scope:** All Receptor ecosystem repositories with GitHub Actions workflows — `supabase-receptor`, `planner-frontend`, `preference-frontend`, `workforce-frontend`, `match-backend`, `receptor-planner`, `website-frontend`\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO 27001 A.8.25 (Secure development life cycle), A.8.31 (Separation of development, test and production environments), A.8.32 (Change management)

---

## Executive Summary

This audit evaluates the current CI/CD setup across all Receptor ecosystem repositories for its ability to execute workflows successfully, promote code through test → staging → production, enable rollback, and securely manage keys. **17 findings** were identified: **5 Critical**, **6 High**, **4 Medium**, **2 Low**. The audit found that all backend/infrastructure deploy workflows (`match-backend`, `receptor-planner`, `supabase-receptor` prod-deploy) have structural defects that will cause failures in production. `staging-smoke.yml` reads from wrong Vault paths for Slack webhooks. The frontend CI workflows are substantially correct but carry a stale env-var reference and a broken cleanup job pattern. `website-frontend` has no CI workflow at all. None of the three Next.js frontend applications have a deploy pipeline.

| Repository / Area | Coverage | Issues Found | Overall |
| --- | --- | --- | --- |
| `supabase-receptor` — ci.yml | ✅ | 1 | ⚠️ |
| `supabase-receptor` — staging-smoke.yml | ✅ | 2 | ❌ |
| `supabase-receptor` — prod-deploy.yml | ✅ | 3 | ❌ |
| `supabase-receptor` — deploy-function.yml | ✅ | 2 | ❌ |
| `supabase-receptor` — key-rotation-reminder.yml | ✅ | 1 | ⚠️ |
| `planner-frontend` — ci.yml | ✅ | 2 | ⚠️ |
| `planner-frontend` — deploy.yml | ❌ | 1 | ❌ |
| `preference-frontend` — ci.yml | ✅ | 2 | ⚠️ |
| `preference-frontend` — deploy.yml | ❌ | 1 | ❌ |
| `workforce-frontend` — ci.yml | ✅ | 2 | ⚠️ |
| `workforce-frontend` — deploy.yml | ❌ | 1 | ❌ |
| `match-backend` — ci.yml + deploy.yml | ✅ | 2 | ❌ |
| `receptor-planner` — ci.yml + deploy.yml | ✅ | 2 | ❌ |
| `website-frontend` | ❌ | 1 | ❌ |

---

## 1. supabase-receptor

### 1.1 ci.yml (Database Tests + Deno Check)

**Strengths:**

- `database-tests` and `deno-check` both correctly target `arc-runner-supabase-receptor` (CICD-11).
- All actions are SHA-pinned (SEC-02 compliant).
- `supabase-start` composite action correctly manages CLI installation and health gate.
- `permissions: contents: read` enforces least-privilege (SEC-01).

**Gaps:**

- `DR-01` — `ci.yml` line 35: `deno check supabase/functions/**/*.ts` uses a glob pattern that is not supported by the Deno CLI in all shell implementations on self-hosted runners. The `**` glob for `deno check` requires explicit file enumeration or `--allow-run` workaround for composite expansion; this may fail silently or produce no output on some runner environments.

### 1.2 staging-smoke.yml

**Strengths:**

- Correctly authenticates to Vault via OIDC JWT (ADR-008 pattern).
- Self-hosted runner override documented with rollback comment (CI-03 resolution).
- Secrets masked immediately after retrieval.

**Gaps:**

- `DR-02` — `staging-smoke.yml` line 60: the `smoke-test` composite action (`action.yml` line 83) queries the `organisations` table. The canonical schema table name is `orgs` (confirmed). The DB canary (Check 4/5) will return a 404 and the smoke test will always fail.
- `DR-17` — `staging-smoke.yml` lines 62–63: reads Slack webhook URLs from `secret/infrastructure/slack-webhook-incidents` and `secret/infrastructure/slack-webhook-deployments`. The canonical Vault path standard is `secret/infrastructure/slack-{channel}-webhook` (e.g. `slack-incidents-webhook`). These `vault kv get` calls reference non-existent paths — Slack notifications are silently broken and a Vault error would abort the workflow before the smoke test runs.

### 1.3 prod-deploy.yml (Database Deploy Gate)

**Strengths:**

- Pre-deploy backup + approval gate + migration + post-deploy smoke test is the correct pattern.
- All core steps use SHA-pinned actions.
- Vault OIDC auth is correct for `backup-pre-deploy`, `diff`, and `deploy` jobs.

**Gaps:**

- `DR-03` — `prod-deploy.yml` line 243: `smoke-test-prod` job calls `./.github/actions/smoke-test` but passes only 2 inputs (`base-url` and `slack-webhook-url`). The `smoke-test` composite action (`action.yml` lines 13–23) **requires 5 inputs**: `base-url`, `anon-key`, `anon-jwt`, `incidents-webhook-url`, and `deployments-webhook-url`. The `anon-key` and `anon-jwt` inputs are not passed — they have no defaults — so the composite action will fail on the PostgREST and DB canary checks immediately. The DB canary (Check 4/5) will return 401 (missing API key).
- `DR-04` — `prod-deploy.yml` line 260: `notify` job reads `secrets.SLACK_DEPLOYMENTS_WEBHOOK` via GitHub Actions secrets, bypassing Vault entirely. The canonical standard for workflows with Vault OIDC access is to read from `secret/infrastructure/slack-deployments-webhook`. The GitHub secret `SLACK_DEPLOYMENTS_WEBHOOK` (no `_URL` suffix) is also inconsistent with the standard GitHub-secret name `SLACK_DEPLOYMENTS_WEBHOOK_URL` used by `key-rotation-reminder.yml`.
- `DR-05` — `prod-deploy.yml` `approve` job (line 162): `runs-on: ubuntu-latest` is a GitHub-hosted runner. If GitHub Environments for `production` are not yet configured with required reviewers, this job will auto-approve with no gate. The audit 260312 re-audit noted GitHub Environments were formally deferred. If they remain unconfigured, the production approval gate does not exist.

### 1.4 deploy-function.yml (Edge Function Deploy)

**Strengths:**

- Correct two-stage flow: Deno type-check then deploy to k3s.
- k3s pod-level kubectl copy and rollout restart is the correct pattern.
- Smoke-test function endpoint after rollout.

**Gaps:**

- `DR-06` — `deploy-function.yml` lines 21, 55: `actions/checkout@v4` is not SHA-pinned (uses mutable tag `v4`). All other workflows in the ecosystem use `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4`. This is a supply-chain risk (SEC-02 non-compliance) and inconsistency.
- `DR-07` — `deploy-function.yml` line 17: `deno-check` job uses `runs-on: ubuntu-latest` (GitHub-hosted), while subsequent `deploy` job uses `runs-on: self-hosted`. This split is intentional per the comment, but the `deno-check` job does not have `permissions: contents: read` set, allowing GITHUB_TOKEN to default to wider permissions on ubuntu-latest.

### 1.5 key-rotation-reminder.yml

**Strengths:**

- Month-boundary scheduling pattern (cron 28-31 + day-of-month filter) is correct.
- 14-day alert window with `workflow_dispatch` test trigger is well-designed.
- `date -d` arithmetic is correct for Linux runners.

**Gaps:**

- `DR-08` — `key-rotation-reminder.yml` line 79: runs on a GitHub-hosted runner with no Vault access — reading from a GitHub Actions secret is correct for this runner type. However `secrets.SLACK_DEPLOYMENTS_WEBHOOK_URL` must be set and documented as the canonical GitHub-secret name for platform runners. See DR-04 for the two-tier standardisation task.

---

## 2. Frontend Repositories (planner-frontend, preference-frontend, workforce-frontend)

### 2.1 CI Pipeline (All Three)

**Strengths:**

- All use ARC self-hosted runners with correct runner labels (CICD-11).
- All actions SHA-pinned (SEC-02).
- `permissions: contents: read` enforced (SEC-01).
- Integration test jobs boot isolated Supabase CI instances.
- `CI_RUN_ID`-namespaced test org cleanup (ISO-01) is wired.
- GraphQL codegen drift check present (CROSS-11).

**Gaps:**

- `DR-09` — All three frontend `ci.yml` files, `unit-tests` job: env var `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: stub-key-unit-only` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: stub-key-build-only` (build job) still use the old variable name. The LIFE-05 rename (260316 audit) changed the live production variable to `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but the CI stubs still reference the old name. If any source file imports `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` (the renamed variable), the unit test environment will provide `undefined` for that variable while providing `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (which the source no longer reads). This causes unit tests to silently test against incorrect configuration. Affects: `planner-frontend/ci.yml` lines 85, 189; `preference-frontend/ci.yml` lines 83, 232; `workforce-frontend/ci.yml` lines 83, 184.
- `DR-10` — All three frontend `ci.yml` files, `ci-cleanup` job: `NEXT_PUBLIC_SUPABASE_URL: http://127.0.0.1:54321` is the stub URL, but the integration-tests job boots a live Supabase instance whose `$GITHUB_ENV` exported `NEXT_PUBLIC_SUPABASE_URL` from `supabase status`. The `ci-cleanup` job is a **separate job** and does not inherit `$GITHUB_ENV` from `integration-tests`. It uses a hardcoded `127.0.0.1:54321` and a stale `SUPABASE_SERVICE_ROLE_KEY` env var that — because of job boundary isolation — will be empty string. The cleanup Supabase client will authenticate with an empty service role key against a stub URL and fail silently. Test org data from integration tests is **not being cleaned up** by this job.

### 2.2 Deploy Mechanism (All Three)

**Gaps:**

- `DR-15` — None of the three frontend repositories have a `.github/workflows/deploy.yml`. The deployment target is k3s prod via Cloudflare Tunnel (same GitOps pattern as `match-backend` and `receptor-planner` — build Docker image, push to GHCR, update `receptor-infra` deployment manifest via `sed`). Currently there is no workflow-as-code for environment promotion, no production approval gate, and no automated rollback path for any frontend application. A merge to `main` triggers the CI pipeline but does not deploy — the running production containers will not update until an engineer intervenes manually. Target URLs are defined in §6.1.

---

## 3. Backend Repositories (match-backend, receptor-planner)

### 3.1 deploy.yml (Both Repos)

**Strengths:**

- GitHub App token (app-lifecycle-deployment, ID 3127975) correctly used — no PAT rotation needed.
- GHCR image build-push-tag pattern is correct.
- GitOps manifest update via `sed` is correct.

**Gaps:**

- `DR-11` — `match-backend/deploy.yml` and `receptor-planner/deploy.yml`: all `actions/checkout@v4`, `docker/login-action@v3`, `docker/metadata-action@v5`, `docker/build-push-action@v5`, and `actions/create-github-app-token@v1` use **mutable version tags**, not SHA pins. This violates SEC-02 (SHA-pinning), creates supply-chain risk, and is inconsistent with all CI workflows. A malicious tag update would silently run untrusted code.
- `DR-12` — `match-backend/deploy.yml` line 14 and `receptor-planner/deploy.yml` line 14: `runs-on: ubuntu-latest` (GitHub-hosted). These deploy jobs push to GHCR and write to `receptor-infra`. They require no Vault access, so ubuntu-latest is technically correct **for the build**. However, there is no `timeout-minutes` on the `build-and-deploy` job — a hung Docker build will consume the GitHub runner indefinitely. Missing timeout is a CICD-05 non-compliance.

---

## 4. website-frontend

### 4.1 No CI/CD Workflow

**Gaps:**

- `DR-13` — `website-frontend/.github/workflows/` does not exist. `website-frontend` has no CI pipeline: no lint, no type-check, no build validation, no deploy workflow. This means broken commits can merge directly to main with no automated gate. The website-frontend is an Active repository per the ecosystem map. Deployment mechanism: Cloudflare Tunnel routing to k3s prod (same pattern as backend services). Target URL: see §6.1.

---

## 5. Cross-Cutting Observations

### 5.1 No Rollback Workflow

- `DR-14` — No GitHub Actions workflow in any repository implements an explicit **rollback trigger**. The `rollback-runbook.md` (LIFE-04) documents manual rollback procedures, but there is no automated `rollback.yml` workflow that can be triggered via `workflow_dispatch` to revert to a prior image tag or database migration. ISO 27001 A.8.32 (Change management) requires recovery procedures; currently rollback is entirely manual.

### 5.2 Smoke Test Table Naming

- `DR-16` — `smoke-test/action.yml` line 93 queries `/rest/v1/organisations?select=id&limit=1`. The canonical table name is `orgs` (confirmed). This single action file is shared by both `staging-smoke.yml` and `prod-deploy.yml` — the wrong table name blocks both smoke test pipelines simultaneously.

---

## 6. Design Decisions

### 6.1 Approved Service Domain Naming Standard

The following URL scheme is approved as the canonical deployment target for all Receptor services. This informs DR-13-T2, DR-15, and future Cloudflare Tunnel and k3s Ingress configuration.

| Service | Production | Staging | Test |
| --- | --- | --- | --- |
| Planner frontend | `receptor-planner.commonbond.au` | `receptor-planner-staging.commonbond.au` | `receptor-planner-test.commonbond.au` |
| Workforce frontend | `receptor-workforce.commonbond.au` | `receptor-workforce-staging.commonbond.au` | `receptor-workforce-test.commonbond.au` |
| Preference frontend | `receptor-preference.commonbond.au` | `receptor-preference-staging.commonbond.au` | `receptor-preference-test.commonbond.au` |
| Supabase API (PostgREST) | `receptor-api.commonbond.au` | `receptor-api-staging.commonbond.au` | `receptor-api-test.commonbond.au` |
| Supabase Auth function | `receptor-auth.commonbond.au` | `receptor-auth-staging.commonbond.au` | `receptor-auth-test.commonbond.au` |
| Match orchestrator function | `receptor-match-orchestrator.commonbond.au` | `receptor-match-orchestrator-staging.commonbond.au` | `receptor-match-orchestrator-test.commonbond.au` |
| Planner orchestrator function | `receptor-planner-orchestrator.commonbond.au` | `receptor-planner-orchestrator-staging.commonbond.au` | `receptor-planner-orchestrator-test.commonbond.au` |

**Pattern:** `receptor-{service}[-staging|-test].commonbond.au`\
**DNS provider:** Cloudflare (routed via Cloudflare Tunnel to k3s Ingress)\
**Decision date:** 2026-03-19

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity |
| --- | --- | --- | --- | --- |
| DR-03 | `supabase-receptor` | `prod-deploy.yml` | Process Gap | 🔴 Critical |
| DR-05 | `supabase-receptor` | `prod-deploy.yml` | Security | 🔴 Critical |
| DR-10 | `planner-frontend`, `preference-frontend`, `workforce-frontend` | `ci.yml` (ci-cleanup job) | Process Gap | 🔴 Critical |
| DR-13 | `website-frontend` | — | Process Gap | 🔴 Critical |
| DR-17 | `supabase-receptor` | `staging-smoke.yml` | Process Gap | 🔴 Critical |
| DR-02 | `supabase-receptor` | `smoke-test/action.yml` | Process Gap | 🟠 High |
| DR-09 | `planner-frontend`, `preference-frontend`, `workforce-frontend` | `ci.yml` (unit-tests job) | Test Coverage | 🟠 High |
| DR-11 | `match-backend`, `receptor-planner` | `deploy.yml` | Security | 🟠 High |
| DR-14 | All repos | — | Process Gap | 🟠 High |
| DR-15 | `planner-frontend`, `preference-frontend`, `workforce-frontend` | — | Process Gap | 🟠 High |
| DR-16 | `supabase-receptor` | `smoke-test/action.yml` | Process Gap | 🟠 High |
| DR-01 | `supabase-receptor` | `ci.yml` | Process Gap | 🟡 Medium |
| DR-04 | `supabase-receptor` | `prod-deploy.yml` | Process Gap | 🟡 Medium |
| DR-07 | `supabase-receptor` | `deploy-function.yml` | Security | 🟡 Medium |
| DR-12 | `match-backend`, `receptor-planner` | `deploy.yml` | Process Gap | 🟡 Medium |
| DR-06 | `supabase-receptor` | `deploy-function.yml` | Security | 🟢 Low |
| DR-08 | `supabase-receptor` | `key-rotation-reminder.yml` | Process Gap | 🟢 Low |
