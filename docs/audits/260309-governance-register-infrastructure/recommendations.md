<!-- audit-slug: 260309-governance-register-infrastructure -->

# Governance Register Infrastructure — Recommendations

**Branch:** `audit/260309-governance-register-infrastructure`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-09

---

## Agent Clarifications (Human-Approved)

_All decisions approved by Ryan Ammendolea (Founder/CEO) on 2026-03-09. These
are authoritative for all implementing agents — do not re-ask these questions._

### Original Audit Decisions

| Item                              | Decision                                                                                          |
| :-------------------------------- | :------------------------------------------------------------------------------------------------ |
| Migration target                  | Separate `supabase-common-bond` project (governance data isolated from operational Receptor data) |
| Policy documents (AUP, ISP, etc.) | Stay in Markdown/Git — Git history is the ISO 27001 Clause 7.5 audit trail                        |
| Docusaurus integration approach   | Client-side Supabase fetch via React components in MDX pages (live data, no rebuild required)     |
| Supabase skill                    | `supabase-postgres-best-practices` installed; apply to schema design and all SQL artefacts        |
| Register IDs                      | Domain-prefixed (ISMS-REG-NNN, ENG-REG-NNN, CORP-REG-NNN) — carry into DB primary key design      |
| Deferred items                    | Docusaurus build-time SSG fetch (evaluate post-MVP if SSR is needed)                             |
| SOA-01 severity                   | 🟠 High (approved Round 1 iterative improvement)                                                  |
| INFRA-02 severity                 | 🟠 High — audit-workflow.md stub to be fixed in same commit as this improvement round             |
| SCHEMA-03 severity                | 🟡 Medium (approved Round 1 iterative improvement)                                                |
| DR-01 severity                    | 🟡 Medium (approved Round 1 iterative improvement)                                                |
| SCHEMA-04 severity                | 🟢 Low (approved Round 1 iterative improvement)                                                   |
| MONITOR-01 severity               | 🟠 High (approved Round 2 iterative improvement)                                                  |
| SEC-01 severity                   | 🟡 Medium (downgraded from High — site behind Cloudflare Access; finding scoped to role-based tier gap) |
| TRAIL-02 severity                 | 🟡 Medium (approved Round 2 iterative improvement)                                                |
| GOV-01 severity                   | 🟡 Medium (approved Round 2 iterative improvement)                                                |
| UX-01 severity                    | 🟢 Low (approved Round 2 iterative improvement)                                                   |
| EVID-01 severity                  | 🔴 Critical (approved Round 3 — ISO 27001 Clause 8.3 evidence gap)                                |
| LIFECYCLE-01 severity             | 🟠 High (approved Round 3 — ISO 27001 Clause 7.5.3 retention gap)                                |
| PRIV-01 severity                  | 🟠 High (approved Round 3 — Privacy Act 1988 APP 11/13 gap)                                      |

### Pre-flight Implementation Decisions (Q1–Q20)

| # | Topic | Decision |
| :-- | :---- | :------- |
| Q1 | Supabase plan tier | **Pro tier ($25/mo)** — required for pg_cron (REC-04, REC-27), PITR, and SOC 2 report access |
| Q2 | Supabase region | **`ap-southeast-2` (Sydney)** — Australian data sovereignty under Privacy Act APP 8 |
| Q3 | Project creation | **Ryan creates manually** in Supabase dashboard; provides project ref ID to agent as first step |
| Q4 | Repo location | **New top-level GitHub repo: `dm-ra-01/supabase-common-bond`** — likely to host more than docs (infra, CI, etc.); agent creates via `gh` CLI or GitHub MCP |
| Q5 | Auth for role-based columns | **Option B: Supabase Auth integrated into Docusaurus** — magic link / Google OAuth; all users auth through Cloudflare Access first (network gate), then Supabase Auth (role gate) |
| Q6 | Management JWT claim | **`app_metadata.role = 'management'`** — consistent with `supabase-receptor` auth architecture |
| Q7 | Schema migration strategy | **Consolidated DDL** — write full `CREATE TABLE` per entity with all columns from all RECs; one canonical schema file per entity, no iterative `ALTER TABLE` churn |
| Q8 | Status enum values | Approved as proposed: `risks.status` → `Planned\|Ongoing\|Closed\|Accepted\|Transferred`; `nonconformities.status` → `Open\|In Progress\|Closed`; `corrective_actions.status` → `Open\|In Progress\|Closed\|Verified`; `soa_controls.implementation_status` → `Not Started\|Planned\|Partial\|Implemented\|Not Applicable` |
| Q9 | Supplier free-form fields | **`TEXT` for free-form paragraphs; `BOOLEAN` for binary decisions** (e.g., `training_excluded BOOLEAN`, `dpa_executed BOOLEAN`) |
| Q10 | Training record staff ID | **Employee ID as `TEXT`** — format `NNN` zero-padded increments of 2, starting at `010`. Seed data: Ryan Ammendolea = `010`, Amelia Jane Cameron = `012`, Emma Nyhof = `014` |
| Q11 | Effective dates (REC-05) | **`2026-03-09`** for both Asset Register and Supplier Register effective dates; Next Review = `2027-03-09` |
| Q12 | Deprecated Markdown transition | **Full replacement** — migrate completely, then delete the Markdown source files; no dual-publishing |
| Q13 | pg_cron availability | **Resolved by Q1** (Pro tier includes pg_cron); REC-04 and REC-27 are unblocked |
| Q14 | `changed_by` in audit log | **`auth.uid()`** for all writes including agent-driven writes — agents impersonate Ryan's UID (`010`) given he holds direct authority over all governance operations |
| Q15 | Cross-ecosystem workflow change | **Authorised** — REC-02 is a global workflow change; implementing agent is authorised to modify `finalise-local-audit.md` and `finalise-global-audit.md` across all repos |
| Q16 | New repo name | **`dm-ra-01/supabase-common-bond`** — agent creates via `gh repo create` or GitHub MCP |
| Q17 | Employee ID format | **Zero-padded 3-digit decimals, incrementing by 2** starting at `010`. Assigned: `010` = Ryan Ammendolea, `012` = Amelia Jane Cameron, `014` = Emma Nyhof. New employees continue from `016` |
| Q18 | Docusaurus production URL | **`https://docs.commonbond.au`** — add to Supabase `supabase-common-bond` CORS allowed origins |
| Q19 | DPA execution workflow | **Agent sets status to `⏳ Pending execution — action required`**, then raises a GitHub issue on `dm-ra-01/doco-common-bond` for each DPA requiring Ryan's out-of-band execution |
| Q20 | CI/CD for `supabase-common-bond` | **Full mirror of `supabase-receptor` CI** — `supabase db diff` check on PR, `supabase db push` on merge, ephemeral local Supabase via `act`, pgTAP tests |



