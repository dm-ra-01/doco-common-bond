# Terraform Infrastructure-as-Code Gap Audit

**Date:** 2026-03-16\
**Scope:** `receptor-infra` (primary) · `documentation/common-bond` (output)\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO 27001 A.8.9 (Configuration Management), A.8.32 (Change Management)

---

## Executive Summary

The audit examined the `receptor-infra` repository and live Azure state for Infrastructure-as-Code coverage of Azure resources underpinning the Receptor k3s cluster. Nine findings were identified: 1 Critical, 3 High, 4 Medium, and 1 Low. Live `az` CLI introspection confirmed actual resource configuration and surfaced three discrepancies not visible from the repository alone: the auto-unseal identity is an App Registration service principal (not a managed identity) with a long-lived client secret expiring 2028-03-12; the live storage account SKU is `Standard_RAGRS` (geo-redundant) rather than `Standard_LRS` as specified in the ARM template, confirming the ARM template never matched the live state; and both Azure resources have public network access enabled with no IP restrictions. No Terraform directory, state file, or CI-gated apply workflow exists.

| Repository / Area               | Coverage | Issues Found | Overall       |
| -------------------------------- | -------- | ------------ | ------------- |
| `receptor-infra` — Azure IaC    | ❌        | 4            | Critical gap  |
| `receptor-infra` — CI workflows | ⚠️       | 2            | Partial       |
| Azure Key Vault (`K3sUnlock`)   | ⚠️       | 2            | Security gaps |
| Azure Storage (`k3sbackups71a475f1dae6`) | ⚠️ | 1          | Config drift  |
| Auto-unseal identity              | ❌       | 1            | Critical gap  |

---

## Live Azure Resource State (discovered via `az` CLI, 2026-03-16)

### Key Vault — `K3sUnlock`

| Property | Live Value | Expected / Desired |
| -------- | ---------- | ------------------ |
| Resource Group | `Receptor` | — |
| Location | `australiasoutheast` | — |
| SKU | Standard | Standard ✅ |
| Soft Delete | Enabled, 90-day retention | ✅ |
| Purge Protection | Enabled | ✅ |
| Public Network Access | Enabled — no IP rules | ⚠️ Gap (see SEC-01) |
| Network ACLs default | `Allow` | Should be `Deny` with exceptions |
| Unseal key | `vault-unseal` (RSA, no expiry, enabled 2026-03-13) | ✅ |
| Access policy — owner | objectId `24f68cfb-…` — full key/secret/cert perms | Ryan Ammendolea admin |
| Access policy — unseal | objectId `26b134d5-…` → SP `vault-k3s-unseal` — wrapKey, unwrapKey, get | ⚠️ SP credential (see SEC-02) |

### Storage Account — `k3sbackups71a475f1dae6`

| Property | Live Value | ARM Template Specifies |
| -------- | ---------- | ---------------------- |
| Location | `australiasoutheast` | `australiaeast` (drift) |
| SKU | `Standard_RAGRS` (GRS + RA) | `Standard_LRS` (arm template) |
| Kind | `StorageV2` | `StorageV2` ✅ |
| Access Tier | Cool | Cool ✅ |
| TLS Min | 1.2 | 1.2 ✅ |
| Blob Public Access | Disabled | false ✅ |
| HTTPS Only | true | true ✅ |
| Public Network Access | Enabled — no IP rules | Enabled (match, but gap) |
| Storage Container | `receptor-backups` | — (no tfstate container) |
| Key Expiry Policy | 60 days | *(not in ARM template)* |
| Secondary Location | `australiaeast` (RA-GRS) | — |

### Auto-Unseal Identity — `vault-k3s-unseal`

| Property | Live Value |
| -------- | ---------- |
| Type | **App Registration / Service Principal** (not Managed Identity) |
| App ID | `aad24e26-8e10-4751-90ea-fb43bd147250` |
| Object ID (SP) | `26b134d5-deb6-4856-8c48-3d5f8b3c6262` |
| Credential | Client secret `vault-k3s`, expires **2028-03-12** |
| KV permissions | `wrapKey`, `unwrapKey`, `get` (keys); `get` (secrets, certs) |
| Created | 2026-03-13 |

---

## 1. Azure Infrastructure-as-Code

### 1.1 Terraform Absence

**Strengths:**

- `README.md` bootstrap order documents the manual provisioning sequence, giving future operators breadcrumbs even without IaC.
- The `cluster-sync.yml` OIDC JWT / Vault credential pattern is production-proven — the implementation path for Terraform CI is clear and reusable.
- Key Vault has purge protection and 90-day soft-delete enabled — the most critical KV safety properties are correct.

**Gaps:**

- **IAC-01** — No `terraform/` directory exists. Key Vault `K3sUnlock`, storage account `k3sbackups71a475f1dae6`, and the `vault-k3s-unseal` service principal were provisioned manually on 2026-03-13 to 2026-03-15. The subscription ID is `303d0b34-0b31-4302-a133-f1bd1e61f4b7`, resource group `Receptor`, location `australiasoutheast`. All resource identifiers have now been confirmed via `az` CLI and must be captured in Terraform.
- **IAC-02** — `azure/backup-storage-account.parameters.json` specifies `<SET_ME>` for `storageAccountName` and `Standard_LRS` for SKU. The live account name is `k3sbackups71a475f1dae6` and the live SKU is `Standard_RAGRS`. The ARM template was never applied from the repository and does not reflect the live state — two fields are wrong in addition to the placeholder. The ARM directory should be retired once Terraform import is confirmed.
- **IAC-03** — Azure Key Vault `K3sUnlock` (URI: `https://k3sunlock.vault.azure.net/`) and its associated access policies are unrepresented in IaC. The live state is now fully known via `az` CLI and documented in the table above.

