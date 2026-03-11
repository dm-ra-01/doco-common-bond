<!-- audit-slug: 260312-cicd-environments -->

# Recommendations — CI/CD Infrastructure & Environment Architecture Audit

**Branch:** `audit/260312-cicd-environments`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-12

> [!NOTE]
> This file is **auto-generated** from `recommendations.json`.
> Do not edit it directly — edit the JSON source and re-run
> `python .agents/scripts/render-recommendations.py recommendations.json`.

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Environment infrastructure target | Self-hosted Supabase instances are the target — not Supabase Cloud Pro. setup.sh is the canonical provisioning script. Any new environments must extend it, not replace it. |
| Multi-tier hosting | All environment tiers (dev, test, staging, prod) will run on the same VM for now. Architecture must be modular to allow future migration to separate hosts. |
| Staging tunnel domain | Staging instance will be assigned the Cloudflare tunnel subdomain staging-api-829c83.commonbond.au. |
| Branch-matched ephemeral instance strategy | Two options to evaluate: (A) isolated Docker networks per branch using setup.sh --project-name receptor-ci-<branch> on a self-hosted runner; or (B) persistent staging with run-ID namespace prefix. Both should be documented as an ADR. Option A requires self-hosted runner co-location. A reverse proxy accepting feature-branch tags in the URL is also worth exploring. |
| CI runner type | All repos currently use GitHub-hosted ubuntu-latest runners. Installing a self-hosted runner on the VM is strongly recommended to unlock Docker daemon sharing and eliminate per-job 4-min Supabase cold boots. This is ARCH-03. |
| pg_cron cleanup | A pg_cron task should clean up stale __test_* orgs on the staging/test instance with a 24-hour TTL. |
| Key format migration | Supabase key format migration (JWT → sb_publishable_*/sb_secret_*) deadline was October 1 2025 (already passed). preference-frontend already exports dual keys. planner-frontend and workforce-frontend must be audited and fixed (KEY-01). |
| Kubernetes CI/CD infrastructure | The available Windows 11 Pro workstation (Intel i7-265KF 20-core, 32 GB DDR5, 1 TB NVMe, RTX 5080, Hyper-V) is the proposed host for a k3s Kubernetes cluster. This is the strategic long-term solution for all CI/CD and environment tier hosting (ARCH-04). |


---

## 🔴 Critical

### KEY-01: planner-frontend and workforce-frontend CI jobs do not export ANON_JWT (legacy JWT form of ANON_KEY). Any test calling s

Affects: `planner-frontend, workforce-frontend` — CI key handling


