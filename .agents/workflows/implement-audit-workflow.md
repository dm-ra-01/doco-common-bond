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

---

## Step 2: Propose Scope

Use `notify_user` to state exactly what you will tackle in this session. Wait
for approval before writing code.

---

## Step 3: Implement & Verify

1. Follow exact file paths in the recommendation tasks.
2. Adhere to repo-specific KI patterns (e.g. `python_microservice_architecture`
   or `supabase_infrastructure_and_database_architecture`).
3. Maintain frontmatter, lint rules, and type safety constraints.
4. **Run strict verification gates:**
   - Docusaurus: `npm run build`
   - Python backends: `pytest`
   - Frontends: `npx tsc --noEmit` and `npm run test`
   - Supabase: `supabase db reset`, `supabase test db`, `deno check`

---

## Step 4: Finalise Session

1. Cross off completed tasks in `recommendations.md` with an `x`.
2. Ensure everything committed maps to the feature branch. Do not merge to
   `main`.
3. Push to original branch: `git push origin HEAD`
4. Open a pull request:
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

1. Append a **Session Close** section to the bottom of `recommendations.md`
   noting what was done, what remains blocked/open, and a brief for the next
   agent.
2. If the audit is now complete, update its status in
   `documentation/common-bond/docs/audits/audit-registry.md` to `✅ Complete`.
3. Use `notify_user` to report session completion, completed IDs, blockers, and
   next targets.
