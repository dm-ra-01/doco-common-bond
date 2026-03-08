---
description: Finalise a global audit across multiple repositories. Performs the re-audit, raises PRs, merges them, and archives the audit files.
---

## Overview

When all tasks in a global audit (`recommendations.md`) are complete, this
workflow is triggered to verify the work, merge it across the ecosystem, and
properly archive the audit record.

---

## Step 1: Re-Audit (Definition of Done)

1. Conduct a mini re-audit across **all repositories listed in `audit.md`'s
   scope**, not just `common-bond`.
2. For each repo, verify:
   - All `- [x]` tasks are demonstrably implemented (cite file path + evidence).
   - The relevant verification gate passes (e.g. `npm run test`, `pytest`,
     `npm run build`, `deno check`).
3. **Review code coverage** for each repo's audit PR:
   - Check `codecov/patch` on each open PR. Run `gh pr checks <number>` to
     inspect all status check results.
   - For any coverage gap, categorise each uncovered file:
     - **Acceptable gap:** Config files (`next.config.ts`,
       `sentry.client.config.ts`), infra scaffolding (`error.tsx`,
       `loading.tsx`, `robots.txt`), generated files (`graphql/generated.ts`) —
       no unit tests required.
     - **Requires remediation:** New business logic (hooks, services, actions,
       utilities) missing coverage. Write missing tests before merging.
   - Document the coverage assessment in `re-audit.md` so the decision is on
     record. Format:
     ```
     | File | Gap reason | Acceptable? |
     |------|-----------|-------------|
     | error.tsx | React error boundary — no unit test needed | ✅ Yes |
     | useSomeHook.ts | New business logic, no test | ❌ Must fix |
     ```
4. Save findings to `re-audit.md` in the same directory as `audit.md`:
   ```text
   documentation/common-bond/docs/audits/YYMMDD-slug/re-audit.md
   ```
5. Do not declare the audit complete until `re-audit.md` confirms all items are
   resolved **and** the coverage assessment is documented.

---

## Step 2: Update Registry & Raise PRs

1. Append a **Session Close** section to `recommendations.md` detailing the
   re-audit and completion.
2. Update `docs/audits/audit-registry.md` status to `✅ Complete` for this
   audit.
3. Commit and push these final changes to the `common-bond` audit branch:
   ```bash
   cd /Users/ryan/.../documentation/common-bond
   git add docs/audits/YYMMDD-slug/re-audit.md docs/audits/YYMMDD-slug/recommendations.md docs/audits/audit-registry.md
   git commit -m "audit(YYMMDD-slug): finalise audit and update registry"
   git push origin audit/YYMMDD-slug
   ```
4. **Raise Pull Requests** across all touched repositories using `meta exec`.
   From the workspace root:
   ```bash
   meta exec "git rev-parse --verify origin/audit/YYMMDD-slug >/dev/null 2>&1 && gh pr create --base main --head audit/YYMMDD-slug --title 'audit(YYMMDD-slug): implement global recommendations' --body 'Closes global audit YYMMDD-slug' || echo 'Skip: No audit branch here'"
   ```
5. Use `notify_user` to report the PRs and ask for approval to merge. **STOP
   HERE** and wait for the user.

---

## Step 3: Merge PRs & Cleanup

Once the user approves the PRs:

1. Merge all PRs, delete the remote branches, and update local `main` branches
   using `meta exec`:
   ```bash
   meta exec "git rev-parse --verify origin/audit/YYMMDD-slug >/dev/null 2>&1 && gh pr merge audit/YYMMDD-slug --merge --delete-branch && git checkout main && git pull origin main || echo 'Skip: No audit branch here'"
   ```
2. Clean up local audit branches:
   ```bash
   meta exec "git branch -D audit/YYMMDD-slug || true"
   ```

---

## Step 4: Archive the Audit

1. Move the completed audit folder into the `archive` directory in
   `common-bond`:
   ```bash
   cd /Users/ryan/.../documentation/common-bond
   mv docs/audits/YYMMDD-slug docs/audits/archive/YYMMDD-slug
   ```
2. Update `docs/audits/audit-registry.md` to point to the new archive paths:
   - `[audit.md](../audits/archive/YYMMDD-slug/audit.md)`
   - `[recommendations.md](../audits/archive/YYMMDD-slug/recommendations.md)`
3. Commit and push this archival directly to `main` (since the audit branch is
   already merged):
   ```bash
   cd /Users/ryan/.../documentation/common-bond
   git add docs/audits/archive/YYMMDD-slug docs/audits/audit-registry.md
   git commit -m "docs(audit): archive completed YYMMDD-slug audit"
   git push origin main
   ```
4. Use `notify_user` to report that the global audit is fully archived and
   closed.