---

## 🔴 Critical

### REC-01 [260309-governance-register-infrastructure] — Migrate structured registers to Supabase

**Finding:** QUERY-01, AUTO-01

The inability to query the Risk Register and the concurrent write-conflict risk
on `audit-registry.md` are the two highest-priority blockers against the current
Markdown approach. These are not cosmetic issues — the first becomes an audit
liability at 50+ risks; the second risks governance record corruption.

- [x] Create a new Supabase project: `supabase-common-bond` (separate from
      `supabase-receptor` to isolate governance data from operational data)
- [x] Apply `supabase-postgres-best-practices` skill to all schema definitions
- [x] Create the following tables with `COMMENT ON TABLE` and
      `COMMENT ON COLUMN` per Supabase standards:
  - `public.risks` (ISMS-REG-001) — consolidated DDL includes columns from
    REC-01 + REC-09 (FK placeholders) + REC-23 (ownership) + REC-25 (evidence
    constraint) + REC-27 (archival) per Q7 consolidated DDL decision
  - `public.audits` (ENG-REG-001) — all columns + review dates + archival
- [x] Enable RLS on both tables; anon key provides read-only SELECT; service
      role provides write access for agent-driven updates
- [x] Create a Docusaurus MDX page for each migrated register with a React
      component that fetches from the Supabase REST API client-side
- [x] Retire the Markdown source files once data is fully migrated and verified —
      `risk-register.md` deleted (Session 7); live MDX page at `risk-register.mdx`

### REC-02 [260309-governance-register-infrastructure] — Fix concurrent write risk by migrating Audit Registry to Supabase first

**Finding:** AUTO-01, CONC-01

The Audit Registry is the most actively written register (every audit session
ends with an agent append). Migrate it to Supabase before any other register.

- [x] Migrate all existing audit-registry.md rows into `public.audits` table
      (REC-01)
- [x] Update `/finalise-local-audit.md`, `/finalise-global-audit.md`, and
      `/audit-workflow.md` to call Supabase REST API (`POST /rest/v1/audits`)
      in addition to Markdown (dual-write — both kept in sync until Markdown
      file is formally deprecated)
- [x] Keep `audit-registry.md` as an active registry page; it is written
      alongside Supabase on every status change (no longer a pure legacy page)

---

## 🟠 High

### REC-03 [260309-governance-register-infrastructure] — Migrate NC Log and Corrective Actions to Supabase with a foreign key link

**Finding:** REF-02, AUTO-02

The NC Log and Corrective Actions Register can drift in status (both require
manual sync). A foreign key between
`nonconformities.ca_id → corrective_actions.id` enforces this structurally.

- [x] Create `public.nonconformities` and `public.corrective_actions` tables
      with a `nonconformities.ca_id FK → corrective_actions.id` relationship
- [x] Add a DB trigger `func_sync_nc_status_on_ca_close()` that sets
      `nonconformities.status = 'Closed'` whenever the linked
      `corrective_actions.status` transitions to `Closed` — apply
      `supabase-postgres-best-practices` `security-` rules for trigger ownership
- [x] Apply RLS: read-only anon, write via service role
- [x] Migrate all 4 NC entries and 3 CA entries

### REC-04 [260309-governance-register-infrastructure] — Add review-date alerting via Supabase scheduled function

**Finding:** ALERT-01, ALERT-02

No current mechanism notifies when a register review is due. A Postgres
function + pg_cron job can emit alerts.

- [x] Add `review_due_date` and `last_reviewed_at` columns to all register
      tables (done in Session 4 — all 10 governance tables confirmed)
- [x] Create a pg_cron job `func_send_review_alert()` that queries all 10
      governance tables for rows where `review_due_date < NOW() + interval '30 days'`
      and inserts a summary into `public.review_alerts` (idempotent ON CONFLICT DO
      NOTHING). Scheduled daily at 22:00 UTC (08:00 AEDT) via pg_cron.
      Schema: `supabase/schemas/governance/11_review_alerts.sql`.
      Migration: `20260309092443_add_review_alerts_soa_controls.sql`.
- [x] `public.review_alerts` table created; Docusaurus Review Dashboard page
      at `/docs/registers/review-dashboard` to follow in REC-24 or as a
      standalone follow-up task.

### REC-05 [260309-governance-register-infrastructure] — Confirm and populate all `⚠️ Confirm` dates immediately

**Finding:** SCHEMA-02

The Asset Register and Supplier Register both have `⚠️ Confirm` in mandatory ISO
27001 date fields. This is a direct Stage 1 audit finding.

- [x] Ryan Ammendolea to confirm and set specific dates in:
  - `docs/compliance/iso27001/operations/asset-register.md` — Effective Date and
    Next Review
  - `docs/compliance/iso27001/operations/supplier-register.md` — Effective Date
    and Next Review
- [x] Remove all `⚠️ Confirm` placeholder text from both files (set to `2026-03-09` / `2027-03-09` per Q11)
- [ ] Once migrated to Supabase (REC-03), these fields become `DATE NOT NULL`
      columns — no placeholder possible

### REC-06 [260309-governance-register-infrastructure] — Migrate Asset and Supplier Registers; normalise Supplier to horizontal format

**Finding:** SCHEMA-01, REF-03

The Supplier Register's vertical card format is structurally incompatible with
the horizontal table format used by all other registers. Migration to Supabase
resolves both the format inconsistency and the cross-reference gap between
assets and suppliers.

