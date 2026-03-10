# Agent Workflow JSON Refactor Audit

**Date:** 2026-03-10\
**Scope:** `dev-environment/.agents/` — all 3 workflows, 5 audit-related skills\
**Auditor:** Ryan Ammendolea\
**Standard:** Internal Engineering Process

---

## Executive Summary

This audit evaluates the `.agents/` directory in `dev-environment` with a focus
on the suitability of the current markdown-based format for tracking audit
recommendations. **13 findings** were identified across 2 skills and 3
workflows: 3 🔴 Critical, 5 🟠 High, 3 🟡 Medium, 2 🟢 Low.

The core issue is that `recommendations.md` uses freeform markdown checkboxes
and tables as the primary data contract between audit, implementation, and
finalisation agents. This creates systematic fragility: agents cannot
programmatically query finding status, duplicate headings are a documented
failure mode, and the `<!-- audit-slug -->` comment is the only machine-readable
anchor. Migration to a JSON recommendations data model would eliminate an entire
class of parse errors and enable structured queries across audit sessions.
Additional patterns from the `peer-reviews/.agents/` workspace —
`additionalProperties: false` schema strictness, atomic mutation scripts,
session state machines (`brief.json`), and `jq`-native queries — further
strengthen the proposed design.

| Area                          | Coverage | Issues Found | Overall |
| ----------------------------- | -------- | ------------ | ------- |
| `recommendations.md` contract | ✅       | 4            | 🔴 Poor |
| `audit-registry.md` contract  | ✅       | 2            | 🟠 Weak |
| Schema design                 | ✅       | 3            | 🔴 Poor |
| Atomic mutation / scripts     | ✅       | 2            | 🟠 Weak |
| Session state management      | ✅       | 1            | 🟠 Weak |
| Workflow cross-references     | ✅       | 1            | 🟡 Fair |

---

## 1. `recommendations.md` Data Contract

### 1.1 Freeform Markdown as Machine-Readable State

**Gaps:**

- **PROC-01** `dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  lines 138–168: Recommendations are encoded as freeform `- [ ]` markdown
  checkboxes. Implementation agents parse these by text-matching for `- [ ]` and
  `- [x]` patterns. There is no schema, no field ordering guarantee, and no
  validation step — an agent that misprints `- [/]` or omits the finding-ID
  prefix silently produces a malformed record that will confuse the next agent.

- **PROC-02** `dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  line 188: The DoD checklist explicitly notes "Duplicate headings are a common
  error" for the Implementation Order table. This is a documented, recurring
  failure mode caused by agents appending iterative rounds to a markdown file
  without a structural safeguard — a symptom of using a document format as a
  data store.

