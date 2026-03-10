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

- [ ] Define canonical JSON schema at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/recommendations.schema.json`
      covering: `auditSlug`, `findings[]` (each with `id`, `severity`, `status`,
      `category`, `repo`, `description`, `tasks[]`), `clarifications[]`,
      `implementationPhases[]`, `deferred[]`

- [ ] Update `audit-document-standards/SKILL.md` to require
      `recommendations.json` as the primary artefact, with `recommendations.md`
      as an optional rendered view at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

- [ ] Add a utility script `scripts/render-recommendations.sh` (or `.py`) in
      `.agents/` that renders `recommendations.json` → `recommendations.md` for
      human review, committed to
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/render-recommendations.py`

### PROC-02: Enforce uniqueness constraint on Implementation Order sections

Affects: `dev-environment/.agents/skills/audit-document-standards/SKILL.md`

The duplicate Implementation Order heading is a documented failure mode
(SKILL.md line 188). In the JSON model, `implementationPhases` is a top-level
array — uniqueness is structurally enforced by the schema, not by agent
discipline.

- [ ] Add a `validate-recommendations.py` script in
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/validate-recommendations.py`
      that validates `recommendations.json` against
      `recommendations.schema.json` using Python `jsonschema` and exits non-zero
      on failure

- [ ] Update `global-audit.md` Step 4 and `implement-global-audit.md` Step 4 to
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

- [ ] Update `audit-document-standards/SKILL.md` to document that `auditSlug` is
      a required top-level field in `recommendations.json` (not an HTML comment
      in a markdown file) at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`

### PROC-04: Update `implement-global-audit.md` task-scanning step to query JSON

Affects: `dev-environment/.agents/workflows/implement-global-audit.md`

Step 1.7 currently instructs agents to scan for `- [ ]` checkboxes. Replace with
a JSON query pattern for `tasks[].status === "open"`.

- [ ] Rewrite Step 1.7 in `implement-global-audit.md` to: "Identify uncompleted
      tasks by reading `recommendations.json` and filtering
      `findings[].tasks[] where status == 'open'`" at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/implement-global-audit.md`

- [ ] Update Step 4.1 in `implement-global-audit.md`: instead of "cross off
      completed tasks in `recommendations.md` with an `x`", write: "Update
      `recommendations.json` — set `task.status` to `'complete'` and add a
      `completedAt` ISO timestamp and `completedBy` field"

### PROC-05: Extend registry dual-write to all status transitions (not just `Closed`)

Affects: `dev-environment/.agents/skills/audit-registry/SKILL.md`

The Supabase dual-write is only documented for `✅ Closed`. All four status
transitions should write to both markdown and Supabase to eliminate the
asymmetry.

- [ ] Add Supabase `UPSERT` curl examples to `audit-registry/SKILL.md` for
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

- [ ] Create
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/schemas/supabase-audits-table.schema.json`
      documenting the canonical fields: `slug`, `status`, `scope`,
      `recommendations_url`, `created_at`, `closed_at`

- [ ] Reference this schema in `finalise-global-audit.md` Step 2b at
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/workflows/finalise-global-audit.md`

### PROC-07: Add a `required-skills` frontmatter field to workflows

Affects: `global-audit.md`, `implement-global-audit.md`,
`finalise-global-audit.md`

Skills are referenced via human-readable `> [!IMPORTANT] read these skills`
blocks — there is no machine-verifiable dependency declaration. Add a
`required-skills` YAML frontmatter list so orchestrating tools can auto-load
skills.

- [ ] Add `required_skills:` list to YAML frontmatter in each workflow file:
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

- [ ] Update the Iterative Improvement Protocol section of
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

| Phase | Finding IDs      | Rationale                                                       |
| :---- | :--------------- | :-------------------------------------------------------------- |
| 1     | PROC-01, PROC-02 | Core schema + validator — all other tasks depend on this        |
| 2     | PROC-03, PROC-04 | Update skills and workflows to use JSON primitives              |
| 3     | PROC-05, PROC-06 | Registry dual-write + Supabase schema documentation             |
| 4     | PROC-07, PROC-08 | Frontmatter deps + iterative suggestion state — low risk polish |
