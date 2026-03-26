# k3s Cluster Stability & Gold Standard Audit

**Date:** 2026-03-26\
**Scope:** `receptor-infra` — k3s cluster configuration, Helm values, RBAC, network policies, monitoring, backup strategy, provisioning, and documentation\
**Auditor:** Ryan Ammendolea\
**Standard:** k3s Production Gold Standards (Rancher/SUSE), CIS Kubernetes Benchmark v1.8, ISO 27001 A.8.13 (Backup), A.8.15 (Logging), A.8.22 (Network Segregation)

---

## Executive Summary

The Receptor k3s cluster implements several mature patterns (Calico NetworkPolicies, Vault with Azure Workload Identity, Longhorn HA storage, Traefik HA, GitOps via helmfile), but exhibits structural fragility against production gold standards. The high fix-commit density (11 of the last 60 commits are `fix:` patches) confirms the user's assessment of brittleness. The root causes are architectural — not configuration detail — and concentrate in four areas: Vault as a single-point-of-failure (SPOF), absent k3s control-plane hardening flags (secrets-encryption, API audit log, etcd snapshots), Falco runtime security deliberately disabled, and documentation drift that misstates the backup destination.

**18 findings total: 3 🔴 Critical · 6 🟠 High · 5 🟡 Medium · 4 🟢 Low**

| Repository / Area                    | Coverage | Issues Found | Overall     |
| ------------------------------------ | -------- | ------------ | ----------- |
| k3s Control Plane (HA / Hardening)   | ⚠️       | 5            | 🔴 Critical |
| Vault / Secrets Management           | ⚠️       | 3            | 🔴 Critical |
| Runtime Security (Falco)             | ❌        | 1            | 🔴 Critical |
| Storage (Longhorn / Zot / local-path)| ⚠️       | 2            | 🟠 High     |
| Monitoring / Alerting                | ⚠️       | 2            | 🟠 High     |
| Network Policies                     | ✅        | 1            | 🟠 High     |
| Provisioning / Node Join             | ⚠️       | 1            | 🟠 High     |
| Documentation Drift                  | ⚠️       | 3            | 🟡 Medium   |

---

## 1. k3s Control Plane — HA and Security Hardening

### 1.1 Control Plane Topology

**Strengths:**

- 3 control-plane nodes (`receptor-ctrl-10`, `receptor-ctrl-11`, `receptor-ctrl-50`) provide quorum for the embedded etcd cluster.
- VLAN 10 segmentation (10.10.0.0/24) isolates cluster-internal traffic from internet-facing NICs.
- Static IPs are documented in `provisioning/user-data`.

**Gaps:**

- **K3S-01** `provisioning/user-data` (lines 122–136): The k3s join command shown for control-plane nodes **does not include `--cluster-init` or embedded etcd flags** (`--cluster-init` is required on the first control-plane; subsequent nodes need `--server https://…:6443`). The comment reads "run manually after first boot" with no reference to embedded etcd mode. The cluster may have been bootstrapped in embedded etcd mode, but the provisioning document does not codify this, creating an unrecoverable ambiguity for future node additions.
- **K3S-02** `provisioning/user-data`, `docs/environment/` (not found): No `k3s` config file (`/etc/rancher/k3s/config.yaml`) is checked into the repository. The cluster's `--flannel-backend=none`, `--disable-network-policy`, and `--node-ip` flags are referenced in comments only — they are not reproducible from the repository without tribal knowledge.
- **K3S-03** No evidence of `--secrets-encryption` in any provisioning file or ADR. Kubernetes Secrets are stored base64-encoded in etcd without AES-256 encryption at rest. Anyone with etcd access (or a database backup) can decode all cluster secrets.
- **K3S-04** No `--kube-apiserver-arg=audit-policy-file=…` or `audit-log-path=…` argument in any provisioning file. The k3s API server does not emit audit events. `docs/security/audit-logging.md` covers only pgaudit (Postgres), not the Kubernetes API audit trail. This is a gap against ISO 27001 A.8.15 and CIS 3.2.
- **K3S-05** No `--etcd-snapshot-schedule-cron` or `--etcd-snapshot-s3-*` configured. ADR-004 covers Postgres pg_dump backups only. A node loss or etcd corruption today requires a full cluster rebuild, not a point-in-time restore.

### 1.2 No External Load Balancer for the API Server

**Gaps:**

