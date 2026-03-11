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
| Kubernetes CI/CD infrastructure | The available Windows 11 Pro workstation (Intel i7-265KF 20-core, 32 GB DDR5, 1 TB NVMe, RTX 5080, Hyper-V) is the proposed host for a k3s Kubernetes cluster. This is the strategic long-term solution for all CI/CD and environment tier hosting (ARCH-04). ARCH-04 + DOC-03 are the top implementation priority for this audit. |
| ISO SoA compliance tracking | When SEC-01, SEC-02, ENV-05, ISO-03, and ARCH-04 are implemented, the corresponding ISO 27001 SoA entries (8.3, 8.8, 8.32, 7.1-7.4, and 8.31) must be updated in docs/compliance/iso27001/operations/soa.md and the Supabase governance registers. Each relevant finding has a dedicated compliance-update task. |
| ADR storage strategy | ADRs are stored as markdown files in docs/adr/ within supabase-receptor (ARCH-05-T1). As an interim index, each ADR is registered in the Supabase 'standards' table with document_type='ADR'. A dedicated 'architecture_decisions' Supabase table is a future TODO (ARCH-05-T2). The 'registers' table is not appropriate — it tracks meta governance objects (risk register, asset register), not individual records. |
| Branch protection timing | Branch protection on main (SEC-03) is intentionally deferred to Phase 10 (the final task). Fast iteration is the current priority. SEC-03 will be enabled only after Phases 1-9 CI fixes are complete and stable. PROC-01 (required check matrix) is a prerequisite for SEC-03. |
| Secrets management strategy | HashiCorp Vault OSS deployed on k3s as a Helm chart is the target solution (DOC-01). Architecture: GitHub Actions authenticates via OIDC (no long-lived secrets stored in GitHub Secrets); Vault's database secrets engine issues dynamic short-lived Postgres credentials per CI run; Vault Secrets Operator (VSO) injects secrets into k3s pods via CRDs; KV v2 stores static API keys (Cloudflare, Supabase publishable keys). This eliminates KEY-01 and ENV-06 risks structurally. Vault is added to the k3s provisioning task (ARCH-04). |
| Production backup strategy | Automated daily Postgres backups stream to Cloudflare R2 via rclone (ENV-08). Retention: 30-day daily, 12-month weekly. RTO: 4 hours, RPO: 24 hours. Backup script at scripts/backup-prod.sh. Restore procedure in docs/infrastructure/disaster-recovery.md. ISO 27001 A.8.13 compliance task in ENV-08-T3. |
| Kubernetes CNI and network policy | k3s will use Calico CNI (ARCH-08) instead of the default Flannel, installed via Tigera Operator Helm chart with --flannel-backend=none. NetworkPolicies isolate supabase, vault, monitoring, and ci-runner namespaces. Documented in ADR-005. |


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

### SEC-03: No branch protection rules exist on main in any repository, allowing direct pushes that bypass CI checks entirely. Defer

Affects: `cross-ecosystem` — Branch protection on main


- [ ] Enable branch protection on main across all 6 repositories once CI is stable: require PR, require all CI status checks to pass, require at least 1 approval, disallow force pushes and deletions. Use GitHub repository rulesets for cross-org consistency.
      ``

### ENV-07: The staging domain staging-api-829c83.commonbond.au has been assigned but no Cloudflare Tunnel is provisioned or documen

Affects: `supabase-receptor` — Cloudflare Tunnel for staging ingress


