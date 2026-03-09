---
title: Governance Register Infrastructure Audit
sidebar_position: 1
---

# Governance Register Infrastructure Audit

**Date:** 2026-03-09\
**Scope:** `documentation/common-bond` — all governance register documents (10
registers)\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO/IEC 27001:2022 Clauses 7.5, 6.1, 9.1; organisational
observability requirements

---

## Executive Summary

This audit evaluates whether Docusaurus-based Markdown files are an adequate
long-term substrate for Common Bond's governance registers. 10 registers across
3 domains were reviewed. **29 findings** were identified: 3 critical, 11 high,
10 medium, 5 low. The audit demonstrates conclusively that static Markdown
registers fail on queryability, cross-referencing integrity, review-date
enforcement, consistent schema, automation integration, concurrent write safety,
monitoring and measurement capability, access control granularity, evidence
linkage, record lifecycle management, and privacy compliance — all of which
become non-trivially painful at the current register scale of 10+ tracked
entities.

| Area                                 | Coverage | Issues Found | Overall              |
| ------------------------------------ | -------- | ------------ | -------------------- |
| Queryability & filtering             | ⚠️       | 3            | ❌ Insufficient      |
| Cross-register referential integrity | ⚠️       | 3            | ❌ Insufficient      |
| Schema consistency                   | ⚠️       | 4            | ⚠️ Weak              |
| Review-date enforcement & alerting   | ❌       | 2            | ❌ None              |
| Automation / agent write integration | ❌       | 2            | ❌ None              |
| SoA observability                    | ❌       | 1            | ❌ Insufficient      |
| Disaster recovery (governance data)  | ❌       | 1            | ❌ Undocumented      |
| ISMS monitoring & measurement        | ❌       | 1            | ❌ None              |
| Access control on register content   | ⚠️       | 1            | ⚠️ No role-based tiers |
| Governance ownership model           | ⚠️       | 1            | ⚠️ Sole-operator only  |
| Risk treatment evidence linkage      | ❌       | 1            | ❌ Absent              |
| Record lifecycle & retention         | ❌       | 1            | ❌ None                |
| Privacy compliance (personal data)   | ❌       | 1            | ❌ Irreconcilable gap  |
| Audit trail & change provenance      | ⚠️       | 2            | ⚠️ Partial             |
| Agent infrastructure                 | ⚠️       | 2            | ⚠️ Minor             |
| Concurrent update safety             | ❌       | 1            | ❌ Insufficient      |
| Search & discoverability (UX)        | ⚠️       | 1            | ⚠️ Weak              |

---

## 1. Queryability and Filtering

### 1.1 No ability to filter or query register entries

**Strengths:**

- Markdown tables render clearly in Docusaurus and are human-readable at a
  glance.
- Risk Register, NC Log, and Audit Registry all use consistent tabular structure
  within their own files.

**Gaps:**

- QUERY-01 `docs/compliance/iso27001/risk-management/risk-register.md` — The
  Risk Register (17 rows) cannot be queried by `Risk Level`, `Status`, or
  `Risk Owner` without reading the entire table. An auditor asking "show me all
  High risks that are Planned" must do this manually. At 17 rows this is a minor
  inconvenience; at 50+ risks (realistic within 12 months) it is an audit
  liability.

- QUERY-02 `docs/audits/audit-registry.md` — The Audit Registry (10+ entries)
  cannot be filtered by `Status` or `Scope`. Cross-ecosystem status views
  require counting rows manually; no aggregate view is possible.

- QUERY-03 `docs/registers/standards-register.md` — The Standards Register
  contains 27 entries across 4 tables with no ability to filter by `Status`
  (`Active` / `Draft` / `Planned`), `Owner`, or `Review Cadence`. Finding all
  standards due for review in Q1 2027 requires manual scan.

---

## 2. Cross-Register Referential Integrity

### 2.1 References between registers are plain text with no integrity enforcement

**Strengths:**

- The NC Log cross-references corrective actions and audit slugs by ID correctly
  in the current state.
- The Risk Register references audits (e.g. R-012 references `PROC-03`).

**Gaps:**

