<!-- audit-slug: 260326-k3s-stability -->

# Recommendations — k3s Cluster Stability & Gold Standard Audit

**Branch:** `audit/260326-k3s-stability`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-26

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Vault HA feasibility | Pending human decision. Vault HA (3 pods, integrated Raft) is the gold standard but requires significant migration effort. If chosen, it eliminates VAULT-01 and VAULT-02. If deferred, document as a formal exception in ADR-006 with a PodDisruptionBudget and recovery runbook. |
| k3s secrets-encryption on existing cluster | Pending. Enabling --secrets-encryption on an existing cluster requires a rolling restart and re-encryption of all existing secrets. Schedule during a maintenance window. k3s docs warn this can corrupt the cluster if steps are not followed in order. |
| Falco disable reason | Pending investigation. Git history must be checked to identify the commit that disabled Falco and any referenced issue before re-enablement is planned. |


---

## 🔴 Critical

### KCTL-03: No `--secrets-encryption` flag on k3s servers. Kubernetes Secrets are stored base64-encoded in etcd without AES-256 at-r

Affects: `receptor-infra` — k3s Control Plane


- [ ] Enable secrets encryption on all three control-plane nodes by adding `--secrets-encryption` to the k3s server systemd service args (/etc/rancher/k3s/config.yaml or ExecStart). Requires rolling restart of each control-plane node in sequence.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/user-data`
- [ ] Document the secrets-encryption key rotation procedure in `docs/operations/secrets-encryption.md` and add to the provisioning README.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/operations/secrets-encryption.md`

### KCTL-05: No etcd snapshot schedule configured (`--etcd-snapshot-schedule-cron`, `--etcd-snapshot-s3-*`). ADR-004 covers only Post

Affects: `receptor-infra` — k3s Backup


- [ ] Add `--etcd-snapshot-schedule-cron='0 */6 * * *'` and `--etcd-snapshot-retention=14` to k3s config on all control-plane nodes.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/user-data`
- [ ] Configure external snapshot storage pointing to the existing Azure Blob `k3sbackups71a475f1dae6` container (australiaeast, satisfying APP 8).
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/user-data`
- [ ] Extend ADR-004 to document etcd snapshot strategy and add etcd restore procedure to `docs/operations/incident-response.md`.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/adr/ADR-004-backup-strategy.md`
- [ ] Add a Prometheus alert for etcd snapshot staleness (alert if last snapshot &#62; 8 hours old) in `monitoring/prometheus-rules.yaml`.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/monitoring/prometheus-rules.yaml`

### VAULT-01: Vault is deployed in standalone mode (`standalone.enabled: true`) pinned to a single node (`receptor-ctrl-50`). If this 

Affects: `receptor-infra` — Vault