- [ ] Provision a named Cloudflare Tunnel for the staging Supabase instance: 'cloudflare tunnel create receptor-staging'. Create a tunnel config at ~/.cloudflared/config.yml routing staging-api-829c83.commonbond.au to localhost:54321 (Supabase Kong API). Run 'cloudflare tunnel route dns' and document the full provisioning procedure in docs/infrastructure/environment/staging.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/staging.md`
- [ ] Add cloudflared as a systemd service (or k3s DaemonSet once cluster is running) so the tunnel survives reboots. Document the start/stop/restart procedure and add a health check to the staging environment runbook.
      ``

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

### SEC-01: No frontend or backend ci.yml file includes a top-level 'permissions:' block. Without explicit permissions, workflows in

Affects: `cross-ecosystem` — GitHub Actions permissions


- [ ] Add 'permissions: contents: read' at the top level of all 5 frontend/backend ci.yml files, then add specific write grants only where needed (e.g. pull-requests: write for PR comment steps if added in future).
      ``
- [ ] Update SoA control 8.3 (Information access restriction) in docs/compliance/iso27001/operations/soa.md from 'Implemented' to reflect that GitHub Actions GITHUB_TOKEN now also enforces least-privilege via explicit permissions blocks. Update implementation notes to reference this audit finding.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`

### SEC-02: All CI files reference third-party Actions by tag (e.g. 'actions/checkout@v4', 'supabase/setup-cli@v1') rather than by c

Affects: `cross-ecosystem` — Third-party Action version pinning


- [ ] Pin all third-party GitHub Actions to their full commit SHA (e.g. actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2). Configure Renovate Bot to auto-propose SHA bumps when new versions release.
      ``
- [ ] Update SoA control 8.8 (Management of technical vulnerabilities) in docs/compliance/iso27001/operations/soa.md. Current status is 'Partial — Dependabot enabled; no formal vulnerability disclosure policy'. Add a note that CI Action SHA pinning + Renovate Bot extends supply-chain vulnerability management to the build toolchain.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`

### CICD-05: No ci.yml file in the ecosystem specifies a 'timeout-minutes:' on any job. If a Supabase boot hangs (a known failure mod

Affects: `cross-ecosystem` — CI job timeout configuration


- [ ] Add 'timeout-minutes: 20' to all Supabase-dependent jobs and 'timeout-minutes: 10' to pure unit/lint jobs across all 5 ci.yml files. Set a per-workflow timeout-minutes of 30 as a backstop.
      ``

### ENV-05: No migration gate exists to prevent unreviewed schema changes from reaching the production Supabase instance. setup.sh a

Affects: `supabase-receptor` — Production database change gate


- [ ] Add a GitHub Actions workflow 'prod-deploy.yml' that triggers manually (workflow_dispatch) or on tag push to 'release/*'. The workflow runs 'supabase db diff --schema public' against prod, posts the diff as a workflow artifact for human review, and requires manual approval (GitHub Environment protection rule) before running 'supabase db push'.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/prod-deploy.yml`
- [ ] Update SoA control 8.32 (Change management) in docs/compliance/iso27001/operations/soa.md from 'Implemented — all ISMS document changes via Git PR workflow; infrastructure changes reviewed informally' to 'Implemented' once prod-deploy.yml is active with GitHub Environment protection. Update the implementation notes to cite the prod-deploy.yml workflow as the production DB change gate.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`
- [ ] Update Supabase audits table via REST API upsert to note that ENV-05 (production migration gate) addresses ISO 27001 A.8.32. This is a documentation-only update to the governance register — no schema change required.
      ``

### ARCH-05: No ADR (Architecture Decision Record) process exists. Major infrastructure choices (k3s vs Docker Compose, self-hosted v

Affects: `supabase-receptor` — Architecture Decision Records


- [ ] Create docs/adr/ directory in supabase-receptor. Write ADR-001 (k3s cluster selection rationale over Docker Compose/Swarm/Nomad), ADR-002 (self-hosted runner vs GitHub-hosted), ADR-003 (Docker network isolation vs k8s namespace isolation). Use standard ADR template: Context, Decision, Consequences.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/README.md`
- [ ] TODO (deferred): Create a dedicated 'architecture_decisions' table in supabase-common-bond Supabase instance for queryable ADR indexing. Until then, register each ADR as an entry in the 'standards' table with document_type='ADR', domain='Infrastructure', issuing_body='Engineering Team', and location pointing to the git file path. Current 'standards' schema has title/document_type/domain/scope/issuing_body/effective_date/status/location fields which accommodate ADR index entries adequately.
      ``

