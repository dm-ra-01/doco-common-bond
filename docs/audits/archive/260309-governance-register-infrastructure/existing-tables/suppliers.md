# Archive: Supplier Register (from supplier-register.md)

> Extracted from `docs/compliance/iso27001/operations/supplier-register.md`
> before migration to `SuppliersDashboard` (Supabase table: `public.suppliers`).
> Use to verify equivalence against live Supabase data post-migration.

## Supabase (Database & Backend Infrastructure)

| Field                        | Detail |
| ---------------------------- | ------ |
| **Service**                  | PostgreSQL database, authentication, storage, edge functions |
| **Data Processed**           | Workforce Admin PII, Worker PII, authentication credentials |
| **Classification**           | Confidential |
| **Hosting**                  | AWS — Sydney (`ap-southeast-2`) region available for Australian data residency |
| **Criticality**              | Critical — platform unavailability without this service |
| **Security Trust Page**      | supabase.com/security |
| **Certifications**           | ✅ SOC 2 Type 2 (annual), ✅ HIPAA (with BAA on Team/Enterprise), ✅ PCI DSS, ✅ GDPR. ❌ ISO 27001 not held |
| **DPA Status**               | ⚠️ Not executed — Action required |
| **DPA Action**               | Execute at supabase.com/legal/dpa. Australian customers covered under AWS Standard Contractual Clauses |
| **Last Reviewed**            | 2026-03-09 |

## Cloudflare (CDN, DNS, Zero Trust Access)

| Field                   | Detail |
| ----------------------- | ------ |
| **Service**             | DNS, CDN, Zero Trust network access, DDoS protection |
| **Data Processed**      | Network metadata; access logs (may include worker IP addresses) |
| **Classification**      | Internal |
| **Hosting**             | Cloudflare global network |
| **Criticality**         | High — Cloudflare outage impacts public accessibility |
| **Security Trust Page** | cloudflare.com/trust-hub |
| **DPA Status**          | ⚠️ Not executed — Action required |
| **DPA Action**          | Execute at cloudflare.com/cloudflare-customer-dpa |
| **Last Reviewed**       | 2026-03-05 |

## GitHub (Microsoft) — Source Code Hosting

| Field                   | Detail |
| ----------------------- | ------ |
| **Service**             | Source code repository, CI/CD, issue tracking |
| **Data Processed**      | Source code (IP), internal documentation |
| **Classification**      | Confidential (source code is IP) |
| **Hosting**             | Microsoft Azure (US) |
| **Criticality**         | High — loss of access halts development |
| **Security Trust Page** | github.com/security |
| **DPA Status**          | ⚠️ Not executed — Action required |
| **DPA Action**          | Enable via GitHub Organisation Settings → Security → Data Protection |
| **Last Reviewed**       | 2026-03-05 |

## Google Workspace (Email, Docs, Calendar)

| Field                   | Detail |
| ----------------------- | ------ |
| **Service**             | Corporate email, document storage, calendar, identity |
| **Data Processed**      | Staff PII, internal business documents, supplier communications |
| **Classification**      | Internal / Confidential |
| **Hosting**             | Google LLC (US, with regional data residency options) |
| **Criticality**         | High — primary communication and identity platform |
| **Security Trust Page** | workspace.google.com/security |
| **DPA Status**          | ⚠️ Not executed — Action required |
| **DPA Action**          | Accept Google's Data Processing Amendment in Admin Console |
| **Last Reviewed**       | 2026-03-05 |

## ClickUp (Project Management)

| Field                   | Detail |
| ----------------------- | ------ |
| **Service**             | Task and project management |
| **Data Processed**      | Internal task descriptions; may contain staff names and internal project context |
| **Classification**      | Internal |
| **Hosting**             | AWS (US) |
| **Criticality**         | Medium — operational impact if unavailable, no personal data of platform users |
| **Security Trust Page** | clickup.com/security |
| **DPA Status**          | ⚠️ Not executed — Action required if ClickUp stores PII |
| **DPA Action**          | Execute at clickup.com/dpa if PII is stored |
| **Last Reviewed**       | 2026-03-05 |

## Google Antigravity (AI Engineering Tool)

_Added 2026-03-09 per audit `260307-iso27001-ai-gaps` REC-AI-04._

| Field                   | Detail |
| ----------------------- | ------ |
| **Service**             | AI coding assistant, code review, ISMS documentation, agent-based engineering workflows |
| **Data Processed**      | Source code, configuration context, engineering instructions, repository content. Does not process Worker PII or Workforce Admin PII in normal engineering use |
| **Classification**      | Internal / Confidential (source code is IP; ISMS documents are Internal) |
| **Hosting**             | Google LLC (US) — accessed via Google Workspace Business Standard account |
| **Criticality**         | Medium — operational inconvenience if unavailable; no direct platform user data processed |
| **DPA Status**          | ✅ Google Cloud Data Processing Addendum active via Workspace Business Standard |
| **Training Exclusion**  | ✅ When accessed via Google Workspace or GCP, Google will not collect prompts or responses for training |
| **Telemetry Decision**  | ⚠️ No-cost public preview product. Telemetry covers usage/performance analytics only (not prompt content). Decision to confirm by Ryan Ammendolea at next annual review |
| **DPA Action**          | ✅ No further execution required. Re-confirm at annual review by 2026-04-30 |
| **Last Reviewed**       | 2026-03-09 |
