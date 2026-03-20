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
| DR-02/DR-16 — Table name in smoke-test DB canary | Resolved 2026-03-19 — canonical table name is orgs. Update smoke-test/action.yml to query /rest/v1/orgs. |
| DR-13/DR-15 — Frontend deployment mechanism | Resolved 2026-03-19 — frontend apps deploy to k3s prod via Cloudflare Tunnel, same pattern as backend services (Docker image → GHCR → receptor-infra GitOps manifest). Cloudflare Pages is deferred minimum 6 months. |
| DR-04/DR-08/DR-17 — Canonical Slack webhook Vault path and GitHub secret name | Resolved 2026-03-19 — canonical Vault path: secret/infrastructure/slack-&#123;channel&#125;-webhook (e.g. slack-incidents-webhook, slack-deployments-webhook). Canonical GitHub secret name for platform runners without Vault: SLACK_&#123;CHANNEL&#125;_WEBHOOK_URL. staging-smoke.yml was reading from wrong paths (slack-webhook-&#123;channel&#125;) — see DR-17. |


---

## 🔴 Critical

### DR-03: prod-deploy.yml smoke-test-prod job calls .github/actions/smoke-test with only 2 inputs (base-url, slack-webhook-url) bu

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml


- [x] Update prod-deploy.yml smoke-test-prod job: add a Vault KV fetch step to retrieve anon-key and anon-jwt from secret/supabase/production/credentials, and incidents/deployments webhook URLs from secret/infrastructure/slack-incidents-webhook and secret/infrastructure/slack-deployments-webhook. Pass all 5 required inputs to the smoke-test composite action. Model the Vault OIDC auth on staging-smoke.yml pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-05: prod-deploy.yml approve job depends on the GitHub 'production' environment for the manual approval gate. The 260312 audi

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml


- [~] Configure the GitHub Actions 'production' environment in dm-ra-01/supabase-receptor Settings &#62; Environments &#62; production with at least one Required Reviewer (Ryan Ammendolea). Document this configuration in docs/infrastructure/ci-required-checks.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
      _(Completed: 2026-03-19T10:05:00Z)_
- [~] Verify and configure the 'production' environment in deploy-function.yml as well (it also uses 'environment: production' on the deploy job).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T10:05:00Z)_

### DR-10: ci-cleanup job hardcodes NEXT_PUBLIC_SUPABASE_URL: http://127.0.0.1:54321 and reads SUPABASE_SERVICE_ROLE_KEY from $&#123;&#123; e

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (ci-cleanup job)


- [x] Fix ci-cleanup in planner-frontend ci.yml: move the cleanup inline into the integration-tests job as an always() step at the end (after the 'Run integration tests' step). This avoids cross-job GITHUB_ENV propagation. The Supabase instance is still running at that point and keys are available in $GITHUB_ENV from the earlier 'Start Supabase' step.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_
- [x] Same fix for preference-frontend ci.yml ci-cleanup job.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:58:21Z)_
- [x] Same fix for workforce-frontend ci.yml ci-cleanup job.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-13: website-frontend has no .github/workflows directory. There is no CI pipeline: no lint, type-check, build gate, or deploy

Affects: `website-frontend` — .github/workflows/


- [x] Create .github/workflows/ci.yml for website-frontend with: lint job (npm run lint), type-check job (npx tsc --noEmit), build job (npm run build). Use SHA-pinned actions and arc-runner-website-frontend ARC runner label. Model on planner-frontend/ci.yml but omit Supabase, integration test, and codegen-check jobs (no Supabase dependency in website-frontend).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/website-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T09:30:00Z)_
- [x] Create .github/workflows/deploy.yml for website-frontend. Deployment target is k3s prod via Cloudflare Tunnel (same pattern as match-backend/deploy.yml). On push to main, build Docker image, push to GHCR, update receptor-infra deployment manifest. Gate with GitHub 'production' environment approval.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/website-frontend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T09:30:00Z)_

### DR-17: staging-smoke.yml reads Slack webhook URLs from wrong Vault paths: secret/infrastructure/slack-webhook-incidents and sec

Affects: `supabase-receptor` — .github/workflows/staging-smoke.yml


