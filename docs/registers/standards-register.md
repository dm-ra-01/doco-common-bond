---
title: Standards Register
sidebar_position: 2
---

# Standards Register

> **CORP-REG-002 Implementation.** This register is the authoritative index of
> all named standards, policies, procedures, and guidelines in force across
> Common Bond Pty Ltd and MyJMO Pty Ltd — covering both the ISMS and
> engineering/operational governance. It fulfils the ISO 27001:2022 Clause 7.5
> ("documented information control") requirement for a current list of
> controlled documents.

**Last Updated:** 2026-03-19 (audit/260319-standards-anchoring) | **Owner:** Ryan Ammendolea, CEO | **Next Review:** 2027-03-01

---

## How to Read This Register

| Column             | Meaning                                                                                                            |
| :----------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Standard ID**    | Domain-prefixed identifier: `ISMS-STD-NNN` (ISMS), `ENG-STD-NNN` (Engineering), `REF-STD-NNN` (External Reference) |
| **Title**          | Full name of the document                                                                                          |
| **Type**           | `Policy` · `Procedure` · `Standard` · `Guideline` · `Framework`                                                    |
| **Scope**          | Who / what it applies to                                                                                           |
| **Owner**          | Accountable individual or role                                                                                     |
| **Effective Date** | When the document came into force                                                                                  |
| **Next Review**    | Scheduled review date                                                                                              |
| **Status**         | `✅ Active` · `🔄 Draft` · `📅 Planned` · `⚠️ Needs Review` · `🗄️ Superseded`                                      |
| **Location**       | Docusaurus link or external reference                                                                              |

---

## ISMS Policies

_Governing rules that all staff and contractors must follow. Require CEO
sign-off. ISO 27001 Clause 5.2, 7.5._

| Standard ID    | Title                       | Type   | Scope                           | Owner                | Effective Date | Next Review | Status    | Location                                                               |
| :------------- | :-------------------------- | :----- | :------------------------------ | :------------------- | :------------- | :---------- | :-------- | :--------------------------------------------------------------------- |
| `ISMS-STD-001` | Information Security Policy | Policy | All staff, contractors, systems | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/information-security-policy) |
| `ISMS-STD-002` | Acceptable Use Policy (AUP) | Policy | All staff, contractors          | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/acceptable-use)              |
| `ISMS-STD-003` | Access Control Policy       | Policy | All systems, administrators     | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/access-control)              |
| `ISMS-STD-004` | Data Classification Scheme  | Policy | All information assets          | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/data-classification)         |
| `ISMS-STD-005` | Document Control Policy     | Policy | All ISMS documentation          | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/document-control)            |

---

## ISMS Procedures & Operational Documents

_Records and procedures evidencing day-to-day ISMS operation. ISO 27001 Clauses
7–10, Annex A._

| Standard ID    | Title                        | Type      | Scope                | Owner                | Effective Date | Next Review | Status    | Location                                                         |
| :------------- | :--------------------------- | :-------- | :------------------- | :------------------- | :------------- | :---------- | :-------- | :--------------------------------------------------------------- |
| `ISMS-STD-010` | Risk Methodology             | Procedure | ISMS risk management | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/risk-management/methodology)    |
| `ISMS-STD-011` | Risk Treatment Plan          | Procedure | ISMS risk management | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/risk-management/treatment-plan) |
| `ISMS-STD-012` | Incident Response Plan       | Procedure | All systems, staff   | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/operations/incident-response)   |
| `ISMS-STD-013` | Business Continuity Plan     | Procedure | Critical services    | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/operations/business-continuity) |
| `ISMS-STD-014` | Internal Audit Procedure     | Procedure | ISMS assurance       | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/assurance/internal-audit)       |
| `ISMS-STD-015` | Training & Competency Policy | Policy    | All staff            | Ryan Ammendolea, CEO | 2026-03-07     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/operations/training-competency) |

---

## Engineering Standards

_Technical standards governing how the Receptor platform is built, tested,
audited, and deployed. Maintained by Engineering Leadership._

