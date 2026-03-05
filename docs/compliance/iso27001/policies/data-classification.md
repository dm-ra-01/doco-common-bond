---
title: Data Classification Scheme
sidebar_position: 5
---

# Data Classification Scheme

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## 1. Purpose

This scheme defines how Common Bond classifies, handles, and protects its
information assets. It satisfies the requirements of ISO/IEC 27001:2022 controls
5.12 (Classification of information) and 5.13 (Labelling of information), and
supports compliance with the Australian Privacy Act 1988 (Privacy Act).

## 2. Scope

This scheme applies to all information created, processed, stored, or
transmitted by Common Bond Pty Ltd and MyJMO Pty Ltd, including data held by
third-party suppliers.

## 3. Classification Tiers

Common Bond uses a four-tier classification scheme. The classification ceiling
for current operations is **Confidential** — no information meeting the
Restricted criteria is held at this stage.

### Tier 1: Public

**Definition:** Information that is approved for public release and carries no
risk if disclosed.

**Examples:** Marketing materials, public documentation, product feature
descriptions, open-source code.

**Handling requirements:**

- No access controls required.
- May be shared freely via any channel.
- Must not be labelled with a higher classification.

---

### Tier 2: Internal

**Definition:** Information intended for internal use that could cause minor
operational inconvenience if disclosed but poses no significant harm.

**Examples:** Internal process documentation, non-sensitive meeting notes,
general business correspondence, staff directories.

**Handling requirements:**

- Stored in Google Workspace or the GitHub organisation (access-controlled by
  role).
- Not to be shared publicly or with unauthorised third parties.
- Transmitted via encrypted channels (Google Workspace, GitHub).

---

### Tier 3: Confidential ← Current ceiling

**Definition:** Information whose unauthorised disclosure could cause
significant harm to individuals, the business, or its clients. Most personal
information held by Common Bond falls in this tier.

**Examples:**

| Type                       | Description                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Workforce Admin PII        | First name, last name, email address, telephone number of healthcare organisation staff.                                        |
| Worker PII                 | First name, last name, email address, telephone number, work preferences, and company rotation allocations of clinical workers. |
| Authentication credentials | API keys, service account secrets, database connection strings.                                                                 |
| Commercial information     | Pricing, contracts, unreleased product roadmaps.                                                                                |

::: warning[Privacy Act Classification]

All personal information held by Common Bond (Workforce Admin PII and Worker
PII) is classified as Confidential at minimum, consistent with Australian
Privacy Principle 11 (APP 11) requirements for security of personal information.

:::

**Handling requirements:**

- Stored only in approved, access-controlled systems (Supabase, Google
  Workspace). No storage in personal accounts or unapproved cloud services.
- Access granted on a least-privilege basis per the Access Control Policy.
- Encrypted in transit (TLS) and at rest (Supabase encryption at rest).
- Not transmitted via unencrypted channels (e.g., unencrypted email).
- Third-party access requires a supplier agreement or Data Processing Agreement
  (see Supplier Security Register).
- Incidents involving potential disclosure must be reported immediately under
  the Incident Response Plan.

---

### Tier 4: Restricted

**Definition:** Highly sensitive information whose unauthorised disclosure could
cause severe harm — including legal liability, regulatory sanction, or
irreversible reputational damage.

**Examples (not currently held):** Health records (My Health Record data),
financial account numbers, legal privilege documents.

**Handling requirements:**

- Would require end-to-end encryption, strict need-to-know access, and explicit
  CEO approval for any access grants.
- Not currently applicable to Common Bond operations.

---

## 4. Labelling

Documents containing Confidential information must be labelled
**[CONFIDENTIAL]** in the document title or header where practicable.
System-held data (database records) is classified by table at the schema level
via Supabase Row Level Security policies — individual row labelling is not
required.

## 5. Responsibilities

| Role        | Responsibility                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| Founder/CEO | Approves this scheme; responsible for classification of commercial information.                                     |
| CTO/ISM     | Maintains this scheme; classifies technical assets.                                                                 |
| All Staff   | Must apply classification correctly when creating or handling information. Must report suspected misclassification. |

## 6. Review

This scheme is reviewed annually or when new data types are introduced to
operations. The Information Security Manager initiates each review.
