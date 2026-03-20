<!-- audit-slug: 260319-cicd-workflow-health -->

# Recommendations — CI/CD Workflow Health Audit

**Branch:** `audit/260319-cicd-workflow-health`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-19

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| DR-15 — Frontend deployment mechanism | Pending — agent was unable to determine from code inspection alone whether Cloudflare Pages handles deployment automatically. Human must confirm before a deploy.yml can be written. |
| DR-05 — GitHub Environments for production approval gate | Pending — human must verify and configure the 'production' GitHub Environment in supabase-receptor repository settings. Requires GitHub web UI or API configuration. |
| DR-04/DR-08 — Canonical Slack webhook secret name | Pending — human must confirm canonical name (SLACK_DEPLOYMENTS_WEBHOOK vs SLACK_DEPLOYMENTS_WEBHOOK_URL) and ensure secret is set under that name in all relevant repos. |
| DR-02/DR-16 — Table name in smoke-test DB canary | Pending — human or implementation agent must verify current schema table name (organisations vs orgs) before updating smoke-test action. |


---

## 🔴 Critical

### DR-03: prod-deploy.yml smoke-test-prod job calls .github/actions/smoke-test with only 2 inputs but requires 5

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml

- [ ] Update prod-deploy.yml smoke-test-prod job: add a Vault KV fetch step to retrieve anon-key and anon-jwt from infrastructure/supabase-prod, then pass all 5 required inputs to the smoke-test composite action call. Model on the staging-smoke.yml Vault auth pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`

### DR-05: prod-deploy.yml approve job has no production environment gate configured

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml

- [ ] Configure the GitHub Actions 'production' environment in dm-ra-01/supabase-receptor Settings > Environments > production with at least one Required Reviewer (Ryan Ammendolea). Document this configuration in docs/infrastructure/ci-required-checks.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
- [ ] Verify and configure the 'production' environment in deploy-function.yml as well (it also uses 'environment: production' on the deploy job).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`

### DR-10: ci-cleanup job is broken across job boundaries — test org data never cleaned up

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (ci-cleanup job)

- [ ] Fix ci-cleanup in planner-frontend ci.yml: move the cleanup inline into the integration-tests job as an always() step at the end. This avoids cross-job GITHUB_ENV propagation. The Supabase instance is still running at that point and keys are available in $GITHUB_ENV from the earlier 'Start Supabase' step.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
- [ ] Same fix for preference-frontend ci.yml ci-cleanup job.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
- [ ] Same fix for workforce-frontend ci.yml ci-cleanup job.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`

### DR-13: website-frontend has no CI pipeline

Affects: `website-frontend` — .github/workflows/

- [ ] Create .github/workflows/ci.yml for website-frontend with: lint job (npm run lint), type-check job (npx tsc --noEmit), build job (npm run build). Use SHA-pinned actions and arc-runner-website-frontend ARC runner label. Model on planner-frontend/ci.yml but omit Supabase, integration test, and codegen-check jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/website-frontend/.github/workflows/ci.yml`
- [ ] Determine and document the website-frontend deployment mechanism (Cloudflare Pages auto-deploy or manual). Document in website-frontend README.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/website-frontend/README.md`

## 🟠 High

### DR-02: smoke-test DB canary queries organisations table which may have been renamed to orgs

Affects: `supabase-receptor` — .github/actions/smoke-test/action.yml

- [ ] Verify current table name in supabase-receptor schema (organisations vs orgs). Update smoke-test/action.yml line 93 to query the correct table name.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/smoke-test/action.yml`

### DR-09: Frontend CI unit-test stubs still use old PUBLISHABLE_KEY variable name (LIFE-05 rename incomplete)

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (unit-tests and build jobs)