- [ ] Audit globalSetup.ts in planner-frontend for any signInWithPassword() calls and confirm whether ANON_JWT is required.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/__tests__/globalSetup.ts`
- [ ] Audit globalSetup.ts in workforce-frontend for any signInWithPassword() calls and confirm whether ANON_JWT is required.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/__tests__/globalSetup.ts`
- [ ] Add ANON_JWT export to planner-frontend ci.yml Start Supabase step, mirroring the preference-frontend pattern (grep '^ANON_KEY=' | sed + tr -d quotes).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
- [ ] Add ANON_JWT export to workforce-frontend ci.yml Start Supabase step, mirroring the preference-frontend pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`

## 🟠 High

### CICD-01: Each frontend repo independently boots Supabase 3 times per CI trigger (integration-tests, codegen-check, e2e-axe). Each

Affects: `preference-frontend, planner-frontend, workforce-frontend` — CI job structure


- [ ] Design a reusable CI job structure: a single 'supabase-boot' job that starts Supabase, extracts and caches keys, then is referenced as a service by all downstream jobs that depend on it.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
- [ ] Evaluate feasibility of installing a self-hosted GitHub Actions runner on the VM (14 GB RAM, 16 GB swap) to enable Docker daemon sharing, reducing per-boot time from ~4 min cold to ~30 sec warm sidecar start.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/vm-setup.md`
- [ ] Alternatively, establish a persistent Supabase staging instance that CI jobs hit without booting. Document the tradeoffs vs. per-boot ephemeral approach.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/supabase-self-hosted.md`

### CICD-02: All four repos that use supabase/setup-cli@v1 specify 'version: latest'. The Supabase CLI is unpinned, meaning any upstr

Affects: `preference-frontend, planner-frontend, workforce-frontend, supabase-receptor` — Supabase CLI version pinning


- [ ] Determine current Supabase CLI version in use and pin version: in all four ci.yml files to that specific version string (e.g. '2.x.y').
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`
- [ ] Add Renovate Bot configuration to auto-propose Supabase CLI version bumps as PRs, enabling controlled upgrades after human review.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/renovate.json`

### CICD-03: planner-frontend and workforce-frontend pass SUPABASE_SERVICE_ROLE_KEY from secrets.LOCAL_SUPABASE_SECRET_KEY — a static

Affects: `planner-frontend, workforce-frontend` — Service role key sourcing


- [ ] Update planner-frontend ci.yml Start Supabase step to extract SERVICE_ROLE_KEY from 'supabase status -o env' and export it as SUPABASE_SERVICE_ROLE_KEY, matching the preference-frontend pattern (grep '^SERVICE_ROLE_KEY=' | tr -d quotes).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
- [ ] Apply the same SERVICE_ROLE_KEY extraction fix to workforce-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
- [ ] Remove LOCAL_SUPABASE_SECRET_KEY from GitHub Secrets for planner-frontend and workforce-frontend once dynamic extraction is confirmed working.
      ``

### ARCH-01: No branch-matched ephemeral Supabase environment strategy exists. Every CI run cold-boots an independent instance. Two a

Affects: `cross-ecosystem` — Branch-matched ephemeral environments


- [ ] Document the two architectural options (A: Docker-network-per-branch on self-hosted runner; B: persistent staging with run-ID namespacing) in a new ADR at docs/infrastructure/environment/cicd-architecture.md in supabase-receptor.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/cicd-architecture.md`
- [ ] If Option A chosen: extend setup.sh with a --ci flag that (1) skips interactive prompts, (2) accepts project-name as the Docker network/compose project, and (3) adds a --teardown flag for post-run cleanup. No external tunnel required for CI-internal access.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/utils/setup.sh`
- [ ] If Option B chosen: implement a pg_cron job on the staging instance that deletes orgs, users, and associated data where org_name LIKE '__test_%' AND created_at < NOW() - INTERVAL '24 hours'.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/schemas/operations/test_cleanup.sql`

### ARCH-02: setup.sh has no CI-native invocation mode. Calling it from CI requires interactive prompts for staging/prod tiers (read 

Affects: `supabase-receptor` — CI-native provisioning


- [ ] Add --ci flag to setup.sh that skips all interactive read prompts, fails loudly if required env vars are unset, and exits 0 only when the instance is confirmed healthy (docker compose ps check).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/utils/setup.sh`
- [ ] Add --teardown flag to RESET_setup.sh (or create a new teardown.sh) that is fully non-interactive, suitable for CI post-run cleanup.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/utils/RESET_setup.sh`

### ARCH-03: All frontend repos use GitHub-hosted ubuntu-latest runners. This prevents Docker daemon sharing and makes branch-matched

Affects: `cross-ecosystem` — CI runner strategy


- [ ] Evaluate self-hosted runner installation on the VM (14 GB RAM, 16 GB swap). Document memory requirements: a single Supabase stack uses ~3-4 GB, so the VM can support 2-3 concurrent branch test instances. Add this analysis to cicd-architecture.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/cicd-architecture.md`
- [ ] If self-hosted runner is approved: install GitHub Actions runner on VM, configure as runs-on: [self-hosted, linux], and update all three frontend ci.yml files.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/vm-setup.md`

### ENV-01: Only a single dev environment is documented and instantiated. No test, staging, or prod tier is described, deployed, or 

Affects: `supabase-receptor` — Environment tier documentation


