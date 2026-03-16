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
| Credential model for Terraform CI | No long-lived Azure credentials in GitHub Secrets. Azure Workload Identity Federation via OIDC JWT. GitHub OIDC token exchanged for short-lived Vault token (existing receptor-infra-ci pattern), then Azure client_id/tenant_id retrieved from Vault KV. azurerm provider uses use_oidc=true. This matches the existing cluster-sync.yml Slack notification pattern. |
| Terraform state backend | State stored in k3sbackups71a475f1dae6 storage account in a NEW dedicated container named 'tfstate' (not the existing receptor-backups container). Container must be created before terraform init as a one-time bootstrap step. |
| ARM template fate | The azure/ ARM template directory should be deleted (git rm -r azure/) once Terraform successfully imports and manages both resources. Not to be maintained in parallel. |
| Terraform scope | Terraform manages Azure resources only: Key Vault K3sUnlock, storage account k3sbackups71a475f1dae6, and the vault-k3s-unseal service principal (or its managed identity replacement). k3s cluster manifests remain in helmfile.yaml / Kubernetes YAML. |
| Live Azure resource details (confirmed via az CLI) | Subscription: 303d0b34-0b31-4302-a133-f1bd1e61f4b7. Resource group: Receptor. Location: australiasoutheast. Key Vault: K3sUnlock (URI: https://k3sunlock.vault.azure.net/). Storage account: k3sbackups71a475f1dae6 (SKU: Standard_RAGRS). Auto-unseal SP: vault-k3s-unseal (appId: aad24e26-8e10-4751-90ea-fb43bd147250, objectId: 26b134d5-deb6-4856-8c48-3d5f8b3c6262). Tenant: 76c68bd9-6fba-42d1-bf81-471e2e8c1395. |
| VM platform (k3s on Hyper-V) | k3s VMs run on on-premise Hyper-V (Windows host). No native Azure VM Managed Identity available unless VMs are Arc-enrolled. Preferred SEC-02 remediation is Azure AD Workload Identity Federation bound to the Vault Kubernetes service account JWT — eliminates client secret without requiring Arc enrollment. |
| Severity of SEC-02 | Proposed as Critical because a long-lived client secret for the auto-unseal identity is unrotatable without Vault downtime risk, and its storage location (values file or Vault KV) is unconfirmed. Human auditor may adjust severity after SEC-02-T1 locates the secret. |


---

## 🔴 Critical

### SEC-02: The auto-unseal identity for HashiCorp Vault is an App Registration service principal ('vault-k3s-unseal', appId: aad24e

Affects: `receptor-infra` — azure


- [ ] Locate where the vault-k3s-unseal client secret is currently stored: search receptor-infra/values/ for any Vault Helm values referencing azure.clientId or azure.clientSecret, and check Vault KV at secret/infrastructure/azure-unseal. Document the finding — if the secret is in a plaintext values file it is an immediate exposure that must be remediated before everything else.
      `/receptor-infra/values/vault.yaml.gotmpl`
- [ ] Evaluate feasibility of Workload Identity Federation for vault-k3s-unseal: if k3s VMs cannot be Arc-enrolled, configure Azure AD Workload Identity Federation on the vault-k3s-unseal App Registration, binding it to the Vault Kubernetes service account JWT. This eliminates the client secret. Alternatively, if Arc enrollment is feasible, migrate to a User-Assigned Managed Identity instead.
      `/receptor-infra/docs/azure-identity.md`
- [ ] Once the identity migration is complete, revoke the vault-k3s client secret (via 'az ad app credential delete') and confirm Vault auto-unseal continues to function via 'vault status'. Update Terraform modules/managed-identity or modules/service-principal to manage the new identity resource.
      `/receptor-infra/terraform/modules/managed-identity/main.tf`

## 🟠 High

### IAC-01: No terraform/ directory exists. Azure Key Vault K3sUnlock, storage account k3sbackups71a475f1dae6, and service principal

Affects: `receptor-infra` — azure


- [ ] Create terraform/ directory structure: modules/key-vault/, modules/backup-storage/, modules/service-principal/, and root main.tf, variables.tf, outputs.tf, providers.tf (azurerm with use_oidc=true, workload identity federation), and backend.tf (azurerm backend: storage_account_name=k3sbackups71a475f1dae6, container_name=tfstate, key=receptor/azure.tfstate).
      `/receptor-infra/terraform/main.tf`
- [ ] Create blob container 'tfstate' in k3sbackups71a475f1dae6 before terraform init (one-time bootstrap: 'az storage container create --name tfstate --account-name k3sbackups71a475f1dae6'). The receptor-backups container must not share state.
      `/receptor-infra/terraform/BOOTSTRAP.md`
- [ ] Write terraform/modules/key-vault/: azurerm_key_vault (name=K3sUnlock, sku=Standard, soft_delete_retention_days=90, purge_protection_enabled=true), azurerm_key_vault_key (name=vault-unseal, key_type=RSA), and azurerm_key_vault_access_policy for SEC-02 identity. Import existing resources: 'terraform import azurerm_key_vault.k3sunlock /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.KeyVault/vaults/K3sUnlock'.
      `/receptor-infra/terraform/modules/key-vault/main.tf`
- [ ] Write terraform/modules/backup-storage/: azurerm_storage_account (name=k3sbackups71a475f1dae6, sku=Standard_RAGRS — matching live state not ARM template, min_tls_version=TLS1_2, allow_blob_public_access=false, account_kind=StorageV2, access_tier=Cool). Import: 'terraform import azurerm_storage_account.backup /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.Storage/storageAccounts/k3sbackups71a475f1dae6'.
      `/receptor-infra/terraform/modules/backup-storage/main.tf`
- [ ] Run 'terraform import' for all resources, then 'terraform plan'. Confirm plan shows zero changes for stable properties (name, sku, soft-delete) and proposed changes only for remediation items (e.g., KV network ACLs per SEC-01). Document import commands in terraform/BOOTSTRAP.md.
      `/receptor-infra/terraform/BOOTSTRAP.md`

### IAC-03: Azure Key Vault K3sUnlock (URI: https://k3sunlock.vault.azure.net/) and its access policies have no IaC representation. 

Affects: `receptor-infra` — azure


- [ ] Resolved as part of IAC-01-T3 (Terraform module + import). No standalone action required — live state is now fully documented in this audit.
      `/receptor-infra/terraform/modules/key-vault/main.tf`

### SEC-01: Key Vault K3sUnlock has networkAcls.defaultAction=Allow with zero IP rules and no virtual network rules. The vault URI h

Affects: `receptor-infra` — azure


- [ ] Determine the public egress IP of the Hyper-V host (or the static IP if one exists). Add an azurerm_key_vault network_acls block in the Terraform module: default_action=Deny, bypass=[AzureServices], ip_rules=[&#60;host-egress-ip&#62;/32]. Apply via terraform-apply.yml after CI workflow is established (Phase 3). Do not apply manually — this must go through the CI gate.
      `/receptor-infra/terraform/modules/key-vault/main.tf`

## 🟡 Medium

### IAC-02: azure/backup-storage-account.parameters.json has three discrepancies from live state: (1) storageAccountName: &#60;SET_ME&#62; v

Affects: `receptor-infra` — azure


- [ ] After Terraform import of the storage account is confirmed (IAC-01-T4/T5), delete the azure/ directory from receptor-infra ('git rm -r azure/'). Update README.md to remove the ARM template reference and replace it with a pointer to terraform/. Commit on a feature branch.
      `/receptor-infra/azure/backup-storage-account.parameters.json`

### IAC-04: No drift detection exists. The SKU discrepancy (Standard_LRS in ARM vs Standard_RAGRS live) and location discrepancy (au

Affects: `receptor-infra` — azure


- [ ] Create .github/workflows/terraform-drift.yml: scheduled weekly (cron: '0 2 * * 1'), runs terraform plan -detailed-exitcode on arc-runner-receptor-infra. Exit code 2 (changes detected) fails the job and triggers Slack notification via the existing OIDC→Vault→Slack pattern from cluster-sync.yml. Implement in Phase 4 after apply workflow is proven.
      `/receptor-infra/.github/workflows/terraform-drift.yml`

### CI-01: No terraform-plan.yml or terraform-apply.yml CI workflow exists. Any Terraform change today requires local az login and 

Affects: `receptor-infra` — .github/workflows


- [ ] Create .github/workflows/terraform-plan.yml: trigger on pull_request (paths: terraform/**). Steps: checkout, setup-terraform, OIDC→Vault JWT exchange (reuse pattern from cluster-sync.yml), retrieve Azure Workload Identity credentials from Vault KV, terraform init (AzureRM backend: k3sbackups71a475f1dae6/tfstate/receptor/azure.tfstate), terraform validate, terraform plan. Post plan output as PR comment. Runner: arc-runner-receptor-infra.
      `/receptor-infra/.github/workflows/terraform-plan.yml`
- [ ] Create .github/workflows/terraform-apply.yml: trigger on push to main (paths: terraform/**). Steps identical to plan workflow with final step 'terraform apply -auto-approve'. No AZURE_CLIENT_SECRET in GitHub Secrets — all credentials from Vault KV via OIDC JWT.
      `/receptor-infra/.github/workflows/terraform-apply.yml`

### CI-02: No Vault JWT role or KV path exists for Azure credentials in a Terraform CI context. The receptor-infra-ci Vault role on

Affects: `receptor-infra` — vault


- [ ] Create Vault KV secret at secret/infrastructure/azure-terraform containing: client_id (vault-k3s-unseal appId or future managed identity client ID), tenant_id (76c68bd9-6fba-42d1-bf81-471e2e8c1395), subscription_id (303d0b34-0b31-4302-a133-f1bd1e61f4b7). No client_secret if Workload Identity Federation is used.
      `/receptor-infra/docs/vault-policies.md`
- [ ] Create Vault policy receptor-infra-tf with read access to secret/data/infrastructure/azure-terraform. Create Vault JWT role receptor-infra-tf-ci bound to this policy, scoped to repo dm-ra-01/receptor-infra (bound_claims: sub=repo:dm-ra-01/receptor-infra:*). Document in vault-configuration.md in supabase-receptor.
      `/receptor-infra/docs/vault-policies.md`

## 🟢 Low

### ARM-01: azure/backup-storage-account.parameters.json has three value discrepancies from live state (storageAccountName placehold

Affects: `receptor-infra` — azure


- [ ] Resolved as part of IAC-02-T1 (delete azure/ directory after Terraform import). No standalone fix required.
      `/receptor-infra/azure/backup-storage-account.parameters.json`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | SEC-02, CI-02 | Before any Terraform or CI work: (1) find where the vault-k3s-unseal client secret is stored (SEC-02-T1) and remediate if in plaintext values file; (2) create Vault JWT role and KV path for Terraform CI credentials (CI-02). These are prerequisites for all subsequent phases. |
| 2 | IAC-01, IAC-03 | Create tfstate container, write Terraform modules for Key Vault and storage account using confirmed live resource identifiers, run terraform import, confirm zero-drift plan. IAC-03 is resolved as part of IAC-01-T3. |
| 3 | CI-01, IAC-02 | Implement terraform-plan.yml and terraform-apply.yml using OIDC JWT/Vault credential pattern. After apply workflow is proven, delete the azure/ ARM directory (IAC-02). |
| 4 | SEC-01, IAC-04, ARM-01 | Apply KV network ACL restriction (SEC-01) via the new apply workflow. Add scheduled drift detection (IAC-04). Confirm ARM-01 retirement from Phase 3. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| SEC-02 | azure | `vault.yaml.gotmpl` | Security | 🔴 Critical |
| IAC-01 | azure | `main.tf` | Process Gap | 🟠 High |
| IAC-03 | azure | `main.tf` | Process Gap | 🟠 High |
| SEC-01 | azure | `main.tf` | Security | 🟠 High |
| IAC-02 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟡 Medium |
| IAC-04 | azure | `terraform-drift.yml` | Process Gap | 🟡 Medium |
| CI-01 | .github/workflows | `terraform-plan.yml` | Process Gap | 🟡 Medium |
| CI-02 | vault | `vault-policies.md` | Process Gap | 🟡 Medium |
| ARM-01 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟢 Low |

