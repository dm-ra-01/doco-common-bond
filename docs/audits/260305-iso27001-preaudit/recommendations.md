# ISO 27001 Documentation Recommendations — Pre-Review Readiness

**Date:** 2026-03-05\
**Scope:** `docs/compliance/iso27001/` — all sections\
**Source:** [Audit Report](./audit.md)

---

## Priority Framework

- 🔴 Critical — Automatic non-conformity or regulatory exposure that will block
  a pre-review audit
- 🟠 High — Significant gaps or incomplete evidence that a reviewer will flag
- 🟡 Medium — Readability, consistency, or polish issues that reduce credibility
- 🟢 Low — Structural and metadata improvements

---

## 🔴 Critical

### REC-01: Add version numbers, effective dates, and approval blocks to all policy documents (DOC-01)

Every policy and procedure in the ISMS must carry an explicit version number,
effective date, and management approval signature under ISO 27001 Clause 7.5.2.
Approvals are recorded inline within each document. In future, Vanta will be
used as the compliance platform for managing document approvals and evidence.

**Action:** Add a standard approval table immediately below the
`# Document Title` heading in each of the following files:

```
| Version | Effective Date | Approved By | Next Review |
|---------|----------------|-------------|-------------|
| 1.0     | YYYY-MM-DD     | [Full Name, CEO] | YYYY-MM-DD  |
```

- [ ] Add approval block to
      `docs/compliance/iso27001/policies/information-security-policy.md`
- [ ] Add approval block to
      `docs/compliance/iso27001/policies/acceptable-use.md`
- [ ] Add approval block to
      `docs/compliance/iso27001/policies/access-control.md`
- [ ] Add approval block to
      `docs/compliance/iso27001/policies/document-control.md`
- [ ] Add approval block to `docs/compliance/iso27001/governance/scope.md`
- [ ] Add approval block to
      `docs/compliance/iso27001/risk-management/methodology.md`
- [ ] Add approval block to
      `docs/compliance/iso27001/risk-management/risk-register.md`
- [ ] Add approval block to
      `docs/compliance/iso27001/risk-management/treatment-plan.md`

> [!IMPORTANT]
> The approval block must be populated with real full names and real dates by
> the Founder/CEO before this recommendation is considered closed.

---

### REC-02: Build a complete inline Statement of Applicability (SoA) (DOC-12)

The SoA (`docs/compliance/iso27001/operations/soa.md`) is the most critically
reviewed document in any ISO 27001 audit. The current stub is insufficient.
`soa.md` will be the single source of truth — a full Markdown table covering all
93 ISO 27001:2022 Annex A controls. An agent will convert it to `.xlsx` format
at a later date when required.

- [ ] Replace the stub `soa.md` with a full structured Markdown table covering
      all 93 Annex A controls. Each row must include: Control ID, Control Name,
      Applicable (Yes/No), Justification for inclusion/exclusion, Implementation
      Status (Implemented / Partial / Planned / Not Applicable).
- [ ] Remove all references to the external spreadsheet
      `SA 1 - Statement of Applicability.xlsx`.
- [ ] The implementing agent should pre-populate sensible defaults based on
      Common Bond's profile (cloud-native, fully remote, pre-revenue SaaS,
      healthcare-adjacent) and mark all decisions requiring Founder confirmation
      with `⚠️ Confirm`.

---

### REC-03: Define risk acceptance criteria in the methodology (DOC-08)

The risk methodology (`docs/compliance/iso27001/risk-management/methodology.md`)
describes a 3×3 likelihood/impact matrix but does not state which risk levels
are acceptable or unacceptable. ISO 27001 Clause 6.1.2(a) explicitly requires
this criteria to be established before the risk assessment is performed.

- [x] Add a section to `methodology.md` titled "Risk Acceptance Criteria" that
      defines:
  - The risk level (e.g., Low, Medium, High) below which risks are accepted
    without further treatment.
  - The approval authority for accepting risks at each level (the document
    already states CEO approval for High/Medium — formalize this as a table).

---

### REC-04: Expand the Risk Register and resolve the R-006 inconsistency (DOC-09, DOC-11)

