---
title: Statement of Applicability (SoA)
sidebar_position: 2
---

# Statement of Applicability (SoA)

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## Overview

This Statement of Applicability (SoA) identifies the applicability of all 93
controls from Annex A of ISO/IEC 27001:2022 to Common Bond Pty Ltd and MyJMO Pty
Ltd (collectively, "Common Bond"), operating the Receptor platform.

The SoA is the definitive record of Common Bond's control selection decisions.
It must be read in conjunction with the
[Risk Register](../risk-management/risk-register),
[Risk Treatment Plan](../risk-management/treatment-plan), and
[Risk Methodology](../risk-management/methodology).

**Organisation profile:** Common Bond is a cloud-native, fully remote,
pre-revenue SaaS company in the healthcare workforce management sector. All
infrastructure is hosted on managed cloud services (Supabase on AWS, Cloudflare,
GitHub). There are no physical offices or data-centre premises. The team
comprises the Founder/CEO and two Territory Managers. Personal information held
is limited to workforce administration PII — no health records are held.

## Applicability Summary

| Category               | Count |
| ---------------------- | ----- |
| Total Annex A controls | 93    |
| Applicable             | 78    |
| Not Applicable         | 15    |
| Implemented            | 29    |
| Partially Implemented  | 32    |
| Planned                | 17    |

:::note
Cells marked **⚠️ Confirm** require a Founder/CEO decision before this SoA can be considered finalised. Implementation statuses reflect the position as at **2026-03-05**.
:::

---

## Theme 5 — Organisational Controls (5.1–5.37)

