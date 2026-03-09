---
name: audit-document-standards
description: >
    Canonical rules for writing audit.md and recommendations.md in any audit
    workflow (local or global). Covers required document structure, formatting
    rules, token-efficiency targets, the Definition-of-Done checklist, and
    field-level constraints such as the Auditor field and finding ID format.
    Use this skill whenever producing or reviewing either document.
---

# Audit Document Standards

All audit sessions — local (single-repo) and global (cross-ecosystem) — produce
**exactly two primary documents**: `audit.md` and `recommendations.md`. Both
must conform to this standard. Deviating silently is not permitted; if a
constraint cannot be met, surface the reason to the user before proceeding.

---

## File Locations

| Audit type           | Directory                                                                     |
| :------------------- | :---------------------------------------------------------------------------- |
| Cross-ecosystem      | `documentation/common-bond/docs/audits/YYMMDD-slug/`                          |
| Repo-local (active)  | `<target-repo>/docs/audits/YYMMDD-slug/`                                      |
| Repo-local (archive) | `<target-repo>/docs/audits/archive/YYMMDD-slug/`                              |
| Docusaurus-exception | Use `dev-docs/audits/YYMMDD-slug/` if the repo's `docs/` is a Docusaurus site |

The `re-audit.md` (and optionally `re-audit-recommendations.md`) live in the
same directory as `audit.md`.

---

## `audit.md` — Required Structure

```markdown
# [Topic] Audit ← or "Ecosystem Audit" for global audits

**Date:** YYYY-MM-DD\
**Scope:** [repos reviewed, or single repo name]\
**Auditor:** Ryan Ammendolea\
**Standard:** [standard referenced, if any]

---

## Executive Summary

[2–4 sentences. State total finding count and severity breakdown.]

| Repository / Area | Coverage | Issues Found | Overall |
| ----------------- | -------- | ------------ | ------- |
| ...               | ✅/⚠️/❌ | N            | ...     |

---

## 1. [Area or Repository Name]

### 1.1 [Sub-area]

**Strengths:**

- [evidence-grounded bullet]

**Gaps:**

- [finding ID] [file path + line/section reference]

---

## N. Cross-Cutting Observations ← required for global audits

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity    |
| ---------- | ----------------- | ---- | -------- | ----------- |
| PROC-01    | all               | —    | Process  | 🔴 Critical |
```

### Field Rules

| Field          | Rule                                                                                                            |
| :------------- | :-------------------------------------------------------------------------------------------------------------- |
| `Auditor:`     | **Always `Ryan Ammendolea`** — never "Antigravity". Agents conduct; humans own.                                 |
| Finding IDs    | Prefix reflects area: `PROC-`, `SEC-`, `CROSS-`, repo abbreviation (`WF-`, `PL-`, `PREF-`) + zero-padded number |
| File paths     | Relative from the repo root — no absolute paths in `audit.md`                                                   |
| Evidence style | One sentence per finding; describe what the artefact _shows_, not what it _should_ show                         |
| 🟢 Low items   | Severity table row is sufficient — no prose section required                                                    |
| Token target   | **≤ 8,000 bytes**. Be concise.                                                                                  |

> [!IMPORTANT]
> **Keep executive summary counts accurate.** Update the finding count and
> severity breakdown every time findings are added during iterative improvement
> rounds. The summary must always match the Severity Summary table.

---

## `recommendations.md` — Required Structure

The very first line of the file must be the audit slug comment:

```markdown
<!-- audit-slug: YYMMDD-slug -->
```

Then the header block (branch name, auditor, date), followed in order:

```
1. Agent Clarifications table
2. 🔴 Critical tasks
3. 🟠 High tasks
4. 🟡 Medium tasks
5. 🟢 Low tasks
6. Deferred to Next Audit Cycle (if any)
7. Implementation Order table
8. Session Close section(s) — appended by implementation agents
```

### Agent Clarifications Table

Near the top of `recommendations.md`, immediately after the header block:

```markdown
## Agent Clarifications (Human-Approved)

| Item           | Decision                                                                                           |
| :------------- | :------------------------------------------------------------------------------------------------- |
| [Topic]        | [Approved approach, constraints, caveats]                                                          |
| CI secrets     | Use `gh secret set <KEY> --body "<val>" --repo <owner>/<repo>` via gh CLI — no manual portal step. |
| Deferred items | [Anything explicitly scoped out, with reason]                                                      |
```

