# ISO 27001 Documentation Audit — Pre-Review Readiness

**Date:** 2026-03-05\
**Scope:** `docs/compliance/iso27001/` — all sections: governance, policies,
risk-management, operations, assurance\
**Auditor:** Antigravity\
**Purpose:** Assess readiness for external pre-certification review. Identify
gaps, incomplete content, and structural issues that an auditor would flag.

---

## Executive Summary

The ISO 27001 documentation set is a well-structured skeleton that correctly
maps to the standard's clause structure. The individual documents demonstrate a
clear understanding of the standard and a sensible approach for a pre-revenue,
cloud-native startup. However, the documentation has not yet been filled in by
people — it remains in a **template/draft state** and is not ready to be placed
in front of an external reviewer. The critical issues centre on: unfilled
placeholder fields, incomplete operational records, a Risk Register and SoA that
reference external-only working documents, and several documents containing
unchecked checklist items that signal outstanding work, not completed
activities.

| Section            | Coverage | Readability | Regulatory Accuracy | Metadata | Overall |
| ------------------ | -------- | ----------- | ------------------- | -------- | ------- |
| `governance/`      | ✅       | ✅          | ✅                  | ✅       | ✅      |
| `policies/`        | ⚠️       | ✅          | ✅                  | ✅       | ⚠️      |
| `risk-management/` | ⚠️       | ✅          | ✅                  | ✅       | ⚠️      |
| `operations/`      | ⚠️       | ✅          | ✅                  | ✅       | ⚠️      |
| `assurance/`       | ✅       | ✅          | ✅                  | ✅       | ✅      |

---

## 1. `governance/` — ISMS Scope, Objectives, Roles

### 1.1 `scope.md`

**Strengths:**

- Well-structured with clear in-scope / out-of-scope delineation.
- Interested parties table is complete and practical.
- Regulatory reference to Privacy Act 1988 is accurate.

**Gaps:**

- Line 21: States "preparing for ISO 27001 certification" — acceptable for a
  scope statement but implies this is not yet signed/approved. An auditor will
  ask for a management-approved version with a date and signature.
- There is no version number, effective date, or approval signature block on
  this (or any) policy/procedural document. ISO 27001 Clause 7.5.2 requires
  documented information to carry identification (version), format/media,
  suitability for purposes, and protection/access.

### 1.2 `objectives.md`

**Strengths:**

- Objectives are SMART-adjacent (measurable, with targets).
- Objective 1 references "[Target Date]" which is honest about the state.

**Gaps:**

- `objectives.md` Line 15: **`[Target Date]`** is an unfilled placeholder. An
  auditor reviewing this document will immediately note it as incomplete.
- Objective 2, line 20: "**Metric:** Critical vulnerabilities in production." —
  sentence is incomplete; the metric as written is a noun phrase, not a
  measurable statement. It appears to be missing the word "count of" or similar.
- No record of these objectives ever being reviewed or approved by management.
  They require a logged management decision to be evidential.

### 1.3 `roles-responsibilities.md`

**Strengths:**

- Three-tier structure (CEO, CTO/ISM, All Staff) is appropriate and correct.
- Contact email (`security@commonbond.au`) is concrete and verifiable.

**Gaps:**

- Role assignments do not name the CEO (only "Founder/CEO"). For a pre-review
  audit, the auditor will want to see named individuals assigned to each role to
  verify accountability.
- No documented formal ISMS appointment — ISO 27001 Clause 5.3 requires that the
  authority be **formally assigned and communicated**. A simple email or board
  minute is sufficient, but the document should reference where that evidence
  lives.

---

## 2. `policies/` — Information Security Policy, AUP, Access Control, Document Control

### 2.1 `information-security-policy.md`

**Strengths:**

- Clear purpose, policy statement, core principles, and responsibilities
  covering the three tiers.
- References CIA triad correctly.

**Gaps:**

- Line 16: `"ensuring"` is lowercase mid-bullet-list — minor typographical
  inconsistency, but signals draft quality.
- No **version number, effective date, or approval block**. ISO 27001 Clause 5.2
  requires the policy to be available as documented information; it must be
  clearly approved by top management. An unsigned, undated policy is an
  automatic non-conformity.
- The policy does not state a **review frequency** or who is responsible for its
  review. ISO 27001 requires ongoing maintenance.
