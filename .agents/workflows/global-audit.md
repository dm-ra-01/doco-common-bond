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

> [!IMPORTANT]
> **Read these skills before starting any global audit session:**
>
> - `.agents/skills/audit-document-standards/SKILL.md` — document structure,
>   field rules, DoD checklist, iterative improvement protocol
> - `.agents/skills/audit-registry/SKILL.md` — registry location, status values,
>   commit conventions

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

---

## Step 4: Write `audit.md` and `recommendations.md`

Save to: `documentation/common-bond/docs/audits/YYMMDD-slug/`

**For full document structure (title block, Executive Summary, per-area
sections, Cross-Cutting Observations, Severity Summary), field rules (`Auditor:`
field, finding IDs, relative paths, token targets), Agent Clarifications table,
Implementation Order, Deferred Items, and the Definition-of-Done checklist:**
read `.agents/skills/audit-document-standards/SKILL.md`.

---

## Step 5: Present Findings and Iterative Enhancement

The iterative improvement protocol (offer 5 additions each round, commit after
each approved round, repeat) is defined in
`.agents/skills/audit-document-standards/SKILL.md` under "Iterative Improvement
Protocol".

---

## Step 6: Update the Audit Registry and Notify

**Always update the audit registry before notifying the user.**

For registry location, status values, transition rules, and commit conventions,
read `.agents/skills/audit-registry/SKILL.md`.

Set the row status to `🔄 Drafting` when first adding the row. Transition to
`📋 Findings Issued` when the audit branch is merged.

Commit the audit files and registry update, then push:

```bash
cd /Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond
git add docs/audits/YYMMDD-slug/ docs/audits/audit-registry.md
git commit -m "audit(YYMMDD-slug): initial audit.md and recommendations.md"
git push origin audit/YYMMDD-slug
```

Then use `notify_user` to present:

- Top 3–5 findings by severity
- Audit slug and feature branch for use in future `/implement-global-audit`
  sessions
- Any blocking questions that require a human decision

---

## Step 7: Agent Readiness Gate

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

## Rules of Engagement

1. **Read before writing.** Never make assumptions about a repo's state — read
   the actual files. Check KIs first, then code.
2. **Evidence always.** Every finding in `audit.md` must cite a specific file
   path and quote or describe the evidence.
3. **No cross-repo changes during audit.** The audit phase is read-only. Do not
   fix anything while auditing — record it as a finding.
4. **Scope creep is a finding.** If you discover an issue significantly outside
   the stated scope, record it as a finding with 🟢 Low severity and flag it for
   a separate audit session.
5. **Ecosystem-wide findings first.** In the severity summary, list
   cross-cutting findings before single-repo findings of the same severity —
   they have higher leverage.
6. **One feature branch per audit.** All files for a global audit commit to
   `audit/YYMMDD-slug` in the `common-bond` repo.
7. **Registry is mandatory.** `audit-registry.md` must be updated before the
   session ends.
8. **Auditor is always the human.** The `Auditor:` field is always
   `Ryan Ammendolea`. Agents conduct the work; humans own the findings.
9. **Agents have gh CLI and GitHub MCP.** There are no manual GitHub portal
   steps — CI secrets can be set with `gh secret set`, self-hosted tools (e.g.
   Renovate) can be wired via GitHub Actions workflows.
10. **Iterative improvement is expected.** See the iterative protocol in the
    `audit-document-standards` skill.
11. **Caveat your suggestions honestly.** Flag genuine uncertainty, meaningful
    scope, or business decisions. Do not present all suggestions as equally
    safe.
12. **Severity is a human decision.** Propose severity, but surface reasoning
    before escalating to 🔴 Critical.
13. **If something feels wrong, say so.** Raise concerns before committing.