| Control ID | Control Name                                                           | Applicable | Justification                                                                                                 | Implementation Status                                                                                                          |
| ---------- | ---------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 5.1        | Policies for information security                                      | Yes        | Policies are core ISMS requirements regardless of organisation size                                           | Implemented                                                                                                                    |
| 5.2        | Information security roles and responsibilities                        | Yes        | Required; roles assigned to Ryan Ammendolea per Clause 5.3                                                    | Implemented                                                                                                                    |
| 5.3        | Segregation of duties                                                  | Yes        | Applicable in principle; single-person leadership means compensating controls are documented                  | Partial — compensating controls noted in roles-responsibilities.md                                                             |
| 5.4        | Management responsibilities                                            | Yes        | Management (Founder/CEO) actively directs the ISMS                                                            | Implemented                                                                                                                    |
| 5.5        | Contact with authorities                                               | Yes        | Required for Privacy Act NDB scheme obligations and incident response                                         | Planned — OAIC contact documented in incident-response.md; formal contact register not yet established                         |
| 5.6        | Contact with special interest groups                                   | Yes        | Beneficial for threat intelligence; OWASP and ASD membership appropriate                                      | Planned                                                                                                                        |
| 5.7        | Threat intelligence                                                    | Yes        | Applicable for a SaaS platform; currently ad hoc via GitHub Dependabot and public advisories                  | Partial — Dependabot enabled; no formal threat intelligence feed subscribed                                                    |
| 5.8        | Information security in project management                             | Yes        | All product development constitutes projects that must address security requirements                          | Partial — security requirements referenced in development practices; no formal project security gate documented                |
| 5.9        | Inventory of information and other associated assets                   | Yes        | Required by Clause 6.1.2; asset register exists                                                               | Implemented — see [Asset Register](./asset-register)                                                                           |
| 5.10       | Acceptable use of information and other associated assets              | Yes        | Acceptable Use Policy covers all staff and contractors                                                        | Implemented — see [Acceptable Use Policy](../policies/acceptable-use)                                                          |
| 5.11       | Return of assets                                                       | Yes        | Applicable on termination of employment; relevant to developer laptops                                        | Planned — offboarding checklist not yet formalised                                                                             |
| 5.12       | Classification of information                                          | Yes        | Data Classification Scheme adopted (Public / Internal / Confidential / Restricted)                            | Implemented — see [Data Classification Scheme](../policies/data-classification)                                                |
| 5.13       | Labelling of information                                               | Yes        | Labelling requirements defined in Data Classification Scheme                                                  | Partial — scheme defined; enforcement and labelling in practice not yet verified                                               |
| 5.14       | Information transfer                                                   | Yes        | PII transfer occurs via API to Supabase; applicable to data-sharing practices                                 | Partial — cloud transfer secured via TLS; formal information transfer policy not standalone                                    |
| 5.15       | Access control                                                         | Yes        | Core control for SaaS platform security; Supabase RLS and GitHub Teams in use                                 | Implemented — see [Access Control Policy](../policies/access-control)                                                          |
| 5.16       | Identity management                                                    | Yes        | All users have individual identities; no shared accounts policy in force                                      | Implemented                                                                                                                    |
| 5.17       | Authentication information                                             | Yes        | MFA required; password manager mandated per Acceptable Use Policy                                             | Implemented                                                                                                                    |
| 5.18       | Access rights                                                          | Yes        | Access provisioning and review processes defined in Access Control Policy                                     | Implemented                                                                                                                    |
| 5.19       | Information security in supplier relationships                         | Yes        | Critical suppliers: Supabase, Cloudflare, GitHub, Google Workspace, ClickUp                                   | Partial — Supplier Register exists; DPA execution in progress per APP 8                                                        |
| 5.20       | Addressing information security within supplier agreements             | Yes        | DPA obligations under Australian Privacy Principle 8 (APP 8) require contractual controls                     | Partial — DPA execution actions documented in [Supplier Register](./supplier-register); not all DPAs executed                  |
| 5.21       | Managing information security in the ICT supply chain                  | Yes        | Cloud supply chain (AWS via Supabase, Cloudflare) is the primary infrastructure risk                          | Partial — supply chain risk documented (R-008); formal monitoring programme not yet established                                |
| 5.22       | Monitoring, review and change management of supplier services          | Yes        | Critical suppliers must be reviewed periodically for security posture changes                                 | Planned — annual review cadence documented in Supplier Register; first review not yet conducted                                |
| 5.23       | Information security for use of cloud services                         | Yes        | All infrastructure is cloud-based; directly applicable                                                        | Implemented — cloud services selection, configuration, and exit criteria addressed in Supplier Register and BCP                |
| 5.24       | Information security incident management planning and preparation      | Yes        | Required; Incident Response Plan drafted                                                                      | Implemented — see [Incident Response Plan](./incident-response)                                                                |
| 5.25       | Assessment and decision on information security events                 | Yes        | Severity taxonomy and decision criteria defined in Incident Response Plan                                     | Implemented                                                                                                                    |
| 5.26       | Response to information security incidents                             | Yes        | 5-phase response process defined in Incident Response Plan                                                    | Implemented                                                                                                                    |
| 5.27       | Learning from information security incidents                           | Yes        | Post-incident review required by Incident Response Plan; corrective action process in place                   | Partial — process defined; no incidents yet resolved to review                                                                 |
| 5.28       | Collection of evidence                                                 | Yes        | Applicable for incident response and potential legal proceedings                                              | Planned — evidence collection principles noted in Incident Response Plan; formal chain-of-custody procedure not yet documented |
| 5.29       | Information security during disruption                                 | Yes        | Business Continuity Plan addresses information security during disruption                                     | Implemented — see [Business Continuity Plan](./business-continuity)                                                            |
| 5.30       | ICT readiness for business continuity                                  | Yes        | Supabase PITR and cloud redundancy address ICT continuity; RTO 4 hours / RPO 12 hours                         | Implemented                                                                                                                    |
| 5.31       | Legal, statutory, regulatory and contractual requirements              | Yes        | Privacy Act 1988 (NDB scheme), Corporations Act obligations applicable                                        | Implemented — referenced in scope.md and policy documents                                                                      |
| 5.32       | Intellectual property rights                                           | Yes        | Source code and product IP must be protected                                                                  | Implemented — GitHub private repositories; licensing obligations addressed                                                     |
| 5.33       | Protection of records                                                  | Yes        | ISMS records must be retained as documented information per Clause 7.5                                        | Partial — records held in GitHub and Docusaurus documentation; retention period not formally stated                            |
| 5.34       | Privacy and protection of personally identifiable information          | Yes        | Privacy Act 1988 and Australian Privacy Principles directly applicable; PII held for workforce administration | Implemented — referenced across policies; Data Classification Scheme classifies PII as Confidential                            |
| 5.35       | Independent review of information security                             | Yes        | Internal audit programme established; external review planned for pre-certification stage                     | Planned — internal audit scheduled IA-2026-01 (2026-04-15); external review pending vendor selection                           |
| 5.36       | Compliance with policies, rules and standards for information security | Yes        | Compliance monitoring is an ISMS requirement                                                                  | Partial — policies exist; formal compliance monitoring cadence not yet documented                                              |
| 5.37       | Documented operating procedures                                        | Yes        | Operating procedures required for key ISMS processes                                                          | Partial — incident response, audit, and BCP procedures documented; offboarding and change management procedures partial        |

