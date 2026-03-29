# Migration Sub-Audit: k3s Retirement Strategy

**Date:** 2026-03-28\
**Scope:** Infrastructure Migration from Self-Hosted k3s to Hybrid Cloud (Supabase/GCP/Coolify)\
**Auditor:** Ryan Ammendolea\
**Reference:** 260328-infra-hosting-planning

---

## 1. Audit Objective

This sub-audit evaluates the technical and operational readiness for decommissioning the Receptor self-hosted k3s cluster. The primary goal is to ensure that the transition to managed services (Supabase Cloud, GCP) and simplified self-hosting (Coolify) maintains **data residency**, improves **development velocity**, and aligns with **ISO 27001** pre-certification requirements.

---

## 2. Key Findings (Migration Focus)

### 2.1 The "Sovereignty-Maintenance" Paradox
- **MIG-01:** The current k3s setup achieves 100% data sovereignty but at a 60-80% engineering time cost for infrastructure stability (Ref: `audit-brief.json` session history). Retiring k3s is the only path to restoring product velocity.
- **MIG-02:** Managed Sydney regions for GCP and Supabase Cloud provide sufficient legal data residency (APP 8/11) while inheriting vendor ISO 27001 controls.

### 2.2 Agentic Workflow Bottleneck
- **MIG-03:** The self-hosted environment lacks native, high-performance integration with modern LLM providers (Vertex AI / Azure OpenAI). Running backends in k3s requires manual secret injection and complex ingress/egress management, which slows down AI agent development.

### 2.3 Non-Critical Service Bloat
- **MIG-04:** Services like Zot (registry cache) and internal documentation mirrors do not require the HA complexity of Kubernetes. Hosting these in a single-node Coolify VM reduces the "moving parts" count by >50%.

### 2.4 CI/CD & Secret Management Friction
- **MIG-05:** Current CI/CD relies on self-hosted ARC runners for in-cluster Vault access. This creates a circular dependency: you need the cluster to run the CI that deploys to the cluster.
- **MIG-06:** Secret management is fragmented between Azure Key Vault (unseal), in-cluster Vault (app secrets), and GitHub Secrets. Consolidation into **GCP Secret Manager** with **Workload Identity Federation (OIDC)** is required for ISO 27001 auditability and engineering simplicity.

---

## 3. Migration Readiness Scorecard

| Category | Readiness | Issue |
| :--- | :--- | :--- |
| **Data Residency** | ✅ Ready | Sydney regions validated for Supabase/GCP. |
| **Secret Mgmt** | 🔴 Needs Work | Transition from Vault/VSO to OIDC-based GCP Secret Manager. |
| **CI/CD** | 🟠 Needs Work | Retire ARC runners; switch to `ubuntu-latest`. |
| **Observability** | 🟡 Partial | Need to enable GCP Cloud Logging/Monitoring. |
| **Networking** | 🟠 Needs Work | Cloudflare Tunnel needs reconfiguration for Cloud Run. |

---

## 4. Final Verification Criteria

1.  **Zero k3s dependencies:** No code references to `kubectl`, `helmfile`, or `Longhorn` in production repositories.
2.  **Verified Residency:** Audit logs confirm all production data in `ap-southeast-2` (Supabase) and `australia-southeast1` (GCP).
3.  **ISO 27001 Evidence:** Supplier register updated with GCP and Supabase Cloud SOC2/ISO 27001 certificates.
