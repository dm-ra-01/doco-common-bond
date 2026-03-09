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
   - Check `codecov/patch` on each open PR. Use `mcp_github-mcp-server_pull_request_read`
     (method: `get_status`) or `gh pr checks <number>` to inspect all status check results.
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
2. Update `docs/audits/audit-registry.md` status to `✅ Closed` for this audit.
3. Commit and push these final changes to the `common-bond` audit branch.
4. **Raise Pull Requests** across all touched repositories. Use
   `mcp_github-mcp-server_create_pull_request` for each repo that has an audit
   branch (preferred over `gh pr create` via terminal).
5. Use `notify_user` to report the PRs and ask for approval to merge. **STOP
   HERE** and wait for the user.

---

## Step 3: Merge PRs & Cleanup

Once the user approves the PRs:

1. Merge all PRs using `mcp_github-mcp-server_merge_pull_request` (preferred)
   or `gh pr merge --merge --delete-branch` via terminal.
   - If a PR shows `mergeable: false` / `mergeable_state: dirty`, use
     `mcp_github-mcp-server_push_files` to push a conflict-resolved version of
     the conflicting file(s) directly to main, then close the PR (the content is
     already on main).
2. Delete remote audit branches: `gh pr merge --delete-branch` handles this
   automatically; or delete manually with `gh api -X DELETE repos/{owner}/{repo}/git/refs/heads/audit/YYMMDD-slug`.
3. Clean up local audit branches after pulling main:
   ```bash
   git checkout main && git pull origin main && git branch -D audit/YYMMDD-slug || true
   ```

---

## Step 4: Archive the Audit

1. The `docs/audits/YYMMDD-slug/` folder in `common-bond` must be moved to
   `docs/audits/archive/YYMMDD-slug/`. Use `mcp_github-mcp-server_push_files`
   to write the audit files to `docs/audits/archive/YYMMDD-slug/` and then
   `mcp_github-mcp-server_delete_file` to remove the originals from
   `docs/audits/YYMMDD-slug/`.
2. Update `docs/audits/audit-registry.md` to point to the new archive paths:
   - `[audit.md](../audits/archive/YYMMDD-slug/audit.md)`
   - `[recommendations.md](../audits/archive/YYMMDD-slug/recommendations.md)`
3. Commit these archival changes to `main` via `mcp_github-mcp-server_push_files`
   (include updated `audit-registry.md` in the same commit).
4. Use `notify_user` to report that the global audit is fully archived and
   closed.