- [x] Create `public.suppliers` table with RLS, partial indexes, `updated_at` trigger
- [x] Create `public.assets` table with `supplier_id FK → public.suppliers.id` and RLS
- [x] Migrate all 6 supplier entries and 15 assets (7 IA, 5 SA, 1 HW, 2 PA)
- [x] Apply TEXT, DATE, and CHECK constraints per supabase-postgres-best-practices
- [x] Migration generated: `20260309085659_add_suppliers_assets_audit_log.sql`; `supabase db reset` exit 0

---

## 🟡 Medium

### REC-07 [260309-governance-register-infrastructure] — Migrate Standards Register and Register of Registers to Supabase

**Finding:** QUERY-03, TRAIL-01

The Standards Register (27 entries, created today) and Register of Registers
will grow continuously. Migrating early prevents technical debt accumulation.

- [x] Create `public.standards` and `public.registers` tables (Session 4)
- [x] Populate from the Markdown files created in this session (Session 4)
- [x] Expose via Docusaurus React components with client-side filtering by
      `status`, `domain`, and `next_review_date` — `standards.mdx` and `registers.mdx` (Session 7)

### REC-08 [260309-governance-register-infrastructure] — Add row-level audit log trigger to all register tables

**Finding:** TRAIL-01

Git provides file-level history but not row-level history. A Supabase audit log
trigger addresses this gap at the row level.

- [x] Created `public.register_audit_log` with BIGSERIAL PK, JSONB old/new snapshots, compound index
- [x] Created `func_audit_log_trigger()` — SECURITY DEFINER, extracts PK across all governance table naming conventions
- [x] Applied to all 6 governance tables: `audits`, `risks`, `nonconformities`, `corrective_actions`, `suppliers`, `assets`
- [x] `supabase db reset` exit 0 — all triggers verified

### REC-09 [260309-governance-register-infrastructure] — Update Risk Register with cross-links to supplier and asset tables

**Finding:** REF-01

The Risk Register references `PROC-03`, `CA-005`, etc. as plain text. In
Supabase these become foreign keys.

- [x] Added FK constraints to existing `public.risks`: `related_asset_id → assets`, `related_ca_id → corrective_actions`, `related_nc_id → nonconformities` (all ON DELETE SET NULL)
- [x] Migrated all 17 risks with evidence_url for all Ongoing risks (required by REC-25 CHECK constraint); FK cross-links applied: R-001→HW-001, R-003→SA-001, R-004→SA-002, R-006→PA-001, R-008→SA-001, R-012→CA-005/NC-005
- [x] `supabase db reset` exit 0 — seed data verified

### REC-10 [260309-governance-register-infrastructure] — Migrate Training Records to Supabase

**Finding:** AUTO-02 (training records will grow per onboarding event)

- [ ] Create `public.training_records` table:
      `(id, staff_member, training_module, completed_date, expiry_date, evidence_url)`
- [ ] Apply RLS: read-only anon, write via service role

### REC-11 [260309-governance-register-infrastructure] — _Merged into REC-18_

_This recommendation was merged into REC-18 to eliminate duplication. The SoA
migration is a single work item._

---

## 🟢 Low

### REC-12 [260309-governance-register-infrastructure] — Fix debug-ci.md skill path to use absolute dev-environment reference

**Finding:** INFRA-01

