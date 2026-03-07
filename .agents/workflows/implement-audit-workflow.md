---
description: Implement tasks from an audit recommendations.md in focused, context-safe sessions. Proposes a chunk of work, implements it, commits to the feature branch, then briefs the next agent.
---

## Overview

Audit implementation is done in manageable chunks (1 phase or 2-4 related
recommendations) so progress can be committed and context safely handed to the
next agent.

---

## Step 1: Pre-Flight

1. **Locate the audit files:** The audit slug in `recommendations.md` and
   feature branch name are the canonical pointers. Paths follow conventions:
   - Cross-ecosystem (active/complete): `docs/audits/` (in `common-bond`)
   - Repo-local (active): `docs/audits/` (in target repo)
   - Repo-local (archived): `docs/audits/archive/`
   - Docusaurus exception: `dev-docs/audits/`
2. **Verify cleanliness:**
   ```bash
   git status
   ```
   Fail if the working tree is dirty — clean it up first.
3. **Checkout feature branch:** e.g., `git checkout audit/YYMMDD-slug`.
   ```bash
   git branch -vv
   # Confirm the branch shows [origin/audit/YYMMDD-slug] — if not, run:
   # git branch --set-upstream-to=origin/audit/YYMMDD-slug
   ```
4. **Identify uncompleted tasks:** Look for open `- [ ]` checkboxes in
   `recommendations.md`.
5. **Read the Agent Clarifications table** at the top of `recommendations.md`
   before writing any code. Every human decision is recorded there — approved
   exemptions, severity escalations, preferred approaches, and out-of-scope
   deferrals. Do not re-implement, ask about, or second-guess decisions already
   captured in that table.
6. **Note any reference implementations** mentioned in `recommendations.md` or
   `audit.md`. Before designing your own approach for a finding, check if
   another file or repo already implements the pattern correctly — use it as the
   template.

---

## Step 2: Propose Scope

Use `notify_user` to state exactly what you will tackle in this session. Wait
for approval before writing code. Include:

- Which recommendation IDs you will implement (e.g. `CROSS-04`, `WF-02`)
- What verification gate you will run
- Any decisions you need from the user that aren't in the Agent Clarifications
  table (keep these minimal — most should already be there)

---

## Step 3: Implement & Verify

1. Follow exact file paths in the recommendation tasks.
2. Adhere to repo-specific KI patterns (e.g. `python_microservice_architecture`
   or `supabase_infrastructure_and_database_architecture`).
3. Maintain frontmatter, lint rules, and type safety constraints.
4. **Check the Agent Clarifications table before implementing anything that
   involves a third-party tool, CI secret, or external service** — the approved
   approach (e.g. self-hosted Renovate, `gh secret set` for DSNs) will be
   documented there.
5. **For CI secrets:** use `gh secret set` via the gh CLI:
   ```bash
   gh secret set SECRET_NAME --body "value" --repo owner/repo-name
   ```
   No manual GitHub portal step is required.
6. **Run strict verification gates before committing:**

   | Repo type         | Verification command                                  |
   | :---------------- | :---------------------------------------------------- |
   | Docusaurus site   | `npm run build`                                       |
   | Python backends   | `pytest`                                              |
   | Next.js frontends | `npx tsc --noEmit` and `npm run test`                 |
   | Supabase          | `supabase db reset`, `supabase test db`, `deno check` |

---

## Step 4: Finalise Session

1. Cross off completed tasks in `recommendations.md` with an `x`.
2. Ensure everything committed maps to the feature branch. Do not merge to
   `main`.
3. Push to original branch: `git push origin HEAD`
4. **Only raise a PR when all tasks are complete** (or when the user explicitly
   requests one mid-audit). Opening draft PRs after each session creates noise
   and stale review requests. If a PR is needed:
   ```bash
   gh pr create --base main \
     --head audit/YYMMDD-slug \
     --title "audit(YYMMDD-slug): implement recommendations" \
     --body "Closes audit in docs/audits/YYMMDD-slug/"
   ```
   Merge only occurs after the user approves the PR on GitHub.

---

## Step 5: Re-Audit (Definition of Done)

If your session completes the **final remaining tasks** of an audit:

1. Conduct a mini re-audit to verify the implemented state matches the original
   recommendations.
2. Save findings to `re-audit.md` in the same directory.
3. Do not close the audit block until `re-audit.md` asserts full completion.

---

## Step 6: Update Registry & Close Session

1. Append a **Session Close** section to the bottom of `recommendations.md` with
   the following structure:

   ```markdown
   ## Session Close — [YYYY-MM-DD]

   **Completed:** [List of finding IDs marked done this session] **Remaining:**
   [List of open finding IDs, or "None — audit complete"] **Blocked:** [Any finding
   IDs blocked on external action, with reason] **Brief for next agent:** [What the
   next agent needs to know upfront that isn't already in the Agent Clarifications
   table — e.g. a file that was refactored mid-session, a verification that was
   skipped with reason, or a decision that should be added to the table]
   ```

2. Update the status of this audit in
   `documentation/common-bond/docs/audits/audit-registry.md`. If the audit is
   now completely finished, set to `✅ Complete`. If work remains, ensure it is
   set to `🔄 In Progress`.
3. Use `notify_user` to report session completion, completed IDs, blockers, and
   next targets.
