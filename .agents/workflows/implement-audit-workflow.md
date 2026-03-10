---
description: Implement tasks from an audit recommendations.json for common-bond documentation repo in focused, context-safe sessions.
required_skills:
   - audit-document-standards
   - audit-registry
   - audit-verification-gates
---

## Repo Context

| Item               | Value                                    |
| :----------------- | :--------------------------------------- |
| **Stack**          | Docusaurus, Markdown, Supabase (gov DBs) |
| **Verify command** | Doc review — no compile gate             |

## Required Skills

Read these before starting any implementation session:

- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  — `recommendations.json` schema, mutation scripts, canonical `jq` queries,
  `audit-brief.json` format
- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-verification-gates/SKILL.md`
  — coverage assessment, Session Close format (no destructive gate for
  documentation repos)
- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
  — registry status values, Supabase dual-write, commit conventions

## Steps

1. **Pre-Flight** — Locate `recommendations.json` (primary) and
   `audit-brief.json` in `docs/audits/YYMMDD-slug/`. Read both before writing
   any code. If only `recommendations.md` exists (pre-migration audit), fall
   back to scanning `- [ ]` checkboxes. Verify working tree is clean. Checkout
   `audit/YYMMDD-slug`.

2. **Identify open tasks:**
   ```bash
   jq '[.findings[] | {id: .id, repo: .repo, tasks: [.tasks[] | select(.status == "open")]} | select(.tasks | length > 0)]' \
     docs/audits/YYMMDD-slug/recommendations.json
   ```
   See `audit-document-standards` skill for additional canonical `jq` patterns.

3. **Propose Scope** — Use `notify_user` to state exactly what you will
   implement. Wait for approval.

4. **Implement & Verify** — Follow exact file paths in recommendations. For
   documentation changes, verify Docusaurus site builds cleanly if applicable.
   Commit to `audit/YYMMDD-slug`.

5. **Finalise Session** — Update task status via mutation script (do not
   hand-edit `recommendations.json`):
   ```bash
   /Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/complete-task.sh \
     --file docs/audits/YYMMDD-slug/recommendations.json \
     --finding FINDING-ID \
     --task TASK-ID \
     --completed-by "session-id"
   ```
   Re-render and validate:
   ```bash
   python /Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/render-recommendations.py \
     docs/audits/YYMMDD-slug/recommendations.json
   python /Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/validate-recommendations.py \
     docs/audits/YYMMDD-slug/recommendations.json
   ```
   Update `audit-brief.json` and registry per the skills. Append a Session Close
   block per the `audit-verification-gates` skill format.

6. **Re-Audit (if final session)** — If all tasks are done, trigger
   `/finalise-local-audit`.