---

## Theme 6 — People Controls (6.1–6.8)

| Control ID | Control Name                                               | Applicable | Justification                                                                               | Implementation Status                                                                                                                        |
| ---------- | ---------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.1        | Screening                                                  | Yes        | Pre-employment screening relevant to all staff with access to PII or systems                | Partial — background checks are conducted; checks not yet completed for Amelia Jane Cameron and Emma Nyhof (confirmed by Founder 2026-03-05)  |
| 6.2        | Terms and conditions of employment                         | Yes        | Employment contracts must reference information security obligations                        | Planned — no formal employment contracts in place for Territory Managers; an information security agreement must be executed before onboarding is complete (confirmed by Founder 2026-03-05) |
| 6.3        | Information security awareness, education and training     | Yes        | All staff must receive security awareness training                                          | Partial — training programme defined; onboarding items not yet completed for Territory Managers (see [Training Records](./training-records)) |
| 6.4        | Disciplinary process                                       | Yes        | Applicable to all staff; consequences of non-compliance referenced in Acceptable Use Policy | Planned — Acceptable Use Policy states consequences; formal disciplinary procedure not yet separately documented                             |
| 6.5        | Responsibilities after termination or change of employment | Yes        | Offboarding obligations for asset return, access revocation, and confidentiality            | Planned — access revocation addressed in Access Control Policy; formal offboarding checklist not yet created                                 |
| 6.6        | Confidentiality or non-disclosure agreements               | Yes        | NDA obligations relevant to staff with access to client and product information             | Planned — no formal employment contracts currently in place for Territory Managers; confidentiality terms must be included in the information security agreement to be executed (confirmed by Founder 2026-03-05) |
| 6.7        | Remote working                                             | Yes        | All staff are remote; directly applicable                                                   | Implemented — Acceptable Use Policy addresses device security, MFA, and data handling for remote workers                                     |
| 6.8        | Information security event reporting                       | Yes        | All staff must report suspected incidents to `alert@commonbond.au`                          | Implemented — reporting obligations in Acceptable Use Policy; contact in Incident Response Plan                                              |

---

## Theme 7 — Physical Controls (7.1–7.14)