- **K3S-06** `provisioning/user-data` (line 123): The join URL is hardcoded to `https://10.10.0.10:6443` (receptor-ctrl-10). If receptor-ctrl-10 becomes unavailable, the API server becomes unreachable for new pod scheduling and kubectl operations, even though `ctrl-11` and `ctrl-50` are healthy members of the embedded etcd quorum. Gold standard: an external load balancer (HAProxy, or Cloudflare Access TCP route) distributes API traffic across all three control-plane nodes.

---

## 2. Vault — Single Point of Failure

### 2.1 Vault Standalone Mode

**Strengths:**

- Azure Key Vault auto-unseal (Workload Identity Federation, no static secret) — well configured per ADR-009.
- VSO syncs secrets automatically; no manual `kubectl create secret` needed.

**Gaps:**

- **VAULT-01** `values/vault.yaml` (line 41–59): Vault is configured as `standalone.enabled: true` with `storage "raft"` node_id = "vault-0". There is only a single Vault pod. If this pod or its node (`receptor-ctrl-50`, where it is pinned via `nodeSelector`) becomes unavailable, all VSO secret syncs fail, blocking: ARC runner authentication, Alertmanager webhook delivery, Zot GHCR sync, and Longhorn backup credentials. Recovery requires manual Vault unseal after pod restart.
- **VAULT-02** `values/vault.yaml` (line 24): Vault's data and audit storage uses `storageClass: local-path`, not Longhorn. Local-path PVs have no replication and are bound to a single node. If `receptor-ctrl-50` disk fails, Vault data is lost. The cluster's otherwise-mature Longhorn 3-replica storage is not used for the most critical service.
- **VAULT-03** `values/vault.yaml` (line 8): `global.tlsDisable: true`. Vault's inter-pod and pod-to-VSO traffic is plain HTTP. The comment in `values/vault.yaml` line 97 notes "internal cluster traffic is trusted (Calico NetworkPolicies restrict pod-to-pod access)". While NetworkPolicies do restrict access, TLS-disabled Vault means any pod on the cluster with network access to port 8200 can communicate in plaintext. A Calico policy misconfiguration or lateral movement within the cluster exposes Vault tokens in transit.

---

## 3. Runtime Security — Falco Disabled

### 3.1 Falco Chart Commented Out

**Gaps:**

- **SEC-01** `helmfile.yaml` (lines 153–161) and `values/falco.yaml` (exists on disk): The Falco runtime security chart is fully commented out. The `falco` namespace is pre-declared in `rbac/namespaces.yaml` (line 70) but has no workloads. The repository contains `falco/falco-rules.yaml` with custom rules, indicating prior intent to run Falco. At present, no in-cluster process detects: privilege escalation, unexpected shell spawning in containers, sensitive file access, or container escapes. The `node-maintenance` DaemonSet (lines 38–78 of `maintenance/node-maintenance.yaml`) runs with `privileged: true` and `hostPID: true` — exactly the class of workload Falco would flag if it were running.

---

## 4. Storage

### 4.1 Zot Registry — Single Replica on Local-Path

**Strengths:**

- Zot pull-through cache reduces Docker Hub rate-limit exposure and protects CI against upstream outages.

**Gaps:**

- **STORE-01** `registry/zot-values.yaml` (line 8): `replicaCount: 1`. Zot is a single pod. `persistence.storageClass: local-path` (line 22) means the cached layer data is bound to one node with no replication. A node failure invalidates all CI runner image caches, causing rate-limit exposure and increased pull times until the cache rebuilds. Gold standard: 2+ replicas with shared Longhorn RWX (or a PVC-less stateless mode with purely on-demand pulls).
- **STORE-02** `values/longhorn.yaml` (line 113–118): The Longhorn UI ingress uses `traefik.ingress.kubernetes.io/router.entrypoints: web` (plain HTTP, no TLS). The Longhorn UI exposes storage management including volume deletion. While access requires being inside Cloudflare Tunnel range, the plain-HTTP path means browser sessions are unencrypted between Cloudflare edge and Traefik on port 80.

---

## 5. Monitoring and Alerting

### 5.1 Prometheus Operator Webhooks Disabled

**Strengths:**

- Prometheus rules cover crash-looping pods, Longhorn volume health, node disk pressure, ARC runner health, and Alertmanager self-monitoring.
- Alertmanager routes to Slack for both incidents and deployments.

**Gaps:**