The Risk Register contains only 5 risks. For a healthcare-adjacent SaaS platform
at pre-review stage, this will be seen as inadequate coverage. Additionally,
Risk R-006 ("Key Person Risk") appears in the Treatment Plan but has no
corresponding entry in the Risk Register — this is an internal inconsistency an
auditor will immediately flag.

- [x] Add R-006 to `risk-management/risk-register.md` with a Description,
      Threat, Impact, Risk Level, Treatment Strategy, and Status.
- [x] Add a Risk Owner column to the Risk Register table (ISO 27001 Clause
      6.1.2(c) requirement).
- [x] Add at minimum the following missing risks to the register:
  - Regulatory breach / Privacy Act non-compliance (R-007)
  - Third-party / Supplier failure (R-008)
  - Lack of incident response capability (R-009)
  - Business continuity / Key person dependency (R-010 — distinct from or merged
    with R-006)

---

### REC-05: Create the four missing mandatory ISMS artefacts (DOC-17)

`tasks.md` identifies these as Phase 1 critical. Their complete absence makes
the ISMS structurally incomplete. The Founder Q&A has been completed; all
decision inputs are recorded below. The implementing agent should draft all four
documents in a single session without requiring further Founder input.

> [!NOTE]
> All policy decisions below were confirmed by Ryan Ammendolea (Founder/CEO) on
> 2026-03-05.

---

**Confirmed inputs — Incident Response Plan:**

- Primary security incident contact: **Ryan Ammendolea, Founder & CEO**
  - Alert email: `alert@commonbond.au`
  - Mobile: `+61 403 551 813`
- Customer notification target: **as soon as practicable** (Privacy Act
  minimum); commit to internal target of **72 hours** from confirmed breach.
- Legal entities in scope: **Common Bond Pty Ltd** and **MyJMO Pty Ltd**.

**Confirmed inputs — Data Classification Scheme:**

- Use a 4-tier scheme: **Public / Internal / Confidential / Restricted**.
- PII held is split into two categories:
  - _Workforce Admin PII:_ First name, last name, email, telephone number.
  - _Worker PII:_ First name, last name, email, telephone number, work
    preferences, company rotation allocations.
- No health data is held at this stage. Classification ceiling is
  **Confidential**.

**Confirmed inputs — Supplier Security Register:**

- Critical suppliers: Supabase, Cloudflare, GitHub, ClickUp, Google Workspace.
- No bespoke DPAs or contractual security clauses are in place; all relying on
  standard terms.

> [!IMPORTANT]
> **DPA Requirement:** Under Australian Privacy Principle 8 (APP 8), Common Bond
> must take reasonable steps to ensure overseas recipients of personal
> information protect that information. For ISO 27001 controls 5.19–5.22,
> supplier agreements must address security obligations. The implementing agent
> must flag the following DPA actions in `supplier-register.md`:
>
> - **Supabase** (hosted on AWS, US/EU): Execute Supabase's Data Processing
>   Agreement (available at supabase.com/legal/dpa). Australian customers are
>   covered under AWS Standard Contractual Clauses.
> - **Cloudflare**: Execute Cloudflare's DPA (available at
>   cloudflare.com/cloudflare-customer-dpa). Cloudflare has GDPR/APP-compatible
>   terms.
> - **GitHub (Microsoft)**: Enable the GitHub Data Protection Agreement via
>   GitHub Organization settings > Security > Data protection. No separate form
>   required.
> - **Google Workspace**: Accept Google's Data Processing Amendment in the Admin
>   Console (admin.google.com > Account > Legal > Data processing amendment).
> - **ClickUp**: Execute ClickUp's DPA (available at clickup.com/dpa). Required
>   if ClickUp stores any internal PII or business-sensitive information. Each
>   entry in the Supplier Register should include: DPA status (Executed / In
>   Progress / Not Required), the date of last review, and the supplier's
>   security contact or trust page URL.

**Confirmed inputs — Business Continuity Plan:**

- RTO (Recovery Time Objective): **4 hours**
- RPO (Recovery Point Objective): **12 hours**
- Supabase PITR (Point-in-Time Recovery) is already configured; this satisfies
  the RPO technically. The BCP should document this as the primary recovery
  mechanism.

