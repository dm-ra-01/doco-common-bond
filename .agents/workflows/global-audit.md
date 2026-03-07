---
description: Run a structured audit across multiple repositories in the Common Bond / Receptor ecosystem, then save audit.md and recommendations.md to documentation/common-bond/docs/audits/[YYMMDD-slug]/
---

## Overview

This workflow is for **ecosystem-wide audits** that span multiple repositories
and cannot be attributed to a single codebase. Examples:

- Audit the audit process itself (as in `260306-audit-process`)
- Audit security posture across all services simultaneously
- Audit deployment, branching, or CI/CD practices ecosystem-wide
- Audit documentation coverage and consistency across all repos
- Audit compliance with a specific standard across multiple frontend or backend
  apps

For single-repo audits, use `/audit` instead and commit to that repo's
`docs/audits/` directory.

> [!IMPORTANT]
> Global audits are **always** housed in the cross-ecosystem Docusaurus site:
> `documentation/common-bond/docs/audits/[YYMMDD-slug]/` They are **never**
> repo-local. The output surfaces in the Docusaurus **Audits** tab and is
> registered in `docs/audits/audit-registry.md`.

---

## Repository Map

The following is the canonical list of repositories in the ecosystem. Use
absolute paths when reading files across repos.

### Infrastructure

| Repo                | Absolute Path                                                                    | Language / Stack                            |
| :------------------ | :------------------------------------------------------------------------------- | :------------------------------------------ |
| `supabase-receptor` | `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/` | PostgreSQL, Supabase, Deno (Edge Functions) |

### Backend Services

| Repo               | Absolute Path                                                                           | Language / Stack          |
| :----------------- | :-------------------------------------------------------------------------------------- | :------------------------ |
| `receptor-planner` | `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/` | Python (CP-SAT, FastAPI)  |
| `match-backend`    | `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/`    | Python (CP-SAT allocator) |

### Frontend Applications

| Repo                  | Absolute Path                                                                               | Language / Stack          | Status           |
| :-------------------- | :------------------------------------------------------------------------------------------ | :------------------------ | :--------------- |
| `planner-frontend`    | `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/`    | Next.js, TypeScript, Urql | Active           |
| `preference-frontend` | `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/` | Next.js, TypeScript, Urql | Active           |
| `workforce-frontend`  | `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/`  | Next.js, TypeScript, Urql | Active           |
| `website-frontend`    | `/Users/ryan/development/common_bond/antigravity-environment/frontend/website-frontend/`    | Next.js                   | Active           |
| `rotator_worker`      | `/Users/ryan/development/common_bond/antigravity-environment/frontend/rotator_worker/`      | Flutter / Dart            | Legacy           |
| `design-frontend`     | `/Users/ryan/development/common_bond/antigravity-environment/frontend/design-frontend/`     | —                         | Design reference |

### Documentation Sites (Docusaurus)

| Repo                 | Absolute Path                                                                                   | Purpose                                                        |
| :------------------- | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| `common-bond`        | `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/`        | **Cross-ecosystem** — Strategy, Governance, Compliance, Audits |
| `receptor-ecosystem` | `/Users/ryan/development/common_bond/antigravity-environment/documentation/receptor-ecosystem/` | Technical docs for the Receptor platform                       |

### Outside the Receptor Ecosystem

| Repo                                       | Notes                                                                                            |
| :----------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `icu-survival` (Monash ICU Survival Guide) | Separate Docusaurus site; not part of the Receptor ecosystem. Note this clearly in any findings. |

---

## Audit Path Conventions

Understanding where audit files live is critical for agents to locate and update
them correctly.

### Cross-Ecosystem Audits (this workflow)

```
documentation/common-bond/
└── docs/
    └── audits/
        └── YYMMDD-slug/          ← active AND completed (never archived)
            ├── audit.md
            ├── recommendations.md
            ├── re-audit.md           (added at DoD)
            └── re-audit-recommendations.md
```

These appear in the Docusaurus **Audits** tab and are indexed in
`docs/audits/audit-registry.md`.

### Repo-Local Audits (use `/audit` workflow)

```
<any-repo>/
└── docs/
    └── audits/
        ├── YYMMDD-slug/          ← ACTIVE — currently being worked
        └── archive/
            └── YYMMDD-slug/      ← COMPLETED — moved here when done
```

> [!WARNING]
> **Exception — repos with their own Docusaurus site:** If the repo in scope has
> a `docs/` folder that is itself a Docusaurus site (e.g. `receptor-ecosystem`
> or `common-bond`), use `dev-docs/audits/YYMMDD-slug/` for repo-local audits to
> avoid colliding with the Docusaurus `docs/` tree.