- **MON-01** `values/prometheus-stack.yaml` (lines 16–20): `prometheusOperator.admissionWebhooks.enabled: false` and `tls.enabled: false`. The comment explains this was disabled because upgrades "consistently time out." Disabling admission webhooks means malformed `PrometheusRule` CRs are silently accepted and ignored without validation. An incorrectly-written alerting rule will not be rejected at apply time — the alert simply never fires.
- **MON-02** `monitoring/prometheus-rules.yaml` (lines 34–36): `AppPodCrashLooping` fires when a pod restarts more than 3 times in 15 minutes. This threshold misses persistent low-rate crash loops (e.g. 1–2 restarts every 30 minutes) that can degrade services over days. Gold standard is `rate(…[1h]) > 0.5` or similar.

### 5.2 Missing Namespace Labels (Pod Security Standards)

**Gaps:**

- **MON-03** `rbac/namespaces.yaml`: No namespace has `pod-security.kubernetes.io/enforce` labels. Kubernetes Pod Security Standards (PSS, GA since 1.25) are not configured for any namespace. The `node-maintenance` DaemonSet uses `privileged: true` and `hostPID: true`, which would be blocked in `restricted` or `baseline` PSS namespaces. Without PSS, newly-deployed workloads can accidentally run as root or privileged without any system-level gate.

---

## 6. Network Policies

### 6.1 Monitoring Namespace — Unrestricted Egress

**Strengths:**

- Default-deny ingress is applied to all application namespaces (`supabase`, `vault`, `monitoring`, `ci-runner`, `arc-runners`, `cert-manager`).
- Traefik and cloudflared egress rules are tightly scoped.

**Gaps:**

- **NET-01** `network-policies/network-policies.yaml` (line 436): The monitoring namespace egress rule is `egress: [{}]` — fully open. The comment acknowledges this: "Allow all egress from monitoring for Prometheus scrape + Alertmanager webhooks." The inline note claims "Calico GlobalNetworkPolicy enforces that monitoring cannot write to supabase or vault data paths" — but no `GlobalNetworkPolicy` resource was found in the repository. This provides false assurance of a control that is not demonstrably enforced.

---

## 7. Provisioning and Node Bootstrap

### 7.1 Manual k3s Join Process — Undocumented Flags

**Gaps:**

- **PROV-01** `provisioning/user-data` (lines 116–136): The k3s server/agent join commands are inline comments without a reproducible installation method. The `--flannel-backend=none` and `--disable-network-policy` flags (required for Calico) are not codified. A runbook exists in `docs/environment/` but was not found in the search. If reconstruction is needed urgently, the installer flags are tribal knowledge. Gold standard: a `cloud-init` script or Ansible playbook that embeds the full reproducible install invocation, or at minimum a referenced runbook file path.

---

## 8. Documentation Drift

### 8.1 Backup Destination Mismatch

**Gaps:**

- **DOC-01** `docs/security/audit-logging.md` (line 160–170): The log retention section references "Cloudflare R2 APAC (Sydney)" as the archive destination for 90-day pgaudit logs. ADR-004 (`docs/adr/ADR-004-backup-strategy.md`) explicitly documents that Cloudflare R2 APAC was **replaced** as the primary backup destination by Azure Blob Storage `australiaeast`, because R2 APAC cannot guarantee Australian data residency. The audit-logging doc was not updated when ADR-004 was revised; it now references a superseded storage backend.

### 8.2 Falco Namespace Without Workloads

**Gaps:**

- **DOC-02** `rbac/namespaces.yaml` (line 68–71): The `falco` namespace is declared but Falco is disabled. The repository's `helmfile.yaml` comments indicate this was intentional ("chart disabled — see helmfile"), but there is no ADR or decision record explaining why Falco was disabled, what mitigations are in place, and when it is expected to be re-enabled. `docs/adr/` contains no Falco ADR.

### 8.3 Vault Values File Header — Stale Version Reference

**Gaps:**

- **DOC-03** `values/vault.yaml` (line 2): The file header reads `# Helm values for hashicorp/vault (v0.28.1)`. The helmfile (`helmfile.yaml` line 93) shows `version: "0.32.0"` with an inline comment "was 0.28.1; cluster upgraded to 0.32.0 on 2026-03-15". The values file header was not updated when the chart was upgraded.

---

## 9. Purpose Drift Observation

The `descheduler.yaml` (`maintenance/descheduler.yaml`, lines 1–13) is described as migrating pods "back to receptor-work-10 (ENTERPRISE) after it recovers" with `RemovePodsViolatingNodeAffinity`. However, lines 111–113 note:

> "deschedule plugin for Affinity violations removed — affinities have been removed cluster-wide"