### CICD-06: Dependabot is active for npm/pip dependencies but no .github/dependabot.yml entry exists for the 'github-actions' ecosys

Affects: `cross-ecosystem` — Dependabot for GitHub Actions ecosystem


- [ ] Add a 'package-ecosystem: github-actions' block to each repo's .github/dependabot.yml (or create the file if absent), with update-schedule: weekly and target-branch: main. Ensure Renovate Bot and Dependabot are not duplicating the same bump — prefer Renovate if already configured for the repo.
      ``

### ISO-03: The SoA currently marks ISO 27001 controls 7.1-7.4 (physical security perimeters, physical entry, securing offices/facil

Affects: `supabase-receptor` — Physical security scope change from k3s bare-metal node


- [ ] Review SoA controls 7.1, 7.2, 7.3, and 7.4 for applicability once the k3s node is provisioned. At minimum, document compensating physical controls: machine location (locked room or secured area), screen lock policy, cable lock, OS-level full disk encryption (BitLocker), and access restriction. Update the SoA exclusion block in docs/compliance/iso27001/operations/soa.md to reflect any newly applicable controls.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`

### ENV-06: SUPABASE_SECRET_KEY and CI GitHub Secrets have no documented rotation cadence. The KEY-01 key format migration is the ri

Affects: `supabase-receptor` — Secrets rotation schedule


- [ ] Add a rotation schedule table to docs/infrastructure/security/key-management.md: service_role key (180-day), anon/publishable test key (90-day), staging keys (90-day). Document the rotation procedure: 1) generate new key in Supabase dashboard, 2) update GitHub Secret via 'gh secret set', 3) update dev-environment/.env, 4) verify CI passes.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/security/key-management.md`
- [ ] Create a GitHub Actions scheduled workflow '.github/workflows/key-rotation-reminder.yml' that runs on the first of each month and posts a Slack/email notification if any key is within 14 days of its rotation due date. Due dates are stored as GitHub Actions variables (not secrets) so they can be read without elevation.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/key-rotation-reminder.yml`

### PROC-01: No repository has a documented list of which CI jobs constitute a required 'definition of done' for a passing build. Eve

Affects: `cross-ecosystem` — CI required status checks definition


- [ ] Document the required status check matrix per repo in docs/operations/ci-required-checks.md: for each of the 6 repos, list the exact GitHub Actions job names that must pass before merge (e.g. 'test', 'lint', 'codegen-gate', 'build'). This document is consumed by the branch protection ruleset setup in SEC-03-T1.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/ci-required-checks.md`

### ARCH-06: Each CI job pulls fresh Docker images for the Supabase stack (postgres, studio, storage, auth, realtime, edge-runtime) o

Affects: `supabase-receptor` — Container image pull-through cache on k3s node


- [ ] Deploy a local container registry on the k3s node as a pull-through cache for Docker Hub using the distribution/distribution Helm chart or the built-in k3s containerd mirror config (~/.rancher/k3s/registries.yaml). Configure the self-hosted runner to use this registry. Document the configuration in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`

### SEC-04: The self-hosted Supabase stack pulls Docker images by tag (e.g. supabase/postgres:15.1.0.117) without digest pinning or 

Affects: `supabase-receptor` — Docker image provenance and digest pinning


- [ ] Audit all Docker image references in docker-compose.yml (and any k3s manifests) and pin each to its immutable digest: 'image: supabase/postgres:15.1.0.117@sha256:<digest>'. Add a comment with the tag for readability. Write a Makefile or script target 'make verify-images' that runs 'docker manifest inspect' to confirm digests match expected values.
      ``
- [ ] Add an ADR (ADR-004) documenting the image pinning decision: why SHA pinning is used, the digest rotation procedure when upstream images update, and the Cosign verification strategy for images that support it. Record in the Supabase 'standards' table with document_type='ADR'.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/adr-004-docker-image-pinning.md`

