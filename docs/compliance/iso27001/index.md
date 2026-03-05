---
title: ISO/IEC 27001:2022 Compliance
sidebar_label: Overview
sidebar_position: 0
---

# ISO 27001:2022 — ISMS Overview

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## What This Is

This section is Common Bond's **Information Security Management System (ISMS)**
— the complete set of policies, procedures, risk assessments, and operational
records required to achieve and maintain ISO/IEC 27001:2022 certification.

The ISMS covers both **Common Bond Pty Ltd** and **MyJMO Pty Ltd** and applies
to all systems, staff, and third parties involved in operating the Receptor
platform.

:::info
**Certification status:** Pre-certification — implementation phase. Target Stage 1 audit readiness: **2026-04-30**. External audit body not yet selected.
:::

---

## ISMS Structure

The ISMS follows the ISO 27001:2022 clause structure, organised into five
sections:

| Section                               | ISO 27001 Clauses | Purpose                                                          |
| ------------------------------------- | ----------------- | ---------------------------------------------------------------- |
| [Governance](./governance/)           | 4, 5, 6           | Scope, objectives, leadership, and role assignments              |
| [Policies](./policies/)               | 5.2, 7.5          | Rules that all staff and contractors must follow                 |
| [Risk Management](./risk-management/) | 6.1, 6.2          | Identifying, assessing, and treating information security risks  |
| [Operations](./operations/)           | 7–10, Annex A     | Evidence of day-to-day ISMS operation and control implementation |
| [Assurance](./assurance/)             | 9, 10             | Internal audit, non-conformity tracking, and corrective actions  |

---

## Governance

Establishes the authority and direction for information security. ISO 27001
Clauses 4–6.

- [ISMS Scope](./governance/scope) — What is in and out of scope; legal
  entities; interested parties
- [Information Security Objectives](./governance/objectives) — Measurable
  targets with owner and dates
- [Roles & Responsibilities](./governance/roles-responsibilities) — Named
  individuals; CEO/ISM dual-role declaration

---

## Policies

The rules that govern how Common Bond handles information assets. All policies
require CEO sign-off.

- [Information Security Policy](./policies/information-security-policy) —
  High-level mandate; principles; responsibilities
- [Acceptable Use Policy](./policies/acceptable-use) — Device, password, data,
  and USB rules; BYOD context
- [Access Control Policy](./policies/access-control) — Least privilege; Supabase
  RLS; key rotation
- [Document Control Policy](./policies/document-control) — Git/PR workflow as
  the ISMS change management mechanism
- [Data Classification Scheme](./policies/data-classification) — 4-tier scheme
  (Public / Internal / Confidential / Restricted)

---

## Risk Management

Common Bond uses a qualitative likelihood × impact matrix with defined
acceptance criteria. ISO 27001 Clause 6.1.

- [Risk Methodology](./risk-management/methodology) — 3×3 matrix; acceptance
  criteria; treatment taxonomy
- [Risk Register](./risk-management/risk-register) — 11 active risks
  (R-001–R-011); owners; treatment status
- [Risk Treatment Plan](./risk-management/treatment-plan) — Active and completed
  treatments with due dates

---

## Operations

The evidence that the ISMS is operating — records, registers, and operational
procedures.

- [Statement of Applicability (SoA)](./operations/soa) — All 93 Annex A
  controls; applicability; implementation status
- [Asset Register](./operations/asset-register) — 15 information assets across 4
  categories
- [Incident Response Plan](./operations/incident-response) — Severity
  classification; 5-phase response; Privacy Act NDB obligations
- [Business Continuity Plan](./operations/business-continuity) — RTO 4 hours /
  RPO 12 hours; Supabase PITR recovery
- [Supplier Security Register](./operations/supplier-register) — 5 critical
  suppliers; DPA status and actions
- [Training & Competency Policy](./operations/training-competency) — Required
  training; onboarding checklist structure
- [Training Records](./operations/training-records) — Live evidence: competency
  matrix; onboarding completion per staff member

---

## Assurance

How Common Bond checks that the ISMS is working and fixes what isn't. ISO 27001
Clauses 9 and 10.

- [Internal Audit Procedure](./assurance/internal-audit) — Audit programme;
  methodology; first audit scheduled 2026-04-15
- [Non-Conformity Log](./assurance/nonconformity-log) — Open and closed
  non-conformities (NC-001 closed; NC-002 open)
- [Corrective Actions](./assurance/corrective-actions) — Root cause analysis and
  remediation tracking
