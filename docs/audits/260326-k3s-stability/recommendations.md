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
| 2 | KCTL-05, VAULT-02 | Without etcd snapshots and Vault on replicated storage, a single node disk failure is a cluster-ending event. These must be addressed before any further work. |
| 3 | KCTL-04, MON-03, NET-01, VAULT-03 | Completes the security hardening layer needed to meet CIS benchmark and ISO 27001 controls. |
| 4 | STORE-01, KCTL-06, KCTL-01, KCTL-02, PROV-01 | Improves cluster resilience and eliminates tribal knowledge from the emergency recovery path. |
| 5 | MON-01, MON-02, STORE-02, DRIFT-01, DOC-01, DOC-02, DOC-03 | Cleans up tech debt, documentation drift, and purpose drift findings that do not carry immediate operational risk. |


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
| KCTL-06 | k3s API Server HA | `user-data` | Architectural Drift | 🟡 Medium |
| VAULT-03 | Vault TLS | `vault.yaml` | Security | 🟡 Medium |
| MON-01 | Prometheus Operator | `prometheus-stack.yaml` | Tech Debt | 🟡 Medium |
| STORE-02 | Longhorn UI | `longhorn.yaml` | Security | 🟡 Medium |
| DOC-01 | Documentation Drift | `audit-logging.md` | Documentation Gap | 🟡 Medium |
| DRIFT-01 | Descheduler | `descheduler.yaml` | Tech Debt | 🟡 Medium |
| MON-02 | Alert Thresholds | `prometheus-rules.yaml` | Process Gap | 🟢 Low |
| PROV-01 | Node Bootstrap | `README.md` | Process Gap | 🟢 Low |
| DOC-02 | Falco ADR | `ADR-012-runtime-security-falco.md` | Documentation Gap | 🟢 Low |
| DOC-03 | Vault Values Header | `vault.yaml` | Documentation Gap | 🟢 Low |

