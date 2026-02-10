---
title: Annex A Organizational Controls (5)
sidebar_label: Organizational Controls
---

import { ControlStatus } from '@site/src/components/compliance/ComplianceComponents';

# Annex A Organizational Controls

Theme: Controls that involve organizational processes and policies.

## 5. Organizational Controls

### 5.1 – 5.4: Policies, Roles & Responsibilities

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.1 | Policies for information security | <ControlStatus status="todo" /> | Draft a top-level Information Security Policy and publish it in Docusaurus. | Draft, approve, and communicate the policy. |
| 5.2 | Information security roles and responsibilities | <ControlStatus status="partial" /> | Founder currently holds all security responsibilities. Document ISMS roles explicitly. | Assign and document ISMS roles (even if one person). |
| 5.3 | Segregation of duties | <ControlStatus status="partial" /> | GitHub branch protection and PR reviews provide some segregation. Limited by team size. | Document compensating controls for single-person operations. |
| 5.4 | Management responsibilities | <ControlStatus status="partial" /> | Founder is responsible. No formal documented commitment. | Draft management commitment statement. |

### 5.5 – 5.8: External Contacts & Project Management

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.5 | Contact with authorities | <ControlStatus status="todo" /> | Identify relevant authorities (OAIC, state health regulators). | Create a contact register for authorities. |
| 5.6 | Contact with special interest groups | <ControlStatus status="todo" /> | Monitor ACSC advisories, cloud provider security bulletins. | Subscribe to ACSC alerts; document in register. |
| 5.7 | Threat intelligence | <ControlStatus status="todo" /> | Leverage GitHub Dependabot, Supabase advisories. | Formalise a threat intelligence process (even lightweight). |
| 5.8 | Information security in project management | <ControlStatus status="partial" /> | Security considerations documented in project docs (Docusaurus). Not embedded as a formal gate. | Add security review checklist to project workflow. |

### 5.9 – 5.14: Asset Management & Classification

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.9 | Inventory of information and other associated assets | <ControlStatus status="todo" /> | Need a formal asset register covering systems, data stores, and cloud services. | Create an information asset register. |
| 5.10 | Acceptable use of information and other associated assets | <ControlStatus status="todo" /> | No acceptable use policy exists. | Draft an Acceptable Use Policy. |
| 5.11 | Return of assets | <ControlStatus status="todo" /> | Cloud-first means limited physical assets. Need process for revoking access on departure. | Document access revocation procedure for departing team members. |
| 5.12 | Classification of information | <ControlStatus status="todo" /> | No formal data classification scheme. | Define classification levels (e.g., Public, Internal, Confidential, Restricted). |
| 5.13 | Labelling of information | <ControlStatus status="todo" /> | No labelling scheme in place. | Implement labelling after classification scheme is defined. |
| 5.14 | Information transfer | <ControlStatus status="partial" /> | All API communication uses HTTPS/TLS. No formal transfer policy for other channels (email, messaging). | Document an information transfer policy. |