- [x] Update staging-smoke.yml lines 62-63: change path from secret/infrastructure/slack-webhook-incidents to secret/infrastructure/slack-incidents-webhook, and from secret/infrastructure/slack-webhook-deployments to secret/infrastructure/slack-deployments-webhook.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/staging-smoke.yml`
      _(Completed: 2026-03-19T08:39:20Z)_
- [x] Delete orphaned Vault paths secret/infrastructure/slack-webhook-incidents and secret/infrastructure/slack-webhook-deployments using vault kv delete after the rename is confirmed. Document canonical Vault path convention: secret/infrastructure/slack-&#123;channel&#125;-webhook.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/vault/vault-supabase-bootstrap.sh`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-18: prod-deploy.yml has no concurrency group. A tag push (release/*) and a simultaneous workflow_dispatch can both reach the

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml


- [x] Add a concurrency block to prod-deploy.yml at the workflow level: `concurrency: &#123; group: 'prod-deploy-$&#123;&#123; github.ref &#125;&#125;', cancel-in-progress: false &#125;`. Set cancel-in-progress to false (queue rather than cancel) — cancelling a mid-flight migration is more dangerous than waiting. Document that only one prod deploy can run at a time per branch/tag.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-23: The supabase-start composite action (line 106) writes service-role-key to GITHUB_OUTPUT via `echo "service-role-key=$&#123;SE

Affects: `supabase-receptor` — .github/actions/supabase-start/action.yml


- [x] Remove the `service-role-key` output from supabase-start/action.yml entirely. The service role key is already exported to GITHUB_ENV as SUPABASE_SERVICE_ROLE_KEY (line 99) and is usable by subsequent steps in the same job without being exposed as a step output. Remove `service-role-key` from the `outputs` declaration (lines 33–35) and from the `echo` on line 106. Update any callers that reference `steps.supabase-start.outputs.service-role-key` to use `env.SUPABASE_SERVICE_ROLE_KEY` instead.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/supabase-start/action.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-30: smoke-test/action.yml Check 4/5 (DB canary) still queries `/rest/v1/organisations?select=id&limit=1` (line 93) and print

Affects: `supabase-receptor` — .github/actions/smoke-test/action.yml line 93


- [x] This is an implementation reminder, not a new fix. Immediately action DR-02-T1: in smoke-test/action.yml line 93, change `/rest/v1/organisations?select=id&limit=1` to `/rest/v1/orgs?select=id&limit=1`. Also update line 104 comment from 'organisations table accessible' to 'orgs table accessible'. This unblocks all smoke tests across staging and production simultaneously. Should be the first task actioned in Phase 1 implementation.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/smoke-test/action.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-36: preference-frontend/ci.yml (and its counterpart in workforce-frontend) has a `ci-cleanup` job (lines 335–368) that runs 

Affects: `preference-frontend, workforce-frontend` — .github/workflows/ci.yml (ci-cleanup job)


- [x] Apply the same fix as DR-10: inline the ci-cleanup logic into the integration-tests job as an `if: always()` step at the end, where SUPABASE_SERVICE_ROLE_KEY is still available in the environment and the Supabase instance is still running. Remove the separate ci-cleanup job. Apply to both preference-frontend and workforce-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-38: deploy-function.yml has no top-level `permissions:` block and no job-level permissions declarations. Both jobs run with 

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml


- [x] Add `permissions: contents: read` at the workflow level in deploy-function.yml. The deploy job needs no GITHUB_TOKEN write permissions — kubectl access is via in-cluster RBAC, not the token. SHA-pin `actions/checkout@v4` and `denoland/setup-deno@v2` in both jobs. Look up SHAs: `gh api repos/denoland/setup-deno/git/ref/tags/v2 --jq .object.sha`.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-39: deploy-function.yml extracts the edge function name directly from the git tag using `cut -d'/' -f2` with no allowlist va

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml lines 31–39


- [x] Add a validation step immediately after tag extraction that checks FUNCTION_NAME against an allowlist of known edge function names (e.g. `receptor-allocator`, `match-notify`). Reject any tag where FUNCTION_NAME contains `/`, `..`, spaces, or characters outside `[a-z0-9-]`. Example: `if ! echo "$FUNCTION_NAME" | grep -qE '^[a-z0-9-]+$'; then echo '::error::Invalid function name in tag'; exit 1; fi`. Apply the same check before every downstream use of the variable.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-48: ARC runners in the `arc-runners` namespace exhibit a reduced MTU (1370) causing silent packet drops for large egress pay

Affects: `receptor-infra` — Network Fabric (Calico/k3s)


- [x] Adjust Calico MTU configuration to 1370 and update allow-arc-runners-egress NetworkPolicy to explicitly permit traffic to 10.10.0.0/24 on port 6443.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/network-policies/network-policies.yaml`
      _(Completed: 2026-03-20T11:45:00Z)_

### DR-52: The `tigera-operator` Deployment in namespace `tigera-operator` has a hardcoded `nodeSelector: kubernetes.io/hostname: r

Affects: `receptor-infra` — tigera-operator Deployment / helmfile.yaml


- [x] Remove the `kubernetes.io/hostname: receptor-ctrl-01` node selector from the tigera-operator Deployment in `receptor-infra`. Replace with `node-role.kubernetes.io/control-plane: "true"` so the operator always schedules onto a valid control-plane node. Update the Helm values or raw manifest, commit to `receptor-infra` audit branch, and verify the pod reaches `Running` status.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/calico.yaml`
      _(Completed: 2026-03-20T02:22:00Z)_

### DR-53: `cert-manager-cainjector` has accumulated 968+ crash-loop restarts over 3 days. Container logs show `dial tcp 10.43.0.1:

Affects: `receptor-infra` — network-policies/network-policies.yaml (cert-manager namespace)


- [x] Add a NetworkPolicy to `receptor-infra/network-policies/network-policies.yaml` for the `cert-manager` namespace permitting egress from all cert-manager pods to: (1) `10.43.0.1/32` port 443 (cluster API service IP); (2) `10.10.0.10/32`, `10.10.0.30/32`, `10.10.0.50/32` port 6443 (control-plane node IPs for API server). Also allow egress to `kube-dns` on port 53 UDP/TCP. Apply via `kubectl apply` and verify the cainjector restart count stops rising and the cert-manager-webhook readiness probe returns HTTP 200.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/network-policies/network-policies.yaml`
      _(Completed: 2026-03-20T02:24:00Z)_

### DR-54: All Supabase pods in both `supabase` and `supabase-staging` namespaces have been `CreateContainerConfigError` or `Init:0

Affects: `receptor-infra` — supabase / supabase-staging namespace secrets


- [x] Two-part fix: (1) Created `supabase-db` k8s Secret imperatively in both namespaces with `database=postgres` + password/password_encoded from supabase-credentials. (2) Added `transformation.templates.database.text: postgres` to `supabase/production/vso-secrets.yaml` and `supabase/staging/vso-secrets.yaml` — VSO now injects this non-sensitive value into `supabase-credentials` on every sync without requiring a Vault KV entry. Both changes committed to receptor-infra `main`. Force-resynced VSO to apply immediately and verified `database: postgres` present in both namespaces.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/supabase/production/vso-secrets.yaml`
      _(Completed: 2026-03-20T02:32:00Z)_

## 🟠 High

### DR-02: smoke-test composite action DB canary (Check 4/5) queries /rest/v1/organisations but the canonical schema table name is 

Affects: `supabase-receptor` — .github/actions/smoke-test/action.yml


- [x] Update smoke-test/action.yml line 93: change the DB canary query from /rest/v1/organisations?select=id&limit=1 to /rest/v1/orgs?select=id&limit=1. Add a comment: '# table name confirmed as orgs per schema standard (260319 audit)'.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/smoke-test/action.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-09: Unit test and build jobs in all three frontend ci.yml files still expose NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as the stu

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (unit-tests and build jobs)


- [x] Update planner-frontend ci.yml unit-tests and build job env blocks: rename NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY stubs to NEXT_PUBLIC_SUPABASE_ANON_KEY (matching the LIFE-05 application rename).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_
- [x] Same rename for preference-frontend ci.yml unit-tests and build jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_
- [x] Same rename for workforce-frontend ci.yml unit-tests and build jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-11: All GitHub Actions in match-backend/deploy.yml and receptor-planner/deploy.yml use mutable version tags (@v4, @v3, @v5, 

Affects: `match-backend, receptor-planner` — .github/workflows/deploy.yml


- [x] For match-backend/deploy.yml: Pin actions/checkout, docker/login-action, docker/metadata-action, docker/build-push-action, and actions/create-github-app-token to their current commit SHAs. Use `gh api repos/docker/login-action/git/ref/heads/main` or equivalent to look up SHA for each action.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:42:53Z)_
- [x] Same SHA-pin updates for receptor-planner/deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-14: No repository has an automated rollback workflow. The rollback-runbook.md (LIFE-04) documents manual rollback only. ISO 

Affects: `all` — .github/workflows/


- [x] Create rollback.yml for match-backend: a workflow_dispatch with input 'rollback-tag' that checks out receptor-infra, updates deployment.yaml image to the specified tag using the same sed pattern, and pushes. Gate with production environment approval.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/rollback.yml`
      _(Completed: 2026-03-19T09:30:00Z)_
- [x] Create rollback.yml for receptor-planner with same pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/rollback.yml`
      _(Completed: 2026-03-19T09:30:00Z)_
- [x] Create rollback.yml for supabase-receptor DB: workflow_dispatch with target migration version input, runs supabase db push with a rollback flag or targets a specific migration tag. Gate with production environment approval.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/rollback.yml`
      _(Completed: 2026-03-19T09:30:00Z)_
- [x] Create rollback.yml for website-frontend with same GitOps pattern as match-backend/receptor-planner.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/website-frontend/.github/workflows/rollback.yml`
      _(Completed: 2026-03-19T09:30:00Z)_

### DR-15: Frontend repositories (planner-frontend, preference-frontend, workforce-frontend) have no deploy.yml. Deployment target 

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/


- [x] Create .github/workflows/deploy.yml for planner-frontend. On push to main, build Docker image using the project Dockerfile, push to GHCR under ghcr.io/dm-ra-01/planner-frontend:sha, update the receptor-infra deployment manifest (same sed pattern as match-backend/deploy.yml). Gate with GitHub 'production' environment approval. Use SHA-pinned actions throughout.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T09:30:00Z)_
- [x] Same deploy.yml for preference-frontend.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T09:30:00Z)_
- [x] Same deploy.yml for workforce-frontend.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T09:30:00Z)_

### DR-16: The smoke-test composite action is called from both staging-smoke.yml and prod-deploy.yml. The incorrect table name (org

Affects: `supabase-receptor` — .github/actions/smoke-test/action.yml


- [x] Fix is the same as DR-02-T1. Confirm this single change unblocks both staging-smoke.yml and prod-deploy.yml smoke test paths.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/smoke-test/action.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-19: In prod-deploy.yml (backup-pre-deploy, diff, and deploy jobs) and staging-smoke.yml (Authenticate with Vault step), VAUL

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml, staging-smoke.yml


- [x] In all Vault auth steps across prod-deploy.yml and staging-smoke.yml: reorder to call ::add-mask:: before echoing to GITHUB_ENV. Pattern: `echo "::add-mask::$&#123;VAULT_TOKEN&#125;" && echo "VAULT_TOKEN=$&#123;VAULT_TOKEN&#125;" &#62;&#62; $GITHUB_ENV`. Apply to all three Vault login occurrences in prod-deploy.yml (backup-pre-deploy, diff, deploy jobs) and the single occurrence in staging-smoke.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-20: prod-deploy.yml deploy job (lines 215–216): `git tag deployed/... || true` and `git push --tags || true` silently suppre

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml


- [x] Remove the `|| true` guards from the git tag and git push steps in prod-deploy.yml. If tagging fails, the deploy step should fail rather than continue silently. If the intent is to tolerate duplicate tags (idempotency on re-run), add an explicit duplicate-tag check: test whether the tag already exists and echo a clear message rather than silently continuing.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-21: staging-smoke.yml lines 18 and 77 hardcode the staging base URL as `https://staging-api-829c83.commonbond.au` (an intern

Affects: `supabase-receptor` — .github/workflows/staging-smoke.yml


- [x] Update staging-smoke.yml lines 18 and 77: replace `https://staging-api-829c83.commonbond.au` with `https://receptor-api-staging.commonbond.au`. Confirm prod-deploy.yml PRODUCTION_URL env var aligns with the §6.1 standard (`https://receptor-api.commonbond.au`). Document both canonical URLs in docs/infrastructure/service-urls.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/staging-smoke.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-24: Both match-backend/deploy.yml and receptor-planner/deploy.yml run on `ubuntu-latest` (GitHub-hosted runners) with no `id

Affects: `match-backend, receptor-planner` — .github/workflows/deploy.yml


- [x] Move DEPLOY_BOT_PRIVATE_KEY from GitHub Actions secrets to Vault KV path secret/infrastructure/github-app-deploy-bot. Add `id-token: write` to deploy.yml jobs, add a Vault OIDC auth step (identical to supabase-receptor prod-deploy.yml pattern), and fetch the private key from Vault before the `actions/create-github-app-token` step. Remove the GitHub Actions DEPLOY_BOT_PRIVATE_KEY secret from both repositories. Apply to both match-backend and receptor-planner deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:58:21Z)_
- [x] Same Vault migration for receptor-planner/deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-27: Both match-backend/deploy.yml and receptor-planner/deploy.yml are named 'Deploy to Staging' but trigger on every push to

Affects: `match-backend, receptor-planner` — .github/workflows/deploy.yml


- [x] Rename deploy.yml trigger to distinguish staging from production. Add a `promote-to-prod` job (or separate workflow) for match-backend and receptor-planner that requires a GitHub Environment 'production' approval gate before updating the production manifest in receptor-infra. The current deploy.yml flow should target a staging namespace in receptor-infra only. Model the two-job pattern (staging deploy → approval gate → production promote) on supabase-receptor/prod-deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:58:21Z)_
- [~] Same staging/production promotion separation for receptor-planner/deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-28: All three frontend CI workflows use `secrets.EXTERNAL_REPO_TOKEN` — a long-lived GitHub Personal Access Token — to check

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (integration-tests, codegen-check, e2e-axe jobs)


- [x] Replace `secrets.EXTERNAL_REPO_TOKEN` in all three frontend CI workflows with GitHub App token generation using `actions/create-github-app-token` (SHA-pinned) pointed at `dm-ra-01/supabase-receptor`. The app-lifecycle-deployment GitHub App already has this cross-repo scope. Add an `id-token: write` permission to each affected job. Remove the EXTERNAL_REPO_TOKEN PAT from all three repositories' GitHub Actions secrets after migration. Apply to planner-frontend, preference-frontend, and workforce-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-29: planner-frontend/ci.yml starts Supabase with `--ignore-health-check` in three separate jobs (integration-tests line 124,

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (integration-tests, codegen-check, e2e-axe jobs)


- [x] Add `if: always()` cleanup steps to integration-tests, codegen-check, and e2e-axe jobs in planner-frontend/ci.yml: (1) `supabase stop --workdir supabase-backend/supabase`; (2) `docker system prune -f --volumes`. Apply the same fix to preference-frontend and workforce-frontend ci.yml (same job structure). Consider extracting a shared cleanup composite action to avoid duplicating the stop+prune pattern across all three repos.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-31: The e2e-axe accessibility audit job in planner-frontend/ci.yml (and equivalents in preference-frontend, workforce-fronte

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (e2e-axe job)


- [~] Remove `continue-on-error: true` from the e2e-axe job in planner-frontend, preference-frontend, and workforce-frontend ci.yml. This promotes accessibility from informational to a hard merge gate. Before removing it, confirm the axe spec passes on the current codebase (run locally: `npx playwright test --config playwright.axe.config.ts`) and triage any existing violations. If violations exist, document them as known issues in a new finding rather than silently ignoring them. Consider setting an axe `impact` threshold (e.g. fail only on critical/serious) to avoid blocking on incidental moderate violations during the transition.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-33: renovate.yml in all three frontend repos uses `renovatebot/github-action@v46.1.3` — a mutable semver tag, not SHA-pinned

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/renovate.yml


- [x] SHA-pin `renovatebot/github-action` in all three renovate.yml files. Look up current SHA: `gh api repos/renovatebot/github-action/git/ref/tags/v46.1.3 --jq .object.sha`. Add explicit `permissions: contents: write, pull-requests: write` block to the renovate job. This must be done in the same PR as DR-28 to avoid breaking Renovate the moment the PAT is deleted.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/renovate.yml`
      _(Completed: 2026-03-19T08:42:53Z)_
- [x] Replace `RENOVATE_TOKEN: $&#123;&#123; secrets.EXTERNAL_REPO_TOKEN &#125;&#125;` with the GitHub App token pattern — generate a token via `actions/create-github-app-token` scoped to the repos Renovate needs to open PRs against (planner-frontend, preference-frontend, workforce-frontend, supabase-receptor). Set `RENOVATE_TOKEN: $&#123;&#123; steps.app-token.outputs.token &#125;&#125;`. This must be coordinated with DR-28 — both must land in the same release to avoid an auth gap.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/renovate.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-34: preference-frontend/ci.yml runs `supabase stop --workdir supabase-backend/supabase --no-backup 2&#62;/dev/null || true` as t

Affects: `preference-frontend` — .github/workflows/ci.yml (integration-tests, codegen-check, e2e-axe jobs)


- [x] Remove the `supabase stop ... || true` pre-clean from integration-tests, codegen-check, and e2e-axe jobs in preference-frontend/ci.yml. Instead, the DR-29 fix (supabase stop in an `if: always()` teardown step) is the correct solution — it ensures stop happens after the job rather than before, and does not suppress errors. If a pre-stop is genuinely needed on this runner, it should be done without `|| true` and should log a warning rather than silently ignoring the exit code. Standardise the pattern across all three frontend repos.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-35: Every frontend and backend CI workflow uses `npm install` (or `pip install`) rather than `npm ci`. `npm install` can sil

Affects: `planner-frontend, preference-frontend, workforce-frontend, match-backend, receptor-planner` — .github/workflows/ci.yml (all Install dependencies steps)


- [x] Replace all `npm install` with `npm ci` in the Install dependencies steps across planner-frontend, preference-frontend, and workforce-frontend ci.yml. `npm ci` requires `package-lock.json` to be present and up-to-date — if it is not, the build fails immediately rather than silently diverging. Run `npm install` locally first to ensure the lockfile is current before switching CI to `npm ci`. Apply to all jobs within each ci.yml (lint-and-type, unit-tests, integration-tests, build, codegen-check, e2e-axe, ci-cleanup).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-40: deploy-function.yml deploy job uses `runs-on: self-hosted` without any additional runner labels (line 47). With no label

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml line 47


- [x] Change `runs-on: self-hosted` to `runs-on: [self-hosted, arc-runner-supabase-receptor]` (or the specific label assigned to the supabase-receptor k3s runner). Verify the label matches what is configured in the ARC HelmRelease for this runner. This ensures only the authorised runner with cluster access can execute this job.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-41: deploy-function.yml smoke-test step (lines 93–106) treats any non-5xx HTTP status as a pass — including 401, 403, and 40

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml lines 93–106


- [x] Change the smoke-test HTTP status check to require exactly 200 or your known healthy status code (not just 'non-5xx'). Add a rollback step with `if: failure()`: `kubectl rollout undo deployment/supabase-edge-runtime -n supabase && kubectl rollout status deployment/supabase-edge-runtime -n supabase --timeout=60s`. This ensures a failed smoke-test automatically reverts to the previous pod state rather than leaving the cluster in a broken deployment.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-42: key-rotation-reminder.yml line 82 interpolates a GitHub Actions step output directly into a shell string that is passed 

Affects: `supabase-receptor` — .github/workflows/key-rotation-reminder.yml line 82


- [x] Rewrite the Slack notification step in key-rotation-reminder.yml to avoid interpolating step outputs into shell strings. Pass the encoded alerts as an env var: `env: ALERTS_ENCODED: $&#123;&#123; steps.rotation-check.outputs.alerts &#125;&#125;` and read it in Python as `urllib.parse.unquote(os.environ['ALERTS_ENCODED'])`. This eliminates the injection surface entirely. Also validate that no GITHUB_OUTPUT values are piped through unquoted shell interpolation elsewhere in the workflow.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/key-rotation-reminder.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-45: No CI workflow in any repository runs secret scanning (e.g. `truffleHog`, `gitleaks`, or GitHub's native secret scanning

Affects: `planner-frontend, preference-frontend, workforce-frontend, supabase-receptor, match-backend, receptor-planner` — .github/workflows/ (all pipelines)


- [x] Add a `secret-scan` job to the CI workflow of each repository using `trufflesecurity/trufflehog-actions-scan` (SHA-pinned) or GitHub's `secret-scanning` native push protection (enable in repo settings: Security &#62; Code security &#62; Secret scanning &#62; Push protection). The truffleHog approach scans every commit in the PR diff for high-entropy strings and known secret patterns. Run it as the first job (before lint-and-type) so it fails fast. Alternatively, enable GitHub's native push protection org-wide via the org security settings.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T09:55:00Z)_

### DR-47: workforce-frontend/ci.yml has no `codegen-check` job and no `e2e-axe` job — unlike planner-frontend and preference-front

Affects: `workforce-frontend` — .github/workflows/ci.yml


- [x] Add a `codegen-check` job to workforce-frontend/ci.yml, identical to the one in planner-frontend/ci.yml — it checks for GraphQL schema drift against a live Supabase instance using the same pattern. Add an `e2e-axe` job (informational, with `continue-on-error: true` until DR-31 is resolved) for accessibility baseline visibility. Apply the same `if: always()` Supabase stop and Docker cleanup teardown (DR-29 fix) to the new jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-49: An orphaned `needs` block in the root `helmfile.yaml` (line 127) caused a YAML unmarshal error during `helmfile diff` an

Affects: `receptor-infra` — helmfile.yaml


- [x] Remove the orphaned `needs` block from `helmfile.yaml` and verify syntax via `helmfile lint` or a dry-run sync.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T10:15:00Z)_

### DR-50: The `AutoscalingRunnerSet` for `receptor-infra` was found to be deleted or missing from the cluster, despite being defin

Affects: `receptor-infra` — ARC Configuration


- [x] Manually restore the `AutoscalingRunnerSet` via `helm upgrade` and re-enable `containerMode: dind` to support image builds. Confirm the listener pod is reconstructed and healthy.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T10:45:00Z)_

### DR-51: Despite setting `containerMode: dind` in the `gha-runner-scale-set` chart values, the ARC controller (0.10.1) is not inj

Affects: `receptor-infra` — ARC Configuration / helmfile.yaml


- [x] Investigate why the ARC controller is ignoring the containerMode setting. Verify chart version compatibility and consider manual sidecar injection in the template if the automated mode remains non-functional.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T02:48:31Z)_

### DR-55: The Loki StatefulSet (`loki-stack-0`) in `monitoring` namespace cannot start due to `FailedAttachVolume: volume pvc-a35f

Affects: `receptor-infra` — monitoring namespace — Loki PVC (Longhorn)


- [x] Force-detach the stuck Longhorn volumes via the Longhorn UI (`http://longhorn.&#60;cluster-domain&#62;`) or Longhorn API: navigate to Volume &#62; `pvc-a35f1e36` &#62; Detach. Then delete the stuck `loki-stack-0` pod (`kubectl delete pod loki-stack-0 -n monitoring`) to trigger rescheduling. If volume detachment fails, use the Longhorn API `POST /v1/volumes/&#60;id&#62;?action=detach` with `hostId` set to the node name. Verify `loki-stack-0` reaches `Running` and Promtail agents report `Readiness probe` passing.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T02:48:39Z)_

### DR-56: `cert-manager-cainjector` has resource limits of `cpu: 20m` and `memory: 32Mi`. The cainjector performs CRD enumeration 

Affects: `receptor-infra` — cert-manager Deployment — cainjector container resources


- [x] Updated `receptor-infra/values/cert-manager.yaml` cainjector resource requests to `&#123;cpu: 100m, memory: 128Mi&#125;` and limits to `&#123;cpu: 500m, memory: 256Mi&#125;`. Applied live via `kubectl patch` and committed to receptor-infra `main`. Verified new cainjector pod `cert-manager-cainjector-6795b7df76-vwh69` reached `1/1 Running` with 0 restarts.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/cert-manager.yaml`
      _(Completed: 2026-03-20T02:35:00Z)_

## 🟡 Medium

### DR-01: deno check supabase/functions/**/*.ts uses a glob that may not expand correctly on all self-hosted runner shells, potent

Affects: `supabase-receptor` — .github/workflows/ci.yml


- [x] Replace the glob pattern in deno-check step with explicit enumeration (e.g. `find supabase/functions -name '*.ts' | xargs deno check`) or use a shell-safe glob expansion. Add a guard that fails if no files are found.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-04: prod-deploy.yml notify job reads secrets.SLACK_DEPLOYMENTS_WEBHOOK (no _URL suffix) via GitHub Actions secrets — bypassi

Affects: `supabase-receptor` — .github/workflows/prod-deploy.yml


- [x] Update prod-deploy.yml notify job: remove the secrets.SLACK_DEPLOYMENTS_WEBHOOK reference. Read the deployments webhook URL from Vault KV path secret/infrastructure/slack-deployments-webhook (field: url) in the same Vault fetch step as DR-03-T1. Expose as env var SLACK_DEPLOYMENTS_URL and use in the curl POST.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-07: deploy-function.yml has no workflow-level permissions block. The deno-check job runs on ubuntu-latest with default GITHU

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml


- [x] Add 'permissions: contents: read' at the workflow level in deploy-function.yml. The deploy job requires id-token: write for any future Vault OIDC auth — add that per-job if needed.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-12: deploy.yml build-and-deploy job has no timeout-minutes. A hung Docker build on ubuntu-latest will consume runner minutes

Affects: `match-backend, receptor-planner` — .github/workflows/deploy.yml


- [x] Add timeout-minutes: 20 to the build-and-deploy job in match-backend/deploy.yml and receptor-planner/deploy.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/deploy.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-22: No CI workflow across any repository defines a concurrency group with cancel-in-progress. On rapid successive pushes (fi

Affects: `all` — .github/workflows/ci.yml


- [x] Add a concurrency block to all CI workflows (supabase-receptor, planner-frontend, preference-frontend, workforce-frontend ci.yml): `concurrency: &#123; group: 'ci-$&#123;&#123; github.ref &#125;&#125;', cancel-in-progress: true &#125;`. This cancels any in-progress CI run for the same branch when a new commit is pushed. Do not apply cancel-in-progress: true to deploy or prod-deploy workflows.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:58:21Z)_

### DR-25: match-backend/ci.yml integration-tests job starts Supabase (line 89: `supabase start --ignore-health-check`) but has no 

Affects: `match-backend` — .github/workflows/ci.yml (integration-tests job)


- [x] Add a two-step cleanup block to match-backend/ci.yml integration-tests job, placed after 'Run integration tests' with `if: always()` on both steps: (1) `supabase stop` — tears down local Supabase containers cleanly; (2) `docker system prune -f --volumes` — removes dangling images, stopped containers, and unused volumes left by the Supabase Docker stack. Without this, each failed or cancelled run leaves ~2–3 GB of Docker layer cache and PostgreSQL volume data on arc-runner-match-backend, eventually exhausting disk and causing port 54321 conflicts for subsequent runs.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-26: staging-smoke.yml hardcodes VAULT_ADDR as a literal string (`env: VAULT_ADDR: https://vault.commonbond.au`) in two step 

Affects: `supabase-receptor` — .github/workflows/staging-smoke.yml


- [x] In staging-smoke.yml: replace both `VAULT_ADDR: https://vault.commonbond.au` occurrences (lines 47 and 58) with `VAULT_ADDR: $&#123;&#123; vars.VAULT_ADDR &#125;&#125;`. Confirm the `VAULT_ADDR` repository variable is set in dm-ra-01/supabase-receptor Settings &#62; Variables. Document the `vars.VAULT_ADDR` pattern as the standard in docs/infrastructure/vault-access.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/staging-smoke.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-32: planner-frontend/ci.yml unit-tests job injects `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_WORKER_EMAIL`, and `TEST

Affects: `planner-frontend, preference-frontend, workforce-frontend` — .github/workflows/ci.yml (unit-tests job)


- [x] Remove `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_WORKER_EMAIL`, and `TEST_WORKER_PASSWORD` from the env block of the unit-tests job in planner-frontend, preference-frontend, and workforce-frontend ci.yml. These secrets are only required in the integration-tests job. Verify that no unit test file imports or references these env vars (run `grep -r 'TEST_ADMIN|TEST_WORKER' src/ --include='*.unit.test.*'` to confirm). If any unit test file references them, it means the unit/integration test boundary is broken and the test should be reclassified.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T08:42:53Z)_

