<!-- audit-slug: 260309-governance-register-infrastructure -->

# Governance Register Infrastructure — Recommendations

**Branch:** `audit/260309-governance-register-infrastructure`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-09

---

## Agent Clarifications (Human-Approved)

| Item                              | Decision                                                                                          |
| :-------------------------------- | :------------------------------------------------------------------------------------------------ |
| Migration target                  | Separate `supabase-common-bond` project (governance data isolated from operational Receptor data) |
| Policy documents (AUP, ISP, etc.) | Stay in Markdown/Git — Git history is the ISO 27001 Clause 7.5 audit trail                        |
| Docusaurus integration approach   | Client-side Supabase fetch via React components in MDX pages (live data, no rebuild required)     |
| Supabase skill                    | `supabase-postgres-best-practices` installed; apply to schema design and all SQL artefacts        |
| Register IDs                      | Domain-prefixed (ISMS-REG-NNN, ENG-REG-NNN, CORP-REG-NNN) — carry into DB primary key design      |
| Deferred items                    | Docusaurus build-time SSG fetch (evaluate post-MVP if SSR is needed)                              |
| SOA-01 severity                   | 🟠 High (approved Round 1 iterative improvement)                                                  |
| INFRA-02 severity                 | 🟠 High — audit-workflow.md stub to be fixed in same commit as this improvement round             |
| SCHEMA-03 severity                | 🟡 Medium (approved Round 1 iterative improvement)                                                |
| DR-01 severity                    | 🟡 Medium (approved Round 1 iterative improvement)                                                |
| SCHEMA-04 severity                | 🟢 Low (approved Round 1 iterative improvement)                                                   |

---

## 🔴 Critical

### REC-01 [260309-governance-register-infrastructure] — Migrate structured registers to Supabase

**Finding:** QUERY-01, AUTO-01

The inability to query the Risk Register and the concurrent write-conflict risk
on `audit-registry.md` are the two highest-priority blockers against the current
Markdown approach. These are not cosmetic issues — the first becomes an audit
liability at 50+ risks; the second risks governance record corruption.

- [ ] Create a new Supabase project: `supabase-common-bond` (separate from
      `supabase-receptor` to isolate governance data from operational data)
- [ ] Apply `supabase-postgres-best-practices` skill to all schema definitions
- [ ] Create the following tables with `COMMENT ON TABLE` and
      `COMMENT ON COLUMN` per Supabase standards:
  - `public.risks` (ISMS-REG-001) — columns: `risk_id`, `description`, `threat`,
    `impact`, `risk_level`, `risk_owner`, `treatment_strategy`, `status`,
    `created_at`, `updated_at`
  - `public.audits` (ENG-REG-001) — columns: `slug`, `title`, `scope`,
    `auditor`, `status`, `nc_raised`, `audit_url`, `recommendations_url`,
    `audit_date`, `updated_at`
- [ ] Enable RLS on both tables; anon key provides read-only SELECT; service
      role provides write access for agent-driven updates
- [ ] Create a Docusaurus MDX page for each migrated register with a React
      component that fetches from the Supabase REST API client-side
- [ ] Retire the Markdown source files once data is fully migrated and verified;
      replace with a redirect notice pointing to the live page

### REC-02 [260309-governance-register-infrastructure] — Fix concurrent write risk by migrating Audit Registry to Supabase first

**Finding:** AUTO-01, CONC-01

The Audit Registry is the most actively written register (every audit session
ends with an agent append). Migrate it to Supabase before any other register.

- [ ] Migrate all existing audit-registry.md rows into `public.audits` table
      (REC-01)
- [ ] Update `/finalise-local-audit.md`, `/finalise-global-audit.md`, and
      `/audit-workflow.md` to call Supabase REST API (`POST /rest/v1/audits`)
      instead of appending to the Markdown file
- [ ] Keep `audit-registry.md` as a legacy read-only page that references the
      live Supabase-backed page — annotate clearly as deprecated

---

## 🟠 High

### REC-03 [260309-governance-register-infrastructure] — Migrate NC Log and Corrective Actions to Supabase with a foreign key link

**Finding:** REF-02, AUTO-02

The NC Log and Corrective Actions Register can drift in status (both require
manual sync). A foreign key between
`nonconformities.ca_id → corrective_actions.id` enforces this structurally.

- [ ] Create `public.nonconformities` and `public.corrective_actions` tables
      with a `nonconformities.ca_id FK → corrective_actions.id` relationship
- [ ] Add a DB trigger `func_sync_nc_status_on_ca_close()` that sets
      `nonconformities.status = 'Closed'` whenever the linked
      `corrective_actions.status` transitions to `Closed` — apply
      `supabase-postgres-best-practices` `security-` rules for trigger ownership
- [ ] Apply RLS: read-only anon, write via service role
- [ ] Migrate all 4 NC entries and 3 CA entries

### REC-04 [260309-governance-register-infrastructure] — Add review-date alerting via Supabase scheduled function

**Finding:** ALERT-01, ALERT-02

No current mechanism notifies when a register review is due. A Postgres
function + pg_cron job can emit alerts.

