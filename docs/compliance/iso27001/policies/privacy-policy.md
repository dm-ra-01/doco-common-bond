---
title: Privacy Policy
sidebar_position: 6
---

# Privacy Policy

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | 2026-03-09     | Ryan Ammendolea, CEO | 2027-03-09  |

## 1. Purpose

This Privacy Policy describes how Common Bond Pty Ltd (ABN 40 678 717 699)
collects, holds, uses, and discloses personal information in accordance with the
_Privacy Act 1988_ (Cth) and the Australian Privacy Principles (APPs).

This policy applies to all personal information handled by Common Bond in
connection with the Receptor platform and related governance operations.

---

## 2. Scope

This policy applies to:

- **Clients and their staff** — hospitals, health services, and their employees
  who use the Receptor platform
- **Workers** — agency staff, contractors, and casual employees whose details
  are managed through the Receptor system
- **Employees** — Common Bond staff and contractors
- **Suppliers** — third-party vendors whose representatives appear in supplier
  registers

---

## 3. Types of Personal Information Collected

| Category | Examples | Basis |
| :------- | :------- | :---- |
| Identity | Name, employee ID, role | Contract / legitimate interest |
| Contact | Email address | Contract |
| Employment | Training completion dates, rotation assignments | Contract |
| Governance records | Name as record owner, approver, or NC/CA responsible party | Legal obligation (ISO 27001 Clause 7.5) |

---

## 4. How We Collect Personal Information

We collect personal information directly from individuals (e.g. during
onboarding) or from their employer organisation (hospital or health service)
under an existing services agreement or data processing agreement.

---

## 5. How We Use Personal Information

Personal information is used for:

- Providing and administering the Receptor workforce management platform
- Complying with ISO 27001 certification obligations (governance records)
- Training, access control, and audit trail requirements
- Communicating with clients, workers, and suppliers about service delivery

---

## 6. Disclosure of Personal Information

We do not sell personal information. We may disclose personal information to:

- **Sub-processors** listed in the Supplier Register who process data on our
  behalf (e.g. Supabase, Google Workspace, Sentry)
- **Regulators** where required by law
- **Authorised third parties** where explicit consent has been provided

All sub-processors are required to maintain appropriate security measures
consistent with our data classification scheme.

---

## 7. Cross-Border Disclosure

Some personal information may be processed by sub-processors whose
infrastructure is located outside Australia. Where this occurs, we take
reasonable steps to ensure the overseas recipient handles information in a
manner consistent with the APPs (APP 8.1 exception: contractual commitment).

Current cross-border disclosures are documented in the Supplier Register.

---

## 8. Personal Data in Governance Records

> [!IMPORTANT]
> This section addresses the specific intersection between ISO 27001 governance
> obligations and Privacy Act APP 12/13 correction rights. This is a known
> tension acknowledged in the 260309-governance-register-infrastructure audit.

### 8.1 Named Individuals in Governance Records

Governance registers (including the Risk Register, NC Log, Corrective Actions
Register, Training Records, and Audit Registry) may contain named individuals'
personal data in the following contexts:

- **Risk Register:** Risk owner (role-based references preferred; personal name
  used only where role is sole-occupant)
- **NC/CA Register:** NC responsible party, CA owner (role-based references
  preferred)
- **Training Records:** Staff member name and employee ID (functionally
  required — cannot be replaced by role reference)
- **Supplier Register:** Named DPA signatories and contacts (functionally
  required)

### 8.2 Correction Rights (APP 13) — Pre-Migration State

> [!WARNING]
> Prior to the `supabase-common-bond` migration (REC-01 of the
> 260309-governance-register-infrastructure audit):
>
> - Governance records are stored in Git-tracked Markdown files
> - Git history is immutable — correction requests **cannot be applied
>   retroactively** to Git history without rewriting repository history (which
>   would breach ISO 27001 Clause 7.5.3 audit trail integrity)
> - Where an individual requests correction under APP 13, the register entry
>   will be **updated in the latest committed version** of the file, with a
>   note referencing the correction date
> - Historic Git commits will retain the original data; this is disclosed to the
>   individual as part of handling their APP 13 request

### 8.3 Correction Rights (APP 13) — Post-Migration State

After migration to `supabase-common-bond`:

- Row-level scrubbing will be performed on request (UPDATE or DELETE of the
  specific field)
- The row-level audit log (`register_audit_log`) will retain the **change
  event** (old\_row → new\_row) but the personal data within the old\_row field
  will be redacted at the time of correction
- Individuals should submit correction requests to the address in Section 11

### 8.4 Minimisation Principle

Common Bond applies the data minimisation principle to governance records:

- Role-based references (e.g. "CEO", "Operations Lead") are used in preference
  to personal names wherever the record function is satisfied by the role alone
- `data_subject_name` columns are only present in table schemas where
  functionally required (training records, NC/CA owners)
- All other free-text name references are replaced with role-based references
  during the Supabase migration phase

---

## 9. Security of Personal Information

We implement the following controls to protect personal information:

- All data at rest is encrypted via Supabase managed encryption (AES-256)
- Access is restricted by Cloudflare Zero Trust (network gate) and Supabase
  RLS (database gate)
- Staff access follows the least-privilege principle defined in the Access
  Control Policy
- Sensitive columns in governance registers are restricted to management role
  via RLS (REC-21)

---

## 10. Retention and Disposal

Retention periods for governance records containing personal information:

| Record type | Retention period | Basis |
| :---------- | :--------------- | :---- |
| Training records | Duration of employment + 3 years | ISO 27001 Clause 7.5.3 |
| NC/CA records | 3 years post-closure | ISO 27001 Clause 7.5.3 |
| Risk Register | 3 years post-closure | ISO 27001 Clause 7.5.3 |
| Audit Registry | 5 years | Certification renewal cycle |

Records are disposed of via the `func_enforce_retention_policy()` Postgres
function (once implemented per REC-27) or manual deletion from the database.

---

## 11. Contact and Complaints

For privacy enquiries, correction requests (APP 13), or access requests (APP 12):

**Ryan Ammendolea, Founder/CEO**  
Common Bond Pty Ltd  
Email: ryan@commonbond.au

If you are not satisfied with our handling of your request, you may lodge a
complaint with the Office of the Australian Information Commissioner (OAIC) at
[oaic.gov.au](https://www.oaic.gov.au).

---

## 12. Policy Review

This policy is reviewed annually. Material changes are communicated to affected
individuals via our standard notification channels.
