---
title: Supplier Security Register
sidebar_position: 5
---

# Supplier Security Register

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | 2026-03-09     | Ryan Ammendolea, CEO | 2027-03-09  |

## 1. Purpose

This register documents all critical third-party suppliers with access to Common
Bond information assets or systems. It satisfies ISO/IEC 27001:2022 controls
5.19 (Information security in supplier relationships), 5.20 (Addressing
information security within supplier agreements), 5.21 (Managing information
security in the ICT supply chain), and 5.22 (Monitoring, review and change
management of supplier services).

## 2. Scope

This register covers all suppliers that process, store, or transmit Common Bond
data, or whose services are critical to the availability of the Receptor
platform.

## 3. DPA Requirements Note

::: warning[APP 8 Obligation]

Under Australian Privacy Principle 8 (APP 8), Common Bond must take reasonable
steps to ensure overseas recipients of personal information protect that
information to a standard equivalent to the Privacy Act 1988. All critical
suppliers handling personal information must have an executed Data Processing
Agreement (DPA) or equivalent contractual protection in place.

:::

Current status: No bespoke DPAs are in place. All reliance is on supplier
standard terms. **Executing DPAs with all critical suppliers is a Phase 1
priority action.** Status columns below track progress.

## 4. Critical Supplier Register

### Supabase (Database & Backend Infrastructure)

