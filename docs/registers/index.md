---
title: Register of Registers
sidebar_label: Overview
sidebar_position: 1
---

# 📋 Register of Registers

> **META-001 Implementation.** This is the authoritative index of all named
> registers, logs, and tracked artefact collections maintained by Common Bond
> and MyJMO Pty Ltd. It is the canonical entry point for anyone asking the
> question: _"Where do we track X?"_

**Last Updated:** 2026-03-09 | **Owner:** Ryan Ammendolea, CEO | **Next
Review:** 2027-03-01

---

## How to Read This Register

| Column                          | Meaning                                                           |
| :------------------------------ | :---------------------------------------------------------------- |
| **Register ID**                 | Unique identifier in domain-prefixed format (e.g. `ISMS-REG-001`) |
| **Name**                        | Human-readable register name                                      |
| **Location**                    | Docusaurus page path                                              |
| **Governing Standard / Clause** | The standard or policy that mandates this register                |
| **Owner**                       | Accountable individual or role                                    |
| **Review Cadence**              | How often the register must be formally reviewed                  |
| **Status**                      | `✅ Active` · `🔄 In Progress` · `📅 Planned` · `⚠️ Needs Review` |

---

## ISMS Registers

_Registers maintained as part of the Information Security Management System (ISO
27001:2022)._

| Register ID    | Name                                 | Location                                                                                                           | Governing Standard                 | Owner                | Review Cadence              | Status    |
| :------------- | :----------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :--------------------------------- | :------------------- | :-------------------------- | :-------- |
| `ISMS-REG-001` | **Risk Register**                    | [/docs/compliance/iso27001/risk-management/risk-register](/docs/compliance/iso27001/risk-management/risk-register) | ISO 27001 Clause 6.1               | Ryan Ammendolea, CEO | Annual / on material change | ✅ Active |
| `ISMS-REG-002` | **Asset Register**                   | [/docs/compliance/iso27001/operations/asset-register](/docs/compliance/iso27001/operations/asset-register)         | ISO 27001 Clause 8.1 / Annex A 5.9 | Ryan Ammendolea, CEO | Annual                      | ✅ Active |
| `ISMS-REG-003` | **Supplier Security Register**       | [/docs/compliance/iso27001/operations/supplier-register](/docs/compliance/iso27001/operations/supplier-register)   | ISO 27001 Annex A 5.19–5.22        | Ryan Ammendolea, CEO | Annual                      | ✅ Active |
| `ISMS-REG-004` | **Non-Conformity Log**               | [/docs/compliance/iso27001/assurance/nonconformity-log](/docs/compliance/iso27001/assurance/nonconformity-log)     | ISO 27001 Clause 10.2              | Ryan Ammendolea, CEO | Continuous                  | ✅ Active |
| `ISMS-REG-005` | **Corrective Actions Register**      | [/docs/compliance/iso27001/assurance/corrective-actions](/docs/compliance/iso27001/assurance/corrective-actions)   | ISO 27001 Clause 10.1              | Ryan Ammendolea, CEO | Continuous                  | ✅ Active |
| `ISMS-REG-006` | **Statement of Applicability (SoA)** | [/docs/compliance/iso27001/operations/soa](/docs/compliance/iso27001/operations/soa)                               | ISO 27001 Clause 6.1.3             | Ryan Ammendolea, CEO | Annual                      | ✅ Active |
| `ISMS-REG-007` | **Training Records**                 | [/docs/compliance/iso27001/operations/training-records](/docs/compliance/iso27001/operations/training-records)     | ISO 27001 Clause 7.2               | Ryan Ammendolea, CEO | Per onboarding event        | ✅ Active |

---

## Engineering & Governance Registers

_Registers maintained as part of the engineering governance and audit
programme._

| Register ID   | Name               | Location                                                   | Governing Standard             | Owner                  | Review Cadence | Status    |
| :------------ | :----------------- | :--------------------------------------------------------- | :----------------------------- | :--------------------- | :------------- | :-------- |
| `ENG-REG-001` | **Audit Registry** | [/docs/audits/audit-registry](/docs/audits/audit-registry) | PROC-03 / ISO 27001 Clause 9.2 | Engineering Leadership | Per audit      | ✅ Active |

---

## This Register

| Register ID    | Name                      | Location                                                                 | Owner                | Review Cadence                    | Status    |
| :------------- | :------------------------ | :----------------------------------------------------------------------- | :------------------- | :-------------------------------- | :-------- |
| `CORP-REG-001` | **Register of Registers** | [/docs/registers](/docs/registers)                                       | Ryan Ammendolea, CEO | Annual / on new register addition | ✅ Active |
| `CORP-REG-002` | **Standards Register**    | [/docs/registers/standards-register](/docs/registers/standards-register) | Ryan Ammendolea, CEO | Annual / on policy change         | ✅ Active |

---

## Adding a New Register

When a new register is created, the creating agent or team member **must**:

1. Add a row to the appropriate category table above.
2. Assign the next sequential ID in the correct domain prefix series.
3. Link to the new register's Docusaurus page (use the relative `/docs/…` path).
4. Commit this file alongside the new register file in the same PR.

:::tip[Navigation] Looking for all **standards and policies** rather than
registers? See the [Standards Register](/docs/registers/standards-register). :::

---

## Future: Relational Database Migration

As the number of registers grows beyond ~20, or when automated review-date
alerting is required, transitioning to a lightweight Supabase table
(`public.registers`) with a generated Docusaurus page is the recommended path.
This will be evaluated as a formal story item at the next governance review.
