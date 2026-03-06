---
description: Generate a structured audit report for a given feature, section, or technical area, then save audit.md and recommendations.md to ./docs/audits/[YYMMDD]-[short-name]/ (or docs/audits/archive/ for repo-local audits)
---

## Overview

The user will describe a **section, topic, or technical area** to audit (e.g.
"governance", "compliance/ISO 27001", "strategy", the entire docs site, a Python
backend service, a Supabase schema, or a frontend application). Your job is to
read the actual artefacts deeply, apply critical thinking, and produce two
documents:

- `audit.md` — factual findings with evidence
- `recommendations.md` — prioritized, actionable improvements

This workflow covers **two audit modes**:

- **Documentation audits** — corporate governance quality and documentation
  readability. Key concerns: accuracy and completeness of governance statements,
  consistency of tone and style, internal link health, metadata hygiene, and
  whether the content meets the standards expected for a regulated healthcare
  company.
- **Technical audits** — code, database schema, infrastructure, or API surface.
  Key concerns: security (RLS, auth, input validation), architectural integrity,
  test coverage, deviation from ecosystem standards, and contract stability.

> [!TIP]
> **Before starting:** Check the Knowledge Items (KI) system for any existing
> architecture documentation on the area you are auditing. Reading relevant KIs
> first prevents re-documenting already-known patterns and ensures findings are
> evaluated against the correct design intent, not a superficial reading of the
> code.
>
> Also check `docs/audits/` (or `docs/audits/archive/` for repo-local audits)
> for any previous related audits and read them first — avoid re-documenting
> findings that are already tracked.

---

## Step 1: Understand the Scope

Read the user's request carefully. Identify:

- Which section(s) are in scope (e.g. `docs/governance/`, `docs/compliance/`,
  `docs/strategy/`, or "all docs")
- What the audit focus is (readability, coverage gaps, regulatory accuracy, tone
  consistency, structural completeness, etc.)
- Whether there is an existing audit to reference (check `docs/audits/` first)

---

## Step 2: Research the Documentation

For each section in scope, systematically read the source files. The typical
research path:

1. **Read the section index** — understand what the section promises to cover.
2. **Read every document in the section** — don't rely on filenames alone; read
   the content.
3. **Check metadata** — every `.md` file should have a valid frontmatter
   `title`, `sidebar_label`, and `sidebar_position`. Missing or mismatched
   fields are findings.
4. **Check internal links** — links referencing `../` paths or `/docs/` routes
   should resolve to real files. Note any dead links.
5. **Cross-check coverage** — compare what the index or intro page _promises_ is
   documented against what actually exists. Note "TBD", stubs, or placeholder
   content as gaps.
6. **Assess regulatory accuracy** — for governance and compliance docs, verify
   that regulatory references (e.g. Australian Privacy Act, ISO 27001, AMC
   Framework) are cited correctly and not contradicted elsewhere.

For each finding, record:

- The specific file path (and heading / line where practical)
- What the issue is, with evidence from the content
- The severity: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
- The category (see below)

> [!WARNING]
> Do not editorialize. Record what the content _actually says_, not what it
> should say. Save recommendations for `recommendations.md`. The audit document
> is an evidence base, not an opinion piece.

### Finding Categories

**Documentation audits:**

| Category                    | What to look for                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| **Coverage Gap**            | Promised content that doesn't exist; stubs or "TBD" entries                                   |
| **Regulatory Accuracy**     | Incorrect citations, outdated framework names, contradictions                                 |
| **Readability**             | Dense sentences, undefined jargon, inconsistent heading structure, walls of text              |
| **Tone & Voice**            | Inconsistency between formal governance language and casual language                          |
| **Metadata**                | Missing frontmatter, broken sidebar positions, bad `sidebar_label` values                     |
| **Internal Links**          | Dead links, links to non-existent anchors or docs pages                                       |
| **Structural Integrity**    | Orphaned pages, duplicate content, illogical section ordering                                 |
| **Governance Completeness** | Missing required governance artefacts (e.g. no conflict of interest policy, no board charter) |

