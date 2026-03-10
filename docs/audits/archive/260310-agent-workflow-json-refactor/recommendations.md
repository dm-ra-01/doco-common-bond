<!-- audit-slug: 260310-agent-workflow-json-refactor -->

# Recommendations — Agent Workflow JSON Refactor

**Branch:** `audit/260310-agent-workflow-json-refactor`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-10

---

## Agent Clarifications (Human-Approved)

| Item                   | Decision                                                                                                                               |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| JSON location          | `recommendations.json` lives alongside `audit.md` in the same audit directory; NOT stored in `.agents/` (that stays SKILL.md-driven)   |
| Schema ownership       | A canonical JSON schema (`recommendations.schema.json`) lives in `dev-environment/.agents/schemas/` and is referenced by all workflows |
| Migration scope        | New audits produce JSON-native; existing open audits remain in markdown until closed (no retroactive migration)                        |
| Markdown preserved for | `audit.md` remains markdown — it is a human document, not a data store                                                                 |
| Iterative suggestions  | `status: "proposed"` items in the JSON represent pending suggestions; `status: "accepted"` on human approval                           |
| `recommendations.md`   | Still generated as a **human-readable rendered view** from the JSON — markdown becomes the output, not the source of truth             |

---

## 🔴 Critical

### PROC-01: Replace `recommendations.md` checkbox logic with JSON data model

Affects: `dev-environment/.agents/skills/audit-document-standards/SKILL.md`

Every new audit must produce a `recommendations.json` alongside `audit.md`. The
JSON file is the authoritative source of truth for finding state. A companion
`recommendations.md` may be rendered from it for human readability, but
implementation agents must read/write JSON — not markdown.

- [x] Define canonical JSON schema at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/recommendations.schema.json`
      covering: `auditSlug`, `findings[]` (each with `id`, `severity`, `status`,
      `category`, `repo`, `description`, `tasks[]`), `clarifications[]`,
      `implementationPhases[]`, `deferred[]`

- [x] Update `audit-document-standards/SKILL.md` to require
      `recommendations.json` as the primary artefact, with `recommendations.md`
      as an optional rendered view at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

- [x] Add a utility script `scripts/render-recommendations.sh` (or `.py`) in
      `.agents/` that renders `recommendations.json` → `recommendations.md` for
      human review, committed to
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/render-recommendations.py`

### PROC-02: Enforce uniqueness constraint on Implementation Order sections

Affects: `dev-environment/.agents/skills/audit-document-standards/SKILL.md`

The duplicate Implementation Order heading is a documented failure mode
(SKILL.md line 188). In the JSON model, `implementationPhases` is a top-level
array — uniqueness is structurally enforced by the schema, not by agent
discipline.

- [x] Add a `validate-recommendations.py` script in
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/validate-recommendations.py`
      that validates `recommendations.json` against
      `recommendations.schema.json` using Python `jsonschema` and exits non-zero
      on failure

- [x] Update `global-audit.md` Step 4 and `implement-global-audit.md` Step 4 to
      run `python .agents/scripts/validate-recommendations.py` before any commit
      touching `recommendations.json` in
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/global-audit.md`
      and
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/implement-global-audit.md`

---

## 🟠 High

### PROC-03: Replace `<!-- audit-slug -->` comment with a structured `auditSlug` field

Affects: `dev-environment/.agents/skills/audit-document-standards/SKILL.md`

The HTML comment is the only machine-readable anchor in the current format. In
the JSON model, `auditSlug` is a required top-level field — guaranteed present
and queryable.

- [x] Update `audit-document-standards/SKILL.md` to document that `auditSlug` is
      a required top-level field in `recommendations.json` (not an HTML comment
      in a markdown file) at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

### PROC-04: Update `implement-global-audit.md` task-scanning step to query JSON

Affects: `dev-environment/.agents/workflows/implement-global-audit.md`

Step 1.7 currently instructs agents to scan for `- [ ]` checkboxes. Replace with
a JSON query pattern for `tasks[].status === "open"`.

- [x] Rewrite Step 1.7 in `implement-global-audit.md` to: "Identify uncompleted
      tasks by reading `recommendations.json` and filtering
      `findings[].tasks[] where status == 'open'`" at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/implement-global-audit.md`

- [x] Update Step 4.1 in `implement-global-audit.md`: instead of "cross off
      completed tasks in `recommendations.md` with an `x`", write: "Update
      `recommendations.json` — set `task.status` to `'complete'` and add a
      `completedAt` ISO timestamp and `completedBy` field"

### PROC-05: Extend registry dual-write to all status transitions (not just `Closed`)