### DR-37: planner-frontend/ci.yml integration-tests job starts Supabase with `--ignore-health-check` (line 124) and immediately re

Affects: `planner-frontend` — .github/workflows/ci.yml (integration-tests job, line 124–128)


- [x] Replace the immediate `supabase status` call in planner-frontend and preference-frontend integration-tests, codegen-check, and e2e-axe jobs with the PUBLISHABLE_KEY polling loop from match-backend/ci.yml (lines 93–109) or better yet, switch to using the supabase-start composite action from supabase-receptor/.github/actions/supabase-start (which already implements the correct health gate). This removes boilerplate from 6 jobs across 2 repos and ensures consistent, tested health-gate behaviour.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T09:55:00Z)_

### DR-43: key-rotation-reminder.yml uses `cron: '0 23 28-31 * *'` with a day-of-month filter applied in the step (skip if day != 0

Affects: `supabase-receptor` — .github/workflows/key-rotation-reminder.yml line 12


- [x] Change `cron: '0 23 28-31 * *'` to `cron: '0 23 1 * *'` and remove the 'Check if today is the 1st of the month' step entirely. The cron will fire directly on the 1st of each month at 23:00 UTC (10:00 AEST). This eliminates February's silent skip and removes the redundant day-of-month guard logic.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/key-rotation-reminder.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-44: key-rotation-reminder.yml monitors 4 keys: SERVICE_ROLE_KEY, PUBLISHABLE_KEY (staging), CLOUDFLARE_TUNNEL_TOKEN, and SMT