### ARCH-07: The k3s cluster has no observability stack. When Supabase or a CI job fails on the cluster there is no visibility into w

Affects: `supabase-receptor` — Observability stack (metrics, logs, traces)


- [ ] Deploy the kube-prometheus-stack Helm chart (Prometheus + Grafana + Alertmanager) and Loki + Promtail into a dedicated 'monitoring' namespace on the k3s cluster. Configure Grafana dashboards for: Supabase pod health, CI job duration/failure rate, Vault secret access rate, and k3s node resource utilisation. Document in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
- [ ] Update SoA control 8.16 (Monitoring activities) in docs/compliance/iso27001/operations/soa.md to reflect that infrastructure monitoring is now implemented via Prometheus/Grafana/Loki on the k3s cluster. Document the alert channels (Alertmanager → email/Slack) and the log retention policy (30-day online, archived to R2).
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`

### ENV-08: The production Supabase instance has no scheduled backup. Self-hosted Supabase relies on postgres WAL or pg_dump — neith

Affects: `supabase-receptor` — Automated Supabase production backup to Cloudflare R2


- [ ] Write a backup script (scripts/backup-prod.sh) that runs pg_dumpall against the production Postgres instance and streams the compressed dump to Cloudflare R2 using rclone (configured with a dedicated R2 access key scoped to the backup bucket). Schedule via cron: daily at 02:00 AEST, weekly full dump on Sunday.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/scripts/backup-prod.sh`
- [ ] Document the backup and restore procedure in docs/infrastructure/disaster-recovery.md: backup schedule (daily/weekly), R2 bucket name and retention policy (30 days daily, 12 months weekly), and the full restore procedure ('rclone copy r2:backups/<dump> ./ && pg_restore ...'). Define RTO target (4 hours) and RPO target (24 hours).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/disaster-recovery.md`
- [ ] Update SoA control 8.13 (Information backup) in docs/compliance/iso27001/operations/soa.md from 'Not implemented' to 'Implemented' once the R2 backup schedule is active. Document the backup schedule, retention policy, and last-tested restore date.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`

### SEC-05: Supabase Studio (port 54323 by default) is bound to all interfaces on the host and is not authenticated at the network l

Affects: `supabase-receptor` — Supabase Studio network exposure


- [ ] For staging and production Supabase instances: bind Studio to 127.0.0.1 only in docker-compose.yml ('127.0.0.1:54323:3000'). For k3s deployments, use a NetworkPolicy (ARCH-08) to restrict Studio pod egress to the Traefik ingress pod only, and place the Traefik route for Studio behind Cloudflare Access (Zero Trust) with a Google SSO policy.
      ``

### ARCH-08: k3s ships with Flannel CNI by default, which does not enforce NetworkPolicy objects. All pods can communicate freely wit

Affects: `supabase-receptor` — Calico CNI and Kubernetes NetworkPolicies


- [ ] Install k3s with '--flannel-backend=none --disable-network-policy' flags and deploy Calico via the Tigera Operator Helm chart. Verify NetworkPolicy enforcement with a test deny-all policy. Document the Calico installation in ADR-005 and in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/adr-005-calico-cni.md`
- [ ] Write NetworkPolicy manifests for each namespace: (1) supabase: allow ingress from traefik and ci-runner, deny all other; (2) vault: allow ingress from supabase and ci-runner on port 8200 only; (3) monitoring: allow ingress from all namespaces on scrape ports (9090, 3100), deny egress to prod data; (4) ci-runner: allow egress to supabase and vault only. Store manifests in k3s/network-policies/.
      ``

## 🟢 Low

### DOC-01: key-management.md:86-88 has an open TODO block for integrating Bitwarden/Doppler CLI into the deployment workflow. This 

Affects: `supabase-receptor` — Secrets vault


- [ ] Either implement Doppler CLI integration in setup.sh (preferred — syncs across dev/test/staging/prod) or close the TODO by documenting a deliberate decision to use GitHub Secrets exclusively and update the key-management doc accordingly.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/security/key-management.md`

