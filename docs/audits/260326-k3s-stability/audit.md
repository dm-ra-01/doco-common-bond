# k3s Cluster Stability & Gold Standard Audit

**Date:** 2026-03-26\
**Scope:** `receptor-infra` — k3s cluster configuration, Helm values, RBAC, network policies, monitoring, backup strategy, provisioning, and documentation\
**Auditor:** Ryan Ammendolea\
**Standard:** k3s Production Gold Standards (Rancher/SUSE), CIS Kubernetes Benchmark v1.8, ISO 27001 A.8.13 (Backup), A.8.15 (Logging), A.8.22 (Network Segregation)

---

## Executive Summary

The Receptor k3s cluster implements several mature patterns (Calico NetworkPolicies, Vault with Azure Workload Identity, Longhorn HA storage, Traefik HA, GitOps via helmfile), but exhibits structural fragility against production gold standards. The high fix-commit density (11 of the last 60 commits are `fix:` patches — 18%) confirms the brittleness. Root causes are architectural: Vault as a SPOF, absent k3s control-plane hardening flags (secrets-encryption, API audit log, etcd snapshots), Falco runtime security disabled, and documentation drift.

**46 findings total: 5 🔴 Critical · 18 🟠 High · 19 🟡 Medium · 4 🟢 Low (1 ✅ Complete)**

| Repository / Area                     | Coverage | Issues Found | Overall     |
| ------------------------------------- | -------- | ------------ | ----------- |
| k3s Control Plane (HA / Hardening)    | ⚠️       | 6            | 🔴 Critical |
| Vault / Secrets Management            | ⚠️       | 3            | 🔴 Critical |
| Runtime Security (Falco)              | ❌        | 1            | 🔴 Critical |
| Storage (Longhorn / Zot / local-path) | ⚠️       | 2            | 🟠 High     |
| Monitoring / Alerting                 | ⚠️       | 3            | 🟠 High     |
| Network Policies                      | ✅        | 1            | 🟠 High     |
| Provisioning / Node Join              | ⚠️       | 1            | 🟠 High     |
| Documentation Drift                   | ⚠️       | 3            | 🟡 Medium   |
| Tech Debt (Descheduler)               | ⚠️       | 1            | 🟡 Medium   |

---

## 1. k3s Control Plane — HA and Security Hardening

### 1.1 Control Plane Topology

**Strengths:**

- 3 control-plane nodes (`receptor-ctrl-10`, `receptor-ctrl-11`, `receptor-ctrl-50`) provide quorum for the embedded etcd cluster.
- VLAN 10 segmentation (10.10.0.0/24) isolates cluster-internal traffic from internet-facing NICs.
- Static IPs are documented in `provisioning/user-data`.

**Gaps:**

- **KCTL-01** `provisioning/user-data` (lines 122–136): The k3s join command shown for control-plane nodes does not include `--cluster-init` for the first node or the correct `--server https://…:6443` pattern for subsequent nodes. The embedded etcd bootstrap mode is not codified, creating ambiguity for future node additions.
- **KCTL-02** `provisioning/user-data` (no config file present): No k3s config file (`/etc/rancher/k3s/config.yaml`) is committed to the repository. The `--flannel-backend=none`, `--disable-network-policy`, and `--node-ip` Calico flags are referenced in comments only — the cluster cannot be reproduced from the repository without tribal knowledge.
- **KCTL-03** No evidence of `--secrets-encryption` in any provisioning file or ADR. Kubernetes Secrets are stored base64-encoded in etcd without AES-256 encryption at rest. Anyone with etcd access or a database backup can decode all cluster secrets.
- **KCTL-04** No `--kube-apiserver-arg=audit-policy-file=…` or `audit-log-path=…` argument in any provisioning file. The k3s API server does not emit audit events. `docs/security/audit-logging.md` covers only pgaudit (Postgres), not the Kubernetes API audit trail. Gap against ISO 27001 A.8.15 and CIS 3.2.
- **KCTL-05** No `--etcd-snapshot-schedule-cron` or `--etcd-snapshot-s3-*` configured. ADR-004 covers Postgres pg_dump backups only. A node loss or etcd corruption today requires a full cluster rebuild with no point-in-time restore.

### 1.2 No External Load Balancer for the API Server

**Gaps:**

- **KCTL-06** `provisioning/user-data` (line 123): The join URL is hardcoded to `https://10.10.0.10:6443` (`receptor-ctrl-10`). If this node is unavailable, the API server becomes unreachable for new pod scheduling and kubectl operations, even though `ctrl-11` and `ctrl-50` are healthy etcd quorum members.

---

## 2. Vault — Single Point of Failure