- [ ] Add `review_due_date` and `last_reviewed_at` columns to all register
      tables
- [ ] Create a pg_cron job `func_review_date_alert()` that queries all tables
      for rows where `review_due_date < NOW() + interval '30 days'` and inserts
      a summary into a `public.review_alerts` table
- [ ] Expose `public.review_alerts` via a Docusaurus "Review Dashboard"
      component so overdue items are visible at
      `/docs/registers/review-dashboard`

### REC-05 [260309-governance-register-infrastructure] — Confirm and populate all `⚠️ Confirm` dates immediately

**Finding:** SCHEMA-02

The Asset Register and Supplier Register both have `⚠️ Confirm` in mandatory ISO
27001 date fields. This is a direct Stage 1 audit finding.

- [ ] Ryan Ammendolea to confirm and set specific dates in:
  - `docs/compliance/iso27001/operations/asset-register.md` — Effective Date and
    Next Review
  - `docs/compliance/iso27001/operations/supplier-register.md` — Effective Date
    and Next Review
- [ ] Remove all `⚠️ Confirm` placeholder text from both files
- [ ] Once migrated to Supabase (REC-03), these fields become `DATE NOT NULL`
      columns — no placeholder possible

### REC-06 [260309-governance-register-infrastructure] — Migrate Asset and Supplier Registers; normalise Supplier to horizontal format

**Finding:** SCHEMA-01, REF-03

The Supplier Register's vertical card format is structurally incompatible with
the horizontal table format used by all other registers. Migration to Supabase
resolves both the format inconsistency and the cross-reference gap between
assets and suppliers.

- [ ] Create `public.assets` and `public.suppliers` tables
- [ ] Add `public.assets.supplier_id FK → public.suppliers.id` — an asset that
      is a software/service must link to its supplier record
- [ ] Migrate all 11 assets and 6 supplier entries
- [ ] Apply `supabase-postgres-best-practices` `schema-` rules: use `TEXT` for
      all free-form fields, `DATE` for review dates, `TEXT CHECK (... IN (...))`
      for status enumerations

---

## 🟡 Medium

### REC-07 [260309-governance-register-infrastructure] — Migrate Standards Register and Register of Registers to Supabase

**Finding:** QUERY-03, TRAIL-01

The Standards Register (27 entries, created today) and Register of Registers
will grow continuously. Migrating early prevents technical debt accumulation.

- [ ] Create `public.standards` and `public.registers` tables
- [ ] Populate from the Markdown files created in this session
- [ ] Expose via Docusaurus React components with client-side filtering by
      `status`, `domain`, and `next_review_date`

### REC-08 [260309-governance-register-infrastructure] — Add row-level audit log trigger to all register tables

**Finding:** TRAIL-01

Git provides file-level history but not row-level history. A Supabase audit log
trigger addresses this gap at the row level.

- [ ] Create `public.register_audit_log` table:
      `(id, table_name, row_id, changed_by, changed_at, old_row JSONB, new_row JSONB)`
- [ ] Apply a generic `func_audit_log_trigger()` function to all governance
      register tables
- [ ] Reference `supabase-postgres-best-practices` `security-` prefix rules for
      trigger security context

### REC-09 [260309-governance-register-infrastructure] — Update Risk Register with cross-links to supplier and asset tables

**Finding:** REF-01

The Risk Register references `PROC-03`, `CA-005`, etc. as plain text. In
Supabase these become foreign keys.

- [ ] Create `public.risks` with optional FK columns: `related_asset_id`,
      `related_ca_id`, `related_nc_id`
- [ ] Migrate all 17 risk rows; populate FKs where applicable (R-008 links to
      SA-001 Supabase supplier; R-012 links to CA-005)

### REC-10 [260309-governance-register-infrastructure] — Migrate Training Records to Supabase

**Finding:** AUTO-02 (training records will grow per onboarding event)

- [ ] Create `public.training_records` table:
      `(id, staff_member, training_module, completed_date, expiry_date, evidence_url)`
- [ ] Apply RLS: read-only anon, write via service role

### REC-11 [260309-governance-register-infrastructure] — Migrate Statement of Applicability (SoA) to Supabase

**Finding:** QUERY-01 (the SoA is 93 rows — the highest-value Markdown→Supabase
migration target)

- [ ] Create `public.soa_controls` table:
      `(control_id, title, applicable BOOLEAN, justification, implementation_status, owner, last_reviewed)`
- [ ] Parse existing `soa.md` (39KB) and load all 93 controls
- [ ] Expose via a filterable Docusaurus component that supports
      `applicable = true/false` and `implementation_status` filters

---

## 🟢 Low

### REC-12 [260309-governance-register-infrastructure] — Fix debug-ci.md skill path to use absolute dev-environment reference

**Finding:** INFRA-01

