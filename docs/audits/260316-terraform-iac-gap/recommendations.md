<!-- audit-slug: 260316-terraform-iac-gap -->

# Recommendations — Terraform Infrastructure-as-Code Gap Audit

**Branch:** `audit/260316-terraform-iac-gap`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-16

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Credential model for Terraform CI | No long-lived Azure credentials in GitHub Secrets. Azure Workload Identity Federation via OIDC JWT. GitHub OIDC token exchanged for short-lived Vault token (existing receptor-infra-ci pattern), then Azure client_id/tenant_id retrieved from Vault KV. azurerm provider uses 'use_oidc = true' with values from Vault. This matches the existing cluster-sync.yml Slack notification pattern. |
| Terraform state backend | State stored in the existing Azure Storage Account (the same account the ARM template intends to create). The ARM template must be applied manually once as a bootstrap step to create the storage account before Terraform can initialise. After that, Terraform imports the resource and manages it going forward. |
| ARM template fate | The azure/ ARM template directory should be retired (deleted) once Terraform successfully imports and manages the storage account. It should not be maintained in parallel with Terraform as this creates confusion about the authoritative IaC method. |
| Terraform bootstrap scope | Terraform is scoped to Azure resources only: Key Vault, backup storage account, managed identity. k3s cluster manifests remain in helmfile.yaml / Kubernetes YAML — no Terraform for cluster-level resources. |
| Severity of IAC-01 and IAC-03 | Proposed as High (not Critical) because the existing cluster is operational and the gap is a disaster-recovery risk rather than an active security breach. The human auditor may escalate to Critical if a DR simulation is imminent. |


---

## 🟠 High

### IAC-01: No terraform/ directory exists in receptor-infra. Azure Key Vault (Vault auto-unseal), backup storage account, and manag

Affects: `receptor-infra` — azure


- [ ] Create terraform/ directory tree in receptor-infra: modules/key-vault/, modules/backup-storage/, modules/managed-identity/, plus root main.tf, variables.tf, outputs.tf, and backend.tf (AzureRM backend pointing at the existing storage account).
      `/receptor-infra/terraform/main.tf`
- [ ] Write terraform/modules/key-vault/ module: azurerm_key_vault resource with soft-delete enabled, purge protection enabled, public network access disabled (or restricted), and SKU Standard. Declare the auto-unseal managed identity permissions (azurerm_key_vault_access_policy or azurerm_role_assignment with Key Vault Crypto Service Encryption User role).
      `/receptor-infra/terraform/modules/key-vault/main.tf`
- [ ] Write terraform/modules/backup-storage/ module: azurerm_storage_account resource importing the configuration from the existing ARM template (TLS1_2, allowBlobPublicAccess=false, Cool tier, soft-delete 7d). The ARM template should be retired once Terraform manages this resource.
      `/receptor-infra/terraform/modules/backup-storage/main.tf`
- [ ] Write terraform/modules/managed-identity/ module: azurerm_user_assigned_identity for the Vault auto-unseal identity; include azurerm_role_assignment binding it to Key Vault Crypto Service Encryption User.
      `/receptor-infra/terraform/modules/managed-identity/main.tf`
- [ ] Import existing live Azure resources into Terraform state using 'terraform import' commands. Document the import commands in terraform/IMPORT.md so the one-time bootstrap is reproducible. After import, run 'terraform plan' and confirm zero drift.
      `/receptor-infra/terraform/IMPORT.md`

### IAC-03: Azure Key Vault, which provides auto-unseal for HashiCorp Vault (referenced in README.md bootstrap step 5: 'Azure KV aut

Affects: `receptor-infra` — azure


- [ ] Audit the live Azure Key Vault via 'az keyvault show' and 'az keyvault key list' to document the current configuration (name, resource group, SKU, purge protection, network rules, access policies). Capture this as the target state for terraform/modules/key-vault/. This is a prerequisite for IAC-01-T2.
      `/receptor-infra/terraform/modules/key-vault/variables.tf`

## 🟡 Medium

### IAC-02: azure/backup-storage-account.parameters.json contains "value": "&#60;SET_ME: e.g. receptorbackupsaus&#62;" for storageAccountNam

Affects: `receptor-infra` — azure


- [ ] Record the live storage account name in a comment or variable in the Terraform module (IAC-01-T3) so the actual deployed name is version-controlled. Do not patch the ARM parameters file — retire the ARM directory once Terraform is managing the resource.
      `/receptor-infra/terraform/modules/backup-storage/variables.tf`
