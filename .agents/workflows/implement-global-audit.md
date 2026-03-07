---
description: Implement tasks from a global audit recommendations.md across multiple repositories in focused, context-safe sessions. Mirrors /implement-audit-workflow but handles the cross-repo branching, verification, and re-audit requirements specific to global audits.
---

## Overview

Global audit implementation sessions are scoped to **one repository at a time**
(or one tightly-scoped cross-cutting change). Progress is committed after each
repository block, then control returns to the agent to propose the next block.
This keeps context safe and ensures each repo's verification gate is honoured
before moving on.

---

## Step 1: Pre-Flight

1. **Locate the audit files** in `common-bond`:
   ```
   documentation/common-bond/docs/audits/YYMMDD-slug/
   ├── audit.md
   └── recommendations.md
   ```
2. **Identify the audit slug and scope** from the header of `recommendations.md`
   (`<!-- audit-slug: YYMMDD-slug -->`).
3. **Read the Agent Clarifications table** at the top of `recommendations.md`
   before writing any code. This table records every human decision made during
   the audit — approved approaches, severity decisions, exemptions, and
   tool-specific guidance. Do not re-ask about anything documented there.
4. **Note any reference implementations.** `audit.md` and `recommendations.md`
   may identify a specific repo that already handles a concern correctly. Use it
   as the template before designing your own implementation.
5. **Verify the `common-bond` working tree is clean.** Fail if dirty — clean or
   stash first.
6. **Checkout the audit branch in `common-bond`:**
   ```bash
   cd /path/to/documentation/common-bond
   git checkout audit/YYMMDD-slug
   ```
7. **Identify uncompleted tasks** — open `- [ ]` checkboxes in
   `recommendations.md`, grouped by target repository.
8. **For each target repo that has open tasks**, check whether a branch already
   exists. Use `meta` for cross-repo branch operations:
   ```bash
   # Using meta for cross-repo branch management:
   meta git fetch origin
   meta git branch -r | grep audit/YYMMDD-slug

   # Or per-repo:
   cd /path/to/<target-repo>
   git fetch origin
   git branch -r | grep audit/YYMMDD-slug
   ```
   - If the branch exists: `git checkout audit/YYMMDD-slug`
   - If not:
     `git checkout -b audit/YYMMDD-slug && git push -u origin audit/YYMMDD-slug`

---

## Step 2: Propose Scope

Use `notify_user` to state exactly what you will tackle in this session:

- Which repository (or cross-cutting concern)
- Which finding IDs (e.g. `CROSS-04`, `WF-02`)
- What verification gate you will run
- Any decisions not in the Agent Clarifications table that you need before
  starting

Wait for approval before writing code.

---

## Step 3: Implement & Verify (One Repo at a Time)

For each target repository in this session's scope:

1. Follow the exact file paths in the recommendation tasks.
2. Adhere to repo-specific KI patterns (e.g. `python_microservice_architecture`,
   `supabase_infrastructure_and_database_architecture`,
   `receptor_frontend_applications`).
3. Maintain frontmatter, lint rules, and type safety constraints.
4. **For CI secrets:** use `gh secret set` via the gh CLI — no manual GitHub
   portal step is required:
   ```bash
   gh secret set SECRET_NAME --body "value" --repo owner/repo-name
   ```
   The DSNs and other credentials are in the Agent Clarifications table or in
   the relevant finding section.
5. **For new tooling (e.g. Renovate):** use the self-hosted GitHub Actions
   approach (`renovatebot/github-action`) rather than installing a GitHub App.
   Agents can set this up autonomously without any OAuth or organisation-level
   permission grant.
6. **Run the repo-specific verification gate before committing:**

   | Repo type         | Verification command                                  |
   | :---------------- | :---------------------------------------------------- |
   | Docusaurus site   | `npm run build`                                       |
   | Python backends   | `pytest`                                              |
   | Next.js frontends | `npx tsc --noEmit` and `npm run test`                 |
   | Supabase          | `supabase db reset`, `supabase test db`, `deno check` |

7. **Commit to that repo's `audit/YYMMDD-slug` branch**, using `fix` or `chore`
   prefix (not `feat` — these are compliance improvements, not new features):
   ```bash
   git add <files>
   git commit -m "fix(YYMMDD-slug): implement CROSS-NN — <short description>"
   git push origin audit/YYMMDD-slug
   ```

8. Only move on to the next repository after the current one is committed and
   pushed.

---

## Step 4: Finalise Session

1. **Cross off completed tasks** in `recommendations.md` (in `common-bond`) with
   an `x`.
2. Commit the updated `recommendations.md` to `common-bond`'s
   `audit/YYMMDD-slug` branch:
   ```bash
   cd /path/to/documentation/common-bond
   git add docs/audits/YYMMDD-slug/recommendations.md
   git commit -m "audit(YYMMDD-slug): mark CROSS-NN complete; session close"
   git push origin audit/YYMMDD-slug
   ```
3. **Do not merge any branch to `main`** — this is left for
   `/finalise-global-audit`.

---

## Step 5: Session Close Brief

Append a **Session Close** section to `recommendations.md`:

```markdown
## Session Close — [YYYY-MM-DD]

**Completed:** [Finding IDs marked done this session] **Remaining:** [Open
finding IDs with target repo, or "None — audit complete"] **Blocked:** [Finding
IDs blocked on external action with reason, or "None"] **PR order note:** [If
multiple repos need PRs and one depends on another, note the merge order here —
e.g. "Merge supabase-receptor first; planner-frontend schema imports depend on
it"] **Brief for next agent:** [What the next agent needs upfront — new
decisions made during implementation that should be added to the Agent
Clarifications table, any skipped verification steps with reason, files
refactored mid-session]
```

---

## Step 6: PR Sequencing

When the audit is complete and it is time to raise PRs across multiple repos,
**order matters** if any repo's changes depend on another. Consider:

- Schema / database changes (supabase-receptor) should be merged before frontend
  codegen or type changes that import from them
- Shared config or tooling changes (e.g. Renovate workflow) can be raised in
  parallel across repos
- Use `meta` to raise PRs across all repos in a single command where order
  doesn't matter:
  ```bash
  meta gh pr create --base main --head audit/YYMMDD-slug \
    --title "audit(YYMMDD-slug): implement recommendations" \
    --body "Part of global audit docs/audits/YYMMDD-slug/"
  ```

If the final session completes **all remaining tasks**, transition to the
`/finalise-global-audit` workflow to perform the re-audit, raise PRs in the
correct order, merge, and archive the audit files.

---

## Branch Summary

| Repository       | Branch convention                                                                |
| :--------------- | :------------------------------------------------------------------------------- |
| `common-bond`    | `audit/YYMMDD-slug` — houses `audit.md`, `recommendations.md`, `re-audit.md`     |
| Each target repo | `audit/YYMMDD-slug` — implementation changes; commit messages reference the slug |

> [!IMPORTANT]
> Each repository's implementation is committed to its **own**
> `audit/YYMMDD-slug` branch. The `common-bond` branch is the source of truth
> for audit status; it is updated last in every session.

> [!NOTE]
> `meta` is configured for global repository access across the ecosystem. Use
> `meta git <command>` to run git operations across all repos simultaneously,
> and `meta gh pr create` to raise PRs in bulk. This is particularly useful for
> cross-cutting changes (e.g. adding `robots.txt` to all three frontends) that
> can be committed in parallel.