### DOC-03: The ARCH-04 finding identifies a k3s Kubernetes cluster as the strategic infrastructure target, but no documentation exi

Affects: `supabase-receptor` — Kubernetes cluster runbook


- [ ] Write docs/infrastructure/environment/kubernetes-cluster.md covering: cluster topology, VM provisioning steps (Hyper-V + Ubuntu Server 24.04 LTS), k3s installation commands, Helm chart deployment for Supabase, Traefik ingress rules for branch-slug routing, cert-manager DNS-01 challenge config, and disaster recovery procedure.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`

### DOC-04: The three known CI failure modes (Supabase boot hang, sb_publishable_*/JWT key incompatibility, Supabase CLI codegen fal

Affects: `supabase-receptor` — CI troubleshooting runbook


- [ ] Write docs/operations/ci-troubleshooting.md with the following sections: (1) Boot hang — signature: step 'Supabase Start' hangs beyond 4 min, fix: add --ignore-health-check flag and timeout-minutes to job; (2) Key format mismatch — signature: auth.signInWithPassword returns 400 in CI only, fix: check dual-key export in ci.yml globalSetup; (3) Codegen false positive — signature: 'GraphQL schema has changed' in CI but not locally, fix: pin supabase-cli version, don't use latest.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/ci-troubleshooting.md`

### DOC-05: The k3s node is a single point of failure. If the Windows 11 Pro machine fails, recovery time and procedure are undefine

Affects: `supabase-receptor` — Disaster recovery plan