### 2.1 Vault Standalone Mode

**Strengths:**

- Azure Key Vault auto-unseal (Workload Identity Federation, no static secret) — well configured per ADR-009.
- VSO syncs secrets automatically; no manual `kubectl create secret` needed.

**Gaps:**

- **VAULT-01** `values/vault.yaml` (lines 41–59): Vault is configured as `standalone.enabled: true` with a single Raft node pinned to `receptor-ctrl-50`. If this pod or node becomes unavailable, all VSO secret syncs fail, blocking ARC runner auth, Alertmanager webhook delivery, Zot GHCR sync, and Longhorn backup credentials.
- **VAULT-02** `values/vault.yaml` (line 24): Vault data and audit storage uses `storageClass: local-path`, not Longhorn. Local-path PVs have no replication and are bound to a single node. If `receptor-ctrl-50` disk fails, Vault data is permanently lost.
- **VAULT-03** `values/vault.yaml` (line 8): `global.tlsDisable: true`. Vault's pod-to-VSO and pod-to-client traffic is plain HTTP. A Calico policy misconfiguration or lateral movement within the cluster exposes Vault tokens in transit.

---

## 3. Runtime Security — Falco Disabled

### 3.1 Falco Chart Commented Out

**Gaps:**

- **SEC-01** `helmfile.yaml` (lines 153–161): The Falco runtime security chart is fully commented out. The `falco` namespace is pre-declared in `rbac/namespaces.yaml` (line 70) and `falco/falco-rules.yaml` contains custom rules, indicating prior intent. At present, no in-cluster process detects privilege escalation, shell spawning, sensitive file access, or container escapes. The `node-maintenance` DaemonSet runs with `privileged: true` and `hostPID: true` — exactly the workload class Falco is designed to monitor.

---

## 4. Storage

### 4.1 Zot Registry — Single Replica on Local-Path

**Strengths:**

- Zot pull-through cache reduces Docker Hub rate-limit exposure and protects CI against upstream outages.

**Gaps:**

- **STORE-01** `registry/zot-values.yaml` (line 8): `replicaCount: 1` with `persistence.storageClass: local-path`. A node failure invalidates all CI runner image caches, causing rate-limit exposure and CI delays during cache rebuild.
- **STORE-02** `values/longhorn.yaml` (lines 113–118): The Longhorn UI ingress uses `traefik.ingress.kubernetes.io/router.entrypoints: web` (plain HTTP, port 80). Storage management operations (including volume deletion) are unencrypted between Cloudflare edge and Traefik.

---

## 5. Monitoring and Alerting

### 5.1 Prometheus Operator Webhooks Disabled

**Strengths:**

- Prometheus rules cover crash-looping pods, Longhorn volume health, node disk pressure, ARC runner health, and Alertmanager self-monitoring.
- Alertmanager routes to Slack for both incidents and deployments.

**Gaps:**

- **MON-01** `values/prometheus-stack.yaml` (lines 16–20): `prometheusOperator.admissionWebhooks.enabled: false`. Disabled because upgrades consistently time out. Malformed `PrometheusRule` CRs are silently accepted — a broken alert rule simply never fires.
- **MON-02** `monitoring/prometheus-rules.yaml` (lines 34–36): `AppPodCrashLooping` fires at >3 restarts in 15 minutes only. This threshold misses persistent low-rate crash loops (1–2 restarts per hour) that can degrade services over days.

### 5.2 Missing Namespace Labels (Pod Security Standards)

**Gaps:**

- **MON-03** `rbac/namespaces.yaml`: No namespace has `pod-security.kubernetes.io/enforce` labels. Kubernetes Pod Security Standards (PSS, GA since 1.25) are not configured. The `node-maintenance` DaemonSet's `privileged: true` + `hostPID: true` would be blocked in `baseline` PSS namespaces. Without PSS, privileged workloads can be deployed without system-level gating.

---

## 6. Network Policies

### 6.1 Monitoring Namespace — Unrestricted Egress

**Strengths:**

- Default-deny ingress is applied to all application namespaces.
- Traefik and Cloudflared egress rules are tightly scoped.

**Gaps:**

- **NET-01** `network-policies/network-policies.yaml` (line 436): The monitoring namespace egress rule is `egress: [{}]` — fully open. An inline comment claims "Calico GlobalNetworkPolicy enforces that monitoring cannot write to supabase or vault data paths" — but no `GlobalNetworkPolicy` resource exists in the repository. This provides false assurance of a control that is not demonstrably enforced.

---

## 7. Provisioning and Node Bootstrap

### 7.1 Manual k3s Join Process — Undocumented Flags

**Gaps:**