- REF-01 `docs/compliance/iso27001/risk-management/risk-register.md` line 31 —
  R-012's corrective action references `PROC-03` and `CA-005` as plain text
  strings. If `CA-005` is renamed, the reference silently breaks. Git does not
  detect cross-document reference drift.

- REF-02 `docs/compliance/iso27001/assurance/nonconformity-log.md` +
  `corrective-actions.md` — NC-004 status is `🔄 In Progress` but the CA-004
  entry (`corrective-actions.md` line 64) also says `🔄 In Progress`. These two
  status fields are maintained independently in two separate files; they can and
  do drift. No constraint enforces that `NC.status = CA.status` when they share
  a corrective action.

- REF-03 `docs/compliance/iso27001/operations/supplier-register.md` — The
  Supplier Register lists 6 suppliers;
  `docs/compliance/iso27001/operations/asset-register.md` lists 5
  software/service assets. Supabase appears in both (`SA-001` and the supplier
  card), but no foreign key links them. Adding a new asset does not prompt a
  supplier review check, and vice versa.

---

## 3. Schema Consistency

### 3.1 Inconsistent register formats prevent systematic cross-register reporting

**Gaps:**

- SCHEMA-01 `docs/compliance/iso27001/operations/supplier-register.md` — The
  Supplier Register uses a **vertical card format** (field-per-row tables) while
  all other registers use **horizontal tabular format** (column-per-field). This
  inconsistency is not cosmetic: it makes automated parsing, filtering, and
  eventual migration to Supabase materially harder, as the data extraction
  strategy differs entirely.

- SCHEMA-02 `docs/compliance/iso27001/operations/asset-register.md` line 9 and
  `docs/compliance/iso27001/operations/supplier-register.md` line 9 — Both the
  Asset Register and Supplier Register carry `⚠️ Confirm` in their
  `Effective Date` and `Next Review` fields, meaning two ISO 27001-mandated
  records have **no formally confirmed effective date** — a direct finding for a
  Stage 1 external auditor.

---

## 4. Review-Date Enforcement and Alerting

### 4.1 No mechanism exists to alert on overdue register reviews

**Gaps:**

- ALERT-01 Multiple registers — Nine of the ten registers carry review cadences
  (annual in most cases). The current Markdown approach provides no mechanism to
  alert when a review date is approaching or overdue. As of 2026-03-09, the
  Asset Register, Supplier Register, and 4 out of 6 ISMS policies have
  `⚠️ Confirm` as their review date — meaning the review calendar has not even
  been established.

- ALERT-02 `docs/registers/standards-register.md` — The Standards Register lists
  `Next Review: 2027-03-01` for all 27 entries, set identically as a bulk
  default. This hides the fact that some standards (e.g. `ISMS-STD-012` Incident
  Response Plan) should have a 6-month review cycle post-incident, not a
  universal annual one. A Markdown table cannot enforce per-row review cadence
  variation.

---

## 5. Automation and Agent Write Integration

### 5.1 Agents cannot reliably update registers without file-level write conflicts

**Gaps:**

- AUTO-01 `docs/audits/audit-registry.md` — Every audit session ends with an
  agent writing to `audit-registry.md`. This is a manual file-append operation
  via `replace_file_content`. Concurrent audit sessions (increasingly likely as
  audit cadence increases) would produce Git merge conflicts in the registry
  file. A database row insert is naturally concurrent-safe; a Git file write is
  not.

- AUTO-02 Multiple registers — When a new risk is identified mid-session, an
  agent must: (1) manually identify the next `R-NNN` ID by reading the entire
  file, (2) insert a correctly-formatted Markdown table row, (3) commit. This is
  error-prone (ID collision, malformed table row). A database `INSERT` with a
  `SERIAL` primary key and schema validation is structurally safer.

---

## 6. Audit Trail and Change Provenance

### 6.1 Git provides a strong audit trail but with limitations

**Strengths:**

- Git commit history provides a timestamped, attributed change log for every
  policy document and register row change.
- The Document Control Policy (`ISMS-STD-005`) correctly designates Git as the
  change management mechanism.