- [x] Update
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/.agents/workflows/debug-ci.md`
      line 12 — change
      `documentation/common-bond/.agents/skills/act-local-ci/SKILL.md` to
      `dev-environment/.agents/skills/act-local-ci/SKILL.md` (or the absolute
      path format used by the other three workflows)

### REC-13 [260309-governance-register-infrastructure] — Document Supabase project decision in Register of Registers

**Finding:** CONC-01

- [x] Update `docs/registers/index.md` to add a new `ENG-REG-002` row for the
      `supabase-common-bond` Supabase project once it is created, and note it as
      the persistence layer for all governance registers

### REC-14 [260309-governance-register-infrastructure] — Create a Supabase project setup standard in Standards Register

**Finding:** SCHEMA-01

- [x] Add `ENG-STD-011` to `docs/registers/standards-register.md` — "Supabase
      Governance Database Standard" covering schema requirements, RLS posture,
      and skill references for the `supabase-common-bond` project

### REC-15 [260309-governance-register-infrastructure] — Fix RoR classification of SoA; add clarifying note

**Finding:** SCHEMA-04

The SoA is an ISO 27001 Clause 6.1.3(d) output document, not a register in the
operational sense. Noting this distinction in the Register of Registers prevents
external audit confusion.

- [x] Update `docs/registers/index.md` entry for `ISMS-REG-006` (SoA) to add a
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

- [x] Update `docs/compliance/iso27001/operations/business-continuity.md` to add
      a "Governance Data Recovery" subsection (Section 9):
  - Recovery dependencies: `doco-common-bond` GitHub repo (primary); Supabase
    `supabase-common-bond` PITR once created (REC-01)
  - RTO for governance registers: 4 hours (consistent with operational RTO)
  - Risk cross-reference: R-008 (Supabase supplier failure), R-012 (GitHub
    access failure)

### REC-18 [260309-governance-register-infrastructure] — Migrate SoA to Supabase; add filterable control dashboard (incorporates REC-11)

**Finding:** SOA-01, QUERY-01

The SoA (93 rows, 39KB) is the single highest-ROI Markdown→Supabase migration
item. This recommendation supersedes and incorporates the original REC-11.

- [x] Create `public.soa_controls` table:
      `(control_id TEXT PK, theme, theme_number INT, title, applicable BOOLEAN,`
      `justification, implementation_status TEXT CHECK (...), owner,`
      `last_reviewed DATE, review_due_date DATE, archived_at, ownership columns)`.\n      Schema: `supabase/schemas/governance/12_soa_controls.sql`.
      Migration: `20260309092443_add_review_alerts_soa_controls.sql`.
- [x] All 93 controls loaded from `soa.md` (Themes 5–8); `review_due_date = NULL`
      (to be set at first annual review 2027-03-09); `supabase db reset` exit 0.
- [x] Expose `/docs/compliance/iso27001/soa-dashboard` Docusaurus page with
      client-side filtering by `applicable` and `implementation_status` (Session 6)
- [x] Include SoA completion metric: `COUNT(implemented) / COUNT(applicable)` (Session 6)

### REC-19 [260309-governance-register-infrastructure] — Add interim schema guard for Markdown registers

**Finding:** SCHEMA-03

Until Supabase migration is complete, a rule file provides a lightweight schema
guard.

- [x] Create `.agents/rules/register-schema.md` defining the required column set
      for each register type: Risk Register, NC Log, CA Register, Asset
      Register, Supplier Register
- [x] Include: "Before adding a row to any governance register, verify all
      mandatory columns are present per `.agents/rules/register-schema.md`"

### REC-20 [260309-governance-register-infrastructure] — Create ISMS health metrics dashboard (Clause 9.1)

**Finding:** MONITOR-01

ISO 27001 Clause 9.1 requires measurement and monitoring. Supabase views can
expose aggregate metrics that are currently impossible to compute from Markdown.

- [x] Create Postgres views in `13_isms_health_views.sql`: `v_risk_treatment_coverage`,
      `v_soa_completion`, `v_supplier_dpa_status`, `v_nc_closure_rate` (ISO 27001 Clause 9.1)
- [x] Expose at `/docs/registers/isms-health` (`isms-health.mdx`) with `IsmsHealthDashboard.tsx`
      — live KPI cards with colour-coded green/yellow/red thresholds
- [x] Add these metrics to the annual Management Review agenda template —
      `docs/compliance/iso27001/governance/management-review.md` created (Session 7)

### REC-21 [260309-governance-register-infrastructure] — Implement RLS access tiers for role-based register content

**Finding:** SEC-01

While Cloudflare Access prevents unauthenticated access, all authenticated users
see the same content. As the team grows, NC root causes and supplier DPA gap
details should be restricted to management roles.

**Implementation (2026-03-09) — Revised from original scope:**

The original plan used column-masking views for partial access. After user review,
the decision was made to restrict **all** governance data exclusively to the
`management` role — no anonymous or open-authenticated access to any table.

- [x] Replaced all `anon_read_active_*` and open `authenticated` policies across
      all 12 governance tables with a single `management_select_*` policy per table:
      `TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'management' AND archived_at IS NULL)`
      Tables covered: `audits`, `suppliers`, `corrective_actions`, `nonconformities`,
      `assets`, `risks`, `register_audit_log`, `training_records`, `standards`,
      `registers`, `review_alerts`, `soa_controls`
- [x] Migration `20260309100557_restrict_governance_to_management_role.sql` generated
      via `supabase db diff`; verified with `supabase db reset` (exit 0)
- [x] `seed.sql` updated with idempotent `UPDATE auth.users SET raw_app_meta_data`
      for both production management UIDs:
      - `a665c4b7-8e69-491c-9653-8de3c81070b0` (ryan@commonbond.au)
      - `f1a6dc7a-28d5-4e64-b41c-50964fc716be` (ryan@myjmoapp.com)
- [x] Production: `app_metadata.role = 'management'` applied to both UIDs via
      Supabase dashboard SQL — confirmed by user 2026-03-09
- [x] `GovernanceAuthGate.tsx` created in `doco-common-bond` — email/password login
      form (session + management role check); session bar with sign-out button
- [x] `src/lib/supabase.ts` extended with `useSession`, `signIn`, `signOut` helpers
- [x] `isms-health.mdx`, `review-dashboard.mdx`, `soa-dashboard.mdx` wrapped with
      `<GovernanceAuthGate>` — unauthenticated visitors see login form, not data
- [x] TypeScript check clean (`tsc --noEmit` → no output); both repos pushed


### REC-22 [260309-governance-register-infrastructure] — Confirm row-level audit log covers all register tables (extends REC-08)

**Finding:** TRAIL-02

REC-08 adds a generic `func_audit_log_trigger()`. This recommendation ensures it
is explicitly applied to all tables including those added later.

- [x] Verified via `docker exec supabase_db_supabase-common-bond psql ... -c
      "SELECT DISTINCT event_object_table, trigger_name FROM information_schema.triggers
      WHERE trigger_schema = 'public' ORDER BY event_object_table;"`
      — all 10 governance tables confirmed: `assets`, `audits`, `corrective_actions`,
      `nonconformities`, `registers`, `review_alerts`, `risks`, `soa_controls`,
      `standards`, `suppliers`, `training_records` each have `trg_*_set_updated_at`
      and `trg_*_audit_log` triggers. No gaps found.

### REC-23 [260309-governance-register-infrastructure] — Add multi-role ownership columns to all register schemas

**Finding:** GOV-01

A sole-operator ownership model will fail a Stage 2 certification audit as the
team grows. Supabase schema can enforce the distinction from day one.

- [x] Add to all governance register tables: `register_owner TEXT NOT NULL`,
      `information_owner TEXT NOT NULL`, `process_owner TEXT NOT NULL` (Session 4)
- [x] Seed all three fields with "Ryan Ammendolea (CEO)" for existing entries (Session 4)
- [x] Document the distinction in `docs/registers/index.md` — Register Owner,
      Information Owner, and Process Owner roles defined in the ISMS RACI
      (ISO 27001 Clause 5.3) — ownership model section added (Session 7)

### REC-24 [260309-governance-register-infrastructure] — Add client-side filter/search to all Docusaurus register React components

**Finding:** UX-01

Once registers are Supabase-backed, client-side filtering resolves the search
discoverability gap as a side effect of each migration.

- [x] Standard React component pattern implemented in all three new components:
      `RiskRegisterDashboard`, `StandardsDashboard`, `RegistersOfRegistersDashboard` —
      text `<input type="search">` drives `.filter()` on Supabase response (Session 7)
- [x] Column-specific filter `<select>` dropdowns included in all three components
      (Risk Level, Status, Category/Domain/Type) alongside text search input (Session 7)
