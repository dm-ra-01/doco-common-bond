# Standards Anchoring Ecosystem Audit

**Date:** 2026-03-19\
**Scope:** Cross-ecosystem — all 12 prior global audits; `docs/registers/standards-register.md`; `docs/compliance/iso27001/`\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO/IEC 27001:2022 Clause 7.5 (documented information control); ISO 27001 Clause 6.1 (risk treatment with evidence); Clause 9.1 (measurement and monitoring)

---

## Executive Summary

This audit examines how well the Receptor ecosystem's prior audit findings are anchored to formal external standards, and whether the existing Standards Register adequately covers the compliance frameworks needed across security, availability, integrity, accountability, performance, and testability domains. **15 findings** were identified across 5 areas: **3 Critical**, **6 High**, **5 Medium**, **1 Low**.

The Standards Register at `docs/registers/standards-register.md` already exists and correctly lists 6 external reference standards (`REF-STD-001` to `REF-STD-006`). However, five domains — availability/BCM, supply-chain integrity, application security testing, AI management, and service performance — have **zero formal standard citations** across all prior audits despite being substantively addressed in code. This creates a compliance gap: implementations exist but the evidential standard that justifies them does not.

The most significant structural finding is that **the Standards Register has no compliance-status column** — it records what standards exist but not the ecosystem's current compliance posture against each. This makes it unsuitable as an audit evidence artefact.

| Area | Coverage | Issues Found | Overall |
| --- | --- | --- | --- |
| Standards Register schema completeness | ⚠️ | 2 | ⚠️ |
| Security domain anchoring | ⚠️ | 3 | ⚠️ |
| Availability / BCM domain anchoring | ❌ | 2 | ❌ |
| Integrity / supply-chain domain anchoring | ❌ | 2 | ❌ |
| Testability domain anchoring | ⚠️ | 2 | ⚠️ |
| Performance / SLO domain anchoring | ❌ | 2 | ❌ |
| AI governance anchoring | ⚠️ | 2 | ⚠️ |

---

## 1. Standards Register Schema

### 1.1 No Compliance-Status Column

**Strengths:**

- `docs/registers/standards-register.md` correctly identifies 6 external reference frameworks (`REF-STD-001` to `REF-STD-006`) with type, scope, issuing body, and relevance.
- The Register of Registers correctly classifies this file as `CORP-REG-002`.
- The existing `Status` column distinguishes Active/Draft/Planned — adequate for internal documents.

**Gaps:**

- **STD-01** [`docs/registers/standards-register.md`, Referenced External Frameworks table] The External Frameworks table has no `Compliance Posture` column. An auditor reviewing the register can see which standards are "Active" but cannot determine whether the organisation considers itself compliant, partially compliant, or non-compliant. ISO 27001 Clause 9.1 requires organisations to determine "what needs to be monitored and measured" for ISMS performance — a standards register without compliance-posture data satisfies the document control clause (7.5) but not the measurement clause (9.1).

### 1.2 Missing External Frameworks

**Gaps:**

- **STD-02** [`docs/registers/standards-register.md`] Five frameworks identified as high-priority in prior audit analysis are absent from the register: (1) **ISO 22301:2019** (BCM — the BCP exists but has no standard anchor); (2) **OWASP ASVS v4** (application security verification — RLS/pgTAP tests exist with no standard citation); (3) **SLSA Level 2** (supply-chain — SHA-pinning is implemented but not formally anchored); (4) **ISO/IEC 42001:2023** (AI management system — deferred in `260307-iso27001-ai-gaps` but never formally registered); (5) **CIS Kubernetes Benchmark** (container security — RBAC and network policy findings in `260312-cicd-environments` and `260316-terraform-iac-gap` have no standard anchor). The absence of these entries means no review cadence, no owner, and no status tracking exists for standards the ecosystem actively implements.

---

## 2. Security Domain Anchoring

### 2.1 OWASP ASVS Not Referenced for Application Security Tests

**Strengths:**

- ISO 27001 A.8.25 (secure development lifecycle) is correctly cited in `260312-cicd-environments` and `260319-cicd-workflow-health`.
- RLS tests (`RLS.test.ts`), pgTAP security test suite (`11_security_policies.test.sql`), and Playwright auth tests exist across the ecosystem.

**Gaps:**