| Standard ID   | Title                            | Type     | Scope                                                           | Owner                  | Effective Date | Next Review | Status    | Location                                                           |
| :------------ | :------------------------------- | :------- | :-------------------------------------------------------------- | :--------------------- | :------------- | :---------- | :-------- | :----------------------------------------------------------------- |
| `ENG-STD-001` | Frontend Engineering Standards   | Standard | All frontend repositories                                       | Ryan Ammendolea, CEO   | 2026-03-06     | 2027-03-01  | ✅ Active | [Link](/docs/engineering/frontend-standards-overview)              |
| `ENG-STD-002` | Supabase Database Standards      | Standard | `supabase-receptor`, all migrations                             | Ryan Ammendolea, CEO   | 2026-03-04     | 2027-03-01  | ✅ Active | Agent memory: `supabase-standards.md`                              |
| `ENG-STD-003` | Audit Workflow Standard          | Standard | All technical audits                                            | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/audit-document-standards/`         |
| `ENG-STD-004` | Git Workflow Standard            | Standard | All repositories                                                | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/workflows/git-workflow.md`                |
| `ENG-STD-005` | Audit Registry Standard          | Standard | All audits                                                      | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/audit-registry/`                   |
| `ENG-STD-006` | Audit Verification Gates         | Standard | Audit implementation                                            | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/audit-verification-gates/`         |
| `ENG-STD-007` | Next.js App Router Patterns      | Standard | `planner-frontend`, `workforce-frontend`, `preference-frontend` | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/nextjs-app-router-patterns/`       |
| `ENG-STD-008` | Playwright Testing Standard      | Standard | All frontend E2E test suites                                    | Engineering Leadership | 2026-03-07     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/playwright-best-practices/`        |
| `ENG-STD-009` | Python Design Patterns Standard  | Standard | `backend/receptor-planner`, `backend/match-backend`             | Engineering Leadership | 2026-03-05     | 2027-03-01  | ✅ Active | `backend/receptor-planner/.agents/skills/python-design-patterns/`  |
| `ENG-STD-010` | Python Testing Patterns Standard | Standard | `backend/receptor-planner`, `backend/match-backend`             | Engineering Leadership | 2026-03-05     | 2027-03-01  | ✅ Active | `backend/receptor-planner/.agents/skills/python-testing-patterns/` |
| `ENG-STD-011` | Supabase Governance Database Standard | Standard | `supabase-common-bond` project — all governance register tables | Engineering Leadership | 2026-03-09     | 2027-03-01  | ✅ Active | Agent skill: `documentation/common-bond/.agents/skills/supabase-postgres-best-practices/`; see also `dev-environment/.agents/skills/supabase-standards/SKILL.md` |

---

## Referenced External Frameworks

_External standards and regulations that Common Bond is required or committed to
comply with. These are not owned by Common Bond but govern the ISMS and
engineering practices._

_**Compliance Posture** values: `Implemented` · `Partially Implemented` · `Planned` · `Non-Compliant`_

