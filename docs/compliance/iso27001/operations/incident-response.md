---
title: Incident Response Plan
sidebar_position: 4
---

# Incident Response Plan

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## 1. Purpose

This plan establishes the process for detecting, responding to, and recovering
from information security incidents affecting Common Bond Pty Ltd and MyJMO Pty
Ltd (collectively, "Common Bond"). It satisfies the requirements of ISO/IEC
27001:2022 controls 5.24–5.28 and supports compliance with the Australian
Privacy Act 1988 (Privacy Act) mandatory data breach notification obligations
under Part IIIC.

## 2. Scope

This plan applies to all information assets, systems, and personnel under the
Common Bond ISMS, including third-party suppliers with access to Common Bond
data.

## 3. Definitions

| Term                 | Definition                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Security Incident    | Any event that compromises the confidentiality, integrity, or availability of a Common Bond information asset.             |
| Personal Data Breach | An incident resulting in accidental or unlawful access to, destruction, alteration, or disclosure of personal information. |
| Eligible Data Breach | A breach meeting the threshold for mandatory notification under the Privacy Act Part IIIC (serious harm likely).           |

## 4. Primary Security Contact

All suspected security incidents must be reported immediately to:

| Role                    | Name            | Email               | Mobile          |
| ----------------------- | --------------- | ------------------- | --------------- |
| Founder & CEO (Primary) | Ryan Ammendolea | alert@commonbond.au | +61 403 551 813 |

## 5. Incident Severity Classification

| Severity          | Criteria                                                                               | Response Target      |
| ----------------- | -------------------------------------------------------------------------------------- | -------------------- |
| **P1 — Critical** | Active breach; data exfiltration in progress; ransomware; total service unavailability | Immediate (< 1 hour) |
| **P2 — High**     | Suspected breach; credential compromise; significant data exposure                     | < 4 hours            |
| **P3 — Medium**   | Minor policy violation; failed access attempts; isolated anomaly                       | < 24 hours           |
| **P4 — Low**      | Observation or near-miss with no data impact                                           | < 72 hours           |

## 6. Response Process

### Phase 1: Detection and Reporting

1. Any staff member who discovers or suspects a security incident must report it
   immediately to `alert@commonbond.au`.
2. The Founder/CEO (incident commander) assesses the report and assigns an
   initial severity rating.
3. A private incident channel is opened in the team communication tool for
   coordination.

### Phase 2: Containment

1. Isolate affected systems or accounts to prevent further spread. Actions may
   include revoking API keys, disabling accounts, or revoking Cloudflare access.
2. Preserve evidence — do not wipe or reimage systems before collecting logs.
3. Contact affected third-party suppliers (e.g., Supabase) via their security
   contact if their infrastructure is implicated.
4. Assess whether personal information has been accessed or disclosed.

### Phase 3: Assessment and Notification

1. Determine the scope and nature of data involved.
2. Apply the **Notifiable Data Breach (NDB) threshold test** under Privacy Act
   Part IIIC: if there are reasonable grounds to believe an Eligible Data Breach
   has occurred, notification obligations are triggered.
3. **Notification timeline:**
   - Internal containment and assessment: as soon as practicable.
   - Customer notification target: **72 hours** from confirmed breach (internal
     target; the Privacy Act requires notification "as soon as practicable").
   - Regulator notification: notify the Office of the Australian Information
     Commissioner (OAIC) via the NDB submission form simultaneously with, or
     prior to, customer notification.

:::warning Privacy Act Obligation Under Part IIIC of the Privacy Act 1988,
Common Bond must notify the OAIC and affected individuals of an Eligible Data
Breach. "Serious harm" includes identity theft, financial harm, and significant
reputational damage. When in doubt, notify. The cost of under-notifying exceeds
the cost of over-notifying. :::

### Phase 4: Eradication and Recovery

1. Identify and eliminate the root cause (e.g., patch vulnerability, rotate
   credentials, revoke compromised tokens).
2. Restore services from known-good state. Leverage Supabase Point-in-Time
   Recovery (PITR) for database restoration where required.
3. Verify that the threat has been fully eradicated before restoring normal
   operations.

### Phase 5: Post-Incident Review

1. Within 5 business days of closure, conduct a post-incident review.
2. Document findings in a Post-Incident Report covering: timeline, root cause,
   data impacted, containment effectiveness, and corrective actions.
3. Raise a Non-Conformity or Corrective Action in the ISMS if systemic
   weaknesses are identified.
4. Update this plan if gaps in the response process are identified.

## 7. Evidence Retention

All incident records, including communications, logs, and post-incident reports,
are retained for a minimum of three years to support regulatory and audit
requirements.

## 8. Plan Review

This plan is reviewed annually and after every P1 or P2 incident. The
Founder/CEO is responsible for ensuring the plan remains current.