- **SEC-01** [Cross-ecosystem — `supabase-receptor/supabase/tests/database/`, frontend `src/test/security/`] No audit has mapped the existing security test suite to an application security verification standard. The OWASP Application Security Verification Standard (ASVS) v4 defines three verification levels (L1 → L3); mapping the existing tests to ASVS would quantify the current verification posture and surface gaps systematically. Without this mapping, security test coverage is asserted but not evidenced against any external standard. ISO 27001 Clause 8.3 requires evidence that risk treatments are implemented.

### 2.2 Supply-Chain Security Not Anchored to SLSA

**Gaps:**

- **SEC-02** [Cross-ecosystem — `.github/workflows/` all repos] Finding `SEC-02` in `260319-cicd-workflow-health` (SHA-pinning) and `SEC-01/02` in `260312-cicd-environments` correctly identified supply-chain risks. SHA-pinning has been implemented across CI workflows. However, no audit has cited the **SLSA (Supply-chain Levels for Software Artifacts) framework** — the internationally recognised standard for software supply-chain integrity. SLSA Level 2 (version-controlled, build provenance) is the appropriate target for the current infrastructure. Without a SLSA citation, supply-chain security is implemented but has no evidential standard to assert compliance against.

### 2.3 CIS Kubernetes Benchmark Not Cited for Cluster Security Findings

**Gaps:**

- **SEC-03** [`supabase-receptor` — `k3s/`, `receptor-infra` — various] Findings `RBAC-01`, `KUBE-03`, `ARCH-08`, `NET-01` across audits `260312-cicd-environments` and `260316-terraform-iac-gap` cover Kubernetes RBAC, pod security contexts, network policies, and admission control. None cite the **CIS Kubernetes Benchmark** — the authoritative baseline for k3s/Kubernetes security configuration. The benchmark provides specific, testable controls for each finding area (e.g., CIS 5.2.2 for pod security contexts; CIS 5.3.2 for NetworkPolicies). Without this anchor, findings are diagnosed against intuition rather than a scored benchmark.

---

## 3. Availability and BCM Domain Anchoring

### 3.1 Business Continuity Plan Has No Standard Anchor

**Strengths:**

- `docs/compliance/iso27001/operations/business-continuity.md` documents RTO (4-hour) and RPO targets, Supabase PITR, and Cloudflare R2 backup strategy.
- Longhorn persistent storage and R2 cross-region backup have been implemented as of `260316-terraform-iac-gap`.

**Gaps:**

- **AVAIL-01** [`docs/compliance/iso27001/operations/business-continuity.md`] The Business Continuity Plan exists as an ISO 27001 Annex A 5.29/5.30 artefact, but it is not anchored to **ISO 22301:2019** (Business Continuity Management Systems). An external ISO 27001 Stage 1 auditor will assess BCM by reference to ISO 22301 as the supporting standard. The current BCP has: no Business Impact Analysis (BIA) — required by ISO 22301 Clause 8.2.2; no recovery strategy documented separately from the operational procedures — required by ISO 22301 Clause 8.4; and no BCP exercise record — required by ISO 22301 Clause 8.5. These gaps are not visible in the current ISMS because ISO 22301 is not cited anywhere.

### 3.2 No ICT Readiness Standard Referenced

**Gaps:**

- **AVAIL-02** [Cross-ecosystem — infrastructure] **ISO/IEC 27031:2011** (Guidelines for information and communication technology readiness for business continuity) defines the IRBC (ICT Readiness for Business Continuity) framework. The ecosystem has meaningful ICT readiness implemented (k3s cluster on two VMs, Longhorn, PITR, R2 backup) but no ICT readiness assessment has been conducted and the standard is not referenced. This is a gap against ISO 27001 Clause 6.1 (considering risks related to continuity) for which ISO 27031 provides the implementation guidance.

---

## 4. Integrity and Supply-Chain Domain Anchoring

### 4.1 NIST Secure Software Development Framework Not Referenced

**Strengths:**

- `260319-cicd-workflow-health` identified and initiated fixing SHA-pinning (`DR-11`), mutable tag usage, and GitHub App token adoption.
- `260312-cicd-environments` established composite actions and environment separation.

**Gaps:**