| Control ID | Control Name                                          | Applicable | Justification                                                                                                                         | Implementation Status                                                                                           |
| ---------- | ----------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 7.1        | Physical security perimeters                          | No         | Common Bond has no physical offices or facilities. All infrastructure is cloud-hosted.                                                | Not Applicable                                                                                                  |
| 7.2        | Physical entry                                        | No         | No physical premises to control entry to.                                                                                             | Not Applicable                                                                                                  |
| 7.3        | Securing offices, rooms and facilities                | No         | No offices or rooms exist.                                                                                                            | Not Applicable                                                                                                  |
| 7.4        | Physical security monitoring                          | No         | No physical perimeter to monitor. Infrastructure physical security is the responsibility of AWS (via Supabase) and Cloudflare.        | Not Applicable                                                                                                  |
| 7.5        | Protecting against physical and environmental threats | No         | No physical infrastructure owned or operated by Common Bond. Environmental controls are the responsibility of the cloud providers.    | Not Applicable                                                                                                  |
| 7.6        | Working in secure areas                               | No         | No secure areas exist.                                                                                                                | Not Applicable                                                                                                  |
| 7.7        | Clear desk and clear screen                           | Yes        | Remote staff access PII on personal laptops; clear screen policy applicable to prevent shoulder-surfing in shared spaces              | Planned — principle referenced in Acceptable Use Policy; explicit clear screen requirement not yet documented   |
| 7.8        | Equipment siting and protection                       | Yes        | Developer laptops are critical assets; applicable in remote work context                                                              | Partial — device encryption required per Acceptable Use Policy; formal equipment siting guidance not documented |
| 7.9        | Security of assets off-premises                       | Yes        | All staff work off-premises with company assets (laptops); directly applicable                                                        | Partial — Acceptable Use Policy addresses encryption and access controls for remote devices                     |
| 7.10       | Storage media                                         | Yes        | Portable storage media (USB drives) poses data exfiltration risk                                                                      | Implemented — USB storage is explicitly prohibited in Section 4.2 of the Acceptable Use Policy (confirmed by Founder 2026-03-05); applies to all staff regardless of device ownership |
| 7.11       | Supporting utilities (power, HVAC)                    | No         | Common Bond does not operate any hardware infrastructure. Supporting utilities are entirely the responsibility of AWS and Cloudflare. | Not Applicable                                                                                                  |
| 7.12       | Cabling security                                      | No         | No physical cabling infrastructure operated by Common Bond.                                                                           | Not Applicable                                                                                                  |
| 7.13       | Equipment maintenance                                 | Yes        | Developer laptops require OS updates and security patches                                                                             | Partial — patch management requirement implied by Acceptable Use Policy; formal schedule not documented         |
| 7.14       | Secure disposal or re-use of equipment                | Yes        | Developer laptops must be securely wiped before disposal or re-assignment                                                             | Planned — requirement not yet formally documented                                                               |

---

## Theme 8 — Technological Controls (8.1–8.34)