**Gaps:**

- TRAIL-01 `docs/audits/audit-registry.md` + risk register — Git provides
  file-level history but not row-level history. An auditor asking "when was
  R-005's status last changed from Planned to Ongoing?" must `git log -p` the
  risk register file and manually trace the specific row across diffs. A
  Supabase table with `updated_at` and an audit log trigger provides this
  automatically.

---

## 7. Concurrent Update Safety

### 7.1 File-level locking creates a merge conflict risk zone

**Gaps:**

- CONC-01 All registers — As agent-driven audit and implementation sessions run
  simultaneously (an increasingly common pattern), the probability of two agents
  writing to the same register file in the same session approaches certainty.
  Markdown files have no native locking mechanism. The only protection is a Git
  merge conflict that an agent must resolve — adding risk of data loss or
  corruption in a governance document.

---

## 8. Agent Infrastructure

### 8.1 Workflow stubs are not tailored to this repo's technology context

**Strengths:**

- Three required workflow stubs are present (`audit-workflow.md`,
  `implement-audit-workflow.md`, `finalise-local-audit.md`).
- All core skills are referenced via absolute `dev-environment/` paths in all
  three audit workflow files.
- No orphaned local skill copies in `.agents/skills/` (only the newly installed
  symlinked `supabase-postgres-best-practices` skill and the act-local-ci
  skill).
- Rules directory is empty — no cross-ecosystem standards incorrectly stored as
  local rules.

**Gaps:**

- INFRA-01 `.agents/workflows/debug-ci.md` line 12 — `debug-ci.md` references
  the `act-local-ci` skill via a `documentation/common-bond/`-relative path
  (`documentation/common-bond/.agents/skills/act-local-ci/SKILL.md`) rather than
  an absolute dev-environment path. This workflow will fail if run from a
  different working directory. Consistent with the standard established by all
  other workflows, the path should be absolute.

- INFRA-02 `.agents/workflows/audit-workflow.md` lines 1–161 — The
  `audit-workflow.md` stub currently references Python-specific skills
  (`python-design-patterns`, `python-testing-patterns`) that are irrelevant to
  the `common-bond` documentation repository. It also does not reference the
  newly installed `supabase-postgres-best-practices` skill, which is now
  directly applicable to this repo's primary audit focus. Additionally, the
  workflow does not mention `/global-audit` as the appropriate workflow for
  cross-ecosystem audits originating from this repo, creating ambiguity for
  future audit agents.

---

## 9. Statement of Applicability (SoA) Observability

### 9.1 The SoA is the highest-density structured document and is entirely unqueryable

**Gaps:**

- SOA-01 `docs/compliance/iso27001/operations/soa.md` — The SoA is 39KB and
  contains 93 ISO 27001 Annex A controls, each with applicability,
  justification, and implementation status fields. There is currently no way to
  answer "how many controls are implemented?", "which applicable controls are
  Not Started?", or "what is the current SoA completion percentage?" without
  manually counting rows. A Stage 1 external auditor will specifically
  interrogate SoA completeness; the inability to produce a filtered view is a
  material audit-readiness gap. At 93 rows, the SoA is also the single
  highest-ROI item for Markdown→Supabase migration.

---

## 10. Schema Drift Risk

### 10.1 No machine-readable schema definition exists for any register

**Gaps:**

- SCHEMA-03 Multiple registers — No JSON Schema, Zod schema, or SQL DDL file
  defines what a valid Risk Register row, NC entry, or Supplier card looks like.
  Two agents or two humans adding rows independently have no validator to catch
  missing fields, wrong status enumerations, or malformed IDs. The Supabase
  migration resolves this structurally (column types and CHECK constraints serve
  as schema), but until migration is complete, schema drift is undetected.

- SCHEMA-04 `docs/registers/index.md` — The Register of Registers lists the
  Statement of Applicability (SoA) as `ISMS-REG-006` with 93 sub-entries, each
  with their own applicability status. The SoA is not strictly a "register" in
  the same sense as the Risk Register or Asset Register — it is an output
  document required by ISO 27001 Clause 6.1.3(d). Classifying it as a register
  without noting this distinction conflates two ISO 27001 document types, which
  could cause confusion in an external audit context.