The `RemovePodsViolatingNodeAffinity` plugin is enabled in the policy (line 91) but the deschedule plugin list (line 112) is `enabled: []`. The descheduler runs every 5 minutes but only executes `LowNodeUtilization`; the affinity-violation strategy it was designed for has been stripped. The config now runs a CronJob every 5 minutes to evaluate LowNodeUtilization alone — which can cause unnecessary pod evictions on an otherwise stable cluster. This is purpose drift from the original design intent.

- **DRIFT-01** `maintenance/descheduler.yaml` (lines 1–13, 111–113): The descheduler's original purpose (re-balance after ENTERPRISE recovery) has been partially rendered obsolete by removing cluster-wide affilities, but the CronJob continues to run every 5 minutes. The LowNodeUtilization strategy may cause unnecessary pod churn on workloads without PodDisruptionBudgets.

---

## 10. Cross-Cutting Observations

1. **High fix-commit density**: 11 of the last 60 commits are `fix:` patches — 18% of all commits. This is above the healthy threshold (typically ≤10% for a mature infrastructure repo). The fixes cluster around four systems: Vault auth, Zot registry credentials, ARC runner configuration, and NetworkPolicy gaps. Each of these corresponds to a finding in this audit.

2. **Privileged DaemonSet pattern**: `node-maintenance` uses `privileged: true` + `hostPID: true` + `nsenter` to access the host. This is a legitimate pattern for node-level maintenance but is elevated risk without Falco to monitor for unexpected use. The combination of a privileged DaemonSet and no runtime security represents compounding risk.

3. **Bootstrap process is not a runbook**: The cluster was built; node additions require reading comments and understanding Calico flag requirements. This makes emergency node replacement a high-risk manual operation.

---

## Severity Summary

| Finding ID | Area                          | File                                          | Category             | Severity     |
| ---------- | ----------------------------- | --------------------------------------------- | -------------------- | ------------ |
| K3S-01     | k3s control plane             | `provisioning/user-data`                      | Documentation Gap    | 🟠 High      |
| K3S-02     | k3s control plane             | `provisioning/`, `docs/environment/`          | Process Gap          | 🟠 High      |
| K3S-03     | k3s control plane             | `provisioning/user-data`                      | Security             | 🔴 Critical  |
| K3S-04     | k3s control plane             | `provisioning/user-data`                      | Security / Compliance| 🟠 High      |
| K3S-05     | k3s control plane / backup    | `provisioning/`, `docs/adr/ADR-004`           | Architectural Drift  | 🔴 Critical  |
| K3S-06     | k3s control plane             | `provisioning/user-data`                      | Architectural Drift  | 🟡 Medium    |
| VAULT-01   | Vault                         | `values/vault.yaml`                           | Architectural Drift  | 🔴 Critical  |
| VAULT-02   | Vault storage                 | `values/vault.yaml`                           | Security             | 🟠 High      |
| VAULT-03   | Vault TLS                     | `values/vault.yaml`                           | Security             | 🟡 Medium    |
| SEC-01     | Runtime Security              | `helmfile.yaml`, `falco/falco-rules.yaml`     | Security             | 🔴 Critical  |
| STORE-01   | Zot Registry                  | `registry/zot-values.yaml`                    | Architectural Drift  | 🟠 High      |
| STORE-02   | Longhorn UI                   | `values/longhorn.yaml`                        | Security             | 🟡 Medium    |
| MON-01     | Prometheus Operator           | `values/prometheus-stack.yaml`                | Tech Debt            | 🟡 Medium    |
| MON-02     | Alert Thresholds              | `monitoring/prometheus-rules.yaml`            | Process Gap          | 🟢 Low       |
| MON-03     | Pod Security Standards        | `rbac/namespaces.yaml`                        | Security             | 🟠 High      |
| NET-01     | Monitoring Egress             | `network-policies/network-policies.yaml`      | Security             | 🟠 High      |
| PROV-01    | Node Bootstrap                | `provisioning/user-data`                      | Process Gap          | 🟢 Low       |
| DOC-01     | Backup Destination Docs       | `docs/security/audit-logging.md`             | Documentation Gap    | 🟡 Medium    |
| DOC-02     | Falco ADR Missing             | `rbac/namespaces.yaml`, `docs/adr/`           | Documentation Gap    | 🟢 Low       |
| DOC-03     | Vault Values Header           | `values/vault.yaml`                           | Documentation Gap    | 🟢 Low       |
| DRIFT-01   | Descheduler Purpose Drift     | `maintenance/descheduler.yaml`                | Tech Debt            | 🟡 Medium    |
