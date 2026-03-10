<!-- audit-slug: 260310-agent-infra-consolidation -->

# Recommendations — Agent Infrastructure Consolidation

**Branch:** `audit/260310-agent-infra-consolidation`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-10

> [!NOTE]
> This file is **auto-generated** from `recommendations.json`. Do not edit it
> directly — edit the JSON source and re-run
> `python .agents/scripts/render-recommendations.py recommendations.json`.

---

## Agent Clarifications (Human-Approved)

| Item                                                  | Decision                                                                                                                                                                                                                                                                                                                                                                                                  |
| :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Category assignment for documentation/common-bond     | documentation/common-bond maps to the docusaurus category (not frontend-nextjs). A 4th category directory docusaurus/ is created in dev-environment to serve documentation repos.                                                                                                                                                                                                                         |
| Orphaned frontend/.agent/ directory                   | frontend/ is not a git repository. The .agent/ directory is orphaned. Its useful content will be absorbed into frontend-nextjs/audit-workflow.md before deletion.                                                                                                                                                                                                                                         |
| Option A vs Option B symlink approach                 | Option A approved: full symlink of .agents/ to the appropriate category. Repo-specific context rows are generalised at category level; agents read actual repo files for specifics.                                                                                                                                                                                                                       |
| vitest-failure-investigation rules files              | rules/vitest-failure-investigation.md files in planner, preference, and workforce frontends are the rule-as-skill anti-pattern. They will be deleted; the skill is referenced via absolute path in workflow required_skills.                                                                                                                                                                              |
| pre-commit.md / git.md rules files                    | All three instances (planner-frontend/rules/pre-commit.md, preference-frontend/rules/git.md, workforce-frontend/rules/git.md) are byte-for-byte identical ecosystem-wide content. Promote to dev-environment/.agents/frontend-nextjs/rules/git.md; delete local copies.                                                                                                                                   |
| Uncommitted adversarial-code-review deletions         | The adversarial-code-review skill was deleted from disk in preference-frontend, workforce-frontend, and supabase-receptor during the audit session but was never committed. PREF-01, WF-01, SR-01 remain open. The implementation agent must commit these deletions as its first step.                                                                                                                    |
| supabase-receptor audit-workflow.md Repo Context rows | supabase-receptor/.agents/workflows/audit-workflow.md is fully JSON-refactor compliant and contains unique, valuable Repo Context rows (stack: PostgreSQL/Supabase/Deno, verify command: supabase db reset && supabase test db && deno check). These rows MUST be preserved in dev-environment/.agents/supabase-infrastructure/workflows/audit-workflow.md when creating the canonical category workflow. |

---

## 🔴 Critical

### ARCH-01: Each of the 9 repos maintains its own .agents/ directory with no symlink architecture. Skill updates in dev-environment

Affects: `all` — .agents directory architecture

- [x] Create the 4 category subdirectories in dev-environment/.agents/:
      frontend-nextjs/, supabase-infrastructure/, backend-python/, docusaurus/ —
      each with workflows/ and rules/ subdirs.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/`
      _(Completed: 2026-03-10T06:40:55Z)_
- [x] Write canonical workflow files (audit-workflow.md,
      implement-audit-workflow.md, finalise-local-audit.md) into each of the 4
      category directories, generalising repo-specific rows. Also write
      frontend-nextjs/rules/git.md using the ecosystem-wide pre-commit bypass
      rule (identical content from planner-frontend/rules/pre-commit.md,
      preference-frontend/rules/git.md, and workforce-frontend/rules/git.md).
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/`
      _(Completed: 2026-03-10T06:40:55Z)_
- [x] Delete local .agents/ workflow and rules contents from all 9 repos (keep
      directory for symlink step).
      `/Users/ryan/development/common_bond/antigravity-environment/`
      _(Completed: 2026-03-10T08:24:34Z)_