- **INT-01** [Cross-ecosystem — all CI/CD workflows] The **NIST Secure Software Development Framework (SSDF)** (NIST SP 800-218) defines four practice groups: Prepare the Organisation (PO), Protect Software (PS), Produce Well-Secured Software (PW), and Respond to Vulnerabilities (RV). Prior audits address all four areas — branch protection (`PO.5`), SHA-pinning (`PS.1`), code coverage (`PW.8`), dependency management (`RV.1`) — but none cite the SSDF. For a healthcare-adjacent SaaS preparing for ISO 27001 certification, NIST SP 800-218 is increasingly expected by supply-chain-conscious customers and assessors. It would provide a unified framework anchor for the CI/CD security findings currently spread across four separate audits.

### 4.2 IaC Drift Has ISO 27001 Citation But No Configuration Baseline Standard

**Gaps:**

- **INT-02** [`receptor-infra`] `260316-terraform-iac-gap` correctly cited ISO 27001 A.8.9 (configuration management) for IaC drift findings. However, the finding stops short of citing **CIS Azure Foundations Benchmark** or **NIST SP 800-190** (application container security) for the container/cloud findings. The Azure Key Vault network ACL finding (`SEC-01` in the terraform audit) directly maps to CIS Azure Foundations Benchmark 9.x (Key Vault) controls but this is not noted. A formal benchmark citation would turn the finding from an observation into a scorable compliance gap.

---

## 5. Testability Domain Anchoring

### 5.1 No Testing Standard Maps Tests to Security Claims

**Strengths:**

- `260311-testing-efficiency` comprehensively audited the test architecture across all repos.
- The pgTAP suite (18 files) covers structural, referential, functional, security, and performance concerns.

**Gaps:**

- **TEST-01** [Cross-ecosystem] No prior audit has mapped the test suites to **OWASP ASVS** verification levels. Without this mapping, it cannot be asserted that the system meets any security verification level. The gap matters for ISO 27001 Clause 8.2 (information security risk assessment) — treatments are tested but the tests' completeness is unverifiable without a standard claim. An ASVS L1 claim (achievable today with existing tests) would immediately improve the evidential posture.

### 5.2 Accessibility Not Anchored to WCAG

**Gaps:**

- **TEST-02** [Cross-ecosystem — all frontend repos] `vitest-axe` and `@axe-core/playwright` are installed in all three frontend repos. `260306-frontend-compliance` identified that `vitest-axe` is installed but usage was unverified (`CROSS-16`). No audit has cited **WCAG 2.2 AA** as the accessibility standard the frontend applications should comply with. For a platform serving hospital workers (a healthcare workplace), WCAG 2.2 AA compliance is likely a contractual requirement with hospital customers. The `ENG-STD-001` (Frontend Engineering Standards) does not mention WCAG.

---

## 6. Performance and SLO Domain Anchoring

### 6.1 No SLO Standard Referenced

**Strengths:**

- Smoke tests exist (`staging-smoke.yml`, `prod-deploy.yml` smoke gate) providing basic functional SLIs.
- Grafana/Prometheus/Alertmanager stack is planned in `260312-cicd-environments`.

**Gaps:**

- **PERF-01** [Cross-ecosystem] No audit has defined or cited Service Level Objectives for any ecosystem service. **ISO/IEC 20000-1:2018** (IT service management) requires SLA/SLO definitions for managed services. The ecosystem is approaching a state where hospital customers will expect uptime and response time commitments — but no SLO targets are documented, and no standard governs what "acceptable performance" means. As a minimum, `receptor-api.commonbond.au` (PostgREST) and `receptor-auth.commonbond.au` should have defined availability SLOs.

### 6.2 Observability Stack Has No Standard Anchor

**Gaps:**

- **PERF-02** [`supabase-receptor` — k3s monitoring namespace] The Grafana/Loki/Prometheus/Alertmanager stack is outlined in `260312-cicd-environments` (ARCH-07) and `260316-terraform-iac-gap` findings. **OpenTelemetry** is the CNCF standard for observability signal collection (metrics, logs, traces). No OpenTelemetry standard is referenced. For the Grafana/Loki stack to serve as an evidence artefact for ISO 27001 A.8.15 (Logging) and A.8.16 (Monitoring), the collection must be systematic and standardised. OpenTelemetry provides the vendor-neutral framework.

---

## 7. AI Governance Anchoring

### 7.1 ISO/IEC 42001:2023 Not Formally Registered

**Strengths:**

- `260307-iso27001-ai-gaps` correctly cited ISO/IEC 42001:2023 as a forward-roadmap standard and noted it as deferred.
- ASD/ACSC and OAIC AI guidance are already registered in the Standards Register (`REF-STD-006`).

**Gaps:**