- [ ] Write docs/infrastructure/environment/environment-tiers.md defining the 4 tiers: dev (local), test (ephemeral CI), staging (persistent, staging-api-829c83.commonbond.au), and prod (api.commonbond.au). Include provisioning command, Cloudflare tunnel config, and data residency for each.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/environment-tiers.md`
- [ ] Provision the staging environment using setup.sh --env staging --project-name receptor-staging. Configure Cloudflare tunnel to staging-api-829c83.commonbond.au.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/setup.conf.example`

### ARCH-04: A k3s Kubernetes cluster on the available Windows 11 Pro machine (Intel i7-265KF 20-core, 32 GB DDR5, 1 TB NVMe, Hyper-V

Affects: `cross-ecosystem` — Kubernetes cluster infrastructure


- [ ] Design the k3s cluster topology: 3 Hyper-V VMs (control plane: 4 cores/6 GB, worker-1: 6 cores/10 GB for persistent envs, worker-2: 6 cores/10 GB for ephemeral branch CI). Document in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
- [ ] Provision a k3s cluster on the Windows 11 Pro machine using Hyper-V VMs running Ubuntu Server 24.04 LTS. Install k3s on the control plane and join the two worker nodes.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/vm-setup.md`
- [ ] Deploy Supabase to the k3s cluster using the community Helm chart (https://github.com/supabase-community/supabase-kubernetes). Create namespaces: supabase-dev, supabase-staging, supabase-prod with separate PVCs per namespace.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
- [ ] Configure Traefik ingress rules to route <branch-slug>.ci.commonbond.local to the corresponding supabase-ci-<branch-slug> namespace. This replaces the port-juggling / Docker network isolation approach.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
- [ ] Install a GitHub Actions self-hosted runner as a Deployment in the control-plane namespace. Update all frontend ci.yml files to use runs-on: [self-hosted, linux, k3s] for Supabase-dependent jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`

## 🟡 Medium

### CGEN-01: planner-frontend ci.yml:180 uses 'npx graphql-codegen --config codegen.check.ts --check'. The --check flag performs in-m

Affects: `planner-frontend` — GraphQL codegen CI gate


- [ ] Replace '--check' with 'npm run codegen && git diff --exit-code' in planner-frontend codegen-check step, mirroring preference-frontend pattern. Add the specific error message annotation for developer guidance.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`

### CGEN-02: workforce-frontend ci.yml:172 has the same --check defect as CGEN-01. Should be standardised to the regenerate + git dif

Affects: `workforce-frontend` — GraphQL codegen CI gate


- [ ] Replace '--check' with 'npm run codegen && git diff --exit-code' in workforce-frontend codegen-check step.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`

### CICD-04: supabase-receptor ci.yml runs 'supabase start --ignore-health-check' with no --workdir flag. The working directory is as

Affects: `supabase-receptor` — supabase-receptor CI robustness


- [ ] Add '--workdir supabase/' to the supabase start and supabase test db commands in supabase-receptor ci.yml to make the working directory explicit and refactor-safe.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`

### KEY-02: key-management.md references 'ANON_KEY' and 'SERVICE_ROLE_KEY' as the canonical keys to retrieve via 'npx supabase statu

Affects: `supabase-receptor` — Key management documentation


- [ ] Update key-management.md to reflect the new publishable key format: document PUBLISHABLE_KEY (sb_publishable_*) for REST/GraphQL client use, ANON_KEY (JWT, eyJ...) for signInWithPassword auth calls, and SERVICE_ROLE_KEY for server-side operations. Add a warning about the October 2025 migration deadline.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/security/key-management.md`

### ENV-02: setup.conf.example only contains localhost URLs. There are no template placeholders or commented sections for test (e.g.

Affects: `supabase-receptor` — Environment configuration templates


