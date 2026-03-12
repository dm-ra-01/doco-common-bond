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
| Vault unseal hardware | YubiKey USB-C is the primary Vault unseal mechanism (PKCS#11 HSM via OpenSC/libykcs11 — SEC-06-T1). TPM 2.0 on the Windows 11 Pro machine is the secondary backup seal (SEC-06-T2). Vault root token is stored in a physically-secured offline location (not git). Architecture documented in ADR-006. |
| Helm chart upgrade cadence | All Helm charts are pinned to exact versions in helmfile.yaml (ARCH-09-T1). A quarterly automated GitHub Actions workflow (ARCH-09-T2) opens an issue listing current vs latest chart versions for review. Upgrades must be tested on dev/staging before applying to production. |
| Wildcard TLS via DNS-01 | Let's Encrypt + Cloudflare DNS-01 challenge is confirmed to support wildcard certificates (*.commonbond.au). cert-manager-webhook-cloudflare handles DNS-01 automation. This is one of the few ACME challenge types that works for wildcards — HTTP-01 does NOT support wildcards. ARCH-10 implements this. |
| Slack notification channels | All alerting uses Slack only (no email, no PagerDuty). Two incoming webhooks: (1) incidents channel — P1/P2 Alertmanager alerts, Falco security events; (2) deployments channel — prod deploy approvals (ENV-05), cert renewals, Helm upgrade prompts (ARCH-09). Both webhook URLs stored in Vault KV, not GitHub Secrets. Configured in PROC-02-T1. |
| Edge Function deployment process | Edge Functions use git-tag-triggered deployment (fn/<name>/vX.Y.Z). Manual 'supabase functions deploy' is prohibited in staging/prod. Rollback is git tag re-push. Full procedure in docs/operations/edge-function-deployment.md (ENV-10-T2) which is mandatory reading linked from ONBOARDING.md. |
| Australian data residency for backups | All backup copies must remain on Australian-hosted infrastructure. Cloudflare R2 APAC (Sydney) is the primary backup destination (ENV-08). Backblaze B2 Australian region (SYD) is the secondary backup destination (ENV-11). No EU, ENAM, or other non-Australian storage is acceptable — Australian Privacy Principle 8 prohibits cross-border disclosure. Both rclone destinations are written in a single backup run; failure of either triggers a Slack alert. |
| Kubernetes RBAC model | Every workload on k3s must use a dedicated ServiceAccount with a minimal Role/RoleBinding. The default ServiceAccount must not be used for any production workload. The GitHub Actions self-hosted runner ServiceAccount (sa-github-runner) is the only account permitted to create/delete 'reactor-ci-*' namespaces. Supabase pods have no API server bindings — default deny. ADR-007 documents the full RBAC model. Manifests in k3s/rbac/. |
| Windows host OS update policy | Windows Update on the k3s Hyper-V host is configured to require manually-triggered restarts (Active Hours 08:00-02:00 AEST, notify-only restart policy via gpedit.msc). Planned maintenance windows are Sundays 02:00-06:00 AEST. After any host reboot (planned or unplanned), the host-reboot-recovery.md checklist (OPS-01-T2) must be completed before the cluster is considered operational. |
| pgaudit scope | pgaudit is configured with pgaudit.log = 'ddl, role, write' — capturing DDL statements (CREATE/ALTER/DROP), privilege changes (GRANT/REVOKE), and data-modifying DML (INSERT/UPDATE/DELETE). SELECT logging is deliberately excluded to avoid log volume explosion in a production OLTP system. pgaudit output streams to Loki via Promtail for querying in Grafana. ISO 27001 A.8.15 control status updated to Implemented once live. |
| GitHub Actions composite action location | The Supabase start composite action (CICD-09) is initially created in supabase-receptor/.github/actions/supabase-start/. Frontend repos reference it via a relative path or (once stable) via the organisation .github repo. This enables a single point of CLI version pinning and key extraction logic update across all 4 Supabase-dependent CI workflows. |
| Post-deploy smoke test coverage | CICD-10 implements a 5-layer smoke test (Kong health, PostgREST liveness, Auth health, DB canary query, Storage status). All checks use curl --retry 3 with exponential back-off. Failure routes to #incidents Slack webhook and fails the GitHub Actions job with exit code 1, blocking any further deploy steps. Smoke tests run: (1) post-prod-deploy in prod-deploy.yml; (2) post-merge-to-main for staging; (3) lightweight version (Kong + PostgREST only) after each ephemeral CI Supabase boot to replace the --ignore-health-check workaround with a real gate. |
| PROC-01 is a living document | The required check matrix (PROC-01-T1) is drafted in Phase 2 as a planning document. PROC-01-T2 mandates a final refresh pass after Phase 5 CI hardening, before Phase 12 branch protection is configured. The Phase 2 draft and Phase 5 refresh are both required. Branch protection (SEC-03-T1) MUST NOT be configured until PROC-01-T2 is confirmed complete. |
| Backup cron job host | The production backup cron (ENV-08-T1) runs as a Linux crontab on the control-plane Ubuntu VM, NOT as a k3s CronJob. This ensures backups execute even when the k3s cluster is degraded or unhealthy. The VM uses kubectl port-forward to reach the Postgres pod. The rclone config (with R2 and Backblaze B2 AUS credentials) is populated from Vault KV at VM boot via a systemd oneshot service, not hardcoded in the crontab environment. |


---

## 🔴 Critical

### KEY-01: planner-frontend and workforce-frontend CI jobs do not export ANON_JWT (legacy JWT form of ANON_KEY). Any test calling s

Affects: `planner-frontend, workforce-frontend` — CI key handling


- [x] Audit globalSetup.ts in planner-frontend for any signInWithPassword() calls and confirm whether ANON_JWT is required.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/__tests__/globalSetup.ts`
      _(Completed: 2026-03-12T08:00:19Z)_
- [x] Audit globalSetup.ts in workforce-frontend for any signInWithPassword() calls and confirm whether ANON_JWT is required.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/__tests__/globalSetup.ts`
      _(Completed: 2026-03-12T08:00:20Z)_
- [x] Add ANON_JWT export to planner-frontend ci.yml Start Supabase step, mirroring the preference-frontend pattern (grep '^ANON_KEY=' | sed + tr -d quotes).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-12T08:00:20Z)_
- [x] Add ANON_JWT export to workforce-frontend ci.yml Start Supabase step, mirroring the preference-frontend pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-12T08:00:20Z)_

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


- [x] Update planner-frontend ci.yml Start Supabase step to extract SERVICE_ROLE_KEY from 'supabase status -o env' and export it as SUPABASE_SERVICE_ROLE_KEY, matching the preference-frontend pattern (grep '^SERVICE_ROLE_KEY=' | tr -d quotes).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-12T08:00:20Z)_
- [x] Apply the same SERVICE_ROLE_KEY extraction fix to workforce-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
      _(Completed: 2026-03-12T08:00:20Z)_