---

## 11. Disaster Recovery for Governance Data

### 11.1 No documented recovery path for governance records

**Gaps:**

- DR-01 Multiple registers — The Business Continuity Plan
  (`docs/compliance/iso27001/operations/business-continuity.md`) documents
  RTO/RPO for the Receptor operational platform (Supabase PITR, 4-hour RTO). It
  does not document the recovery path for governance registers specifically. If
  the `doco-common-bond` GitHub repository became inaccessible (R-008 scenario —
  supplier failure), all 10 governance registers would be simultaneously
  unavailable with no documented recovery procedure. The Supabase migration
  inherently improves this (PITR covers governance data), but the transition
  period creates a gap that is not risk-registered or documented.

---

## 12. ISMS Monitoring and Measurement

### 12.1 No quantitative ISMS health metrics are computable from current registers

**Gaps:**

- MONITOR-01 Multiple registers — ISO/IEC 27001:2022 Clause 9.1 requires
  measurement and monitoring of ISMS performance. Common operational questions
  required for management review — "What % of risks have active treatment
  plans?", "What % of applicable SoA controls are implemented?", "How many
  suppliers still lack a DPA?" — cannot be answered without manual row-counting
  across multiple Markdown files. The current register stack produces no
  aggregate metrics, dashboards, or trend data. Supabase views and Postgres
  computed columns can expose these as live-queryable values. Until this is
  remediated, the ISMS measurement obligation (Clause 9.1) is met only in form,
  not in substance.

---

## 13. Access Control on Governance Register Content

### 13.1 No role-based access tiers within registers

**Strengths:**

- The Docusaurus site is deployed behind Cloudflare Access, so unauthenticated
  public access is prevented at the network layer.

**Gaps:**

- SEC-01 `docs/compliance/iso27001/operations/supplier-register.md`,
  `docs/compliance/iso27001/assurance/nonconformity-log.md` — While Cloudflare
  Access restricts site entry to authenticated users, the Supplier Register
  contains detailed security gap descriptions (DPA non-execution, root cause
  analysis) and the NC Log exposes incident root causes and corrective action
  details. All authenticated users see the same content — there are no
  role-based tiers distinguishing summary-level from management-detail views.
  As the organisation scales beyond a sole operator, not every authenticated
  user should see NC root causes or DPA gap details. In Supabase with RLS,
  access to sensitive columns can be gated by auth role, enabling a
  "summary / management detail" split that Markdown cannot provide.

---

## 14. Audit Trail Granularity

### 14.1 Bulk register edits lose row-level change provenance

**Gaps:**

- TRAIL-02 All registers — When an agent updates multiple rows in a single
  commit (e.g., adding 5 new risks, revising 8 SoA controls), the git diff is a
  single monolithic block. There is no way to determine which specific rows
  changed within that block, or when a specific field was last updated, without
  manually parsing the diff context. This is a more precise variant of TRAIL-01:
  Supabase row-level `updated_at` timestamps and the audit log trigger (REC-08)
  provide this automatically with zero additional tooling.

---

## 15. Governance Ownership Model

### 15.1 No distinction between Register Owner, Information Owner, and Process Owner

**Gaps:**

