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
3 domains were reviewed. **15 findings** were identified: 2 critical, 5 high, 5
medium, 3 low. The audit demonstrates conclusively that static Markdown
registers fail on queryability, cross-referencing integrity, review-date
enforcement, consistent schema, automation integration, and concurrent write
safety — all of which become non-trivially painful at the current register scale
of 10+ tracked entities.

| Area                                 | Coverage | Issues Found | Overall              |
| ------------------------------------ | -------- | ------------ | -------------------- |
| Queryability & filtering             | ⚠️       | 3            | ❌ Insufficient      |
| Cross-register referential integrity | ⚠️       | 3            | ❌ Insufficient      |
| Schema consistency                   | ⚠️       | 2            | ⚠️ Weak              |
| Review-date enforcement & alerting   | ❌       | 2            | ❌ None              |
| Automation / agent write integration | ❌       | 2            | ❌ None              |
| Audit trail & change provenance      | ✅       | 1            | ✅ Git provides this |
| Agent infrastructure                 | ✅       | 1            | ⚠️ Minor             |
| Concurrent update safety             | ❌       | 1            | ❌ Insufficient      |

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

### 8.1 One workflow references a locally-installed skill path

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

---

## Severity Summary

| Finding ID | Area                           | File                                            | Category                 | Severity    |
| :--------- | :----------------------------- | :---------------------------------------------- | :----------------------- | :---------- |
| QUERY-01   | Risk Register                  | `risk-register.md`                              | Queryability             | 🔴 Critical |
| AUTO-01    | Audit Registry                 | `audit-registry.md`                             | Automation / Concurrency | 🔴 Critical |
| REF-02     | NC Log + CA Register           | `nonconformity-log.md`, `corrective-actions.md` | Referential Integrity    | 🟠 High     |
| AUTO-02    | All registers                  | multiple                                        | Automation               | 🟠 High     |
| CONC-01    | All registers                  | multiple                                        | Concurrency              | 🟠 High     |
| ALERT-01   | All registers                  | multiple                                        | Review Enforcement       | 🟠 High     |
| SCHEMA-02  | Asset + Supplier               | `asset-register.md`, `supplier-register.md`     | Compliance               | 🟠 High     |
| QUERY-02   | Audit Registry                 | `audit-registry.md`                             | Queryability             | 🟡 Medium   |
| QUERY-03   | Standards Register             | `standards-register.md`                         | Queryability             | 🟡 Medium   |
| REF-01     | Risk Register                  | `risk-register.md`                              | Referential Integrity    | 🟡 Medium   |
| REF-03     | Asset + Supplier               | `asset-register.md`, `supplier-register.md`     | Referential Integrity    | 🟡 Medium   |
| ALERT-02   | Standards Register             | `standards-register.md`                         | Review Enforcement       | 🟡 Medium   |
| TRAIL-01   | Audit Registry + Risk Register | multiple                                        | Audit Trail              | 🟡 Medium   |
| SCHEMA-01  | Supplier Register              | `supplier-register.md`                          | Schema Consistency       | 🟢 Low      |
| INFRA-01   | Agent workflows                | `debug-ci.md`                                   | Agent Infrastructure     | 🟢 Low      |