- [ ] After Terraform import of the storage account is confirmed (IAC-01-T5), delete azure/ directory from receptor-infra and update README.md to remove the reference to ARM templates. The Terraform module becomes the canonical reference.
      `/receptor-infra/azure/backup-storage-account.parameters.json`

### IAC-04: No drift detection mechanism exists. There is no scheduled 'terraform plan' run or ARM what-if scan that would surface d

Affects: `receptor-infra` — azure


- [ ] Add a scheduled (weekly) GitHub Actions workflow that runs 'terraform plan -detailed-exitcode' and posts the plan summary to a Slack channel (or fails the job) if drift is detected. Reuse the OIDC JWT / Vault credential pattern from cluster-sync.yml. This is a gate-2 task: implement after Terraform modules are established.
      `/receptor-infra/.github/workflows/terraform-drift.yml`

### CI-01: No terraform-plan.yml or equivalent CI workflow exists. The desired state — Terraform plan on PR and apply on merge to m

Affects: `receptor-infra` — .github/workflows


- [ ] Create .github/workflows/terraform-plan.yml: triggers on pull_request (paths: terraform/**). Steps: checkout, setup-terraform, (OIDC → Vault JWT → retrieve Azure federated creds), terraform init, terraform validate, terraform plan. Post plan as PR comment using hashicorp/setup-terraform action. Runner: arc-runner-receptor-infra.
      `/receptor-infra/.github/workflows/terraform-plan.yml`
- [ ] Create .github/workflows/terraform-apply.yml: triggers on push to main (paths: terraform/**). Steps identical to plan workflow except final step runs 'terraform apply -auto-approve'. No long-lived Azure credentials in GitHub Secrets — credentials sourced from Vault via OIDC JWT (same pattern as cluster-sync.yml Slack notification step).
      `/receptor-infra/.github/workflows/terraform-apply.yml`

### CI-02: The Vault JWT role 'receptor-infra-ci' (used in cluster-sync.yml) is documented only as granting access to 'secret/infra

Affects: `receptor-infra` — vault


- [ ] Create Vault KV secret at 'secret/infrastructure/azure-terraform' containing: client_id (managed identity client ID), tenant_id, subscription_id. These are non-sensitive identifiers used to configure azurerm provider Workload Identity Federation — no client_secret required.
      `/receptor-infra/docs/vault-policies.md`
- [ ] Create Vault policy 'receptor-infra-tf' with read access to 'secret/data/infrastructure/azure-terraform'. Create Vault JWT role 'receptor-infra-tf-ci' bound to this policy and scoped to the receptor-infra GitHub repository (bound_claims: sub = repo:dm-ra-01/receptor-infra:*). Document in vault-configuration.md.
      `/receptor-infra/docs/vault-policies.md`

## 🟢 Low

### ARM-01: azure/backup-storage-account.parameters.json, line 10: storageAccountName value is "&#60;SET_ME: e.g. receptorbackupsaus&#62;". 

Affects: `receptor-infra` — azure


- [ ] Resolve as part of IAC-02-T1 and IAC-02-T2: record actual storage account name in Terraform variables, then retire the ARM directory. No standalone fix required.
      `/receptor-infra/azure/backup-storage-account.parameters.json`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | IAC-03, CI-02 | Before writing any Terraform, the live Azure resource configuration must be documented and the Vault policy/role for Terraform CI must be created. These are prerequisites for all subsequent phases. |
| 2 | IAC-01, IAC-02 | Write Terraform modules for Key Vault, backup storage, and managed identity. Import existing resources into state. Retire the ARM template directory once import is confirmed. |
| 3 | CI-01 | Implement terraform-plan.yml (PR gate) and terraform-apply.yml (merge-to-main apply). Depends on Phase 1 (Vault policy) and Phase 2 (modules exist to plan/apply). |
| 4 | IAC-04, ARM-01 | Add scheduled drift detection workflow once the apply workflow is proven stable. ARM-01 is resolved as part of IAC-02 retirement — included here to confirm closure. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| IAC-01 | azure | `main.tf` | Process Gap | 🟠 High |
| IAC-03 | azure | `variables.tf` | Process Gap | 🟠 High |
| IAC-02 | azure | `variables.tf` | Tech Debt | 🟡 Medium |
| IAC-04 | azure | `terraform-drift.yml` | Process Gap | 🟡 Medium |
| CI-01 | .github/workflows | `terraform-plan.yml` | Process Gap | 🟡 Medium |
| CI-02 | vault | `vault-policies.md` | Process Gap | 🟡 Medium |
| ARM-01 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟢 Low |