- [x] Remove LOCAL_SUPABASE_SECRET_KEY from GitHub Secrets for planner-frontend and workforce-frontend once dynamic extraction is confirmed working.
      ``
      _(Completed: 2026-03-12T08:00:21Z)_

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


- [x] Design the k3s cluster topology: 3 Hyper-V VMs (control plane: 4 cores/6 GB, worker-1: 6 cores/10 GB for persistent envs, worker-2: 6 cores/10 GB for ephemeral branch CI). Document in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:33:33Z)_
- [x] Provision a k3s cluster on the Windows 11 Pro machine using Hyper-V VMs running Ubuntu Server 24.04 LTS. Install k3s on the control plane and join the two worker nodes.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/vm-setup.md`
      _(Completed: 2026-03-12T04:33:33Z)_
- [x] Deploy Supabase to the k3s cluster using the community Helm chart (https://github.com/supabase-community/supabase-kubernetes). Create namespaces: supabase-dev, supabase-staging, supabase-prod with separate PVCs per namespace.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:33:33Z)_
- [x] Configure Traefik ingress rules to route <branch-slug>.ci.commonbond.local to the corresponding supabase-ci-<branch-slug> namespace. This replaces the port-juggling / Docker network isolation approach.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:33:33Z)_
- [x] Install a GitHub Actions self-hosted runner as a Deployment in the control-plane namespace. Update all frontend ci.yml files to use runs-on: [self-hosted, linux, k3s] for Supabase-dependent jobs.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:33:33Z)_

### SEC-03: No branch protection rules exist on main in any repository, allowing direct pushes that bypass CI checks entirely. Defer

Affects: `cross-ecosystem` — Branch protection on main


- [ ] Enable branch protection on main across all 6 repositories once CI is stable: require PR, require all CI status checks to pass, require at least 1 approval, disallow force pushes and deletions. Use GitHub repository rulesets for cross-org consistency.
      ``

### ENV-07: The staging domain staging-api-829c83.commonbond.au has been assigned but no Cloudflare Tunnel is provisioned or documen

Affects: `supabase-receptor` — Cloudflare Tunnel for staging ingress


- [x] Provision a named Cloudflare Tunnel for the staging Supabase instance: 'cloudflare tunnel create receptor-staging'. Create a tunnel config at ~/.cloudflared/config.yml routing staging-api-829c83.commonbond.au to localhost:54321 (Supabase Kong API). Run 'cloudflare tunnel route dns' and document the full provisioning procedure in docs/infrastructure/environment/staging.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/staging.md`
      _(Completed: 2026-03-12T04:33:33Z)_
- [x] Add cloudflared as a systemd service (or k3s DaemonSet once cluster is running) so the tunnel survives reboots. Document the start/stop/restart procedure and add a health check to the staging environment runbook.
      ``
      _(Completed: 2026-03-12T04:33:33Z)_

### SEC-06: When Vault initialises on k3s, it generates 5 unseal key shares and a root token. Storing these in plain text is catastr

