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
| `ISMS-REG-006` | **Statement of Applicability (SoA)** | [/docs/compliance/iso27001/operations/soa](/docs/compliance/iso27001/operations/soa)                               | ISO 27001 Clause 6.1.3(d)          | Ryan Ammendolea, CEO | Annual                      | ✅ Active |
| `ISMS-REG-007` | **Training Records**                 | [/docs/compliance/iso27001/operations/training-records](/docs/compliance/iso27001/operations/training-records)     | ISO 27001 Clause 7.2               | Ryan Ammendolea, CEO | Per onboarding event        | ✅ Active |

---

## Engineering & Governance Registers

_Registers maintained as part of the engineering governance and audit
programme._

| Register ID   | Name               | Location                                                   | Governing Standard             | Owner                  | Review Cadence | Status    |
| :------------ | :----------------- | :--------------------------------------------------------- | :----------------------------- | :--------------------- | :------------- | :-------- |
| `ENG-REG-001` | **Audit Registry** | [/docs/audits/audit-registry](/docs/audits/audit-registry) | PROC-03 / ISO 27001 Clause 9.2 | Engineering Leadership | Per audit      | ✅ Active |
| `ENG-REG-002` | **Governance Database** | `supabase-common-bond` Supabase project (project ref `wbpqompuqeauckdctemj`, region `ap-southeast-2`) | REC-01 (260309-governance-register-infrastructure) | Engineering Leadership | Per migration  | 📅 Planned |

---

## This Register

| Register ID    | Name                      | Location                                                                 | Owner                | Review Cadence                    | Status    |
| :------------- | :------------------------ | :----------------------------------------------------------------------- | :------------------- | :-------------------------------- | :-------- |
| `CORP-REG-001` | **Register of Registers** | [/docs/registers](/docs/registers)                                       | Ryan Ammendolea, CEO | Annual / on new register addition | ✅ Active |
| `CORP-REG-002` | **Standards Register**    | [/docs/registers/standards-register](/docs/registers/standards-register) | Ryan Ammendolea, CEO | Annual / on policy change         | ✅ Active |

---

## Ownership Model (ISO 27001 Clause 5.3)

Per **ISO 27001:2022 Clause 5.3**, governance records require explicit ownership accountability across three distinct roles. All register tables in `supabase-common-bond` enforce these columns (`register_owner`, `information_owner`, `process_owner`).

| Role | Responsibility | Example |
|:-----|:--------------|:--------|
| **Register Owner** | Accountable for the register's existence, scope, and review schedule. Answers _"Who is responsible for maintaining this register?"_ | CEO (Ryan Ammendolea) for all ISMS registers |
| **Information Owner** | Responsible for the accuracy, completeness, and classification of the data within the register. Answers _"Who validates the content?"_ | Same as Register Owner during sole-operator phase; delegates to ISMS Manager as team grows |
| **Process Owner** | Responsible for the operational process that generates or updates register entries. Answers _"Who runs the process that creates these records?"_ | Engineering Leadership for Audit Registry; CEO for Risk Register |

> **Sole-operator note (2026):** During the current size of operations, all three roles are held by the CEO.
> As the team grows, the distinction becomes operationally significant — particularly for certification audits.
> The ownership columns are pre-populated in the database to ensure the structure is correct from day one.

**Reference:** [Roles & Responsibilities](/docs/compliance/iso27001/governance/roles-responsibilities) (ISO 27001 Clause 5.3 RACI)

---

## Live Register Dashboard

A queryable, Supabase-backed version of this index is available at
[registers/registers](/docs/registers/registers). It provides real-time status,
filtering by type and status, and review-due-date visibility across all registers.

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

## Governance Database

As of 2026-03-09, all structured registers are being progressively migrated to
the `supabase-common-bond` Supabase project (`ENG-REG-002`). This project
provides queryable, RLS-protected tables with row-level audit logging — resolving
the queryability, concurrency, and schema enforcement gaps identified in the
`260309-governance-register-infrastructure` audit (`docs/audits/260309-governance-register-infrastructure/audit.md`).

> [!NOTE]
> **SoA classification (ISMS-REG-006):** The Statement of Applicability is an
> ISO 27001 Clause 6.1.3(d) output document — listed here for discoverability.
> It is not a transactional register in the same sense as the Risk Register or
> Asset Register. See `operations/soa.md` for the full control matrix.