Affects: `dev-environment/.agents/skills/audit-registry/SKILL.md`

The Supabase dual-write is only documented for `✅ Closed`. All four status
transitions should write to both markdown and Supabase to eliminate the
asymmetry.

- [x] Add Supabase `UPSERT` curl examples to `audit-registry/SKILL.md` for
      `Drafting`, `FindingsIssued`, and `Implementing` transitions (matching the
      existing `Closed` example's pattern) at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`

---

## 🟡 Medium

### PROC-06: Document `audits` Supabase table schema as a JSON schema

Affects: `dev-environment/.agents/workflows/finalise-global-audit.md`

The curl payload in `finalise-global-audit.md` is the only documentation of the
`audits` table shape. Define a companion JSON schema so agents don't silently
misname fields.

- [x] Create
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/supabase-audits-table.schema.json`
      documenting the canonical fields: `slug`, `status`, `scope`,
      `recommendations_url`, `created_at`, `closed_at`

- [x] Reference this schema in `finalise-global-audit.md` Step 2b at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/finalise-global-audit.md`

### PROC-07: Add a `required-skills` frontmatter field to workflows

Affects: `global-audit.md`, `implement-global-audit.md`,
`finalise-global-audit.md`

Skills are referenced via human-readable `> [!IMPORTANT] read these skills`
blocks — there is no machine-verifiable dependency declaration. Add a
`required-skills` YAML frontmatter list so orchestrating tools can auto-load
skills.

- [x] Add `required_skills:` list to YAML frontmatter in each workflow file:
      `global-audit.md`, `implement-global-audit.md`, `finalise-global-audit.md`
      in
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/`

---

## 🟢 Low

### PROC-08: Add `status: "proposed"` to iterative suggestion tracking

Affects: `dev-environment/.agents/skills/audit-document-standards/SKILL.md`

The iterative improvement protocol has no mechanism to persist pending
suggestions across sessions. In the JSON model, proposed findings can be queued
with `status: "proposed"` and promoted to `status: "accepted"` when the human
approves.

- [x] Update the Iterative Improvement Protocol section of
      `audit-document-standards/SKILL.md` to describe the `proposed` →
      `accepted` → `open` status flow for JSON-managed findings at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

---

## Deferred to Next Audit Cycle

| Item                                   | Reason Deferred                                                                                                             |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| Retroactive migration of open audits   | Risk vs. reward — open audits (`260305-iso27001-preaudit`, `260307-ip-licensing`) are near closure; migrate only new audits |
| UI rendering of `recommendations.json` | Requires separate Docusaurus plugin or React component work — separate audit scope                                          |

---

## Implementation Order

| Phase | Finding IDs               | Rationale                                                       |
| :---- | :------------------------ | :-------------------------------------------------------------- |
| 1     | PROC-01, PROC-02          | Core schema + validator — all other tasks depend on this        |
| 2     | PROC-03, PROC-04, PROC-09 | JSON primitives in skills/workflows + `$schema` self-validation |
| 3     | PROC-05, PROC-06, PROC-10 | Registry dual-write, Supabase schema, atomic scripts            |
| 4     | PROC-11, PROC-12          | Session state machine + jq-native skill queries                 |
| 5     | PROC-07, PROC-08, PROC-13 | Frontmatter deps, iterative state, severity audit trail         |

---

## Iterative Improvement Round 1 — 2026-03-10

_Inspired by the `peer-reviews/.agents/` workspace design. All 5 findings below
are new; they do not duplicate the initial set._

### 🔴 Critical (escalated from initial assessment)

#### PROC-09: All schema files must declare `additionalProperties: false`

The peer-review `issues.schema.json` sets `"additionalProperties": false` on
every object in the schema, making unexpected fields a hard validation error.
The initial recommendations only specified required fields and types — without
`additionalProperties: false`, agents can silently introduce extra fields that
are invisible to downstream consumers.

- [x] Add `"additionalProperties": false` to all objects in
      `recommendations.schema.json` at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/recommendations.schema.json`

### 🟠 High

#### PROC-10: Atomic mutation shell scripts for task state changes

The peer-review workspace uses `add-issue.sh` and `close-question.sh` as
authoritative mutation operators — they enforce duplicate-ID guards, validate
before writing, and use `jq | mv` for atomicity. Without equivalent scripts for
audits, agents will hand-edit `recommendations.json` and risk corrupting the
file on merge conflicts or partial writes.

- [x] Create
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/add-finding.sh`
      — appends one finding to `recommendations.json` with dupe-ID guard and
      atomic `jq > tmp && mv tmp target` pattern

- [x] Create
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/complete-task.sh`
      — sets `task.status = "complete"`, writes `completedAt` ISO timestamp,
      validates schema before commit

- [x] Create
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/defer-finding.sh`
      — moves a finding to the `deferred[]` array with a required `reason` field

#### PROC-11: `audit-brief.json` as a session state machine

The peer-review `brief.json` is a persistent session state machine: it stores
`next_skill`, `next_section`, `latest_handover`, and `session_history[]` so any
new agent can cold-boot from it without reading narrative prose. The same
pattern should apply to audit sessions — currently, the only handover mechanism
is the `Session Close` prose block appended to `recommendations.md`.

- [x] Add `audit-brief.json` as a required artefact in the audit directory
      alongside `recommendations.json`. Define its schema in
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/audit-brief.schema.json`
      with fields: `auditSlug`, `status`, `currentSession`, `nextAction`
      (`"implement" | "finalise" | "closed"`), `openTaskCount`, `latestHandover`
      (string), `sessionHistory[]`

- [x] Update `global-audit.md` Step 6 and `implement-global-audit.md` Step 4 to
      write/update `audit-brief.json` at session close, replacing the
      `Session Close` prose block (which may be retained as a rendered view but
      not as the primary handover mechanism) in
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/`

### 🟡 Medium

#### PROC-12: `jq`-native status queries in `implement-global-audit.md`

The peer-review `peer-review-status` skill queries issues using
`jq '... map(select(.status == "open")) ...'` directly in bash. The current
`implement-global-audit.md` has no canonical `jq` query pattern — agents must
improvise. Define the canonical queries in the skill so there is one source of
truth.

- [x] Add a **"Canonical `jq` Queries"** section to
      `audit-document-standards/SKILL.md` documenting: open task query,
      phase-specific task query, and finding-by-ID lookup. Example:
      `bash
      # All open tasks
      jq '[.findings[].tasks[] | select(.status == "open")]' recommendations.json
      # Tasks for a specific repo
      jq '[.findings[] | select(.repo == "supabase-receptor") | .tasks[] | select(.status == "open")]' recommendations.json`
      at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

### 🟢 Low

#### PROC-13: `severity_history[]` audit trail on finding severity changes

The peer-review `issues.schema.json` includes a `severity_history[]` array
recording every severity bump: `from`, `to`, `session`, `date`, `reason`. The
current audit design has no tracking of severity changes — the Agent
Clarifications table is the only record, but it is prose-only and not queryable.

- [x] Add `severity_history[]` array to the `findings[]` items in
      `recommendations.schema.json` with fields: `from`, `to`, `changedAt` (ISO
      date), `reason` (string) at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/recommendations.schema.json`

---

## Session Close — 2026-03-10

**Completed:** PROC-01, PROC-02, PROC-03, PROC-04, PROC-05, PROC-06, PROC-07,
PROC-08, PROC-09, PROC-10, PROC-11, PROC-12, PROC-13

**Remaining:** None — all tasks complete.

**Blocked:** None.

**PR order note:** Single repo (dev-environment) — no cross-repo dependency.
Raise one PR: `dm-ra-01/receptor-dev-environment`
`audit/260310-agent-workflow-json-refactor` → `main`.

**Brief for next agent:** All 13 findings implemented in one session. Key
deliverables in `dev-environment/.agents/`:

- `schemas/recommendations.schema.json` — canonical schema with
  `additionalProperties: false` throughout, `severity_history[]` on findings,
  and `severity_history` schema definitions
- `schemas/audit-brief.schema.json` — session state machine schema
- `schemas/supabase-audits-table.schema.json` — documents the `public.audits`
  table fields (updated via GraphQL introspection to include all 18 columns)
- `scripts/validate-recommendations.py` — validates against schema; exits
  non-zero on failure
- `scripts/render-recommendations.py` — renders JSON → markdown
- `scripts/add-finding.sh`, `complete-task.sh`, `defer-finding.sh` — atomic
  mutation operators
- `skills/audit-document-standards/SKILL.md` — fully rewritten as JSON-native
  (jq queries, proposed→accepted lifecycle, mutation script docs,
  severity_history docs)
- `skills/audit-registry/SKILL.md` — extended with Supabase UPSERT for all 4
  transitions; curl templates updated with full required field set from GraphQL introspection
- All 3 workflow files — `required_skills:` frontmatter added; task-scanning now
  uses jq; session close now writes `audit-brief.json`

Audit closed 2026-03-10. Archived to `docs/audits/archive/260310-agent-workflow-json-refactor/`.
