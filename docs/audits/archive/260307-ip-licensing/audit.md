---
title: IP Ownership & Licensing Audit
sidebar_label: IP Licensing Audit
sidebar_position: 1
---

# IP Ownership & Licensing Ecosystem Audit

**Date:** 2026-03-07\
**Scope:** All repositories — ecosystem-wide IP attribution and licensing\
**Auditor:** Ryan Ammendolea\
**Standard:** N/A (governance / legal baseline)

---

## Executive Summary

This audit examines how intellectual property ownership and licensing is
documented across the Common Bond / Receptor ecosystem. The IP owner of the
entire Receptor platform is **MyJMO Pty Ltd (ABN 50 648 051 852)**. Common Bond
Pty Ltd (ACN 694 840 394) operates as the exclusive commercial licensee. At the
time of audit, **no formal licensing agreement exists** between the two
entities, no project-level `LICENSE` files exist in any repository, and IP
attribution in existing documentation is incomplete or absent. 14 findings are
documented across 7 categories.

| Repository / Area                               | Coverage | Issues Found | Overall            |
| :---------------------------------------------- | :------- | :----------- | :----------------- |
| All repositories — project-level LICENSE files  | ❌       | 1            | ❌ Missing         |
| Root `README.md` and sub-repo READMEs           | ⚠️       | 2            | ⚠️ Incomplete      |
| `documentation/common-bond/docs/governance/`    | ⚠️       | 3            | ⚠️ Incomplete      |
| `asic-registration.md`                          | ❌       | 1            | ❌ Incorrect ACN   |
| Non-exclusive/prior licence arrangement         | ❌       | 1            | ❌ Not documented  |
| Repository headers / copyright notices          | ❌       | 2            | ❌ Absent          |
| Data processing agreement between entities      | ❌       | 1            | ❌ Not documented  |
| Trade mark registration for "Common Bond" brand | ⚠️       | 1            | ⚠️ Not registered  |
| GitHub repositories on personal account         | ❌       | 1            | ❌ Governance risk |
| No End-User Licence Agreement for hospitals     | ❌       | 1            | ❌ Product blocker |
| IP risks absent from risk register              | ❌       | 1            | ❌ Not documented  |

---

## 1. Cross-Cutting: Project-Level LICENSE Files

### 1.1 Absence of LICENSE Files

**Gaps:**

- No project-level `LICENSE` or `LICENCE` file exists in any of the following
  repositories: `supabase-receptor`, `match-backend`, `planner-backend`,
  `planner-frontend`, `preference-frontend`, `workforce-frontend`,
  `website-frontend`, `rotator_worker`, `doco-common-bond`. Only `node_modules`
  and `venv` third-party dependency licences are present.
- Without a root `LICENSE` file, GitHub and other tooling display repositories
  as having "No licence", which misrepresents the IP status and creates
  ambiguity for anyone accessing the codebase.

---

## 2. Root Environment `README.md`

### 2.1 Incomplete IP Attribution

**Gaps:**

- `README.md` (line 201) states: _"This project is proprietary to Common Bond.
  All rights reserved."_ This is factually incomplete — Common Bond Pty Ltd is
  the exclusive licensee, not the IP owner. The IP owner is MyJMO Pty Ltd (ABN
  50 648 051 852). The current statement could be construed as a claim of
  ownership by Common Bond Pty Ltd.

---

## 3. Governance Documentation

### 3.1 No Licensing Agreement

**Gaps:**

- No licensing agreement between MyJMO Pty Ltd and Common Bond Pty Ltd exists in
  any location within the ecosystem (searched all `docs/governance/`, all
  repository roots, and all documentation sites). The relationship is described
  informally in `.llm-context.md` as _"Common Bond — Parent organization (MyJMO
  Pty Ltd)"_ but no formal agreement has been prepared or signed.

### 3.2 No IP Ownership Register

**Gaps:**

- The `docs/governance/` section contains ASIC registration, decision rights,
  risk management, and ethics documents, but no IP ownership register exists.
  There is no single document that identifies what IP MyJMO Pty Ltd owns, what
  it has licensed to Common Bond Pty Ltd, and on what terms.

### 3.3 Governance Index Does Not Reference IP/Licensing

**Gaps:**

- `docs/governance/index.md` does not list any IP or licensing documentation
  under "Corporate Foundation". The governance index is the landing page for
  legal and compliance readers; the absence of an IP section creates a
  discoverability gap.

### 3.4 Incorrect ACN in `asic-registration.md`

**Gaps:**

- `docs/governance/asic-registration.md` (line 9) records Common Bond Pty Ltd's
  ACN as **674 840 394**. The correct ACN supplied by the user is **694 840
  394**. This is a transposed digit error in a foundation legal document.

---

## 4. Repository-Level Copyright Notices

### 4.1 No Copyright Headers in Source Files

**Gaps:**

- Spot-check of source files across `planner-frontend/src/`,
  `match-backend/allocator/`, and `supabase-receptor/supabase/` confirms no
  copyright notice or proprietary header is present in any source file. There is
  no baseline attribution of authorship or ownership at the source-code level.