- [ ] Create setup.conf.staging.example and setup.conf.prod.example with correct public URLs, tunnel tokens (redacted), and non-localhost settings for each tier.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/setup.conf.example`

### ENV-03: RESET_setup.sh uses 'read -p' interactive confirmation at line 55. This prevents it from being called by a CI runner or 

Affects: `supabase-receptor` — Non-interactive teardown


- [ ] Add --force flag to RESET_setup.sh that skips the 'Are you sure?' prompt. Gate it behind a guard: if TARGET_ENV is staging or prod, require --force to be explicitly passed (refuse to teardown prod without explicit flag).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/utils/RESET_setup.sh`

### ENV-04: No pg_cron job exists to purge stale test organisations (__test_* naming convention) from the shared staging/test instan

Affects: `supabase-receptor` — Test data cleanup


- [ ] Create supabase/schemas/operations/test_cleanup.sql: a pg_cron job that deletes organisations WHERE name LIKE '__test_%' AND created_at < NOW() - INTERVAL '24 hours', cascading to related user_orgs, job_lines, etc. via FK constraints.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/schemas/operations/test_cleanup.sql`
- [ ] Document the __test_{run-id} namespacing convention in the testing guide and require all integration test setup code to prefix created orgs with this pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/operations/testing-guide.md`

### ISO-01: All three frontend repos share the same TEST_ADMIN_EMAIL / TEST_WORKER_EMAIL GitHub Secrets with no run-ID namespace pre

Affects: `preference-frontend, planner-frontend, workforce-frontend` — Test data isolation


- [ ] Define and document a __test_{GITHUB_RUN_ID} org naming convention. Update all three frontend repos' globalSetup to create test orgs using this prefix, and teardown in globalTeardown.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/__tests__/globalSetup.ts`

### ISO-02: seed_acacia.sql and test_user_credentials.json configure a single shared 'Acacia Enterprises' org. There is no mechanism

Affects: `supabase-receptor` — Seed data isolation


- [ ] Refactor seed.sql to seed a minimal base dataset only (no named org). Move the Acacia Enterprises dataset to seed_acacia.sql as a developer-only convenience seed. Update documentation to reflect this separation.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/seed.sql`

### DOC-02: No runbook exists for promoting a change through dev → test → staging → prod. setup.sh supports the --env flag but there

Affects: `supabase-receptor` — Promotion runbook


- [ ] Write docs/operations/promotion-runbook.md describing the promotion workflow: (1) feature branch CI passes against ephemeral test instance, (2) merge to main triggers migration against staging, (3) manual approval gate for prod promotion, (4) rollback via RESET_setup.sh --env staging --force.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/promotion-runbook.md`

### BACK-01: match-backend integration tests (test_supabase_integration.py) are skipped in CI via pytest.mark.skipif when stub env va

Affects: `match-backend, receptor-planner` — Backend CI integration test coverage


