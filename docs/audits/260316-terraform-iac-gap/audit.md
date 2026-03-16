# Terraform Infrastructure-as-Code Gap Audit

**Date:** 2026-03-16\
**Scope:** `receptor-infra` (primary) · `documentation/common-bond` (output)\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO 27001 A.8.9 (Configuration Management), A.8.32 (Change Management)

---

## Executive Summary

The audit examined the `receptor-infra` repository for Infrastructure-as-Code coverage of Azure resources that underpin the Receptor k3s cluster. Six findings were identified: 2 High, 3 Medium, and 1 Low. Azure Key Vault (Vault auto-unseal), backup storage account, and managed identities are entirely absent from any IaC toolchain — provisioned ad-hoc with no state tracking, no drift detection, and no CI-gated apply workflow. The ARM template that partially documents the backup storage account has an uncommitted `<SET_ME>` placeholder in its parameters file, indicating it has never been applied from the repository. The OIDC JWT / Vault credential pattern required by the desired Terraform CI workflow already exists and is proven in `cluster-sync.yml` — the implementation path is clear.

| Repository / Area    | Coverage | Issues Found | Overall |
| -------------------- | -------- | ------------ | ------- |
| `receptor-infra` — Azure IaC | ❌ | 4 | Critical gap |
| `receptor-infra` — CI workflows | ⚠️ | 2 | Partial |
| `receptor-infra` — ARM template parameterisation | ❌ | 1 | Never applied |

---

## 1. Azure Infrastructure-as-Code

### 1.1 Terraform Absence

**Strengths:**

- Repository description explicitly scopes the repo as "k3s cluster lifecycle management" — the gap is acknowledged, not hidden.
- `README.md` bootstrap order documents manual Step 5 (`vault operator init`) and notes Azure Key Vault auto-unseal, giving future operators a breadcrumb.

**Gaps:**

- **IAC-01** — No `terraform/` directory exists anywhere in `receptor-infra`. Azure Key Vault (used for Vault auto-unseal), the backup storage account, and any managed identities were provisioned interactively via the Azure Portal or CLI. There is no IaC source of truth, no state file, and no way to reconstruct the current Azure resource configuration deterministically.
- **IAC-02** — `azure/backup-storage-account.template.json` and `azure/backup-storage-account.parameters.json` exist as the only Azure IaC artefacts, but the parameters file contains `"value": "<SET_ME: e.g. receptorbackupsaus>"` for `storageAccountName`. This placeholder has persisted since the file was first committed, confirming the ARM template has never been applied from the repository. The actual live storage account name — used as the Terraform backend and Vault backup destination — is unrecorded in version control.
- **IAC-03** — Azure Key Vault, which provides the Azure Key Vault Provider auto-unseal for HashiCorp Vault (referenced in `README.md` Step 5), has no IaC representation of any kind. The vault name, SKU, access policies, and the managed identity granted wrap/unwrap permissions are unknown without manual portal inspection.

### 1.2 Drift Detection

**Gaps:**

- **IAC-04** — No drift detection mechanism exists. There is no scheduled `terraform plan` or ARM `what-if` run that would surface discrepancies between the live Azure resource state and any declared configuration. Manual changes to Key Vault access policies or storage account network ACLs would be invisible until an operational failure.

---

## 2. CI Workflow Coverage

### 2.1 Existing Workflow

**Strengths:**

- `cluster-sync.yml` demonstrates a complete OIDC JWT / HashiCorp Vault credential pattern: OIDC token is minted by GitHub Actions, exchanged for a short-lived Vault token via `auth/jwt/login` (role `receptor-infra-ci`), and used to retrieve secrets. This same pattern can be extended to federate Azure credentials for Terraform without any new secrets mechanism.
- The `arc-runner-receptor-infra` self-hosted runner is already provisioned and operational; no new runner infrastructure is needed for a Terraform workflow.
- GitHub Actions SHA-pinning is correctly applied (`actions/checkout@11bd71901...`).

**Gaps:**

- **CI-01** — No `terraform-plan.yml` or equivalent workflow exists. The desired state (Terraform plan on PR, apply on merge to `main`) has no implementation. Any Terraform change today would require a manual `az login` and `terraform apply` from a local machine.
- **CI-02** — The Vault JWT role `receptor-infra-ci` (used in `cluster-sync.yml`) grants access to `secret/infrastructure/slack-incidents-webhook`. There is no documented Vault policy that would also permit an Azure federated credential lookup — the Vault policy scope would need to be extended or a dedicated `receptor-infra-tf` role created for Terraform `plan`/`apply` runs.

---

## 3. ARM Template Parameterisation

### 3.1 Placeholder Status

**Gaps:**

- **ARM-01** — `azure/backup-storage-account.parameters.json` line 10: `"value": "<SET_ME: e.g. receptorbackupsaus>"`. The storage account name is the single un-parameterised value blocking a CLI-driven deployment. All other parameters (TLS version, soft-delete retention, network ACLs, access tier) are fully specified and appropriately conservative (`allowBlobPublicAccess: false`, `allowSharedKeyAccess: true`, `TLS1_2`). However, with Terraform as the desired target, this ARM template should be superseded rather than patched — its continued presence risks confusion about the authoritative IaC method.

---

## 4. Cross-Cutting Observations

1. **OIDC JWT re-use opportunity.** The `cluster-sync.yml` Vault OIDC flow is production-proven. Extending it for Azure OIDC federation (via `azure/login` action and Workload Identity Federation) requires only a new Vault KV secret containing the Azure client ID and tenant ID — no long-lived `AZURE_CLIENT_SECRET` in GitHub Secrets. This is the lowest-risk path to credential-free Terraform CI.

2. **State backend circularity.** The Terraform state backend (desired: the existing Azure Storage Account) cannot be managed by Terraform itself. The storage account must exist before Terraform initialises. The ARM template (`backup-storage-account.template.json`) — if applied manually as a one-time bootstrap — cleanly solves this bootstrapping problem, after which Terraform takes over all subsequent management.

3. **ISO 27001 A.8.9 exposure.** Configuration Management requires that infrastructure configurations are documented, version-controlled, and recoverable. The current state — Key Vault and storage account provisioned ad-hoc — is a direct control gap. A drift event (e.g. accidental deletion of Key Vault) would leave Vault sealed cluster-wide until manually recovered.

4. **Managed Identity gap.** The auto-unseal relationship requires a managed identity (or service principal) bound to Key Vault with `wrap` and `unwrap` key permissions. This identity is not represented anywhere in the repository. If the identity is deleted or its permissions modified, Vault will fail to unseal on the next pod restart.

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity |
| ---------- | ----------------- | ---- | -------- | -------- |
| IAC-01 | `receptor-infra` — Azure IaC | *(absent)* | Process Gap | 🔴 High |
| IAC-03 | `receptor-infra` — Key Vault | *(absent)* | Process Gap | 🔴 High |
| IAC-04 | `receptor-infra` — Azure IaC | *(absent)* | Process Gap | 🟠 Medium |
| CI-01 | `receptor-infra` — CI | *(absent)* | Process Gap | 🟠 Medium |
| CI-02 | `receptor-infra` — CI / Vault | `.github/workflows/cluster-sync.yml` | Process Gap | 🟠 Medium |
| IAC-02 | `receptor-infra` — ARM | `azure/backup-storage-account.parameters.json` | Tech Debt | 🟠 Medium |
| ARM-01 | `receptor-infra` — ARM | `azure/backup-storage-account.parameters.json` | Tech Debt | 🟡 Low |