- No **distribution statement** (i.e., "This policy must be communicated to all
  interested parties" — Clause 5.2 c).

### 2.2 `acceptable-use.md`

**Strengths:**

- Device, password, data handling, and reporting requirements are concrete and
  actionable.
- MFA and full-disk encryption requirements are specific.

**Gaps:**

- No version number, effective date, or sign-off block.
- Section 4.1: MFA requirement is listed without stating what the enforcement
  mechanism is for contractors who may not use Google/GitHub accounts. This may
  be acceptable at this stage but is a gap for the auditor.
- No mention of **consequences for non-compliance** (unlike
  `information-security-policy.md` which contains Section 5 on this). Internally
  inconsistent.

### 2.3 `access-control.md`

**Strengths:**

- Least privilege principle clearly stated.
- Technical controls reference specific tooling (Supabase RLS, GitHub Teams,
  Cloudflare Zero Trust).

**Gaps:**

- Line 19: `"ensuring they are still appropriate"` — typographical error
  (`ensuring` should be `ensure`). Signals draft-quality.
- Section 2.5: States "Application service keys are rotated if compromised" —
  this is reactive, not proactive. Periodic key rotation is generally expected.
- No version number, effective date, or approval sign-off.
- Section 2.1 states access is revoked "within 24 hours" but there is no
  reference to a supporting **offboarding checklist** (referenced as a gap in
  `tasks.md` item #15).

### 2.4 `document-control.md`

**Strengths:**

- Git/PR workflow as ISMS document control is technically sound and
  well-articulated.
- Correctly identifies who must approve changes.

**Gaps:**

- Line 20: `"Git provide"` — grammatical error (`provide` should be `provides`).
  Signals draft quality.
- The policy references PRs for ISMS documents requiring "review and approval by
  the Information Security Manager (or delegate)" but does not specify the
  **review cadence** (annual review is mentioned in section 2.3 but not linked
  to a management review schedule).
- No version number or effective date.

---

## 3. `risk-management/` — Methodology, Risk Register, Treatment Plan

### 3.1 `methodology.md`

**Strengths:**

- 4-option treatment taxonomy (Reduce/Avoid/Transfer/Accept) is correct per
  ISO 27001.
- Qualitative likelihood × impact approach is appropriate for this stage.
- CEO approval requirement for risk acceptance is correct and present.

**Gaps:**

- No formal **risk criteria** defined (ISO 27001 Clause 6.1.2 a requires risk
  acceptance criteria to be established). What is the threshold between
  acceptable and unacceptable risk? The document describes a 3×3 matrix but does
  not state which cells are "acceptable" and which require escalation.
- There is no **asset register** referenced or linked. The methodology
  identifies asset classes but the actual asset register is listed as a Phase 1
  outstanding task in `tasks.md` (#8). An auditor will require evidence the
  asset register exists.

### 3.2 `risk-register.md`

**Strengths:**

- 5 risks documented with treatment strategies and statuses.
- "Implemented" vs "Ongoing" status distinction is useful.

**Gaps:**

- Line 8:
  `> **Note:** This is a snapshot... The active register is maintained in a secure spreadsheet/tool accessible by the Security Team.`
  — The active register is **not linked**. The link placeholder on line 21 reads
  `[Link to Secure Risk Register (Internal Only)]` — this is an unfilled
  placeholder. An auditor needs to be told where evidence is, even if they
  cannot access it publicly.
- **Only 5 risks documented.** For a SaaS healthcare-adjacent platform, a
  pre-review auditor will expect broader coverage: supply chain risk, regulatory
  breach risk (Privacy Act), third-party/supplier risk, key person risk (R-006
  appears in the treatment plan but not in the risk register — an
  inconsistency).
- Risk R-006 ("Key Person Risk") is referenced in `treatment-plan.md` but does
  not exist in the Risk Register. This is an **internal inconsistency**.
- No **risk owner** column in the register (ISO 27001 Clause 6.1.2 c requires
  owners).

### 3.3 `treatment-plan.md`

**Strengths:**

- Active vs completed treatment distinction is clear.
- Due dates are specified (Q3/Q4 2026).

**Gaps:**

- R-006 references a risk ID not present in the Risk Register (see DOC-13
  above).
- Due dates are present but there is no **evidence of review** or last-reviewed
  date. The plan looks like it was written once and not revisited.
- Completed treatments use checkboxes but provide no **verification date** for
  "Enforce MFA" — just "[x]". An auditor needs a date.

---

## 4. `operations/` — SoA, Training & Competency

### 4.1 `soa.md`

**Strengths:**

- Correct structure. Identifies total controls, excluded, implemented, and
  planned.
- Exclusion justifications (physical security) are correct for a remote company.

**Gaps:**

- Line 32:
  `The detailed line-by-line assessment is maintained in an internal spreadsheet: 'SA 1 - Statement of Applicability.xlsx'.`
  — The SoA is the **single most important document** an ISO 27001 auditor will
  request. It must be complete and accessible (at minimum, a summary in the
  documentation). Pointing to an external spreadsheet with no link, no date, and
  no version number is insufficient.
- The "Lite" approach is explained in prose but provides no structured table. An
  auditor expects a table listing each applicable Annex A control, its
  applicability (Yes/No), a justification, and implementation status. This is a
  **critical gap** for a pre-review stage.
- Only 3 included controls and 3 excluded controls are justified inline. The
  remaining ~87 controls have no inline coverage.

### 4.2 `training-competency.md`

**Strengths:**

- Onboarding checklist structure is correct.
- Competency matrix with real names and dates (Q1 2026) is excellent evidence.

**Gaps:**

- Lines 13–15: Onboarding checklist items are **unchecked** (`- [ ]`). These
  unchecked boxes signal that the template has not been instantiated as an
  actual record. This document appears to be simultaneously a policy template
  and a record — they should be separated.
- "Dev 1" in the competency matrix is a placeholder name. For a real audit, all
  personnel must be named. Placeholder names in evidence documents will raise
  credibility concerns.
- CISSP is noted as "(Expired)" for the CTO. An auditor may note this as an
  observation.
- No record of who approved/reviewed the training records.

---

## 5. `assurance/` — Internal Audit, Non-Conformity Log, Corrective Actions

### 5.1 `internal-audit.md`

**Strengths:**

- Correct three-finding-category taxonomy (Conformity, Non-Conformity,
  Observation).
- Auditor independence requirement is stated.

**Gaps:**

- The procedure is described but **no audit has ever been recorded**. The
  document is a process description, not an evidence record. ISO 27001 Clause
  9.2 requires retained documented information as evidence of the audit
  programme and audit results.
- No concrete audit schedule or plan is documented (only "annually or before
  significant external audits").

### 5.2 `nonconformity-log.md`

**Strengths:**

- Two real non-conformity records exist (NC-001 MFA gap, NC-002 pentest). This
  is genuine evidence.
- NC-001 is closed, NC-002 is open with a corrective action.
- Date format is consistent (YYYY-MM-DD).

**Gaps:**

- NC-002 source is listed as "Customer Audit" — this suggests the non-conformity
  was surfaced by a customer, not an internal audit. An auditor may note this as
  evidence of reactive rather than proactive posture.
- The log has no **version or last-reviewed date**.

### 5.3 `corrective-actions.md`

**Strengths:**

- 4-step process (React, Evaluate, Implement, Review) is well-structured.
- CA-001 includes a verification date (2025-10-13), which is good evidence.
- CA-002 is honest about the budget constraint root cause.

**Gaps:**

- CA-002 status "In Progress" has no latest update date or evidence of progress.
  For an open corrective action, the auditor expects to see evidence of ongoing
  management.
- CA-002's interim action ("automated vulnerability scanning") is not linked to
  any evidence of that scanning being enabled or its results.

---

## 6. Top-Level — `index.md` and `tasks.md`

### 6.1 `index.md`

**Strengths:**

- Clean structural overview. Links to all subsections are present.

**Gaps:**

- Section header links use hardcoded `/docs/compliance/iso27001/` paths. If the
  Docusaurus base URL or slug changes, these will break.
- The index links the Governance section to `governance/scope` rather than
  `governance/` (the index). Minor but creates landing confusion.
- No `sidebar_position` in frontmatter — the overview page may not render in the
  correct sidebar position relative to sibling pages.

### 6.2 `tasks.md`

**Strengths:**

- Comprehensive 35-task checklist broken into 4 phases with correct ISO 27001
  control references.
- Phase 1 items correctly identified as pre-certification critical.

**Gaps:**

- All 35 tasks in Phases 1–4 are **unchecked**. This is a completely blank
  kanban board — it documents what needs to be done but provides no evidence of
  progress. At the pre-review stage, Phase 1 items should be largely completed
  or in progress.
- Every task has `Owner: Founder` and `Target: TBD`. No target dates have been
  set. For a pre-review audit, the absence of any planned dates signals the work
  has not been scheduled.
- The `tasks.md` page is publicly visible in the documentation site. Surfacing a
  complete list of all security gaps/open items may be undesirable from an
  information disclosure perspective.

---

## 7. Cross-Cutting Observations

| Observation                                                                                                                                                                                                                                                                                                                                                      | Files Affected                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **No document has a version number, effective date, or management sign-off block.** ISO 27001 Clause 7.5.2 is explicit about document identification requirements. This applies to every policy and procedural document.                                                                                                                                         | All policy/procedural documents                                                                         |
| **Policy documents and operational records are conflated.** `training-competency.md` mixes a policy template (what onboarding should include) with an evidence record (who has completed it). These should be separate documents.                                                                                                                                | `operations/training-competency.md`                                                                     |
| **Placeholder content is present throughout.** `[Target Date]`, `[Link to Secure Risk Register]`, `Dev 1`, missing metric sentence in `objectives.md`. These make documents appear unfinished.                                                                                                                                                                   | `governance/objectives.md`, `risk-management/risk-register.md`, `operations/training-competency.md`     |
| **Several mandatory ISO 27001 Annex A control areas are absent from the document set.** There is no Incident Response Plan (referenced in `tasks.md` #6 as outstanding), no Data Classification Scheme (#12), no Supplier Security Register (#17), no Business Continuity Plan (#20). These are not "nice to have" — they are Clause 5 and Annex A requirements. | Overall set                                                                                             |
| **The SoA exists only as a stub.** A complete, line-by-line SoA is the core artefact of an ISO 27001 ISMS. It cannot be deferred to an external spreadsheet for a review-stage assessment.                                                                                                                                                                       | `operations/soa.md`                                                                                     |
| **Minor but pervasive typographical errors indicate draft quality.** `"ensuring"` (lowercase, mid-list), `"Git provide"`, `"ensuring they are still appropriate"`.                                                                                                                                                                                               | `policies/information-security-policy.md`, `policies/access-control.md`, `policies/document-control.md` |

---

## Severity Summary

| Finding ID | File                                      | Category                                                                                        | Severity    |
| ---------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------- |
| DOC-01     | All policy/procedure docs                 | Metadata / Governance Completeness                                                              | 🔴 Critical |
| DOC-02     | `governance/objectives.md`                | Coverage Gap (placeholder `[Target Date]`)                                                      | 🟠 High     |
| DOC-03     | `governance/objectives.md`                | Readability (incomplete metric sentence)                                                        | 🟡 Medium   |
| DOC-04     | `governance/roles-responsibilities.md`    | Governance Completeness (no formal ISMS appointment evidence)                                   | 🟠 High     |
| DOC-05     | `policies/information-security-policy.md` | Governance Completeness (no review freq/distribution statement)                                 | 🟠 High     |
| DOC-06     | `policies/acceptable-use.md`              | Governance Completeness (no non-compliance consequences)                                        | 🟡 Medium   |
| DOC-07     | `policies/access-control.md`              | Coverage Gap (reactive key rotation, missing offboarding checklist link)                        | 🟡 Medium   |
| DOC-08     | `risk-management/methodology.md`          | Regulatory Accuracy (no risk acceptance criteria defined)                                       | 🔴 Critical |
| DOC-09     | `risk-management/risk-register.md`        | Coverage Gap (only 5 risks; missing R-006 entry; no owner column)                               | 🔴 Critical |
| DOC-10     | `risk-management/risk-register.md`        | Coverage Gap (external register link is a placeholder)                                          | 🟠 High     |
| DOC-11     | `risk-management/treatment-plan.md`       | Structural Integrity (R-006 inconsistency with risk register)                                   | 🟠 High     |
| DOC-12     | `operations/soa.md`                       | Coverage Gap (SoA is a stub; no inline control-by-control table)                                | 🔴 Critical |
| DOC-13     | `operations/training-competency.md`       | Coverage Gap (unchecked onboarding items; placeholder "Dev 1")                                  | 🟠 High     |
| DOC-14     | `assurance/internal-audit.md`             | Coverage Gap (no audit ever conducted; no schedule)                                             | 🟠 High     |
| DOC-15     | `assurance/corrective-actions.md`         | Coverage Gap (CA-002 has no progress date or evidence)                                          | 🟡 Medium   |
| DOC-16     | `tasks.md`                                | Coverage Gap (all 35 tasks unchecked, all targets TBD)                                          | 🟠 High     |
| DOC-17     | Overall set                               | Governance Completeness (Incident Response, Data Classification, Supplier Register, BCP absent) | 🔴 Critical |
| DOC-18     | `index.md`                                | Metadata (no sidebar_position; link to scope not governance index)                              | 🟢 Low      |
| DOC-19     | Multiple policies                         | Readability (pervasive typographical errors signalling draft quality)                           | 🟡 Medium   |
| DOC-20     | `risk-management/methodology.md`          | Governance Completeness (no asset register referenced or linked)                                | 🟠 High     |
