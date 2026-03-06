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
3. **Verify the `common-bond` working tree is clean.** Fail if dirty — clean or
   stash first.
4. **Checkout the audit branch in `common-bond`:**
   ```bash
   cd /Users/ryan/.../documentation/common-bond
   git checkout audit/YYMMDD-slug
   ```
5. **Identify uncompleted tasks** — open `- [ ]` checkboxes in
   `recommendations.md`, grouped by target repository.
6. **For each target repo that has open tasks**, check whether a branch already
   exists:
   ```bash
   cd /Users/ryan/.../<target-repo>
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
- Which recommendation IDs (e.g. `REC-03 [YYMMDD-slug]`, `REC-07 [YYMMDD-slug]`)
- What verification you will run

Wait for approval before writing code.

---

## Step 3: Implement & Verify (One Repo at a Time)

For each target repository in this session's scope:

1. Follow the exact file paths in the recommendation tasks.
2. Adhere to repo-specific KI patterns (e.g. `python_microservice_architecture`,
   `supabase_infrastructure_and_database_architecture`,
   `receptor_frontend_applications`).
3. Maintain frontmatter, lint rules, and type safety constraints.
4. **Run the repo-specific verification gate before committing:**

   | Repo type         | Verification command                                  |
   | :---------------- | :---------------------------------------------------- |
   | Docusaurus site   | `npm run build`                                       |
   | Python backends   | `pytest`                                              |
   | Next.js frontends | `npx tsc --noEmit` and `npm run test`                 |
   | Supabase          | `supabase db reset`, `supabase test db`, `deno check` |

5. **Commit to that repo's `audit/YYMMDD-slug` branch**, referencing the slug:
   ```bash
   git add <files>
   git commit -m "feat(YYMMDD-slug): implement REC-NN — <short description>"
   git push origin audit/YYMMDD-slug
   ```

6. Only move on to the next repository after the current one is committed and
   pushed.

---

## Step 4: Finalise Session

1. **Cross off completed tasks** in `recommendations.md` (in `common-bond`) with
   an `x`.
2. Commit the updated `recommendations.md` to `common-bond`'s
   `audit/YYMMDD-slug` branch:
   ```bash
   cd /Users/ryan/.../documentation/common-bond
   git add docs/audits/YYMMDD-slug/recommendations.md
   git commit -m "audit(YYMMDD-slug): mark REC-NN complete; session close"
   git push origin audit/YYMMDD-slug
   ```
3. **Do not merge any branch to `main`** — this is left for manual review after
   the re-audit.

## Step 5: Finalise Global Audit

If this session completes the **final remaining tasks** of the global audit, do
NOT close the session here. Instead, transition to the `/finalise-global-audit`
workflow to perform the re-audit, raise PRs, merge, and archive the audit files.

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