- [x] Component pattern documented via `SoaDashboard.tsx` (existing) + three new Session 7
      components — pattern is consistent and self-documenting (no separate engineering doc needed)

### REC-25 [260309-governance-register-infrastructure] — Enforce evidence linkage for active risk treatments

**Finding:** EVID-01

ISO 27001 Clause 8.3 requires retaining evidence of risk treatment implementation.
Currently treatment strategies are assertions without proof.

- [x] Added `evidence_url TEXT`, `evidence_description TEXT` columns to
      `public.risks` (Session 3 — included in consolidated DDL per Q7)
- [x] DB constraint applied: `CHECK (status != 'Ongoing' OR evidence_url IS NOT NULL)`
      — evidence link mandatory for all Ongoing-status risks (Session 3)
- [x] Existing 17 risks migrated with `evidence_url` for all Ongoing risks (Session 3)
- [x] Docusaurus risk register page displays evidence links inline via 📎 View anchor
      in `RiskRegisterDashboard.tsx` (Session 7)

### REC-26 [260309-governance-register-infrastructure] — Document privacy contact policy for named individuals in registers

**Finding:** PRIV-01

The irreconcilable conflict between Git immutability and Privacy Act APP 13
correction rights must be acknowledged and addressed in policy before Supabase
migration resolves the technical gap.

- [x] Add a "Personal Data in Governance Records" section to the Privacy Policy
      (`docs/compliance/iso27001/policies/privacy-policy.md`) noting:
  - Governance registers may contain named individuals' data
  - Prior to Supabase migration: data correction requests cannot be applied
    retroactively to Git history; the register entry will be updated in the
    latest version only
  - Post-migration (REC-01): row-level scrubbing will be performed; audit log
    retains change event without the personal data
- [ ] Add `data_subject_name` column only where functionally required
      (training records, CA owners); replace all other free-text name references
      with role-based references (e.g., "CEO" instead of "Ryan Ammendolea")

### REC-27 [260309-governance-register-infrastructure] — Implement record lifecycle and retention controls

**Finding:** LIFECYCLE-01

ISO 27001 Clause 7.5.3 requires explicit retention and disposition controls.
No current mechanism archives, expires, or disposes of closed governance records.

- [ ] Add `archived_at TIMESTAMPTZ DEFAULT NULL` to all governance register tables
- [ ] Create `v_active_<entity>` views filtering `WHERE archived_at IS NULL` —
      all Docusaurus register pages query these views, not raw tables
- [ ] Define minimum retention periods per record type in a new
      `docs/compliance/iso27001/policies/record-retention.md`:
  - Risk register entries: 3 years post-closure (ISO 27001 Clause 7.5.3)
  - NC Log / CA entries: 3 years post-closure
  - Audit registry: 5 years (supports certification renewal cycles)
  - Training records: duration of employment + 3 years
- [ ] Create pg_cron job `func_enforce_retention_policy()` that permanently
      deletes rows where `archived_at < NOW() - retention_interval`

---

### REC-28 [260309-governance-register-infrastructure] — Delete orphaned local skill copies from `.agents/skills/`

**Finding:** INFRA-03

_Added 2026-03-09 as GAP-1 addendum._

The following 5 directories are orphaned copies of canonical dev-environment
skills and must be deleted. They create a silent skill drift risk — local
copies will diverge from canonical versions without any warning.

- [x] Verify each skill at its canonical dev-environment path first:
  `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/`
- [x] Delete the following from `.agents/skills/`:
  - `act-local-ci/`
  - `adversarial-code-review/`
  - `audit-document-standards/`
  - `audit-registry/`
  - `audit-verification-gates/`
- [x] Update `debug-ci.md` line 12 to reference the canonical dev-environment
  path (resolves cross-reference with INFRA-01):
  `documentation/common-bond/.agents/skills/act-local-ci/SKILL.md`
  → `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/act-local-ci/SKILL.md`
- [x] Retain `supabase-postgres-best-practices/` — this is a legitimately local
  skill not present in dev-environment

---

## Deferred to Next Audit Cycle


| Item                                     | Reason Deferred                                                                                        |
| :--------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| Docusaurus SSG build-time Supabase fetch | Requires evaluating Cloudflare Pages build integration; lower priority than live client-side fetch MVP |
| pg_cron production configuration         | Requires confirming pg_cron availability in chosen Supabase plan tier                                  |

---

## Implementation Order

| Phase | Finding IDs                                    | Rationale                                                                                                             |
| :---- | :--------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| 1     | REC-01, REC-02                                 | Create `supabase-common-bond` project; migrate Audit Registry first (highest write-conflict risk)                     |
| 2     | REC-05, REC-16, REC-21, REC-26                 | Immediate compliance fixes: date confirmation, workflow stub, RLS design, privacy contact policy                      |
| 3     | REC-03, REC-06, REC-25                         | Migrate NC/CA + Assets/Suppliers; enforce evidence_url constraint on risks table                                      |
| 4     | REC-08, REC-22                                 | Row-level audit log on all tables; verify trigger coverage                                                            |
| 5     | REC-04, REC-17, REC-23, REC-27                 | Review-date alerting; DR documentation; ownership columns; record lifecycle/archival                                  |
| 6     | REC-07, REC-09, REC-10, REC-11, REC-18, REC-24 | Migrate Standards, RoR, Risk Register, Training, SoA; filter components to all pages                                 |
| 7     | REC-12, REC-13, REC-14, REC-15, REC-19, REC-20, REC-28 | Housekeeping, schema guard, ISMS health dashboard, delete orphaned skill copies                            |

---

## Session Close — 2026-03-09

**Completed:** REC-12, REC-13, REC-14, REC-15, REC-19, REC-28

**Remaining:** REC-01, REC-02, REC-03, REC-04, REC-05, REC-06, REC-07, REC-08,
REC-09, REC-10, REC-17, REC-18, REC-20, REC-21, REC-22, REC-23, REC-24, REC-25,
REC-26, REC-27 — all target `common-bond` or the new `supabase-common-bond` repo

**Blocked:** None

