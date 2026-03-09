---
description: Finalise a single-repo audit produced by /audit-workflow. Performs the re-audit, raises the PR, merges it, and archives the audit files within the target repo.
---

## Overview

When all tasks in a single-repo audit (`recommendations.md`) are complete, this
workflow verifies the work, merges it, and archives the audit record within the
target repository. It mirrors `/finalise-global-audit` — the key difference is
that everything (branch, PR, archive) stays in the **target repo**, not in
`common-bond`.

> [!IMPORTANT]
> **Before starting:** Read the two skills this workflow depends on:
>
> - `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
> - `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`

---

## Step 1: Re-Audit (Definition of Done)

1. Locate the audit files in the **target repo**:
   ```
   <target-repo>/docs/audits/YYMMDD-slug/
   ├── audit.md
   ├── recommendations.md
   └── re-audit.md   ← you will create this
   ```
   Exception: use `dev-docs/audits/YYMMDD-slug/` if the repo's `docs/` is a
   Docusaurus site.

2. For each `- [x]` task in `recommendations.md`, verify it is demonstrably
   implemented — cite file path + evidence. Mark any `- [ ]` that is still open.

3. **Run the verification gate** for the target repo. See
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
   for the canonical command per repo type.

4. **Assess code coverage** using the pattern in the same skill. For each
   uncovered file in the PR's `codecov/patch` check, classify it as acceptable
   or must-fix. Write missing tests for any must-fix files before proceeding.

5. Save a `re-audit.md` to the same directory as `audit.md`:

   ```markdown
   # Re-Audit — YYMMDD-slug

   **Date:** YYYY-MM-DD **Re-auditor:** Ryan Ammendolea

   ## Task Verification

   | Finding ID | Status  | Evidence                        |
   | ---------- | ------- | ------------------------------- |
   | PROC-01    | ✅ Done | [file path + one-line evidence] |

   ## Code Coverage Assessment

   [coverage table — see audit-verification-gates skill]
   ```

6. Do not proceed to Step 2 until `re-audit.md` confirms every task is resolved
   **and** the coverage assessment is documented.

---

## Step 2: Update Registry & Raise PR

1. Append a **Session Close** section to `recommendations.md` — see
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
   for the required format.

2. **Dual-write the registry update** (both must be kept in sync):

   a. **Markdown** — Update `documentation/common-bond/docs/audits/audit-registry.md`
      — set the status for this audit to `✅ Closed`. See
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
      for the canonical status values and commit conventions.

   b. **Supabase** — `UPSERT` the audit row in the `supabase-common-bond`
      `public.audits` table via the REST API:
      ```bash
      curl -X POST \
        "https://wbpqompuqeauckdctemj.supabase.co/rest/v1/audits" \
        -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d '{
          "slug": "YYMMDD-slug",
          "status": "Closed",
          "scope": "<scope description>",
          "recommendations_url": "docs/audits/archive/YYMMDD-slug/recommendations.md"
        }'
      ```
      > [!NOTE]
      > `SUPABASE_SERVICE_ROLE_KEY` is a repository secret in
      > `dm-ra-01/supabase-common-bond`. Retrieve it from GitHub secrets or
      > the Supabase dashboard — never hard-code it. Both Markdown and Supabase
      > must be updated before committing; they are the dual source of truth
      > until the Markdown file is formally deprecated.

3. Commit the final `re-audit.md`, updated `recommendations.md`, and the
   checked-off `recommendations.md` to the **target repo's** `audit/YYMMDD-slug`
   branch:
   ```bash
   cd /path/to/<target-repo>
   git add docs/audits/YYMMDD-slug/
   git commit -m "audit(YYMMDD-slug): re-audit complete; all tasks verified"
   git push origin audit/YYMMDD-slug
   ```

4. Commit the registry update to `common-bond`'s `audit/YYMMDD-slug` branch (or
   directly to `main` if no separate `common-bond` branch was created):
   ```bash
   cd /path/to/documentation/common-bond
   git add docs/audits/audit-registry.md
   git commit -m "audit(YYMMDD-slug): close audit in registry"
   git push origin audit/YYMMDD-slug  # or main
   ```

5. **Raise the PR** for the target repo using
   `mcp_github-mcp-server_create_pull_request`:
   - `head`: `audit/YYMMDD-slug`
   - `base`: `main`
   - `title`: `audit(YYMMDD-slug): implement recommendations`
   - `body`: reference the audit directory path

6. Use `notify_user` to report the PR link and ask for approval to merge. **STOP
   HERE** and wait for the user.

---

## Step 3: Merge PR & Cleanup

Once the user approves:

1. Merge using `mcp_github-mcp-server_merge_pull_request` (preferred) or:
   ```bash
   gh pr merge <number> --merge --delete-branch --repo <owner>/<repo>
   ```
   If the PR shows `mergeable: false` / `mergeable_state: dirty`, push a
   conflict-resolved version of the conflicting file(s) directly to `main` via
   `mcp_github-mcp-server_push_files`, then close the PR (content is already on
   `main`).

2. Delete the remote audit branch (handled by `--delete-branch`; or manually):
   ```bash
   gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/audit/YYMMDD-slug
   ```

3. Clean up locally:
   ```bash
   cd /path/to/<target-repo>
   git checkout main && git pull origin main
   git branch -D audit/YYMMDD-slug || true
   ```

---

## Step 4: Archive the Audit

The audit files must move from `docs/audits/YYMMDD-slug/` to
`docs/audits/archive/YYMMDD-slug/` **within the target repo**.

Since the audit branch has been merged and deleted, use the GitHub MCP to
perform the move directly on `main`:

1. Use `mcp_github-mcp-server_push_files` to write all audit files to
   `docs/audits/archive/YYMMDD-slug/` on `main`.

2. Use `mcp_github-mcp-server_delete_file` to remove the originals from
   `docs/audits/YYMMDD-slug/` on `main`.

3. Update `documentation/common-bond/docs/audits/audit-registry.md` to point to
   the new archive paths — see
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
   for the correct link format. Commit this registry update to `common-bond`'s
   `main` branch via `mcp_github-mcp-server_push_files`.

4. Use `notify_user` to confirm the audit is fully archived and closed.

---

## Rules of Engagement

1. **The verification gate is mandatory.** Do not skip `tsc --noEmit`, `pytest`,
   or `npm run build` regardless of how minor the changes appear.

2. **No assumptions about task completion.** Check each `- [x]` against actual
   file evidence — a ticked checkbox without verifiable evidence is not done.

3. **Coverage assessment is required.** Never proceed to PR stage without
   documenting the coverage gaps (even if all gaps are acceptable).

4. **Destructive operations require confirmation.** See the Destructive
   Operations Gate in
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
   — it applies during finalisation as much as during implementation.

5. **Do not archive until merged.** The archive step (Step 4) runs on `main`
   after the PR is merged. Archiving from the feature branch creates a
   two-branch inconsistency.