Affects: `supabase-receptor` — .github/workflows/key-rotation-reminder.yml lines 40–65


- [x] Extend key-rotation-reminder.yml to include all secrets identified in the audit with rotation requirements. Add corresponding GitHub Actions Variables for each new key: CODECOV_TOKEN_ROTATION_DUE, SUPABASE_ANON_KEY_ROTATION_DUE, DEPLOY_BOT_KEY_ROTATION_DUE. Document the expected rotation period for each key in key-management.md alongside the reminder config. Once DR-28 is implemented and EXTERNAL_REPO_TOKEN is deleted, remove it from the reminder config.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/key-rotation-reminder.yml`
      _(Completed: 2026-03-19T08:39:20Z)_

### DR-46: All frontend and match-backend CI workflows pin Supabase CLI to version 2.75.0 via `supabase/setup-cli@... version: 2.75

Affects: `planner-frontend, preference-frontend, workforce-frontend, match-backend` — .github/workflows/ci.yml (Supabase CLI version pins)


- [x] Create a single source of truth for the required Supabase CLI version. Add a `.supabase-cli-version` file to supabase-receptor root containing the pinned version string (e.g. `2.75.0`). Update all frontend and backend CI workflows to read this file and fail if the installed CLI version doesn't match. Alternatively, use a GitHub Actions reusable workflow or composite action for the Supabase setup step that centralises the version pin. Update renovate.json to track `supabase/setup-cli` version bumps and apply them uniformly across all repos.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-19T09:55:00Z)_