### 5.15 – 5.18: Access Control & Identity

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.15 | Access control | <ControlStatus status="partial" /> | RLS strategy is *documented* but not fully implemented. See [RLS Strategy](../https://docs.commonbond.au/receptor/docs/infrastructure/rls-policies). | Complete RLS implementation and testing; create formal access control policy. |
| 5.16 | Identity management | <ControlStatus status="partial" /> | Supabase Auth handles user identity. No formal identity lifecycle management. | Document identity lifecycle (provisioning, review, deprovisioning). |
| 5.17 | Authentication information | <ControlStatus status="partial" /> | Supabase Auth with password and magic link authentication. MFA not yet enforced. | Enforce MFA for admin accounts; document authentication policy. |
| 5.18 | Access rights | <ControlStatus status="partial" /> | Role-based access defined in RLS strategy (Worker, Manager, Admin). Implementation in progress. | Complete RBAC implementation; schedule periodic access reviews. |

### 5.19 – 5.23: Supplier Management

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.19 | Information security in supplier relationships | <ControlStatus status="todo" /> | Key suppliers: Supabase, Cloudflare, GitHub, Codemagic. No formal supplier security assessment. | Create supplier register with security assessment for each. |
| 5.20 | Addressing information security within supplier agreements | <ControlStatus status="todo" /> | Using standard T&Cs from cloud providers. | Review supplier agreements for security clauses; document gaps. |
| 5.21 | Managing information security in the ICT supply chain | <ControlStatus status="todo" /> | npm/pip dependencies managed via lock files. Dependabot active for vulnerability scanning. | Formalise supply chain security process (SBOM generation). |
| 5.22 | Monitoring, review and change management of supplier services | <ControlStatus status="todo" /> | No formal monitoring of supplier security posture. | Schedule annual review of supplier security (SOC 2 reports, etc.). |
| 5.23 | Information security for use of cloud services | <ControlStatus status="partial" /> | Supabase and Cloudflare provide core cloud services. Self-hosted option available for data sovereignty. | Document cloud service usage and shared responsibility model. |

### 5.24 – 5.28: Incident Management

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.24 | Information security incident management planning and preparation | <ControlStatus status="todo" /> | No incident response plan exists. | **Draft an Incident Response Plan** (detection, escalation, containment, recovery). |
| 5.25 | Assessment and decision on information security events | <ControlStatus status="todo" /> | No process for classifying security events. | Define event classification criteria (severity levels). |
| 5.26 | Response to information security incidents | <ControlStatus status="todo" /> | No documented response procedures. | Document response procedures per incident type. |
| 5.27 | Learning from information security incidents | <ControlStatus status="todo" /> | No post-incident review process. | Define post-incident review and lessons-learned process. |
| 5.28 | Collection of evidence | <ControlStatus status="todo" /> | Supabase logs available. No formal evidence collection procedure. | Document evidence preservation and chain-of-custody procedures. |

### 5.29 – 5.30: Business Continuity

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.29 | Information security during disruption | <ControlStatus status="todo" /> | No formal business continuity plan. | Draft a Business Continuity Plan covering information security. |
| 5.30 | ICT readiness for business continuity | <ControlStatus status="partial" /> | Supabase provides automatic backups. Docker-based deployment allows rebuilds from scratch. No formal DR testing. | Document disaster recovery procedures; conduct a DR test. |

### 5.31 – 5.37: Compliance & Documentation

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 5.31 | Legal, statutory, regulatory and contractual requirements | <ControlStatus status="partial" /> | Australian Privacy Act, GDPR awareness documented. See [Risk Management](../../../governance-and-legal/risk-management). | Create a formal legal/regulatory requirements register. |
| 5.32 | Intellectual property rights | <ControlStatus status="partial" /> | Proprietary code, OSS dependencies tracked in `package.json`/`requirements.txt`. | Conduct an OSS licence compliance audit. |
| 5.33 | Protection of records | <ControlStatus status="partial" /> | Git provides version control. Database backups via Supabase. No formal records management. | Define records retention and disposal policy. |
| 5.34 | Privacy and protection of PII | <ControlStatus status="partial" /> | RLS designed to isolate PII. Data residency in Australian regions planned. See [Risk Management](../../../governance-and-legal/risk-management). | Complete PII inventory; implement data masking in non-production environments. |
| 5.35 | Independent review of information security | <ControlStatus status="todo" /> | No independent review conducted. | Plan for an independent security audit pre-certification. |
| 5.36 | Compliance with policies, rules and standards for information security | <ControlStatus status="todo" /> | This ISO 27001 effort is the first formal compliance programme. | Complete this documentation; conduct compliance gap analysis. |
| 5.37 | Documented operating procedures | <ControlStatus status="partial" /> | Infrastructure and development procedures documented in Docusaurus. See [Database Initialisation](../https://docs.commonbond.au/receptor/docs/infrastructure/database-initialization) · [Testing Guide](../https://docs.commonbond.au/receptor/docs/infrastructure/testing-guide). | Audit all operational procedures for completeness and currency. |