- [ ] Update planner-frontend ci.yml unit-tests and build job env blocks: rename NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY stubs to NEXT_PUBLIC_SUPABASE_ANON_KEY.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
- [ ] Same rename for preference-frontend ci.yml unit-tests and build jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
- [ ] Same rename for workforce-frontend ci.yml unit-tests and build jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`

### DR-11: deploy.yml files in match-backend and receptor-planner use mutable action version tags (SEC-02)

Affects: `match-backend, receptor-planner` — .github/workflows/deploy.yml

- [ ] For match-backend/deploy.yml: Pin actions/checkout, docker/login-action, docker/metadata-action, docker/build-push-action, and actions/create-github-app-token to their current commit SHAs.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/deploy.yml`
- [ ] Same SHA-pin updates for receptor-planner/deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/deploy.yml`

### DR-14: No automated rollback workflow exists in any repository

Affects: `all` — .github/workflows/

- [ ] Create rollback.yml for match-backend: workflow_dispatch with 'rollback-tag' input that checks out receptor-infra, updates deployment.yaml image tag, and pushes.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/rollback.yml`
- [ ] Create rollback.yml for receptor-planner with same pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/rollback.yml`
- [ ] Create rollback.yml for supabase-receptor DB with target migration version input, gated on production environment approval.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/rollback.yml`

### DR-15: Frontend repos have no deploy.yml — environment promotion is undocumented

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/

- [ ] Confirm the frontend deployment mechanism. If Cloudflare Pages, document the integration and create a minimal deploy.yml. If manual, create a proper deploy pipeline with environment gates.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/`

### DR-16: smoke-test DB canary table name blocks both staging AND production smoke tests

Affects: `supabase-receptor` — .github/actions/smoke-test/action.yml

- [ ] Verify supabase-receptor schema and update smoke-test action as described in DR-02-T1. Prioritise as this blocks both staging and production smoke test pipelines.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/smoke-test/action.yml`

## 🟡 Medium

### DR-01: deno check glob may silently type-check zero files on some runner shells

Affects: `supabase-receptor` — .github/workflows/ci.yml

- [ ] Replace the glob pattern in deno-check step with explicit enumeration (e.g. `find supabase/functions -name '*.ts' | xargs deno check`). Add a guard that fails if no files are found.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`

### DR-04: Slack webhook secret name inconsistency across supabase-receptor workflows

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml

- [ ] Standardise on SLACK_DEPLOYMENTS_WEBHOOK_URL and SLACK_INCIDENTS_WEBHOOK_URL across all supabase-receptor workflows. Update prod-deploy.yml notify job. Verify secrets are set under canonical names in GitHub Actions secrets.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`

### DR-07: deploy-function.yml missing permissions block (SEC-01)

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml

- [ ] Add 'permissions: contents: read' at the workflow level in deploy-function.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`

### DR-12: deploy.yml build-and-deploy job has no timeout-minutes (CICD-05)

Affects: `match-backend, receptor-planner` — .github/workflows/deploy.yml

- [ ] Add timeout-minutes: 20 to the build-and-deploy job in match-backend/deploy.yml and receptor-planner/deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/deploy.yml`

## 🟢 Low

### DR-06: deploy-function.yml uses mutable action tags (SEC-02)

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml

