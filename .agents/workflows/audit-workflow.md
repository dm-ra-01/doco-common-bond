---
description: Audit a feature, section, or technical area; save audit.md and recommendations.md to ./docs/audits/[YYMMDD-slug]/ (or archive/ for repo-local)
---

## Agent Infrastructure Compliance

> [!IMPORTANT]
> At the start of **every** audit (whether run on `common-bond` itself or on a
> target repo), verify the target repo's agent infrastructure against the
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
- **Technical audits** — code, DB schema, infrastructure, API surfaces

Produce two documents for the stated scope:

- `audit.md` — factual findings with evidence
- `recommendations.md` — prioritised, actionable tasks

> [!IMPORTANT]
> **Read these skills before starting any audit session:**
>
> - `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`
>   — document structure, field rules, DoD checklist, iterative improvement
>   protocol
> - `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`
>   — registry location, status values, commit conventions
>
> **For audits involving database schema, governance register migration, or
> Supabase/Postgres configuration (primary focus of this repo):**
>
> - `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/.agents/skills/supabase-postgres-best-practices/SKILL.md`
>   — schema design, RLS, indexing, and query optimisation best practices
>
> **For cross-ecosystem audits spanning multiple repositories**, use the
> `/global-audit` workflow instead of this one. This `audit-workflow.md` is
> scoped to audits **within** the `common-bond` documentation repository.

---

## Step 1: Orient

1. Read KIs related to the scope
2. Check `docs/audits/` (or `archive/` for repo-local) for prior audits
3. Read the adversarial-code-review skill:
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/adversarial-code-review/SKILL.md`
4. **Identify any carryover tasks** explicitly stated by the user — these are
   first-class findings, not footnotes.
5. **Batch all blocking questions into one `notify_user` call** before starting
   research. Do not ask for information mid-audit that you could have requested
   upfront (e.g. third-party DSNs, approved exemptions, severity decisions).

---

## Step 2: Research

For each finding: file + line/section, what it says/does vs Gold Standard,
severity (🔴/🟠/🟡/🟢).

**Documentation categories:** Coverage Gap, Regulatory Accuracy, Readability,
Tone & Voice, Metadata, Internal Links, Structural Integrity, Governance
Completeness.

**Technical categories:** Security, Architectural Drift, Test Coverage, Contract
Stability, Performance, Observability, Dead Code / Tech Debt.

> [!NOTE]
> When one area or file already handles a concern correctly, flag it as the
> **reference implementation** for the others. This saves implementation agents
> from having to research the pattern themselves.

---

## Step 3: Write `audit.md` and `recommendations.md`

Save to:

- Cross-ecosystem: `docs/audits/[YYMMDD-slug]/` (in `common-bond`)
- Repo-local active: `docs/audits/[YYMMDD-slug]/` (in target repo)
- Repo-local complete: moved to `docs/audits/archive/[YYMMDD-slug]/`
- Exception: `dev-docs/audits/[YYMMDD-slug]/` if target repo has a Docusaurus
  `docs/`

Create the feature branch before finalising:

```bash
git checkout -b audit/YYMMDD-slug
git push -u origin audit/YYMMDD-slug
git log --oneline origin/audit/YYMMDD-slug -1
# Confirm the remote branch exists and your most recent commit appears.
```

**For full document structure, field rules (including `Auditor:` field), finding
ID format, Agent Clarifications table, Implementation Order, Deferred Items, and
the Definition-of-Done checklist:** read
`/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`.

---

## Step 4: Iterative Improvement

The iterative improvement protocol is defined in
`/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-document-standards/SKILL.md`
(see "Iterative Improvement Protocol"). After presenting the initial audit,
offer 5 meaningful additions and repeat until the user concludes the session.
Commit and push after each approved round.

---

## Step 5: Update Registry and Notify

1. Add a row to `documentation/common-bond/docs/audits/audit-registry.md` with
   status `🔄 Drafting`. For status values, transition rules, and commit
   conventions, read
   `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/audit-registry/SKILL.md`.

2. Commit audit files + registry update to the feature branch.

3. Use `notify_user`: top 3–5 findings, slug, branch name, blocking decisions.

---

## Rules of Engagement

1. **Ask before assuming.** If the scope is ambiguous, the standard being
   audited is unclear, or a finding could be interpreted multiple ways — ask the
   user. A wrong assumption baked into `audit.md` is harder to fix than a
   clarifying question asked upfront.

2. **Caveat your suggestions honestly.** When proposing enhancements or
   iterative improvements, flag anything that:
   - Has genuine uncertainty ("this may already be handled — worth checking
     first")
   - Carries meaningful risk or scope ("this would require auditing 40+ files")
   - Depends on a business decision outside engineering ("only appropriate if
     the app goes public-facing")

3. **Severity is a human decision.** You may propose a severity level, but if
   you are uncertain — or if bumping a severity has significant implementation
   consequences — surface your reasoning and ask.

4. **If something feels wrong, say so.** If a finding seems inappropriate,
   premature, or potentially harmful to document in a shared repository, raise
   it with the user before committing.

5. **Read before writing.** Never assume a repo's state. Every finding must be
   grounded in evidence from actual files — not inference or prior knowledge.

6. **Scope creep is a finding, not a reason to expand.** If research reveals an
   issue significantly outside the stated scope, record it as a 🟢 Low finding
   and flag it for a separate audit — do not silently expand the current audit.
