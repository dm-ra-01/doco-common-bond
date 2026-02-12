---
title: Access Control Policy
sidebar_position: 4
---

# Access Control Policy

## 1. Purpose
To limit access to information and information processing facilities to authorized users.

## 2. Policy

### 2.1 User Registration and Deregistration
- Accounts are created only upon formal request or onboarding.
- Access is revoked **immediately** (within 24 hours) upon termination of employment or contract.

### 2.2 Governance of Access Rights
- **Least Privilege:** Users are granted the minimum access necessary to perform their job functions.
- **Review:** Access rights are reviewed **quarterly** by the CTO to ensuring they are still appropriate.

### 2.3 Password Management
- See **Acceptable Use Policy** for password complexity and MFA requirements.

### 2.4 Privileged Access
- Administrative access (e.g., AWS/Supabase Production, GitHub Owner) is restricted to a minimal number of personnel.
- Use of privileged accounts is monitored.

### 2.5 Technical Controls
- **Source Code:** Access to GitHub repositories is managed via Teams.
- **Database:** Supabase Row Level Security (RLS) enforces access control at the data layer. Application service keys are rotated if compromised.
- **Network:** Cloudflare Access (Zero Trust) is used where applicable to protect internal tools.
