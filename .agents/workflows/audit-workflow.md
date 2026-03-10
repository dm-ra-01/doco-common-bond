---
description: Audit a feature, section, or technical area within the common-bond documentation repository; save audit.md and recommendations.json to ./docs/audits/[YYMMDD-slug]/
required_skills:
   - audit-document-standards
   - audit-registry
---

## Agent Infrastructure Compliance

> [!IMPORTANT]
> At the start of **every** audit (whether scoped to `common-bond` itself or
> targeting a repo), verify the target repo's agent infrastructure against the
> standard defined in:
> `documentation/common-bond/docs/engineering/agent-infrastructure.md`
>
> Check all four conditions. Any failure is a 🟠 finding in this audit:
>
> 1. **Three workflow stubs exist:** `audit-workflow.md`,
>    `implement-audit-workflow.md`, `finalise-local-audit.md` in
>    `.agents/workflows/`
> 2. **Skills referenced by absolute dev-environment path** — no relative
>    `.agents/skills/` references in any workflow file
> 3. **No orphaned local skill copies** — `.agents/skills/` should be absent or
>    empty
> 4. **No rules that should be skills** — `.agents/rules/` should not contain
>    cross-ecosystem standards (those belong in
>    `dev-environment/.agents/skills/`)

## Overview

Two modes:

- **Documentation audits** — corporate governance, readability, regulatory
  accuracy
- **Technical audits** — Supabase schema, governance register infrastructure,
  API surfaces

> [!IMPORTANT]
> **For cross-ecosystem audits spanning multiple repositories**, use the
> `/global-audit` workflow instead of this one. This `audit-workflow.md` is
> scoped to audits **within** the `common-bond` documentation repository.

## Repo Context

| Item                     | Value                                    |
| :----------------------- | :--------------------------------------- |
| **Stack**                | Docusaurus, Markdown, Supabase (gov DBs) |
| **Verify command**       | Doc review — no compile gate             |
| **Audit path (active)**  | `docs/audits/YYMMDD-slug/`               |
| **Audit path (archive)** | `docs/audits/archive/YYMMDD-slug/`       |
| **Feature branch**       | `audit/YYMMDD-slug` in this repo         |

## Required Skills

Read these before starting any audit session:

- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`
  — `recommendations.json` schema, DoD checklist, mutation scripts, canonical
  `jq` queries, iterative improvement protocol
- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
  — registry location, status values, Supabase dual-write (canonical field set
  in `dev-environment/.agents/schemas/supabase-audits-table.schema.json`),
  commit conventions

For adversarial and technical review:

- `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/adversarial-code-review/SKILL.md`

## Steps

1. **Scope** — Read the user's request. Read relevant KIs for the area in scope.
   Check `docs/audits/` for prior audits in the same area. Batch all blocking
   questions into one `notify_user` call before starting research.
2. **Branch** —
   `git checkout -b audit/YYMMDD-slug && git push -u origin audit/YYMMDD-slug`
3. **Research** — Read content, configs, and schema files. Note findings with
   file path, evidence, and severity (🔴/🟠/🟡/🟢). Do not make changes during
   the audit phase.

   **Documentation categories:** Coverage Gap, Regulatory Accuracy, Readability,
   Tone & Voice, Metadata, Internal Links, Structural Integrity, Governance
   Completeness.

   **Technical categories:** Security, Architectural Drift, Test Coverage,
   Contract Stability, Observability, Tech Debt.

   > [!NOTE]
   > When one area handles a concern correctly, flag it as the **reference
   > implementation** for the others. This saves implementation agents from
   > having to research the pattern themselves.

4. **Write** — Produce `audit.md` and `recommendations.json` per the
   `audit-document-standards` skill. Render `recommendations.md` and validate
   before committing:
   ```bash
   python /Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/render-recommendations.py \
     docs/audits/YYMMDD-slug/recommendations.json
   python /Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/scripts/validate-recommendations.py \
     docs/audits/YYMMDD-slug/recommendations.json
   ```
5. **Iterative improvement** — Follow the `proposed` → `accepted` → `open` JSON
   lifecycle in the `audit-document-standards` skill. Commit after each approved
   round.
6. **Registry** — Dual-write: markdown row + Supabase UPSERT per the
   `audit-registry` skill. Validate the UPSERT payload against
   `dev-environment/.agents/schemas/supabase-audits-table.schema.json` before
   sending. Write `audit-brief.json` per the `audit-document-standards` skill.
7. **Notify** — Present top findings and the audit slug via `notify_user`.

## Rules of Engagement

1. **Ask before assuming.** If the scope is ambiguous, ask the user before
   starting research. Batch all questions into one `notify_user` call.
2. **Caveat your suggestions honestly.** Flag genuine uncertainty, meaningful
   scope, or business decisions before escalating severity.
3. **Severity is a human decision.** Propose severity, but surface reasoning
   before escalating to 🔴 Critical.
4. **If something feels wrong, say so.** Raise concerns before committing.
5. **Read before writing.** Every finding must be grounded in evidence from
   actual files — not inference or prior knowledge.
6. **Scope creep is a finding, not a reason to expand.** Record out-of-scope
   issues as 🟢 Low findings and flag for a separate audit.
