---
title: Record Retention Policy
sidebar_position: 7
---

# Record Retention Policy

**Version:** 1.0 | **Effective Date:** 2026-03-09 | **Next Review:** 2027-03-09\
**Owner:** Ryan Ammendolea, CEO | **Classification:** Internal

---

## 1. Purpose

This policy defines minimum record retention periods and disposition controls
for all governance records maintained by Common Bond Pty Ltd and MyJMO Pty Ltd.
It implements ISO 27001:2022 Clause 7.5.3 (_Control of documented information_)
and ensures alignment with the Australian Privacy Act 1988 obligations for
personal information.

---

## 2. Scope

This policy applies to all governance registers maintained in the
`supabase-common-bond` Supabase project and their equivalent Markdown sources
in the `doco-common-bond` repository. It covers:

- Risk Register (`public.risks`)
- Non-Conformity Log (`public.nonconformities`)
- Corrective Actions Register (`public.corrective_actions`)
- Audit Registry (`public.audits`)
- Training Records (`public.training_records`)
- Asset Register (`public.assets`)
- Supplier Security Register (`public.suppliers`)
- Standards Register (`public.standards`)
- Register of Registers (`public.registers`)

---

## 3. Retention Periods

| Record Type | Minimum Retention Period | Rationale | ISO Clause |
| :--- | :--- | :--- | :--- |
| **Risk Register entries** | 3 years post-closure | Evidence of risk treatment decisions | Clause 7.5.3, 6.1.3 |
| **Non-Conformity Log entries** | 3 years post-closure | Corrective action evidence chain | Clause 10.2 |
| **Corrective Action entries** | 3 years post-closure | Treatment verification evidence | Clause 10.2 |
| **Audit Registry entries** | 5 years | Supports certification renewal cycles (3-year cycles) | Clause 9.2 |
| **Training Records** | Duration of employment + 3 years | Competency evidence for departed staff | Clause 7.2 |
| **Asset Register entries** | 3 years post-decommission | Assists post-incident forensics | Clause 8.1 |
| **Supplier Security Register entries** | 3 years post-offboarding | Evidence of DPA execution and reviews | Annex A 5.19–5.22 |
| **Standards Register entries** | 3 years post-supersession | Controls change management audit trail | Clause 7.5.3 |
| **Register of Registers entries** | Indefinite (unless superseded) | Meta-governance record | Clause 7.5.3 |

---

## 4. Archival Mechanism

### 4.1 Soft Archival (Phase 1 — active)

All governance register tables in `supabase-common-bond` include an
`archived_at TIMESTAMPTZ DEFAULT NULL` column. Records are never deleted during
their active retention window. Archival is performed by:

1. Setting `archived_at = NOW()` on the record.
2. All Docusaurus register components query `v_active_<entity>` views that
   filter `WHERE archived_at IS NULL`, so archived records are automatically
   excluded from live displays.

### 4.2 Hard Disposition (Phase 2 — planned, REC-27)

A `pg_cron` job (`func_enforce_retention_policy()`) will permanently delete rows
that have been soft-archived past their minimum retention period:

```sql
-- Example: delete risks archived more than 3 years ago
DELETE FROM public.risks
WHERE archived_at IS NOT NULL
  AND archived_at < NOW() - INTERVAL '3 years';
```

> [!WARNING]
> Hard disposition executes a permanent `DELETE` and cannot be reversed.
> A manual confirmation gate must be implemented before enabling this job
> in the production Supabase project. The job must not run automatically
> until this gate is documented and approved by the CEO.

---

## 5. Personal Information in Governance Records

Some governance registers contain named individuals (e.g. training records with
`staff_name`, corrective action owners). This creates a tension with Australian
Privacy Act 1988 APP 13 (correction rights) and the technical immutability of
Git commit history.

The [Privacy Policy](./privacy-policy) documents how this tension is managed:
- **In Supabase (post-migration):** Row-level scrubbing can be performed on the
  active record; the row-level audit log retains a change event without the
  personal data.
- **In Git (Markdown source):** Corrections to the latest version are made;
  historical commits are not rewritten (Git history is the ISO 27001 Clause 7.5
  audit trail). This is disclosed per APP 13 exception (correcting data that is
  part of a document management system).

---

## 6. Related Documents

- [Document Control Policy](./document-control): Git/PR workflow as ISMS
  document management; approval requirements.
- [Privacy Policy](./privacy-policy): Personal data in governance records;
  correction rights.
- [Business Continuity Plan](../operations/business-continuity): Section 9 —
  Governance Data Recovery.
- [Register of Registers](../../registers): Authoritative inventory of all
  governance registers covered by this policy.

---

## 7. Review and Approval

| Role | Name | Date |
| :--- | :--- | :--- |
| Author | Ryan Ammendolea | 2026-03-09 |
| Approved | Ryan Ammendolea, CEO | 2026-03-09 |

_Next scheduled review: 2027-03-09_