- [ ] Evaluate Vault HA mode with integrated Raft storage across 3 Vault pods, one per control-plane node. Document decision in a new or updated ADR. If HA is deferred, add formal exception to ADR-006 with a PodDisruptionBudget and recovery runbook.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/adr/ADR-006-vault-unseal.md`
- [ ] Add a critical Prometheus alert: `absent(kube_pod_status_ready&#123;condition='true', namespace='vault'&#125;)` for &#62;2 minutes, in `monitoring/prometheus-rules.yaml`.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/monitoring/prometheus-rules.yaml`

### SEC-01: Falco runtime security chart is commented out in helmfile.yaml. Custom rules exist in `falco/falco-rules.yaml` indicatin

Affects: `receptor-infra` — Runtime Security


- [ ] Diagnose why Falco was disabled: check git log for the commit that commented it out and any referenced issue.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
- [ ] Re-enable the Falco Helm release in helmfile.yaml with the existing values/falco.yaml. Add falcosecurity repo to the repositories section.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
- [ ] Create ADR-012 for Falco: document deployment decision, custom rules rationale, and exception handling for privileged DaemonSets (node-maintenance).
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/adr/ADR-012-runtime-security-falco.md`

## 🟠 High

### KCTL-01: `provisioning/user-data` join commands are incomplete: missing `--cluster-init` for the first control-plane and correct 

Affects: `receptor-infra` — k3s Control Plane


- [ ] Update the k3s join comment in `provisioning/user-data` to show `--cluster-init` for the first node and `--server https://10.10.0.10:6443` for additional control-plane nodes.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/user-data`

### KCTL-02: No k3s config file (`/etc/rancher/k3s/config.yaml`) is committed to the repository. The `--flannel-backend=none`, `--dis

Affects: `receptor-infra` — k3s Control Plane


- [ ] Commit k3s config templates at `provisioning/k3s-server-config.yaml.template` and `provisioning/k3s-agent-config.yaml.template` including all flags: `--flannel-backend=none`, `--disable-network-policy`, `--node-ip`, `--cluster-init`, `--secrets-encryption`.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/k3s-server-config.yaml.template`

### KCTL-04: No k3s API server audit logging configured. `docs/security/audit-logging.md` covers only pgaudit (Postgres), not the Kub

Affects: `receptor-infra` — k3s API Audit Log


- [ ] Create `provisioning/audit-policy.yaml` and add `--kube-apiserver-arg=audit-policy-file=...` and `--kube-apiserver-arg=audit-log-path=...` to k3s server config. Start with Metadata level for all requests.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/audit-policy.yaml`
- [ ] Configure Promtail (Loki) to scrape k3s API audit logs from control-plane nodes and make them queryable in Grafana.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/loki.yaml`

### VAULT-02: Vault data and audit storage uses `storageClass: local-path`, not Longhorn. Local-path PVs have no replication and are b

Affects: `receptor-infra` — Vault Storage


- [ ] Migrate Vault data and audit PVCs to `storageClassName: longhorn` with 3-replica replication. Requires a Vault seal → data migration → re-unseal sequence. Document in `docs/operations/vault-pvc-migration.md`.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/vault.yaml`

### MON-03: `rbac/namespaces.yaml` has no `pod-security.kubernetes.io/enforce` labels. Kubernetes Pod Security Standards (PSS) are n

Affects: `receptor-infra` — Pod Security Standards


- [ ] Add PSS labels to all namespaces in `rbac/namespaces.yaml`. Use `baseline` for application namespaces; explicitly grant `privileged` to `kube-system`, `longhorn-system`, `arc-runners` with documented rationale.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/rbac/namespaces.yaml`

### NET-01: Monitoring namespace egress is `egress: [&#123;&#125;]` (fully open). Inline comment claims Calico GlobalNetworkPolicy restricts m

Affects: `receptor-infra` — Network Policies


- [ ] Replace the catch-all `egress: [&#123;&#125;]` with explicit rules: DNS (53), pod CIDR scrape ports, Alertmanager webhook (HTTPS 443). Remove the false-assurance comment about GlobalNetworkPolicy.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/network-policies/network-policies.yaml`
- [ ] Either create the Calico GlobalNetworkPolicy that the comment claims exists, or remove the comment. If creating it, add to `network-policies/` and reference it in ADR-005.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/network-policies/network-policies.yaml`

### STORE-01: Zot registry is a single replica (`replicaCount: 1`) on `local-path` storage. A node failure invalidates all CI runner i

Affects: `receptor-infra` — Zot Registry


- [ ] Evaluate: (a) increase to 2 replicas with Longhorn RWX storage, or (b) move to purely on-demand pull-through mode with no local persistence. Document decision in ADR or helmfile comment.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/registry/zot-values.yaml`

### KYVERNO-01: policies/namespace-isolation.yaml declares a ClusterPolicy (kyverno.io/v1) to restrict CI runner namespace scope, but Ky

Affects: `receptor-infra` — Kyverno Policy


- [ ] Decide: (a) add Kyverno to helmfile.yaml to activate the existing ClusterPolicy, or (b) replace with a RBAC-based control (ValidatingWebhookConfiguration or namespace-level ResourceQuota), or (c) delete the orphaned policy and accept the gap. Document decision in ADR or helmfile comment.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/policies/namespace-isolation.yaml`
- [ ] If Kyverno is chosen (option a): add the kyverno helm chart to helmfile.yaml with appropriate resource limits and a dedicated kyverno namespace. Verify the ClusterPolicy is active with kubectl get clusterpolicy.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`

### ARC-01: The arc-runner-receptor-infra runner set uses serviceAccountName: helmfile-deployer (cluster-admin ClusterRoleBinding) f

Affects: `receptor-infra` — ARC Runner Privilege


- [ ] Create a second ARC runner set arc-runner-receptor-infra-sync with serviceAccountName: helmfile-deployer (cluster-admin) and maxRunners: 1. This runner handles only the helmfile sync workflow.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
- [ ] Remove serviceAccountName from the existing arc-runner-receptor-infra runner set (or set it to a read-only SA). Update the cluster-sync GitHub workflow to use runs-on: [self-hosted, receptor-infra-sync] so only the sync runner uses cluster-admin.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
- [ ] Create a minimal ClusterRole for the non-sync runner SA (read pods/nodes/services only) and bind it. Document the two-runner separation in README.md.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/rbac/namespaces.yaml`

### KYVERNO-02: values/kyverno.yaml exists with full Prometheus metrics config and resource allocation, referenced in prior audit 260316

Affects: `receptor-infra` — Kyverno Chart Regression


- [ ] Re-add the Kyverno Helm release to helmfile.yaml using the existing values/kyverno.yaml. The chart was referenced in audit 260316-terraform-iac-gap RBAC-01-T1. Add kyverno Helm repo and release ensuring it deploys before the ClusterPolicy in sync order.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`
- [ ] Verify the ClusterPolicy in policies/namespace-isolation.yaml activates after Kyverno is deployed. Test with: kubectl get clusterpolicy and attempt to create a namespace violating the policy as a non-admin user.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/policies/namespace-isolation.yaml`

### OPS-01: docs/runbooks/ directory does not exist. No Prometheus alert in monitoring/prometheus-rules.yaml includes a runbook_url 

Affects: `receptor-infra` — Operational Runbooks


- [ ] Create docs/runbooks/ directory with runbooks for each Critical and High alert: CrashLooping.md, LonghornDegraded.md, VaultUnavailable.md, NodeDiskPressure.md, ARCRunnerFleetDown.md. Each runbook must include: symptoms, triage steps, resolution steps, escalation path.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/runbooks/`
- [ ] Add runbook_url annotations to each alert in monitoring/prometheus-rules.yaml pointing to the corresponding runbook file in GitHub: https://github.com/Common-Bond/receptor-infra/blob/main/docs/runbooks/AlertName.md
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/monitoring/prometheus-rules.yaml`

### GITOPS-01: The current helmfile-deployer ARC runner only syncs on push. If someone applies a manual kubectl command or a pod drifts

Affects: `receptor-infra` — GitOps Continuous Reconciliation


- [ ] Evaluate Flux CD bootstrap for receptor-infra. Run: flux install --dry-run to validate cluster compatibility. Document migration plan from helmfile sync to HelmRelease CRDs in a new ADR (ADR-012-gitops-flux).
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/adr/ADR-012-gitops-flux.md`
- [ ] Bootstrap Flux CD: flux bootstrap github --owner=Common-Bond --repository=receptor-infra --path=clusters/receptor --personal. Convert each helmfile release to a HelmRelease CR. Set reconcileInterval: 5m to detect and revert drift within 5 minutes.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/clusters/receptor/`
- [ ] After Flux bootstrap, disable the ARC runner helmfile sync workflow (or repurpose it to pre-flight validation only). The Flux Source Controller becomes the authoritative sync mechanism.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/helmfile.yaml`

### CI-01: No .github/workflows/ directory exists in receptor-infra. PRs touching helmfile.yaml, values/, network-policies/, and rb

Affects: `receptor-infra` — PR Validation Pipeline


- [ ] Create .github/workflows/validate-pr.yaml in receptor-infra. Steps: (1) helm repo add for all chart repos in helmfile.yaml, (2) helm lint for each values file, (3) helm template --dry-run for each release, (4) yamllint on all yaml files, (5) kubeconform for schema validation against k3s v1.29 CRD schema.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/workflows/validate-pr.yaml`
- [ ] Add branch protection to receptor-infra main: require status checks from the PR validation workflow before merge. This gates all helmfile and values changes.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/`

## 🟡 Medium

### KCTL-06: The k3s join URL is hardcoded to `receptor-ctrl-10` (10.10.0.10). If ctrl-10 is unavailable, new scheduling and kubectl 

Affects: `receptor-infra` — k3s API Server HA


- [ ] Add a Cloudflare Tunnel TCP route or HAProxy load balancer distributing port 6443 across all three control-plane IPs. Update provisioning docs and kubectl access documentation to reference the load-balanced endpoint.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/user-data`

### VAULT-03: Vault has `global.tlsDisable: true`. Pod-to-VSO and pod-to-client traffic is plain HTTP. A Calico policy misconfiguratio

Affects: `receptor-infra` — Vault TLS


- [ ] Enable Vault TLS using a cert-manager Certificate for the `vault.vault.svc` hostname. Update VSO VaultAuth resources to use the HTTPS endpoint. Document in ADR-003.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/vault.yaml`

### MON-01: Prometheus Operator admission webhooks disabled (`admissionWebhooks.enabled: false`) due to upgrade timeouts. Malformed 

Affects: `receptor-infra` — Prometheus Operator


- [ ] Investigate the upgrade timeout root cause. Try increasing `admissionWebhooks.timeoutSeconds`. Re-enable webhooks once the timeout issue is resolved.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/prometheus-stack.yaml`

### STORE-02: Longhorn UI ingress uses plain HTTP entrypoint (`web`, port 80). Storage management operations are unencrypted between C

Affects: `receptor-infra` — Longhorn UI


- [ ] Switch Longhorn UI ingress annotation to `websecure` entrypoint and add TLS configuration.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/longhorn.yaml`

### DOC-01: `docs/security/audit-logging.md` (line 160) references Cloudflare R2 APAC as the 90-day pgaudit log archive destination.

Affects: `receptor-infra` — Documentation Drift


- [ ] Update `docs/security/audit-logging.md` log retention table to reference Azure Blob `k3sbackups71a475f1dae6` (australiaeast), consistent with ADR-004.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/security/audit-logging.md`

### DRIFT-01: The descheduler was designed to re-balance pods after ENTERPRISE node recovery using `RemovePodsViolatingNodeAffinity`. 

Affects: `receptor-infra` — Descheduler


- [ ] Review whether LowNodeUtilization at 5-minute frequency is still desired. If ENTERPRISE stability is confirmed long-term, increase schedule to every 30 minutes or disable the descheduler. Update DeschedulerPolicy comments to reflect current intent.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/maintenance/descheduler.yaml`

### ETCD-01: No Prometheus alert monitors etcd database size. etcd has a default 2GB write quota; when the DB hits the limit, all wri

Affects: `receptor-infra` — etcd Health Monitoring


- [ ] Add a Prometheus alert to monitoring/prometheus-rules.yaml: fire warning at &#62;75% of etcd 2GB quota (etcd_mvcc_db_total_size_in_bytes &#62; 1.5e9) and critical at &#62;90% (&#62; 1.8e9). Also alert if etcd_server_health_failures &#62; 0 for &#62;2 minutes.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/monitoring/prometheus-rules.yaml`
- [ ] Add etcd defragmentation to the node-maintenance DaemonSet schedule (or a separate CronJob) to reclaim fragmented DB space. Run defrag against each etcd member sequentially, not concurrently.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/maintenance/node-maintenance.yaml`

### MON-04: monitoring/prometheus-rules.yaml has no alert for Loki storage exhaustion. Loki's monitoring namespace PVC is not monito

Affects: `receptor-infra` — Loki Storage Alerting


- [ ] Add PVC capacity alerts to monitoring/prometheus-rules.yaml: warn when any PVC in the monitoring namespace exceeds 80% capacity (kubelet_volume_stats_used_bytes / kubelet_volume_stats_capacity_bytes &#62; 0.8). Use a namespace selector to cover Loki, Prometheus, and Grafana PVCs.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/monitoring/prometheus-rules.yaml`

### CERT-01: git history shows DR-56 raised cert-manager cainjector's resource limits from 100m/128Mi to 500m/256Mi after OOM crash l

Affects: `receptor-infra` — cert-manager Resource Limits


- [ ] Review resource requests/limits for cert-manager controller and webhook pods in values/cert-manager.yaml (or equivalent). Benchmark actual usage via kubectl top pods -n cert-manager and set limits to 150% of observed P99. Add a Prometheus alert for OOMKilled events in the cert-manager namespace.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/cert-manager.yaml`

### LOKI-02: values/loki.yaml line 14 comment states: 'archive to R2 monthly by external cron'. No such CronJob or external cron exis

Affects: `receptor-infra` — Loki Archive Tier


- [ ] Remove the comment 'archive to R2 monthly by external cron' from values/loki.yaml since no such cron exists and R2 was superseded by Azure Blob (ADR-004). Either create a Kubernetes CronJob to export logs to Azure Blob Storage australiaeast or document that 30-day online Loki retention is the only tier.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/loki.yaml`
- [ ] If an archive tier is desired: create a CronJob using logcli to export Loki data to Azure Blob Storage and update the retention table in docs/security/audit-logging.md to reflect the actual archive tier and correct storage destination.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/security/audit-logging.md`

### HELM-01: All Helm chart versions in helmfile.yaml are manually pinned with no automated update process. No Renovate configuration

Affects: `receptor-infra` — Chart Version Automation


- [ ] Add a Renovate configuration file (renovate.json) to receptor-infra to track helm chart versions in helmfile.yaml. Configure minor/patch updates to auto-PR and major bumps to require manual approval.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/renovate.json`
- [ ] As an alternative: add a weekly GitHub Actions workflow that runs helm repo update and checks for outdated chart versions, then opens a summary issue. Evaluate the GitHub App install requirement before choosing Renovate vs. custom workflow.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/workflows/helm-update-check.yaml`

### LOKI-03: values/loki.yaml sets Loki memory requests and limits to identical values: 256Mi requests, 256Mi limits. Loki spikes mem

Affects: `receptor-infra` — Loki Memory Limits


- [ ] In values/loki.yaml, set Loki memory limit to 512Mi (2x current 256Mi) while keeping requests at 256Mi. This gives headroom for cardinality spikes without increasing baseline resource cost. Monitor actual usage via Prometheus for 2 weeks post-change.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/loki.yaml`

### GITOPS-02: Several Helm chart values reference mutable image tags rather than pinned SHA digests. Mutable tags are a supply-chain r

Affects: `receptor-infra` — Image Digest Pinning


- [ ] After Flux bootstrap (GITOPS-01), enable Flux Image Automation: flux create image repository and flux create image policy for each workload image. Set update-automation to commit digest-pinned image references to Git automatically via PRs.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/clusters/receptor/image-automation/`

### CI-02: No pre-commit configuration exists in receptor-infra. A developer can commit a syntactically invalid values/ file that o

Affects: `receptor-infra` — Pre-commit Validation


- [ ] Add a .pre-commit-config.yaml to receptor-infra: hooks for yamllint, helm lint (via a local script), and detect-secrets (for accidental credential commits). Run pre-commit install in the repo README setup instructions.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.pre-commit-config.yaml`

### TFCI-01: terraform/ is fully implemented (key-vault, backup-storage, azure-workload-identity modules) with remote state in Azure 

Affects: `receptor-infra` — Terraform CI Workflow


- [ ] Create .github/workflows/terraform.yaml: on PR run terraform fmt -check, terraform validate, terraform plan (output as PR comment). On merge to main run terraform apply -auto-approve. Use OIDC federation for Azure authentication — no static secrets needed (matching the existing use_azuread_auth backend config).
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/workflows/terraform.yaml`

## 🟢 Low

### MON-02: `AppPodCrashLooping` fires at &#62;3 restarts in 15 minutes only. This misses persistent low-rate crash loops (1–2 restarts 

Affects: `receptor-infra` — Alert Thresholds


- [ ] Add a complementary slow crash-loop alert: `rate(kube_pod_container_status_restarts_total[1h]) &#62; 0.5` with 30-minute `for` duration and `warning` severity.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/monitoring/prometheus-rules.yaml`

### PROV-01: The k3s join commands are inline comments without a reproducible installation method. Emergency node replacement require

Affects: `receptor-infra` — Node Bootstrap


- [ ] Create `provisioning/README.md` documenting the exact k3s install command sequence (including all required flags) for both control-plane and worker nodes.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/provisioning/README.md`

### DOC-02: `rbac/namespaces.yaml` pre-declares the `falco` namespace but no ADR explains why Falco was disabled, what mitigations e

Affects: `receptor-infra` — Falco ADR


- [ ] Create `docs/adr/ADR-012-runtime-security-falco.md` explaining the disable decision and timeline for re-enablement, or remove the `falco` namespace declaration if Falco is permanently decommissioned.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/docs/adr/ADR-012-runtime-security-falco.md`

### DOC-03: `values/vault.yaml` header reads `# Helm values for hashicorp/vault (v0.28.1)` but `helmfile.yaml` uses `version: '0.32.

Affects: `receptor-infra` — Vault Values Header


- [ ] Update the comment at line 2 of `values/vault.yaml` to read `v0.32.0`.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/values/vault.yaml`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | KCTL-03, SEC-01, VAULT-01 | Secrets encryption and runtime security (Falco) are the highest-leverage security improvements and address the root cause of cluster brittleness. |
| 2 | KCTL-05, VAULT-02, GITOPS-01 | Without etcd snapshots and Vault on replicated storage, a single node disk failure is a cluster-ending event. These must be addressed before any further work. |
| 3 | KCTL-04, MON-03, NET-01, VAULT-03, KYVERNO-01, ARC-01, KYVERNO-02, KYVERNO-02, CI-01, CI-02, TFCI-01 | Completes the security hardening layer needed to meet CIS benchmark and ISO 27001 controls. |
| 4 | STORE-01, KCTL-06, KCTL-01, KCTL-02, PROV-01, ETCD-01, OPS-01, HELM-01, OPS-01, HELM-01, GITOPS-02 | Improves cluster resilience and eliminates tribal knowledge from the emergency recovery path. |
| 5 | MON-01, MON-02, STORE-02, DRIFT-01, DOC-01, DOC-02, DOC-03, MON-04, CERT-01, LOKI-02, LOKI-03, LOKI-02, LOKI-03 | Cleans up tech debt, documentation drift, and purpose drift findings that do not carry immediate operational risk. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| KCTL-03 | k3s Control Plane | `user-data` | Security | 🔴 Critical |
| KCTL-05 | k3s Backup | `user-data` | Architectural Drift | 🔴 Critical |
| VAULT-01 | Vault | `ADR-006-vault-unseal.md` | Architectural Drift | 🔴 Critical |
| SEC-01 | Runtime Security | `helmfile.yaml` | Security | 🔴 Critical |
| KCTL-01 | k3s Control Plane | `user-data` | Documentation Gap | 🟠 High |
| KCTL-02 | k3s Control Plane | `k3s-server-config.yaml.template` | Process Gap | 🟠 High |
| KCTL-04 | k3s API Audit Log | `audit-policy.yaml` | Security | 🟠 High |
| VAULT-02 | Vault Storage | `vault.yaml` | Security | 🟠 High |
| MON-03 | Pod Security Standards | `namespaces.yaml` | Security | 🟠 High |
| NET-01 | Network Policies | `network-policies.yaml` | Security | 🟠 High |
| STORE-01 | Zot Registry | `zot-values.yaml` | Architectural Drift | 🟠 High |
| KYVERNO-01 | Kyverno Policy | `namespace-isolation.yaml` | Architectural Drift | 🟠 High |
| ARC-01 | ARC Runner Privilege | `helmfile.yaml` | Security | 🟠 High |
| KYVERNO-02 | Kyverno Chart Regression | `helmfile.yaml` | Architectural Drift | 🟠 High |
| OPS-01 | Operational Runbooks | `runbooks` | Process Gap | 🟠 High |
| GITOPS-01 | GitOps Continuous Reconciliation | `ADR-012-gitops-flux.md` | Architectural Drift | 🟠 High |
| CI-01 | PR Validation Pipeline | `validate-pr.yaml` | Process Gap | 🟠 High |
| KCTL-06 | k3s API Server HA | `user-data` | Architectural Drift | 🟡 Medium |
| VAULT-03 | Vault TLS | `vault.yaml` | Security | 🟡 Medium |
| MON-01 | Prometheus Operator | `prometheus-stack.yaml` | Tech Debt | 🟡 Medium |
| STORE-02 | Longhorn UI | `longhorn.yaml` | Security | 🟡 Medium |
| DOC-01 | Documentation Drift | `audit-logging.md` | Documentation Gap | 🟡 Medium |
| DRIFT-01 | Descheduler | `descheduler.yaml` | Tech Debt | 🟡 Medium |
| ETCD-01 | etcd Health Monitoring | `prometheus-rules.yaml` | Process Gap | 🟡 Medium |
| MON-04 | Loki Storage Alerting | `prometheus-rules.yaml` | Process Gap | 🟡 Medium |
| CERT-01 | cert-manager Resource Limits | `cert-manager.yaml` | Tech Debt | 🟡 Medium |
| LOKI-02 | Loki Archive Tier | `loki.yaml` | Documentation Gap | 🟡 Medium |
| HELM-01 | Chart Version Automation | `renovate.json` | Process Gap | 🟡 Medium |
| LOKI-03 | Loki Memory Limits | `loki.yaml` | Tech Debt | 🟡 Medium |
| GITOPS-02 | Image Digest Pinning | `image-automation` | Security | 🟡 Medium |
| CI-02 | Pre-commit Validation | `.pre-commit-config.yaml` | Process Gap | 🟡 Medium |
| TFCI-01 | Terraform CI Workflow | `terraform.yaml` | Process Gap | 🟡 Medium |
| MON-02 | Alert Thresholds | `prometheus-rules.yaml` | Process Gap | 🟢 Low |
| PROV-01 | Node Bootstrap | `README.md` | Process Gap | 🟢 Low |
| DOC-02 | Falco ADR | `ADR-012-runtime-security-falco.md` | Documentation Gap | 🟢 Low |
| DOC-03 | Vault Values Header | `vault.yaml` | Documentation Gap | 🟢 Low |

