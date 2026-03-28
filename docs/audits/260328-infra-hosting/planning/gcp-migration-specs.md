# GCP Migration Specifications (Backends & Frontends)

This document specifies the technical configuration for migrating Receptor ecosystem services to Google Cloud Platform (GCP).

## 1. Infrastructure-as-Code (Terraform)

GCP provides a robust [Google Cloud Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs) for Terraform. We will use Terraform to manage all resources to ensure reproducibility and ISO 27001 compliance (Annex A.8.14).

### Key Resources
- `google_cloud_run_v2_service`: Manages the lifecycle of backends and frontends.
- `google_secret_manager_secret`: Stores sensitive environment variables.
- `google_iam_workload_identity_pool`: Enables OIDC-based authentication from GitHub Actions.
- `google_artifact_registry_repository`: Host for Docker images (Melbourne).
- `google_compute_region_network_endpoint_group`: (Optional) Portals for Cloudflare integration.

---

## 2. Repository Mapping

| Repository | Type | Port | Entrypoint | Cloud Run Service Name |
| :--- | :--- | :--- | :--- | :--- |
| `planner-backend` | Python | 8000 | `uvicorn main:app` | `planner-api` |
| `match-backend` | Python | 8000 | `uvicorn main:app` | `match-api` |
| `planner-frontend` | Next.js | 3000 | `node server.js` | `planner-ui` |
| `preference-frontend` | Next.js | 3000 | `node server.js` | `preference-ui` |
| `workforce-frontend` | Next.js | 3000 | `node server.js` | `workforce-ui` |

---

## 3. Backend Migration (Python/FastAPI)
*Target: `planner-backend`, `match-backend`*

### Cloud Run Configuration
| Parameter | Value | Rationale |
| :--- | :--- | :--- |
| **Region** | `australia-southeast2` (Melbourne) | Lowest latency for local agentic workflows. |
| **Memory** | 512MB - 1GB | FastAPI is lightweight; 1GB for AI-heavy paths. |
| **CPU** | 1 vCPU | Sufficient for asynchronous request handling. |
| **Port** | 8000 | Matches current `Dockerfile` EXPOSE. |
| **Concurrency** | 80 | Standard default for Cloud Run. |
| **Authentication** | `no-auth` (Public) | Protected at the edge by Cloudflare and application JWTs. |

### Secret Management
Secrets will be injected from **GCP Secret Manager** as environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLANNER_API_KEY`

---

## 3. Frontend Migration (Next.js)
*Target: `planner-frontend`, `preference-frontend`, `workforce-frontend`, `website-frontend`*

### Cloud Run Configuration
| Parameter | Value | Rationale |
| :--- | :--- | :--- |
| **Region** | `australia-southeast2` (Melbourne) | Data residency and SSR performance. |
| **Memory** | 512MB | Default for standalone Next.js. |
| **Port** | 3000 | Matches Next.js standalone default. |
| **Execution Env** | `gen2` | Better performance for Node.js workloads. |

### Build-Time Configuration (Critical)
Next.js inlines `NEXT_PUBLIC_*` variables at **build time**.
1. **CI Change:** GitHub Actions must fetch these from GCP Secret Manager *before* running `docker build`.
2. **Build Args:** Pass as `--build-arg` to the `docker build` command.

---

## 4. Connectivity & Load Balancing

### Cloudflare Integration
1. **Origin:** Cloud Run `*.a.run.app` URL (restricted to Cloudflare IP ranges via GCP Firewall/NetPol).
2. **SSL:** Cloudflare manages the edge certificate; Cloud Run handles managed SSL for the origin.
3. **WAF:** Global WAF rules applied at Cloudflare.

### Deployment Flow (OIDC)
```mermaid
sequence-diagram
    GitHub-Actions ->> GCP-STS: Request Token (OIDC)
    GCP-STS -->> GitHub-Actions: Access Token
    GitHub-Actions ->> Secret-Manager: Fetch Build-Args
    GitHub-Actions ->> Artifact-Registry: Push Image
    GitHub-Actions ->> Cloud-Run: Deploy Revision
```

---

## 5. Migration Tasks (IaC)

1. **[NEW]** `receptor-infra/terraform/gcp/main.tf`: Bootstrap project and networking.
2. **[NEW]** `receptor-infra/terraform/gcp/iam.tf`: Workload Identity Federation (WIF).
3. **[NEW]** `receptor-infra/terraform/gcp/cloud-run.tf`: Service templates for each app.
4. **[MODIFY]** `.github/workflows/deploy.yml`: Replace ARC runner logic with GCP Auth + Cloud Run deploy.