- [x] Create symlinks: planner-frontend/.agents -> frontend-nextjs,
      preference-frontend/.agents -> frontend-nextjs, workforce-frontend/.agents
      -> frontend-nextjs, website-frontend/.agents -> frontend-nextjs,
      supabase-receptor/.agents -> supabase-infrastructure,
      match-backend/.agents -> backend-python, receptor-planner/.agents ->
      backend-python, common-bond/.agents -> docusaurus.
      `/Users/ryan/development/common_bond/antigravity-environment/`
      _(Completed: 2026-03-10T08:24:34Z)_
- [x] Add .agents to .gitignore in each of the 9 child repos. CONFIRMED: zero of
      8 audited repos currently have .agents in .gitignore (rotator_worker not
      checked as it has no .agents). This task applies to all 9 repos.
      `/Users/ryan/development/common_bond/antigravity-environment/`
      _(Completed: 2026-03-10T08:24:34Z)_

### ARCH-02: dev-environment/.agents/ has no category-level organisation. Workflow files with category-specific context live in indiv

Affects: `dev-environment` — .agents directory structure

- [x] Addressed by ARCH-01-T1 and ARCH-01-T2 — no separate tasks required.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/`
      _(Completed: 2026-03-10T06:40:55Z)_

## 🟠 High

### PL-01: planner-frontend has local copies of 9 skills (adversarial-code-review was previously committed as deleted; remaining: d

Affects: `planner-frontend` — .agents/skills/

- [x] Delete frontend/planner-frontend/.agents/skills/ entirely (9 remaining
      skill directories). adversarial-code-review was already deleted and
      committed. Addressed by ARCH-01 symlink.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.agents/skills/`
      _(Completed: 2026-03-10T08:24:34Z)_

### SR-02: supabase-receptor has a rules file whose content mirrors the canonical dev-environment supabase-standards skill. This is

Affects: `supabase-receptor` — .agents/rules/supabase-standards.md

- [x] Delete supabase-receptor/.agents/rules/supabase-standards.md. The
      canonical skill is referenced by absolute path in supabase-receptor's
      audit-workflow.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.agents/rules/supabase-standards.md`
      _(Completed: 2026-03-10T06:40:55Z)_

### CB-01: supabase-postgres-best-practices (20+ reference files) exists only in common-bond's local .agents/skills/ and is not in

Affects: `documentation/common-bond` —
.agents/skills/supabase-postgres-best-practices/

- [x] Copy
      documentation/common-bond/.agents/skills/supabase-postgres-best-practices/
      into dev-environment/.agents/docusaurus/skills/. Update the reference in
      docusaurus/workflows/audit-workflow.md to the new canonical path.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/docusaurus/skills/supabase-postgres-best-practices/`
      _(Completed: 2026-03-10T06:40:55Z)_

### CB-02: common-bond's audit-workflow.md (197 lines, dual-mode) contains Docusaurus-specific context not shared with any other do

Affects: `documentation/common-bond` — .agents/workflows/audit-workflow.md

- [x] Use common-bond's audit-workflow.md as the basis for
      dev-environment/.agents/docusaurus/workflows/audit-workflow.md. Generalise
      any common-bond-specific references. Addressed as part of ARCH-01-T2.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/docusaurus/workflows/audit-workflow.md`
      _(Completed: 2026-03-10T06:40:55Z)_

### FE-01: frontend/.agent/ exists at the monorepo parent level which is not a git repository. It contains 5 files: 4 workflow file

Affects: `frontend (monorepo root)` — .agent/ directory

- [x] DO NOT simply delete frontend/.agent/. Steps: (1) Compare
      frontend/.agent/workflows/frontend-test-audit.md with
      dev-environment/.agents/workflows/frontend-test-audit.md — merge any
      unique content. (2) Promote frontend/.agent/rules/component-sync.md to
      dev-environment/.agents/frontend-nextjs/rules/component-sync.md. (3)
      Remaining 3 workflow stubs (audit, implement, finalise) are duplicates —
      discard. (4) Delete frontend/.agent/ entirely.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/.agent/`
      _(Completed: 2026-03-10T06:41:33Z)_