---

**Implementation tasks:**

- [ ] Draft **Incident Response Plan** at
      `docs/compliance/iso27001/operations/incident-response.md` (controls
      5.24–5.28)
- [ ] Draft **Data Classification Scheme** at
      `docs/compliance/iso27001/policies/data-classification.md` (controls 5.12,
      5.13)
- [ ] Draft **Supplier Security Register** at
      `docs/compliance/iso27001/operations/supplier-register.md` (controls
      5.19–5.22), including DPA status column and action items per supplier
      above
- [ ] Draft **Business Continuity Plan** at
      `docs/compliance/iso27001/operations/business-continuity.md` (controls
      5.29, 5.30)

---

## 🟠 High

### REC-06: Fill in the `[Target Date]` placeholder in objectives.md and fix the incomplete metric (DOC-02, DOC-03)

- [x] In `governance/objectives.md` line 15, replace `[Target Date]` with an
      actual target date for Stage 1 audit readiness. Set to **2026-04-30**
      (confirmed by Founder on 2026-03-05).
- [x] Fix the incomplete metric sentence in Objective 2: changed to
      `"Metric: Count of critical vulnerabilities unresolved in production systems."`.

---

### REC-07: Document the formal ISMS role appointment (DOC-04)

ISO 27001 Clause 5.3 requires that authority for ISMS responsibilities is
formally assigned and communicated. Named individuals are now confirmed.

**Confirmed role assignments:**

- **Founder/CEO (Top Management):** Ryan Ammendolea — `ryan@commonbond.au`
- **CTO / Information Security Manager:** Ryan Ammendolea (same individual at
  this stage)
- **Security Incident Contact:** `alert@commonbond.au` / `+61 403 551 813`
- **Legal entities:** Common Bond Pty Ltd and MyJMO Pty Ltd

- [x] Replace all generic role titles in `governance/roles-responsibilities.md`
      with "Ryan Ammendolea" as the named individual for both Top Management and
      ISM roles.
- [x] Add a note that the dual role is a documented and accepted consequence of
      the pre-revenue, founder-led stage of the business.
- [x] Add a "Section 4: Appointment Record" statement formally assigning roles
      by Founder declaration on **2026-03-05**.

---

### REC-08: Separate training policy from training records (DOC-13)

`operations/training-competency.md` is simultaneously a policy template
(Sections 1–3) and an evidence record (Section 4 Competency Matrix). These
should be in separate documents.

- [ ] Create `docs/compliance/iso27001/operations/training-records.md` as the
      live evidence record containing the Competency Matrix and completed
      onboarding checklists.
- [ ] Retain `training-competency.md` as the policy/procedure, remove the live
      evidence/names from it, and link to `training-records.md` for the actual
      records.
- [ ] Replace "Dev 1" in the competency matrix with the actual name of the team
      member.
- [ ] Complete the three onboarding checklist items for all current staff (mark
      `[x]` with a date if completed).

---

### REC-09: Make `risk-register.md` the single source of truth (DOC-10)

There is no external register. `risk-register.md` is the live record. The
placeholder link and the "snapshot" note must be removed — they undermine the
document's status as an authoritative ISMS artefact.

- [x] Remove the `> Note: This is a snapshot...` callout from
      `risk-management/risk-register.md`.
- [x] Remove the `[Link to Secure Risk Register (Internal Only)]` placeholder
      entirely.
- [x] Update the section heading from "Top Risks Snapshot" to "Risk Register" to
      reflect its authoritative status.

---

### REC-10: Schedule and document the first internal audit (DOC-14)

The internal audit procedure is documented but no audit has been conducted or
scheduled. ISO 27001 Clause 9.2 requires retained evidence of an audit
programme.

- [ ] Add an Audit Schedule table to `assurance/internal-audit.md` documenting
      the planned audit date, scope, and auditor (even if TBD).
- [ ] After the audit is conducted, create a separate audit report document at
      `docs/compliance/iso27001/assurance/audit-reports/YYYYMM-internal-audit.md`
      capturing findings, non-conformities, and observations.

