---
title: ISMS Scope
sidebar_position: 1
---

# Information Security Management System (ISMS) Scope

| Version | Effective Date | Approved By          | Last Reviewed | Next Review |
| ------- | -------------- | -------------------- | ------------- | ----------- |
| 1.0     | 2026-03-05     | Ryan Ammendolea, CEO | 2026-03-06    | 2027-03-01  |

## 1. Introduction

This document defines the scope of the Information Security Management System
(ISMS) for **Common Bond (Receptor Platform)**. It specifies the boundaries of
our security responsibilities, applicable to our context as a **pre-revenue,
cloud-native startup**.

## 2. Organizational Context

Receptor is a workforce management and optimisation platform. We operate as a
fully remote team, leveraging cloud infrastructure to deliver our services.

### Internal Issues

- **Resource Constraints:** As a pre-revenue startup, we prioritize automated
  and scalable security controls over manual processes.
- **Remote Work:** All operations are conducted remotely; we have no physical
  offices.
- **Speed of Change:** Rapid development cycles require security to be
  integrated into the CI/CD pipeline (DevSecOps). An adversarial code review
  workflow is embedded in each repository via `.agents/workflows/audit.md`,
  providing a repeatable internal audit mechanism for technical controls (ISO
  27001 Clause 9.2). All audit findings are tracked on feature branches and in
  `docs/audits/` within each repository.

### External Issues

- **Customer Trust:** Enterprise clients (healthcare, logistics) require
  assurance that their workforce data is secure.
- **Regulatory Compliance:** We must adhere to Australian Privacy Principles
  (APP) and preparing for ISO 27001 certification.
- **Threat Landscape:** Web-facing applications are subject to automated
  attacks, data breaches, and supply chain vulnerabilities.

## 3. Scope Statement

The scope of the ISMS includes all **information assets, processes, and
technologies** used in the development, operation, and maintenance of the
**Receptor Platform**.

### In Scope

- **Product Engineering:** Development, testing, and deployment of the Receptor
  application (Frontend & Backend).
- **Cloud Infrastructure:** Configuration and management of resources on
  **Supabase**, **Cloudflare**, and **GitHub**.
- **Data Management:** Processing of customer data (rosters, preferences, worker
  details) and internal business data.
- **Remote Operations:** Security of remote endpoints (developer laptops) and
  access to cloud systems.

### Out of Scope (Exclusions)

- **Physical Office Security:** Common Bond is a fully remote organization. We
  rely on the physical security controls of our cloud providers (AWS via
  Supabase, Cloudflare).
- **Hardware Manufacturing:** We do not manufacture hardware.

## 4. Interested Parties

| Party            | Requirement                                                                          |
| :--------------- | :----------------------------------------------------------------------------------- |
| **Customers**    | Confidentiality and integrity of their workforce data. Availability of the platform. |
| **Employees**    | Clear guidance on security responsibilities and protection of their personal data.   |
| **Shareholders** | Protection of intellectual property and brand reputation.                            |
| **Regulators**   | Compliance with privacy laws (Privacy Act 1988) and applicable AI guidance.          |

## 5. Regulatory Framework

_Updated 2026-03-09 per audit `260307-iso27001-ai-gaps` REC-AI-08 (approved by
Founder 2026-03-07)._

The following regulatory documents are recognised as relevant interested-party
requirements under ISO 27001 Clause 4.2:

| Instrument                                                      | Issuer   | Relevance                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------------------------------------------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Privacy Act 1988 (Cth), Australian Privacy Principles (APPs)    | OAIC     | Governs collection, use, disclosure, and security of personal information held by Common Bond.                                                                                                                                                                                                                                                                                |
| Notifiable Data Breaches scheme (Part IIIC, Privacy Act)        | OAIC     | Mandatory notification obligations upon eligible data breach.                                                                                                                                                                                                                                                                                                                 |
| OAIC — Privacy and Generative AI guidance (October 2024)        | OAIC     | Applicable where Antigravity or other approved AI tools process personal information. Common Bond's documented position: AI tools in scope process only Internal-tier data in normal engineering use; no Worker PII or Workforce Admin PII is submitted to AI tools without ISM approval. This position will be confirmed in writing prior to production customer onboarding. |
| ASD/ACSC — Engaging with Artificial Intelligence (January 2024) | ASD/ACSC | Referenced for AI security hygiene (prompt injection, data leakage, supply chain risk). Findings incorporated into the Risk Register (R-013–R-016).                                                                                                                                                                                                                           |
