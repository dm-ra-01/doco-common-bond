# Agent Infrastructure Consolidation Audit

**Date:** 2026-03-10\
**Scope:** All 9 active Receptor ecosystem repositories (`.agents`/`.agent`
directories)\
**Auditor:** Ryan Ammendolea\
**Standard:** Internal agent infrastructure standard
(`documentation/common-bond/docs/engineering/agent-infrastructure.md`)

---

## Executive Summary

A manual audit of all `.agents` and `.agent` directories across the Receptor
ecosystem reveals significant structural drift from the intended
single-source-of-truth model. The current state has 9 repositories each
maintaining their own local copies of skills, rules, and workflow files that are
either identical to — or degraded copies of — the canonical versions in
`dev-environment/.agents/`. **16 findings** were identified: 2 critical, 5 high,
7 medium, 2 low.

| Repository / Area           | Coverage | Issues Found | Overall                                    |
| :-------------------------- | :------- | :----------- | :----------------------------------------- |
| `planner-frontend`          | ⚠️       | 3            | Significant duplication + ecosystem rules  |
| `preference-frontend`       | ⚠️       | 2            | Duplication + orphaned rules               |
| `workforce-frontend`        | ⚠️       | 2            | Duplication + orphaned rules               |
| `website-frontend`          | ✅       | 0            | Workflows only, no skills or rules — clean |
| `supabase-receptor`         | ⚠️       | 2            | Duplicate skill + rule-as-skill            |
| `match-backend`             | ⚠️       | 1            | Duplicate Python skills                    |
| `receptor-planner`          | ⚠️       | 1            | Duplicate Python skills                    |
| `documentation/common-bond` | ⚠️       | 2            | Local skill copy, no symlink arch          |
| `frontend/` (monorepo root) | ❌       | 1            | Orphaned non-repo `.agent/` dir            |
| Cross-cutting (all repos)   | ❌       | 2            | No symlink architecture, no category model |

> **Note:** Initial audit marked `match-backend` and `receptor-planner` as
> clean. Iterative review revealed both contain `python-design-patterns` and
> `python-testing-patterns` skill copies.

---

## 1. Cross-Cutting: Architecture

### 1.1 No Centralised Symlink Architecture

**Strengths:**

- `dev-environment/.agents/` already functions as a canonical location; skills
  are referenced by absolute path from workflow files.
- The 4-level agent infrastructure standard (workflow stubs, absolute skill
  refs, no orphaned local skills, no cross-ecosystem rules) is documented in
  `agent-infrastructure.md`.

**Gaps:**

- **ARCH-01** Each of the 9 repos maintains its own `.agents/` directory on
  disk. There is no symlink architecture — every repo must be manually kept in
  sync with `dev-environment`. When a skill is updated in `dev-environment`, the
  change never propagates to repos that have stale local copies.
- **ARCH-02** There is no category-level organisation in
  `dev-environment/.agents/`. Skills are a flat list under `skills/`, with no
  distinction between frontend-nextjs, supabase-infrastructure, backend-python,
  and docusaurus context. Workflow files containing category-specific patterns
  (stack, verify command, KI hints) live in individual repos rather than in a
  shared location.

**Process Risk — Transition Window:**

- **RISK-01** The symlink migration will create a window where some repos are
  symlinked and others are not. An agent invoked against any repo during this
  window will see inconsistent state — some repos pointing to the new canonical
  category workflows and others still using stale local copies. **Mitigation:**
  Implementation must be executed atomically per-category (all frontend repos in
  one pass, then backend, then supabase, then docusaurus). Do not partially
  migrate a category.

---

## 2. `planner-frontend`

### 2.1 Skill Duplication

**Gaps:**

- **PL-01** `.agents/skills/` contains local copies of 10 skills, all of which
  exist in `dev-environment/.agents/skills/`: `adversarial-code-review`,
  `design-md`, `enhance-prompt`, `find-skills`, `nextjs-app-router-patterns`,
  `playwright-best-practices`, `playwright-skill`, `react-components`,
  `stitch-loop`, `vitest`, `vitest-failure-investigation`. Evidence:
  `find frontend/planner-frontend/.agents/skills/ -type d -maxdepth 1` returns
  10 directories matching `dev-environment` skills.
- **PL-02** `.agents/rules/pre-commit.md` and
  `.agents/rules/vitest-failure-investigation.md` exist as rules files.
  - `vitest-failure-investigation` mirrors the canonical dev-environment skill —
    rule-as-skill anti-pattern.
  - `pre-commit.md` content (read): _"DO NOT use `--no-verify` without explicit
    USER authorization. Treat pre-commit failures as blocking issues."_ This is
    **ecosystem-wide guidance**, not planner-specific. It is identical in
    content to `preference-frontend/rules/git.md` and
    `workforce-frontend/rules/git.md`. It must be promoted to
    `frontend-nextjs/rules/git.md` in `dev-environment` rather than deleted.
  - Evidence: `frontend/planner-frontend/.agents/rules/` contains both files.

