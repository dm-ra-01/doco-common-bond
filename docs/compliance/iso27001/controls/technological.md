---
title: Annex A Technological Controls (8)
sidebar_label: Technological Controls
---

import { ControlStatus } from '@site/src/components/compliance/ComplianceComponents';

# Annex A Technological Controls

Theme: Controls that involve technology-based protection of information systems.

## 8. Technological Controls

### 8.1 – 8.5: Access & Authentication

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.1 | User end point devices | <ControlStatus status="todo" /> | No MDM or endpoint management in place. Team uses personal devices. | Evaluate MDM options for company devices; document minimum device security requirements (encryption, OS updates). |
| 8.2 | Privileged access rights | <ControlStatus status="partial" /> | Supabase defines Admin, Manager, Worker roles. RLS policies *designed* but not fully enforced. GitHub repo access managed per-user. | Complete RBAC implementation in Supabase; audit all privileged accounts; document privilege management procedure. |
| 8.3 | Information access restriction | <ControlStatus status="partial" /> | RLS strategy *documented* to restrict data access by role and organisation. Implementation in progress. See [RLS Strategy](../https://docs.commonbond.au/receptor/docs/infrastructure/rls-policies). | Complete RLS implementation and pgTAP test coverage for all tables. |
| 8.4 | Access to source code | <ControlStatus status="partial" /> | GitHub private repositories with team-based access. Branch protection rules on `main`. | Audit GitHub access permissions; enforce 2FA for all GitHub accounts. |
| 8.5 | Secure authentication | <ControlStatus status="partial" /> | Supabase Auth (email/password, magic link, OAuth2). MFA not enforced for admin accounts. | Enforce MFA for admin/service accounts; document authentication requirements. |

### 8.6 – 8.8: Vulnerability & Malware

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.6 | Capacity management | <ControlStatus status="partial" /> | Supabase Cloud plan provides managed capacity. Self-hosted option uses Docker resource limits. No formal capacity planning. | Document capacity thresholds and alerting for self-hosted deployments. |
| 8.7 | Protection against malware | <ControlStatus status="todo" /> | No endpoint protection beyond OS defaults. Cloud infrastructure inherits provider protections. | Document reliance on cloud provider protections; evaluate endpoint security for developer machines. |
| 8.8 | Management of technical vulnerabilities | <ControlStatus status="partial" /> | GitHub Dependabot active for npm/pip dependencies. No formal vulnerability management process. | Formalise vulnerability management: triage cadence, severity thresholds, remediation SLAs. |

### 8.9 – 8.12: Configuration & Data Protection

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.9 | Configuration management | <ControlStatus status="partial" /> | Infrastructure as Code via `setup.sh` and Docker Compose. Configuration documented in [Supabase Self-Hosted](../https://docs.commonbond.au/receptor/docs/infrastructure/supabase-self-hosted) and [Config Guide](../https://docs.commonbond.au/receptor/docs/infrastructure/config-guide). | Document a formal change management process for configuration changes. |
| 8.10 | Information deletion | <ControlStatus status="todo" /> | No data retention or deletion policy. Supabase soft-deletes not standardised. | Define data retention periods per data type; implement automated deletion for expired data. |
| 8.11 | Data masking | <ControlStatus status="todo" /> | No data masking in development/test environments. Production PII could leak to dev. | Implement PII masking for non-production environments; document masking procedures. |
| 8.12 | Data leakage prevention | <ControlStatus status="todo" /> | No DLP controls in place. | Assess DLP needs; implement at minimum: private repos, secrets scanning (GitHub), `.gitignore` hygiene. |

### 8.13 – 8.17: Backup, Redundancy & Logging

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.13 | Information backup | <ControlStatus status="partial" /> | Supabase Cloud provides automatic daily backups. Self-hosted backup strategy not documented. | Document backup procedures for self-hosted deployments; test backup restoration. |
| 8.14 | Redundancy of processing facilities | <ControlStatus status="partial" /> | Supabase Cloud offers multi-AZ. Self-hosted is single-server. | Document redundancy strategy; accept risk for self-hosted single-server or plan for HA. |
| 8.15 | Logging | <ControlStatus status="partial" /> | PostgreSQL logs, Supabase API logs, and Edge Function logs available. No centralised log management or alerting. | Implement centralised logging; define log retention policy; set up alerts for security events. |
| 8.16 | Monitoring activities | <ControlStatus status="todo" /> | Supabase dashboard provides basic metrics. No proactive security monitoring. | Define monitoring requirements; implement alerting for anomalous activity. |
| 8.17 | Clock synchronization | <ControlStatus status="partial" /> | Cloud instances use provider NTP. Self-hosted Docker containers inherit host time. | Document NTP configuration for self-hosted deployments. |

### 8.18 – 8.22: System & Network Security

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.18 | Use of privileged utility programs | <ControlStatus status="partial" /> | Docker and database CLI tools used for administration. Access limited to founder. | Document approved privileged tools and who may use them. |
| 8.19 | Installation of software on operational systems | <ControlStatus status="partial" /> | Docker-based deployment ensures only approved containers run. No formal software installation policy. | Document approved software list for production; prohibit ad-hoc installations. |
| 8.20 | Networks security | <ControlStatus status="partial" /> | Cloudflare provides WAF/DDoS protection for public-facing services. Docker network isolation for internal services. | Document network architecture; review firewall rules. |
| 8.21 | Security of network services | <ControlStatus status="partial" /> | HTTPS enforced via Cloudflare. Supabase Kong gateway manages API routing. | Document network service security configurations and agreements with providers. |
| 8.22 | Segregation of networks | <ControlStatus status="partial" /> | Docker Compose creates isolated networks per stack. Dev/prod are separate deployments. | Document network segregation architecture. |

### 8.23 – 8.28: Application Security

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.23 | Web filtering | <ControlStatus status="todo" /> | No web filtering in place. | Assess whether web filtering is needed for the organisation's risk profile. |
| 8.24 | Use of cryptography | <ControlStatus status="partial" /> | TLS for all API communication. `pgsodium` available for database-level encryption. JWT signing for tokens. See [Key Management](../https://docs.commonbond.au/receptor/docs/infrastructure/key-management). | Document cryptographic controls inventory (algorithms, key lengths, key lifecycle). |
| 8.25 | Secure development life cycle | <ControlStatus status="partial" /> | Git-based workflow with branch protection, PR reviews, and linting. CI via Codemagic. No formal SDLC security requirements document. See [CI/CD](../https://docs.commonbond.au/receptor/docs/infrastructure/ci-cd) · [Testing Guide](../https://docs.commonbond.au/receptor/docs/infrastructure/testing-guide). | Document secure SDLC requirements (code review checklist, security testing gates, dependency scanning in CI). |
| 8.26 | Application security requirements | <ControlStatus status="todo" /> | No formal application security requirements documented. | Define security requirements for the Receptor platform (input validation, output encoding, session management). |
| 8.27 | Secure system architecture and engineering principles | <ControlStatus status="partial" /> | Architecture documented in Docusaurus. RLS-by-default and least-privilege principles followed. | Formalise secure architecture principles document; reference in development standards. |
| 8.28 | Secure coding | <ControlStatus status="partial" /> | ESLint, TypeScript strict mode, Flutter analysis. Code reviews via PRs. No formal secure coding guidelines. | Create secure coding guidelines for the team; integrate SAST into CI pipeline. |

### 8.29 – 8.34: Testing, Change Management & Audit

| ID | Control | Status | Approach | TODO |
|----|---------|--------|----------|------|
| 8.29 | Security testing in development and acceptance | <ControlStatus status="partial" /> | Unit tests (Vitest, pgTAP), E2E tests (Playwright). No dedicated security testing (pen testing, DAST). See [Testing Guide](../https://docs.commonbond.au/receptor/docs/infrastructure/testing-guide). | Plan a penetration test pre-production launch; integrate DAST into CI. |
| 8.30 | Outsourced development | <ControlStatus status="out-of-scope" /> | No outsourced development at this time. | Revisit if/when external developers are engaged. |
| 8.31 | Separation of development, test and production environments | <ControlStatus status="partial" /> | Separate Docker configurations for dev (`receptor-dev`) and prod (`receptor-prod`). Local development uses isolated Supabase instance. | Document environment separation policy; ensure no production data in dev/test. |
| 8.32 | Change management | <ControlStatus status="partial" /> | Git-based change management. PRs required for `main`. No formal Change Advisory Board (appropriate for startup). | Document change management procedure; define rollback procedures. |
| 8.33 | Test information | <ControlStatus status="partial" /> | Test data is synthetic (seeded via `setup.sh`). No production PII used in tests. | Formalise test data management policy; document that production data must never be used in testing. |
| 8.34 | Protection of information systems during audit testing | <ControlStatus status="todo" /> | No audit testing conducted yet. | Define procedures for secure audit testing when the time comes. |
