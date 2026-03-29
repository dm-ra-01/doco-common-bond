# Recommendations: Migration Sub-Audit

| ID | Severity | Category | Recommendation |
| :--- | :--- | :--- | :--- |
| **MIG-R1** | 🔴 Critical | Strategy | **Immediate Move to Supabase Cloud Sydney.** Offload DB/Auth management to recover >40% engineering bandwidth. |
| **MIG-R2** | 🔴 Critical | Strategy | **Adopt GCP Cloud Run for Backends (Melbourne).** Leverage native Vertex AI integration for agentic workflows in `australia-southeast2`. |
| **MIG-R3** | 🟠 High | Architecture | **Deploy Coolify for Non-Critical Apps.** Replace multi-node k3s with single-node simplicity for internal tools. |
| **MIG-R4** | 🟠 High | Security | **Migrate Secrets to GCP Secret Manager (Melbourne).** Retire self-hosted Vault and ARC. Use GitHub OIDC for credential-less secret fetching. |
| **MIG-R5** | 🟠 High | CI/CD | **Standardize on `ubuntu-latest` Runners.** Eliminate the maintenance of ARC/Runner-sets. Implement standard `actions/cache` for Node/Playwright. |
| **MIG-R6** | 🟡 Medium | Compliance | **Update ISMS Supplier Register.** Formally document the move to GCP/Supabase Cloud as primary service providers. |

---

## Implementation Roadmap

1.  **Week 1-2:** Supabase Cloud Staging Migration + Coolify Setup.
2.  **Week 3-4:** GCP Cloud Run Proof-of-Concept (Backends with Vertex AI).
3.  **Week 5-8:** Production Cutover + k3s Decommissioning.