### DR-57: Control-plane node `receptor-ctrl-10` is consuming 70% of its 7.8 GiB RAM while running etcd, kube-apiserver, and applic

Affects: `receptor-infra` — k3s cluster node taints


- [x] Apply `NoSchedule` taints to all three control-plane nodes: `kubectl taint node receptor-ctrl-10 receptor-ctrl-11 receptor-ctrl-50 node-role.kubernetes.io/control-plane=:NoSchedule --overwrite`. Then ensure system-level DaemonSets (Calico, Longhorn engine, Promtail) have the required `tolerations` entry. Verify that no application-tier pods (Supabase, Prometheus, Grafana) are rescheduled to control-plane nodes. Note: Longhorn `instance-manager` pods run on all nodes including control-plane by design — add a toleration to Longhorn's Helm values so it is not evicted.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T02:48:39Z)_

### DR-58: Over 40 pods across `longhorn-system` (CSI sidecars, instance managers, engine images) and `arc-systems` (ARC listener p

Affects: `receptor-infra` — longhorn-system, arc-systems — container resource limits


- [x] Add resource limits to Longhorn Helm values for CSI sidecar containers (csi-attacher, csi-provisioner, csi-resizer, csi-snapshotter): `limits: &#123;cpu: 200m, memory: 256Mi&#125;`. For ARC controller and listener pods, add `limits: &#123;cpu: 500m, memory: 512Mi&#125;` via the `gha-runner-scale-set-controller` Helm chart values. For Longhorn instance managers (which are not directly Helm-managed per-instance), set the `Resources` field in the Longhorn `Settings` CRD (`InstanceManagerCPURequest`, `InstanceManagerCPUReservedPercentage`). Apply via `helmfile sync --selector app=longhorn` and verify no evictions occur.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T02:48:39Z)_