---

## Step 1: Understand Scope and Check Prior Work

Read the user's request and identify:

- Which repositories are in scope (all, a subset, or a cross-cutting concern)
- What the audit focus is (security, process, architecture, governance, etc.)
- Any **carryover tasks** explicitly mentioned by the user — these are
  first-class findings

Then:

1. **Check the KI system** for existing architecture documentation on each area
   in scope. Read relevant KIs before examining code — this ensures findings are
   evaluated against design intent, not a superficial reading.
2. **Check `docs/audits/audit-registry.md`** for any prior audits covering the
   same area. Read them first to avoid re-documenting known findings.
3. **Check each repo's `docs/audits/`** for in-flight single-repo audits that
   may be related.

**Ask upfront questions if needed.** Before beginning research, identify any
information you will need from the user that you cannot find in the code — for
example: third-party DSNs, approved exemptions, human decisions on severity.
Batch all questions into one `notify_user` call. Do not block mid-audit on
information you could have requested at the start.

---

## Step 2: Create the Feature Branch

Global audits always use a feature branch in the `common-bond` repo:

```bash
cd /Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond
git checkout -b audit/YYMMDD-slug
git push -u origin audit/YYMMDD-slug
```

Create the audit directory:

```bash
mkdir -p docs/audits/YYMMDD-slug
```

---

## Step 3: Research Across Repositories

Walk each repository in scope. For each:

1. Read the area of interest (schema files, source code, config, docs) deeply.
2. Note findings with: file path, evidence, severity (🔴/🟠/🟡/🟢), category.
3. Cross-reference findings across repos — ecosystem-wide issues (e.g. "no repo
   in the ecosystem has a dedicated audit workflow") are their own findings.
4. **When one repo handles a concern correctly, identify it as the reference
   implementation** for the others — this helps implementation agents without
   requiring extra research.

**Finding categories for global audits:**

| Category                | What to look for                                                                            |
| :---------------------- | :------------------------------------------------------------------------------------------ |
| **Process Gap**         | Missing workflows, no governance for a cross-cutting concern                                |
| **Security**            | RLS gaps, auth inconsistencies, credential handling, unrotated secrets                      |
| **Architectural Drift** | Inconsistency in patterns across repos (e.g. one repo uses Urql correctly, another doesn't) |
| **Test Coverage**       | Systematic absence of tests in a repo or for a class of behaviour                           |
| **Documentation Gap**   | Repos or features with no documentation; broken cross-repo links                            |
| **Compliance**          | Deviations from ISO 27001 controls, missing audit trails, no RLS                            |
| **Tech Debt**           | Stale code, dead branches, TODO markers, known workarounds not tracked                      |

> [!WARNING]
> Never editorialize in `audit.md`. Record what the artefacts _actually show_,
> not what they should show. Save all recommendations for `recommendations.md`.
> **Token efficiency:** Finding descriptions are one sentence of evidence. Use
> relative paths from the repo root. Target: `audit.md` ≤ 8,000 bytes.

---

## Step 4: Write `audit.md`

Save to: `documentation/common-bond/docs/audits/YYMMDD-slug/audit.md`

Structure:

```markdown
# [Topic] Ecosystem Audit

**Date:** YYYY-MM-DD\
**Scope:** [list of repositories reviewed]\
**Auditor:** Ryan Ammendolea\
**Standard:** [standard referenced, if applicable]

---

## Executive Summary

[2–4 sentence overview. Include total finding count and phase count once known.]

| Repository        | Area | Coverage | Issues Found | Overall |
| ----------------- | ---- | -------- | ------------ | ------- |
| supabase-receptor | ...  | ✅/⚠️/❌ | N            | ...     |
| planner-frontend  | ...  |          |              |         |
| ...               |      |          |              |         |

---

## 1. [Repository or Cross-Cutting Area]

### 1.1 [Sub-area]

**Strengths:**

- [bullet with evidence]

**Gaps:**

- [bullet with file path reference]

...

---

## N. Cross-Cutting Observations

[Issues that appear across multiple repos]

---

## Severity Summary

| Finding ID | Repository | File | Category    | Severity    |
| ---------- | ---------- | ---- | ----------- | ----------- |
| PROC-01    | all        | —    | Process Gap | 🔴 Critical |
| ...        | ...        | ...  | ...         | ...         |
```

> [!IMPORTANT]
> **Auditor field:** Always set `Auditor: Ryan Ammendolea`. Never use
> "Antigravity". The auditor is always the human who commissioned the work.

> [!NOTE]
> The executive summary's issue counts and finding list will grow iteratively as
> the user approves enhancements. **Update these counts each time you add new
> findings** — the exec summary should always reflect the total, not just the
> initial set.

---

## Step 5: Write `recommendations.md`

Save to: `documentation/common-bond/docs/audits/YYMMDD-slug/recommendations.md`

Begin the file with the audit slug comment:

```markdown
<!-- audit-slug: YYMMDD-slug -->
```

Include the feature branch name prominently. Structure follows the same priority
framework as the `/audit` workflow (🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low)
with a phased **Implementation Order** table at the end.

### Agent Clarifications Table

Include an **Agent Clarifications (Human-Approved)** table near the top of
`recommendations.md`. This records every significant decision made during the
audit session so that future implementation agents don't need to ask the user
again:

```markdown
## Agent Clarifications (Human-Approved)

| Item             | Decision                                                                                                     |
| :--------------- | :----------------------------------------------------------------------------------------------------------- |
| [Decision topic] | [Approved approach, constraints, caveats]                                                                    |
| CI secrets       | Use `gh secret set <KEY> --body "<val>" --repo <owner>/<repo>` — agents can do this autonomously via gh CLI. |
| Renovate Bot     | Use self-hosted `renovatebot/github-action` workflow — no GitHub App install required.                       |
| Deferred items   | [List anything explicitly scoped out, with reason]                                                           |
```

This table must be updated each time the user provides a clarification or
approves a decision that constrains how implementation agents should work.

### Task Structure

For findings that touch **multiple repos**, each task checkbox must specify the
target repo and absolute path:

```markdown
- [ ] `supabase-receptor` — Add pgTAP test for func_has_global_role at
      `/Users/ryan/.../supabase-receptor/supabase/tests/...`
- [ ] `planner-frontend` — Add equivalent E2E test at
      `/Users/ryan/.../planner-frontend/playwright/...`
```

### Deferred Items

If findings are identified but explicitly scoped out of the current audit, add a
**Deferred to Next Audit Cycle** section at the bottom of `recommendations.md`:

```markdown
## Deferred to Next Audit Cycle

| Item                  | Reason Deferred                          |
| :-------------------- | :--------------------------------------- |
| [Finding description] | [Out of scope / requires separate audit] |
```

This prevents findings from being silently dropped and makes them discoverable
for the next audit session.

---

## Step 6: Present Findings and Iterative Enhancement

After presenting the initial audit, **offer 5 meaningful additions /
modifications / enhancements** to the current findings and recommendations.
Frame these as concrete suggestions, not vague improvements. Consider:

- Findings in adjacent areas the initial scope revealed but didn't fully cover
- Stricter or more nuanced versions of existing findings (e.g. bumping severity
  based on context)
- Cross-cutting patterns the initial per-repo analysis may have missed
- Pre-production opportunities — things that are cheap now and expensive later
- ISO 27001 or compliance implications not yet documented

When the user approves suggestions:

1. Add the approved findings to **both** `audit.md` (in the cross-cutting
   observations section and severity table) and `recommendations.md` (as Task
   sections and implementation phases).
2. Keep the Agent Clarifications table in `recommendations.md` current.
3. Commit and push after each approved round.
4. Offer 5 more suggestions. Repeat until the user indicates they are done.

> [!NOTE]
> **Severity decisions belong to the human.** When the user bumps or reduces a
> severity, record the change in the Agent Clarifications table so
> implementation agents know it was intentional.

---

## Step 7: Update the Audit Registry and Notify

**Always update the audit registry before notifying the user:**

Open `documentation/common-bond/docs/audits/audit-registry.md` and add a row for
this audit under the correct date heading. For global audits, the Scope column
should list the repos covered (or "All repositories" if ecosystem-wide). Set the
initial status appropriately (e.g., `📋 Planned` or `🔄 In Progress`).

Then commit the audit files and registry update:

```bash
cd /Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond
git add docs/audits/YYMMDD-slug/ docs/audits/audit-registry.md
git commit -m "audit(YYMMDD-slug): initial audit.md and recommendations.md"
git push origin audit/YYMMDD-slug
```

Then use `notify_user` to present:

- Top 3–5 findings by severity
- Audit slug and feature branch for use in future `/implement-audit` sessions
- Any blocking questions that require a human decision

---

## Step 8: Agent Readiness Gate

Before closing the audit session, verify that future implementation agents have
**everything they need to proceed without blocking on the user**:

| Check                     | What to verify                                                                                                      |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| Credentials & DSNs        | All third-party credentials (Sentry DSNs, API keys) are in `recommendations.md` — never in source                   |
| CI secrets                | Confirm agents can set them via `gh secret set` — no manual portal step required                                    |
| External tool installs    | Confirm any new tools can be set up via self-hosted GitHub Actions (e.g. Renovate) — no OAuth app installs required |
| Approved decisions        | Every human decision is in the Agent Clarifications table                                                           |
| Reference implementations | For any recommended pattern, at least one repo that already does it correctly has been identified                   |
| Deferred items            | Anything out of scope is in the Deferred section — not silently omitted                                             |

If any check fails, surface the gap to the user and collect the missing
information before ending the session.

---

## Step 9: Definition of Done — Final Review Pass

Before declaring the audit complete, perform an explicit review of both
`audit.md` and `recommendations.md`. This is a **mandatory quality gate**, not
optional. Check each of the following:

### audit.md checks

- [ ] `Auditor:` field is `Ryan Ammendolea`, not "Antigravity"
- [ ] Executive summary issue counts match the actual number of findings in the
      severity table — **update counts after every round of additions**
- [ ] Executive summary description covers all major gap areas found (not just
      the original 3–4 from the initial audit)
- [ ] Severity table contains a row for **every** finding ID in
      `recommendations.md` — no rows missing after iterative additions
- [ ] All cross-cutting observations are numbered sequentially with no gaps

### recommendations.md checks

- [ ] No **duplicate section headings** — each iteration appends new content,
      which can create duplicate "Implementation Order" tables or section
      headers over time. Check for and remove stale versions.
- [ ] The **Implementation Order table** references every finding ID — newly
      added findings must be inserted into the appropriate phase
- [ ] Agent Clarifications table is complete — includes every decision made
      during the session (not just the first round)
- [ ] **Deferred items** section exists if any findings were scoped out
- [ ] The `<!-- audit-slug: YYMMDD-slug -->` comment is present at the top
- [ ] ISO findings (ISO-01, ISO-02, etc.) are in the implementation phases
- [ ] Any self-referential tasks (e.g. "update the clarifications table") that
      have already been completed have been removed

### After the review

Fix any issues found, commit with message:

```bash
git commit -m "audit(YYMMDD-slug): final review — consistency fixes"
```

Then notify the user that the audit is complete and ready for implementation.

---

## Rules of Engagement

These rules govern how agents must conduct global audits:

1. **Read before writing.** Never make assumptions about a repo's state — read
   the actual files. Check KIs first, then code.
2. **Evidence always.** Every finding in `audit.md` must cite a specific file
   path and quote or describe the evidence.
3. **No cross-repo changes during audit.** The audit phase is read-only. Do not
   fix anything while auditing — record it as a finding.
4. **Scope creep is a finding.** If you discover an issue significantly outside
   the stated scope, record it as a finding with 🟢 Low severity and flag it for
   a separate audit session rather than expanding the current scope.
5. **Ecosystem-wide findings first.** In the severity summary, list
   cross-cutting findings before single-repo findings of the same severity —
   they have higher leverage.
6. **One feature branch per audit.** All files for a global audit commit to
   `audit/YYMMDD-slug` in the `common-bond` repo. Implementation agents working
   on _other repos_ as part of the recommendations should still reference this
   branch in their commit messages.
7. **Registry is mandatory.** `audit-registry.md` must be updated before the
   session ends. The registry is the PROC-03 compliance record.
8. **Auditor is always the human.** The `Auditor:` field is always
   `Ryan Ammendolea`. Agents conduct the work; humans own the findings.
9. **Agents have gh CLI and GitHub MCP.** There are no manual GitHub portal
   steps — CI secrets can be set with `gh secret set`, self-hosted tools (e.g.
   Renovate) can be wired via GitHub Actions workflows. Never record a step as
   "requires manual action" without first checking if gh CLI or MCP resolves it.
10. **Iterative improvement is expected.** After presenting initial findings,
    always offer 5 additional improvements and repeat until the user concludes
    the session. The iterative loop is part of the workflow, not a bonus.
11. **Caveat your suggestions honestly.** When proposing iterative improvements,
    flag anything that has genuine uncertainty ("this may already be handled —
    worth checking"), carries meaningful scope ("this touches 40+ files"), or
    depends on a business decision ("only appropriate if the app goes
    public-facing"). Do not present all suggestions as equally safe and urgent.
12. **Severity is a human decision.** You may propose a severity level, but if
    you are uncertain — or if escalating to 🔴 Critical has significant
    implementation consequences — surface your reasoning and ask. Never
    unilaterally escalate a finding without flagging it.
13. **If something feels wrong, say so.** If a finding seems inappropriate,
    premature, or potentially harmful to document in a shared repository — raise
    it before committing. You are a collaborator, not a transcriber.
