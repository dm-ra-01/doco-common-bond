# CI/CD Architecture & Strategy: GCP Cloud Run
# Audit ref: 260328-infra-hosting — HOSTING-19

This document defines the "Gold Standard" for the Receptor ecosystem's CI/CD pipeline. Following the retirement of the self-hosted k3s cluster, all services are transitioning to a managed, immutable deployment model on Google Cloud Platform.

---

## 1. Design Principles

- **Zero-Static-Secrets:** Eliminate long-lived service account keys in GitHub Secrets. Use OIDC/WIF.
- **Environment Isolation:** Maintain strict separation between `staging` and `production` projects.
- **Infrastructure-as-Code (IaC):** Every GCP resource must be provisioned via Terraform. Manual Console edits are strictly prohibited.
- **Immutable Artifacts:** Images are built once and promoted through environments (Audit: HOSTING-16).
- **Automated Validation:** PRs are gated by static analysis, unit tests, and Terraform plans.

---

## 2. Identity & Security (Workload Identity)

We use **Workload Identity Federation (WIF)** to grant GitHub Actions permission to interact with GCP without managing JSON keys.

### 2.1 The Exchange Flow
1. **GitHub** issues a JWT to the runner per job.
2. **GCP STS** validates the GitHub JWT against the OIDC Provider.
3. **GCP IAM** exchanges the JWT for a short-lived access token for the `github-deployer` service account.

### 2.2 Project Scoping
- **Staging Project:** Access limited to `push` events on feature branches or PRs.
- **Production Project:** Access limited to `push` events on the `main` branch.

---

## 3. Secret Management Lifecycle

Secrets are no longer stored in GitHub Actions secrets (except for the initial WIF provider ID).

1. **Storage:** Secrets live in **GCP Secret Manager** (Melbourne region).
2. **Build-Time (Frontends):** Next.js `NEXT_PUBLIC_*` variables are fetched via `gcloud` during the CI build step and passed as `--build-arg` to Docker.
3. **Run-Time (Backends):** FastAPI services mount secrets as environment variables directly in the Cloud Run service definition.

---

## 4. The Release Pipeline

### 4.1 PR Validation (The Gate)
- **Repo:** Any frontend/backend.
- **Actions:**
    - Linting (ESLint / Ruff).
    - Unit Tests (Vitest / Pytest).
    - **Terraform Plan:** Run in `receptor-infra/terraform/gcp` to preview infrastructure changes.

### 4.2 Staging Deployment (The Sandbox)
- **Trigger:** Merge to `main`.
- **Target:** `common-bond-receptor-staging` (GCP) and `supabase-staging` (Cloud).
- **Actions:**
    - Build image with `staging` build-args.
    - Push to Artifact Registry (`australia-southeast2`).
    - Deploy to Cloud Run (Revision creation).
    - **Post-Deploy:** Run Playwright E2E tests against the staging URL.

### 4.3 Production Promotion (The Goal)
- **Trigger:** Manual Approval / Release Tag.
- **Target:** `common-bond-receptor` (GCP) and `supabase-production` (Cloud).
- **Actions:**
    - Promote the *same* image (or rebuild with prod secrets if hardcoded).
    - Update Cloud Run traffic (100% to new revision).

---

## 5. Supabase Integration Strategy

To maintain database integrity in CI/CD:
- **Drift Detection:** CI runs `supabase db diff --use-migra` to ensure local schemas match migration files.
- **Schema Reconciliation:** Every merge to `main` must include a reconciled `supabase/migrations/schema_sql.sql`.

---

## 6. Implementation Roadmap

1. **[Q1 2026]** Establish WIF and Secret Manager foundation (IaC).
2. **[Q2 2026]** Migrate `match-backend` as the pilot Cloud Run service.
3. **[Q2 2026]** Transition frontends to Cloud Run with Build-Arg injection.
4. **[Q3 2026]** Full retirement of ARC runners and k3s cluster.