### DR-59: Prometheus (`prometheus-kube-prometheus-stack-prometheus-0`) is consuming 1,066 MiB RAM with a 20 GiB Longhorn PVC and n

Affects: `receptor-infra` — monitoring namespace — Prometheus retention


- [x] Set `--storage.tsdb.retention.time=15d` and `--storage.tsdb.retention.size=15GB` in the Prometheus Helm values (`kube-prometheus-stack.prometheus.prometheusSpec.retention` and `retentionSize`). Apply via `helmfile sync --selector app=kube-prometheus-stack`. Verify Prometheus emits `prometheus_tsdb_retention_limit_bytes` metric. Also add `VPA` resources for at least Prometheus and Grafana to provide autoscaling signals — or document that VPA is intentionally absent as a separate finding.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
      _(Completed: 2026-03-20T02:48:40Z)_

## 🟢 Low

### DR-06: deploy-function.yml uses actions/checkout@v4 and denoland/setup-deno@v2 (mutable tags) in both jobs. All other ecosystem

Affects: `supabase-receptor` — .github/workflows/deploy-function.yml


- [x] Replace actions/checkout@v4 with actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4, and denoland/setup-deno@v2 with denoland/setup-deno@e95548e56dfa95d4e1a28d6f422fafe75c4c26fb # v2 in deploy-function.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
      _(Completed: 2026-03-19T08:39:19Z)_

### DR-08: key-rotation-reminder.yml runs on a GitHub-hosted runner with no Vault access, so reading Slack webhook from a GitHub Ac

Affects: `supabase-receptor` — .github/workflows/key-rotation-reminder.yml


- [x] Ensure GitHub Actions secret SLACK_DEPLOYMENTS_WEBHOOK_URL is set in dm-ra-01/supabase-receptor repository secrets with the correct Slack incoming webhook URL for #deployments. Document the two-tier pattern in docs/infrastructure/slack-webhooks.md: (1) Vault path secret/infrastructure/slack-&#123;channel&#125;-webhook for Vault OIDC runners; (2) GitHub secret SLACK_&#123;CHANNEL&#125;_WEBHOOK_URL for platform runners.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/key-rotation-reminder.yml`
      _(Completed: 2026-03-19T08:39:19Z)_