Update this table whenever the user makes a decision that implementation agents
need to know. Include severity escalations, approved exemptions, and
out-of-scope deferrals. Never leave a human decision undocumented here.

### Task Format

Each task must:

- Use `- [ ]` checkbox notation
- Reference the finding ID (`CROSS-04`, `WF-02`, etc.)
- Specify an **absolute file path** as the target
- For multi-repo findings, one checkbox per repo:

```markdown
- [ ] `supabase-receptor` — Add pgTAP test for `func_has_global_role` at
      `/Users/ryan/.../supabase-receptor/supabase/tests/rls_test.sql`
- [ ] `planner-frontend` — Add equivalent E2E test at
      `/Users/ryan/.../planner-frontend/playwright/rls.spec.ts`
```

### Implementation Order Table

At the bottom (before Session Close sections), include a phased table that
**references every finding ID**. Update it after each iterative addition round —
no finding ID may be absent from this table.

```markdown
## Implementation Order

| Phase | Finding IDs     | Rationale                    |
| :---- | :-------------- | :--------------------------- |
| 1     | PROC-01, SEC-02 | Critical blockers — do first |
| 2     | CROSS-04, WF-01 | High-value, low-risk         |
| 3     | ISO-01, PL-02   | Compliance / documentation   |
```

### Deferred Items

If any findings are explicitly scoped out, add before the Implementation Order:

```markdown
## Deferred to Next Audit Cycle

| Item      | Reason Deferred                          |
| :-------- | :--------------------------------------- |
| [Finding] | [Out of scope / requires separate audit] |
```

### Field Rules

| Field              | Rule                                                                                             |
| :----------------- | :----------------------------------------------------------------------------------------------- |
| Every ID           | Includes the audit slug — e.g. `REC-01 [260306-frontend-compliance]`                             |
| Token target       | **≤ 10,000 bytes**. Only actionable tasks — do not restate `audit.md` findings.                  |
| Duplicate headings | Check after every iterative round. Duplicate "Implementation Order" sections are a common error. |

---

## Definition of Done — Required Checks

Run these checks **before** declaring either document final. This is a
**mandatory quality gate**, not optional.

### `audit.md` checks

- [ ] `Auditor:` is `Ryan Ammendolea`, not "Antigravity"
- [ ] Executive summary finding count matches the Severity Summary table row
      count
- [ ] Executive summary description covers all major gap areas (not just the
      original set)
- [ ] Severity table has a row for **every** finding ID in `recommendations.md`
- [ ] Cross-cutting observations are numbered sequentially with no gaps
- [ ] No prose section editorialises — findings describe what artefacts show

### `recommendations.md` checks

- [ ] `<!-- audit-slug: YYMMDD-slug -->` comment is present at the top
- [ ] No **duplicate section headings** — iterative additions commonly create
      duplicate "Implementation Order" tables; remove stale versions
- [ ] Implementation Order table references every finding ID
- [ ] Agent Clarifications table includes every decision made during the session
- [ ] Deferred items section exists if any findings were scoped out
- [ ] ISO findings are included in implementation phases
- [ ] No completed self-referential tasks remain (e.g. "update the
      clarifications table")

### After the review

Fix any issues found and commit:

```bash
git commit -m "audit(YYMMDD-slug): final review — consistency fixes"
```

---

## Iterative Improvement Protocol

After presenting the initial audit documents, **offer 5 meaningful additions /
modifications / enhancements** to the current findings. Frame these as concrete
suggestions, not vague improvements. Consider:

- Adjacent concerns the initial scope revealed but didn't fully cover
- Stricter or more nuanced versions of existing findings (severity bumps with
  rationale)
- Cross-cutting patterns the initial analysis may have missed
- Pre-production opportunities — cheap now, expensive later
- ISO 27001 or compliance implications not yet documented

When the user approves suggestions:

1. Add findings to **both** `audit.md` (Severity Summary + relevant section) and
   `recommendations.md` (task section + Implementation Order phase).
2. Update the Agent Clarifications table with any new human decisions.
3. Commit and push after each approved round.
4. Offer 5 more suggestions. Repeat until the user concludes the session.

> [!NOTE]
> Severity decisions belong to the human. When the user bumps or reduces a
> severity, record the change in the Agent Clarifications table so
> implementation agents know it was intentional.
