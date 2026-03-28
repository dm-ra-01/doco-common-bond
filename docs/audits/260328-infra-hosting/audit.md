# Infrastructure Hosting Strategy Audit

**Date:** 2026-03-28\
**Scope:** Cross-ecosystem — `receptor-infra`, `supabase-receptor`, `documentation/common-bond` (ISMS); all application repos as consumers\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO/IEC 27001:2022 · Australian Privacy Act 1988 (APP 8, APP 11) · IRAP risk framework

---

## Executive Summary

This audit evaluates the current self-hosted infrastructure model for the Receptor platform against cloud-hosted alternatives. **Following an in-depth review of operational stability and growth constraints, the strategic decision has been made to retire the self-hosted k3s environment completely.**

The Receptor ecosystem will transition to a managed hybrid cloud architecture pinned to Australian data residency:
1.  **Data/Auth:** Migrate to **Supabase Cloud (Sydney: `ap-southeast-2`)**.
2.  **Compute/AI:** Migrate to **Google Cloud Platform (Melbourne: `australia-southeast2`)** using Cloud Run for backends/frontends.
3.  **Sec/CI:** Transition from self-hosted Vault/ARC to **GCP Secret Manager (OIDC)** and **GitHub-hosted runners**.
4.  **Non-Critical:** Consolidate remaining internal tools onto a single-node **Coolify** instance.

This pivot resolves the **unsustainable operational overhead** (HOSTING-16) that currently hinders development velocity, while inheriting significant ISO 27001 controls from tier-1 cloud providers.

| Repository / Area                  | Coverage | Issues Found | Status |
| ---------------------------------- | -------- | ------------ | ------ |
| `receptor-infra` (k3s retirement) | ✅       | 8            | 🟥 Retire |
| Supabase (managed migration)      | ✅       | 4            | 🔄 Migrate |
| GCP / Supabase Cloud (Target)      | ✅       | 2            | ✅ Approved |
| CI/CD & Secret Transition          | ✅       | 3            | 🔄 Refactor |
| ISO 27001 / ISMS alignment         | ✅       | 3            | ⚠️ Update |

---

## 1. The Strategic Pivot: Retiring k3s

### 1.1 The Sovereignty-Maintenance Paradox
The existing self-hosted k3s stack (on physical Hyper-V VMs) provided maximum data sovereignty but created a "maintenance trap." For a solo operator, the burden of managing etcd quorums, storage CSI (Longhorn), and runtime security (Falco/Kyverno) competes directly with product engineering.

**Critical Finding:**
- **HOSTING-16 — Operational Velocity Exhaustion.** Infrastructure stabilization consumed >70% of engineering bandwidth during the audit period. This is the primary blocker to the 2026-04-30 launch.

### 1.2 Retirement Roadmap
The cluster will be decommissioned in three phases:
- **Phase 1:** DB & Auth migration to Supabase Cloud Sydney.
- **Phase 2:** Compute migration to GCP Cloud Run Melbourne.
- **Phase 3:** Retirement of the k3s cluster and transition of internal tools to Coolify.

---

## 2. Managed Database & Auth (Supabase Cloud)

### 2.1 Sydney Region (`ap-southeast-2`)
- **Benefit:** Full managed service with PITR and automated backups.
- **Residency:** Data remains in Australia (AWS Sydney).
- **Risk:** Inherits US CLOUD Act risk. This is a known trade-off for operational stability and must be formally accepted in the Risk Register.

### 2.2 Gaps in Current Self-Hosted Supabase
- **HOSTING-07 — Chart Fragmentation.** Usage of community-supported Helm charts lacks a commercial SLA and trails official releases.
- **HOSTING-11 — Backup Unreliability.** Current BCP references PITR which is only available in the managed offering. Longhorn snapshots have not been validated for a 4-hour RTO.

---

## 3. Managed Compute & AI (GCP Melbourne)

### 3.1 Melbourne Region (`australia-southeast2`)
- **Strategy:** All backends and frontends will migrate to **GCP Cloud Run**.
- **Agentic Workflow:** Native integration with **Vertex AI** and Gemini model ecosystem in the Melbourne region provides superior performance and lower latency for the Receptor core.
- **Compliance:** Inherits GCP's IRAP PROTECTED and ISO 27001 certifications.

---

## 4. CI/CD & Secret Management Refactor

### 4.1 Retirement of ARC and Vault
- **HOSTING-19 — CI/CD Circular Dependency.** Current CI relies on the k3s cluster to run ARC runners to deploy to the cluster.
- **Solution:** Migrate to **GitHub-hosted runners** (`ubuntu-latest`).
- **Secret Management:** Transition from self-hosted Vault to **GCP Secret Manager** using **Workload Identity Federation (OIDC)**. This eliminates the need for the Vault stateful set and OIDC discovery host.

---

## 5. ISO 27001 & Compliance Integration

### 5.1 Evidence Inheritance
By migrating to GCP and Supabase Cloud, Receptor inherits physical and environmental security controls (Annex A.7, A.8), reducing the manual evidence collection burden for the 2026-04-30 audit by ~25%.

### 5.2 Required Documentation Updates
- **HOSTING-12 — Supplier Register.** Cloudflare, GitHub, GCP, and Supabase must be formally onboarded.
- **HOSTING-13 — Cloud Adoption Policy.** A formal decision framework for "Cloud First" must be added to the ISMS.

---

## Severity Summary

| Finding ID  | Area / Component               | Finding Description                                  | Severity       |
| ----------- | ------------------------------ | ---------------------------------------------------- | -------------- |
| HOSTING-16  | Strategy                       | **Operational Velocity Exhaustion (k3s Overhead)**   | 🔴 Critical    |
| HOSTING-19  | CI/CD                          | **Circular CI Dependency (Vault requirement)**      | 🟠 High        |
| HOSTING-18  | CI/CD                          | **CI Runner Resilience (20min max timeouts)**       | 🟢 Low         |
| HOSTING-07  | Supabase                       | **Lack of Commercial SLA (Community Chart)**         | 🟠 High        |
| HOSTING-11  | Compliance                     | **BCP/PITR Discrepancy (Unvalidated Backups)**       | 🟠 High        |
| HOSTING-13  | Governance                     | **Missing Cloud Adoption Policy**                    | 🟠 High        |
| HOSTING-12  | Suppliers                      | **Uncatalogued Suppliers (GitHub/GCP/Supabase)**     | 🟡 Medium      |
| HOSTING-06  | Isolation                      | **Prod/Staging Co-location in k3s**                  | 🟡 Medium      |
| HOSTING-20  | Secret Mgmt                    | **GCP OIDC IAM Permission Gap**                     | 🔴 Critical    |
| HOSTING-14  | Privacy                        | **Missing Data Flow Map (Residency Transparency)**   | 🟡 Medium      |
| HOSTING-05  | Ingress                        | **Cloudflare Metadata Exposure Risk**                | 🟡 Medium      |
| HOSTING-10  | IaC                            | **Plaintext IDs in Terraform Defaults**              | 🟢 Low         |
| HOSTING-15  | Risk                           | **Regulatory Creep (Future Health Data)**            | 🟢 Low         |
| HOSTING-17  | Documentation                  | **Missing Infrastructure Topology Diagram**          | 🟢 Low         |