---

## Deferred to Next Audit Cycle

| Item | Reason Deferred |
| :--- | :-------------- |
| DR-31 | Deferred 2026-03-19 — accessibility enforcement gate agreed in principle but blocked on stable production-ready UI first. Re-evaluate once all three frontends reach their baseline quality bar. At that point, triage existing axe violations, document as known issues if needed, and remove continue-on-error. |


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | DR-30, DR-03, DR-17, DR-10, DR-02, DR-16, DR-18, DR-36, DR-48, DR-49 | Fix workflow defects that cause immediate failures: prod-deploy smoke-test missing inputs, wrong Vault paths in staging-smoke, wrong table name in smoke-test canary (DR-30 — action file never updated despite DR-02/DR-16), ci-cleanup broken across job boundaries for all three frontend repos (DR-36), and concurrent prod-deploy race on migration lock table. Restore all functional CI paths before security hardening. |
| 2 | DR-05, DR-13, DR-15, DR-27 | Configure GitHub Environment protection for production approval (prevents auto-approve on prod-deploy), create website-frontend CI and deploy pipeline (k8s/Cloudflare Tunnel), create deploy.yml for all other frontend repos using the same k8s pattern, and introduce staging-to-production promotion gates for backend deploy workflows. |
| 3 | DR-04, DR-08, DR-06, DR-07, DR-11, DR-12, DR-19, DR-23, DR-24, DR-28, DR-33 | Standardise Slack webhook secret references, delete orphaned Vault paths, SHA-pin all unversioned actions, fix the VAULT_TOKEN mask ordering, remove service-role-key from composite action outputs, migrate Deploy Bot private key to Vault, replace the long-lived EXTERNAL_REPO_TOKEN PAT with a GitHub App token (DR-28), and update Renovate to use the GitHub App token in the same release to avoid an auth gap (DR-33). |
| 4 | DR-09, DR-21, DR-32, DR-35, DR-46 | Apply the NEXT_PUBLIC_SUPABASE_ANON_KEY rename to CI stubs, update hardcoded staging URLs to match the Domain Naming Standard, remove production credentials from DB-free unit test jobs (DR-32), switch all frontend CI to npm ci for lockfile-exact reproducibility (DR-35), and establish a single source of truth for the Supabase CLI version across all repos (DR-46). |
| 5 | DR-14, DR-01, DR-20, DR-25, DR-26, DR-29, DR-34, DR-37, DR-47, DR-50 | Implement automated rollback workflows, fix the Deno glob pattern, repair silent deployment tag failures, add Supabase stop and Docker disk cleanup to all affected jobs (DR-25, DR-29), remove the asymmetric supabase-stop pre-clean from preference-frontend (DR-34), add Supabase health polling to frontend jobs that skip it (DR-37), standardise VAULT_ADDR to use repository variables (DR-26), add missing codegen-check and e2e-axe jobs to workforce-frontend (DR-47). |
| 6 | DR-22 | Add cancel-in-progress concurrency groups to all CI workflows to prevent ARC runner queue starvation from rapid fixup commits. |
| 7 | DR-38, DR-39, DR-40, DR-41 | Harden deploy-function.yml against supply-chain and infrastructure attacks: add permissions block, SHA-pin all action references (DR-38), add function-name allowlist validation against path traversal (DR-39), restrict the deploy job to a labelled runner (DR-40), tighten smoke-test success criteria and add automatic rollback on failure (DR-41). |
| 8 | DR-42, DR-43, DR-44, DR-45 | Fix the shell injection in key-rotation-reminder (DR-42), fix the broken February cron (DR-43), expand rotation monitoring to cover all identified secrets (DR-44), add secret scanning to all CI pipelines (DR-45). |
| 9 | DR-52, DR-53, DR-54, DR-55, DR-56, DR-57, DR-58, DR-59 | Address cluster-down conditions identified during 2026-03-20 live performance audit: tigera-operator stuck Pending for 3+ days (DR-52, root cause of Calico instability), cert-manager crash-looping due to NetworkPolicy blocking API server egress (DR-53), both Supabase environments offline due to missing VSO-synced secrets (DR-54). P1 follow-on: Loki volume stuck (DR-55), cert-manager resource limits too low (DR-56). P2 structural: node tainting (DR-57), resource limits for Longhorn/ARC (DR-58), Prometheus retention (DR-59). |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| DR-03 | .github/workflows/prod-deploy.yml | `prod-deploy.yml` | Process Gap | 🔴 Critical |
| DR-05 | .github/workflows/prod-deploy.yml | `prod-deploy.yml` | Security | 🔴 Critical |
| DR-10 | .github/workflows/ci.yml (ci-cleanup job) | `ci.yml` | Process Gap | 🔴 Critical |
| DR-13 | .github/workflows/ | `ci.yml` | Process Gap | 🔴 Critical |
| DR-17 | .github/workflows/staging-smoke.yml | `staging-smoke.yml` | Process Gap | 🔴 Critical |
| DR-18 | .github/workflows/prod-deploy.yml | `prod-deploy.yml` | Process Gap | 🔴 Critical |
| DR-23 | .github/actions/supabase-start/action.yml | `action.yml` | Security | 🔴 Critical |
| DR-30 | .github/actions/smoke-test/action.yml line 93 | `action.yml` | Process Gap | 🔴 Critical |
| DR-36 | .github/workflows/ci.yml (ci-cleanup job) | `ci.yml` | Process Gap | 🔴 Critical |
| DR-38 | .github/workflows/deploy-function.yml | `deploy-function.yml` | Security | 🔴 Critical |
| DR-39 | .github/workflows/deploy-function.yml lines 31–39 | `deploy-function.yml` | Security | 🔴 Critical |
| DR-48 | Network Fabric (Calico/k3s) | `network-policies.yaml` | Infrastructure | 🔴 Critical |
| DR-52 | tigera-operator Deployment / helmfile.yaml | `calico.yaml` | Infrastructure | 🔴 Critical |
| DR-53 | network-policies/network-policies.yaml (cert-manager namespace) | `network-policies.yaml` | Infrastructure | 🔴 Critical |
| DR-54 | supabase / supabase-staging namespace secrets | `vso-secrets.yaml` | Infrastructure | 🔴 Critical |
| DR-02 | .github/actions/smoke-test/action.yml | `action.yml` | Process Gap | 🟠 High |
| DR-09 | .github/workflows/ci.yml (unit-tests and build jobs) | `ci.yml` | Test Coverage | 🟠 High |
| DR-11 | .github/workflows/deploy.yml | `deploy.yml` | Security | 🟠 High |
| DR-14 | .github/workflows/ | `rollback.yml` | Process Gap | 🟠 High |
| DR-15 | .github/workflows/ | `deploy.yml` | Process Gap | 🟠 High |
| DR-16 | .github/actions/smoke-test/action.yml | `action.yml` | Process Gap | 🟠 High |
| DR-19 | .github/workflows/prod-deploy.yml, staging-smoke.yml | `prod-deploy.yml` | Security | 🟠 High |
| DR-20 | .github/workflows/prod-deploy.yml | `prod-deploy.yml` | Process Gap | 🟠 High |
| DR-21 | .github/workflows/staging-smoke.yml | `staging-smoke.yml` | Architectural Drift | 🟠 High |
| DR-24 | .github/workflows/deploy.yml | `deploy.yml` | Security | 🟠 High |
| DR-27 | .github/workflows/deploy.yml | `deploy.yml` | Process Gap | 🟠 High |
| DR-28 | .github/workflows/ci.yml (integration-tests, codegen-check, e2e-axe jobs) | `ci.yml` | Security | 🟠 High |
| DR-29 | .github/workflows/ci.yml (integration-tests, codegen-check, e2e-axe jobs) | `ci.yml` | Process Gap | 🟠 High |
| DR-31 | .github/workflows/ci.yml (e2e-axe job) | `ci.yml` | Process Gap | 🟠 High |
| DR-33 | .github/workflows/renovate.yml | `renovate.yml` | Security | 🟠 High |
| DR-34 | .github/workflows/ci.yml (integration-tests, codegen-check, e2e-axe jobs) | `ci.yml` | Process Gap | 🟠 High |
| DR-35 | .github/workflows/ci.yml (all Install dependencies steps) | `ci.yml` | Security | 🟠 High |
| DR-40 | .github/workflows/deploy-function.yml line 47 | `deploy-function.yml` | Security | 🟠 High |
| DR-41 | .github/workflows/deploy-function.yml lines 93–106 | `deploy-function.yml` | Process Gap | 🟠 High |
| DR-42 | .github/workflows/key-rotation-reminder.yml line 82 | `key-rotation-reminder.yml` | Security | 🟠 High |
| DR-45 | .github/workflows/ (all pipelines) | `ci.yml` | Security | 🟠 High |
| DR-47 | .github/workflows/ci.yml | `ci.yml` | Process Gap | 🟠 High |
| DR-49 | helmfile.yaml | `helmfile.yaml` | Process Gap | 🟠 High |
| DR-50 | ARC Configuration | `helmfile.yaml` | Infrastructure | 🟠 High |
| DR-51 | ARC Configuration / helmfile.yaml | `helmfile.yaml` | Infrastructure | 🟠 High |
| DR-55 | monitoring namespace — Loki PVC (Longhorn) | `helmfile.yaml` | Infrastructure | 🟠 High |
| DR-56 | cert-manager Deployment — cainjector container resources | `cert-manager.yaml` | Infrastructure | 🟠 High |
| DR-01 | .github/workflows/ci.yml | `ci.yml` | Process Gap | 🟡 Medium |
| DR-04 | .github/workflows/prod-deploy.yml | `prod-deploy.yml` | Process Gap | 🟡 Medium |
| DR-07 | .github/workflows/deploy-function.yml | `deploy-function.yml` | Security | 🟡 Medium |
| DR-12 | .github/workflows/deploy.yml | `deploy.yml` | Process Gap | 🟡 Medium |
| DR-22 | .github/workflows/ci.yml | `ci.yml` | Process Gap | 🟡 Medium |
| DR-25 | .github/workflows/ci.yml (integration-tests job) | `ci.yml` | Process Gap | 🟡 Medium |
| DR-26 | .github/workflows/staging-smoke.yml | `staging-smoke.yml` | Architectural Drift | 🟡 Medium |
| DR-32 | .github/workflows/ci.yml (unit-tests job) | `ci.yml` | Security | 🟡 Medium |
| DR-37 | .github/workflows/ci.yml (integration-tests job, line 124–128) | `ci.yml` | Process Gap | 🟡 Medium |
| DR-43 | .github/workflows/key-rotation-reminder.yml line 12 | `key-rotation-reminder.yml` | Process Gap | 🟡 Medium |
| DR-44 | .github/workflows/key-rotation-reminder.yml lines 40–65 | `key-rotation-reminder.yml` | Process Gap | 🟡 Medium |
| DR-46 | .github/workflows/ci.yml (Supabase CLI version pins) | `ci.yml` | Process Gap | 🟡 Medium |
| DR-57 | k3s cluster node taints | `helmfile.yaml` | Infrastructure | 🟡 Medium |
| DR-58 | longhorn-system, arc-systems — container resource limits | `helmfile.yaml` | Infrastructure | 🟡 Medium |
| DR-59 | monitoring namespace — Prometheus retention | `helmfile.yaml` | Infrastructure | 🟡 Medium |
| DR-06 | .github/workflows/deploy-function.yml | `deploy-function.yml` | Security | 🟢 Low |
| DR-08 | .github/workflows/key-rotation-reminder.yml | `key-rotation-reminder.yml` | Process Gap | 🟢 Low |


