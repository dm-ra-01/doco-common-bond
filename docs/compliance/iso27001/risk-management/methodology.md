---
title: Risk Methodology
sidebar_position: 1
---

# Risk Assessment & Treatment Methodology

## 1. Introduction
This methodology outlines how Common Bond identifies, analyzes, evaluates, and treats information security risks.

## 2. Risk Assessment Process

### 2.1 Asset Identification
We identify critical assets:
- **Information:** Customer data (PII), source code, intellectual property.
- **Hardware:** Developer laptops.
- **Software:** Supabase, GitHub, Cloudflare, SaaS tools.
- **People:** Employees, contractors.

### 2.2 Threat Identification
We consider threats such as:
- Malware / Ransomware
- Phishing / Social Engineering
- Insider Threats (accidental or malicious)
- Software Vulnerabilities
- Supplier Failure

### 2.3 Vulnerability Identification
We identify weaknesses like:
- Unpatched software
- Weak passwords
- Lack of MFA
- Misconfigured cloud resources

### 2.4 Risk Analysis (Likelihood x Impact)
We value risks on a qualitative scale (Low, Medium, High).

| Likelihood | Description |
| :--- | :--- |
| **High** | Almost certain to occur in the next 12 months. |
| **Medium** | Possible to occur in the next 12 months. |
| **Low** | Unlikely to occur. |

| Impact | Description |
| :--- | :--- |
| **High** | Significant financial loss, legal action, major reputational damage. |
| **Medium** | Disruption to operations, some financial loss, minor reputational damage. |
| **Low** | Minor disruption, negligible loss. |

**Risk Level = Likelihood x Impact (Matrix)**
- **High Risk:** Immediate action required.
- **Medium Risk:** Action required within 3-6 months.
- **Low Risk:** Monitor/Accept.

## 3. Risk Treatment
Options:
1.  **Reduce/Mitigate:** Implement controls (e.g., enable MFA).
2.  **Avoid:** Stop the activity causing the risk.
3.  **Transfer:** Use insurance or third-party contracts (e.g., using Supabase transfers DB maintenance risk).
4.  **Accept:** Formally acknowledge the risk and choose not to act (requires CEO approval for High/Medium).

## 4. Review
Risk assessments are reviewed **annually** or upon major changes.