| Control ID | Control Name                                                | Applicable | Justification                                                                                                          | Implementation Status                                                                                                                |
| ---------- | ----------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 8.1        | User endpoint devices                                       | Yes        | All devices are personally owned (BYOD); staff access company systems and PII from personal laptops                    | Partial — full-disk encryption and MFA enforced per Acceptable Use Policy; BYOD context means MDM enforcement is limited; Cloudflare Zero Trust governs access to company assets from personal devices |
| 8.2        | Privileged access rights                                    | Yes        | Supabase admin access, GitHub organisation admin, Cloudflare account — all require privileged access controls          | Implemented — privilege management addressed in Access Control Policy; Supabase RLS enforces least privilege                         |
| 8.3        | Information access restriction                              | Yes        | Access to PII and production systems restricted by role                                                                | Implemented — Supabase RLS and GitHub Teams enforce access restrictions                                                              |
| 8.4        | Access to source code                                       | Yes        | Source code is a critical IP asset; access must be controlled                                                          | Implemented — GitHub private repositories; access controlled via GitHub Teams                                                        |
| 8.5        | Secure authentication                                       | Yes        | MFA and password manager enforced for all accounts                                                                     | Implemented — requirements in Acceptable Use Policy                                                                                  |
| 8.6        | Capacity management                                         | Yes        | Supabase and Cloudflare provide elastic scaling; capacity monitoring applicable                                        | Implemented — cloud auto-scaling in place; capacity monitoring available via provider dashboards                                     |
| 8.7        | Protection against malware                                  | Yes        | Developer endpoints and code supply chain are malware vectors                                                          | Partial — GitHub Dependabot and CodeQL address supply chain malware; endpoint antivirus not formally mandated                        |
| 8.8        | Management of technical vulnerabilities                     | Yes        | Vulnerability management is a core control for a SaaS platform                                                         | Partial — Dependabot enabled; penetration testing in progress (CA-002); no formal vulnerability disclosure policy                    |
| 8.9        | Configuration management                                    | Yes        | Secure baseline configuration required for cloud services and developer endpoints                                      | Partial — infrastructure configuration managed via code; formal baseline documentation not complete                                  |
| 8.10       | Information deletion                                        | Yes        | PII deletion is subject to customer retention obligations; hospital customers may require 7-year retention under applicable health records legislation | Partial — data deletion is performed only with customer consent; hospital customers may impose 7-year retention obligations under state health records legislation; formal data retention and deletion schedule not yet documented; legal review recommended |
| 8.11       | Data masking                                                | Yes        | PII should be masked in non-production environments and logs                                                           | Partial — production vs. non-production separation exists; formal data masking in test data not yet verified                         |
| 8.12       | Data leakage prevention                                     | Yes        | PII exfiltration risk applicable to a healthcare-adjacent platform                                                     | Partial — RLS and access controls mitigate; no dedicated DLP tooling in place                                                        |
| 8.13       | Information backup                                          | Yes        | Database backup critical for RPO compliance                                                                            | Implemented — Supabase Point-in-Time Recovery (PITR) configured; RPO 12 hours documented in BCP                                      |
| 8.14       | Redundancy of information processing facilities             | Yes        | Application availability depends on cloud provider redundancy                                                          | Implemented — Supabase (AWS multi-AZ), Cloudflare (global edge) provide inherent redundancy                                          |
| 8.15       | Logging                                                     | Yes        | Security event and access logs are required evidence for incident response and audit                                   | Partial — Supabase and Cloudflare provide audit logs; formal log retention period and review cadence not yet documented              |
| 8.16       | Monitoring activities                                       | Yes        | Monitoring of systems for security events is required                                                                  | Partial — provider dashboards used; no centralised SIEM or alerting rules configured                                                 |
| 8.17       | Clock synchronisation                                       | Yes        | Consistent timestamps required for log integrity and audit trails                                                      | Implemented — cloud providers (AWS, Cloudflare) synchronise system clocks via NTP                                                    |
| 8.18       | Use of privileged utility programmes                        | Yes        | Database admin tools (Supabase Studio) and infrastructure management tools require controlled access                   | Partial — access to Supabase Studio and Cloudflare dashboard restricted to administrator accounts; formal policy not documented      |
| 8.19       | Installation of software on operational systems             | Yes        | Unauthorised software installation on production systems is a risk                                                     | Partial — Supabase managed infrastructure restricts direct installation; developer laptop policy not formally documented             |
| 8.20       | Networks security                                           | Yes        | Network security controls protect platform and data in transit                                                         | Implemented — Cloudflare Zero Trust in use; all traffic encrypted via TLS                                                            |
| 8.21       | Security of network services                                | Yes        | External network services (CDN, API gateway) must be secured                                                           | Implemented — Cloudflare provides WAF, DDoS protection, and secure API routing                                                       |
| 8.22       | Segregation of networks                                     | Yes        | Production and development environments should be network-segregated                                                   | Partial — Supabase project-level separation provides logical segregation; network-level isolation not formally documented            |
| 8.23       | Web filtering                                               | Yes        | Applicable; all devices are personal (BYOD); Cloudflare Zero Trust governs access to company assets but web filtering is not applied to personal device browsing | Partial — Cloudflare Zero Trust enforces access control to company systems; no Cloudflare Gateway or equivalent web filtering is applied to personal device internet traffic; BYOD model accepted risk (confirmed by Founder 2026-03-05) |
| 8.24       | Use of cryptography                                         | Yes        | Cryptography is used throughout (TLS in transit, encryption at rest in Supabase/AWS)                                   | Implemented — TLS enforced by Cloudflare; Supabase/AWS encrypt data at rest; key management via provider-managed KMS                 |
| 8.25       | Secure development lifecycle                                | Yes        | All product development must embed security throughout the SDLC                                                        | Partial — PR review process and Dependabot provide partial coverage; formal SDLC security gates not documented                       |
| 8.26       | Application security requirements                           | Yes        | Security requirements must be defined for the Receptor platform                                                        | Implemented — Supabase RLS architecture, authentication requirements, and API security are implemented                               |
| 8.27       | Secure system architecture and engineering principles       | Yes        | Security-by-design principles must be applied                                                                          | Partial — least privilege and defence-in-depth applied in practice; formal architecture security principles document not yet created |
| 8.28       | Secure coding                                               | Yes        | Developers must follow secure coding practices                                                                         | Partial — code review via GitHub PRs; no formal secure coding standard documented                                                    |
| 8.29       | Security testing in development and acceptance              | Yes        | Security testing required before production releases                                                                   | Partial — manual code review in place; automated SAST not confirmed active; penetration testing in progress (CA-002)                 |
| 8.30       | Outsourced development                                      | No         | All development is performed in-house. No external development contractors are currently engaged (confirmed by Founder 2026-03-05).   | Not Applicable — if contractors are engaged in future, this control must be reviewed and activated                                   |
| 8.31       | Separation of development, test and production environments | Yes        | Development, staging, and production Supabase projects are separate                                                    | Implemented — separate Supabase projects for development and production                                                              |
| 8.32       | Change management                                           | Yes        | Changes to production must be controlled to prevent security incidents                                                 | Implemented — all ISMS document changes via Git PR workflow; infrastructure changes reviewed informally                              |
| 8.33       | Test information                                            | Yes        | Production PII must not be used in test environments                                                                   | Partial — where production data is required for development, it is deidentified before use (confirmed by Founder 2026-03-05); formal data deidentification procedure not yet documented |
| 8.34       | Protection of information systems during audit testing      | Yes        | Audit testing must not disrupt production systems                                                                      | Planned — internal audit scoped to documentation review only; production system audit testing procedures not yet defined             |

