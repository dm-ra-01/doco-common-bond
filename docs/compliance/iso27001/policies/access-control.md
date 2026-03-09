---
title: Access Control Policy
sidebar_position: 4
---

# Access Control Policy

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## 1. Purpose

To limit access to information and information processing facilities to
authorized users.

## 2. Policy

### 2.1 User Registration and Deregistration

- Accounts are created only upon formal request or onboarding.
- Access is revoked **immediately** (within 24 hours) upon termination of
  employment or contract.

### 2.2 Governance of Access Rights

- **Least Privilege:** Users are granted the minimum access necessary to perform
  their job functions.
- **Review:** Access rights are reviewed **quarterly** by the CTO to ensure they
  are still appropriate.

### 2.3 Password Management

- See **Acceptable Use Policy** for password complexity and MFA requirements.

### 2.4 Privileged Access

- Administrative access (e.g., AWS/Supabase Production, GitHub Owner) is
  restricted to a minimal number of personnel.
- Use of privileged accounts is monitored.

### 2.5 Technical Controls

- **Source Code:** Access to GitHub repositories is managed via Teams.
- **Database:** Supabase Row Level Security (RLS) enforces access control at the
  data layer. Application service keys are reviewed for rotation on a regular
  basis (annually, or upon staff changes where those staff held access to the
  credentials).
- **Network:** Cloudflare Access (Zero Trust) is used where applicable to
  protect internal tools.

### 2.6 AI Tool Access Control

_ISO 27001 Annex A 5.15 (Access control) and 8.2 (Privileged access rights) —
added 2026-03-09 per audit `260307-iso27001-ai-gaps` REC-AI-01._

- **Permitted users:** Engineering staff may use approved AI tools (see Approved
  AI Tools List in the Acceptable Use Policy) with Public and Internal-tier
  company data. No staff may input Confidential or Restricted data into any AI
  tool without explicit written approval from the Information Security Manager
  (ISM).
- **Privileged AI access:** Staff who configure AI system prompts, workflow
  templates (`.agents/` directories), tool integrations, or model parameters are
  considered to hold privileged AI access. This access is restricted to
  engineering personnel under the same least-privilege principles that apply to
  all privileged access.
- **AI API keys and credentials:** API keys issued to AI services are treated as
  privileged credentials. They are subject to the same rotation and
  access-review controls as other service keys (reviewed annually or upon staff
  changes with access to those credentials).