---

### REC-11: Create the Asset/Information Register (DOC-20)

`tasks.md` item #8 identifies the asset register as Phase 1 critical. The risk
methodology references asset categories but no actual register exists.

- [ ] Create `docs/compliance/iso27001/operations/asset-register.md` listing
      information assets across the identified categories: Information (PII,
      source code, IP), Software (Supabase, GitHub, Cloudflare, Google
      Workspace), Hardware (developer laptops), People. Each entry should have:
      Asset Name, Owner, Classification, Location, and Recovery Priority.

---

### REC-12: Set target dates for all Phase 1 tasks in tasks.md (DOC-16)

All 35 tasks in `tasks.md` have `Target: TBD`. Phase 1 items are marked
"Pre-Certification Critical" and should have committed dates.

- [ ] Work with the Founder to assign realistic target dates to all 10 Phase 1
      tasks and at minimum the first 5 Phase 2 tasks.
- [ ] Update `tasks.md` to reflect in-progress items as `[/]` and completed
      items as `[x]` with completion dates.

---

## 🟡 Medium

### REC-13: Add non-compliance consequences to the Acceptable Use Policy (DOC-06)

The Information Security Policy states consequences for non-compliance (Section
5). The Acceptable Use Policy does not. This inconsistency undermines the policy
framework.

- [x] Add a "Non-Compliance" section to `policies/acceptable-use.md` mirroring
      the language in `information-security-policy.md` Section 5, with explicit
      cross-reference.

---

### REC-14: Add a review frequency and distribution statement to the Information Security Policy (DOC-05)

ISO 27001 Clause 5.2 requires the policy to be available to interested parties
and communicated within the organisation.

- [x] Add a "Review Frequency" statement to
      `policies/information-security-policy.md`.
- [x] Add a "Distribution" statement to
      `policies/information-security-policy.md`.

---

### REC-15: Add a progress update date and evidence reference to CA-002 (DOC-15)

The open corrective action CA-002 (Penetration Testing) has no evidence of
ongoing management. An auditor reviewing an open CA wants to see that it is
being actively tracked.