| Standard ID | Title | Type | Issuing Body | Scope | Relevance | Status | Compliance Posture | Compliance Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `REF-STD-001` | ISO/IEC 27001:2022 | Framework | ISO / IEC | ISMS — all clauses up to 10.2 + 93 Annex A controls | Primary ISMS certification target | ✅ Active | Partially Implemented | Pre-audit: `260305-iso27001-preaudit`. AI gaps: `260307-iso27001-ai-gaps`. Significant policy coverage achieved; SoA, formal internal audit, and management review remain open. |
| `REF-STD-002` | Australian Privacy Act 1988 (Cth) | Regulation | Australian Parliament | All personal information holdings | Privacy obligations; APPs 1–13 | ✅ Active | Partially Implemented | Data classification and retention policies in place. No DPA between MyJMO and Common Bond (IP-002). No EULA for hospital customers (IP-013). |
| `REF-STD-003` | Australian Privacy Principles (APPs) | Regulation | OAIC | All personal information processing | Binding data handling rules | ✅ Active | Partially Implemented | RLS policies and data classification address APPs 1, 4, 6, 11. APP 12 (access to information) not yet implemented. |
| `REF-STD-004` | ASD Essential Eight (Feb 2025) | Framework | ASD / ACSC | All infrastructure and development | Baseline cybersecurity maturity model | ✅ Active | Partially Implemented | Patch management, MFA, and application control in progress. Formal maturity level assessment not yet conducted. |
| `REF-STD-005` | Notifiable Data Breaches (NDB) Scheme | Regulation | OAIC | All systems holding personal information | Mandatory breach notification | ✅ Active | Partially Implemented | Incident Response Plan references NDB obligations. No breach notification workflow tested end-to-end. |
| `REF-STD-006` | OAIC AI Regulatory Guidance (Oct 2024) | Guideline | OAIC | AI-assisted workflows (Antigravity) | APP compliance for AI tool usage | ✅ Active | Partially Implemented | AI access control and data handling gaps documented in `260307-iso27001-ai-gaps` (7 open findings). |
| `REF-STD-007` | ISO 22301:2019 | Framework | ISO | Business Continuity Management — BCP, RTO/RPO, DR | BCM standard for continuity planning | ✅ Active | Partially Implemented | BCP exists (`ISMS-STD-013`) with RTO (4h) and RPO targets. Missing: BIA (Clause 8.2.2), recovery strategies separate from ops procedures (Clause 8.4), exercise records (Clause 8.5). See `AVAIL-01` in `260319-standards-anchoring`. |
| `REF-STD-008` | OWASP Application Security Verification Standard (ASVS) v4 | Framework | OWASP | All application security test suites — pgTAP, Playwright, RLS tests | Maps security tests to compliance verification levels (L1–L3) | ✅ Active | Partially Implemented | Substantial pgTAP and RLS test suite exists but no ASVS level formally claimed. ASVS L1 gap analysis required. See `SEC-01` in `260319-standards-anchoring`. |
| `REF-STD-009` | SLSA Level 2 (Supply-chain Levels for Software Artifacts) | Framework | OpenSSF | All CI/CD pipelines — GitHub Actions workflows | Supply-chain integrity: version-controlled builds, build provenance | ✅ Active | Partially Implemented | SHA-pinning implemented across all frontend CI workflows (`SEC-02` in `260319-cicd-workflow-health`). Signed provenance not yet generated. Version-controlled build scripts ✅. Self-hosted runners ✅. |
| `REF-STD-010` | ISO/IEC 42001:2023 | Framework | ISO / IEC | All AI-assisted workflows — Antigravity, .agents/ framework, agent skills | AI Management System (AIMS) — structured governance for AI development tools | 📅 Planned | Planned | Deferred in `260307-iso27001-ai-gaps`. High-Level Structure aligns with ISO 27001 enabling integrated ISMS+AIMS certification. Target: adopt by 2027 ISMS review. |
| `REF-STD-011` | CIS Kubernetes Benchmark v1.9 | Framework | CIS | k3s cluster — RBAC, pod security contexts, network policies, admission control | Scored baseline for Kubernetes security configuration | ✅ Active | Partially Implemented | RBAC, NetworkPolicies, and Falco implemented. Formal benchmark scoring not yet conducted. Relevant findings: `RBAC-01`, `KUBE-03`, `NET-01` in `260316-terraform-iac-gap`, `260312-cicd-environments`. |
| `REF-STD-012` | NIST SP 800-218 (SSDF — Secure Software Development Framework) | Framework | NIST | All CI/CD pipelines and secure development practices | Unifies secure dev lifecycle practices across PO, PS, PW, RV practice groups | ✅ Active | Partially Implemented | PO: branch protection ✅. PS: SHA-pinning ✅, Vault secrets ✅. PW: code coverage enforced ✅. RV: dependency tracking ⚠️ (no automated Dependabot/Renovate). See `INT-01` in `260319-standards-anchoring`. |
| `REF-STD-013` | CIS Microsoft Azure Foundations Benchmark | Framework | CIS | Azure resources — Key Vault (K3sUnlock), storage account (k3sbackups) | Scored baseline for Azure cloud resource security configuration | ✅ Active | Non-Compliant | Key Vault network ACL open to all networks (CIS 9.x). No Terraform IaC for Azure resources (CIS 3.x config management). See `SEC-01` in `260316-terraform-iac-gap`. |
| `REF-STD-014` | WCAG 2.2 Level AA | Standard | W3C | All frontend applications — planner-frontend, workforce-frontend, preference-frontend | Web Content Accessibility Guidelines — accessibility compliance for hospital users | ✅ Active | Partially Implemented | `vitest-axe` and `@axe-core/playwright` installed across all three frontends. No axe CI gate exists (CROSS-03 in `260306-frontend-compliance`). No WCAG claim in ENG-STD-001. See `TEST-02` in `260319-standards-anchoring`. |
| `REF-STD-015` | ISO/IEC 20000-1:2018 | Framework | ISO / IEC | Production service delivery — all services at `*.commonbond.au` | IT service management — SLA/SLO definition and service level management | 📅 Planned | Planned | No SLO targets defined for any production service. Hospital customers will require uptime commitments prior to commercial release. See `PERF-01` in `260319-standards-anchoring`. |
| `REF-STD-016` | OpenTelemetry (CNCF) | Standard | CNCF | Observability stack — Grafana/Loki/Prometheus/Alertmanager on k3s | Vendor-neutral observability signal collection (metrics, logs, traces) for ISO 27001 A.8.15/A.8.16 evidence | 📅 Planned | Planned | Grafana/Loki/Prometheus stack planned (`ARCH-07` in `260312-cicd-environments`). OpenTelemetry to be adopted at stack deployment. See `PERF-02` in `260319-standards-anchoring`. |

---

## Adding a New Standard

When a new policy, procedure, or standard is created or formally adopted:

1. Assign the next sequential ID in the correct domain prefix series.
2. Add a row to the appropriate section table above with all columns populated.
3. Update the **Last Updated** header at the top of this document.
4. Commit this file in the same commit as the new document.
5. For external frameworks: populate **Compliance Posture** and **Compliance Notes** at the time of registration — do not leave these blank.

:::tip[Related Registers] See the [Register of Registers](/docs/registers) for
the full inventory of all registers maintained by Common Bond. See the
[ISMS Overview](/docs/compliance/iso27001) for the full ISMS structure. :::