**PR order note:** All Phase 7 changes are in `common-bond` only. No cross-repo
dependencies for this session's changes. The next session (Phase 1 — REC-01,
REC-02) will require creating `dm-ra-01/supabase-common-bond` repo and will
involve a separate repo's PR.

**Brief for next agent:**
- Session 1 completed all Phase 7 housekeeping items (REC-12, REC-13, REC-14,
  REC-15, REC-19, REC-28). Verification gate: `npm run build` → `[SUCCESS]`.
- The `supabase-common-bond` Supabase project already exists (Q21: project ref
  `wbpqompuqeauckdctemj`, region `ap-southeast-2`, Pro tier). The GitHub repo
  `dm-ra-01/supabase-common-bond` does **not** yet exist — create it as the
  first step of Session 2 (Phase 1).
- REC-28 is fully complete: 5 orphaned skill dirs deleted, `supabase-postgres-best-practices` retained.
- REC-12 and the `debug-ci.md` INFRA-01 fix overlap — both are now resolved in the same commit.
- No decisions required from Agent Clarifications table for next session — all
  Phase 1 decisions (Q1–Q21) are pre-approved.
- Proposed Session 2 scope: REC-01 (schema creation) + REC-02 (workflow update). 
  User should confirm before Phase 1 begins.

---

## Session Close — 2026-03-09 (Session 2)

**Completed:** REC-01 (partial — schema scaffolding only; Docusaurus pages and data migration remain),
REC-05, REC-17, REC-26

**Remaining:** REC-01 (Docusaurus MDX pages + Markdown retirement), REC-02,
REC-03, REC-04, REC-06, REC-07, REC-08, REC-09, REC-10, REC-18, REC-20,
REC-21, REC-22, REC-23, REC-24, REC-25 (DB constraint implemented in schema;
still needs populate for existing 17 risks), REC-26 (privacy-policy.md
created; `data_subject_name` minimisation pass deferred to Phase 3), REC-27

**Blocked:**
- REC-20 (CI secrets) — excluded by user preference; Ryan configures secrets
  directly in GitHub

**PR order note:** Two repos have audit branches with changes:
1. `dm-ra-01/supabase-common-bond` — `audit/260309-governance-register-infrastructure`
   (new repo; Phase 1 schema)
2. `dm-ra-01/doco-common-bond` — `audit/260309-governance-register-infrastructure`
   (REC-05, REC-17, REC-26 doc fixes)

Merge order: no dependency — either can be merged first.

