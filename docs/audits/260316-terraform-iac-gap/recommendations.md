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
| Credential model for Terraform CI | No long-lived Azure credentials in GitHub Secrets. Azure Workload Identity Federation via OIDC JWT. GitHub OIDC token exchanged for short-lived Vault token (existing receptor-infra-ci pattern), then Azure client_id/tenant_id retrieved from Vault KV. azurerm provider uses use_oidc=true. Matches existing cluster-sync.yml Slack notification pattern. |
| Terraform state backend | State stored in k3sbackups71a475f1dae6 in a NEW dedicated container named 'tfstate' (NOT the existing receptor-backups container). Container created as one-time bootstrap before terraform init. Backend uses use_azuread_auth=true. |
| ARM template fate | The azure/ ARM template directory should be deleted (git rm -r azure/) once Terraform successfully imports and manages both resources. Not to be maintained in parallel. |
| Terraform scope | Terraform manages Azure resources only: Key Vault K3sUnlock, storage account k3sbackups71a475f1dae6, and the vault-k3s-unseal service principal (or its Workload Identity Federation replacement). k3s cluster manifests remain in helmfile.yaml / Kubernetes YAML. |
| Live Azure resource details (confirmed via az CLI) | Subscription: 303d0b34-0b31-4302-a133-f1bd1e61f4b7. Resource group: Receptor. Location: australiasoutheast. Key Vault: K3sUnlock (URI: https://k3sunlock.vault.azure.net/). Storage account: k3sbackups71a475f1dae6 (SKU: Standard_RAGRS). Auto-unseal SP: vault-k3s-unseal (appId: aad24e26-8e10-4751-90ea-fb43bd147250, objectId: 26b134d5-deb6-4856-8c48-3d5f8b3c6262). Tenant: 76c68bd9-6fba-42d1-bf81-471e2e8c1395. Unseal key: vault-unseal (RSA, no expiry, no rotation policy). |
| VM platform (k3s on Hyper-V) | k3s VMs run on on-premise Hyper-V. No native Azure VM Managed Identity unless Arc-enrolled. Preferred SEC-02 remediation: Azure AD Workload Identity Federation bound to the Vault Kubernetes SA (sa-vault in vault namespace) — eliminates client secret, no Arc enrollment required. |
| Severity of SEC-02 | Confirmed Critical. vault.yaml uses secretKeyRef from vault-azure-kms k8s Secret (NOT plaintext values file — good). vault-azure-kms has no VSO sync (STORE-01). Preferred fix is Workload Identity Federation (SEC-02-T1) which eliminates the client secret entirely. Human auditor may downgrade to High if STORE-01 VSO sync is implemented as interim measure. |
| SEC-04 robustness requirement | SEC-04-T2 (disabling allowSharedKeyAccess) must NOT be applied until ALL consumers of the storage account (Terraform backend AND any backup scripts in supabase-receptor or other repos) have been confirmed to use Azure AD auth. SEC-04-T1 (use_azuread_auth=true on backend) must succeed in CI first. Pre-flight consumer audit is mandatory. |


---

## 🔴 Critical

### SEC-02: The auto-unseal identity for HashiCorp Vault is an App Registration service principal ('vault-k3s-unseal', appId: aad24e

Affects: `receptor-infra` — azure


- [ ] Evaluate Azure AD Workload Identity Federation for vault-k3s-unseal: configure federation on the vault-k3s-unseal App Registration, binding it to the Vault Kubernetes service account JWT (sa-vault in vault namespace). Update values/vault.yaml to use the federated identity (AZURE_CLIENT_ID + AZURE_TENANT_ID only, no AZURE_CLIENT_SECRET). On-premise k3s is supported as long as the OIDC issuer URL is reachable by Azure AD (expose via Cloudflare Tunnel or public endpoint).
      `/receptor-infra/values/vault.yaml`
- [ ] Once Workload Identity Federation is confirmed working ('vault status' shows unsealed after pod restart), revoke the vault-k3s client secret via 'az ad app credential delete --id aad24e26-8e10-4751-90ea-fb43bd147250 --key-id &#60;credential-id&#62;'. Remove AZURE_CLIENT_SECRET from the vault-azure-kms k8s secret and from values/vault.yaml extraEnvironmentVars. Update Terraform to manage the service principal without a credential.
      `/receptor-infra/terraform/modules/service-principal/main.tf`

## 🟠 High

### IAC-01: No terraform/ directory exists. Azure Key Vault K3sUnlock, storage account k3sbackups71a475f1dae6, and service principal

Affects: `receptor-infra` — azure


- [ ] Create terraform/ directory structure: modules/key-vault/, modules/backup-storage/, modules/service-principal/, and root main.tf, variables.tf, outputs.tf, providers.tf (azurerm with use_oidc=true, workload identity federation), and backend.tf (azurerm backend: storage_account_name=k3sbackups71a475f1dae6, container_name=tfstate, key=receptor/azure.tfstate, use_azuread_auth=true).
      `/receptor-infra/terraform/main.tf`
- [ ] Create blob container 'tfstate' in k3sbackups71a475f1dae6 before terraform init (one-time bootstrap: 'az storage container create --name tfstate --account-name k3sbackups71a475f1dae6 --auth-mode login'). The receptor-backups container must not share state. Grant Storage Blob Data Contributor to the Terraform CI identity on this container only.
      `/receptor-infra/terraform/BOOTSTRAP.md`
- [ ] Write terraform/modules/key-vault/: azurerm_key_vault (name=K3sUnlock, sku=Standard, soft_delete_retention_days=90, purge_protection_enabled=true, public_network_access_enabled=true initially), azurerm_key_vault_key (name=vault-unseal, key_type=RSA, rotation_policy per SEC-03), and azurerm_key_vault_access_policy blocks. Import: 'terraform import azurerm_key_vault.k3sunlock /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.KeyVault/vaults/K3sUnlock'.
      `/receptor-infra/terraform/modules/key-vault/main.tf`
- [ ] Write terraform/modules/backup-storage/: azurerm_storage_account (name=k3sbackups71a475f1dae6, account_replication_type=RAGRS — matching live state not ARM template, min_tls_version=TLS1_2, allow_nested_items_to_be_public=false, account_kind=StorageV2, access_tier=Cool, shared_access_key_enabled=true initially — see SEC-04 for hardening path). Import: 'terraform import azurerm_storage_account.backup /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.Storage/storageAccounts/k3sbackups71a475f1dae6'.
      `/receptor-infra/terraform/modules/backup-storage/main.tf`
- [ ] Run 'terraform import' for all resources, then 'terraform plan'. Confirm plan shows zero changes for stable properties (name, sku, soft-delete, RAGRS) and proposed changes only for remediation items (KV network ACLs per SEC-01, key rotation per SEC-03). Document import commands in terraform/BOOTSTRAP.md.
      `/receptor-infra/terraform/BOOTSTRAP.md`

### IAC-03: Azure Key Vault K3sUnlock (URI: https://k3sunlock.vault.azure.net/) and its access policies have no IaC representation. 

Affects: `receptor-infra` — azure


- [ ] Resolved as part of IAC-01-T3 (Terraform module + import). Live state fully documented in this audit. No standalone action required.
      `/receptor-infra/terraform/modules/key-vault/main.tf`

### SEC-01: Key Vault K3sUnlock has networkAcls.defaultAction=Allow with zero IP rules and no virtual network rules (confirmed via a

Affects: `receptor-infra` — azure


- [ ] Determine the public egress IP of the Hyper-V host. Add an azurerm_key_vault network_acls block in the Terraform module: default_action=Deny, bypass=[AzureServices], ip_rules=[&#60;host-egress-ip&#62;/32]. Apply via terraform-apply.yml after CI workflow is established (Phase 5). Do not apply manually.
      `/receptor-infra/terraform/modules/key-vault/main.tf`

### STORE-01: The Kubernetes secret 'vault-azure-kms' in the vault namespace (referenced by values/vault.yaml secretKeyRef for AZURE_T

Affects: `receptor-infra` — vault


- [ ] Determine where vault-azure-kms is currently sourced: run 'vault kv get secret/infrastructure/azure-unseal'. If the path exists, create vault/vso-azure-kms-secret.yaml as a VaultStaticSecret CRD mirroring vault/vso-github-app-secret.yaml (kv-v2, path=infrastructure/azure-unseal, destination.name=vault-azure-kms, namespace=vault, refreshAfter=1h). If not in Vault KV, store it there first then create the CRD.
      `/receptor-infra/vault/vso-azure-kms-secret.yaml`
- [ ] If SEC-02 Workload Identity Federation migration is implemented first, vault-azure-kms becomes unnecessary. Delete the k8s secret, remove the AZURE_CLIENT_SECRET extraEnvironmentVar from values/vault.yaml, and skip STORE-01-T1. This is the preferred path — it eliminates the secret rather than managing its lifecycle.
      `/receptor-infra/values/vault.yaml`

## 🟡 Medium

### IAC-02: azure/backup-storage-account.parameters.json has three discrepancies from live state: (1) storageAccountName: &#60;SET_ME&#62; v

Affects: `receptor-infra` — azure


- [ ] After Terraform import of the storage account is confirmed (IAC-01-T4/T5), delete the azure/ directory from receptor-infra ('git rm -r azure/'). Update README.md to remove the ARM template reference and replace with a pointer to terraform/. Commit on a feature branch.
      `/receptor-infra/azure/backup-storage-account.parameters.json`

### IAC-04: No drift detection exists. The SKU discrepancy (Standard_LRS in ARM vs Standard_RAGRS live) and location discrepancy (au

Affects: `receptor-infra` — azure


- [ ] Create .github/workflows/terraform-drift.yml: scheduled weekly (cron: '0 2 * * 1'), runs terraform plan -detailed-exitcode on arc-runner-receptor-infra. Exit code 2 (changes detected) fails the job and triggers Slack notification via the existing OIDC→Vault→Slack pattern from cluster-sync.yml. Implement in Phase 5 after apply workflow is proven.
      `/receptor-infra/.github/workflows/terraform-drift.yml`

### CI-01: No terraform-plan.yml or terraform-apply.yml CI workflow exists. Any Terraform change today requires local az login and 

Affects: `receptor-infra` — .github/workflows


- [ ] Create .github/workflows/terraform-plan.yml: trigger on pull_request (paths: terraform/**). Steps: checkout, setup-terraform, OIDC→Vault JWT exchange (reuse pattern from cluster-sync.yml), retrieve Azure Workload Identity credentials from Vault KV secret/infrastructure/azure-terraform, terraform init (AzureRM backend, use_azuread_auth=true), terraform validate, terraform plan. Post plan output as PR comment. Runner: arc-runner-receptor-infra.
      `/receptor-infra/.github/workflows/terraform-plan.yml`
- [ ] Create .github/workflows/terraform-apply.yml: trigger on push to main (paths: terraform/**). Steps identical to plan workflow with final step 'terraform apply -auto-approve'. No AZURE_CLIENT_SECRET in GitHub Secrets — all credentials from Vault KV via OIDC JWT.
      `/receptor-infra/.github/workflows/terraform-apply.yml`

### CI-02: No Vault JWT role or KV path exists for Azure credentials in a Terraform CI context. The receptor-infra-ci Vault role on

Affects: `receptor-infra` — vault


- [ ] Create Vault KV secret at secret/infrastructure/azure-terraform containing: client_id (vault-k3s-unseal appId: aad24e26-8e10-4751-90ea-fb43bd147250 or future federated identity), tenant_id (76c68bd9-6fba-42d1-bf81-471e2e8c1395), subscription_id (303d0b34-0b31-4302-a133-f1bd1e61f4b7). No client_secret if Workload Identity Federation is used.
      `/receptor-infra/docs/vault-policies.md`
- [ ] Create Vault policy receptor-infra-tf with read access to secret/data/infrastructure/azure-terraform. Create Vault JWT role receptor-infra-tf-ci bound to this policy, scoped to repo dm-ra-01/receptor-infra (bound_claims: sub=repo:dm-ra-01/receptor-infra:*). Document in supabase-receptor vault-configuration.md.
      `/receptor-infra/docs/vault-policies.md`

### SEC-03: The unseal key 'vault-unseal' in Key Vault K3sUnlock has rotationPolicy=null (confirmed via az keyvault key show). No au

Affects: `receptor-infra` — azure


- [ ] Add a rotation_policy block to the azurerm_key_vault_key resource in terraform/modules/key-vault/: automatic rotation with time_after_creation='P1Y' (rotate annually), notify='P30D' (Vault team notified 30 days before). Apply via terraform-apply.yml (Phase 5). Confirm via 'az keyvault key rotation-policy show --vault-name K3sUnlock --name vault-unseal' after apply. NOTE: key rotation changes the key version — Vault auto-unseal uses wrapKey/unwrapKey which is version-agnostic, so rotation is safe.
      `/receptor-infra/terraform/modules/key-vault/main.tf`

### SEC-04: Storage account k3sbackups71a475f1dae6 has allowSharedKeyAccess=true with a keyExpirationPeriodInDays=60 policy (confirm

Affects: `receptor-infra` — azure


- [ ] In terraform/backend.tf, set use_azuread_auth=true on the azurerm backend block. Grant 'Storage Blob Data Contributor' role to the Terraform CI identity on the tfstate container only: 'az role assignment create --role "Storage Blob Data Contributor" --assignee &#60;ci-identity-object-id&#62; --scope /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.Storage/storageAccounts/k3sbackups71a475f1dae6/blobServices/default/containers/tfstate'. Verify 'terraform init' and 'terraform plan' succeed with AD auth before proceeding.
      `/receptor-infra/terraform/backend.tf`
- [ ] Pre-flight: audit all consumers of the receptor-backups container (backup scripts in supabase-receptor or any other repo) to confirm they use Azure AD auth or SAS tokens (not shared key). Only after all consumers confirmed: set azurerm_storage_account &#123; shared_access_key_enabled = false &#125; in Terraform and apply via CI. Do NOT skip this pre-flight — disabling shared key access without auditing consumers will break backup jobs.
      `/receptor-infra/terraform/modules/backup-storage/main.tf`

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
| 1 | SEC-02, STORE-01, CI-02 | Before any Terraform or CI work: (1) VSO-manage vault-azure-kms or migrate to Workload Identity Federation (SEC-02, STORE-01); (2) create Vault JWT role and KV path for Terraform CI credentials (CI-02). All are prerequisites for subsequent phases. |
| 2 | IAC-01, IAC-03 | Create tfstate container, write Terraform modules for Key Vault and storage account using confirmed live identifiers, run terraform import, confirm zero-drift plan. IAC-03 resolved as part of IAC-01-T3. |
| 3 | CI-01, IAC-02 | Implement terraform-plan.yml (PR gate) and terraform-apply.yml (merge-to-main). After apply workflow proven, delete the azure/ ARM directory (IAC-02). |
| 4 | SEC-04 | Configure use_azuread_auth=true on Terraform backend (SEC-04-T1). After consumer pre-flight audit confirms all callers use AD auth, disable allowSharedKeyAccess (SEC-04-T2). Must be after Phase 3 (CI workflow proven). |
| 5 | SEC-01, SEC-03, IAC-04, ARM-01 | Apply KV network ACL restriction (SEC-01) and key rotation policy (SEC-03) via the apply workflow. Add weekly drift detection (IAC-04). Confirm ARM-01 retirement from Phase 3. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| SEC-02 | azure | `vault.yaml` | Security | 🔴 Critical |
| IAC-01 | azure | `main.tf` | Process Gap | 🟠 High |
| IAC-03 | azure | `main.tf` | Process Gap | 🟠 High |
| SEC-01 | azure | `main.tf` | Security | 🟠 High |
| STORE-01 | vault | `vso-azure-kms-secret.yaml` | Process Gap | 🟠 High |
| IAC-02 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟡 Medium |
| IAC-04 | azure | `terraform-drift.yml` | Process Gap | 🟡 Medium |
| CI-01 | .github/workflows | `terraform-plan.yml` | Process Gap | 🟡 Medium |
| CI-02 | vault | `vault-policies.md` | Process Gap | 🟡 Medium |
| SEC-03 | azure | `main.tf` | Security | 🟡 Medium |
| SEC-04 | azure | `backend.tf` | Security | 🟡 Medium |
| ARM-01 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟢 Low |