- [ ] Update
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/.agents/workflows/debug-ci.md`
      line 12 — change
      `documentation/common-bond/.agents/skills/act-local-ci/SKILL.md` to
      `dev-environment/.agents/skills/act-local-ci/SKILL.md` (or the absolute
      path format used by the other three workflows)

### REC-13 [260309-governance-register-infrastructure] — Document Supabase project decision in Register of Registers

**Finding:** CONC-01

- [ ] Update `docs/registers/index.md` to add a new `ENG-REG-002` row for the
      `supabase-common-bond` Supabase project once it is created, and note it as
      the persistence layer for all governance registers

### REC-14 [260309-governance-register-infrastructure] — Create a Supabase project setup standard in Standards Register

**Finding:** SCHEMA-01

- [ ] Add `ENG-STD-011` to `docs/registers/standards-register.md` — "Supabase
      Governance Database Standard" covering schema requirements, RLS posture,
      and skill references for the `supabase-common-bond` project

### REC-15 [260309-governance-register-infrastructure] — Fix RoR classification of SoA; add clarifying note

**Finding:** SCHEMA-04

The SoA is an ISO 27001 Clause 6.1.3(d) output document, not a register in the
operational sense. Noting this distinction in the Register of Registers prevents
external audit confusion.

- [ ] Update `docs/registers/index.md` entry for `ISMS-REG-006` (SoA) to add a
      note: "ISO 27001 Clause 6.1.3(d) output document — listed here for
      discoverability; not a transactional register. See `operations/soa.md` for
      the full control matrix."

---

### REC-16 [260309-governance-register-infrastructure] — Fix audit-workflow.md stub for this repo

**Finding:** INFRA-02

The `audit-workflow.md` stub referenced Python-specific skills irrelevant to
this repo and omitted the `supabase-postgres-best-practices` skill.

- [x] Remove Python-specific skill references from
      `.agents/workflows/audit-workflow.md`
- [x] Add `supabase-postgres-best-practices` skill reference to Required Skills
      block
- [x] Add note clarifying that cross-ecosystem audits should use `/global-audit`

_Actioned in same commit as Round 1 iterative improvements._

### REC-17 [260309-governance-register-infrastructure] — Document governance data DR procedure in BCP

**Finding:** DR-01

- [ ] Update `docs/compliance/iso27001/operations/business-continuity.md` to add
      a "Governance Data Recovery" subsection:
  - Recovery dependencies: `doco-common-bond` GitHub repo (primary); Supabase
    `supabase-common-bond` PITR once created (REC-01)
  - RTO for governance registers: 4 hours (consistent with operational RTO)
  - Risk cross-reference: R-008 (Supabase supplier failure), R-012 (GitHub
    access failure)

### REC-18 [260309-governance-register-infrastructure] — Prioritise SoA Supabase migration; add filterable control dashboard

**Finding:** SOA-01

The SoA (93 rows, 39KB) is the single highest-ROI Markdown→Supabase migration
item. It must be first within Phase 6.

- [ ] Create `public.soa_controls` table:
      `(control_id, title, applicable BOOLEAN, justification,`
      `implementation_status TEXT CHECK (...IN ('Implemented', 'Partial', 'Planned',`
      `'Not Applicable')), owner, last_reviewed DATE)`
- [ ] Expose `/docs/compliance/iso27001/soa-dashboard` Docusaurus page with
      client-side filtering by `applicable` and `implementation_status`
- [ ] Include SoA completion metric: `COUNT(implemented) / COUNT(applicable)`

### REC-19 [260309-governance-register-infrastructure] — Add interim schema guard for Markdown registers

**Finding:** SCHEMA-03

Until Supabase migration is complete, a rule file provides a lightweight schema
guard.

- [ ] Create `.agents/rules/register-schema.md` defining the required column set
      for each register type: Risk Register, NC Log, CA Register, Asset
      Register, Supplier Register
- [ ] Include: "Before adding a row to any governance register, verify all
      mandatory columns are present per `.agents/rules/register-schema.md`"

---

## Deferred to Next Audit Cycle

| Item                                     | Reason Deferred                                                                                        |
| :--------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| Docusaurus SSG build-time Supabase fetch | Requires evaluating Cloudflare Pages build integration; lower priority than live client-side fetch MVP |
| pg_cron production configuration         | Requires confirming pg_cron availability in chosen Supabase plan tier                                  |

---

## Implementation Order

| Phase | Finding IDs                            | Rationale                                                                                                       |
| :---- | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| 1     | REC-01, REC-02                         | Create `supabase-common-bond` project; migrate Audit Registry first (highest write-conflict risk)               |
| 2     | REC-05, REC-16                         | Immediate compliance fixes — no infrastructure required; CEO action + workflow stub fix                         |
| 3     | REC-03, REC-06                         | Migrate NC/CA (with FK integrity), Asset and Supplier Registers                                                 |
| 4     | REC-08                                 | Add row-level audit log to all tables migrated so far                                                           |
| 5     | REC-04, REC-17                         | Add review-date alerting once all register tables exist; add DR documentation to BCP                            |
| 6     | REC-07, REC-09, REC-10, REC-11, REC-18 | Migrate Standards Register, RoR, Risk Register expansions, Training Records, SoA (highest-ROI migration target) |
| 7     | REC-12, REC-13, REC-14, REC-15, REC-19 | Low-effort housekeeping, documentation, and schema-drift interim fix                                            |