- **PROV-01** `provisioning/user-data` (lines 116–136): k3s join commands are inline comments. `--flannel-backend=none` and `--disable-network-policy` (required for Calico) are not in any committed config file. Emergency node replacement requires tribal knowledge of the correct flags.

---

## 8. Documentation Drift

### 8.1 Backup Destination Mismatch

**Gaps:**

- **DOC-01** `docs/security/audit-logging.md` (line 160): References Cloudflare R2 APAC as the 90-day pgaudit log archive. ADR-004 documents R2 APAC was **replaced** by Azure Blob `australiaeast` for AU data residency compliance — the audit-logging doc was not updated and references a superseded backend. *(Fixed in receptor-infra commit 74f4b89.)*

### 8.2 Falco Namespace Without Workloads

**Gaps:**

- **DOC-02** `rbac/namespaces.yaml` (lines 68–71): The `falco` namespace is declared but Falco is disabled. No ADR explains the disable decision, current mitigations, or timeline for re-enablement.

### 8.3 Vault Values File Header — Stale Version Reference

**Gaps:**

- **DOC-03** `values/vault.yaml` (line 2): File header reads `# Helm values for hashicorp/vault (v0.28.1)`. `helmfile.yaml` (line 93) uses `version: "0.32.0"` with a note that the chart was upgraded on 2026-03-15. The values file header was not updated.

---

## 9. Purpose Drift Observation

The `descheduler.yaml` (`maintenance/descheduler.yaml`, lines 1–13) was designed to re-balance pods after ENTERPRISE node recovery using `RemovePodsViolatingNodeAffinity`. Lines 111–113 note: *"deschedule plugin for Affinity violations removed — affinities have been removed cluster-wide."* The plugin is enabled in policy but the `deschedule.enabled` list is `[]`. The descheduler now runs `LowNodeUtilization` every 5 minutes — its original purpose has been stripped.

- **DRIFT-01** `maintenance/descheduler.yaml` (lines 1–13, 111–113): `LowNodeUtilization` at 5-minute frequency may cause unnecessary pod eviction churn on workloads without PodDisruptionBudgets. The original affinity-rebalance intent is no longer implemented.

---

## 10. Cross-Cutting Observations

1. **High fix-commit density**: 11 of the last 60 commits are `fix:` patches (18%). Above the healthy ≤10% threshold for a mature infra repo. Fixes cluster around Vault auth, Zot credentials, ARC runner config, and NetworkPolicy gaps — each mapping to a finding above.

2. **Privileged DaemonSet without runtime security**: `node-maintenance` uses `privileged: true` + `hostPID: true` + `nsenter`. Without Falco running, no process monitors this DaemonSet for unexpected use. The intersection of SEC-01 (Falco disabled) and the node-maintenance pattern represents compounding risk.

3. **Bootstrap process is not a runbook**: Node additions require reading inline comments and knowing Calico flag requirements. Emergency node replacement is a high-risk manual operation.

---

## Severity Summary

