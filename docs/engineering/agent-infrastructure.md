# Agent Infrastructure

This document describes the **canonical agent skill and workflow
infrastructure** for the Receptor ecosystem. It establishes where skills and
workflows live, how they are referenced, and how to evolve them over time.

---

## Architecture

All agent **skills** are lifecycle-managed in a single canonical location:

```
receptor-dev-environment/
└── .agents/
    ├── skills/                 ← ALL ecosystem skills live here
    └── workflows/              ← Global (cross-repo) audit workflows live here
```

Each other repository contains only **thin workflow stubs** that reference
dev-environment skills by absolute path. There are no skill duplicates anywhere
in the ecosystem.

---

## Canonical Skills Directory

**Repo:** `dm-ra-01/receptor-dev-environment` **Path:**
`/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/`

### Cross-Cutting Skills

| Skill                      | Description                                                                      |
| :------------------------- | :------------------------------------------------------------------------------- |
| `adversarial-code-review`  | Hostile code review — bugs, security, unintended consequences                    |
| `act-local-ci`             | Run GitHub Actions CI locally using `act` with ephemeral Supabase                |
| `audit-document-standards` | Canonical document structure, field rules, DoD checklist                         |
| `audit-registry`           | Registry read/write, status values, commit conventions                           |
| `audit-verification-gates` | Per-repo verification commands, coverage assessment, Destructive Operations Gate |
| `find-skills`              | Discover and install skills from the open skills ecosystem                       |

### Next.js / Frontend Skills

| Skill                          | Description                                                                    |
| :----------------------------- | :----------------------------------------------------------------------------- |
| `nextjs-app-router-patterns`   | Next.js 14+ App Router, Server Components, streaming, data fetching            |
| `playwright-best-practices`    | Comprehensive Playwright TypeScript testing (includes `references/` subdir)    |
| `playwright-skill`             | Browser automation with Playwright; auto-detects dev servers (includes `lib/`) |
| `react-components`             | Converts Stitch designs into modular Vite/React components                     |
| `vitest`                       | Vitest unit testing with Jest-compatible API (includes `references/` subdir)   |
| `vitest-failure-investigation` | Parses massive Vitest JSON test reports into actionable summaries              |

### Python Skills

| Skill                     | Description                                                          |
| :------------------------ | :------------------------------------------------------------------- |
| `python-design-patterns`  | KISS, SoC, SRP, composition — use when making architecture decisions |
| `python-testing-patterns` | pytest, fixtures, mocking, TDD patterns                              |

### Stitch Tooling Skills

| Skill            | Description                                                          |
| :--------------- | :------------------------------------------------------------------- |
| `design-md`      | Analyse Stitch projects and synthesize into `DESIGN.md` files        |
| `enhance-prompt` | Transform vague UI ideas into polished, Stitch-optimised prompts     |
| `stitch-loop`    | Iterative Stitch website building with autonomous baton-passing loop |

### Infrastructure Skills

| Skill                | Description                                                                                                                                                                                                                  |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase-standards` | Canonical standards for **all** Supabase environments — declarative migrations, RLS, SQL quality, cross-repo coordination. Promoted from a per-repo rule to a shared skill to support multiple future Supabase environments. |

---

## Global Audit Workflows

The three global audit workflows live in `dev-environment` and apply across all
ecosystem repos:

**Path:** `dev-environment/.agents/workflows/`

| Workflow                    | Description                                                                |
| :-------------------------- | :------------------------------------------------------------------------- |
| `global-audit.md`           | Run a multi-repo audit; output to `common-bond/docs/audits/[YYMMDD-slug]/` |
| `implement-global-audit.md` | Implement tasks from a global recommendations.md, one repo at a time       |
| `finalise-global-audit.md`  | Re-audit, raise PRs across all repos, merge, and archive                   |

---

## Per-Repo Workflow Stubs

Each target repository has three thin workflow stubs under `.agents/workflows/`:

| Workflow                      | Purpose                                                     |
| :---------------------------- | :---------------------------------------------------------- |
| `audit-workflow.md`           | Repo-local audit → `docs/audits/[YYMMDD-slug]/`             |
| `implement-audit-workflow.md` | Implement tasks from a repo-local recommendations.md        |
| `finalise-local-audit.md`     | Re-audit, raise PR, merge, and archive within the same repo |

### Repo Coverage

| Repository            | Stack                      | Branch convention   |
| :-------------------- | :------------------------- | :------------------ |
| `planner-frontend`    | Next.js, Urql, TypeScript  | `audit/YYMMDD-slug` |
| `workforce-frontend`  | Next.js, Urql, TypeScript  | `audit/YYMMDD-slug` |
| `preference-frontend` | Next.js, Urql, TypeScript  | `audit/YYMMDD-slug` |
| `website-frontend`    | Next.js, TypeScript        | `audit/YYMMDD-slug` |
| `supabase-receptor`   | PostgreSQL, Supabase, Deno | `audit/YYMMDD-slug` |
| `match-backend`       | Python, CP-SAT             | `audit/YYMMDD-slug` |
| `planner-backend`    | Python, FastAPI            | `audit/YYMMDD-slug` |
| `common-bond`         | Docusaurus                 | `audit/YYMMDD-slug` |

> [!NOTE]
> `common-bond` retains its own `audit-workflow.md`,
> `implement-audit-workflow.md`, and `finalise-local-audit.md` for site-local
> audits. Its global audit workflows were moved to `dev-environment`.

---

## Skill Referencing Convention

All workflow stubs reference skills by **absolute path** to dev-environment:

```
/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/<skill-name>/SKILL.md
```

This is the stable path within the `antigravity-environment` monorepo workspace.
Absolute paths eliminate any ambiguity about which `.agents/` context the agent
is operating in.

---

## Lifecycle: Adding a New Skill

1. Create the skill directory in `dev-environment/.agents/skills/<skill-name>/`
2. Write `SKILL.md` with `name:` and `description:` in the YAML frontmatter
3. For complex skills with companion files (e.g. reference docs), add them as
   subdirectories
4. Commit to `dev-environment` on `main` with message:
   `feat(skills): add <skill-name> skill`
5. Reference the skill in the relevant repo-local workflow stubs by absolute
   path
6. Update this document with the new skill in the skills table

## Lifecycle: Adding a New Supabase Environment

New Supabase environments (beyond `supabase-receptor`) should:

1. Create `.agents/workflows/` with the three standard stubs (audit, implement,
   finalise)
2. Reference `supabase-standards` skill in the audit and implement stubs
3. Add the repo to the per-repo coverage table in this document
4. Register the environment in `dev-environment/.meta`

---

## Rules Registry

Repo-level agent rules (`.agents/rules/`) that apply system-wide have been
**promoted to skills** in dev-environment. Per-repo rules that enforce
repo-specific guardrails (e.g. commit message conventions) may still live
locally.

| Rule                 | Previous location                                       | New location                                                 |
| :------------------- | :------------------------------------------------------ | :----------------------------------------------------------- |
| `supabase-standards` | `supabase-receptor/.agents/rules/supabase-standards.md` | `dev-environment/.agents/skills/supabase-standards/SKILL.md` |
