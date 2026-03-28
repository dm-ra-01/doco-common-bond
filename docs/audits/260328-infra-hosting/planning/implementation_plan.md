# Migration Implementation Plan: GCP Managed Services

This plan outlines the steps to migrate Receptor backends and frontends from the self-hosted k3s cluster (with Azure/Vault dependencies) to a managed GCP Cloud Run architecture.

## Proposed Changes

### 1. GCP Foundation (IaC)
- [NEW] `receptor-infra/terraform/gcp/providers.tf`: Configure Google provider and OIDC auth.
- [NEW] `receptor-infra/terraform/gcp/main.tf`: Bootstrap Artifact Registry and Networking.
- [NEW] `receptor-infra/terraform/gcp/iam.tf`: Set up Workload Identity Federation (WIF) for GitHub.
- [NEW] `receptor-infra/terraform/gcp/secrets.tf`: Define Base Secret Manager schemas.

### 2. Secret Migration & Management
- [NEW] `scripts/migrate-vault-to-gcp.py`: A utility to read secrets from Vault KV and seed GCP Secret Manager.
- [MODIFY] `receptor-infra/terraform/gcp/secrets.tf`: Map Vault keys to GCP secrets.

### 3. CI/CD Pipeline (GitHub Actions)
- [MODIFY] `.github/workflows/deploy.yml` (in app repos): Replace `vault-action` and `arc-runner` with `google-github-actions/auth`.
- [MODIFY] `.github/workflows/ci.yml`: Standardize on `ubuntu-latest` and `google-github-actions/setup-gcloud`.

### 4. Service Pilot: `receptor-api`
- [NEW] `receptor-infra/terraform/gcp/services/planner.tf`: Cloud Run service definition for `receptor-planner`.

---

## Verification Plan

### Automated Tests
- **Terraform Plan:** Run `terraform plan` in `terraform/gcp` to verify resource graph.
- **OIDC Validation:** Run a test GitHub Action to verify `google-github-actions/auth` successfully exchanges a token with WIF.
- **Docker Build:** Trigger a build that fetches `NEXT_PUBLIC_*` build-args from GCP Secret Manager.

### Manual Verification
- **Cloud Run URL:** Verify that the pilot service `planner-api` is reachable via its `.a.run.app` URL.
- **Secret Access:** Use `gcloud secrets versions access` to verify that a migrated secret is readable in the Melbourne region.
- **Console Check:** Verify that data residency is strictly set to `australia-southeast2` (Melbourne) or `australia-southeast1` (Sydney).