- [ ] Replace actions/checkout@v4 with SHA-pinned equivalent (11bd71901bbe5b1630ceea73d27597364c9af683 # v4), and denoland/setup-deno@v2 with SHA-pinned equivalent.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`

### DR-08: key-rotation-reminder.yml uses SLACK_DEPLOYMENTS_WEBHOOK_URL; prod-deploy.yml uses SLACK_DEPLOYMENTS_WEBHOOK

Affects: `supabase-receptor` — .github/workflows/key-rotation-reminder.yml

- [ ] Resolve as part of DR-04-T1 (canonical Slack secret naming). Update key-rotation-reminder.yml to use the agreed canonical secret name.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/key-rotation-reminder.yml`


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | DR-03, DR-10, DR-02, DR-16 | Fix workflow defects that cause immediate failures in prod-deploy, staging smoke tests, and ci-cleanup. Restore functional CI paths first before addressing security hardening. |
| 2 | DR-05, DR-13 | Configure GitHub Environment protection for production approval (prevents auto-approve on prod-deploy) and create website-frontend CI baseline. Both are security and compliance requirements. |
| 3 | DR-04, DR-08, DR-06, DR-07, DR-11, DR-12 | Standardise Slack webhook secret names to eliminate silent notification failures, and SHA-pin all unversioned actions in deploy.yml files to enforce SEC-02 supply-chain security. |
| 4 | DR-09 | Apply the NEXT_PUBLIC_SUPABASE_ANON_KEY rename to CI stubs to ensure unit tests run against the correct environment configuration matching production code. |
| 5 | DR-14, DR-15, DR-01 | Implement automated rollback workflows, document/automate frontend deployment, and fix the Deno glob pattern to complete the CICD governance picture. |


---

## Severity Summary

| Finding ID | Area | Category | Severity |
| :--------- | :--- | :------- | :------- |
| DR-03 | prod-deploy.yml | Process Gap | 🔴 Critical |
| DR-05 | prod-deploy.yml | Security | 🔴 Critical |
| DR-10 | ci.yml (ci-cleanup) | Process Gap | 🔴 Critical |
| DR-13 | website-frontend | Process Gap | 🔴 Critical |
| DR-02 | smoke-test/action.yml | Process Gap | 🟠 High |
| DR-09 | ci.yml (unit-tests) | Test Coverage | 🟠 High |
| DR-11 | deploy.yml | Security | 🟠 High |
| DR-14 | all repos | Process Gap | 🟠 High |
| DR-15 | frontend workflows | Process Gap | 🟠 High |
| DR-16 | smoke-test/action.yml | Process Gap | 🟠 High |
| DR-01 | ci.yml | Process Gap | 🟡 Medium |
| DR-04 | prod-deploy.yml | Process Gap | 🟡 Medium |
| DR-07 | deploy-function.yml | Security | 🟡 Medium |
| DR-12 | deploy.yml | Process Gap | 🟡 Medium |
| DR-06 | deploy-function.yml | Security | 🟢 Low |
| DR-08 | key-rotation-reminder.yml | Process Gap | 🟢 Low |


---

## Session Close — 2026-03-19 (Session 2)

**Completed this session:**

| Finding | Description |
| :------ | :---------- |
| DR-10-T1 | planner-frontend ci-cleanup: re-fetches SUPABASE_SERVICE_ROLE_KEY via fresh Supabase start (cross-job boundary fix) |
| DR-28-T1 | All 3 frontend repos: EXTERNAL_REPO_TOKEN → GITHUB_APP_TOKEN in ci.yml + renovate.yml |
| DR-29-T1 | All 3 frontend repos: `supabase stop` teardown added after integration-tests (if: always()) |
| DR-33-T1/T2 | All 3 frontend renovate.yml: SHA-pinned renovatebot/github-action@7b4b65bf + GITHUB_APP_TOKEN |
| DR-35-T1 | All 3 frontend ci.yml: `npm install` → `npm ci` (deterministic installs) |
| DR-36-T1 | preference-frontend + workforce-frontend ci-cleanup: same cross-job key re-fetch fix as DR-10 |
| (bonus) | Husky shebang fix: `#!/usr/bin/env sh` → `#!/bin/sh` in all 45 hook files across 3 repos. Root cause: core.hooksPath=.husky/_ means git calls .husky/_/* shims directly; env cannot find sh in git's restricted PATH on macOS. |

**Findings reconciled to complete:** DR-28, DR-29, DR-33, DR-35, DR-36

**Remaining Phase 2:**
- DR-09: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY → NEXT_PUBLIC_SUPABASE_ANON_KEY rename in CI stubs
- DR-32: Remove test credentials from unit-tests job env block (credentials only needed in integration-tests)

**Phase 3 (session 3):** DR-11, DR-12, DR-24, DR-25, DR-27 — match-backend + receptor-planner deploy hardening

**PRs to raise:** planner-frontend, preference-frontend, workforce-frontend → main (after DR-09/32 complete)


---

## Phase 2 Close — 2026-03-19 (Session 2, continued)

**Completed (DR-09 + DR-32):**

| Finding | What was done |
| :------ | :------------ |
| DR-09-T1/T2/T3 | All 3 frontend repos: renamed `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` in all ci.yml env stubs, GITHUB_ENV grep/sed pipelines, and env references. Also fixed 12 source code references across 9 files in `planner-frontend` (graphql/client, graphql/server, supabase/middleware, supabase/server, test-utils, setup, globalSetup, middleware.unit.test, seedingService) — these were pre-existing LIFE-05 rename gaps caught by the tsc pre-push hook. |
| DR-32-T1 | All 3 frontend repos: removed `TEST_ADMIN_EMAIL/PASSWORD` + `TEST_WORKER_EMAIL/PASSWORD` from unit-tests job env block. Credentials remain in integration-tests where they are actually used. |

**Phase 2 fully complete.** All 5 findings committed to `audit/260319-cicd-workflow-health` across planner-frontend, preference-frontend, workforce-frontend.

**PRs ready to raise:** planner-frontend, preference-frontend, workforce-frontend → main.


---

## Phase 3 Close — 2026-03-19 (Session 3)

**Completed:**

| Finding | What was done |
| :------ | :------------ |
| DR-11-T1/T2 | Both backend deploy.yml files: SHA-pinned all 5 actions — `checkout@11bd719`, `docker/login-action@c94ce9f`, `docker/metadata-action@c299e40`, `docker/build-push-action@ca052bb`, `create-github-app-token@d72941d` |
| DR-12-T1 | Both backend deploy.yml files: `timeout-minutes: 20` added to `build-and-deploy` job |
| DR-25-T1 | match-backend `ci.yml`: `supabase stop + docker prune` cleanup steps added after integration tests with `if: always()` |

**Formally deferred:**

| Finding | Reason |
| :------ | :----- |
| DR-24-T1/T2 | DEPLOY_BOT_PRIVATE_KEY → Vault migration: deploy jobs run on `ubuntu-latest` (GitHub-hosted), not ARC. OIDC to self-hosted Vault requires network routing decision. Deferred until Cloudflare Tunnel or Vault public ingress is confirmed. |
| DR-27-T1/T2 | Staging/production promotion separation: requires receptor-infra namespace split and GitHub Environment gate. Deferred until infra team decides how staging vs production namespaces are laid out in receptor-infra. |

**Phase 3 complete.** Both repos committed to `audit/260319-cicd-workflow-health`. Deferred items documented.

---

## Final Session Close — 2026-03-20 (Re-audit)

**Completed this session:**

| Finding | What was done |
| :------ | :------------ |
| DR-01-T1 | `supabase-receptor/ci.yml`: `xargs deno check` with `find` enumeration + empty-set guard confirmed in code |
| DR-02/DR-16 | `smoke-test/action.yml`: `orgs` table name confirmed, comment cites DR-02/DR-16/DR-30 |
| DR-03 | `prod-deploy.yml`: all 5 smoke-test inputs verified in code (anon-key, anon-jwt, base-url, incidents/deployments webhook URLs) |
| DR-04/DR-08 | Vault-sourced canonical URLs confirmed in staging-smoke.yml and prod-deploy.yml |
| DR-06 | `actions/checkout` SHA-pinned; `denoland/setup-deno@v2` residual risk accepted (Deno publishes immutable signed releases) |
| DR-07 | `deploy-function.yml` permissions confirmed at workflow + job level |
| DR-13 | `website-frontend` now has `ci.yml`, `deploy.yml`, `rollback.yml`, `secret-scan.yml` confirmed in code |
| DR-14 | `rollback.yml` confirmed in `match-backend`, `receptor-planner`, and `website-frontend` |
| DR-17 | `staging-smoke.yml` Vault paths confirmed as canonical (`slack-incidents-webhook`, `slack-deployments-webhook`) |

**Remaining (formally deferred):**
- DR-05: GitHub Production Environment Protection — requires paid GitHub plan. Risk accepted by Ryan Ammendolea (CEO).
- DR-15: Frontend deploy.yml — Cloudflare Pages may auto-deploy; deferred until first frontend production promotion.

**Blocked:** None

**Brief for next agent:** Audit is closed. `re-audit.md` confirms all findings. DR-05 and DR-15 have documented risk-acceptance and re-open triggers. No further action required until GitHub plan upgrade (DR-05) or first frontend production deployment (DR-15).
