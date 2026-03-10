# Agent Infrastructure Consolidation Audit

**Date:** 2026-03-10\
**Scope:** All 9 active Receptor ecosystem repositories (`.agents`/`.agent` directories)\
**Auditor:** Ryan Ammendolea\
**Standard:** Internal agent infrastructure standard (`documentation/common-bond/docs/engineering/agent-infrastructure.md`)

---

## Executive Summary

A manual audit of all `.agents` and `.agent` directories across the Receptor ecosystem reveals significant structural drift from the intended single-source-of-truth model. The current state has 9 repositories each maintaining their own local copies of skills, rules, and workflow files that are either identical to — or degraded copies of — the canonical versions in `dev-environment/.agents/`. 14 findings were identified: 2 critical, 5 high, 5 medium, 2 low.

| Repository / Area | Coverage | Issues Found | Overall |
| :---------------- | :------- | :----------- | :------ |
| `planner-frontend` | ⚠️ | 3 | Significant duplication |
| `preference-frontend` | ⚠️ | 2 | Duplication + orphaned rules |
| `workforce-frontend` | ⚠️ | 2 | Duplication + orphaned rules |
| `website-frontend` | ✅ | 0 | Workflows only, clean |
| `supabase-receptor` | ⚠️ | 2 | Duplicate skill + rule-as-skill |
| `match-backend` | ✅ | 0 | Clean post-session |
| `receptor-planner` | ✅ | 0 | Clean post-session |
| `documentation/common-bond` | ⚠️ | 2 | Local skill copy, no symlink arch |
| `frontend/` (monorepo root) | ❌ | 1 | Orphaned non-repo `.agent/` dir |
| Cross-cutting (all repos) | ❌ | 2 | No symlink architecture, no category model |

---

## 1. Cross-Cutting: Architecture

### 1.1 No Centralised Symlink Architecture

**Strengths:**

- `dev-environment/.agents/` already functions as a canonical location; skills are referenced by absolute path from workflow files.
- The 4-level agent infrastructure standard (workflow stubs, absolute skill refs, no orphaned local skills, no cross-ecosystem rules) is documented in `agent-infrastructure.md`.

**Gaps:**

- **ARCH-01** Each of the 9 repos maintains its own `.agents/` directory on disk. There is no symlink architecture — every repo must be manually kept in sync with `dev-environment`. When a skill is updated in `dev-environment`, the change never propagates to repos that have stale local copies.
- **ARCH-02** There is no category-level organisation in `dev-environment/.agents/`. Skills are a flat list under `skills/`, with no distinction between frontend-nextjs, supabase-infrastructure, backend-python, and docusaurus context. Workflow files containing category-specific patterns (stack, verify command, KI hints) live in individual repos rather than in a shared location.

---

## 2. `planner-frontend`

### 2.1 Skill Duplication

**Gaps:**

- **PL-01** `.agents/skills/` contains local copies of 10 skills, all of which exist in `dev-environment/.agents/skills/`: `adversarial-code-review`, `design-md`, `enhance-prompt`, `find-skills`, `nextjs-app-router-patterns`, `playwright-best-practices`, `playwright-skill`, `react-components`, `stitch-loop`, `vitest`, `vitest-failure-investigation`. Evidence: `find frontend/planner-frontend/.agents/skills/ -type d -maxdepth 1` returns 10 directories matching `dev-environment` skills.
- **PL-02** `.agents/rules/pre-commit.md` and `.agents/rules/vitest-failure-investigation.md` exist as rules files. The `vitest-failure-investigation` rule mirrors the canonical dev-environment skill. Evidence: `frontend/planner-frontend/.agents/rules/` contains both files.

---

## 3. `preference-frontend`

**Gaps:**

- **PREF-01** `.agents/skills/adversarial-code-review/` exists as a local copy (4 files). Confirmed identical to dev-environment canonical via md5 comparison in this session. Evidence: `frontend/preference-frontend/.agents/skills/adversarial-code-review/SKILL.md` (now deleted).
- **PREF-02** `.agents/rules/vitest-failure-investigation.md` and `.agents/rules/git.md` exist as rules files. `vitest-failure-investigation` mirrors the canonical dev-environment skill. Evidence: `frontend/preference-frontend/.agents/rules/` contains both files.

---

## 4. `workforce-frontend`

**Gaps:**

