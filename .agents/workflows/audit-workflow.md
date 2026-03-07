---
description: Audit a feature, section, or technical area; save audit.md and recommendations.md to ./docs/audits/[YYMMDD-slug]/ (or archive/ for repo-local)
---

## Overview

Two modes:

- **Documentation audits** — corporate governance, readability, regulatory
  accuracy
- **Technical audits** — code, DB schema, infrastructure, API surfaces

Produce two documents for the stated scope:

- `audit.md` — factual findings with evidence, ≤ 8,000 bytes
- `recommendations.md` — prioritised, actionable tasks, ≤ 10,000 bytes

---

## Step 1: Orient

1. Read KIs related to the scope
2. Check `docs/audits/` (or `archive/` for repo-local) for prior audits
3. Read the adversarial-code-review skill:
   `.agents/skills/adversarial-code-review/SKILL.md`
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

## Step 3: Write `audit.md`

Save to:

- Cross-ecosystem: `docs/audits/[YYMMDD-slug]/audit.md` (in `common-bond`)
- Repo-local active: `docs/audits/[YYMMDD-slug]/audit.md` (in target repo)
- Repo-local complete: moved to `docs/audits/archive/[YYMMDD-slug]/audit.md`
- Exception: `dev-docs/audits/[YYMMDD-slug]/` if target repo has a Docusaurus
  `docs/`

Required structure: Title block → Executive Summary → per-area sections
(Strengths / Gaps) → Cross-Cutting Observations → Severity Summary table.

Rules:

- **`Auditor:` field is always `Ryan Ammendolea`** — never "Antigravity". The
  human commissions the work; the agent conducts it.
- One sentence of evidence per finding; cite file + line/section
- Severity table row is sufficient for 🟢 Low items — prose section optional
- Relative paths from repo root; no absolute paths in `audit.md`
- Token Efficiency: target ≤ 8,000 bytes. Be concise.
- **Keep the executive summary issue counts accurate** — update them whenever
  new findings are added in iterative improvement rounds.

---

## Step 4: Write `recommendations.md`

Save to the same directory as `audit.md`.

First line must be: `<!-- audit-slug: YYMMDD-slug -->`

Create feature branch before finalising:

```bash
git checkout -b audit/YYMMDD-slug
git push -u origin audit/YYMMDD-slug
git log --oneline origin/audit/YYMMDD-slug -1
# Confirm the remote branch exists and your most recent commit appears.
```

Required structure:

```
slug comment
header block (branch name)
Agent Clarifications table
🔴 / 🟠 / 🟡 / 🟢 sections
Deferred to Next Audit Cycle (if applicable)
Implementation Order (final)
```

### Agent Clarifications Table

Near the top of `recommendations.md`, include a table that captures every
significant human decision made during or before the audit session:

```markdown
## Agent Clarifications (Human-Approved)

| Item             | Decision                                                                                                  |
| :--------------- | :-------------------------------------------------------------------------------------------------------- |
| [Decision topic] | [Approved approach, constraints, caveats]                                                                 |
| CI secrets       | Use `gh secret set <KEY> --body "<val>" --repo <owner>/<repo>` via gh CLI — no manual portal step needed. |
| Deferred items   | [List anything explicitly scoped out, with reason]                                                        |
```

Update this table whenever the user makes a decision that implementation agents
need to know. Include severity escalations, approved exemptions, and
out-of-scope deferrals.

### Deferred Items

If findings are identified but explicitly scoped out, add a section at the end:

```markdown
## Deferred to Next Audit Cycle

| Item      | Reason Deferred                          |
| :-------- | :--------------------------------------- |
| [Finding] | [Out of scope / requires separate audit] |
```

### Task Rules

- Every `REC/DOC/AUD-NN [slug]` identifier includes the audit slug
- Each recommendation maps to `- [ ]` tasks with **absolute** file path targets
- Do not restate `audit.md` findings — reference finding ID only
- Token Efficiency: target ≤ 10,000 bytes. Only include actionable tasks.
- **The Implementation Order table must include every finding ID** — update it
  after each round of iterative additions.

---

## Step 5: Iterative Improvement

After presenting the initial audit, **offer 5 meaningful additions /
modifications / enhancements** to the current findings. These should be concrete
suggestions, not general observations. Consider:

- Adjacent concerns the initial scope revealed but didn't fully cover
- Stricter interpretations of existing findings (severity bumps with rationale)
- Pre-production opportunities — cheap now, expensive later
- ISO 27001 or compliance implications not yet raised
- Cross-cutting patterns present in the area audited

When the user approves suggestions, update **both** `audit.md` and
`recommendations.md`, commit, and offer 5 more. Repeat until the user concludes
the session.

---

## Step 6: Update Registry and Notify

Before calling `notify_user`, verify:

- [ ] Every finding in `audit.md` maps to at least one task in
      `recommendations.md` (or is noted as "accepted risk — no action")
- [ ] The audit slug is consistent across: `audit.md` header,
      `recommendations.md` slug comment, all identifiers, and the branch name
- [ ] The Implementation Order has no circular dependencies
- [ ] The feature branch has been pushed to origin
- [ ] `Auditor:` field is `Ryan Ammendolea`
- [ ] Executive summary issue counts match the severity table row count

1. Add a row to `documentation/common-bond/docs/audits/audit-registry.md`.
2. Commit audit files + registry update to the feature branch.
3. Use `notify_user`: top 3–5 findings, slug, branch name, blocking decisions.

---

## Step 7: Definition of Done — Final Review Pass

Before declaring the audit complete, perform an explicit review of both
documents. This is a **mandatory quality gate**.

### audit.md checks

- [ ] `Auditor:` is `Ryan Ammendolea`
- [ ] Issue counts in the executive summary match the severity table
- [ ] Severity table has a row for every finding ID referenced in
      `recommendations.md`
- [ ] No prose sections editorialize — findings describe what artefacts show,
      not what they should show

### recommendations.md checks

- [ ] No **duplicate section headings** (iterative additions can create
      duplicate "Implementation Order" tables)
- [ ] Implementation Order table references every finding ID
- [ ] Agent Clarifications table includes all decisions from the session
- [ ] Deferred items section exists if any findings were scoped out
- [ ] No completed self-referential tasks remain (e.g. "update the
      clarifications table")

Fix any issues, commit as:

```bash
git commit -m "audit(YYMMDD-slug): final review — consistency fixes"
```

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
     the app goes public-facing") Do not present all suggestions as equally safe
     and equally urgent.

3. **Severity is a human decision.** You may propose a severity level, but if
   you are uncertain — or if bumping a severity has significant implementation
   consequences — surface your reasoning and ask. Do not unilaterally escalate a
   finding to 🔴 Critical without flagging it.

4. **If something feels wrong, say so.** If a finding seems inappropriate,
   premature, or potentially harmful to document in a shared repository, raise
   it with the user before committing. Use your judgement — you are a
   collaborator, not just a transcriber.

5. **Read before writing.** Never assume a repo's state. Every finding must be
   grounded in evidence from actual files — not inference, convention, or prior
   knowledge about what "usually" exists.

6. **Scope creep is a finding, not a reason to expand.** If research reveals an
   issue significantly outside the stated scope, record it as a 🟢 Low finding
   and flag it for a separate audit — do not silently expand the current audit
   without telling the user.
