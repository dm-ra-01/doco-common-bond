---
title: Standards Register
sidebar_position: 2
---

# Standards Register

> **CORP-REG-002 Implementation.** This register is the authoritative index of
> all named standards, policies, procedures, and guidelines in force across
> Common Bond Pty Ltd and MyJMO Pty Ltd — covering both the ISMS and
> engineering/operational governance. It fulfils the ISO 27001:2022 Clause 7.5
> ("documented information control") requirement for a current list of
> controlled documents.

**Last Updated:** 2026-03-09 | **Owner:** Ryan Ammendolea, CEO | **Next
Review:** 2027-03-01

---

## How to Read This Register

| Column             | Meaning                                                                                                            |
| :----------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Standard ID**    | Domain-prefixed identifier: `ISMS-STD-NNN` (ISMS), `ENG-STD-NNN` (Engineering), `REF-STD-NNN` (External Reference) |
| **Title**          | Full name of the document                                                                                          |
| **Type**           | `Policy` · `Procedure` · `Standard` · `Guideline` · `Framework`                                                    |
| **Scope**          | Who / what it applies to                                                                                           |
| **Owner**          | Accountable individual or role                                                                                     |
| **Effective Date** | When the document came into force                                                                                  |
| **Next Review**    | Scheduled review date                                                                                              |
| **Status**         | `✅ Active` · `🔄 Draft` · `📅 Planned` · `⚠️ Needs Review` · `🗄️ Superseded`                                      |
| **Location**       | Docusaurus link or external reference                                                                              |

---

## ISMS Policies

_Governing rules that all staff and contractors must follow. Require CEO
sign-off. ISO 27001 Clause 5.2, 7.5._

| Standard ID    | Title                       | Type   | Scope                           | Owner                | Effective Date | Next Review | Status    | Location                                                               |
| :------------- | :-------------------------- | :----- | :------------------------------ | :------------------- | :------------- | :---------- | :-------- | :--------------------------------------------------------------------- |
| `ISMS-STD-001` | Information Security Policy | Policy | All staff, contractors, systems | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/information-security-policy) |
| `ISMS-STD-002` | Acceptable Use Policy (AUP) | Policy | All staff, contractors          | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/acceptable-use)              |
| `ISMS-STD-003` | Access Control Policy       | Policy | All systems, administrators     | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/access-control)              |
| `ISMS-STD-004` | Data Classification Scheme  | Policy | All information assets          | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/data-classification)         |
| `ISMS-STD-005` | Document Control Policy     | Policy | All ISMS documentation          | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/policies/document-control)            |

---

## ISMS Procedures & Operational Documents

_Records and procedures evidencing day-to-day ISMS operation. ISO 27001 Clauses
7–10, Annex A._

| Standard ID    | Title                        | Type      | Scope                | Owner                | Effective Date | Next Review | Status    | Location                                                         |
| :------------- | :--------------------------- | :-------- | :------------------- | :------------------- | :------------- | :---------- | :-------- | :--------------------------------------------------------------- |
| `ISMS-STD-010` | Risk Methodology             | Procedure | ISMS risk management | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/risk-management/methodology)    |
| `ISMS-STD-011` | Risk Treatment Plan          | Procedure | ISMS risk management | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/risk-management/treatment-plan) |
| `ISMS-STD-012` | Incident Response Plan       | Procedure | All systems, staff   | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/operations/incident-response)   |
| `ISMS-STD-013` | Business Continuity Plan     | Procedure | Critical services    | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/operations/business-continuity) |
| `ISMS-STD-014` | Internal Audit Procedure     | Procedure | ISMS assurance       | Ryan Ammendolea, CEO | 2026-03-05     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/assurance/internal-audit)       |
| `ISMS-STD-015` | Training & Competency Policy | Policy    | All staff            | Ryan Ammendolea, CEO | 2026-03-07     | 2027-03-01  | ✅ Active | [Link](/docs/compliance/iso27001/operations/training-competency) |

---

## Engineering Standards

_Technical standards governing how the Receptor platform is built, tested,
audited, and deployed. Maintained by Engineering Leadership._