---

## 3. `preference-frontend`

**Gaps:**

- **PREF-01** `.agents/skills/adversarial-code-review/` existed as a local copy
  (4 files). Confirmed identical to dev-environment canonical via md5 comparison
  in this session. Evidence:
  `frontend/preference-frontend/.agents/skills/adversarial-code-review/SKILL.md`
  (now deleted).
- **PREF-02** `.agents/rules/vitest-failure-investigation.md` and
  `.agents/rules/git.md` exist as rules files.
  - `git.md` content (read): identical to `planner-frontend/rules/pre-commit.md`
    and `workforce-frontend/rules/git.md` — same 20-line "don't bypass
    pre-commit hooks" rule. Ecosystem-wide; must be promoted to
    `frontend-nextjs/rules/git.md`.
  - `vitest-failure-investigation.md` mirrors the canonical dev-environment
    skill.
  - Evidence: `frontend/preference-frontend/.agents/rules/` contains both files.

---

## 4. `workforce-frontend`

**Gaps:**

- **WF-01** `.agents/skills/adversarial-code-review/` existed as a local copy
  (confirmed identical, now deleted this session). Evidence: deletion confirmed
  during this session.
- **WF-02** `.agents/rules/vitest-failure-investigation.md` and
  `.agents/rules/git.md` exist as rules files.
  - `git.md` content (read): identical to `preference-frontend/rules/git.md` and
    `planner-frontend/rules/pre-commit.md`. Ecosystem-wide content; must be
    promoted.
  - `vitest-failure-investigation.md` mirrors the canonical skill.
  - Evidence: `frontend/workforce-frontend/.agents/rules/` contains both files.

---

## 5. `supabase-receptor`

**Gaps:**

- **SR-01** `.agents/skills/adversarial-code-review/` existed as a local copy
  (confirmed identical, now deleted this session). Evidence: deletion confirmed
  during this session.
- **SR-02** `.agents/rules/supabase-standards.md` exists as a rules file whose
  content mirrors the canonical
  `dev-environment/.agents/skills/supabase-standards/SKILL.md`. Evidence:
  `supabase-receptor/.agents/rules/supabase-standards.md`.

---

## 6. `match-backend`

**Strengths:**

- `.agents/` contains only 3 workflow files (`audit-workflow.md`,
  `implement-audit-workflow.md`, `finalise-local-audit.md`) and a `skills/`
  directory. No rules files.
- Workflow structure is clean.

**Gaps:**

- **MB-01** `.agents/skills/` contains `python-design-patterns/` and
  `python-testing-patterns/` — both exist in `dev-environment/.agents/skills/`.
  Evidence: `find backend/match-backend/.agents/skills -type f` returns
  `python-design-patterns/SKILL.md` and `python-testing-patterns/SKILL.md`.

---

## 7. `receptor-planner`

**Strengths:**

- `.agents/` contains only 3 workflow files and a `skills/` directory. No rules
  files.
- Workflow structure mirrors `match-backend` exactly — consistent within the
  backend category.

**Gaps:**

- **RP-01** `.agents/skills/` contains `python-design-patterns/` and
  `python-testing-patterns/` — both exist in `dev-environment/.agents/skills/`.
  Evidence: `find backend/receptor-planner/.agents/skills -type f` returns
  `python-design-patterns/SKILL.md` and `python-testing-patterns/SKILL.md`.

---

## 8. `website-frontend`

**Strengths:**

- `.agents/` contains exactly 3 workflow files (`audit-workflow.md`,
  `implement-audit-workflow.md`, `finalise-local-audit.md`). No `skills/`
  directory, no `rules/` directory.
- Evidence: `find frontend/website-frontend/.agents -type f` returns 3 files
  only.
- This is the **reference implementation** for a clean frontend repo under the
  target architecture (before symlinks). Post-migration,
  `website-frontend/.agents` will symlink to `frontend-nextjs/`.

---

## 9. `documentation/common-bond`

**Gaps:**

- **CB-01** `.agents/skills/supabase-postgres-best-practices/` (20+ reference
  files) exists only in `common-bond` — it is not in `dev-environment`. It is
  referenced in `common-bond`'s `audit-workflow.md` for database governance
  audits. Under the new architecture, this skill should live in the `docusaurus`
  category directory in `dev-environment`. Evidence:
  `documentation/common-bond/.agents/skills/supabase-postgres-best-practices/`
  has 20+ files.