- **AI-01** [`docs/registers/standards-register.md`] ISO/IEC 42001:2023 (AI Management Systems) was identified in the AI audit as a priority standard for the next ISMS review cycle. It has never been added to the Standards Register — not even as `📅 Planned` status. Without a registry entry, there is no review cadence, no owner, and no transition plan. The standard uses the same High-Level Structure as ISO 27001, enabling integrated ISMS+AIMS certification. This is material for a company whose core development toolchain is AI-assisted.

### 7.2 OWASP LLM Top 10 Not Referenced for Prompt Injection Findings

**Gaps:**

- **AI-02** [`260307-iso27001-ai-gaps` — finding AI-004] The AI audit identified prompt injection as a risk (`AI-004` — adversarial prompt injection targeting AI-assisted workflows). The **OWASP Top 10 for LLM Applications** (2025 edition) provides the authoritative classification for LLM-specific risks: LLM01 (Prompt Injection), LLM02 (Insecure Output Handling), LLM06 (Excessive Agency). The `AI-004` risk register entry does not cite this standard. For a team using an agentic AI (Antigravity) with write access to production repositories and the ability to commit code, prompt injection is a material operational risk that warrants a named standard in the risk register entry.

---

## 8. Cross-Cutting Observations

1. **ISO 27001 A.8.25/A.8.31/A.8.32 are overloaded.** These three Annex A controls are cited in 6 of 10 prior audits for findings ranging from CI configuration to deployment pipelines to key rotation. The finding descriptions are accurate, but mapping 30+ distinct findings to 3 controls reduces auditability — an assessor cannot distinguish which controls address which risks. The proposed standard additions (SLSA, OWASP ASVS, NIST SSDF) would provide more precise anchors for what currently crowds under A.8.25.

2. **The Standards Register is the right home for external frameworks.** The existing `docs/registers/standards-register.md` structure — with `REF-STD-NNN` IDs — is the appropriate location for all new framework entries. The iso27001 compliance documentation section should reference the register, not house the framework entries directly.

3. **Compliance posture data belongs in the Standards Register alongside the standard citation.** Australian healthcare customers performing procurement due diligence will ask "what standards do you comply with?" — the current register answers "what standards exist" but not "where are you against each one." A `Compliance Posture` column resolves this for both internal and external consumption.

4. **Five of the 15 findings are a direct consequence of implementing work without registering the standard.** SLSA (SHA-pinning done), OWASP ASVS (RLS tests done), ISO 22301 (BCP done), NIST SSDF (secure dev lifecycle done), CIS Kubernetes (RBAC/NetworkPolicy done) — in each case the engineering is largely correct but unanchored. The implementation cost to register these standards is minimal; the audit evidence value is high.

---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| --- | --- | --- | --- | --- |
| STD-01 | Standards Register | `docs/registers/standards-register.md` | Process Gap | 🔴 Critical |
| STD-02 | Standards Register | `docs/registers/standards-register.md` | Compliance | 🔴 Critical |
| AVAIL-01 | Business Continuity | `docs/compliance/iso27001/operations/business-continuity.md` | Compliance | 🔴 Critical |
| SEC-01 | Application security tests | Cross-ecosystem | Compliance | 🟠 High |
| SEC-02 | Supply-chain / SHA-pinning | Cross-ecosystem workflows | Compliance | 🟠 High |
| SEC-03 | Kubernetes cluster security | `supabase-receptor` k3s, `receptor-infra` | Compliance | 🟠 High |
| AVAIL-02 | ICT readiness | Cross-ecosystem infrastructure | Compliance | 🟠 High |
| INT-01 | Secure dev lifecycle | Cross-ecosystem CI/CD | Compliance | 🟠 High |
| AI-01 | AI governance register | `docs/registers/standards-register.md` | Process Gap | 🟠 High |
| INT-02 | IaC / cloud security baseline | `receptor-infra` | Compliance | 🟡 Medium |
| TEST-01 | Security test verification | Cross-ecosystem | Compliance | 🟡 Medium |
| TEST-02 | Accessibility testing | Frontend repos | Compliance | 🟡 Medium |
| PERF-01 | SLO definitions | Cross-ecosystem | Process Gap | 🟡 Medium |
| PERF-02 | Observability standard | `supabase-receptor` k3s | Process Gap | 🟡 Medium |
| AI-02 | LLM risk register citation | `docs/compliance/iso27001/risk-management/risk-register.md` | Compliance | 🟢 Low |