- [ ] Update `assurance/corrective-actions.md` CA-002 with a "Last Updated" date
      and one line of progress evidence (e.g., "Automated vulnerability scanning
      enabled via Dependabot as of YYYY-MM-DD; pentest budgeted for Q3 2026").

---

### REC-16: Fix pervasive typographical errors across policy documents (DOC-19)

These errors signal draft quality and reduce credibility with a reviewer.

- [x] `policies/information-security-policy.md` line 16: Changed `"ensuring"` to
      `"Ensuring"`.
- [x] `policies/access-control.md` line 19: Changed to
      `"ensure they are still appropriate"`.
- [x] `policies/document-control.md` line 20: Changed `"Git provide"` to
      `"Git provides"`.

---

### REC-17: Clarify the access key rotation policy (DOC-07)

`policies/access-control.md` Section 2.5 states keys are rotated "if
compromised" — a reactive posture. A periodic rotation requirement is better
practice and more defensible to an auditor.

- [x] Added sentence to Section 2.5 of `policies/access-control.md`: service
      keys and API credentials reviewed for rotation annually or upon staff
      changes with access to those credentials.

---

## 🟢 Low

### REC-18: Fix index.md metadata and link targets (DOC-18)

- [x] Added `sidebar_position: 0` to `docs/compliance/iso27001/index.md`
      frontmatter.
- [x] Changed the `### 1. Governance` link target to
      `/docs/compliance/iso27001/governance/`.

---

## Implementation Order

### Phase 1 — Unblock the pre-review audit (🔴 Critical items)

Focus: Get the core ISMS artefacts into a state where an auditor can review them
without immediately raising a major non-conformity.

1. **REC-01** — Add version, date, and approval blocks to all 8 policy/procedure
   documents. _(Requires Founder sign-off)_
2. **REC-03** — Define risk acceptance criteria in methodology.
3. **REC-04** — Expand risk register (R-006 fix, add owner column, add 4 missing
   risks).
4. **REC-06** — Fill in `[Target Date]` placeholder and fix incomplete metric in
   objectives.

### Phase 2 — Fill mandatory evidence gaps (🟠 High items)

Focus: Create the artefacts and records that an auditor will ask to see as
evidence.

5. **REC-02** — Build the full 93-control inline SoA in `soa.md`.
6. **REC-05** — ⚠️ BLOCKED: Conduct Founder Q&A session, then draft the four
   missing mandatory artefacts.
7. **REC-07** — Document formal ISMS role appointment with named individuals.
8. **REC-08** — Separate training policy from training records; populate real
   names.
9. **REC-09** — Remove placeholder note; make risk-register.md the live source
   of truth.
10. **REC-10** — Schedule and document the first internal audit.
11. **REC-11** — Create the Asset Register.
12. **REC-12** — Set target dates for Phase 1 tasks.

### Phase 3 — Polish and credibility (🟡 Medium + 🟢 Low items)

Focus: Eliminate readability issues and close small gaps that reduce reviewer
confidence.

13. **REC-13** through **REC-18** — Policy consistency, typo fixes, and
    structural cleanup.

---

## Session 1 — 2026-03-05 — Completion Summary

**Implemented this session:** REC-03, REC-04, REC-06, REC-07, REC-09, REC-13,
REC-14, REC-16, REC-17, REC-18\
**Remaining open:** REC-01, REC-02, REC-05, REC-08, REC-10, REC-11, REC-12

**What was done:**

- `methodology.md` — Added Risk Acceptance Criteria section with a formal
  likelihood × impact matrix and approval authority table (REC-03)
- `risk-register.md` — Rewritten as the authoritative live record; removed
  placeholder note and broken link; added Risk Owner column; added R-006 (Key
  Person Dependency) and R-007–R-010 (regulatory breach, supplier failure,
  incident response gap, BCP failure) (REC-04, REC-09)
- `governance/objectives.md` — Replaced `[Target Date]` with `2026-04-30`
  (confirmed by Founder); fixed incomplete metric sentence (REC-06)
- `governance/roles-responsibilities.md` — Named Ryan Ammendolea in all role
  headings; added dual-role acknowledgement note; added Appointment Record
  section per Clause 5.3 (REC-07)
- `policies/information-security-policy.md` — Added Review Frequency and
  Distribution sections; fixed capitalisation typo (REC-14, REC-16)
- `policies/access-control.md` — Fixed `ensuring`→`ensure` typo; added proactive
  key rotation sentence (REC-16, REC-17)
- `policies/acceptable-use.md` — Added Non-Compliance section with
  cross-reference to InfoSec Policy (REC-13)
- `policies/document-control.md` — Fixed `Git provide`→`Git provides` (REC-16)
- `index.md` — Added `sidebar_position: 0`; fixed Governance link target
  (REC-18)

**Blocked items (do not attempt without Founder input):**

- **REC-01** — Approval blocks: The table structure is not yet added to policy
  files. The implementing agent should add blank approval tables to all 8
  policy/procedure documents (see REC-01 task list), then flag them for Founder
  to populate real dates and name. Do not mark REC-01 closed until signed.
- **REC-08** — Training records: Requires real staff name to replace "Dev 1" in
  the competency matrix.
- **REC-12** — Target dates for tasks.md: Requires Founder input for scheduling.

**Recommended next session (Session 2):**

Begin Phase 2. Priority order:

1. **REC-05** — Draft all four mandatory artefacts (Incident Response Plan, Data
   Classification Scheme, Supplier Security Register, BCP). All Founder inputs
   are confirmed in this file — do not request them again.
2. **REC-01** — Add blank approval table blocks to all 8 policy/procedure
   documents. The Founder must populate real dates.
3. **REC-11** — Create the Asset Register.
4. **REC-10** — Add Audit Schedule to internal-audit.md.
5. **REC-02** — Full 93-control SoA — this is a large content task and should be
   its own session.

⚠️ New: The treatment-plan.md still references R-006 (which now exists in the
register). An agent should verify that the treatment plan description for R-006
is consistent with the register entry added in this session.