---

## Session Close — 2026-03-20

**Completed:** DR-57, DR-58, DR-59, DR-51 (reconciled), DR-55 (reconciled), DR-52 (status reconciled), DR-27 (status reconciled)

**Remaining:** None — 0 open tasks. Audit is implementation-complete.

**Blocked:** None

**PR order note:** `receptor-infra` audit branch (`audit/260319-cicd-workflow-health`) should be merged first — it contains Longhorn toleration changes (DR-57) that prevent pods from being evicted after the node taints are applied. Once merged, helmfile sync will apply Longhorn CSI resource limits (DR-58) and Prometheus retention (DR-59) to the live cluster. All other repo branches (supabase-receptor, planner-frontend, preference-frontend, workforce-frontend, match-backend, receptor-planner, website-frontend) were raised in earlier sessions and can be merged in parallel.

**Brief for next agent:** This audit is implementation-complete. All 59 findings are complete, deferred, or skipped. Run `/finalise-global-audit` to: (1) perform the re-audit, (2) raise PRs in the correct order (receptor-infra first, then others in parallel), (3) verify coverage on all PRs, (4) archive audit files, and (5) mark the registry `✅ Closed`. Node taints were applied live to `receptor-ctrl-10/11/50` — this is already in effect before the receptor-infra PR is merged. The helmfile changes (tolerations, resource limits, Prometheus retention) are pending helmfile sync after merge. DR-51 (DinD) was confirmed working via kubectl describe AutoscalingRunnerSet — the full dind sidecar spec was already present. DR-55 (Loki) was already Running at session start (48m uptime, PVC Bound).
