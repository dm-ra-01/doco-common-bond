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

---

## Step 2: Research

For each finding: file + line/section, what it says/does vs Gold Standard,
severity (🔴/🟠/🟡/🟢).

**Documentation categories:** Coverage Gap, Regulatory Accuracy, Readability,
Tone & Voice, Metadata, Internal Links, Structural Integrity, Governance
Completeness.

**Technical categories:** Security, Architectural Drift, Test Coverage, Contract
Stability, Performance, Observability, Dead Code / Tech Debt.

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

- One sentence of evidence per finding; cite file + line/section
- Severity table row is sufficient for 🟢 Low items — prose section optional
- Relative paths from repo root; no absolute paths
- Token Efficiency: target ≤ 8,000 bytes. Be concise.

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

Required structure: slug comment → header block with branch name → IMPORTANT
admonition → Priority Framework → 🔴/🟠/🟡/🟢 sections → Implementation Order.

Rules:

- Every `REC/DOC/AUD-NN [slug]` identifier includes the audit slug
- Each recommendation maps to `- [ ]` tasks with exact file/section targets
- Do not restate `audit.md` findings — reference finding ID only
- Token Efficiency: target ≤ 10,000 bytes. Only include actionable tasks.

---

## Step 5: Update Registry and Notify

Before calling `notify_user`, verify:

- [ ] Every finding in `audit.md` maps to at least one REC/DOC/AUD item in
      `recommendations.md` (or is explicitly noted as "accepted risk — no
      action").
- [ ] The audit slug is consistent across: `audit.md` header,
      `recommendations.md` HTML comment, all identifier labels, and the feature
      branch name.
- [ ] The Implementation Order in `recommendations.md` has no circular
      dependencies.
- [ ] The feature branch has been successfully pushed to origin (confirm with
      `git log --oneline origin/audit/YYMMDD-slug -1`).

1. Add a row to `documentation/common-bond/docs/audits/audit-registry.md` under
   the active registry. Ensure the initial status is set correctly (e.g.,
   `📋 Planned` or `🔄 In Progress`).
2. Commit audit files + registry update to the feature branch.
3. Use `notify_user`: top 3–5 findings, slug, branch name, any blocking human
   decisions.
