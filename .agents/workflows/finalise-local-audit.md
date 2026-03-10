---
description: Finalise a single-repo audit for common-bond. Performs the re-audit, raises the PR, merges it, and archives the audit files within this repo.
required_skills:
   - audit-document-standards
   - audit-registry
   - audit-verification-gates
---

## Required Skills

Read these before starting:

- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
  — re-audit format, coverage assessment pattern, Session Close format
- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
  — `✅ Closed` transition, Supabase dual-write (validate payload against
  `dev-environment/.agents/schemas/supabase-audits-table.schema.json`), commit
  conventions, archive link format
- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  — `jq` verification queries, validator script

## Repo Context

| Item               | Value                        |
| :----------------- | :--------------------------- |
| **Verify command** | Doc review — no compile gate |

## Steps

1. **Re-Audit** — Verify all tasks are complete:
   ```bash
   jq '[.findings[].tasks[] | select(.status != "complete")]' \
     docs/audits/YYMMDD-slug/recommendations.json
   ```
   Run the validator:
   ```bash
   python /Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/validate-recommendations.py \
     docs/audits/YYMMDD-slug/recommendations.json
   ```
   Document the coverage assessment per the `audit-verification-gates` skill.
   Save findings to `re-audit.md`.

2. **Update Registry & Raise PR** — Re-render `recommendations.md` from JSON.
   Append Session Close per the `audit-verification-gates` skill. Set registry
   to `✅ Closed` with Supabase dual-write per the `audit-registry` skill
   (validate the UPSERT payload against
   `dev-environment/.agents/schemas/supabase-audits-table.schema.json`). Raise
   PR via `mcp_github-mcp-server_create_pull_request`. Use `notify_user` to
   report PRs — **STOP** and wait for approval.

3. **Merge & Cleanup** — Merge PR. Delete remote `audit/YYMMDD-slug` branch.
   Clean up local branch.

4. **Archive** — Move `docs/audits/YYMMDD-slug/` →
   `docs/audits/archive/YYMMDD-slug/`. Update `audit-registry.md` archive links
   per the `audit-registry` skill. Commit to `main`. Notify user audit is
   closed.