### 1.2 Drift Detection

**Gaps:**

- **IAC-04** — No drift detection. The SKU discrepancy (`Standard_RAGRS` vs `Standard_LRS`) and the location discrepancy (`australiasoutheast` vs ARM template `australiaeast`) would have been invisible without manual `az` inspection. A scheduled `terraform plan` run would surface these automatically once Terraform is in place.

---

## 2. Security

### 2.1 Auto-Unseal Identity

**Gaps:**

- **SEC-01** — Key Vault `K3sUnlock` has `networkAcls.defaultAction: Allow` with no IP rules and no virtual network rules. The vault URI (`https://k3sunlock.vault.azure.net/`) is accessible from any public IP. For an auto-unseal vault, the only callers are the Vault pods on the k3s cluster (outbound from the Hyper-V host public IP). Restricting to that IP would reduce the attack surface without impacting the unseal flow.
- **SEC-02** — The auto-unseal identity (`vault-k3s-unseal`) is an App Registration service principal with a **client secret** (hint: `y3I`, expires 2028-03-12). This secret is stored in the Vault Helm chart values — either in the `values/` directory or a Vault KV secret. A client secret is a long-lived credential that cannot be rotated without downtime risk to the unseal flow. The preferred approach is a **User-Assigned Managed Identity** bound to the k3s VM or VM Scale Set, which eliminates the client secret entirely. This is a medium-complexity infrastructure change (requires the VMs to be in Azure) — or a Workload Identity Federation approach if a VM managed identity is unavailable.

---

## 3. CI Workflow Coverage

### 3.1 Existing Workflow

**Strengths:**

- `cluster-sync.yml` has `id-token: write` and implements the full OIDC → Vault JWT exchange. This is the reference implementation for Terraform CI.
- `arc-runner-receptor-infra` runner already exists in the cluster.

**Gaps:**

- **CI-01** — No `terraform-plan.yml` or `terraform-apply.yml` workflow. Terraform changes require local `az login` + manual apply with no audit trail.
- **CI-02** — No Vault KV path or JWT role exists for Azure credentials in a Terraform context. The `receptor-infra-ci` role currently only grants `secret/infrastructure/slack-incidents-webhook`. A dedicated Vault JWT role (`receptor-infra-tf-ci`) and policy for Azure Workload Identity Federation credentials must be created before CI-01 can be implemented. Note: if SEC-02 (managed identity migration) is implemented first, the Vault KV secret would store the client ID + tenant ID only (no secret).

---

## 4. ARM Template Parameterisation

**Gaps:**

- **ARM-01** — `azure/backup-storage-account.parameters.json` has two value discrepancies from the live resource beyond the `<SET_ME>` placeholder: (1) `location` = `australiaeast` vs live `australiasoutheast`; (2) `accountType` = `Standard_LRS` vs live `Standard_RAGRS`. The ARM template is authoritative for nothing. Addressed by IAC-02.

---

## 5. Cross-Cutting Observations

1. **Storage account as Terraform backend.** The `receptor-backups` container holds cluster backups. The Terraform state must not share this container — a separate `tfstate` container must be created within `k3sbackups71a475f1dae6` before `terraform init`. This is a prerequisite step for Phase 2.

2. **Service principal secret rotation risk.** The `vault-k3s-unseal` client secret is stored somewhere in the Vault Helm configuration (values file or Vault KV). If it is in a plaintext values file in `receptor-infra/values/`, it would be an immediate exposure. The location of this secret must be confirmed during IAC-03 investigation.

3. **OIDC re-use opportunity.** The `cluster-sync.yml` OIDC/Vault flow is production-proven. Terraform CI can reuse the same OIDC token exchange, with a new Vault JWT role bound to Azure Workload Identity Federation. No long-lived `AZURE_CLIENT_SECRET` required in GitHub Secrets.

4. **ISO 27001 A.8.9 exposure.** The SKU drift (LRS → RAGRS) and location drift (eastAU → southeastAU) demonstrate that manual provisioning leads to undocumented configuration changes. RG `Receptor` contains only two resources — a narrow, auditable scope that makes Terraform import tractable.

5. **VM platform.** The k3s cluster runs on Hyper-V VMs (on-premise Windows host, per `d35a48ff` conversation context). This means **no native Azure VM Managed Identity** is available for the `vault-k3s-unseal` replacement unless the VMs are Arc-enrolled. The service principal + short-lived federated credential approach (SEC-02 alternative) is the practical path.

---

## Severity Summary

| Finding ID | Repository / Area | File / Resource | Category | Severity |
| ---------- | ----------------- | --------------- | -------- | -------- |
| SEC-02 | Azure / `vault-k3s-unseal` | App Registration client secret | Security | 🔴 Critical |
| IAC-01 | `receptor-infra` — Azure IaC | *(absent)* | Process Gap | 🔴 High |
| IAC-03 | `receptor-infra` — Key Vault | *(absent)* | Process Gap | 🔴 High |
| SEC-01 | Azure / `K3sUnlock` | Key Vault network ACLs | Security | 🔴 High |
| IAC-04 | `receptor-infra` — Azure IaC | *(absent)* | Process Gap | 🟠 Medium |
| CI-01 | `receptor-infra` — CI | *(absent)* | Process Gap | 🟠 Medium |
| CI-02 | `receptor-infra` — CI / Vault | `.github/workflows/cluster-sync.yml` | Process Gap | 🟠 Medium |
| IAC-02 | `receptor-infra` — ARM | `azure/backup-storage-account.parameters.json` | Tech Debt | 🟠 Medium |
| ARM-01 | `receptor-infra` — ARM | `azure/backup-storage-account.parameters.json` | Tech Debt | 🟡 Low |
