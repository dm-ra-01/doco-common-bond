---
description: Implement tasks from an audit recommendations.md in focused, context-safe sessions. Proposes a chunk of work, implements it, commits to the feature branch, then briefs the next agent.
---

## Overview

Audit implementation is done in manageable chunks (1 phase or 2-4 related
recommendations) so progress can be committed and context safely handed to the
next agent.

> [!IMPORTANT]
> **Read these skills before starting any implementation session:**
>
> - `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
>   — verification commands, coverage assessment, Destructive Operations Gate,
>   Session Close format
> - `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
>   — registry status values and commit conventions

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
   approach will be documented there.
5. **For CI secrets** and the **Destructive Operations Gate:** see
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`.
6. **Run the repo-specific verification gate before committing** — see
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
   for the canonical command per repo type.

---

## Step 4: Finalise Session

1. Cross off completed tasks in `recommendations.md` with an `x`.
2. Ensure everything committed maps to the feature branch. Do not merge to
   `main`.
3. Push to original branch: `git push origin HEAD`
4. **Only raise a PR when all tasks are complete** (or when the user explicitly
   requests one mid-audit). Opening draft PRs after each session creates noise.
   If a PR is needed:
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
3. Do not close the audit until `re-audit.md` asserts full completion.

Then transition to `/finalise-local-audit` (single-repo) or
`/finalise-global-audit` (cross-ecosystem) to perform the full re-audit, raise
PRs, merge, and archive.

---

## Step 6: Update Registry & Close Session

1. Append a **Session Close** section to `recommendations.md` — see
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
   for the required format.

2. Update the audit status in
   `documentation/common-bond/docs/audits/audit-registry.md` — see
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
   for the canonical status values:

   | Situation                             | Status to set   |
   | :------------------------------------ | :-------------- |
   | Implementation begun this session     | 🔧 Implementing |
   | All recommendations actioned/deferred | ✅ Closed       |

3. Use `notify_user` to report session completion, completed IDs, blockers, and
   next targets.

---

## Rules of Engagement

1. **Ask before implementing anything ambiguous.** If a task's intent is
   unclear, the target file has changed since the audit, or the correct approach
   is disputed — ask before writing code.

2. **Raise concerns, don't suppress them.** If a recommendation seems
   inappropriate, risky, overly broad, or premature — say so in `notify_user`.
   Surface your reasoning rather than blindly following the task list.

3. **Check the Agent Clarifications table first.** Many questions about
   approach, tooling, and approved exemptions are already answered there.
   Re-asking documented decisions wastes the user's time.

4. **Verify gates are not optional.** Do not skip `tsc --noEmit`, `pytest`, or
   `npm run build` to save time.

5. **One repo at a time.** Commit and push each repo before moving to the next.

6. **Exemptions are not oversights.** If the Agent Clarifications table records
   an approved exemption for a finding, do not implement that finding anyway.