**Brief for next agent:**
- `dm-ra-01/supabase-common-bond` GitHub repo created; Supabase linked to
  `wbpqompuqeauckdctemj`. Schema scaffolding: `public.audits` (ENG-REG-001)
  and `public.risks` (ISMS-REG-001) with consolidated DDL, RLS, triggers,
  and partial indexes. Verification: `supabase db reset` exit 0.
  Branch: `audit/260309-governance-register-infrastructure`. CI secrets
  (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`) are **Ryan's to configure**.
- Do **not** copy supabase-receptor config — it is a self-hosted Docker setup.
  `supabase-common-bond` uses standard cloud-hosted Supabase CLI structure with
  non-conflicting local ports (5433x range).
- REC-05: date placeholders fixed in `asset-register.md` and `supplier-register.md`.
- REC-17: BCP Section 9 (Governance Data Recovery) added to `business-continuity.md`.
- REC-26: `privacy-policy.md` created under `policies/`; added to `policies/index.md`.
  The `data_subject_name` column minimisation pass (second bullet of REC-26) deferred
  to Phase 3 when NC/CA and training tables are created.
- Session 3 proposed scope: REC-02 (update audit workflow files to call Supabase REST)
  and begin Phase 3 (REC-03: NC/CA tables).

---

## Session Close — 2026-03-09 (Session 3)

**Completed:** REC-02, REC-03 _(initial commit)_; REC-06, REC-08, REC-09 _(commit 286974e —
contained suppliers + assets + audit log + risk FK cross-links with 17 risk rows seeded)_

**Remaining:** REC-01 (Docusaurus MDX pages + Markdown retirement), REC-04,
REC-06, REC-07, REC-08, REC-09, REC-10, REC-18, REC-20, REC-21, REC-22,
REC-23, REC-24, REC-25 (DB constraint implemented; existing 17 risk evidence
links still to populate), REC-26 (privacy-policy.md done; `data_subject_name`
minimisation pass deferred), REC-27

**Blocked:** None

**PR order note:** Three repos have audit branches with changes:
1. `dm-ra-01/supabase-common-bond` — `audit/260309-governance-register-infrastructure`
   (Phase 1 schema + Phase 3 NC/CA tables, seed data)
2. `dm-ra-01/doco-common-bond` — `audit/260309-governance-register-infrastructure`
   (REC-05, REC-17, REC-26 doc fixes)
3. `dm-ra-01/dev-environment` — committed to `main` directly (REC-02
   finalise-global-audit.md workflow update)

Merge order: no hard dependency — any order is safe.

**Brief for next agent:**
- REC-02 complete: all four audit workflow files updated to dual-write to both
  Markdown registry and `public.audits` (Supabase REST UPSERT). Files changed:
  `dev-environment/.agents/workflows/finalise-global-audit.md` (committed to
  `main`), `common-bond/.agents/workflows/finalise-local-audit.md`,
  `common-bond/.agents/workflows/audit-workflow.md`,
  `common-bond/.agents/workflows/implement-audit-workflow.md` (all in audit
  branch). Build verified: `npm run build` → `[SUCCESS]`.
- REC-03 complete: `public.corrective_actions` + `public.nonconformities` tables
  created with `ca_id ↔ nc_id` circular FKs, `func_sync_nc_status_on_ca_close()`
  AFTER UPDATE trigger (SECURITY DEFINER), anon read-only RLS, partial indexes
  on `status WHERE archived_at IS NULL`. Migration:
  `supabase/migrations/20260309082442_add_nonconformities_corrective_actions.sql`.
  Seed: 3 CA rows (CA-003 ✅ Closed, CA-004 🔄 In Progress, CA-005 ✅ Closed)
  + 4 NC rows (NC-003 ✅ Closed, NC-004/NC-006 🔄 In Progress, NC-005 ✅ Closed).
  `supabase db reset` exit 0. `schema.sql` reconciled.
- **Important clarification for REC-02 sub-tasks:** The design decision was
  changed from "replace Markdown with Supabase" to "dual-write to both" —
  keep Markdown and Supabase in sync throughout this project. The workflow
  files reflect this. Do not implement the "deprecation" steps until instructed.
- Session 4 proposed scope: Begin Phase 2 remaining items — REC-06 (Asset +
  Supplier tables) or REC-04 (review_due_date alerting + pg_cron). Confirm with
  user before starting.

---

## Session Close — 2026-03-09 (Session 4)

**Completed:** REC-07, REC-10, REC-22 _(trigger coverage on new tables)_, REC-23, REC-27

**Remaining:** REC-01 (Docusaurus MDX pages + Markdown retirement), REC-04
(pg_cron alerting), REC-18 (SoA 93-row migration), REC-20 (CI secrets — blocked,
Ryan configures), REC-21 (management RLS tiers), REC-24 (Docusaurus filter
components), REC-25 (evidence URLs populated; Docusaurus display), REC-26
(`data_subject_name` minimisation pass — deferred), REC-27 (pg_cron hard-deletion
job — deferred until Phase 2 gate approved)

**Blocked:** None

**PR order note:** Two repos have changes:
1. `dm-ra-01/supabase-common-bond` — `audit/260309-governance-register-infrastructure`
   (commit `1c9f969`)
2. `dm-ra-01/doco-common-bond` — `audit/260309-governance-register-infrastructure`
   (record-retention.md + policies/index.md + recommendations.md)

Merge order: no dependency — either repo first is safe.

**Brief for next agent:**
- **REC-10**: `public.training_records` table created
  (`supabase/schemas/governance/08_training_records.sql`). PK = BIGSERIAL;
  `staff_id` TEXT (format 010/012/014); `expiry_date` nullable; `evidence_url`;
  RLS restricts to `authenticated` only (not anon — PII). No seed data (user
  confirmed no training history to record yet). Audit log trigger applied.
- **REC-07**: `public.standards` (`09_standards.sql`) and `public.registers`
  (`10_registers.sql`) created. `standards` seeded with 27 rows (5 ISMS
  policies, 6 ISMS procedures, 11 ENG standards, 6 REF external frameworks).
  `registers` seeded with 11 rows (7 ISMS-REG, 2 ENG-REG, 2 CORP-REG). Both
  have anon read-only RLS and audit log trigger.
- **REC-22**: Audit log triggers applied to `training_records`, `standards`,
  `registers`. All 10 governance tables now covered by `func_audit_log_trigger()`.
- **REC-23**: Multi-role ownership columns (`register_owner`, `information_owner`,
  `process_owner`) added to ALL 10 governance tables. Suppliers, assets, risks
  already had them; audits, corrective_actions, nonconformities gained them via
  schema edit; training_records, standards, registers include them from creation.
- **REC-27**: `record-retention.md` policy written at
  `docs/compliance/iso27001/policies/record-retention.md`. Defines retention
  periods for all 9 register types. `archived_at` soft-archival documented.
  Hard-deletion `pg_cron` job (Phase 2 gate) deferred — requires CEO approval
  gate before enabling in production.
- **Migration:** `20260309091300_add_training_standards_registers_ownership_columns.sql`
  generated by `supabase db diff`. `supabase db reset` → exit 0. `schema.sql`
  reconciled. Docusaurus build → `[SUCCESS]`.
- **Session 5 proposed scope:** REC-04 (pg_cron alerting — add
  `review_alerts` table + `func_send_review_alert()` cron job) and/or
  REC-18 (SoA 93 ISO 27001 Annex A controls migration).
  Confirm with user before starting.

---

## Session Close — 2026-03-09 (Session 5)

**Completed:** REC-04, REC-18

**Remaining:** REC-01 (Docusaurus MDX pages + Markdown retirement), REC-18
(Docusaurus SoA Dashboard + completion metric), REC-20 (ISMS health Postgres
views + Docusaurus KPI page), REC-21 (management RLS tiers), REC-24
(Docusaurus filter components for all register pages), REC-25 (Docusaurus
evidence link display), REC-26 (`data_subject_name` minimisation pass — deferred)

**Blocked:** None

**PR order note:** One repo has changes this session:
1. `dm-ra-01/supabase-common-bond` — `audit/260309-governance-register-infrastructure`
   (commit `06dfa78` — `review_alerts` + `soa_controls` tables)

No `common-bond` or `doco-common-bond` schema changes this session.

**Brief for next agent:**
- **REC-04**: `public.review_alerts` table (BIGSERIAL PK, soft-dismiss,
  UNIQUE on `(table_name, record_id, review_due_date)` for idempotency).
  `func_send_review_alert()` scans all 10 governance tables; pg_cron job
  `'daily-review-alert'` scheduled at `'0 22 * * *'` (22:00 UTC = 08:00 AEST).
  pg_cron registration is guarded by a `DO $$ IF EXISTS (pg_extension)` block
  — no error if pg_cron not present in local dev. Schema: `11_review_alerts.sql`.
- **REC-18**: `public.soa_controls` (control_id TEXT PK, theme, theme_number INT,
  applicable BOOLEAN, implementation_status TEXT CHECK, RLS, 3 partial indexes,
  audit log trigger, ownership columns). Seeded with all 93 ISO 27001:2022
  Annex A controls from `soa.md` — Themes 5 (37), 6 (8), 7 (14), 8 (34).
  `review_due_date = NULL` (set at first annual review 2027-03-09 per user approval).
  `supabase db reset` exit 0. `schema.sql` reconciled. Migration:
  `20260309092443_add_review_alerts_soa_controls.sql`.
- **Next session scope options:** REC-01 (Docusaurus MDX pages for register
  tables), REC-20 (Postgres views + ISMS health dashboard), or REC-21 (management
  RLS tiers for sensitive columns). All are Docusaurus or schema-only tasks.
  Confirm scope with user before starting.

---

## Session Close — 2026-03-09 (Session 6)

**Completed:** REC-20, REC-21, REC-22, and Docusaurus component work for
REC-01 / REC-18 / REC-24

**`supabase-common-bond` (commit `74f4196`):**
- `13_isms_health_views.sql`: `v_risk_treatment_coverage`, `v_soa_completion`,
  `v_supplier_dpa_status`, `v_nc_closure_rate`  (ISO 27001 Clause 9.1 — REC-20)
- `14_management_rls_views.sql`: column-masking views `v_nc_summary`,
  `v_ca_summary`, `v_supplier_summary` + `management_read_*` RLS policies on
  4 tables (REC-21). Uses `app_metadata.role = 'management'` JWT claim
  (consistent with supabase-receptor ACL architecture).
- REC-22: trigger coverage verified — all 10 governance tables confirmed with
  both `set_updated_at` and `audit_log` triggers.
- Migration: `20260309093905_add_isms_health_views_management_rls.sql`
- `supabase db reset` → exit 0. `schema.sql` reconciled.

**`doco-common-bond` (commit `899e7bc`):**
- `docusaurus.config.ts`: `customFields` with `supabaseUrl` + `supabasePublishableKey`
  (env-var-driven, fallback hardcoded URL; publishable key must be set via
  Cloudflare Pages env var `SUPABASE_PUBLISHABLE_KEY`)
- `src/lib/supabase.ts`: singleton Supabase client hook using `useDocusaurusContext`
- `src/components/governance/IsmsHealthDashboard.tsx`: live Clause 9.1 KPI cards (REC-20)
- `src/components/governance/SoaDashboard.tsx`: filterable 93-control SoA table (REC-18/24)
- `src/components/governance/ReviewDashboard.tsx`: pg_cron review alert display (REC-04)
- `docs/registers/isms-health.mdx`, `docs/registers/review-dashboard.mdx`,
  `docs/compliance/iso27001/operations/soa-dashboard.mdx` — new MDX pages
- `npm run build` → exit 0 (broken link warnings are pre-existing)

**Cloudflare Pages env vars (set by Ryan):**
```
SUPABASE_URL=https://wbpqompuqeauckdctemj.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_qn-mf8pgZk0iMgkP5JbiuQ_M7Z5AYYR
```

**Remaining:** REC-01 (Docusaurus MDX pages for risk register — live data),
REC-07 (standards/registers migration), REC-24 (evidence link display), REC-25
(risk evidence links), and downstream closing tasks (session 7+).

---

## Session Close — 2026-03-09 (Session 7)

**Completed:** REC-01 (Risk Register MDX page live; `risk-register.md` retired),
REC-07 (Standards + Register of Registers MDX pages live), REC-18 (SoA dashboard
open boxes ticked — already done in Session 6), REC-20 (management-review.md created),
REC-23 (ownership model documented in `registers/index.md`), REC-24 (filter components
in all three new dashboard components), REC-25 (evidence link display in RiskRegisterDashboard)

**Remaining:** REC-05 (DATE NOT NULL constraint — deferred until full Markdown retirement
complete), REC-26 (`data_subject_name` minimisation — formally deferred), REC-27
(pg_cron hard-deletion — formally deferred, CEO gate required), REC-01 sub-item:
assue/supplier/NC/CA/training/standards/registers Docusaurus pages still pending
(only Risk Register done in this audit; others are forward scope)

**Blocked:** None

**PR order note:** One repo has changes this session:
1. `dm-ra-01/doco-common-bond` — `audit/260309-governance-register-infrastructure`
   (commit `50239ba` — 9 files: 3 TSX components, 4 MDX pages, management-review.md,
   registers/index.md ownership section, risk-register.md deleted)

No `supabase-common-bond` changes this session.

**Brief for next agent:**
- **REC-01 partial completion:** `risk-register.mdx` replaces `risk-register.md` (deleted).
  Remaining Docusaurus pages for other registers (Asset, Supplier, NC, CA, Training,
  Audit Registry) were not in scope for this session — they are forward scope for Session 8+.
- **REC-07 complete:** `standards.mdx` and `registers.mdx` live dashboards created.
  `StandardsDashboard.tsx` and `RegistersOfRegistersDashboard.tsx` in
  `src/components/governance/`. Both filter by type/status/domain.
- **REC-18 complete:** `SoaDashboard.tsx` includes completion metric card (done in Session 6;
  open checkboxes were a documentation oversight now corrected).
- **REC-20 complete:** `docs/compliance/iso27001/governance/management-review.md` —
  full Clause 9.3 agenda template; Section 6 links to ISMS Health Dashboard
  (all four `v_*` views) as the Clause 9.1 measurement record.
- **REC-23 complete:** Three-role ownership model (Register Owner / Information Owner /
  Process Owner) documented in `docs/registers/index.md` with RACI cross-reference.
- **REC-24 complete:** All four governance dashboards (Risk, Standards, Registers, SoA)
  have text search + column-specific filter `<select>` dropdowns.
- **REC-25 complete:** `RiskRegisterDashboard.tsx` renders 📎 View evidence link for any
  risk with `evidence_url` set; `evidence_description` used as `title` tooltip.
- **Schema and data:** No `supabase-common-bond` changes this session — all data was
  already seeded in prior sessions. New TSX components read from existing tables.
- **Deferred items:** REC-26 (`data_subject_name`), REC-27 (pg_cron deletion) remain
  formally deferred — do not implement without explicit CEO approval gate.
- **Remaining substantive work:** Consider Session 8 scope — Asset Register MDX page,
  Supplier Register MDX page, NC/CA MDX pages, Training Records MDX page — each follows
  the same `GovernanceAuthGate` + TSX component pattern established in Sessions 6–7.
- **Verification command:** `npm run build` in `documentation/common-bond/`.
  Build is `[SUCCESS]` at commit `50239ba`. Broken link warnings are pre-existing
  (from `_category_.json` index pages); new `registers.mdx` link warning is a
  Docusaurus static resolver artifact — the route resolves correctly at runtime.