- **CB-02** The `audit-workflow.md` (197 lines) contains a dual-mode
  (documentation + technical) workflow and cross-ecosystem context that is
  unique to the docusaurus category. This content is not generalised or
  accessible to `receptor-ecosystem` (when created). Evidence:
  `documentation/common-bond/.agents/workflows/audit-workflow.md` line 1–57.

---

## 10. `frontend/` (Monorepo Root)

**Gaps:**

- **FE-01** `frontend/.agent/` directory exists at the monorepo parent level,
  which is not itself a git repository. It contains 4 workflow files and 1 rules
  file. No agent for any individual frontend repo will auto-discover this
  directory. Evidence:
  `ls /Users/ryan/development/common_bond/antigravity-environment/frontend/.git`
  returns `Not a repo`; the `.agent/` directory was found during this session.

---

## 11. Cross-Cutting Observations

1. **Completed mid-session:** During this audit session,
   `adversarial-code-review` local copies were deleted from `planner-frontend`,
   `preference-frontend`, `workforce-frontend`, and `supabase-receptor`. These
   findings are documented for completeness and as evidence of the duplication
   pattern.

2. **`receptor-ecosystem` does not exist** as a local repository. When it is
   created, it will need to be mapped to the `docusaurus` category. This is a
   deferred item.

3. **Partial prior migration:** The JSON-refactor global audit
   (`260310-agent-workflow-json-refactor`) already addressed workflow
   standardisation. This audit addresses the underlying infrastructure — the
   symlink and category architecture that makes drift impossible rather than
   just documented.

4. **Ecosystem-wide `git.md` / `pre-commit.md`:** Three repos
   (`planner-frontend`, `preference-frontend`, `workforce-frontend`) each have a
   local copy of an identical "don't bypass pre-commit hooks" rule (8–20 lines).
   All three are byte-for-byte equivalent in content. This single rule should
   become `frontend-nextjs/rules/git.md` in `dev-environment` and is the only
   rules file requiring promotion rather than deletion.

5. **Reference implementation:** `website-frontend` is the cleanest repo
   (workflows only, no skill or rules copies). Backend repos (`match-backend`,
   `receptor-planner`) are structurally clean but contain 2 skill copies each.

---

## Severity Summary

| Finding ID | Repository / Area           | File                                               | Category            | Severity    |
| :--------- | :-------------------------- | :------------------------------------------------- | :------------------ | :---------- |
| ARCH-01    | all repos                   | `.agents/` dirs                                    | Architectural Drift | 🔴 Critical |
| ARCH-02    | `dev-environment`           | `.agents/` structure                               | Process Gap         | 🔴 Critical |
| PL-01      | `planner-frontend`          | `.agents/skills/` (10 dirs)                        | Architectural Drift | 🟠 High     |
| CB-01      | `documentation/common-bond` | `.agents/skills/supabase-postgres-best-practices/` | Process Gap         | 🟠 High     |
| CB-02      | `documentation/common-bond` | `.agents/workflows/audit-workflow.md`              | Process Gap         | 🟠 High     |
| FE-01      | `frontend/` (root)          | `.agent/` dir                                      | Process Gap         | 🟠 High     |
| SR-02      | `supabase-receptor`         | `.agents/rules/supabase-standards.md`              | Architectural Drift | 🟠 High     |
| PL-02      | `planner-frontend`          | `.agents/rules/`                                   | Architectural Drift | 🟡 Medium   |
| PREF-01    | `preference-frontend`       | `.agents/skills/adversarial-code-review/`          | Architectural Drift | 🟡 Medium   |
| PREF-02    | `preference-frontend`       | `.agents/rules/`                                   | Architectural Drift | 🟡 Medium   |
| WF-01      | `workforce-frontend`        | `.agents/skills/adversarial-code-review/`          | Architectural Drift | 🟡 Medium   |
| WF-02      | `workforce-frontend`        | `.agents/rules/`                                   | Architectural Drift | 🟡 Medium   |
| SR-01      | `supabase-receptor`         | `.agents/skills/adversarial-code-review/`          | Architectural Drift | 🟡 Medium   |
| MB-01      | `match-backend`             | `.agents/skills/python-*` (2 dirs)                 | Architectural Drift | 🟡 Medium   |
| RP-01      | `receptor-planner`          | `.agents/skills/python-*` (2 dirs)                 | Architectural Drift | 🟡 Medium   |
| RISK-01    | all repos                   | transition window                                  | Process Risk        | 🟢 Low      |
| DEF-01     | `receptor-ecosystem`        | —                                                  | Process Gap         | 🟢 Low      |
