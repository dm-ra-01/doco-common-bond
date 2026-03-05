---
title: Risk Methodology
sidebar_position: 1
---

# Risk Assessment & Treatment Methodology

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## 1. Introduction

This methodology outlines how Common Bond identifies, analyzes, evaluates, and
treats information security risks.

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

| Likelihood | Description                                    |
| :--------- | :--------------------------------------------- |
| **High**   | Almost certain to occur in the next 12 months. |
| **Medium** | Possible to occur in the next 12 months.       |
| **Low**    | Unlikely to occur.                             |

| Impact     | Description                                                               |
| :--------- | :------------------------------------------------------------------------ |
| **High**   | Significant financial loss, legal action, major reputational damage.      |
| **Medium** | Disruption to operations, some financial loss, minor reputational damage. |
| **Low**    | Minor disruption, negligible loss.                                        |

**Risk Level = Likelihood × Impact (Matrix)**

| Likelihood \ Impact | Low    | Medium | High   |
| :------------------ | :----- | :----- | :----- |
| **High**            | Medium | High   | High   |
| **Medium**          | Low    | Medium | High   |
| **Low**             | Low    | Low    | Medium |

## 2.5 Risk Acceptance Criteria

Risk acceptance criteria are established in accordance with ISO 27001 Clause
6.1.2(a). The following thresholds define when a risk may be accepted without
further treatment and the required approval authority:

| Risk Level | Acceptance Position                                                                                                                                              | Approval Authority           |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| **Low**    | Accepted without further treatment. Risk is monitored during annual review.                                                                                      | Information Security Manager |
| **Medium** | Accepted only where treatment is disproportionate to impact, or where no cost-effective control exists. Requires documented justification.                       | CEO (Ryan Ammendolea)        |
| **High**   | Not accepted without active treatment. A treatment plan must be approved before the risk is retained. Residual risk acceptance requires documented CEO sign-off. | CEO (Ryan Ammendolea)        |

::: warning[High Risk Escalation Requirement]

Any risk rated High that cannot be immediately mitigated must be escalated to
the CEO and formally logged in the Risk Register with a documented treatment
plan and target resolution date.

:::

## 3. Risk Treatment

Treatment options, consistent with ISO 27001 Annex A control selection:

1. **Reduce/Mitigate:** Implement controls to reduce the likelihood or impact
   (e.g., enable MFA, enforce RLS policies).
2. **Avoid:** Cease the activity giving rise to the risk.
3. **Transfer:** Use insurance or third-party contracts to share the risk (e.g.,
   relying on Supabase for database infrastructure maintenance).
4. **Accept:** Formally acknowledge the risk and choose not to act further.
   Requires documented CEO approval for Medium and High risks (see Section 2.5).

## 4. Review

Risk assessments are reviewed **annually** or upon major changes.
