---
description: Implement tasks from a documentation audit recommendations.md in focused, context-safe sessions. Proposes a chunk of work, implements it, commits to main, then briefs the next agent.
---

## Overview

This workflow takes a `recommendations.md` documentation audit file and
implements its tasks safely across one or more agent sessions. Each session:

1. Reads the current state of `recommendations.md` (which tasks are `[ ]` vs
   `[x]`)
2. Proposes a session-sized chunk of work to the user
3. Implements the changes, previews them, and commits
4. Updates `recommendations.md` to mark completed tasks and brief the next
   session

---

## Step 1: Orient — Read the Audit Files

Locate the relevant audit directory. The user will tell you the audit name (e.g.
`260305-governance`). Read both files:

```
docs/audits/[YYMMDD]-[short-name]/audit.md
docs/audits/[YYMMDD]-[short-name]/recommendations.md
```

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
[Session N of Audit YYMMDD-name]
Proposed tasks for this session:
- DOC-03: Fix dead internal links in governance/ (5 files)
- DOC-07: Add missing frontmatter to compliance/iso27001 stubs
- DOC-09: Expand risk-management.md clinical risk table

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

## Step 5: Commit to Main

```bash
git add .
git commit -m "docs(audit/[short-name]): implement [DOC-XX, DOC-YY] — [brief description]"
git push origin main
```

The commit message must reference the DOC IDs implemented in this session.

---

## Step 6: Session Close — Brief the Next Agent

Update `recommendations.md` with a session-close note at the bottom (append, do
not modify existing content):

```markdown
---

## Session [N] — [Date] — Completion Summary

**Implemented this session:** DOC-03, DOC-07, DOC-09\
**Remaining:** DOC-01 (blocked — human input required), DOC-02, DOC-04, DOC-05,
DOC-06, DOC-08

**Next agent:** Begin Phase 2 (DOC-02, DOC-04). DOC-01 remains blocked pending
Founder input on conflict of interest policy — do not attempt to draft this
without explicit guidance. Any new observations are noted inline with `⚠️ New:`
markers above.
```

Then `notify_user` with:

- What was completed this session
- Which items remain blocked on human input (and why)
- What the next session should tackle
- Any new documentation gaps surfaced during implementation