| Standard ID   | Title                            | Type     | Scope                                                           | Owner                  | Effective Date | Next Review | Status    | Location                                                           |
| :------------ | :------------------------------- | :------- | :-------------------------------------------------------------- | :--------------------- | :------------- | :---------- | :-------- | :----------------------------------------------------------------- |
| `ENG-STD-001` | Frontend Engineering Standards   | Standard | All frontend repositories                                       | Ryan Ammendolea, CEO   | 2026-03-06     | 2027-03-01  | ✅ Active | [Link](/docs/engineering/frontend-standards-overview)              |
| `ENG-STD-002` | Supabase Database Standards      | Standard | `supabase-receptor`, all migrations                             | Ryan Ammendolea, CEO   | 2026-03-04     | 2027-03-01  | ✅ Active | Agent memory: `supabase-standards.md`                              |
| `ENG-STD-003` | Audit Workflow Standard          | Standard | All technical audits                                            | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/audit-document-standards/`         |
| `ENG-STD-004` | Git Workflow Standard            | Standard | All repositories                                                | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/workflows/git-workflow.md`                |
| `ENG-STD-005` | Audit Registry Standard          | Standard | All audits                                                      | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/audit-registry/`                   |
| `ENG-STD-006` | Audit Verification Gates         | Standard | Audit implementation                                            | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/audit-verification-gates/`         |
| `ENG-STD-007` | Next.js App Router Patterns      | Standard | `planner-frontend`, `workforce-frontend`, `preference-frontend` | Engineering Leadership | 2026-03-06     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/nextjs-app-router-patterns/`       |
| `ENG-STD-008` | Playwright Testing Standard      | Standard | All frontend E2E test suites                                    | Engineering Leadership | 2026-03-07     | 2027-03-01  | ✅ Active | `dev-environment/.agents/skills/playwright-best-practices/`        |
| `ENG-STD-009` | Python Design Patterns Standard  | Standard | `backend/receptor-planner`, `backend/match-backend`             | Engineering Leadership | 2026-03-05     | 2027-03-01  | ✅ Active | `backend/receptor-planner/.agents/skills/python-design-patterns/`  |
| `ENG-STD-010` | Python Testing Patterns Standard | Standard | `backend/receptor-planner`, `backend/match-backend`             | Engineering Leadership | 2026-03-05     | 2027-03-01  | ✅ Active | `backend/receptor-planner/.agents/skills/python-testing-patterns/` |

---

## Referenced External Frameworks

_External standards and regulations that Common Bond is required or committed to
comply with. These are not owned by Common Bond but govern the ISMS and
engineering practices._

| Standard ID   | Title                                  | Type       | Issuing Body          | Scope                                               | Relevance                             | Status    |
| :------------ | :------------------------------------- | :--------- | :-------------------- | :-------------------------------------------------- | :------------------------------------ | :-------- |
| `REF-STD-001` | ISO/IEC 27001:2022                     | Framework  | ISO / IEC             | ISMS — all clauses up to 10.2 + 93 Annex A controls | Primary ISMS certification target     | ✅ Active |
| `REF-STD-002` | Australian Privacy Act 1988 (Cth)      | Regulation | Australian Parliament | All personal information holdings                   | Privacy obligations; APPs 1–13        | ✅ Active |
| `REF-STD-003` | Australian Privacy Principles (APPs)   | Regulation | OAIC                  | All personal information processing                 | Binding data handling rules           | ✅ Active |
| `REF-STD-004` | ASD Essential Eight (Feb 2025)         | Framework  | ASD / ACSC            | All infrastructure and development                  | Baseline cybersecurity maturity model | ✅ Active |
| `REF-STD-005` | Notifiable Data Breaches (NDB) Scheme  | Regulation | OAIC                  | All systems holding personal information            | Mandatory breach notification         | ✅ Active |
| `REF-STD-006` | OAIC AI Regulatory Guidance (Oct 2024) | Guideline  | OAIC                  | AI-assisted workflows (Antigravity)                 | APP compliance for AI tool usage      | ✅ Active |

---

## Adding a New Standard

When a new policy, procedure, or standard is created or formally adopted:

1. Assign the next sequential ID in the correct domain prefix series.
2. Add a row to the appropriate section table above with all columns populated.
3. Update the **Last Updated** header at the top of this document.
4. Commit this file in the same PR as the new document.

:::tip[Related Registers] See the [Register of Registers](/docs/registers) for
the full inventory of all registers maintained by Common Bond. See the
[ISMS Overview](/docs/compliance/iso27001) for the full ISMS structure. :::