| Field                        | Detail                                                                                                                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Service**                  | PostgreSQL database, authentication, storage, edge functions                                                                                                                              |
| **Data Processed**           | Workforce Admin PII, Worker PII, authentication credentials                                                                                                                               |
| **Classification**           | Confidential                                                                                                                                                                              |
| **Hosting**                  | AWS — Sydney (`ap-southeast-2`) region available for Australian data residency                                                                                                            |
| **Criticality**              | Critical — platform unavailability without this service                                                                                                                                   |
| **Security Trust Page**      | [supabase.com/security](https://supabase.com/security)                                                                                                                                    |
| **Certifications**           | ✅ SOC 2 Type 2 (annual), ✅ HIPAA (with BAA on Team/Enterprise), ✅ PCI DSS, ✅ GDPR. ❌ **ISO 27001 not held** — see §4.1 ISO 27001 Compliance Assessment below.                         |
| **DPA Status**               | ⚠️ Not executed — **Action required**                                                                                                                                                     |
| **DPA Action**               | Execute Supabase's Data Processing Agreement at [supabase.com/legal/dpa](https://supabase.com/legal/dpa). Australian customers are covered under AWS Standard Contractual Clauses (SCCs). |
| **ISO 27001 Risk Assessment**| Supabase does not hold ISO 27001. SOC 2 Type 2 provides equivalent control assurance for the governance register use case (internal operational metadata, not customer PII). If a Stage 2 auditor requires ISO 27001 certification for all sub-processors, see §4.1 for assessed alternatives. |
| **Last Reviewed**            | 2026-03-09                                                                                                                                                                                |

---

### Cloudflare (CDN, DNS, Zero Trust Access)

| Field                   | Detail                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Service**             | DNS, CDN, Zero Trust network access, DDoS protection                                                                                                                                              |
| **Data Processed**      | Network metadata; access logs (may include worker IP addresses)                                                                                                                                   |
| **Classification**      | Internal                                                                                                                                                                                          |
| **Hosting**             | Cloudflare global network                                                                                                                                                                         |
| **Criticality**         | High — Cloudflare outage impacts public accessibility                                                                                                                                             |
| **Security Trust Page** | [cloudflare.com/trust-hub](https://www.cloudflare.com/trust-hub/)                                                                                                                                 |
| **DPA Status**          | ⚠️ Not executed — **Action required**                                                                                                                                                             |
| **DPA Action**          | Execute Cloudflare's DPA at [cloudflare.com/cloudflare-customer-dpa](https://www.cloudflare.com/cloudflare-customer-dpa/). Cloudflare maintains GDPR/APP-compatible standard contractual clauses. |
| **Last Reviewed**       | 2026-03-05                                                                                                                                                                                        |

---

### GitHub (Microsoft) — Source Code Hosting

| Field                   | Detail                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Service**             | Source code repository, CI/CD, issue tracking                                                                                         |
| **Data Processed**      | Source code (IP), internal documentation                                                                                              |
| **Classification**      | Confidential (source code is IP)                                                                                                      |
| **Hosting**             | Microsoft Azure (US)                                                                                                                  |
| **Criticality**         | High — loss of access halts development                                                                                               |
| **Security Trust Page** | [github.com/security](https://github.com/security)                                                                                    |
| **DPA Status**          | ⚠️ Not executed — **Action required**                                                                                                 |
| **DPA Action**          | Enable the GitHub Data Protection Agreement via GitHub Organisation Settings → Security → Data Protection. No separate form required. |
| **Last Reviewed**       | 2026-03-05                                                                                                                            |

---

### Google Workspace (Email, Docs, Calendar)

| Field                   | Detail                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Service**             | Corporate email, document storage, calendar, identity                                                                           |
| **Data Processed**      | Staff PII, internal business documents, supplier communications                                                                 |
| **Classification**      | Internal / Confidential                                                                                                         |
| **Hosting**             | Google LLC (US, with regional data residency options)                                                                           |
| **Criticality**         | High — primary communication and identity platform                                                                              |
| **Security Trust Page** | [workspace.google.com/security](https://workspace.google.com/intl/en/security/)                                                 |
| **DPA Status**          | ⚠️ Not executed — **Action required**                                                                                           |
| **DPA Action**          | Accept Google's Data Processing Amendment in the Admin Console: admin.google.com → Account → Legal → Data processing amendment. |
| **Last Reviewed**       | 2026-03-05                                                                                                                      |

---

### ClickUp (Project Management)

| Field                   | Detail                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Service**             | Task and project management                                                                                                                                                                      |
| **Data Processed**      | Internal task descriptions; may contain staff names and internal project context                                                                                                                 |
| **Classification**      | Internal                                                                                                                                                                                         |
| **Hosting**             | AWS (US)                                                                                                                                                                                         |
| **Criticality**         | Medium — operational impact if unavailable, no personal data of platform users                                                                                                                   |
| **Security Trust Page** | [clickup.com/security](https://clickup.com/security)                                                                                                                                             |
| **DPA Status**          | ⚠️ Not executed — **Action required if ClickUp stores PII**                                                                                                                                      |
| **DPA Action**          | Execute ClickUp's DPA at [clickup.com/dpa](https://clickup.com/dpa) if ClickUp stores any personal information or business-sensitive information. Confirm scope of data stored before executing. |
| **Last Reviewed**       | 2026-03-05                                                                                                                                                                                       |

---

### Google Antigravity (AI Engineering Tool)

_Added 2026-03-09 per audit `260307-iso27001-ai-gaps` REC-AI-04._

| Field                   | Detail                                                                                                                                                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Service**             | AI coding assistant, code review, ISMS documentation, agent-based engineering workflows                                                                                                                                                                                                                               |
| **Data Processed**      | Source code, configuration context, engineering instructions, repository content passed as agent context. Does not process Worker PII or Workforce Admin PII in normal engineering use.                                                                                                                               |
| **Classification**      | Internal / Confidential (source code is IP; ISMS documents are Internal)                                                                                                                                                                                                                                              |
| **Hosting**             | Google LLC (US) — accessed via Google Workspace Business Standard account                                                                                                                                                                                                                                             |
| **Criticality**         | Medium — operational inconvenience if unavailable; no direct platform user data processed                                                                                                                                                                                                                             |
| **Security Trust Page** | [cloud.google.com/terms/cloud-privacy-notice](https://cloud.google.com/terms/cloud-privacy-notice)                                                                                                                                                                                                                    |
| **DPA Status**          | ✅ Google Cloud Data Processing Addendum active via Workspace Business Standard. Confirmed at [cloud.google.com/terms/data-processing-addendum](https://cloud.google.com/terms/data-processing-addendum) (updated April 2024).                                                                                        |
| **Training Exclusion**  | ✅ When Antigravity is accessed via Google Workspace or GCP, Google explicitly states it will **not** collect prompts, content, or model responses for training.                                                                                                                                                      |
| **Telemetry Decision**  | ⚠️ Antigravity is a no-cost public preview product. Telemetry covers usage/performance analytics only (not prompt content). Training exclusion is guaranteed by Workspace account access, not the telemetry toggle. Decision to confirm by Ryan Ammendolea (Founder/CEO): record ON or OFF in the next annual review. |
| **Caveat**              | Antigravity is in **no-cost public preview** as of 2026-03-09. Confirm at next annual review or when pricing changes whether paid-account exclusions are fully active.                                                                                                                                                |
| **DPA Action**          | ✅ No further DPA execution required — Workspace DPA already covers Antigravity usage. Re-confirm at annual review by **2026-04-30**.                                                                                                                                                                                 |
| **Last Reviewed**       | 2026-03-09                                                                                                                                                                                                                                                                                                            |

---

> **GitHub Copilot — Exclusion Note:** GitHub Copilot is **not in use** at
> Common Bond. No supplier register entry is required. Confirmed 2026-03-07.
> Re-confirm at next annual review.

### 4.1 ISO 27001 Compliance Assessment — Governance Database Alternatives

::: info[Assessment Context]

This assessment was performed on 2026-03-09 for the `supabase-common-bond`
governance register migration (audit `260309-governance-register-infrastructure`).
The governance database stores internal operational metadata (risks, NCs,
corrective actions, SoA controls, audit entries, training records) — **not**
customer PII or PHI.

:::

**The question:** Does Common Bond require an ISO 27001-certified database
provider for governance registers?

**Answer:** No — for internal operational metadata, SOC 2 Type 2 provides
equivalent control assurance. ISO 27001 does not require sub-processors to
*hold* ISO 27001; it requires the organisation to *assess* their security
posture (Clause A.5.19–A.5.23). SOC 2 Type 2 satisfies this assessment
requirement. However, if a Stage 2 certification auditor explicitly requires
ISO 27001 certification for all sub-processors, the following alternatives have
been evaluated:

| Provider | ISO 27001 | SOC 2 Type 2 | Postgres Compatible | AU Data Residency | RLS | Auth Built-in | Governance Suitability |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Supabase** (current) | ❌ | ✅ | ✅ Native Postgres | ✅ Sydney `ap-southeast-2` | ✅ Native | ✅ GoTrue | ✅ Best fit — existing ecosystem, RLS, auth, Edge Functions |
| **Cloudflare D1** | ✅ (via parent) | ✅ | ❌ SQLite | ✅ Global / jurisdiction controls | ❌ | ❌ (Workers Auth) | ⚠️ SQLite — no native RLS, triggers, or JSONB. Would require rewriting all audit recommendations. Already an existing supplier. |
| **Neon** | ✅ | ✅ | ✅ Native Postgres | ⚠️ AWS regions — no explicit AU region listed | ✅ Native | ❌ | ✅ Drop-in Postgres replacement. Strong compliance. No built-in auth (would need Supabase Auth or separate IdP). |
| **Azure Database for PostgreSQL** | ✅ | ✅ | ✅ Native Postgres | ✅ Australia East (Sydney) | ✅ Native | ❌ (Azure AD) | ✅ Gold standard for compliance. Highest operational overhead. IRAP-assessed for AU public sector. |
| **PlanetScale** | ❌ | ✅ | ⚠️ MySQL/Vitess (now also managed PG) | ⚠️ Limited region selection | ❌ | ❌ | ⚠️ MySQL-first heritage. PG offering is new. No ISO 27001. |

**Recommendation hierarchy:**

1. **Default: Supabase** — SOC 2 Type 2 is sufficient for governance register
   data. Existing ecosystem integration (auth, RLS, Edge Functions, existing
   supplier relationship) makes it the lowest-friction option.
2. **If ISO 27001 is mandated by auditor: Neon** — drop-in Postgres replacement
   with ISO 27001 + ISO 27701 + SOC 2 Type 2. Requires adding a separate auth
   solution (Supabase Auth can be used independently).
3. **If AU government/IRAP is required: Azure Database for PostgreSQL** — highest
   compliance ceiling (ISO 27001, SOC 2, IRAP). Highest operational overhead and
   cost. Would require Azure AD integration.
4. **Cloudflare D1** — not recommended for this use case. SQLite limitations
   (no RLS, no triggers, no JSONB, no `CHECK` constraints) would invalidate the
   entire recommendation stack from the governance audit. Only suitable for
   key-value or simple lookup workloads.

::: warning[Conditional Risk — R-NEW]

If a Stage 2 ISO 27001 certification auditor requires all sub-processors to hold
ISO 27001 certification, the governance database will need to be migrated from
Supabase to Neon or Azure Database for PostgreSQL. This risk should be registered
in the Risk Register as a conditional item once `supabase-common-bond` is
created.

:::

## 5. Supplier Review Process

Suppliers are reviewed annually or when a significant change occurs (e.g.,
change of ownership, security incident, expansion of data processing). The
Founder/CEO approves any change in a critical supplier's DPA status.

## 6. Review

This register is reviewed annually. The Information Security Manager is
responsible for maintaining current status columns and initiating DPA execution
actions.