### 4.2 No NOTICE or AUTHORS file

**Gaps:**

- None of the repositories contain a `NOTICE` or `AUTHORS` file that would
  document the IP origin, development history, or attribution chain from MyJMO
  Pty Ltd.

---

## 5. Prior Licensing Arrangement

### 5.1 Prior Non-Exclusive Licence Not Documented

**Gaps:**

- The user has confirmed that a prior non-exclusive licence of the Software was
  issued to a third-party entity under invoice-based terms. This arrangement is
  not recorded anywhere in the ecosystem's documentation, governance records, or
  version history. The absence of this record means the prior licensee's rights
  and obligations are not discoverable from the repository.

---

## 6. Trade Mark and Branding

### 6.1 Common Bond Trade Mark Not Registered

**Gaps:**

- ASIC company name registration for "Common Bond Pty Ltd" does not constitute a
  registered trade mark. IP Australia records confirm no trade mark has been
  searched or applied for under the _Trade Marks Act 1995_ (Cth) for "Common
  Bond" or the Receptor platform name. Any party could potentially register
  "Common Bond" as a trade mark for competing services without restriction.
- "Receptor" is currently used as a codename and may change. No trade mark
  protection is required for "Receptor" at this stage per the user's direction.

---

## 7. Data Processing and Inter-Entity Obligations

### 7.1 No Data Processing Agreement Between MyJMO and Common Bond

**Gaps:**

- The licence agreement covers IP rights but does not address data handling
  obligations between MyJMO Pty Ltd and Common Bond Pty Ltd. Where one entity
  processes Personal Information on behalf of the other (e.g. in a
  sub-processing capacity for healthcare workforce data), the _Privacy Act 1988_
  (Cth) and the Australian Privacy Principles may require a Data Processing
  Agreement (DPA) or equivalent contractual protections.

---

## 8. Repository Governance

### 8.1 GitHub Repositories Hosted on Personal Account

**Gaps:**

- All 9 ecosystem repositories are hosted under `dm-ra-01`, a personal GitHub
  account. A personal account creates an organisational governance risk: if
  access to the account is compromised or the account holder changes roles,
  repository access and administrative rights over MyJMO's IP assets would be at
  risk.
- There is no GitHub Organisation registered to either MyJMO Pty Ltd or Common
  Bond Pty Ltd that would provide centralised access management, billing, and
  audit logging independent of any individual.
- The decision is approved to migrate to a GitHub Organisation under **Common
  Bond Pty Ltd** (which holds and manages the source code), while **MyJMO Pty
  Ltd retains IP ownership** as documented in the licence agreement.

---

## 9. Product Release Blockers

### 9.1 No End-User Licence Agreement for Hospital Customers

**Gaps:**

- The MyJMO–Common Bond licence agreement authorises Common Bond Pty Ltd to
  sub-license the Software to hospital End Users, but no End-User Licence
  Agreement (EULA) or Terms of Service (ToS) has been drafted for those hospital
  customers. This means hospitals currently have no documented licence from
  Common Bond and are operating without the IP protections the licence agreement
  requires to be passed downstream.
- Absence of a EULA/ToS is a **product release blocker** — the platform cannot
  be commercially released to new hospital customers without it.

---

## 10. Governance Risk Register

### 10.1 IP Risks Absent from Risk Register

**Gaps:**

- `docs/governance/risk-management.md` covers data privacy and clinical risk but
  contains no IP-specific risk category. IP risks such as trade mark squatting,
  open source licence violations, GitHub account loss, and AI authorship
  uncertainty are not documented as managed risks.

---

## Severity Summary

| Finding ID | Area             | File                                 | Category          | Severity    |
| :--------- | :--------------- | :----------------------------------- | :---------------- | :---------- |
| IP-001     | All repositories | —                                    | Process Gap       | 🔴 Critical |
| IP-002     | Governance       | `docs/governance/legal/`             | Process Gap       | 🔴 Critical |
| IP-012     | GitHub / Hosting | `dm-ra-01` personal account          | Process Gap       | 🔴 Critical |
| IP-013     | Product          | —                                    | Compliance        | 🟠 High     |
| IP-003     | Root README      | `README.md`                          | Compliance        | 🟠 High     |
| IP-004     | Governance       | `asic-registration.md`               | Compliance        | 🟠 High     |
| IP-005     | Governance       | `docs/governance/index.md`           | Documentation Gap | 🟡 Medium   |
| IP-006     | Governance       | `docs/governance/`                   | Process Gap       | 🟡 Medium   |
| IP-007     | All repositories | Source files                         | Compliance        | 🟡 Medium   |
| IP-009     | Governance       | —                                    | Process Gap       | 🟡 Medium   |
| IP-010     | Governance       | —                                    | Compliance        | 🟡 Medium   |
| IP-011     | Governance       | —                                    | Process Gap       | 🟡 Medium   |
| IP-014     | Governance       | `docs/governance/risk-management.md` | Documentation Gap | 🟡 Medium   |
| IP-008     | All repositories | —                                    | Documentation Gap | 🟢 Low      |