## 🟡 Medium

### PL-02: planner-frontend has rules/vitest-failure-investigation.md (mirrors dev-environment skill) and rules/pre-commit.md. The

Affects: `planner-frontend` — .agents/rules/

- [x] Delete rules/vitest-failure-investigation.md. For pre-commit.md: content
      is identical to preference-frontend/rules/git.md and
      workforce-frontend/rules/git.md (ecosystem-wide 'don't bypass pre-commit
      hooks' rule). Promote this content to
      dev-environment/.agents/frontend-nextjs/rules/git.md (addressed by
      ARCH-01-T2), then delete the local pre-commit.md.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.agents/rules/`
      _(Completed: 2026-03-10T08:24:34Z)_

### PREF-01: preference-frontend had adversarial-code-review deleted from disk during this audit session, but the deletion was NEVER

Affects: `preference-frontend` — .agents/skills/adversarial-code-review/

- [x] Commit the disk-level deletion of
      frontend/preference-frontend/.agents/skills/adversarial-code-review/
      (directory was removed from disk but not staged/committed). Also commit
      removal of vitest-failure-investigation from skills/ (it belongs in
      workflows via required_skills, not as a local skills/ copy).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.agents/skills/adversarial-code-review/`
      _(Completed: 2026-03-10T06:40:55Z)_

### PREF-02: preference-frontend has rules/vitest-failure-investigation.md and rules/git.md. The vitest rule mirrors the canonical de

Affects: `preference-frontend` — .agents/rules/

- [x] rules/git.md content is identical to planner-frontend/rules/pre-commit.md
      and workforce-frontend/rules/git.md. It is promoted to
      dev-environment/.agents/frontend-nextjs/rules/git.md (addressed by
      ARCH-01-T2). Delete local copies after symlink. Also delete
      rules/vitest-failure-investigation.md.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.agents/rules/`
      _(Completed: 2026-03-10T08:24:34Z)_

### WF-01: workforce-frontend had adversarial-code-review deleted from disk during this audit session, but the deletion was NEVER c

Affects: `workforce-frontend` — .agents/skills/adversarial-code-review/

- [x] Commit the disk-level deletion of
      frontend/workforce-frontend/.agents/skills/adversarial-code-review/
      (directory was removed from disk but not staged/committed). Also commit
      removal of vitest-failure-investigation from skills/.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.agents/skills/adversarial-code-review/`
      _(Completed: 2026-03-10T06:40:55Z)_

### WF-02: workforce-frontend has rules/vitest-failure-investigation.md and rules/git.md. The vitest rule mirrors the canonical dev

Affects: `workforce-frontend` — .agents/rules/

- [x] rules/git.md content is identical to planner-frontend/rules/pre-commit.md
      and preference-frontend/rules/git.md. Promoted to
      frontend-nextjs/rules/git.md (addressed by ARCH-01-T2). Delete local
      copies after symlink. Also delete rules/vitest-failure-investigation.md.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.agents/rules/`
      _(Completed: 2026-03-10T08:24:34Z)_

### SR-01: supabase-receptor had adversarial-code-review deleted from disk during this audit session, but the deletion was NEVER co

Affects: `supabase-receptor` — .agents/skills/adversarial-code-review/

- [x] Commit the disk-level deletion of
      supabase-receptor/.agents/skills/adversarial-code-review/ (directory was
      removed from disk but not staged/committed).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.agents/skills/adversarial-code-review/`
      _(Completed: 2026-03-10T06:40:55Z)_

### RW-01: rotator_worker (Flutter/Dart) has no .agents/ directory. It is the only repository in the ecosystem with zero agent infr

Affects: `rotator_worker` — .agents/ (missing)

- [x] Create dev-environment/.agents/dart-flutter/ category with workflows/ and
      rules/ subdirs. Write dart-flutter-specific audit-workflow.md,
      implement-audit-workflow.md, finalise-local-audit.md. Symlink
      frontend/rotator_worker/.agents -> dev-environment/.agents/dart-flutter/.
      Add .agents to rotator_worker .gitignore.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/rotator_worker/.agents`
      _(Completed: 2026-03-10T08:24:34Z)_

### MB-01: match-backend has local copies of python-design-patterns and python-testing-patterns, both of which exist in dev-environ

Affects: `match-backend` — .agents/skills/

- [x] Delete backend/match-backend/.agents/skills/python-design-patterns/ and
      backend/match-backend/.agents/skills/python-testing-patterns/. Addressed
      by the ARCH-01 symlink to backend-python/ category.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.agents/skills/`
      _(Completed: 2026-03-10T08:24:34Z)_

### RP-01: receptor-planner has local copies of python-design-patterns and python-testing-patterns, both of which exist in dev-envi

Affects: `receptor-planner` — .agents/skills/

- [x] Delete backend/receptor-planner/.agents/skills/python-design-patterns/ and
      backend/receptor-planner/.agents/skills/python-testing-patterns/.
      Addressed by the ARCH-01 symlink to backend-python/ category.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.agents/skills/`
      _(Completed: 2026-03-10T08:24:34Z)_

## 🟢 Low

### DE-01: dev-environment/.agents/ has no README.md or contribution guide. The directory contains schemas/, scripts/, skills/, and

Affects: `dev-environment` — .agents/ (root)

- [x] Create dev-environment/.agents/README.md documenting: (1) directory
      structure and purpose of each subdirectory, (2) how to add a new skill
      (naming, SKILL.md frontmatter, registration), (3) how to add a new
      category (dir structure, required workflow files, symlink convention), (4)
      naming conventions (snake-case skills, category dirs), (5) how the symlink
      architecture works.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/README.md`
      _(Completed: 2026-03-10T06:40:55Z)_

### DEF-01: documentation/receptor-ecosystem does not exist as a local repository. When created, it will need to be mapped to the do

Affects: `receptor-ecosystem` — .agents/ directory

- [ ] When receptor-ecosystem repo is created: create symlink
      documentation/receptor-ecosystem/.agents ->
      dev-environment/.agents/docusaurus. Add .agents to its .gitignore.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/receptor-ecosystem/`

### RISK-01: The symlink migration creates a window where some repos are symlinked and others are not. An agent invoked mid-migration

Affects: `all` — symlink migration sequence

- [x] Implementation agent must process all repos in a single category before
      moving to the next. Recommended sequence: (1) frontend-nextjs: planner,
      preference, workforce, website, (2) backend-python: match-backend,
      receptor-planner, (3) supabase-infrastructure: supabase-receptor, (4)
      docusaurus: common-bond.
      `/Users/ryan/development/common_bond/antigravity-environment/`
      _(Completed: 2026-03-10T08:24:34Z)_

---

## Deferred to Next Audit Cycle

| Item                                       | Reason Deferred                                                                                             |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| DEF-01: receptor-ecosystem .agents symlink | documentation/receptor-ecosystem repository does not yet exist. This task applies when the repo is created. |

---

## Implementation Order

| Phase | Finding IDs                                                  | Rationale                                                                                 |
| :---- | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| 1     | ARCH-01, ARCH-02, CB-02, FE-01, PREF-01, WF-01, SR-01, DE-01 | Create category structure, canonical workflows, and commit uncommitted deletion leftovers |
| 2     | CB-01                                                        | Promote supabase-postgres-best-practices skill to docusaurus category                     |
| 3     | PL-01, PL-02, PREF-02, WF-02, SR-02, MB-01, RP-01, RW-01     | Delete local duplicates, create symlinks, update .gitignore                               |
| 4     | DEF-01                                                       | Deferred — receptor-ecosystem setup                                                       |

---

## Severity Summary

| Finding ID | Area                                             | File                               | Category            | Severity    |
| :--------- | :----------------------------------------------- | :--------------------------------- | :------------------ | :---------- |
| ARCH-01    | .agents directory architecture                   | `.agents`                          | Architectural Drift | 🔴 Critical |
| ARCH-02    | .agents directory structure                      | `.agents`                          | Process Gap         | 🔴 Critical |
| PL-01      | .agents/skills/                                  | `skills`                           | Architectural Drift | 🟠 High     |
| SR-02      | .agents/rules/supabase-standards.md              | `supabase-standards.md`            | Architectural Drift | 🟠 High     |
| CB-01      | .agents/skills/supabase-postgres-best-practices/ | `supabase-postgres-best-practices` | Process Gap         | 🟠 High     |
| CB-02      | .agents/workflows/audit-workflow.md              | `audit-workflow.md`                | Process Gap         | 🟠 High     |
| FE-01      | .agent/ directory                                | `.agent`                           | Process Gap         | 🟠 High     |
| PL-02      | .agents/rules/                                   | `rules`                            | Architectural Drift | 🟡 Medium   |
| PREF-01    | .agents/skills/adversarial-code-review/          | `adversarial-code-review`          | Architectural Drift | 🟡 Medium   |
| PREF-02    | .agents/rules/                                   | `rules`                            | Architectural Drift | 🟡 Medium   |
| WF-01      | .agents/skills/adversarial-code-review/          | `adversarial-code-review`          | Architectural Drift | 🟡 Medium   |
| WF-02      | .agents/rules/                                   | `rules`                            | Architectural Drift | 🟡 Medium   |
| SR-01      | .agents/skills/adversarial-code-review/          | `adversarial-code-review`          | Architectural Drift | 🟡 Medium   |
| RW-01      | .agents/ (missing)                               | `.agents`                          | Process Gap         | 🟡 Medium   |
| MB-01      | .agents/skills/                                  | `skills`                           | Architectural Drift | 🟡 Medium   |
| RP-01      | .agents/skills/                                  | `skills`                           | Architectural Drift | 🟡 Medium   |
| DE-01      | .agents/ (root)                                  | `README.md`                        | Process Gap         | 🟢 Low      |
| DEF-01     | .agents/ directory                               | `receptor-ecosystem`               | Process Gap         | 🟢 Low      |
| RISK-01    | symlink migration sequence                       | `antigravity-environment`          | Process Risk        | 🟢 Low      |

---

## Session Close — 2026-03-10

**Completed:** ARCH-01-T3, ARCH-01-T4, ARCH-01-T5, PL-01-T1, PL-02-T1,
PREF-02-T1, WF-02-T1, MB-01-T1, RP-01-T1, RW-01-T1, RISK-01-T1 (11 tasks)

**Remaining:** DEF-01-T1 (receptor-ecosystem .agents symlink — deferred, repo
does not yet exist)

**Blocked:** None

**PR order note:** No merge-order dependency between repos — all changes are
`.gitignore` and local `.agents/` content deletions. PRs can be raised in
parallel across all 9 repos.

**Brief for next agent:** All 9 repos now have their local `.agents/` contents
deleted and committed to `audit/260310-agent-infra-consolidation`. All 9 local
symlinks created and verified correct. New decision from this session:
`rotator_worker` had no `.agents` dir — a new `dart-flutter` category was
created in Phase 1+2; symlink points there. The `match-backend` python skill
dirs were untracked (never committed to git on the audit branch) — deleted with
`rm -rf`. DEF-01-T1 is the only remaining open task and is formally deferred
pending `receptor-ecosystem` repo creation. Proceed with
`/finalise-global-audit` to run the re-audit, raise PRs across all 9 repos,
merge, and archive.