- GOV-01 All registers — Every governance register currently lists "Ryan
  Ammendolea (CEO)" as the sole owner of everything. While appropriate for a
  sole operator, the model has no distinction between the **Register Owner**
  (responsible for the register's currency), the **Information Owner**
  (accountable for entry data quality), and the **Process Owner** (accountable
  for the process the register governs). This single-owner model will surface as
  a Stage 2 (Certification) audit finding as the organisation scales. Supabase
  schema can enforce explicit multi-role ownership via
  `register_owner TEXT NOT NULL`, `information_owner TEXT NOT NULL`,
  `process_owner TEXT NOT NULL` columns.

---

## 16. Search and Discoverability

### 16.1 Docusaurus global search does not filter within register tables

**Gaps:**

- UX-01 All registers — Docusaurus Algolia/local search indexes page-level
  content but does not provide table-cell-level filtering. Searching for "R-008"
  returns the entire Risk Register page, not a filtered view of just R-008.
  Searching for "DPA not executed" returns the entire Supplier Register, not
  just the non-compliant suppliers. This compounds QUERY-01–03: even the
  platform's native search mechanism cannot compensate for the absence of
  queryability. A Supabase-backed register with a React search/filter component
  resolves this for all migrated registers simultaneously.

---

## 17. Risk Treatment Evidence Linkage

### 17.1 Treatment records carry intent, not proof

**Gaps:**

- EVID-01 `docs/compliance/iso27001/risk-management/risk-register.md` — ISO
  27001 Clause 8.3 requires organisations to *retain evidence* of risk treatment
  implementation. The Risk Register records treatment strategies (e.g., R-002:
  "Mitigate — MFA enforced") but includes no link to the evidence that treatment
  has actually been applied: no link to the MFA audit log, Supabase auth
  configuration, or policy document that proves the control is live. A Stage 1
  external auditor will ask "show me the evidence that R-002's MFA control is
  in effect" — the only current answer is a free-text cell in a Markdown table.
  This is not evidence retention; it is assertion without proof. A Supabase
  schema can enforce this with `evidence_url TEXT CHECK (status != 'Ongoing' OR
  evidence_url IS NOT NULL)` — an evidence link is mandatory once a treatment
  transitions to active.

---

## 18. Record Lifecycle and Retention

### 18.1 No retention policy, archival mechanism, or lifecycle state for closed records

**Gaps:**

- LIFECYCLE-01 All registers — When a risk is closed, an NC is resolved, or a
  CA is completed, the entry stays in the live register indefinitely with no
  archival, no defined minimum retention period, and no lifecycle state machine.
  ISO 27001 Clause 7.5.3 requires explicit control of documented information
  including *retention and disposition*. An auditor requesting "what is your
  ISMS record retention schedule?" has no defensible answer under the current
  approach. The Docusaurus Markdown files have no expiry signal. A Supabase
  schema resolves this structurally: `archived_at TIMESTAMPTZ`, a
  `v_active_<entity>` view filtering `WHERE archived_at IS NULL`, and a pg_cron
  job enforcing minimum retention periods before permanent deletion.

---

## 19. Privacy Compliance for Named Individuals

### 19.1 Personal data committed to Git history cannot be erased

**Gaps:**

- PRIV-01 Multiple registers — The governance registers commit named
  individuals directly into Git history: staff members in training records,
  named corrective action owners, supplier contact persons. Under the Australian
  Privacy Act 1988 APP 11 (security of personal information) and APP 13 (right
  to correction), individuals have rights regarding their personal data.
  Data committed to Git history cannot be erased without rewriting history via
  `git filter-branch` or `git filter-repo` — which would destroy the very
  document integrity trail that ISO 27001 Clause 7.5 mandates be preserved.
  This is an irreconcilable conflict: maintaining data subject rights vs.
  maintaining document integrity. No current policy acknowledges or addresses
  this conflict. Supabase resolves it cleanly: the row can be updated to scrub
  personal data, the audit log trigger records the change event with
  `changed_by` and `changed_at`, and the full audit trail is preserved without
  a force-push.

---

## 20. Agent Infrastructure Compliance Check

_Added 2026-03-09 as a GAP-1 addendum — this check was required by
`audit-workflow.md` Step 1 but was not performed against the correct workflow
file during the initial audit session._

### 20.1 Orphaned local skill copies found in `.agents/skills/`

**Strengths:**

- All three required workflow stubs exist: `audit-workflow.md`,
  `implement-audit-workflow.md`, `finalise-local-audit.md` ✅
- `.agents/rules/` is empty — no rules that should be promoted to skills ✅
- `supabase-postgres-best-practices` is a legitimately local skill
  installation (not present in `dev-environment`) ✅

**Gaps:**

- INFRA-03 `.agents/skills/` — The agent infrastructure standard
  (`docs/engineering/agent-infrastructure.md`) requires that `.agents/skills/`
  be **absent or empty** in all repos except `dev-environment`. The
  `documentation/common-bond` repo currently contains 5 orphaned local
  copies of cross-cutting skills that are already canonical in
  `dev-environment/.agents/skills/`:
  - `act-local-ci`
  - `adversarial-code-review`
  - `audit-document-standards`
  - `audit-registry`
  - `audit-verification-gates`
  These duplicates create a skill drift risk: if the canonical dev-environment
  versions are updated, local copies will silently diverge. Any agent operating
  in `documentation/common-bond` context may load the stale local copy instead
  of the current canonical version. The `audit-workflow.md` Step 1 block
  explicitly rates this as a 🟠 High finding.

  **Note:** `debug-ci.md` line 12 uses a relative skill path
  (`documentation/common-bond/.agents/skills/act-local-ci/SKILL.md`) pointing
  to one of the orphaned copies — this cross-references INFRA-01.

---



| Finding ID | Area | File | Category | Severity |
| :--- | :--- | :--- | :--- | :--- |
| QUERY-01 | Risk Register | `risk-register.md` | Queryability | 🔴 Critical |
| AUTO-01 | Audit Registry | `audit-registry.md` | Automation / Concurrency | 🔴 Critical |
| EVID-01 | Risk Register | `risk-register.md` | Evidence / ISO 8.3 | 🔴 Critical |
| REF-02 | NC Log + CA Register | `nonconformity-log.md`, `corrective-actions.md` | Referential Integrity | 🟠 High |
| AUTO-02 | All registers | multiple | Automation | 🟠 High |
| CONC-01 | All registers | multiple | Concurrency | 🟠 High |
| ALERT-01 | All registers | multiple | Review Enforcement | 🟠 High |
| SCHEMA-02 | Asset + Supplier | `asset-register.md`, `supplier-register.md` | Compliance | 🟠 High |
| SOA-01 | Statement of Applicability | `soa.md` | Queryability / Audit Readiness | 🟠 High |
| INFRA-02 | Agent workflows | `audit-workflow.md` | Agent Infrastructure | 🟠 High |
| MONITOR-01 | All registers | multiple | ISMS Monitoring / ISO 9.1 | 🟠 High |
| LIFECYCLE-01 | All registers | multiple | Retention / ISO 7.5.3 | 🟠 High |
| PRIV-01 | Training + NC + CA | multiple | Privacy / Privacy Act 1988 | 🟠 High |
| INFRA-03 | Agent skills | `.agents/skills/` | Agent Infrastructure / Skill Drift | 🟠 High |
| SEC-01 | Supplier + NC registers | `supplier-register.md`, `nonconformity-log.md` | Access Control Granularity | 🟡 Medium |
| QUERY-02 | Audit Registry | `audit-registry.md` | Queryability | 🟡 Medium |
| QUERY-03 | Standards Register | `standards-register.md` | Queryability | 🟡 Medium |
| REF-01 | Risk Register | `risk-register.md` | Referential Integrity | 🟡 Medium |
| REF-03 | Asset + Supplier | `asset-register.md`, `supplier-register.md` | Referential Integrity | 🟡 Medium |
| ALERT-02 | Standards Register | `standards-register.md` | Review Enforcement | 🟡 Medium |
| TRAIL-01 | Audit Registry + Risk Register | multiple | Audit Trail | 🟡 Medium |
| SCHEMA-03 | All registers | multiple | Schema Drift | 🟡 Medium |
| DR-01 | BCP + all registers | `business-continuity.md`, multiple | Disaster Recovery | 🟡 Medium |
| TRAIL-02 | All registers | multiple | Audit Trail | 🟡 Medium |
| GOV-01 | All registers | multiple | Governance Maturity | 🟡 Medium |
| SCHEMA-01 | Supplier Register | `supplier-register.md` | Schema Consistency | 🟢 Low |
| INFRA-01 | Agent workflows | `debug-ci.md` | Agent Infrastructure | 🟢 Low |
| SCHEMA-04 | Register of Registers | `registers/index.md` | Schema Consistency | 🟢 Low |
| UX-01 | All registers | multiple | Search / Discoverability | 🟢 Low |
