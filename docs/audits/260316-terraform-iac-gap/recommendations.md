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
| Credential model for Terraform CI | No long-lived Azure credentials in GitHub Secrets. Azure Workload Identity Federation via OIDC JWT. GitHub OIDC token exchanged for short-lived Vault token (existing receptor-infra-ci pattern), then Azure client_id/tenant_id retrieved from Vault KV. azurerm provider uses use_oidc=true. |
| Terraform state backend | State stored in k3sbackups71a475f1dae6 in a NEW dedicated container named 'tfstate' (NOT the existing receptor-backups container). Created as one-time bootstrap before terraform init. Backend uses use_azuread_auth=true. |
| ARM template fate | The azure/ ARM template directory should be deleted (git rm -r azure/) once Terraform successfully imports and manages both resources. |
| Terraform scope | Terraform manages Azure resources only: Key Vault K3sUnlock, storage account k3sbackups71a475f1dae6, and the vault-k3s-unseal service principal. k3s cluster manifests remain in helmfile.yaml / Kubernetes YAML. |
| Live Azure resource details (confirmed via az CLI) | Subscription: 303d0b34-0b31-4302-a133-f1bd1e61f4b7. Resource group: Receptor. Location: australiasoutheast. Key Vault: K3sUnlock (URI: https://k3sunlock.vault.azure.net/). Storage account: k3sbackups71a475f1dae6 (SKU: Standard_RAGRS). Auto-unseal SP: vault-k3s-unseal (appId: aad24e26-8e10-4751-90ea-fb43bd147250, objectId: 26b134d5-deb6-4856-8c48-3d5f8b3c6262). Tenant: 76c68bd9-6fba-42d1-bf81-471e2e8c1395. Unseal key: vault-unseal (RSA, no expiry, no rotation policy). |
| VM platform (k3s on Hyper-V) | k3s VMs run on on-premise Hyper-V. No native Azure VM Managed Identity unless Arc-enrolled. Preferred SEC-02 remediation: Azure AD Workload Identity Federation bound to the Vault Kubernetes SA (sa-vault in vault namespace) — eliminates client secret, no Arc enrollment required. |
| Severity of SEC-02 | Confirmed Critical. vault.yaml uses secretKeyRef from vault-azure-kms k8s Secret (NOT plaintext values file). vault-azure-kms has no VSO sync (STORE-01). Preferred fix is Workload Identity Federation (SEC-02-T1) which eliminates the client secret entirely. |
| SEC-04 robustness requirement | SEC-04-T2 (disabling allowSharedKeyAccess) must NOT be applied until ALL consumers of the storage account have been confirmed to use Azure AD auth. SEC-04-T1 (use_azuread_auth=true on backend) must succeed in CI first. Pre-flight consumer audit is mandatory. |
| K8S-01 severity (Critical) | Production values.yaml has literal '$&#123;POSTGRES_PASSWORD&#125;' and '$&#123;JWT_SECRET&#125;' strings — not resolved by Helm or VSO. Production Supabase is either non-functional or running with empty credentials. Must be fixed before Phase 6 can progress. Staging has no secret declarations at all. |
| supabase-kubernetes chart and secret pattern | helmfile.yaml pins supabase-community/supabase chart at v0.5.1 for both production and staging. Implementation agents must check the chart's existingSecret pattern at https://github.com/supabase-community/supabase-kubernetes/blob/main/charts/supabase/README.md before implementing K8S-01-T2. |
| Single-node cluster constraint | All namespaces (supabase, supabase-staging, supabase-test, vault, monitoring, arc-runners) compete for the same physical resources on one Hyper-V host. Resource limits (K8S-02) and ResourceQuotas on staging/test namespaces are essential to prevent those environments from starving production Vault and Supabase. |
| Two-repo helmfile split (SPLIT-01) | Pending human decision on whether to consolidate both helmfiles into receptor-infra or keep the current split. Until decided, ADR-009 must document the apply order so operators are not surprised. |
| ARCH-03 7-run trial gate status (CI-03) | Implementation agent must check whether the 7-run self-hosted runner trial referenced in 260312-cicd-environments (ARCH-03) has been satisfied before activating arc-runner in staging-smoke.yml. |
| Frontend deployment target (LIFE-01) | DECIDED: k3s containerised Next.js with observability. Each frontend gets a Dockerfile (standalone output mode), a GHCR image push on merge to main, and a k8s Deployment in receptor-infra (own namespace per app — planner, preference, workforce). Traefik IngressRoute per app. Prometheus/Loki scraping via existing monitoring stack. Production deploy gated behind GitHub Environments required-reviewer (CICD-08). This replaces the original Cloudflare Pages intent. |
| match-backend runtime model (LIFE-02) | DECIDED: always-on HTTP service (FastAPI/uvicorn). Runs as a k8s Deployment in receptor-infra. Future plan: expose a webhook endpoint so the orchestrator (e.g. Supabase Edge Function) can trigger a match run on demand. For now the service is always running and polled. VSO injects INTERNAL_API_KEY. Liveness/readiness probes required (ADR-010). |


---

## 🔴 Critical

### KUBE-01: supabase/production/values.yaml contains literal shell interpolation placeholders ('$&#123;POSTGRES_PASSWORD&#125;', '$&#123;JWT_SECRET

Affects: `receptor-infra` — supabase


- [x] Store all Supabase secrets in Vault KV at: secret/supabase/production/&#123;postgres-password,jwt-secret,anon-key,service-role-key,dashboard-password&#125; and secret/supabase/staging/&#123;...&#125;. Create VaultStaticSecret CRDs at supabase/production/vso-secrets.yaml and supabase/staging/vso-secrets.yaml following the pattern of vault/vso-github-app-secret.yaml. Each CRD syncs one Vault KV path into a k8s Secret in the respective namespace (supabase / supabase-staging). refreshAfter: 1h.
      `/receptor-infra/supabase/production/vso-secrets.yaml`
      _(Completed: 2026-03-16T23:03:13Z)_
- [x] Update supabase/production/values.yaml and supabase/staging/values.yaml to reference the VSO-synced k8s Secret via the chart's existingSecret pattern or direct envFrom.secretRef. Remove all $&#123;...&#125; placeholder strings. Verify with 'helm template supabase supabase/supabase -f supabase/production/values.yaml | grep -c "\$&#123;"' returns 0.
      `/receptor-infra/supabase/production/values.yaml`
      _(Completed: 2026-03-16T23:03:22Z)_
- [x] Create a VaultAuth CRD for the supabase namespace (vault/vso-supabase-auth.yaml) following the pattern of vault/vso-vault-auth.yaml. The Vault role for supabase must have read access to secret/data/supabase/production/* and be bound to sa-supabase in namespace supabase. Equivalent role and CRD for staging (secret/data/supabase/staging/*, sa-supabase in supabase-staging).
      `/receptor-infra/vault/vso-supabase-auth.yaml`
      _(Completed: 2026-03-16T23:03:24Z)_

### SEC-02: The auto-unseal identity for HashiCorp Vault is an App Registration service principal ('vault-k3s-unseal', appId: aad24e

Affects: `receptor-infra` — azure


- [x] Evaluate Azure AD Workload Identity Federation for vault-k3s-unseal: configure federation on the vault-k3s-unseal App Registration, binding it to the Vault Kubernetes service account JWT (sa-vault in vault namespace). Update values/vault.yaml to use the federated identity (AZURE_CLIENT_ID + AZURE_TENANT_ID only, no AZURE_CLIENT_SECRET). On-premise k3s is supported as long as the OIDC issuer URL is reachable by Azure AD (expose via Cloudflare Tunnel or public endpoint).
      `/receptor-infra/values/vault.yaml`
      _(Completed: 2026-03-16T05:25:18Z)_
- [x] Once Workload Identity Federation is confirmed working ('vault status' shows unsealed after pod restart), revoke the vault-k3s client secret via 'az ad app credential delete --id aad24e26-8e10-4751-90ea-fb43bd147250 --key-id &#60;credential-id&#62;'. Remove AZURE_CLIENT_SECRET from the vault-azure-kms k8s secret and from values/vault.yaml extraEnvironmentVars. Update Terraform to manage the service principal without a credential.
      `/receptor-infra/terraform/modules/service-principal/main.tf`
      _(Completed: 2026-03-16T05:25:18Z)_

### LIFE-01: No deployment workflow exists in any of the three Next.js frontend repositories (planner-frontend, preference-frontend, 

Affects: `planner-frontend` — .github/workflows


- [ ] Create Dockerfile (Next.js standalone output: output: standalone in next.config.ts) for each frontend repo. Add build-push.yml: on push to main, build the Docker image and push to GHCR (ghcr.io/dm-ra-01/&#60;repo&#62;:&#60;sha&#62;). Create k8s Deployment and Service manifests in receptor-infra under infrastructure/&#60;app&#62;/ namespace (planner, preference, workforce). Add Traefik IngressRoute per app. Add staging-deploy.yml: resolve staging Vault KV (infrastructure/&#60;app&#62;/staging), inject NEXT_PUBLIC_SUPABASE_URL + PUBLISHABLE_KEY, apply updated image tag via kubectl set image or helmfile, run smoke test. Wire Prometheus ServiceMonitor and Loki log scraping using existing monitoring stack.
      `/planner-frontend/.github/workflows/staging-deploy.yml`
- [ ] Create prod-deploy.yml for each frontend triggered on GitHub Release publish. Deploy to production k8s namespace. Must include: (1) GitHub Environments required-reviewer gate (CICD-08), (2) production Vault KV injection (infrastructure/&#60;app&#62;/prod), (3) post-deploy smoke test against production Traefik URL, (4) automatic rollback (kubectl rollout undo) on smoke test failure within 5 minutes. Blocked on LIFE-04 (rollback runbook).
      `/planner-frontend/.github/workflows/prod-deploy.yml`

## 🟠 High

### IAC-01: No terraform/ directory exists. Azure Key Vault K3sUnlock, storage account k3sbackups71a475f1dae6, and service principal

Affects: `receptor-infra` — azure


- [x] Create terraform/ directory structure: modules/key-vault/, modules/backup-storage/, modules/service-principal/, and root main.tf, variables.tf, outputs.tf, providers.tf (azurerm with use_oidc=true, workload identity federation), and backend.tf (azurerm backend: storage_account_name=k3sbackups71a475f1dae6, container_name=tfstate, key=receptor/azure.tfstate, use_azuread_auth=true).
      `/receptor-infra/terraform/main.tf`
      _(Completed: 2026-03-16T05:36:52Z)_
- [x] Create blob container 'tfstate' in k3sbackups71a475f1dae6 before terraform init (one-time bootstrap: 'az storage container create --name tfstate --account-name k3sbackups71a475f1dae6 --auth-mode login'). The receptor-backups container must not share state. Grant Storage Blob Data Contributor to the Terraform CI identity on this container only.
      `/receptor-infra/terraform/BOOTSTRAP.md`
      _(Completed: 2026-03-16T05:36:52Z)_
- [x] Write terraform/modules/key-vault/: azurerm_key_vault (name=K3sUnlock, sku=Standard, soft_delete_retention_days=90, purge_protection_enabled=true, public_network_access_enabled=true initially), azurerm_key_vault_key (name=vault-unseal, key_type=RSA, rotation_policy per SEC-03), and azurerm_key_vault_access_policy blocks. Import: 'terraform import azurerm_key_vault.k3sunlock /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.KeyVault/vaults/K3sUnlock'.
      `/receptor-infra/terraform/modules/key-vault/main.tf`
      _(Completed: 2026-03-16T05:36:52Z)_
- [x] Write terraform/modules/backup-storage/: azurerm_storage_account (name=k3sbackups71a475f1dae6, account_replication_type=RAGRS — matching live state not ARM template, min_tls_version=TLS1_2, allow_nested_items_to_be_public=false, account_kind=StorageV2, access_tier=Cool, shared_access_key_enabled=true initially — see SEC-04 for hardening path). Import: 'terraform import azurerm_storage_account.backup /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.Storage/storageAccounts/k3sbackups71a475f1dae6'.
      `/receptor-infra/terraform/modules/backup-storage/main.tf`
      _(Completed: 2026-03-16T05:36:52Z)_
- [x] Run 'terraform import' for all resources, then 'terraform plan'. Confirm plan shows zero changes for stable properties (name, sku, soft-delete, RAGRS) and proposed changes only for remediation items (KV network ACLs per SEC-01, key rotation per SEC-03). Document import commands in terraform/BOOTSTRAP.md.
      `/receptor-infra/terraform/BOOTSTRAP.md`
      _(Completed: 2026-03-16T05:36:52Z)_

### IAC-03: Azure Key Vault K3sUnlock (URI: https://k3sunlock.vault.azure.net/) and its access policies have no IaC representation. 

Affects: `receptor-infra` — azure


- [x] Resolved as part of IAC-01-T3 (Terraform module + import). Live state fully documented in this audit. No standalone action required.
      `/receptor-infra/terraform/modules/key-vault/main.tf`
      _(Completed: 2026-03-16T05:37:01Z)_

### SEC-01: Key Vault K3sUnlock has networkAcls.defaultAction=Allow with zero IP rules and no virtual network rules (confirmed via a

Affects: `receptor-infra` — azure


- [ ] BLOCKED: The Hyper-V host uses a dynamic public egress IP — a static network_acls block cannot be applied until a static public IP or NAT gateway is provisioned for the Hyper-V host. The Terraform module (modules/key-vault/main.tf) has a commented-out placeholder block showing the required network_acls configuration once a static IP is available. Until then, public_network_access_enabled = true. Action required: provision a static egress IP for Hyper-V, then uncomment and populate the network_acls block and reapply via terraform-apply.yml.
      `/receptor-infra/terraform/modules/key-vault/main.tf`

### STORE-01: The Kubernetes secret 'vault-azure-kms' in the vault namespace (referenced by values/vault.yaml secretKeyRef for AZURE_T

Affects: `receptor-infra` — vault


- [x] Determine where vault-azure-kms is currently sourced: run 'vault kv get secret/infrastructure/azure-unseal'. If the path exists, create vault/vso-azure-kms-secret.yaml as a VaultStaticSecret CRD mirroring vault/vso-github-app-secret.yaml (kv-v2, path=infrastructure/azure-unseal, destination.name=vault-azure-kms, namespace=vault, refreshAfter=1h). If not in Vault KV, store it there first then create the CRD.
      `/receptor-infra/vault/vso-azure-kms-secret.yaml`
      _(Completed: 2026-03-16T05:25:18Z)_
- [x] If SEC-02 Workload Identity Federation migration is implemented first, vault-azure-kms becomes unnecessary. Delete the k8s secret, remove the AZURE_CLIENT_SECRET extraEnvironmentVar from values/vault.yaml, and skip STORE-01-T1. This is the preferred path — it eliminates the secret rather than managing its lifecycle.
      `/receptor-infra/values/vault.yaml`
      _(Completed: 2026-03-16T06:04:23Z)_

### KUBE-02: Neither supabase/production/values.yaml nor supabase/staging/values.yaml declares resource requests or limits for any Su

Affects: `receptor-infra` — supabase


- [x] Add resource requests and limits for all enabled Supabase components in supabase/production/values.yaml. Baseline values (tune after observing real usage with 'kubectl top pods -n supabase'): db: requests cpu=250m mem=512Mi limits cpu=1000m mem=2Gi; studio: requests cpu=100m mem=256Mi limits cpu=500m mem=512Mi; kong: requests cpu=100m mem=256Mi limits cpu=500m mem=512Mi; auth/rest/meta: requests cpu=50m mem=128Mi limits cpu=250m mem=256Mi; realtime: requests cpu=100m mem=256Mi limits cpu=500m mem=512Mi.
      `/receptor-infra/supabase/production/values.yaml`
      _(Completed: 2026-03-16T23:03:25Z)_
- [x] Add proportionally smaller resource limits for supabase/staging/values.yaml (50% of production values). Add a ResourceQuota manifest to the supabase-staging namespace capping total CPU and memory to prevent staging from impacting production workloads on the same single-node cluster.
      `/receptor-infra/supabase/staging/values.yaml`
      _(Completed: 2026-03-16T23:03:25Z)_

### ENV-01: No testing/ephemeral environment exists for supabase-kubernetes. helmfile.yaml declares only 'supabase' (production, nam

Affects: `receptor-infra` — supabase


- [ ] Create supabase/test/values.yaml: minimal resource footprint (db.persistence.size=5Gi, replicas=1 for all components, studio disabled, resource limits at 25% of production). Add Helm release 'supabase-test' in namespace supabase-test to helmfile.yaml, needs: [tigera-operator/tigera-operator, vault/vault]. Create network-policies/supabase-test-hardened.yaml mirroring supabase-staging-hardened.yaml.
      `/receptor-infra/supabase/test/values.yaml`
- [ ] Create Vault KV paths for test environment credentials (secret/supabase/test/*) and corresponding VaultStaticSecret CRD at supabase/test/vso-secrets.yaml. Add sa-supabase ServiceAccount to supabase-test namespace in rbac/serviceaccounts.yaml. Add matching VaultAuth CRD entry to vault/vso-supabase-auth.yaml.
      `/receptor-infra/supabase/test/vso-secrets.yaml`
- [ ] Evaluate whether ephemeral per-PR Supabase instances are feasible given single-node cluster resource constraints. If not, document the decision in docs/adr/ADR-008-supabase-environments.md and use the static supabase-test namespace as the shared test target. Update supabase-receptor CI to point integration tests at supabase-test (not supabase-staging).
      `/receptor-infra/docs/adr/ADR-008-supabase-environments.md`

### ARCH-01: k3s/helmfile.yaml (supabase-receptor) references values files at k3s/values/calico.yaml, k3s/values/cert-manager.yaml, k

Affects: `supabase-receptor` — k3s


- [ ] Create k3s/values/ directory and populate the 8 missing values files: calico.yaml, cert-manager.yaml, traefik.yaml, vault.yaml, prometheus-stack.yaml, loki.yaml, falco.yaml, cloudflared.yaml. For vault.yaml, mirror the structure of receptor-infra/values/vault.yaml. For falco.yaml, reference k3s/falco/falco-rules.yaml as customRules. For cloudflared.yaml, inject the tunnel token from Vault KV. Run 'helmfile lint' and 'helmfile diff --dry-run' to confirm all values files resolve.
      `/supabase-receptor/k3s/values/vault.yaml`

### NET-01: The vault namespace NetworkPolicy in k3s/network-policies/network-policies.yaml restricts all egress to DNS only (port 5

Affects: `supabase-receptor` — k3s


- [x] Add an egress rule to the vault namespace NetworkPolicy allowing outbound port 443 to the Azure Key Vault endpoint (k3sunlock.vault.azure.net). Use an ipBlock cidr covering Azure Key Vault IPs for australiasoutheast, or configure an FQDN-based egress policy if Calico GlobalNetworkPolicy is available. Verify by restarting the Vault pod and confirming 'vault status' reports Initialized=true, Sealed=false.
      `/supabase-receptor/k3s/network-policies/network-policies.yaml`
      _(Completed: 2026-03-17T01:10:57Z)_

### LIFE-02: match-backend has a Dockerfile and a full CI pipeline (unit + integration tests) but no image build/push workflow and no

Affects: `match-backend` — .github/workflows


- [ ] Write ADR-010-match-backend-runtime.md: always-on FastAPI/uvicorn HTTP service. Create Dockerfile (FROM python:3.12-slim-bookworm, expose port 8080, ENTRYPOINT uvicorn allocator.main:app). Add build-push.yml targeting GHCR. Create k8s Deployment in receptor-infra with: VSO for INTERNAL_API_KEY injection, liveness probe (GET /healthz), readiness probe (GET /readyz), resource limits (250m CPU, 512Mi memory). Add Traefik IngressRoute for internal-only access (no public exposure). Future: add POST /run webhook endpoint so Supabase Edge Function can trigger a match run on demand without polling.
      `/match-backend/.github/workflows/build-push.yml`

### LIFE-03: receptor-planner CI only runs unit tests. The ci.yml comment defers integration tests indefinitely: 'Integration tests (

Affects: `receptor-planner` — .github/workflows


- [ ] Document receptor-planner runtime model in ADR-011-receptor-planner-runtime.md. Create tests/integration/ with at least one integration test verifying the planner reads from and writes back to schedule_slots in a local Supabase instance. If receptor-planner runs as a container: add a Dockerfile (mirror match-backend pattern) and build-push.yml. Add integration tests to ci.yml mirroring match-backend's BACK-01-T2 pattern.
      `/receptor-planner/Dockerfile`

### LIFE-04: No rollback procedure exists — automated or documented — for any of the five frontend/backend repositories. There are no

Affects: `planner-frontend` — cross-repo


- [ ] Create docs/operations/rollback-runbook.md covering: (1) frontend rollback — force-push previous image tag or re-trigger staging-deploy.yml from a previous release tag; (2) backend rollback — kubectl rollout undo Deployment/&#60;service&#62;; (3) database migration rollback policy — migrations are forward-only in Supabase, so define the compensating-migration strategy. Add an Alertmanager PrometheusRule that fires a 'DeploymentErrorRateSpike' alert within 5 minutes of deployment if HTTP 5xx rate exceeds baseline. Link rollback runbook from all five repo READMEs.
      `/documentation/common-bond/docs/operations/rollback-runbook.md`

## 🟡 Medium

### IAC-02: azure/backup-storage-account.parameters.json has three discrepancies from live state: (1) storageAccountName: &#60;SET_ME&#62; v

Affects: `receptor-infra` — azure


- [x] After Terraform import of the storage account is confirmed (IAC-01-T4/T5), delete the azure/ directory from receptor-infra ('git rm -r azure/'). Update README.md to remove the ARM template reference and replace with a pointer to terraform/. Commit on a feature branch.
      `/receptor-infra/azure/backup-storage-account.parameters.json`
      _(Completed: 2026-03-16T05:54:41Z)_

### IAC-04: No drift detection exists. The SKU discrepancy (Standard_LRS in ARM vs Standard_RAGRS live) and location discrepancy wer

Affects: `receptor-infra` — azure


- [x] Create .github/workflows/terraform-drift.yml: scheduled weekly (cron: '0 2 * * 1'), runs terraform plan -detailed-exitcode on arc-runner-receptor-infra. Exit code 2 (changes detected) fails the job and triggers Slack notification via the existing OIDC→Vault→Slack pattern from cluster-sync.yml. Implement in Phase 5 after apply workflow is proven.
      `/receptor-infra/.github/workflows/terraform-drift.yml`
      _(Completed: 2026-03-16T06:04:39Z)_

### CI-01: No terraform-plan.yml or terraform-apply.yml CI workflow exists. Any Terraform change today requires local az login and 

Affects: `receptor-infra` — .github/workflows


- [x] Create .github/workflows/terraform-plan.yml: trigger on pull_request (paths: terraform/**). Steps: checkout, setup-terraform, OIDC→Vault JWT exchange (reuse pattern from cluster-sync.yml), retrieve Azure Workload Identity credentials from Vault KV secret/infrastructure/azure-terraform, terraform init (AzureRM backend, use_azuread_auth=true), terraform validate, terraform plan. Post plan output as PR comment. Runner: arc-runner-receptor-infra.
      `/receptor-infra/.github/workflows/terraform-plan.yml`
      _(Completed: 2026-03-16T05:54:41Z)_
- [x] Create .github/workflows/terraform-apply.yml: trigger on push to main (paths: terraform/**). Steps identical to plan workflow with final step 'terraform apply -auto-approve'. No AZURE_CLIENT_SECRET in GitHub Secrets — all credentials from Vault KV via OIDC JWT.
      `/receptor-infra/.github/workflows/terraform-apply.yml`
      _(Completed: 2026-03-16T05:54:41Z)_

### CI-02: No Vault JWT role or KV path exists for Azure credentials in a Terraform CI context. The receptor-infra-ci Vault role on

Affects: `receptor-infra` — vault


- [x] Create Vault KV secret at secret/infrastructure/azure-terraform containing: client_id (vault-k3s-unseal appId: aad24e26-8e10-4751-90ea-fb43bd147250 or future federated identity), tenant_id (76c68bd9-6fba-42d1-bf81-471e2e8c1395), subscription_id (303d0b34-0b31-4302-a133-f1bd1e61f4b7). No client_secret if Workload Identity Federation is used.
      `/receptor-infra/docs/vault-policies.md`
      _(Completed: 2026-03-16T05:25:18Z)_
- [x] Create Vault policy receptor-infra-tf with read access to secret/data/infrastructure/azure-terraform. Create Vault JWT role receptor-infra-tf-ci bound to this policy, scoped to repo dm-ra-01/receptor-infra (bound_claims: sub=repo:dm-ra-01/receptor-infra:*). Document in supabase-receptor vault-configuration.md.
      `/receptor-infra/docs/vault-policies.md`
      _(Completed: 2026-03-16T05:25:18Z)_

### SEC-03: The unseal key 'vault-unseal' in Key Vault K3sUnlock has rotationPolicy=null (confirmed via az keyvault key show). No au

Affects: `receptor-infra` — azure


- [x] Add a rotation_policy block to the azurerm_key_vault_key resource in terraform/modules/key-vault/: time_after_creation='P1Y' (rotate annually), notify='P30D'. Apply via terraform-apply.yml (Phase 5). Confirm via 'az keyvault key rotation-policy show --vault-name K3sUnlock --name vault-unseal' after apply.
      `/receptor-infra/terraform/modules/key-vault/main.tf`
      _(Completed: 2026-03-16T06:04:39Z)_

### SEC-04: Storage account k3sbackups71a475f1dae6 has allowSharedKeyAccess=true with keyExpirationPeriodInDays=60 (confirmed via az

Affects: `receptor-infra` — azure


- [x] In terraform/backend.tf, set use_azuread_auth=true on the azurerm backend block. Grant 'Storage Blob Data Contributor' role to the Terraform CI identity on the tfstate container only: 'az role assignment create --role "Storage Blob Data Contributor" --assignee &#60;ci-identity-object-id&#62; --scope /subscriptions/303d0b34-0b31-4302-a133-f1bd1e61f4b7/resourceGroups/Receptor/providers/Microsoft.Storage/storageAccounts/k3sbackups71a475f1dae6/blobServices/default/containers/tfstate'. Verify 'terraform init' and 'terraform plan' succeed before proceeding.
      `/receptor-infra/terraform/backend.tf`
      _(Completed: 2026-03-16T06:04:32Z)_
- [ ] Pre-flight: audit all consumers of the receptor-backups container (backup scripts in supabase-receptor or other repos) to confirm they use Azure AD auth or SAS tokens (not shared key). Only after all consumers confirmed: set azurerm_storage_account &#123; shared_access_key_enabled = false &#125; in Terraform and apply via CI. Do NOT skip this pre-flight.
      `/receptor-infra/terraform/modules/backup-storage/main.tf`

### KUBE-03: Neither supabase/production/values.yaml nor supabase/staging/values.yaml declares podSecurityContext or containerSecurit

Affects: `receptor-infra` — supabase


- [ ] Audit each component's default securityContext: 'helm template supabase supabase/supabase -f supabase/production/values.yaml | grep -A5 securityContext'. For components where chart defaults allow root or privilege escalation, add overrides in values.yaml: runAsNonRoot=true, allowPrivilegeEscalation=false, readOnlyRootFilesystem=true (where compatible), capabilities.drop=[ALL]. Document components that require root in docs/adr/ADR-008-supabase-environments.md with justification.
      `/receptor-infra/supabase/production/values.yaml`

### KUBE-04: Falco (runtime security monitoring) is commented out in helmfile.yaml with no explanation. The falco.yaml values file an

Affects: `receptor-infra` — supabase


- [ ] Investigate why Falco was commented out: check for kernel module conflicts on the Hyper-V VM (ebpf probe vs kernel headers). If kernel issues, switch to Falco eBPF probe mode (falco.engine.kind=ebpf in values/falco.yaml). Re-enable the Falco Helm release in helmfile.yaml. Set alert output to Slack via existing Vault KV webhook credential.
      `/receptor-infra/helmfile.yaml`
- [ ] Add custom Falco rules targeting the supabase namespace: alert on shell spawned in postgres container, unexpected outbound connections from auth or rest components, new binary execution in kong. Store in falco/custom-rules.yaml, reference from values/falco.yaml.
      `/receptor-infra/falco/custom-rules.yaml`

### SPLIT-01: The k3s cluster is defined across two separate repos: supabase-receptor/k3s/helmfile.yaml (Calico, cert-manager, Traefik

Affects: `supabase-receptor` — k3s


- [ ] Document the two-repo helmfile split in docs/adr/ADR-009-helmfile-split.md with the canonical apply order: (1) supabase-receptor/k3s/helmfile.yaml, (2) receptor-infra/helmfile.yaml. Include cross-repo dependency notes (Vault from repo 1 is required before Supabase in repo 2). Link from both repos' README.md cluster-setup sections.
      `/supabase-receptor/docs/adr/ADR-009-helmfile-split.md`
- [ ] Create a root-level cluster-apply.sh in receptor-infra (or supabase-receptor) that drives both helmfile syncs in order with --wait between phases. Extend helm-upgrade-check.yml to also check chart versions from receptor-infra/helmfile.yaml so both helmfiles are covered by the quarterly review.
      `/receptor-infra/cluster-apply.sh`

### CI-03: staging-smoke.yml runs on 'ubuntu-latest' (GitHub-hosted runner). The workflow's inline comment explicitly states: 'On G

Affects: `supabase-receptor` — .github/workflows


- [ ] Check whether the ARCH-03 7-run trial gate from 260312-cicd-environments has been met. If met: uncomment 'runs-on: [self-hosted, k3s]' and comment out 'ubuntu-latest' in staging-smoke.yml. If not met: document the remaining count and continue the trial with ci.yml first. Confirm the arc-runner-receptor-infra runner is registered and labelled 'k3s' before switching.
      `/supabase-receptor/.github/workflows/staging-smoke.yml`

### RBAC-01: The ci-namespace-manager ClusterRole (k3s/rbac/serviceaccounts.yaml) grants verbs: ['*'] on secrets, pods, services, con

Affects: `supabase-receptor` — k3s


- [ ] Deploy Kyverno (lighter weight than OPA Gatekeeper on single-node k3s) via a new Helm release in supabase-receptor/k3s/helmfile.yaml: kyverno/kyverno (pinned stable version). Create a Kyverno ClusterPolicy that validates namespace create/delete requests from sa-github-runner: allow only namespaces matching '^reactor-ci-'. Until Kyverno is deployed, update docs/adr/ADR-007-kubernetes-rbac.md to explicitly document the open risk and expected remediation date.
      `/supabase-receptor/k3s/helmfile.yaml`

### LIFE-05: The three Next.js frontend CI pipelines all run integration tests against a locally booted Supabase instance but have no

Affects: `planner-frontend` — .github/workflows


- [ ] Add Vault KV paths for each frontend per environment: infrastructure/planner-frontend/staging, infrastructure/planner-frontend/prod (and equivalents for preference/workforce). Each path contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for that environment. Update staging-deploy.yml (LIFE-01-T1) to inject these via the Vault OIDC login step. Ensure next.config.ts runtime env vars are not baked at build time — use NEXT_PUBLIC_ env vars injected at runtime via k8s ConfigMap or Cloudflare Pages variable.
      `/planner-frontend/.github/workflows/staging-deploy.yml`

### LIFE-06: receptor-planner has no dependency management automation: no Renovate Bot (.github/workflows/renovate.yml) unlike the th

Affects: `receptor-planner` — .github


- [ ] Add .github/dependabot.yml to receptor-planner targeting pip (package-ecosystem: pip, directory: /, schedule: monthly — matching match-backend). Ensure the TMPDIR: /home/runner/pip-tmp workaround in ci.yml is preserved after any pip upgrade that bumps ortools.
      `/receptor-planner/.github/dependabot.yml`

### LIFE-07: All three Next.js frontend next.config.ts files include script-src: 'unsafe-eval' 'unsafe-inline' in the Content-Securit

Affects: `planner-frontend` — next.config.ts


- [ ] Replace 'unsafe-eval' with nonce-based CSP in all three frontend next.config.ts files. Next.js 14+ supports automatic nonce injection via middleware.ts and the experimental.nonce config option. Add a CSP header verification test to the e2e-axe Playwright suite that asserts the Content-Security-Policy response header does not contain 'unsafe-eval'. Until nonces are implemented, add the known CSP risk to the ISMS Asset Register for all three applications.
      `/planner-frontend/next.config.ts`

## 🟢 Low

### ARM-01: azure/backup-storage-account.parameters.json has three value discrepancies from live state (storageAccountName placehold

Affects: `receptor-infra` — azure


- [x] Resolved as part of IAC-02-T1 (delete azure/ directory after Terraform import). No standalone fix required.
      `/receptor-infra/azure/backup-storage-account.parameters.json`
      _(Completed: 2026-03-16T05:54:42Z)_


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | SEC-02, STORE-01, CI-02 | Before any Terraform or CI work: VSO-manage vault-azure-kms or migrate to Workload Identity Federation (SEC-02, STORE-01); create Vault JWT role and KV path for Terraform CI credentials (CI-02). |
| 2 | IAC-01, IAC-03 | Create tfstate container, write Terraform modules for Key Vault and storage account, run terraform import, confirm zero-drift plan. |
| 3 | CI-01, IAC-02 | Implement terraform-plan.yml and terraform-apply.yml. Delete azure/ ARM directory after apply workflow proven. |
| 4 | SEC-04 | Configure use_azuread_auth=true on Terraform backend. After consumer pre-flight audit, disable allowSharedKeyAccess. |
| 5 | SEC-01, SEC-03, IAC-04, ARM-01 | Apply KV network ACL restriction and key rotation policy via the apply workflow. Add weekly drift detection. Confirm ARM-01 retirement. |
| 6 | KUBE-01, KUBE-02, ENV-01, KUBE-03, KUBE-04 | Address supabase-kubernetes gaps in priority order: (1) K8S-01 VSO secret injection — blocking for production functionality; (2) K8S-02 resource limits — blocking for cluster stability; (3) ENV-01 test environment — required for CI isolation; (4) K8S-03 pod security contexts — hardening; (5) K8S-04 Falco — runtime monitoring. K8S-01 and K8S-02 may be implemented concurrently. |
| 7 | NET-01, ARCH-01, CI-03, SPLIT-01, RBAC-01 | supabase-receptor k3s/ infrastructure gaps: (1) NET-01 Vault egress fix — needed for auto-unseal to function; (2) ARCH-01 missing values files — helmfile is not apply-able; (3) CI-03 activate self-hosted runner for staging smoke; (4) SPLIT-01 document or consolidate two-repo helmfile split; (5) RBAC-01 deploy Kyverno to enforce namespace prefix policy. |
| 8 | LIFE-01, LIFE-02, LIFE-03, LIFE-04, LIFE-05, LIFE-06, LIFE-07 | All five repos lack deployment automation. Priority: (1) LIFE-01 frontend staging deploy — blocks all staging verification; (2) LIFE-04 rollback runbook — prerequisite for any production deploy; (3) LIFE-02/03 backend ADRs — unblock container/deploy strategy decisions; (4) LIFE-05 per-environment Vault secrets; (5) LIFE-07 CSP hardening — security regression in production today; (6) LIFE-06 receptor-planner Dependabot — lowest risk. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| KUBE-01 | supabase | `vso-secrets.yaml` | Security | 🔴 Critical |
| SEC-02 | azure | `vault.yaml` | Security | 🔴 Critical |
| LIFE-01 | .github/workflows | `staging-deploy.yml` | Process Gap | 🔴 Critical |
| IAC-01 | azure | `main.tf` | Process Gap | 🟠 High |
| IAC-03 | azure | `main.tf` | Process Gap | 🟠 High |
| SEC-01 | azure | `main.tf` | Security | 🟠 High |
| STORE-01 | vault | `vso-azure-kms-secret.yaml` | Process Gap | 🟠 High |
| KUBE-02 | supabase | `values.yaml` | Security | 🟠 High |
| ENV-01 | supabase | `values.yaml` | Process Gap | 🟠 High |
| ARCH-01 | k3s | `vault.yaml` | Process Gap | 🟠 High |
| NET-01 | k3s | `network-policies.yaml` | Security | 🟠 High |
| LIFE-02 | .github/workflows | `build-push.yml` | Process Gap | 🟠 High |
| LIFE-03 | .github/workflows | `Dockerfile` | Process Gap | 🟠 High |
| LIFE-04 | cross-repo | `rollback-runbook.md` | Process Gap | 🟠 High |
| IAC-02 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟡 Medium |
| IAC-04 | azure | `terraform-drift.yml` | Process Gap | 🟡 Medium |
| CI-01 | .github/workflows | `terraform-plan.yml` | Process Gap | 🟡 Medium |
| CI-02 | vault | `vault-policies.md` | Process Gap | 🟡 Medium |
| SEC-03 | azure | `main.tf` | Security | 🟡 Medium |
| SEC-04 | azure | `backend.tf` | Security | 🟡 Medium |
| KUBE-03 | supabase | `values.yaml` | Security | 🟡 Medium |
| KUBE-04 | supabase | `helmfile.yaml` | Process Gap | 🟡 Medium |
| SPLIT-01 | k3s | `ADR-009-helmfile-split.md` | Architectural Drift | 🟡 Medium |
| CI-03 | .github/workflows | `staging-smoke.yml` | Process Gap | 🟡 Medium |
| RBAC-01 | k3s | `helmfile.yaml` | Security | 🟡 Medium |
| LIFE-05 | .github/workflows | `staging-deploy.yml` | Process Gap | 🟡 Medium |
| LIFE-06 | .github | `dependabot.yml` | Process Gap | 🟡 Medium |
| LIFE-07 | next.config.ts | `next.config.ts` | Security | 🟡 Medium |
| ARM-01 | azure | `backup-storage-account.parameters.json` | Tech Debt | 🟢 Low |