**Technical audits:**

| Category                  | What to look for                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Security**              | RLS gaps, hardcoded credentials, missing auth checks, injection vulnerabilities, unrotated secrets       |
| **Architectural Drift**   | Deviation from ecosystem standards (KI patterns), inconsistent abstractions, ad-hoc workarounds          |
| **Test Coverage**         | Missing unit/integration/pgTAP tests for critical paths; tests that don't assert the right behaviour     |
| **Contract Stability**    | API surfaces, DB column renames, or type changes that break downstream consumers without a migration     |
| **Performance**           | N+1 queries, missing indexes on foreign keys, unbounded queries, unoptimised RLS policies                |
| **Observability**         | Missing logging, no audit trail for privileged operations, silent error swallowing                       |
| **Dead Code / Tech Debt** | Unused functions, commented-out logic, TODO markers, stale feature flags                                 |

---

## Step 3: Apply the Editorial Lens

After the initial research pass, make a second pass specifically asking:

- **Board/investor reader**: Does this documentation make Common Bond look
  credible and mature? Are there embarrassing gaps a due-diligence reviewer
  would flag?
- **Regulatory reader**: Would a TGA, OAIC, or ACCC reviewer find this
  compliant, substantive, and unambiguous?
- **New employee**: Could someone joining Common Bond understand the governance
  structure, their responsibilities, and how decisions are made from these docs
  alone?
- **Maintenance pessimist**: Which sections will silently become outdated as the
  company grows? Are there version-locked claims ("as of 2024", "3-person team")
  that will mislead future readers?

Document any additional findings surfaced by this pass.

---

## Step 4: Write `audit.md`

Save to:

- **Cross-ecosystem audits:** `docs/audits/[YYMMDD-short-name]/audit.md` (in `documentation/common-bond/`)
- **Repo-local technical audits:** `docs/audits/[YYMMDD-short-name]/audit.md` (in the target repo)
  - When the audit is **complete**, the directory is moved to `docs/audits/archive/[YYMMDD-short-name]/`
  - **Exception:** if the target repo has its own Docusaurus site under `docs/`, use `dev-docs/audits/[YYMMDD-short-name]/` instead to avoid collision

The user will specify scope; if unsure, use `/global-audit` for multi-repo work and `/audit` for single-repo work.


Structure:

```markdown
# [Section] Documentation Audit

**Date:** YYYY-MM-DD\
**Scope:** [list of sections/files reviewed]\
**Auditor:** Antigravity

---

## Executive Summary

[2–4 sentence overview]

| Section     | Coverage | Readability | Regulatory Accuracy | Metadata | Overall |
| ----------- | -------- | ----------- | ------------------- | -------- | ------- |
| governance/ | ✅/⚠️/❌ | ...         | ...                 | ...      | ...     |
| compliance/ | ...      |             |                     |          |         |
| strategy/   | ...      |             |                     |          |         |

---

## 1. [Section Name] (e.g. `docs/governance/`)

### 1.1 [Document or sub-area]

**Strengths:**

- [bullet]

**Gaps:**

- [bullet with file path reference]

...repeat for each section/document

---

## N. Cross-Cutting Observations

[Issues that appear across multiple sections — tone inconsistency, systemic
metadata problems, etc.]

---

## Severity Summary

| Finding ID | File                          | Category     | Severity |
| ---------- | ----------------------------- | ------------ | -------- |
| DOC-01     | governance/risk-management.md | Coverage Gap | 🟠 High  |
| DOC-02     | ...                           | ...          | ...      |
```

