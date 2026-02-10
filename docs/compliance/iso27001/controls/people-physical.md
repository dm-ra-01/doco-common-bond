---
title: Annex A People & Physical Controls (6 & 7)
sidebar_label: People & Physical Controls
---

import { ControlStatus } from '@site/src/components/compliance/ComplianceComponents';

# Annex A People & Physical Controls

## 6. People Controls

Theme: Controls that concern individual people — screening, awareness, and employment conditions.

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 6.1 | Screening | <ControlStatus status="todo" /> | Currently no formal background check process. As a startup, hiring is founder-led. | Define a screening procedure for new hires/contractors (reference checks, identity verification). |
| 6.2 | Terms and conditions of employment | <ControlStatus status="todo" /> | No formal employment contracts with security clauses yet. | Include information security responsibilities in employment contracts/agreements. |
| 6.3 | Information security awareness, education and training | <ControlStatus status="todo" /> | No formal programme exists. | Develop a lightweight security awareness programme. Deliver initial training to all team members. |
| 6.4 | Disciplinary process | <ControlStatus status="todo" /> | No formal disciplinary process for security violations. | Document a disciplinary procedure for information security breaches (even if simple). |
| 6.5 | Responsibilities after termination or change of employment | <ControlStatus status="todo" /> | No documented offboarding procedure. | Create an access revocation and exit checklist (GitHub, Supabase, Cloudflare, Slack). |
| 6.6 | Confidentiality or non-disclosure agreements | <ControlStatus status="partial" /> | NDAs used for some engagements. Not yet standardised. | Standardise NDA template; ensure all contractors/collaborators sign before access is granted. |
| 6.7 | Remote working | <ControlStatus status="partial" /> | Team is fully remote by default. Device security is ad-hoc (personal devices). | Document a remote working security policy (device encryption, network security, screen lock requirements). |
| 6.8 | Information security event reporting | <ControlStatus status="todo" /> | No reporting channel or process defined. | Define how team members should report security events (channel, template, escalation). |

---

## 7. Physical Controls

Theme: Controls related to physical security of equipment and facilities.

:::info Context
Receptor is a cloud-native, fully remote startup. There is no corporate office. All infrastructure runs in cloud environments (Supabase Cloud, Cloudflare, GitHub). Physical controls are therefore largely *inherited* from our cloud service providers.
:::

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 7.1 | Physical security perimeters | <ControlStatus status="partial" /> | Inherited from cloud providers (AWS/GCP data centres). No corporate premises to secure. | Document that this is inherited; reference provider SOC 2/ISO 27001 certifications. |
| 7.2 | Physical entry | <ControlStatus status="partial" /> | Inherited from cloud providers. | As above. |
| 7.3 | Securing offices, rooms and facilities | <ControlStatus status="partial" /> | N/A — no corporate office. Remote workers use home offices. | Include home office security guidance in remote working policy. |
| 7.4 | Physical security monitoring | <ControlStatus status="partial" /> | Inherited from cloud providers. | As above. |
| 7.5 | Protecting against physical and environmental threats | <ControlStatus status="partial" /> | Inherited from cloud providers (fire suppression, climate control, etc.). | Document inherited controls with provider evidence. |
| 7.6 | Working in secure areas | <ControlStatus status="partial" /> | Inherited from cloud providers. | As above. |
| 7.7 | Clear desk and clear screen | <ControlStatus status="todo" /> | No formal policy. Remote workers manage their own workspaces. | Include clear desk/screen guidance in remote working policy. |
| 7.8 | Equipment siting and protection | <ControlStatus status="partial" /> | Personal devices used. No formal device management. | Document approved device standards; consider MDM for company-issued devices (future). |
| 7.9 | Security of assets off-premises | <ControlStatus status="partial" /> | All assets are effectively "off-premises" (cloud + personal devices). | Address in remote working policy. |
| 7.10 | Storage media | <ControlStatus status="partial" /> | Cloud storage only (Supabase, GitHub). No removable media policy. | Document that removable media is not used for sensitive data; enforce if needed. |
| 7.11 | Supporting utilities | <ControlStatus status="partial" /> | Inherited from cloud providers (UPS, redundant power). | Document inherited controls. |
| 7.12 | Cabling security | <ControlStatus status="partial" /> | Inherited from cloud providers. | Document inherited controls. |
| 7.13 | Equipment maintenance | <ControlStatus status="partial" /> | Cloud infrastructure maintained by providers. Personal device maintenance is ad-hoc. | Include device maintenance guidance in security policy. |
| 7.14 | Secure disposal or re-use of equipment | <ControlStatus status="todo" /> | No formal disposal process for personal devices. | Document a data wiping procedure for devices that have held company data. |