- **PROC-03** `dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  lines 100–106: The `<!-- audit-slug: YYMMDD-slug -->` HTML comment is the only
  machine-readable identifier in `recommendations.md`. All other state (finding
  ID, severity, status, phase, repo) is embedded in prose and table markup,
  making cross-session querying impossible without full document parsing.

- **PROC-04** `dev-environment/.agents/workflows/implement-global-audit.md`
  lines 47–48: The implementation workflow instructs agents to "identify
  uncompleted tasks — open `- [ ]` checkboxes". This means the implementation
  agent's progress-tracking loop is a text-scan across a markdown document, not
  a query against a structured data source. If the document surpasses ~10,000
  bytes (the documented token limit), truncation risk increases and agents may
  miss open items.

### 1.2 Agent Clarifications Table

**Strengths:**

- The Agent Clarifications table (SKILL.md lines 120–136) is a well-designed
  pattern for capturing human decisions. It is explicitly required before any
  implementation work begins. This pattern should be preserved and promoted as a
  first-class JSON object in the new schema.

---

## 2. Audit Registry (`audit-registry.md`)

### 2.1 Markdown-Only Registry

**Gaps:**

- **PROC-05** `dev-environment/.agents/skills/audit-registry/SKILL.md` lines
  70–82: The registry row format is defined only as a markdown table. The
  `finalise-global-audit.md` workflow (lines 48–76) documents a Supabase
  dual-write requirement for `✅ Closed` transitions, but no equivalent
  machine-readable data contract exists for `🔄 Drafting` or
  `📋 Findings Issued` states — these are markdown-only. This creates a
  structural asymmetry where the final state is machine-writable but
  intermediate states are not.

- **PROC-06** `dev-environment/.agents/workflows/finalise-global-audit.md` lines
  54–76: The Supabase `audits` table schema is implied only by the example
  `curl` body (`slug`, `status`, `scope`, `recommendations_url`). There is no
  JSON schema or TypeScript type definition documenting the canonical fields for
  the `audits` table. If the table schema drifts from the workflow template, the
  curl payload silently omits or misnames fields.

---

## 3. Workflow Cross-References

### 3.1 Skills Referenced but Not Auto-Loaded

**Gaps:**

- **PROC-07** `dev-environment/.agents/workflows/global-audit.md` lines 27–32,
  `implement-global-audit.md` lines 13–19, `finalise-global-audit.md` lines
  12–17: All three workflows instruct agents to "read these skills before
  starting". This is a text instruction, not an enforced dependency. There is no
  mechanism to verify that a new session agent has actually read and applied the
  skills before proceeding. If a session starts without reading `SKILL.md`
  files, the DoD checklist and verification gates are silently skipped.

---

## 4. Skill Interoperability

### 4.1 Iterative Improvement Protocol

**Strengths:**

- The iterative improvement protocol defined in
  `audit-document-standards/SKILL.md` (lines 230–249) is well-structured. The
  5-suggestion → approve → commit loop provides a clear cadence for human-agent
  collaboration.

**Gaps:**

- **PROC-08** `dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  lines 247–249: The protocol instructs "offer 5 more suggestions. Repeat until
  the user concludes the session", but does not define how the suggestions are
  tracked. In a JSON-native system, suggestions could be queued as candidate
  findings (status: `proposed`) and promoted to `accepted` on approval — making
  the iterative loop auditable across sessions.

---

## Severity Summary

| Finding ID | Area               | File                                  | Category    | Severity    |
| ---------- | ------------------ | ------------------------------------- | ----------- | ----------- |
| PROC-01    | recommendations.md | `audit-document-standards/SKILL.md`   | Process Gap | 🔴 Critical |
| PROC-02    | recommendations.md | `audit-document-standards/SKILL.md`   | Process Gap | 🔴 Critical |
| PROC-09    | schema design      | `schemas/recommendations.schema.json` | Tech Debt   | 🔴 Critical |
| PROC-03    | recommendations.md | `audit-document-standards/SKILL.md`   | Tech Debt   | 🟠 High     |
| PROC-04    | implement workflow | `implement-global-audit.md`           | Process Gap | 🟠 High     |
| PROC-05    | audit-registry     | `audit-registry/SKILL.md`             | Process Gap | 🟠 High     |
| PROC-10    | atomic mutations   | `scripts/` (missing)                  | Process Gap | 🟠 High     |
| PROC-11    | session state      | `schemas/audit-brief.schema.json`     | Process Gap | 🟠 High     |
| PROC-06    | finalise workflow  | `finalise-global-audit.md`            | Tech Debt   | 🟡 Medium   |
| PROC-07    | all 3 workflows    | `global-audit.md`, et al.             | Process Gap | 🟡 Medium   |
| PROC-12    | implement workflow | `implement-global-audit.md`           | Tech Debt   | 🟡 Medium   |
| PROC-08    | iterative protocol | `audit-document-standards/SKILL.md`   | Tech Debt   | 🟢 Low      |
| PROC-13    | schema design      | `schemas/recommendations.schema.json` | Tech Debt   | 🟢 Low      |