> [!NOTE]
> Rules for `audit.md`:
>
> - Every finding must cite a specific file (and heading where practical).
> - Severity uses 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low.
> - The comparison table must include every audited section.
> - Do not editorialize — state facts with evidence.
> - **Token efficiency:** Finding descriptions must be one sentence of evidence,
>   not a paragraph. Prose findings sections are optional for 🟢 Low items —
>   the severity table row is sufficient. Use relative paths from the repo root.
>   Target: `audit.md` ≤ 8,000 bytes.


---

## Step 5: Write `recommendations.md`

Save to `./docs/audits/[YYMMDD]-[short-name]/recommendations.md`.

**The file must begin with the audit slug** on the very first line as an HTML
comment, so that any future agent referencing this audit can unambiguously
identify it:

```markdown
<!-- audit-slug: YYMMDD-short-name -->
```

Structure:

**Create a feature branch** for all implementation work before finalising
`recommendations.md`, so that implementation agents have a dedicated branch to
commit to:

```bash
git checkout -b audit/YYMMDD-short-name
git push -u origin audit/YYMMDD-short-name
```

Include the branch name in `recommendations.md` so that implementation agents
know exactly where to commit their work. The template below shows the required
format.

```markdown
<!-- audit-slug: YYMMDD-short-name -->

# [Section] Documentation Recommendations

**Audit slug:** `YYMMDD-short-name`\
**Feature branch:** `audit/YYMMDD-short-name`\
**Date:** YYYY-MM-DD\
**Scope:** ...

> [!IMPORTANT]
> All implementation work for this audit MUST be committed to the
> `audit/YYMMDD-short-name` branch, not to `main`. Only merge to `main` after
> all tasks are complete and the user explicitly approves.

---

## Priority Framework

- 🔴 Critical — Regulatory exposure, legally inaccurate claims, or broken
  navigation that blocks users
- 🟠 High — Significant coverage gaps or content that would fail a due-diligence
  review
- 🟡 Medium — Readability and consistency issues that reduce credibility
- 🟢 Low — Polish, metadata, and minor structural improvements

---

## 🔴 Critical

### DOC-01 [YYMMDD-short-name]: [Short title] ([file or section])

[1–3 sentence problem description linking back to audit.md finding]

:::caution Action required Policy positions and legal commitments cannot be
drafted without explicit Founder input. Leave this section empty and flag it as
blocked. :::

- [ ] [Specific actionable task — e.g. "Write a Conflict of Interest Policy at
      `governance/conflict-of-interest.md`"]
- [ ] ...

---

## 🟠 High

...

## 🟡 Medium

...

## 🟢 Low

...

---

## Implementation Order

[Phased sequence — e.g. Phase 1: Fix regulatory accuracy and dead links. Phase
2: Fill coverage gaps. Phase 3: Readability and polish.]
```

> [!NOTE]
> Rules for `recommendations.md`:
>
> - **Every DOC identifier must include the audit slug** in the format
>   `DOC-NN [YYMMDD-short-name]`. This ensures references in commit messages and
>   future audit sessions are unambiguous across all audits in the repository.
> - Every recommendation maps to one or more `- [ ]` task checkboxes.
> - Tasks must be specific — a future agent or team member should be able to
>   pick up and act without asking for clarification (include the target file
>   path and what to write where practical).
> - Do not duplicate information from `audit.md` — `recommendations.md` is
>   forward-looking.

---

## Step 6: Notify the User and Update the Audit Registry

**Update the global audit registry** at
`documentation/common-bond/docs/audits/audit-registry.md` — add a row for this
audit under the correct date heading before notifying the user. If Common Bond
is not your current repo, open the file from its absolute path. This step is
**mandatory** — the registry is the PROC-03 compliance record.

Then use `notify_user` to present:

- A summary of the top 3–5 findings by severity
- Links to both files
- The **audit slug** (`YYMMDD-short-name`) and **feature branch**
  (`audit/YYMMDD-short-name`) for use in future `/implement-audit` sessions
- Any open questions that require a human decision before implementation begins
  (e.g. policy positions that only the founding team can determine)
