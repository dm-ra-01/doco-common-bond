# Migration Planning: Retiring Self-Hosted k3s

## Executive Summary

The retirement of the self-hosted k3s cluster aims to shift from **Infrastructure Management** to **Product Innovation**. By offloading the operational burden of Kubernetes (etcd, Longhorn, CNI, ingress controllers) to managed providers, the engineering team can focus on AI agentic features.

Non-critical systems will be consolidated into a simplified self-hosted environment (Coolify), while all production-critical workloads migrate to Supabase Cloud and GCP.

---

## 1. Migration Phases

### Phase 1: Database & Auth (0–30 Days)
*   **Target:** Supabase Cloud (Sydney region).
*   **Action:** Migrate PostgreSQL, Auth users, and Storage buckets. 
*   **Verification:** Verify RLS policies and JWT integration in staging.

### Phase 2: Compute & Frontends (30–60 Days)
*   **Target:** Google Cloud Platform (GCP) — **Melbourne (`australia-southeast2`)**.
*   **Action:** Transition from k3s Pods to Cloud Run services for backends and frontends.
*   **Workflow Integration:** Connect Cloud Run services to Vertex AI (Gemini 1.5 Pro) via private networking in the Melbourne region.

### Phase 3: CI/CD & Secrets (60–90 Days)
*   **Target:** GitHub-Hosted Runners (`ubuntu-latest`) & GCP Secret Manager (Melbourne).
*   **Action:** 
    *   Retire ARC (Actions Runner Controller) and VSO (Vault Secrets Operator).
    *   Set up **GCP Workload Identity Federation (WIF)** to allow GitHub Actions to authenticate with GCP via OIDC.
    *   Migrate all secrets (webhooks, API keys, etc.) to GCP Secret Manager.
    *   Update all `.github/workflows` to use standard caching and the `google-github-actions/*` suite.

---

## 2. Infrastructure Targets

### 2.1 Managed Services (Critical)
*   **Supabase Cloud:** Sydney (`ap-southeast-2`) is the only available Australian region as of March 2026. This remains compliant with APP 8/11.
*   **GCP Cloud Run:** Melbourne (`australia-southeast2`) is the recommended regional landing zone for compute to align with the user's local presence.

### 2.2 Simplified Self-Hosting (Non-Critical)
Remaining physical servers (physical VMs) will be repurposed from a k3s cluster to a single-node **Coolify** instance.

> [!TIP]
> **Coolify** provides a "Vercel-like" UI for Docker Compose and simple containers. It is perfect for:
> - Internal tools
> - Documentation mirrors
> - Experimental dev environments
> - OCI Registry caches (Zot)

---

## 3. Agentic Workflow Integration: Why GCP?

Google Cloud (GCP) is the recommended landing zone for Receptor backends to support growth:

1.  **Vertex AI SDK:** Native support for tool-calling, multimodal processing (Gemini), and agentic orchestration (Agent Builder).
2.  **Firebase Integration:** If Auth or Realtime needs exceed Supabase limits, Firebase provides a seamless transition within the same billing/IAM context.
3.  **Low Latency:** GCP Sydney (`australia-southeast1`) provides sub-10ms latency to Supabase Cloud's Sydney endpoints (AWS).

---

## 4. Risk Assessment (Migration)

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Data Residency** | High | Explicitly select Sydney (`ap-southeast-2` / `australia-southeast1`) for all services. |
| **Downtime** | Medium | Execute Phased migration (Staging -> Prod). Maintain k3s cluster as read-only during cutover. |
| **Secret Exposure** | High | Bulk migrate Vault KV to GCP Secret Manager before retiring Vault. |

---

## 5. Decision Log

| Decision | Outcome | Rationale |
| :--- | :--- | :--- |
| **Compute Type** | Cloud Run | Scale-to-zero, simpler than GKE/AKS, perfect for microservices. |
| **PaaS** | Coolify | Simplest UI for self-hosting non-critical Docker workloads. |
| **Primary Cloud** | GCP | Superior AI/Agentic ecosystem (Vertex AI) compared to Azure for this use case. |
