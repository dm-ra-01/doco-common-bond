---
description: Implement tasks from an audit recommendations.md in focused, context-safe sessions. Proposes a chunk of work, implements it, commits to the feature branch, then briefs the next agent.
---

## Overview

This workflow takes a `recommendations.md` documentation audit file and
implements its tasks safely across one or more agent sessions. Each session:

1. Reads the current state of `recommendations.md` (which tasks are `[ ]` vs
   `[x]`)
2. Proposes a session-sized chunk of work to the user
3. Implements the changes, previews them, and commits **to the feature branch**
4. Updates `recommendations.md` to mark completed tasks and brief the next
   session

> [!IMPORTANT]
> All implementation work MUST be done on the feature branch created during the
> audit (e.g. `audit/YYMMDD-short-name`). Do **not** commit directly to `main`
> unless the user explicitly overrides this instruction.

---

## Step 1: Orient — Read the Audit Files

The user will provide an **audit slug** in the form `YYMMDD-short-name` (e.g.
`260305-governance`). This slug is the canonical identifier for the audit and is
embedded in every DOC identifier (e.g. `DOC-01 [260305-governance]`).

Locate the audit directory and read both files:

- **Cross-ecosystem audits (common-bond repo):**
  `docs/audits/[YYMMDD-short-name]/audit.md`
- **Repo-local technical audits:**
  `docs/audits/archive/[YYMMDD-short-name]/audit.md` (in the target repo, e.g.
  `supabase-receptor` or `planner-frontend`)

The audit slug in `recommendations.md` and the feature branch name are the
canonical pointers — use them to locate the correct directory.

Verify the `<!-- audit-slug: YYMMDD-short-name -->` header at the top of
`recommendations.md` matches the slug the user provided. If it does not match,
stop and ask the user to clarify which audit they intend.

**Confirm the feature branch exists and check it out:**

```bash
git fetch origin
git checkout audit/YYMMDD-short-name
```

If the branch does not exist, ask the user to confirm the correct branch name
before proceeding. Do not create a new branch without confirming with the user.

Identify:

- Which tasks (`- [ ]`) are **not yet done**
- Which tasks are **already done** (`- [x]`)
- The **Implementation Order** section at the bottom — respect its phasing

Also read the actual documentation files affected before making any changes.

---

## Step 2: Propose This Session's Scope

> [!IMPORTANT]
> This is a multi-session workflow. Each session should be a manageable chunk —
> typically one Phase from the Implementation Order, or 3–6 related
> recommendations. Do not attempt to complete everything in one session.

When proposing scope, consider:

- **Complexity budget**: Prefer completing fewer items thoroughly over starting
  many items partially. Documentation changes require careful rewriting, not
  just code substitutions.
- **Dependencies**: Fix structural and regulatory accuracy issues before
  readability polish. Phase N must complete before Phase N+1.
- **Human decisions**: If a task requires a policy position or business decision
  (e.g. "write a conflict of interest policy"), flag it as blocked and skip to
  the next actionable item.
- **Risk**: Prefer lower-risk items (metadata fixes, dead links) at the start;
  structural rewrites and new policy documents for later sessions.

Present the proposed scope to the user via `notify_user` before starting:

```
[Session N of Audit YYMMDD-short-name]
Proposed tasks for this session:
- DOC-03 [YYMMDD-short-name]: Fix dead internal links in governance/ (5 files)
- DOC-07 [YYMMDD-short-name]: Add missing frontmatter to compliance/iso27001 stubs
- DOC-09 [YYMMDD-short-name]: Expand risk-management.md clinical risk table

Skipping until next session:
- DOC-01 (requires Founder input on conflict of interest policy)
- DOC-02 (Phase 2 — coverage gap requiring new document)

Confirm to proceed, or adjust scope.
```

Wait for user approval before beginning implementation.

---

## Step 3: Implement

For each task in the approved scope:

1. **Read the current file** before making any changes.
2. **Note content decisions that require human input** — if you encounter a gap
   that can only be filled with proprietary business information (names, dates,
   policy positions, legal commitments), leave a Docusaurus admonition as a
   placeholder in the target document:
   ```markdown
   :::warning Action required Insert the board-approved conflict of interest policy
   here. :::
   ```
   Flag these in `recommendations.md` with an `⚠️ Blocked:` marker.
3. **Make the change** — quality rewrites, not padding. Do not add filler
   content to make documents look longer. Every sentence should earn its place.
4. **Maintain the existing style** — this documentation uses Australian English,
   present tense for current state, and a formal-but-approachable tone. Do not
   shift to US English or excessive corporate jargon.
5. **Preserve all frontmatter** — never remove `title`, `sidebar_label`, or
   `sidebar_position` fields. If they are wrong, correct them; if they are
   missing, add them.
6. **Mark the task `[x]`** in `recommendations.md` as you complete it.

> [!TIP]
> Docusaurus admonition types available in this site: `:::note`, `:::tip`,
> `:::info`, `:::warning`, `:::caution`. Use these purposefully in new or
> updated docs — not as decoration. For example: `:::warning` for compliance
> obligations, `:::tip` for best-practice guidance, `:::caution` for
> irreversible actions.

### Style Reference

When editing documentation in this workspace, apply these standards
consistently:

| Concern               | Standard                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Language              | Australian English (e.g. "organisation", "programme", "licence" as noun)                          |
| Tense                 | Present tense for current state; future tense for roadmap items                                   |
| Headings              | Title Case for H1/H2; Sentence case for H3 and below                                              |
| Lists                 | Bullet lists for unordered items; numbered lists only for sequential steps                        |
| Regulatory references | Full name on first use, abbreviated thereafter (e.g. "Australian Privacy Act 1988 (Privacy Act)") |
| Tables                | Use for comparison data; avoid tables for simple lists                                            |
| Links                 | Use descriptive link text, never "click here"                                                     |
| Tone                  | Professional; avoid superlatives ("world-class", "best-in-class") unless evidenced                |

---

## Step 4: Preview

> [!CAUTION]
> Always preview before committing. Docusaurus renders MDX — a broken admonition
> fence or malformed frontmatter will crash the build.

If the Docusaurus dev server is not already running, start it:

```bash
npm run start
```

Check that:

- Modified pages render without broken MDX or admonition syntax
- `:::` admonition blocks open and close correctly (each needs its own line)
- Internal links resolve (check browser console for 404s)
- Frontmatter changes are reflected in the sidebar

---

## Step 5: Commit to the Feature Branch

```bash
git add .
git commit -m "docs(audit/[short-name]): implement [DOC-XX, DOC-YY] [YYMMDD-short-name] — [brief description]"
git push origin audit/YYMMDD-short-name
```

> [!IMPORTANT]
> Commit to **`audit/YYMMDD-short-name`**, not to `main`. The commit message
> must reference the full DOC IDs with audit slug (e.g.
> `DOC-03 [260305-governance]`) implemented in this session.

Do **not** merge to `main` during implementation sessions. Merge only when:

1. All tasks are `[x]` in `recommendations.md`
2. The Docusaurus preview is clean (no MDX errors)
3. **Re-audit complete** (see Step 6)
4. The user explicitly instructs a merge

---

## Step 6: Re-Audit — Definition of Done

When **all tasks** in `recommendations.md` are marked `[x]` and the Docusaurus
build is clean, offer the user a re-audit before considering the implementation
done.

> [!IMPORTANT]
> The re-audit is **mandatory** as a Definition of Done. Do not proceed to the
> session close or propose a merge without completing it, unless the user
> explicitly waives it.

### Trigger condition

Offer the re-audit when:

```
All recommendations.md tasks are [x]
AND Docusaurus build/preview is clean (no MDX errors, no broken links)
```

Use `notify_user` to offer:

> All [N] recommendations are implemented and the Docusaurus preview is clean.
> I can now perform a re-audit — reviewing the original `audit.md`, the
> completed `recommendations.md`, and the current documentation — to verify all
> findings are addressed, catch any regressions, and identify any improvements
> that emerged during implementation. Shall I proceed?

### Re-audit procedure

If the user confirms:

1. **Re-read** the original `audit.md` — every finding, every ⚠️.
2. **Re-read** the completed `recommendations.md` — verify all `[x]` items are
   actually implemented (spot-check at least one per recommendation in the
   documentation site).
3. **Re-examine** the documentation with fresh eyes — apply the same adversarial
   lenses from the original audit (completeness, accuracy, MDX correctness,
   governance compliance, readability). You have freedom to note improvements or
   new patterns you discovered during implementation.
4. **Write** `docs/audits/[slug]/re-audit.md` covering:
   - Which findings from the original `audit.md` are now resolved.
   - Any findings that are **partially addressed** or have **changed scope**.
   - Any **new findings** discovered during implementation.
   - Any **documentation improvements** introduced worth preserving as patterns.
5. **Write** `docs/audits/[slug]/re-audit-recommendations.md` following the
   same format as `recommendations.md` — severity-prioritised, with `[slug]`
   qualified IDs (e.g. `DOC-16 [YYMMDD-short-name]`). If there are no new
   findings, state this explicitly.
6. **Commit** both files to the feature branch:
   ```bash
   git add docs/audits/[slug]/re-audit.md docs/audits/[slug]/re-audit-recommendations.md
   git commit -m "audit([slug]): add re-audit and re-audit recommendations — DoD complete"
   git push origin audit/YYMMDD-short-name
   ```
7. The re-audit-recommendations.md forms the **final gate** before merge. If
   any new **High** or **Critical** findings are in re-audit-recommendations.md,
   they must be addressed before the user instructs a merge.

---

## Step 7: Session Close — Brief the Next Agent

Update `recommendations.md` with a session-close note at the bottom (append, do
not modify existing content):

```markdown
---

## Session [N] — [Date] — Completion Summary

**Audit slug:** `YYMMDD-short-name`\
**Implemented this session:** DOC-03 [YYMMDD-short-name], DOC-07
[YYMMDD-short-name], DOC-09 [YYMMDD-short-name]\
**Remaining:** DOC-01 (blocked — human input required), DOC-02, DOC-04, DOC-05,
DOC-06, DOC-08

**Next agent:** Begin Phase 2 (DOC-02, DOC-04). DOC-01 remains blocked pending
Founder input on conflict of interest policy — do not attempt to draft this
without explicit guidance. Any new observations are noted inline with `⚠️ New:`
markers above.
```

**Update the global audit registry** at
`documentation/common-bond/docs/audits/audit-registry.md` — update the row for
this audit slug to reflect the current status (e.g. `🔄 In Progress` →
`✅ Complete`). This step is **mandatory** even for repo-local audits.

Then `notify_user` with:

- What was completed this session (using full `DOC-NN [slug]` identifiers)
- Which items remain blocked on human input (and why)
- What the next session should tackle
- Any new documentation gaps surfaced during implementation