---

## Exclusion Summary

The following controls are excluded on the basis that Common Bond operates no
physical premises and owns no infrastructure hardware. Physical security
responsibilities are entirely delegated to the cloud providers (Amazon Web
Services via Supabase, and Cloudflare), both of which hold their own ISO 27001
certifications.

| Control ID | Control Name                                          | Exclusion Justification       |
| ---------- | ----------------------------------------------------- | ----------------------------- |
| 7.1        | Physical security perimeters                          | No physical premises          |
| 7.2        | Physical entry                                        | No physical premises          |
| 7.3        | Securing offices, rooms and facilities                | No physical premises          |
| 7.4        | Physical security monitoring                          | No physical premises          |
| 7.5        | Protecting against physical and environmental threats | Cloud provider responsibility |
| 7.6        | Working in secure areas                               | No physical premises          |
| 7.11       | Supporting utilities                                  | Cloud provider responsibility |
| 7.12       | Cabling security                                      | No physical infrastructure    |

:::warning
If Common Bond establishes a physical office, co-working space arrangement with dedicated infrastructure, or engages staff working in client premises with access to Common Bond systems, the excluded controls (7.1–7.6, 7.11, 7.12) must be reviewed for applicability.
:::

---

## Review History

| Date       | Version | Reviewed By          | Notes                                        |
| ---------- | ------- | -------------------- | -------------------------------------------- |
| ⚠️ Confirm | 1.0     | Ryan Ammendolea, CEO | Initial SoA — pre-certification review stage |
