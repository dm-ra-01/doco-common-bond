# Refined Migration Implementation Plan: GCP Managed Architecture
# Audit ref: 260328-infra-hosting — HOSTING-21

This refined plan formalizes the transition of the Receptor ecosystem from self-hosted k3s/ARC to a managed GCP Cloud Run architecture. It prioritizes **modular IaC**, **Workload Identity Federation (WIF)**, and a **"Clean Slate" secret strategy** (skipping bulk Vault migration in favor of manual seeding of the new cloud-hosted Supabase).

---

## Phase 1: Foundation & Modular IaC
**Goal:** Establish the identity and networking baseline without vendor lock-in.

- [x] **Modularize Terraform:** Refactor `receptor-infra/terraform/gcp/` to use reusable modules (`foundation`, `secrets`, `cloudrun`).
- [x] **Establish Production Root:** Create `terraform/gcp/production/` for environment-specific orchestration.
- [x] **Identity (WIF):** Provision the OIDC Pool and `github-deployer` service account for credential-free CI/CD.
- [ ] **State Lockdown:** Migrate from local state to a locked GCS backend (to be added to `providers.tf`).

---

## Phase 2: Secret Realignment (The Audit)
**Goal:** Move away from Vault and GitHub Secrets into a centralized, regional GCP Secret Manager.

| Secret Category | Storage | Injected At |
| :--- | :--- | :--- |
| **Infrastructure** (`SUPABASE_URL`, `SERVICE_ROLE`) | GCP Secret Manager | Run-time (Env Var) |
| **Next.js Public** (`SUPABASE_URL`, `ANON_KEY`, `SENTRY_DSN`) | GCP Secret Manager | Build-time (`--build-arg`) |
| **E2E Credentials** (`TEST_ADMIN_EMAIL`, etc.) | GCP Secret Manager | CI-time (Fetched Step) |
| **Tooling Tokens** (`CODECOV_TOKEN`, `SLACK_WEBHOOK`) | GitHub Secrets | CI-time (Workflow Secret) |

- [x] **Provision Slots:** Add Sentry and Test credential slots to `module.secrets`.
- [ ] **Initial Seeding:** Execute the "Clean Slate" seeding via `gcloud` for the new Supabase Cloud instance.

---

## Phase 3: Service Promotion (Pilot Phase)
**Goal:** Migrate the first frontend/backend pair to Cloud Run with reusable CI logic.

- [x] **Reusable Workflow:** Create `.github/workflows/reusable-gcp-deploy.yml` at the root.
- [x] **Frontend Ready:** Refactor `planner-frontend` Dockerfile and `deploy.yml`.
- [ ] **Backend Ready:** Refactor `receptor-planner` deploy workflow to use the reusable template.
- [ ] **Traffic Promotion:** Deploy to Cloud Run Melbourne (`australia-southeast2`) and verify health probes.

---

## Phase 4: Decommissioning & Cleanup
**Goal:** Retirement of legacy technical debt.

1. **ARC Retirement:** Shutdown Hyper-V VMs hosting the self-hosted Github Runners.
2. **Vault Shutdown:** Export any final audit trails before decommissioning the Vault HA cluster.
3. **K3s Removal:** Drain and delete the local nodes once 100% of production traffic is on Cloud Run/Supabase Cloud.

---

## Verification Gates (Definition of Done)

### [Gate 1] Automated IaC Validation
- `terraform plan` triggered on PRs must show zero manual drift.
- WIF successfully exchanges a short-lived token for the `github-deployer` SA.

### [Gate 2] Build Accuracy
- `planner-ui` Docker build successfully inlines the *Cloud-hosted* Supabase URL via GCP Secret Manager.
- Sentry DSN is verified in the build logs.

### [Gate 3] E2E Regression
- Playwright tests fetch `TEST_ADMIN_EMAIL` from GCP and successfully authenticate against the Cloud Run endpoint.

### [Gate 4] Data Residency
- All resources (Secret Manager, Cloud Run, Artifact Registry) are pinned to `australia-southeast2`.
