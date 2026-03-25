<!-- audit-slug: 260325-cicd-vault-drift -->

# Recommendations — CI/CD Vault Configuration Drift Ecosystem Audit

**Branch:** `audit/260325-cicd-vault-drift`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-25

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Vault access for live verification | kubectl exec into vault-0 pod is the only way to run vault commands. Listing JWT roles requires a root or privileged token (403 without auth). Live verification requires generating a root token via 3-of-5 recovery key shares. |
| vault-action path format | The correct pattern for hashicorp/vault-action@v3 with KV-v2 is logical path (secret/infrastructure/...) with kv-version: 2. The action internally appends /data/. Using secret/data/... without kv-version may produce double /data/data/ depending on auto-detection. |
| Agentic PE reference | The Microsoft GBB 'Agentic Platform Engineering' framework (cluster-doctor pattern, crawl-walk-run) is the reference architecture for the proposed overhaul. See https://github.com/microsoftgbb/agentic-platform-engineering |
| vault-action path format — verified | Both formats work: (1) secret/data/infrastructure/... WITHOUT kv-version passes path as-is to API — correct. (2) secret/infrastructure/... WITH kv-version: 2 — action internally appends /data/ — also correct. Error was using /data/ path WITH kv-version: 2 producing double /data/data/. Policies are written against REST API paths (secret/data/...). |
| Live Vault state verified | Live Vault interrogated 2026-03-25 using scoped write token. All roles, policies, secrets, and mounts catalogued. Replaces all prior speculation about Vault state. |


---

## 🔴 Critical

### VD-08: The ecosystem has no agent-readable infrastructure contracts. Vault roles, policies, and secret paths exist only on the 

Affects: `all-repos` — Agentic operability


- [x] Implement the 'Crawl' tier of agentic platform engineering: codify all Vault roles, policies, and secret contracts as declarative files in receptor-infra. Tasks VD-01-T1, VD-02-T2, VD-03-T1 are prerequisites.
      `DEPENDS — on VD-01-T1, VD-02-T2, VD-03-T1 completion`
      _(Completed: 2026-03-25T00:40:13Z)_
- [ ] Create .agents/infrastructure-contracts.md in receptor-infra — a single document that agents can read to understand the mapping between workflows (role, path, audience) and Vault configuration.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.agents/infrastructure-contracts.md`

### VD-12: secret/infrastructure/github-app-deploy-bot stored the WRONG GitHub App credentials. Both app_id (3095294 = k3s-vault) a

Affects: `receptor-infra` — Vault secret identity


- [x] Patch app_id from 3095294 (k3s-vault) to 3127975 (app-lifecycle-deployment) in Vault secret/infrastructure/github-app-deploy-bot.
      `MANUAL — vault kv patch on cluster`
      _(Completed: 2026-03-25T01:55:36Z)_
- [x] Replace private_key with deploy-bot's actual PEM (SHA256:FX8AJMF...) — verified fingerprint against GitHub App settings before writing.
      `MANUAL — vault kv patch on cluster`
      _(Completed: 2026-03-25T02:07:31Z)_
- [x] Verify fix by triggering planner-frontend deploy — all 3 jobs (Build, Update Infrastructure Manifest, Notify Slack) succeeded.
      `VERIFIED — run 23521492463`
      _(Completed: 2026-03-25T03:05:00Z)_

## 🟠 High

### VD-01: 1 of 7 expected JWT roles is missing: ci-website-frontend. The other 6 (ci-match-backend, ci-planner-frontend, ci-prefer

Affects: `receptor-infra` — Vault JWT roles


- [x] Create ci-website-frontend JWT role in Vault: bound_claims sub=repo:Common-Bond/website-frontend:*, token_policies=ci-website-frontend, token_ttl=900.
      `MANUAL — vault write auth/jwt/role/ci-website-frontend on cluster`
      _(Completed: 2026-03-25T00:40:12Z)_
- [x] Create ci-website-frontend policy: read access to secret/data/infrastructure/github-app-deploy-bot and its metadata.
      `MANUAL — vault policy write ci-website-frontend on cluster`
      _(Completed: 2026-03-25T00:40:12Z)_
- [x] Codify all 7 roles and policies as declarative files in receptor-infra/vault/roles/ and vault/policies/.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/vault/roles/`
      _(Completed: 2026-03-25T00:40:12Z)_

### VD-03: No declarative Vault role management exists. Vault roles/policies are created via ad-hoc SSH commands not captured in ve

Affects: `receptor-infra` — Vault role management