- **WF-01** `.agents/skills/adversarial-code-review/` existed as a local copy (confirmed identical, now deleted this session). Evidence: deletion confirmed during this session.
- **WF-02** `.agents/rules/vitest-failure-investigation.md` and `.agents/rules/git.md` exist as rules files. `vitest-failure-investigation` mirrors the canonical skill. Evidence: `frontend/workforce-frontend/.agents/rules/` contains both files.

---

## 5. `supabase-receptor`

**Gaps:**

- **SR-01** `.agents/skills/adversarial-code-review/` existed as a local copy (confirmed identical, now deleted this session). Evidence: deletion confirmed during this session.
- **SR-02** `.agents/rules/supabase-standards.md` exists as a rules file whose content mirrors the canonical `dev-environment/.agents/skills/supabase-standards/SKILL.md`. Evidence: `supabase-receptor/.agents/rules/supabase-standards.md`.

---

## 6. `documentation/common-bond`

**Gaps:**

- **CB-01** `.agents/skills/supabase-postgres-best-practices/` (20+ reference files) exists only in `common-bond` — it is not in `dev-environment`. It is referenced in `common-bond`'s `audit-workflow.md` for database governance audits. Under the new architecture, this skill should live in the `docusaurus` category directory in `dev-environment`. Evidence: `documentation/common-bond/.agents/skills/supabase-postgres-best-practices/` has 20+ files.
- **CB-02** The `audit-workflow.md` (197 lines) contains a dual-mode (documentation + technical) workflow and cross-ecosystem context that is unique to the docusaurus category. This content is not generalised or accessible to `receptor-ecosystem` (when created). Evidence: `documentation/common-bond/.agents/workflows/audit-workflow.md` line 1–57.

---

## 7. `frontend/` (Monorepo Root)

**Gaps:**

- **FE-01** `frontend/.agent/` directory exists at the monorepo parent level, which is not itself a git repository. It contains 4 workflow files and 1 rules file. No agent for any individual frontend repo will auto-discover this directory. Evidence: `ls /Users/ryan/development/common_bond/antigravity-environment/frontend/.git` returns `Not a repo`; the `.agent/` directory was found during this session.

---

## 8. Cross-Cutting Observations

1. **Completed mid-session:** During this audit session, `adversarial-code-review` local copies were deleted from `planner-frontend`, `preference-frontend`, `workforce-frontend`, and `supabase-receptor`. These findings are documented for completeness and as evidence of the duplication pattern.

2. **`receptor-ecosystem` does not exist** as a local repository. When it is created, it will need to be mapped to the `docusaurus` category. This is a deferred item.

3. **Partial prior migration:** The JSON-refactor global audit (`260310-agent-workflow-json-refactor`) already addressed workflow standardisation. This audit addresses the underlying infrastructure — the symlink and category architecture that makes drift impossible rather than just documented.

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity |
| :--------- | :---------------- | :--- | :------- | :------- |
| ARCH-01 | all repos | `.agents/` dirs | Architectural Drift | 🔴 Critical |
| ARCH-02 | `dev-environment` | `.agents/` structure | Process Gap | 🔴 Critical |
| PL-01 | `planner-frontend` | `.agents/skills/` (10 dirs) | Architectural Drift | 🟠 High |
| CB-01 | `documentation/common-bond` | `.agents/skills/supabase-postgres-best-practices/` | Process Gap | 🟠 High |
| CB-02 | `documentation/common-bond` | `.agents/workflows/audit-workflow.md` | Process Gap | 🟠 High |
| FE-01 | `frontend/` (root) | `.agent/` dir | Process Gap | 🟠 High |
| SR-02 | `supabase-receptor` | `.agents/rules/supabase-standards.md` | Architectural Drift | 🟠 High |
| PL-02 | `planner-frontend` | `.agents/rules/` | Architectural Drift | 🟡 Medium |
| PREF-01 | `preference-frontend` | `.agents/skills/adversarial-code-review/` | Architectural Drift | 🟡 Medium |
| PREF-02 | `preference-frontend` | `.agents/rules/` | Architectural Drift | 🟡 Medium |
| WF-01 | `workforce-frontend` | `.agents/skills/adversarial-code-review/` | Architectural Drift | 🟡 Medium |
| WF-02 | `workforce-frontend` | `.agents/rules/` | Architectural Drift | 🟡 Medium |
| SR-01 | `supabase-receptor` | `.agents/skills/adversarial-code-review/` | Architectural Drift | 🟡 Medium |
| DEF-01 | `receptor-ecosystem` | — | Process Gap | 🟢 Low |