- [ ] Add pytest path scoping to receptor-planner ci.yml: replace bare 'pytest' with 'pytest tests/unit/ -m unit' (or equivalent). Add a --co flag dryrun first to enumerate what's currently being collected.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/ci.yml`
- [ ] Add an integration-tests job to match-backend ci.yml that boots a Supabase instance (using supabase/setup-cli@v1) and runs pytest allocator/tests/integration/ with real Supabase credentials extracted from supabase status -o env.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/ci.yml`

### BACK-02: Both backend repos set SUPABASE_SERVICE_ROLE_KEY to a hardcoded decoded JWT placeholder string (eyJhbGciOiJIUzI1NiIsInR5

Affects: `match-backend, receptor-planner` — Hardcoded JWT placeholder in CI


- [ ] Replace the hardcoded JWT placeholder in both ci.yml files with a clearly non-JWT stub value such as 'stub-service-role-key-not-real' that will not trigger credential scanner heuristics.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/ci.yml`
- [ ] Apply the same stub replacement to receptor-planner ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/ci.yml`

## 🟢 Low

### DOC-01: key-management.md:86-88 has an open TODO block for integrating Bitwarden/Doppler CLI into the deployment workflow. This 

Affects: `supabase-receptor` — Secrets vault


- [ ] Either implement Doppler CLI integration in setup.sh (preferred — syncs across dev/test/staging/prod) or close the TODO by documenting a deliberate decision to use GitHub Secrets exclusively and update the key-management doc accordingly.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/security/key-management.md`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | KEY-01, CICD-03 | Fix the two security-class CI defects that can cause silent auth failures right now. These are safe to implement immediately — they only change CI variable sourcing. |
| 2 | CICD-02, CGEN-01, CGEN-02, CICD-04, BACK-01, BACK-02 | Pin Supabase CLI version across all repos, standardise the codegen gate to the git-diff pattern, fix receptor-planner bare pytest, and replace hardcoded JWT stubs. |
| 3 | ENV-01, ENV-02, KEY-02, DOC-02 | Provision staging, document all 4 environment tiers, write the promotion runbook, update key management docs. These are strategic prerequisites before implementing CI architecture changes. |
| 4 | ARCH-01, ARCH-02, ARCH-03, ISO-01, ISO-02, ENV-03, ENV-04 | Design and implement the branch-matched CI architecture (ADR + runner decision), add CI mode to setup.sh, implement test data isolation and pg_cron cleanup. |
| 5 | CICD-01, DOC-01 | Reduce Supabase boots per CI run once architecture decisions from phase 4 are finalised, and resolve the open secrets vault TODO. |
| 6 | ARCH-04 | Long-term strategic infrastructure investment. Deploy k3s on Windows 11 Pro Hyper-V, provision Supabase via Helm, configure Traefik ingress for branch-slug routing, and install the self-hosted runner. Structurally supersedes CICD-01, ARCH-01, ARCH-02, and ARCH-03. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| KEY-01 | CI key handling | `globalSetup.ts` | Security | 🔴 Critical |
| CICD-01 | CI job structure | `ci.yml` | Architectural Drift | 🟠 High |
| CICD-02 | Supabase CLI version pinning | `ci.yml` | Tech Debt | 🟠 High |
| CICD-03 | Service role key sourcing | `ci.yml` | Security | 🟠 High |
| ARCH-01 | Branch-matched ephemeral environments | `cicd-architecture.md` | Process Gap | 🟠 High |
| ARCH-02 | CI-native provisioning | `setup.sh` | Process Gap | 🟠 High |
| ARCH-03 | CI runner strategy | `cicd-architecture.md` | Process Gap | 🟠 High |
| ENV-01 | Environment tier documentation | `environment-tiers.md` | Documentation Gap | 🟠 High |
| ARCH-04 | Kubernetes cluster infrastructure | `kubernetes-cluster.md` | Strategic Opportunity | 🟠 High |
| CGEN-01 | GraphQL codegen CI gate | `ci.yml` | Architectural Drift | 🟡 Medium |
| CGEN-02 | GraphQL codegen CI gate | `ci.yml` | Architectural Drift | 🟡 Medium |
| CICD-04 | supabase-receptor CI robustness | `ci.yml` | Tech Debt | 🟡 Medium |
| KEY-02 | Key management documentation | `key-management.md` | Documentation Gap | 🟡 Medium |
| ENV-02 | Environment configuration templates | `setup.conf.example` | Process Gap | 🟡 Medium |
| ENV-03 | Non-interactive teardown | `RESET_setup.sh` | Process Gap | 🟡 Medium |
| ENV-04 | Test data cleanup | `test_cleanup.sql` | Process Gap | 🟡 Medium |
| ISO-01 | Test data isolation | `globalSetup.ts` | Process Gap | 🟡 Medium |
| ISO-02 | Seed data isolation | `seed.sql` | Process Gap | 🟡 Medium |
| DOC-02 | Promotion runbook | `promotion-runbook.md` | Documentation Gap | 🟡 Medium |
| BACK-01 | Backend CI integration test coverage | `ci.yml` | Process Gap | 🟡 Medium |
| BACK-02 | Hardcoded JWT placeholder in CI | `ci.yml` | Security | 🟡 Medium |
| DOC-01 | Secrets vault | `key-management.md` | Documentation Gap | 🟢 Low |