- [ ] Write docs/infrastructure/disaster-recovery.md covering: (1) RTO target (4 hours) and RPO target (24 hours); (2) what data lives where — Supabase Postgres volumes (R2 backup via ENV-08), Vault unseal keys and root token (secure offline storage), k3s etcd snapshot (rke2-etcd-snapshots); (3) step-by-step recovery for each component in priority order; (4) contact list for who to notify during an incident. Test the DR procedure quarterly.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/disaster-recovery.md`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | ARCH-04, DOC-03, ARCH-05, ENV-07, ARCH-07, ARCH-08 | User-designated top priority. Provision k3s on Hyper-V, deploy HashiCorp Vault OSS (Helm), configure GitHub OIDC federation, write cluster runbook and ADRs. Write Cloudflare Tunnel config for staging ingress (ENV-07). Structurally resolves CICD-01, ARCH-01, ARCH-02, ARCH-03 and eliminates GitHub Secrets dependency long-term. Deploy Calico CNI for network policy enforcement and kube-prometheus-stack for observability. |
| 2 | KEY-01, CICD-03 | Fix the two security-class CI defects causing silent auth failures. Safe to implement immediately in parallel with Phase 1 planning. |
| 3 | CICD-02, CGEN-01, CGEN-02, CICD-04, CICD-05, BACK-01, BACK-02, DOC-04 | Pin Supabase CLI, standardise codegen gate, fix receptor-planner pytest, replace hardcoded JWT stubs, add job timeouts, and write the CI troubleshooting runbook documenting the three known failure modes. |
| 4 | SEC-01, SEC-02, CICD-06, SEC-04, SEC-05 | Add GITHUB_TOKEN permission blocks, pin Actions to commit SHAs, configure Dependabot for github-actions ecosystem, and pin Docker image digests. Update SoA controls 8.3 and 8.8 upon completion. Restrict Supabase Studio network binding and place behind Cloudflare Access on k3s. |
| 5 | ENV-01, ENV-02, KEY-02, DOC-02, ENV-06, ARCH-06, ENV-08, DOC-05 | Provision staging, document all 4 environment tiers, write the promotion runbook, update key management docs and rotation schedule. Configure pull-through container registry cache on the k3s node. Set up automated Cloudflare R2 backups for production Postgres and write the disaster recovery plan. |
| 6 | ARCH-01, ARCH-02, ARCH-03, ISO-01, ISO-02, ENV-03, ENV-04 | Design and implement branch-matched CI architecture (ADR + runner decision), add CI mode to setup.sh, implement test data isolation and pg_cron cleanup. May be superseded by Phase 1 k8s namespace-per-branch approach. |
| 7 | ENV-05 | Add prod migration gate workflow (ISO 27001 A.8.32) and update SoA upon completion. Update Supabase governance register. |
| 8 | ISO-03, DOC-01 | Review and update ISO 27001 physical security controls (7.1-7.4) post-k3s provisioning. Finalise Vault as the secrets management solution (DOC-01) — document configuration, OIDC setup, and key migration from GitHub Secrets. |
| 9 | CICD-01, PROC-01 | Reduce Supabase boots per CI run once architecture decisions from phases 1 and 6 are finalised. Document the required status check matrix (prerequisite for branch protection in Phase 10). |
| 10 | SEC-03 | Enable branch protection across all 6 repositories with the required status checks defined in Phase 9 (PROC-01). Fast iteration is the current priority — this is the final hardening step. |


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
| SEC-03 | Branch protection on main | `` | Security | 🟠 High |
| ENV-07 | Cloudflare Tunnel for staging ingress | `staging.md` | Process Gap | 🟠 High |
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
| SEC-01 | GitHub Actions permissions | `` | Security | 🟡 Medium |
| SEC-02 | Third-party Action version pinning | `` | Security | 🟡 Medium |
| CICD-05 | CI job timeout configuration | `` | Process Gap | 🟡 Medium |
| ENV-05 | Production database change gate | `prod-deploy.yml` | Compliance | 🟡 Medium |
| ARCH-05 | Architecture Decision Records | `README.md` | Documentation Gap | 🟡 Medium |
| CICD-06 | Dependabot for GitHub Actions ecosystem | `` | Tech Debt | 🟡 Medium |
| ISO-03 | Physical security scope change from k3s bare-metal node | `soa.md` | Compliance | 🟡 Medium |
| ENV-06 | Secrets rotation schedule | `key-management.md` | Process Gap | 🟡 Medium |
| PROC-01 | CI required status checks definition | `ci-required-checks.md` | Process Gap | 🟡 Medium |
| ARCH-06 | Container image pull-through cache on k3s node | `kubernetes-cluster.md` | Strategic Opportunity | 🟡 Medium |
| SEC-04 | Docker image provenance and digest pinning | `` | Security | 🟡 Medium |
| ARCH-07 | Observability stack (metrics, logs, traces) | `kubernetes-cluster.md` | Strategic Opportunity | 🟡 Medium |
| ENV-08 | Automated Supabase production backup to Cloudflare R2 | `backup-prod.sh` | Process Gap | 🟡 Medium |
| SEC-05 | Supabase Studio network exposure | `` | Security | 🟡 Medium |
| ARCH-08 | Calico CNI and Kubernetes NetworkPolicies | `adr-005-calico-cni.md` | Security | 🟡 Medium |
| DOC-01 | Secrets vault | `key-management.md` | Documentation Gap | 🟢 Low |
| DOC-03 | Kubernetes cluster runbook | `kubernetes-cluster.md` | Documentation Gap | 🟢 Low |
| DOC-04 | CI troubleshooting runbook | `ci-troubleshooting.md` | Documentation Gap | 🟢 Low |
| DOC-05 | Disaster recovery plan | `disaster-recovery.md` | Documentation Gap | 🟢 Low |