Affects: `supabase-receptor` — Vault unseal key security (YubiKey PKCS#11 HSM)


- [x] Configure Vault auto-unseal using the YubiKey USB-C as a PKCS#11 HSM: install OpenSC + libykcs11, configure Vault's HSM seal stanza pointing to the YubiKey's PKCS#11 slot. The YubiKey generates and stores the master key internally — it never leaves the device in plain text. Test unseal on k3s restart to confirm auto-unseal works without human intervention. Document in docs/infrastructure/disaster-recovery.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/disaster-recovery.md`
      _(Completed: 2026-03-12T04:33:34Z)_
- [x] Use TPM 2.0 as a secondary unseal backup: configure a second Vault seal stanza using the tpmkey seal plugin (or Vault's Transit seal backed by a TPM-stored key via go-tpm). This provides a fallback if the YubiKey is unavailable. Store the Vault root token in a sealed envelope in a physically-secured location, and document where it is stored in the DR plan (not in git). Write ADR-006 documenting the YubiKey-primary / TPM-secondary unsealing architecture.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/adr-006-vault-unseal-architecture.md`
      _(Completed: 2026-03-12T04:33:34Z)_

### ENV-10: Supabase Edge Functions are deployed with 'supabase functions deploy', overwriting the previous version with no rollback

Affects: `supabase-receptor` — Supabase Edge Function versioning and rollback


- [ ] Create a versioned Edge Function deployment strategy: tag each function release with git tag format 'fn/<function-name>/v<semver>' (e.g. fn/receptor-allocator/v1.2.3). Create a GitHub Actions workflow '.github/workflows/deploy-function.yml' triggered on matching tags that: (1) runs tests, (2) requires ENV-05 environment approval for production, (3) deploys via 'supabase functions deploy --project-ref <ref>', (4) tags the deployment in the Supabase functions dashboard with the git SHA.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/deploy-function.yml`
- [ ] Write docs/operations/edge-function-deployment.md with: (1) the tagging convention (fn/<name>/vX.Y.Z); (2) how to deploy (git tag + push, GitHub Actions handles the rest); (3) how to rollback (git checkout <previous-tag>, re-push tag with -f); (4) why manual 'supabase functions deploy' is prohibited in staging/prod; (5) how to find the current deployed version (Supabase dashboard + git log --tags). This document MUST be linked from ONBOARDING.md (DOC-06) and is considered mandatory reading for any engineer with production access.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/edge-function-deployment.md`

### SEC-08: The k3s cluster plan (ARCH-04) deploys Supabase, Vault, Grafana, Falco, and the GitHub Actions self-hosted runner as wor

Affects: `supabase-receptor` — Kubernetes RBAC — ServiceAccounts and least-privilege RoleBindings


- [x] Create a dedicated ServiceAccount per workload in each namespace: sa-supabase-kong, sa-vault, sa-grafana, sa-falco, sa-github-runner. Bind each to a minimal Role or ClusterRole: (1) sa-github-runner: get/list/watch pods in supabase-* namespaces; create/delete namespaces prefixed 'receptor-ci-*' for ephemeral branch environments; no cluster-admin. (2) sa-supabase-*: no API server role binding at all — default deny. (3) sa-grafana: get/list pods and nodes for Prometheus scrape path only. (4) sa-vault: get on secrets in the 'vault' namespace only, no cross-namespace access. Store all manifests in k3s/rbac/. Apply via helmfile or kubectl apply -f k3s/rbac/ as part of Phase 3 cluster provisioning.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/k3s/rbac/serviceaccounts.yaml`
      _(Completed: 2026-03-12T04:33:34Z)_
- [x] Document the RBAC model in docs/infrastructure/environment/kubernetes-cluster.md under a 'RBAC Architecture' section. Write ADR-007 at docs/adr/adr-007-k3s-rbac.md documenting: (1) why each ServiceAccount has its specific permissions; (2) why the default ServiceAccount is explicitly not used; (3) how to add permissions for new workloads (PR-gated Role change). Update SoA A.8.3 implementation notes to cite k3s RBAC as the cluster-level access restriction control alongside Vault dynamic credentials.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/adr-007-k3s-rbac.md`
      _(Completed: 2026-03-12T04:33:34Z)_

### SEC-09: The self-hosted Supabase PostgreSQL instance has no database-level audit log. Without pgaudit, there is no record of: wh

Affects: `supabase-receptor` — Supabase PostgreSQL pgaudit extension for database-level audit logging


- [ ] Enable the pgaudit extension in the self-hosted Supabase PostgreSQL config. Add 'pgaudit' to extensions.sql: 'CREATE EXTENSION IF NOT EXISTS pgaudit;'. For Docker Compose: add to postgresql.conf via the Supabase config: shared_preload_libraries = 'supabase_auth_admin,pgaudit' and set pgaudit.log = 'ddl, role, write' (captures DDL statements, privilege changes, and data-modifying DML). For k3s Helm chart deployments: add these parameters to the postgresql.postgresqlExtendedConfiguration Helm values. Ensure pgaudit output routes to the PostgreSQL log stream, which Loki/Promtail (ARCH-07) then scrapes into the observability stack. Add the extension to supabase/schemas/extensions.sql so it survives supabase db reset.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/schemas/extensions.sql`
- [ ] Document pgaudit scope and querying in docs/infrastructure/security/audit-logging.md: (1) what events are logged (DDL, ROLE, WRITE — not SELECT by default to avoid log volume explosion); (2) how to query audit events in Grafana/Loki using the 'pgaudit' label filter; (3) log retention policy: audit logs stream to Loki, then archived to Cloudflare R2 primary bucket (ENV-08) — 90-day retention; (4) ISO 27001 A.8.15 and A.5.28 control mapping. Link audit-logging.md from ONBOARDING.md (DOC-06) as mandatory security reading for engineers with DB access. Update SoA A.8.15 (Logging) from 'Partial' to 'Implemented' once pgaudit is live.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/security/audit-logging.md`

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


- [ ] Extend the staging-to-prod promotion runbook already created by ENV-09-T1 (docs/operations/promotion-runbook.md). Add the following post-provisioning sections that can only be written once the real infrastructure is running: (1) Staging smoke test commands — exact curl/supabase invocations for the Cloudflare Tunnel URL staging-api-829c83.commonbond.au (reference CICD-10 for the automated check); (2) Live ENV-05 prod-deploy.yml approval workflow link; (3) Actual Supabase project-ref values for staging and prod; (4) DB diff review procedure using 'supabase db diff --schema public' against the live instances. This task must NOT create a new file — it updates promotion-runbook.md in-place.
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


- [x] Create docs/adr/ directory in supabase-receptor. Write ADR-001 (k3s cluster selection rationale over Docker Compose/Swarm/Nomad), ADR-002 (self-hosted runner vs GitHub-hosted), ADR-003 (Docker network isolation vs k8s namespace isolation). Use standard ADR template: Context, Decision, Consequences. ADR-001 MUST include the following Helm chart caveat in its Consequences section: 'The Supabase community Helm chart (supabase-community/supabase-kubernetes) is not officially maintained by Supabase and may lag Docker Compose feature releases by weeks-to-months. Mitigation: pin the chart to a known-working version (ARCH-09 Helmfile). Fallback if chart falls significantly behind: run Supabase as Docker Compose inside a k3s Pod using a Docker-out-of-Docker (DooD) sidecar with the host Docker socket mounted, or accept delayed upgrades on the Helm chart until it catches up. This fallback must be re-evaluated at each quarterly Helm upgrade review (ARCH-09-T2) — if the chart lags by more than one minor Supabase version, escalate to the DooD fallback.'
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/README.md`
      _(Completed: 2026-03-12T04:13:37Z)_
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


- [x] Document the required status check matrix per repo in docs/operations/ci-required-checks.md: for each of the 6 repos, list the exact GitHub Actions job names that must pass before merge (e.g. 'test', 'lint', 'codegen-gate', 'build'). This document is consumed by the branch protection ruleset setup in SEC-03-T1.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/ci-required-checks.md`
      _(Completed: 2026-03-12T04:13:38Z)_
- [ ] LIVING DOCUMENT REFRESH (mandatory before Phase 12): After Phase 5 CI hardening is complete (CICD-02 CLI pin, CICD-05 timeouts, CICD-09 composite action, CGEN-01/02 codegen gate fixes, BACK-01 backend test scoping), review and update the required check matrix in docs/operations/ci-required-checks.md for any new, renamed, or removed GitHub Actions job names introduced during Phases 4 and 5. The check matrix written in Phase 2 is a planning document — this T2 task produces the production-accurate version that is actually used to configure branch protection rules in SEC-03-T1 (Phase 12). Do not enable branch protection until this refresh is complete and verified against a live CI run showing all listed job names in the GitHub Actions tab.
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


- [x] Deploy the kube-prometheus-stack Helm chart (Prometheus + Grafana + Alertmanager) and Loki + Promtail into a dedicated 'monitoring' namespace on the k3s cluster. Configure Grafana dashboards for: Supabase pod health, CI job duration/failure rate, Vault secret access rate, and k3s node resource utilisation. Document in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:33:33Z)_
- [x] Update SoA control 8.16 (Monitoring activities) in docs/compliance/iso27001/operations/soa.md to reflect that infrastructure monitoring is now implemented via Prometheus/Grafana/Loki on the k3s cluster. Document the alert channel (Alertmanager → Slack only — two webhooks: #incidents for P1/P2 alerts, #deployments for informational events; no email or PagerDuty) and the log retention policy (30-day online Loki, archived to Cloudflare R2 APAC). Cite PROC-02 clarification confirming Slack-only policy.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`
      _(Completed: 2026-03-12T04:33:33Z)_

### ENV-08: The production Supabase instance has no scheduled backup. Self-hosted Supabase relies on postgres WAL or pg_dump — neith

Affects: `supabase-receptor` — Automated Supabase production backup to Cloudflare R2


- [ ] Write a backup script (scripts/backup-prod.sh) that runs pg_dumpall against the production Postgres pod and streams the compressed dump to Cloudflare R2 using rclone (configured with a dedicated R2 access key scoped to the backup bucket). Schedule EXCLUSIVELY via crontab in the control-plane Ubuntu VM (NOT as a k3s CronJob) — this ensures backups run regardless of k3s cluster health during a disaster recovery scenario. The VM must have pg_dumpall, rclone, and kubectl installed; access the Postgres pod via 'kubectl port-forward svc/supabase-db 5432:5432 -n supabase' run as a background step in the script before the pg_dumpall call. Cron schedule: daily at 02:00 AEST ('0 15 * * * AEST'), weekly full dump on Sunday at 01:00 AEST ('0 14 * * 0 AEST'). Store the rclone config and R2 access key in the VM's ~/.config/rclone/rclone.conf (populated from Vault KV at VM boot via a systemd oneshot service). The ENV-11 secondary Backblaze B2 upload is also triggered from this same script — see ENV-11-T1.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/scripts/backup-prod.sh`
- [ ] Document the backup and restore procedure in docs/infrastructure/disaster-recovery.md: backup schedule (daily/weekly), R2 bucket name and retention policy (30 days daily, 12 months weekly), and the full restore procedure ('rclone copy r2:backups/<dump> ./ && pg_restore ...'). Define RTO target (4 hours) and RPO target (24 hours).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/disaster-recovery.md`
- [ ] Update SoA control 8.13 (Information backup) in docs/compliance/iso27001/operations/soa.md from 'Not implemented' to 'Implemented' once the R2 backup schedule is active. Document the backup schedule, retention policy, and last-tested restore date.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/operations/soa.md`

### SEC-05: Supabase Studio (port 54323 by default) is bound to all interfaces on the host and is not authenticated at the network l

Affects: `supabase-receptor` — Supabase Studio network exposure


- [x] For staging and production Supabase instances: bind Studio to 127.0.0.1 only in docker-compose.yml ('127.0.0.1:54323:3000'). For k3s deployments, use a NetworkPolicy (ARCH-08) to restrict Studio pod egress to the Traefik ingress pod only, and place the Traefik route for Studio behind Cloudflare Access (Zero Trust) with a Google SSO policy.
      ``
      _(Completed: 2026-03-12T04:33:34Z)_

### ARCH-08: k3s ships with Flannel CNI by default, which does not enforce NetworkPolicy objects. All pods can communicate freely wit

Affects: `supabase-receptor` — Calico CNI and Kubernetes NetworkPolicies


- [x] Install k3s with '--flannel-backend=none --disable-network-policy' flags and deploy Calico via the Tigera Operator Helm chart. Verify NetworkPolicy enforcement with a test deny-all policy. Document the Calico installation in ADR-005 and in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/adr/adr-005-calico-cni.md`
      _(Completed: 2026-03-12T04:33:34Z)_
- [x] Write NetworkPolicy manifests for each namespace: (1) supabase: allow ingress from traefik and ci-runner, deny all other; (2) vault: allow ingress from supabase and ci-runner on port 8200 only; (3) monitoring: allow ingress from all namespaces on scrape ports (9090, 3100), deny egress to prod data; (4) ci-runner: allow egress to supabase and vault only. Store manifests in k3s/network-policies/.
      ``
      _(Completed: 2026-03-12T04:33:34Z)_

### ARCH-09: Helm chart installs (Vault, kube-prometheus-stack, Calico/Tigera Operator, cert-manager, Traefik) are not pinned to exac

Affects: `supabase-receptor` — Helm chart version pinning and upgrade cadence


- [x] Adopt Helmfile (helmfile.yaml) to declare all Helm chart versions declaratively and commit to git. Pin every chart to an exact version (e.g. vault: 0.28.1, kube-prometheus-stack: 58.x.x). Store in k3s/helmfile.yaml. All future upgrades must go through a PR with the chart changelog reviewed.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/k3s/helmfile.yaml`
      _(Completed: 2026-03-12T04:13:37Z)_
- [x] Establish a quarterly Helm chart upgrade review cadence. Create a GitHub Actions scheduled workflow '.github/workflows/helm-upgrade-check.yml' that runs quarterly (cron: '0 9 1 1,4,7,10 *') and opens an issue listing each chart's current pinned version vs the latest available version. The issue template includes the changelog URL and a checklist for testing the upgrade on dev first.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/helm-upgrade-check.yml`
      _(Completed: 2026-03-12T04:13:38Z)_

### ENV-09: No documented gate exists between staging and production deployments. A developer can manually push a schema migration o

Affects: `supabase-receptor` — Staging to production promotion checklist


- [x] Write docs/operations/promotion-runbook.md covering the staging-to-production promotion gate: (1) run staging smoke tests (list specific test commands); (2) review 'supabase db diff' output between staging and prod schemas; (3) trigger ENV-05 prod-deploy.yml workflow — awaits human approval; (4) stakeholder sign-off (who approves and how); (5) post-deploy verification steps; (6) rollback procedure (restore from latest R2 backup, revert migration). Include a checklist template for use in each deployment PR.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/promotion-runbook.md`
      _(Completed: 2026-03-12T04:13:37Z)_

### CICD-07: No ci.yml file in the ecosystem uses 'actions/cache' for node_modules or Python virtualenvs. Each CI run performs a full

Affects: `cross-ecosystem` — npm and pip dependency caching in CI


- [ ] Add 'actions/cache' steps to all 3 frontend ci.yml files keyed on 'hashFiles("**/package-lock.json")'. For backend repos (match-backend, receptor-planner) add pip cache steps keyed on 'hashFiles("**/requirements.txt")'. Once running on a self-hosted runner (ARCH-03), switch to a local filesystem cache path (/var/cache/ci/npm, /var/cache/ci/pip) instead of the GitHub-managed cache to eliminate upload/download overhead entirely.
      ``

### ARCH-10: Vault, Grafana, Traefik ingress, and the staging Supabase API all need TLS. Without cert-manager, certificates are self-

Affects: `supabase-receptor` — TLS and cert-manager for k3s (Let's Encrypt wildcard via DNS-01)


- [x] Deploy cert-manager via Helmfile into the 'cert-manager' namespace on the k3s cluster. Configure a ClusterIssuer using Let's Encrypt ACME with Cloudflare DNS-01 challenge (cert-manager-webhook-cloudflare). Issue a wildcard certificate *.commonbond.au covering staging-api-829c83.commonbond.au and any future subdomains. Store the Cloudflare API token for DNS-01 in Vault KV (path: infrastructure/cloudflare-dns01-token) and inject via Vault Secrets Operator into the cert-manager namespace.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/k3s/cert-manager/cluster-issuer.yaml`
      _(Completed: 2026-03-12T04:33:34Z)_
- [x] Document the certificate lifecycle in docs/infrastructure/environment/kubernetes-cluster.md: cert-manager auto-renews 30 days before expiry; renewal requires the Cloudflare API token to be valid in Vault; monitor renewal events in Grafana/Loki. Add a Prometheus alert rule for certificate expiry < 14 days as a safety net.
      ``
      _(Completed: 2026-03-12T04:33:34Z)_

### CICD-08: No repository has GitHub Environments configured. Without them, environment-specific secrets cannot be scoped (staging v

Affects: `cross-ecosystem` — GitHub Environments for deployment tracking and secret scoping


- [ ] Create 'staging' and 'production' GitHub Environments in each of the 6 repositories via the GitHub API or UI. Migrate environment-specific secrets (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.) from repo-level secrets into the appropriate environment secret scope. Update ci.yml deploy steps to reference 'environment: staging' or 'environment: production' so deployments appear in the GitHub deployment history timeline.
      ``

### SEC-07: Calico (ARCH-08) enforces network-level isolation between pods, but no tool monitors for anomalous behaviour inside runn

Affects: `supabase-receptor` — Falco runtime security on k3s


- [x] Deploy Falco as a DaemonSet on k3s via Helmfile (falcosecurity/falco chart). Enable the default Kubernetes ruleset. Configure falcosidekick to route Falco alerts to Prometheus Alertmanager (ARCH-07), which then routes to Slack (PROC-02). Add a custom Falco rule to alert immediately on any shell spawn inside the 'supabase' or 'vault' namespaces. Document in docs/infrastructure/environment/kubernetes-cluster.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/k3s/falco/falco-rules.yaml`
      _(Completed: 2026-03-12T04:33:34Z)_

### PROC-02: No incident response plan or alert routing exists. ARCH-07 (Grafana/Alertmanager) will generate alerts but there is no d

Affects: `supabase-receptor` — Incident response plan and Slack notification pipeline


- [x] Provision a Slack incoming webhook for incident alerts and a second webhook for deployment/routine notifications (e.g. prod deploy approved, cert renewal). Store both webhook URLs in Vault KV (paths: infrastructure/slack-incidents-webhook, infrastructure/slack-deployments-webhook). Configure Prometheus Alertmanager (ARCH-07) with a receiver pointing to the incidents webhook for P1/P2 alerts and the deployments webhook for informational alerts. Add ENV-05 prod-deploy.yml to post to #deployments on approval.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/k3s/monitoring/alertmanager-config.yaml`
      _(Completed: 2026-03-12T04:33:35Z)_
- [x] Write docs/operations/incident-response.md covering: (1) severity tiers — P1 (production down, data breach), P2 (degraded service), P3 (non-critical); (2) for each tier: who is notified (Slack alert to founder), expected response time, escalation steps; (3) post-mortem template (5-whys, timeline, action items); (4) link to DR plan (DOC-05) and rollback procedure. Update SoA control 5.26 in docs/compliance/iso27001/operations/soa.md to 'Implemented' once this document exists and alerts are live.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/incident-response.md`
      _(Completed: 2026-03-12T04:33:35Z)_

### OPS-01: The k3s cluster runs on Hyper-V VMs hosted on a Windows 11 Pro machine. Windows Update can forcibly reboot the host with

Affects: `supabase-receptor` — Windows 11 Pro host OS patch management and reboot recovery


- [x] Configure Windows Update on the k3s host: (1) Set Active Hours to 08:00-02:00 AEST in Settings > Windows Update > Active Hours to prevent automatic restarts during working/production hours. (2) Enable 'Notify to schedule restart' policy via gpedit.msc (Computer Configuration > Administrative Templates > Windows Components > Windows Update > Configure automatic updating: set to '2 - Notify for download and auto install'). (3) Document this configuration in docs/infrastructure/environment/kubernetes-cluster.md under 'Host OS Maintenance'. The goal is that Windows Update downloads and installs patches but requires a manually-triggered restart window.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:13:37Z)_
- [x] Write docs/operations/host-reboot-recovery.md — a step-by-step recovery checklist to run after any host reboot (planned or unplanned): (1) Verify all 3 Hyper-V VMs are running: 'Get-VM | Select Name, State' (PowerShell on host). (2) Confirm k3s cluster is healthy: 'kubectl get nodes' — all nodes should be Ready within ~60 seconds. (3) Confirm Vault unsealed: 'vault status' — YubiKey auto-unseal should trigger automatically (SEC-06); if not, document manual unseal procedure. (4) Confirm Supabase pods ready: 'kubectl get pods -n supabase' — all Running. (5) Verify Cloudflare Tunnel reconnected: 'cloudflared tunnel info receptor-staging'. (6) Send a Slack deployment-channel notification confirming recovery. Link this checklist from PROC-02 (incident response) and ONBOARDING.md (DOC-06). Add a Grafana/Loki alert rule for cluster node NotReady > 2 minutes as an automated recovery notification trigger.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/host-reboot-recovery.md`
      _(Completed: 2026-03-12T04:13:37Z)_

### ENV-11: ENV-08 implements automated daily Postgres backups to Cloudflare R2 (APAC bucket, Sydney region). R2 does not natively r

Affects: `supabase-receptor` — R2 backup secondary copy — Australian data residency with provider redundancy


- [ ] Extend the backup script (scripts/backup-prod.sh from ENV-08-T1) to write to a second rclone destination after the primary R2 upload completes. Configure an rclone remote 'b2-aus' pointing to Backblaze B2 Australian region bucket ('receptor-backups-b2-aus'). The backup script pipeline becomes: pg_dumpall | gzip | tee >(rclone rcat r2-apac:receptor-backups/<filename>.gz) >(rclone rcat b2-aus:receptor-backups-b2-aus/<filename>.gz). Both uploads are required to succeed for the backup job to report success — a Slack alert fires if either fails. Backblaze B2 API key to be stored in Vault KV (path: infrastructure/backblaze-b2-aus-key) and injected as an environment variable. Verify Backblaze B2 SYD region availability at https://www.backblaze.com/docs/cloud-storage-data-center-locations before provisioning.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/scripts/backup-prod.sh`
- [ ] Update docs/infrastructure/disaster-recovery.md to document the two-provider backup topology: (1) Primary: Cloudflare R2 APAC (Sydney) — restore source; (2) Secondary: Backblaze B2 Australian region — failover restore source if R2 APAC is unavailable. Document the restore procedure for each source. Add a data residency statement confirming both storage providers are Australian-hosted and no data crosses international borders. Update SoA A.8.13 implementation notes to cite dual-provider Australian backup as the off-site control. Add a Grafana/Loki alert for backup script failure (either destination) within 1 hour of the scheduled backup window.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/disaster-recovery.md`

### CICD-09: Each of the 4 repos that boot Supabase in CI (preference-frontend, planner-frontend, workforce-frontend, supabase-recept

Affects: `cross-ecosystem` — GitHub Actions composite action for Supabase start and key extraction


- [ ] Create a composite action at supabase-receptor/.github/actions/supabase-start/action.yml with inputs: supabase-version (string, required — the pinned CLI version). Steps: (1) uses: supabase/setup-cli@<pinned-SHA> with: version: ${{ inputs.supabase-version }}; (2) run: supabase start --ignore-health-check; (3) run: extract PUBLISHABLE_KEY, ANON_KEY (JWT), SERVICE_ROLE_KEY from 'supabase status -o env' using the tr -d quotes pattern from preference-frontend; (4) echo each extracted key to $GITHUB_ENV and as a named step output. Update all 4 ci.yml files to replace their existing Supabase start + key extraction steps with 'uses: ./.github/actions/supabase-start' (for supabase-receptor, which owns the action) or reference the shared action from the organisation's .github repo once it is established there.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/supabase-start/action.yml`
- [ ] Evaluate whether a reusable workflow (.github/workflows/supabase-ci-base.yml with 'on: workflow_call:') would further reduce the 3-boot-per-repo pattern (CICD-01). Document the evaluation as an ADR note in the ARCH-01 finding's cicd-architecture.md doc: if a shared workflow is adopted, the 3 frontend repos call it via 'uses: <org>/<repo>/.github/workflows/supabase-ci-base.yml@main' with a matrix strategy for their test suites. Note: this T2 task is contingent on the ARCH-01/ARCH-03 CI architecture decision from Phase 8 — complete T1 regardless, then assess T2 once the runner strategy is finalised.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/supabase-start/action.yml`

## 🟢 Low

### DOC-01: Vault configuration guide for the k3s deployment. The Bitwarden/Doppler TODO in key-management.md:86-88 is superseded — 

Affects: `supabase-receptor` — Secrets vault


- [ ] Write docs/infrastructure/security/vault-configuration.md covering: (1) OIDC JWT auth — how GitHub Actions authenticates via OIDC token to Vault without long-lived secrets; (2) Database secrets engine — how Vault issues dynamic short-lived Postgres credentials per CI run and the lease TTL configuration; (3) Vault Secrets Operator (VSO) CRD patterns — how k3s pods consume secrets via VaultStaticSecret and VaultDynamicSecret CRDs; (4) KV v2 path structure — canonical paths for all static secrets (infrastructure/cloudflare-dns01-token, infrastructure/slack-incidents-webhook, infrastructure/slack-deployments-webhook, infrastructure/backblaze-b2-aus-key); (5) Renewal and rotation procedure for each secret category. Update the key-management.md TODO block (line 86-88) to close it with a reference to this new document. Link from ONBOARDING.md (DOC-06).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/security/key-management.md`

### DOC-03: The ARCH-04 finding identifies a k3s Kubernetes cluster as the strategic infrastructure target, but no documentation exi

Affects: `supabase-receptor` — Kubernetes cluster runbook


- [x] Write docs/infrastructure/environment/kubernetes-cluster.md covering: cluster topology, VM provisioning steps (Hyper-V + Ubuntu Server 24.04 LTS), k3s installation commands, Helm chart deployment for Supabase, Traefik ingress rules for branch-slug routing, cert-manager DNS-01 challenge config, and disaster recovery procedure.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/environment/kubernetes-cluster.md`
      _(Completed: 2026-03-12T04:13:37Z)_

### DOC-04: The three known CI failure modes (Supabase boot hang, sb_publishable_*/JWT key incompatibility, Supabase CLI codegen fal

Affects: `supabase-receptor` — CI troubleshooting runbook


- [x] Write docs/operations/ci-troubleshooting.md with the following sections: (1) Boot hang — signature: step 'Supabase Start' hangs beyond 4 min, fix: add --ignore-health-check flag and timeout-minutes to job; (2) Key format mismatch — signature: auth.signInWithPassword returns 400 in CI only, fix: check dual-key export in ci.yml globalSetup; (3) Codegen false positive — signature: 'GraphQL schema has changed' in CI but not locally, fix: pin supabase-cli version, don't use latest.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/ci-troubleshooting.md`
      _(Completed: 2026-03-12T04:13:37Z)_

### DOC-05: The k3s node is a single point of failure. If the Windows 11 Pro machine fails, recovery time and procedure are undefine

Affects: `supabase-receptor` — Disaster recovery plan


- [x] Write docs/infrastructure/disaster-recovery.md covering: (1) RTO target (4 hours) and RPO target (24 hours); (2) what data lives where — Supabase Postgres volumes (R2 backup via ENV-08), Vault unseal keys and root token (secure offline storage), k3s etcd snapshot (rke2-etcd-snapshots); (3) step-by-step recovery for each component in priority order; (4) contact list for who to notify during an incident. Test the DR procedure quarterly.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/infrastructure/disaster-recovery.md`
      _(Completed: 2026-03-12T04:13:37Z)_

### DOC-06: The infrastructure being built in Phase 1 (k3s, Vault, Calico, Grafana, Cloudflare Tunnel, ADRs) is complex and undocume

Affects: `supabase-receptor` — Engineer onboarding guide


- [ ] Write docs/ONBOARDING.md covering: (1) Prerequisites — WSL2/Linux, Docker, kubectl, k3s kubeconfig, Helmfile, Vault CLI, cloudflared, Supabase CLI, act (for local CI); (2) Dev environment setup — clone supabase-receptor, run setup.sh, verify Supabase starts; (3) Connecting to staging — Cloudflare Tunnel URL, Vault login via OIDC; (4) Running CI locally — see .agents/skills/act-local-ci/SKILL.md; (5) Key contacts — who owns prod, who owns Vault unseal key; (6) ADR index link.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/ONBOARDING.md`

### CICD-10: After a staging or production deployment (schema migration via ENV-05, Edge Function deploy via ENV-10, or frontend rele

Affects: `supabase-receptor` — Post-deploy smoke tests for staging and production


- [ ] Create a reusable composite action at supabase-receptor/.github/actions/smoke-test/action.yml with inputs: base-url (the Cloudflare Tunnel or production URL) and slack-webhook-url (injected from Vault via CICD-08 environment). The action performs the following checks IN ORDER, failing fast on the first failure: (1) Kong API health — 'curl -f --retry 3 --retry-delay 5 --retry-all-errors --max-time 10 ${base-url}/health' — expects 200 with body containing 'ok'. (2) PostgREST liveness — 'curl -f --retry 3 --retry-delay 5 --max-time 10 -H "apikey: ${ANON_KEY}" ${base-url}/rest/v1/' — expects 200 with a JSON array body (not an error). (3) Auth endpoint liveness — 'curl -f --retry 3 --retry-delay 5 --max-time 10 ${base-url}/auth/v1/health' — expects 200. (4) DB canary query — 'curl -f --retry 2 --max-time 15 -H "apikey: ${ANON_KEY}" -H "Authorization: Bearer ${ANON_JWT}" ${base-url}/rest/v1/organisations?select=id&limit=1' — expects 200 with a JSON array (empty is acceptable; a 404 or 5xx indicates schema drift or DB unavailability). (5) Storage liveness — 'curl -f --max-time 10 ${base-url}/storage/v1/status' — expects 200. On ALL checks passing: post a Slack message to the deployments webhook: ':white_check_mark: Smoke test PASSED for ${base-url} — Kong, PostgREST, Auth, DB canary, Storage all healthy.' On ANY check failing: post to the incidents webhook: ':fire: SMOKE TEST FAILED for ${base-url} — step N (description) returned HTTP ${status_code}. Halt deployment and investigate.' Set exit code 1 so the calling workflow job fails and any subsequent deploy steps are blocked.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/actions/smoke-test/action.yml`
- [ ] Integrate the smoke-test composite action into two workflows: (A) prod-deploy.yml (ENV-05): add a 'smoke-test-prod' job that runs immediately after the 'deploy' job succeeds, using base-url: https://api.commonbond.au and the production ANON_KEY from the 'production' GitHub Environment (CICD-08). The job must complete before the workflow is marked successful. (B) Create a new workflow '.github/workflows/staging-smoke.yml' triggered on: push to main (post-migration to staging) and workflow_dispatch (for manual re-runs). Uses base-url: https://staging-api-829c83.commonbond.au and the staging ANON_KEY from the 'staging' GitHub Environment (CICD-08). Also integrate a lightweight version (Kong health + PostgREST only) as a post-step in the self-hosted runner CI job after each ephemeral branch Supabase boot, to confirm the instance is truly healthy before tests run — replacing the current '--ignore-health-check' workaround with a real health gate.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/staging-smoke.yml`
- [ ] Document the smoke test architecture in docs/operations/ci-troubleshooting.md (DOC-04): (1) What each of the 5 checks validates and why; (2) Common failure signatures — Kong 503 (Traefik routing issue), PostgREST 404 (schema cache not initialised), Auth 500 (GoTrue startup failure), DB canary 401 (ANON_KEY mismatch), Storage 503 (S3-compatible storage pod not ready); (3) How to re-run the smoke test manually ('gh workflow run staging-smoke.yml'); (4) How to interpret Slack notifications — pass format, fail format, which channel each routes to. Add this section under a new '## Smoke Test Failures' heading in the existing DOC-04 troubleshooting doc.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/ci-troubleshooting.md`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | ARCH-05, DOC-03, DOC-04, DOC-05, ENV-09, OPS-01 | All planning documents that must exist before any system is provisioned. No infrastructure changes. Produces: ADR-001 to ADR-004 (k3s, self-hosted runner, isolation strategy, Docker image pinning), cluster runbook template (DOC-03), CI troubleshooting (DOC-04), DR plan (DOC-05), required check matrix (PROC-01 — moved here from Phase 11 as it gates Phase 12 branch protection), staging-to-prod promotion runbook (ENV-09), and Windows host reboot recovery checklist (OPS-01). These documents gate Phase 3 implementation. |
| 2 | ARCH-09, PROC-01 | Design tasks with no running system dependency: design and commit helmfile.yaml structure with pinned chart versions and quarterly upgrade workflow (ARCH-09); document the required CI status check matrix per repo (PROC-01) which is a pre-requisite for Phase 12 branch protection and must be written before any infrastructure changes are made. Both outputs are consumed by Phase 3 and Phase 12. |
| 3 | ARCH-04, ARCH-07, ARCH-08, ARCH-10, ENV-07, SEC-05, SEC-06, SEC-07, PROC-02, SEC-08 | The strategic Phase 1 buildout. Provision k3s on Hyper-V, deploy all cluster services via helmfile.yaml: Calico CNI, Vault OSS (YubiKey PKCS#11 primary + TPM 2.0 secondary unseal), kube-prometheus-stack, Loki, Falco, cert-manager (wildcard TLS via DNS-01), Traefik ingress. Configure RBAC ServiceAccounts and RoleBindings for all workloads (SEC-08 — must be done at provisioning time, not retrofitted). Provision Cloudflare Tunnel for staging. Bind Supabase Studio to 127.0.0.1. Configure Alertmanager → Slack webhook pipeline. This phase has the most risk and longest duration — all subsequent phases depend on it. |
| 4 | KEY-01, CICD-03 | Fix the two security-class CI defects (key format mismatch, service role misuse) that cause silent auth failures. These are CI YAML changes only — safe to implement in parallel while Phase 3 is being planned and provisioned. |
| 5 | CICD-02, CGEN-01, CGEN-02, CICD-04, CICD-05, BACK-01, BACK-02, CICD-07, ENV-10, CICD-09 | Pin Supabase CLI, standardise codegen gate, fix bare pytest, replace JWT stubs, add job timeouts, configure npm/pip caching, implement the composite action for Supabase start + key extraction (CICD-09 — structurally prevents future drift like KEY-01/CICD-02), and implement the git-tag-triggered Edge Function versioning strategy. All CI YAML and tooling changes. |
| 6 | SEC-01, SEC-02, CICD-06, SEC-04 | Add GITHUB_TOKEN permission blocks, pin Actions to SHAs, add Dependabot for github-actions ecosystem, pin Docker image digests and add verify-images target. Update SoA controls 8.3 and 8.8. These harden the CI supply chain independently of the cluster. |
| 7 | ENV-01, ENV-02, KEY-02, DOC-02, ENV-06, ARCH-06, ENV-08, CICD-08, SEC-09, ENV-11 | Provision staging environment, document all 4 tiers, write key management docs, configure GitHub Environments (staging + production) for secret scoping and deployment history, implement Cloudflare R2 backup (pg_dumpall/rclone) with secondary Backblaze B2 Australian region copy (ENV-11 — Australian data residency), enable pgaudit extension for database-level forensic audit logging (SEC-09), add secrets rotation schedule and reminder workflow, and configure the pull-through container registry cache. pgaudit requires Supabase (Phase 3) and Loki (Phase 3) to be running. |
| 8 | ARCH-01, ARCH-02, ARCH-03, ISO-01, ISO-02, ENV-03, ENV-04, CICD-01 | Design and implement the branch-matched CI architecture (Docker network isolation or k8s namespace-per-branch), add CI mode to setup.sh, implement test data isolation and pg_cron cleanup, migrate to self-hosted runner. Reduce redundant Supabase boots (CICD-01). May be simplified by Phase 3 k8s namespace-per-branch approach. |
| 9 | ENV-05, CICD-10 | Deploy the prod migration gate workflow (prod-deploy.yml) requiring human approval before any db push. Integrate the full 5-layer smoke test (CICD-10) into prod-deploy.yml and create the standalone staging-smoke.yml workflow. Update SoA control 8.32. Update Supabase governance register. CICD-10 also replaces the --ignore-health-check workaround in ephemeral CI boots with a real health gate. This phase is gated on Phase 7 (GitHub Environments must exist for environment protection rules and secret scoping). |
| 10 | DOC-01, DOC-06 | With all infrastructure running, write the post-implementation documentation: Vault configuration guide (DOC-01) documenting the OIDC setup, database secrets engine, and VSO CRD patterns; engineer onboarding guide (DOC-06) covering prerequisites, how to connect to each environment, how to run CI locally, and key contacts. These documents require a working system to be accurate. |
| 11 | ISO-03 | Review ISO 27001 physical controls 7.1-7.4 post-provisioning and update the SoA with confirmed compensating controls for the k3s bare-metal node. This is a low-risk documentation task that requires the physical node to be in its final configured state before the SoA entry can be confirmed accurate. |
| 12 | SEC-03 | The final hardening step, enabled only once CI is stable and all phase 1-11 fixes are complete and verified. Requires the required check matrix from Phase 2 (PROC-01). Enables branch protection rulesets across all 6 repositories with mandatory CI status checks, PR approval, and no force pushes. |


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
| SEC-06 | Vault unseal key security (YubiKey PKCS#11 HSM) | `disaster-recovery.md` | Security | 🟠 High |
| ENV-10 | Supabase Edge Function versioning and rollback | `deploy-function.yml` | Process Gap | 🟠 High |
| SEC-08 | Kubernetes RBAC — ServiceAccounts and least-privilege RoleBindings | `serviceaccounts.yaml` | Security | 🟠 High |
| SEC-09 | Supabase PostgreSQL pgaudit extension for database-level audit logging | `extensions.sql` | Security | 🟠 High |
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
| ARCH-09 | Helm chart version pinning and upgrade cadence | `helmfile.yaml` | Tech Debt | 🟡 Medium |
| ENV-09 | Staging to production promotion checklist | `promotion-runbook.md` | Process Gap | 🟡 Medium |
| CICD-07 | npm and pip dependency caching in CI | `` | Tech Debt | 🟡 Medium |
| ARCH-10 | TLS and cert-manager for k3s (Let's Encrypt wildcard via DNS-01) | `cluster-issuer.yaml` | Strategic Opportunity | 🟡 Medium |
| CICD-08 | GitHub Environments for deployment tracking and secret scoping | `` | Process Gap | 🟡 Medium |
| SEC-07 | Falco runtime security on k3s | `falco-rules.yaml` | Security | 🟡 Medium |
| PROC-02 | Incident response plan and Slack notification pipeline | `alertmanager-config.yaml` | Process Gap | 🟡 Medium |
| OPS-01 | Windows 11 Pro host OS patch management and reboot recovery | `kubernetes-cluster.md` | Process Gap | 🟡 Medium |
| ENV-11 | R2 backup secondary copy — Australian data residency with provider redundancy | `backup-prod.sh` | Process Gap | 🟡 Medium |
| CICD-09 | GitHub Actions composite action for Supabase start and key extraction | `action.yml` | Tech Debt | 🟡 Medium |
| DOC-01 | Secrets vault | `key-management.md` | Documentation Gap | 🟢 Low |
| DOC-03 | Kubernetes cluster runbook | `kubernetes-cluster.md` | Documentation Gap | 🟢 Low |
| DOC-04 | CI troubleshooting runbook | `ci-troubleshooting.md` | Documentation Gap | 🟢 Low |
| DOC-05 | Disaster recovery plan | `disaster-recovery.md` | Documentation Gap | 🟢 Low |
| DOC-06 | Engineer onboarding guide | `ONBOARDING.md` | Documentation Gap | 🟢 Low |
| CICD-10 | Post-deploy smoke tests for staging and production | `action.yml` | Process Gap | 🟢 Low |


---

## Session Close — 2026-03-12

**Completed:** KEY-01 (T1–T4), CICD-03 (T1–T3)

**Remaining:** 65 open tasks across Phases 5–12 (CICD-02, CGEN-01, CGEN-02, CICD-04, CICD-05, BACK-01, BACK-02, CICD-07, ENV-10, CICD-09, SEC-01, SEC-02, CICD-06, SEC-04, ENV-01, ENV-02, KEY-02, DOC-02, ENV-06, ARCH-06, ENV-08, CICD-08, SEC-09, ENV-11, ARCH-01, ARCH-02, ARCH-03, ISO-01, ISO-02, ENV-03, ENV-04, CICD-01, ENV-05, CICD-10, DOC-01, DOC-06, ISO-03, SEC-03, ARCH-05-T2, DOC-01, DOC-06, ENV-10, PROC-01-T2, CGEN-01, CGEN-02, BACK-01, BACK-02)

**Blocked:** None

**PR order note:** planner-frontend and workforce-frontend audit branches are independent of each other and can be merged in any order. No schema changes this session.

**Brief for next agent:** Phase 5 is next. It covers CICD-02 (parallel Supabase boots across all 4 repos), CGEN-01/CGEN-02 (codegen check fixes for planner/workforce), CICD-04 (supabase-receptor ci.yml pinned CLI version), CICD-05 (cross-ecosystem Supabase CLI version consistency), BACK-01/BACK-02 (match-backend and receptor-planner CI), CICD-07 (dependency review action), ENV-10 (Edge Function deployment workflow), CICD-09 (composite action). KEY CLARIFICATION RECORDED: publishable key IS valid for signInWithPassword on cloud-hosted GoTrue; however local CLI supabase status -o env still outputs legacy ANON_KEY (JWT) and preference-frontend uses that for local CI compatibility — follow the same pattern. LOCAL_SUPABASE_SECRET_KEY has been deleted from planner-frontend and workforce-frontend GitHub Secrets.

---

## Session Close — Phase 5 (2026-03-12)

**Tasks completed this session:** 9 tasks across 7 findings

| Finding | Task | Repo(s) | Change |
|:--|:--|:--|:--|
| CGEN-01 | CGEN-01-T1 | planner-frontend | codegen check: `git diff --exit-code` instead of `--check` |
| CGEN-02 | CGEN-02-T1 | workforce-frontend | same codegen fix |
| CICD-04 | CICD-04-T1 | supabase-receptor | `--workdir supabase/` added to `supabase start` + `test db` |
| BACK-02 | BACK-02-T1 | match-backend | JWT stub → `stub-service-role-key-not-real` |
| BACK-02 | BACK-02-T2 | receptor-planner | same stub replacement |
| CICD-05 | CICD-05-T1 | all 6 repos | `timeout-minutes` on all jobs (10/20) |
| CICD-07 | CICD-07-T1 | all 6 repos | `actions/cache` for npm (`~/.npm`) and pip (`~/.cache/pip`) |
| ENV-10 | ENV-10-T1 | supabase-receptor | `deploy-function.yml` tag-driven workflow created |
| ENV-10 | ENV-10-T2 | supabase-receptor | `docs/operations/edge-function-deployment.md` created |

**Open task count:** 56 (was 65)

**Verification:** `npx tsc --noEmit` passed on all 3 frontends; Deno type check clean; `pytest` clean on both backends.

**Branches pushed:** All 6 repos on `audit/260312-cicd-environments`. preference-frontend now included.

**Next session focus (Phase 6):** CICD-02 (pin Supabase CLI version), CICD-09 (composite action for Supabase start), CICD-08 (GitHub Environments), ENV-05 (prod-deploy.yml migration workflow), SEC-01, SEC-02.

### ENV-10 Amendment (post-session)

`deploy-function.yml` was rewritten to target the **self-hosted k3s cluster** (not Supabase Cloud). The amended workflow uses `runs-on: self-hosted`, `kubectl cp` to push function files into the `supabase-edge-runtime` pod, a rolling restart via `kubectl rollout restart`, and an in-cluster Kong smoke test. No `SUPABASE_ACCESS_TOKEN` or `--project-ref` required; the runner's in-cluster RBAC (SEC-08) is used instead.

### Open PRs after Phase 5

| Repo | PR |
|:--|:--|
| planner-frontend | open (from Phase 4) |
| workforce-frontend | open (from Phase 4) |
| preference-frontend | [PR#19](https://github.com/dm-ra-01/preference-frontend/pull/19) |
| supabase-receptor | open (from Phase 1) |
| match-backend | [PR#5](https://github.com/dm-ra-01/match-backend/pull/5) |
| receptor-planner | [PR#6](https://github.com/dm-ra-01/receptor-planner/pull/6) |
