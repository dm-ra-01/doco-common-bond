# Cloud Adoption Policy
# Audit ref: 260328-infra-hosting — HOSTING-13-T1

**Date:** 2026-03-28\
**Owner:** Engineering Leadership\
**Status:** Approved\
**Scope:** All Common Bond and Receptor technical infrastructure

---

## 1. Objective

Common Bond is committed to maintaining a focus on product engineering and AI innovation. This policy establishes a "Cloud-First" strategy to minimize operational overhead while inheriting world-class security controls.

## 2. Infrastructure Tiers

We categorize our systems into three tiers for hosting:

### 2.1 Critical Production (Managed Cloud)
*   **Target:** Google Cloud Platform (GCP) and Supabase Cloud.
*   **Policy:** No production workloads should be self-hosted unless there is a strictly mandated regulatory requirement for data sovereignty that cannot be met by Australian regions of tier-1 providers.
*   **Residency:** All customer data must reside in Australia (Sydney/Melbourne).

### 2.2 Internal Support (Simplified Self-Hosting)
*   **Target:** Single-node PaaS (Coolify).
*   **Policy:** Internal tools such as documentation mirrors, CI metrics, and experimental dev sandboxes can be self-hosted to minimize cost.
*   **Constraints:** No PII or customer data allowed in Tier 2 environments.

### 2.3 Ephemeral (GitHub/Vercel)
*   **Target:** Managed CI/CD and edge frontends.
*   **Policy:** Use GitHub-hosted runners for CI to avoid maintenance loops (circular dependencies).

---

## 3. Provider Selection

When choosing a new provider, we prioritize:
1.  **Australian Region Availability** (mandatory for critical data).
2.  **Infrastructure-as-Code Support** (Terraform/OpenTofu).
3.  **Managed Security Controls** (WAF, IAM, Secret Manager).
4.  **AI/LLM Ecosystem Compatibility** (Vertex AI, etc.).

## 4. Security & Compliance

All cloud adoption must comply with:
- **ISO 27001 Annex A.14** (System Acquisition, Development, and Maintenance).
- **APP 8 & 11** (Australian Privacy Act).
- **Workload Identity Federation (WIF)** (OIDC-based auth; no static longevity secrets).

---

## 5. Decision Log

- **2026-03-28:** Decision to retire the self-hosted k3s cluster in favor of GCP (Cloud Run) and Supabase Cloud (Sydney/Melbourne residency).