- [x] Create vault/bootstrap-jwt-roles.sh — an idempotent script that reads vault/roles/*.yaml and vault/policies/*.hcl and applies them to Vault. Must accept a VAULT_TOKEN parameter.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/vault/bootstrap-jwt-roles.sh`
      _(Completed: 2026-03-25T00:40:12Z)_

### VD-04: vault-action secrets path is inconsistent: preferencer-frontend uses logical path with kv-version: 2, all others use exp

Affects: `all-deploy-repos` — vault-action configuration


- [x] Standardise all 5 deploy workflows to use the logical path format (secret/infrastructure/...) with explicit kv-version: 2. This is the correct pattern per hashicorp/vault-action@v3 documentation.
      `ALL — deploy.yml in preferencer-frontend, planner-frontend, website-frontend, workforce-frontend, match-backend`
      _(Completed: 2026-03-25T00:40:12Z)_

### VD-06: The deploy workflow YAML is copy-pasted across 5 repositories with no shared reusable workflow. Each copy drifts indepen

Affects: `all-deploy-repos` — Workflow duplication


- [ ] Create a reusable workflow in receptor-infra (.github/workflows/deploy-gitops.yml) parameterised by app-name, image-repo, and manifest-path. All 5 repos call this via workflow_call.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/workflows/deploy-gitops.yml`
- [ ] Refactor all 5 deploy.yml files to call the reusable workflow instead of inlining the Vault + token + manifest update steps.
      `ALL — deploy.yml in all 5 repos (refactor to call reusable workflow)`

### VD-10: The 260319-cicd-workflow-health audit (Closed) produced findings DR-24/DR-15/DR-28 requiring Vault OIDC for deploy. Impl

Affects: `common-bond` — Audit regression


- [ ] Add a 'prerequisite infrastructure' section to the audit-document-standards skill: any finding that requires infrastructure provisioning (Vault roles, k8s CRDs, DNS records) must include a verification command in the task definition.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

### VD-11: ci-supabase-receptor policy references paths under 'infrastructure/' mount (e.g. infrastructure/data/supabase) which doe

Affects: `receptor-infra` — Vault policies


- [x] Fix ci-supabase-receptor policy: change 'infrastructure/data/supabase*' paths to 'secret/data/supabase/*' paths to match the actual KV mount.
      `MANUAL — vault policy write ci-supabase-receptor on cluster`
      _(Completed: 2026-03-25T00:40:13Z)_

## 🟡 Medium

### VD-02: Secret path secret/infrastructure/github-app-deploy-bot EXISTS in Vault KV with keys app_id and private_key. The issue i

Affects: `receptor-infra` — Vault KV secrets


- [x] Create vault/secrets/README.md in receptor-infra documenting the complete KV path tree (ci/, infrastructure/, supabase/) with field names and access policies.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/vault/secrets/README.md`
      _(Completed: 2026-03-25T00:40:12Z)_

### VD-05: preferencer-frontend fetches both private_key and app_id from Vault. The other 4 repos read DEPLOY_BOT_APP_ID from GitHu

Affects: `all-deploy-repos` — App ID source


- [x] Update all 4 remaining deploy workflows to fetch app_id from Vault instead of GitHub Secrets, matching the preferencer-frontend pattern.
      `ALL — deploy.yml in planner-frontend, website-frontend, workforce-frontend, match-backend`
      _(Completed: 2026-03-25T00:40:13Z)_

### VD-07: supabase status -o env output parsed with grep '^ANON_KEY=' fails when output contains ANSI codes, leading whitespace, o

Affects: `planner-frontend` — Supabase readiness


- [ ] Create a shared supabase-start composite action (or reusable script) that handles DinD readiness, supabase start, status polling with robust key extraction (strip ANSI, handle stderr), and GITHUB_ENV export. Use in all frontend CI workflows.
      `ALL — ci-resilience.yml in planner-frontend, preference-frontend, workforce-frontend`

## 🟢 Low

### VD-09: No pre-flight check validates a workflow's vault-action role, secrets path, and audience against documented Vault config

Affects: `all-deploy-repos` — CI contract validation


- [ ] Add a CI job in receptor-infra that scans org-wide deploy.yml files and validates vault-action parameters against vault/roles/ and vault/policies/ definitions. Depends on VD-01-T1 and VD-02-T2.
      `DEPENDS — on VD-01-T1 and VD-02-T2 completion`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | VD-01, VD-04, VD-11 | VD-01 creates the one missing JWT role, VD-04 standardises the path format, VD-11 fixes the broken supabase-receptor policy. All are direct blockers of CI. |
| 2 | VD-02, VD-05, VD-07 | Once deployments work, document the secret inventory, unify app_id source, and fix supabase readiness detection. |
| 3 | VD-03, VD-08 | Prevents future drift by making Vault configuration version-controlled and agent-readable. |
| 4 | VD-06, VD-09, VD-10 | Structural prevention: shared workflows eliminate copy-paste drift, CI contract validation catches errors before runtime, and hardened DoD prevents future audit regressions. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| VD-08 | Agentic operability | `DEPENDS — on VD-01-T1, VD-02-T2, VD-03-T1 completion` | Architectural Drift | 🔴 Critical |
| VD-12 | Vault secret identity | `MANUAL — vault kv patch on cluster` | Security | 🔴 Critical |
| VD-01 | Vault JWT roles | `ci-website-frontend on cluster` | Security | 🟠 High |
| VD-03 | Vault role management | `bootstrap-jwt-roles.sh` | Process Gap | 🟠 High |
| VD-04 | vault-action configuration | `ALL — deploy.yml in preferencer-frontend, planner-frontend, website-frontend, workforce-frontend, match-backend` | Architectural Drift | 🟠 High |
| VD-06 | Workflow duplication | `deploy-gitops.yml` | Process Gap | 🟠 High |
| VD-10 | Audit regression | `SKILL.md` | Process Gap | 🟠 High |
| VD-11 | Vault policies | `MANUAL — vault policy write ci-supabase-receptor on cluster` | Security | 🟠 High |
| VD-02 | Vault KV secrets | `README.md` | Security | 🟡 Medium |
| VD-05 | App ID source | `ALL — deploy.yml in planner-frontend, website-frontend, workforce-frontend, match-backend` | Architectural Drift | 🟡 Medium |
| VD-07 | Supabase readiness | `ALL — ci-resilience.yml in planner-frontend, preference-frontend, workforce-frontend` | Process Gap | 🟡 Medium |
| VD-09 | CI contract validation | `DEPENDS — on VD-01-T1 and VD-02-T2 completion` | Process Gap | 🟢 Low |