| Finding ID | Area                         | File                                       | Category            | Severity    |
| ---------- | ---------------------------- | ------------------------------------------ | ------------------- | ----------- |
| KCTL-03    | k3s control plane            | `provisioning/user-data`                   | Security            | 🔴 Critical |
| KCTL-05    | k3s control plane / backup   | `provisioning/`, `docs/adr/ADR-004`        | Architectural Drift | 🔴 Critical |
| VAULT-01   | Vault                        | `values/vault.yaml`                        | Architectural Drift | 🔴 Critical |
| SEC-01     | Runtime Security             | `helmfile.yaml`, `falco/falco-rules.yaml`  | Security            | 🔴 Critical |
| KCTL-01    | k3s control plane            | `provisioning/user-data`                   | Documentation Gap   | 🟠 High     |
| KCTL-02    | k3s control plane            | `provisioning/`                            | Process Gap         | 🟠 High     |
| KCTL-04    | k3s control plane            | `provisioning/user-data`                   | Security            | 🟠 High     |
| VAULT-02   | Vault storage                | `values/vault.yaml`                        | Security            | 🟠 High     |
| MON-03     | Pod Security Standards       | `rbac/namespaces.yaml`                     | Security            | 🟠 High     |
| NET-01     | Monitoring Egress            | `network-policies/network-policies.yaml`   | Security            | 🟠 High     |
| STORE-01   | Zot Registry                 | `registry/zot-values.yaml`                 | Architectural Drift | 🟠 High     |
| KCTL-06    | k3s API Server HA            | `provisioning/user-data`                   | Architectural Drift | 🟡 Medium   |
| VAULT-03   | Vault TLS                    | `values/vault.yaml`                        | Security            | 🟡 Medium   |
| STORE-02   | Longhorn UI                  | `values/longhorn.yaml`                     | Security            | 🟡 Medium   |
| MON-01     | Prometheus Operator Webhooks | `values/prometheus-stack.yaml`             | Tech Debt           | 🟡 Medium   |
| DOC-01     | Backup Destination Docs      | `docs/security/audit-logging.md`           | Documentation Gap   | 🟡 Medium   |
| DRIFT-01   | Descheduler Purpose Drift    | `maintenance/descheduler.yaml`             | Tech Debt           | 🟡 Medium   |
| MON-02     | Alert Thresholds             | `monitoring/prometheus-rules.yaml`         | Process Gap         | 🟢 Low      |
| PROV-01    | Node Bootstrap               | `provisioning/user-data`                   | Process Gap         | 🟢 Low      |
| DOC-02     | Falco ADR Missing            | `rbac/namespaces.yaml`, `docs/adr/`        | Documentation Gap   | 🟢 Low      |
| DOC-03     | Vault Values Header          | `values/vault.yaml`                        | Documentation Gap   | 🟢 Low      |
| KYVERNO-01 | Orphaned Kyverno Policy      | `policies/namespace-isolation.yaml`        | Architectural Drift | 🟠 High     |
| ARC-01     | ARC Runner Privilege         | `helmfile.yaml`                            | Security            | 🟠 High     |
| ETCD-01    | etcd Size Monitoring         | `monitoring/prometheus-rules.yaml`         | Process Gap         | 🟡 Medium   |
| MON-04     | Loki Storage Alerting        | `monitoring/prometheus-rules.yaml`         | Process Gap         | 🟡 Medium   |
| CERT-01    | cert-manager Resource Sizing | `values/cert-manager.yaml`                 | Tech Debt           | 🟡 Medium   |
| KYVERNO-02 | Kyverno Chart Regression     | `helmfile.yaml`, `values/kyverno.yaml`     | Architectural Drift | 🟠 High     |
| OPS-01     | No Operational Runbooks      | `docs/runbooks/`, `monitoring/`            | Process Gap         | 🟠 High     |
| LOKI-02    | Loki Archive Tier Drift      | `values/loki.yaml`                         | Documentation Gap   | 🟡 Medium   |
| HELM-01    | No Automated Chart Updates   | `helmfile.yaml`, `renovate.json`           | Process Gap         | 🟡 Medium   |
| LOKI-03    | Loki Memory Limits           | `values/loki.yaml`                         | Tech Debt           | 🟡 Medium   |
| GITOPS-01  | No GitOps Reconciliation     | `helmfile.yaml`, `clusters/`               | Architectural Drift | 🟠 High     |
| CI-01      | No PR Validation Pipeline    | `.github/workflows/`                       | Process Gap         | 🟠 High     |
| GITOPS-02  | No Image Digest Pinning      | `values/`                                  | Security            | 🟡 Medium   |
| CI-02      | No Pre-commit Validation     | `.pre-commit-config.yaml`                  | Process Gap         | 🟡 Medium   |
| TFCI-01    | No Terraform CI Workflow     | `.github/workflows/terraform.yaml`         | Process Gap         | 🟡 Medium   |
| CLOUD-01   | Cloudflared replicaCount=1   | `values/cloudflared.yaml`                  | Architectural Drift | ✅ Complete  |
| RESI-01    | No PodDisruptionBudgets      | `maintenance/pod-disruption-budgets.yaml`  | Architectural Drift | 🟠 High     |
| SEC-02     | No Image Scanning            | `.github/workflows/`, `policies/`          | Security            | 🟠 High     |
| DRTE-01    | DR Never Tested              | `docs/operations/disaster-recovery.md`     | Process Gap         | 🟠 High     |
| RESC-01    | No Namespace ResourceQuota   | `rbac/resource-quotas.yaml`                | Architectural Drift | 🟡 Medium   |
| AUDIT-01   | No API Server Audit Logging  | `provisioning/audit-policy.yaml`           | Security            | 🔴 Critical  |
| CLDCFG-01  | Cloudflare Routes Dashboard  | `values/cloudflared-config.yaml`           | Architectural Drift | 🟠 High     |
| MUTABLE-01 | CI Pushes Mutable Tags       | `infrastructure/`, `workflows/`            | Security            | 🟠 High     |
| KCTL-07    | No etcd Quorum Alerting      | `monitoring/prometheus-rules.yaml`         | Process Gap         | 🟡 Medium   |
| PROV-02    | Partial Node Provisioning    | `provisioning/`                            | Process Gap         | 🟡 Medium   |
