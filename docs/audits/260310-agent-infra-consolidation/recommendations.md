<!-- audit-slug: 260310-agent-infra-consolidation -->

# Recommendations — Agent Infrastructure Consolidation

**Branch:** `audit/260310-agent-infra-consolidation`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-10

> [!NOTE]
> This file is **auto-generated** from `recommendations.json`.
> Do not edit it directly — edit the JSON source and re-run
> `python .agents/scripts/render-recommendations.py recommendations.json`.

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Category assignment for documentation/common-bond | documentation/common-bond maps to the docusaurus category (not frontend-nextjs). A 4th category directory docusaurus/ is created in dev-environment to serve documentation repos. |
| Orphaned frontend/.agent/ directory | frontend/ is not a git repository. The .agent/ directory is orphaned. Its useful content will be absorbed into frontend-nextjs/audit-workflow.md before deletion. |
| Option A vs Option B symlink approach | Option A approved: full symlink of .agents/ to the appropriate category. Repo-specific context rows are generalised at category level; agents read actual repo files for specifics. |
| vitest-failure-investigation rules files | rules/vitest-failure-investigation.md files in planner, preference, and workforce frontends are the rule-as-skill anti-pattern. They will be deleted; the skill is referenced via absolute path in workflow required_skills. |


---

## 🔴 Critical

### ARCH-01: Each of the 9 repos maintains its own .agents/ directory with no symlink architecture. Skill updates in dev-environment 

Affects: `all` — .agents directory architecture


- [ ] Create the 4 category subdirectories in dev-environment/.agents/: frontend-nextjs/, supabase-infrastructure/, backend-python/, docusaurus/ — each with workflows/ and rules/ subdirs.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/`
- [ ] Write canonical workflow files (audit-workflow.md, implement-audit-workflow.md, finalise-local-audit.md) into each of the 4 category directories, generalising repo-specific rows.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/`
- [ ] Delete local .agents/ workflow and rules contents from all 9 repos (keep directory for symlink step).
      `/Users/ryan/development/common_bond/antigravity-environment/`
- [ ] Create symlinks: planner-frontend/.agents -> frontend-nextjs, preference-frontend/.agents -> frontend-nextjs, workforce-frontend/.agents -> frontend-nextjs, website-frontend/.agents -> frontend-nextjs, supabase-receptor/.agents -> supabase-infrastructure, match-backend/.agents -> backend-python, receptor-planner/.agents -> backend-python, common-bond/.agents -> docusaurus.
      `/Users/ryan/development/common_bond/antigravity-environment/`
- [ ] Add .agents to .gitignore in each of the 9 child repos.
      `/Users/ryan/development/common_bond/antigravity-environment/`

### ARCH-02: dev-environment/.agents/ has no category-level organisation. Workflow files with category-specific context live in indiv

Affects: `dev-environment` — .agents directory structure


- [ ] Addressed by ARCH-01-T1 and ARCH-01-T2 — no separate tasks required.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/`

## 🟠 High

### PL-01: planner-frontend has local copies of 10 skills (adversarial-code-review, design-md, enhance-prompt, find-skills, nextjs-

Affects: `planner-frontend` — .agents/skills/


- [ ] Delete frontend/planner-frontend/.agents/skills/ entirely (all 10 skill directories). Addressed by ARCH-01 symlink.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.agents/skills/`

### SR-02: supabase-receptor has a rules file whose content mirrors the canonical dev-environment supabase-standards skill. This is

Affects: `supabase-receptor` — .agents/rules/supabase-standards.md


- [ ] Delete supabase-receptor/.agents/rules/supabase-standards.md. The canonical skill is referenced by absolute path in supabase-receptor's audit-workflow.md.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.agents/rules/supabase-standards.md`

### CB-01: supabase-postgres-best-practices (20+ reference files) exists only in common-bond's local .agents/skills/ and is not in 

Affects: `documentation/common-bond` — .agents/skills/supabase-postgres-best-practices/


- [ ] Copy documentation/common-bond/.agents/skills/supabase-postgres-best-practices/ into dev-environment/.agents/docusaurus/skills/. Update the reference in docusaurus/workflows/audit-workflow.md to the new canonical path.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/docusaurus/skills/supabase-postgres-best-practices/`

### CB-02: common-bond's audit-workflow.md (197 lines, dual-mode) contains Docusaurus-specific context not shared with any other do

Affects: `documentation/common-bond` — .agents/workflows/audit-workflow.md


- [ ] Use common-bond's audit-workflow.md as the basis for dev-environment/.agents/docusaurus/workflows/audit-workflow.md. Generalise any common-bond-specific references. Addressed as part of ARCH-01-T2.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/docusaurus/workflows/audit-workflow.md`

### FE-01: frontend/.agent/ exists at the monorepo parent level which is not a git repository. It contains 4 workflow files and 1 r

Affects: `frontend (monorepo root)` — .agent/ directory


- [ ] Absorb unique content from frontend/.agent/workflows/audit-workflow.md into dev-environment/.agents/frontend-nextjs/workflows/audit-workflow.md. Delete frontend/.agent/ entirely.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/.agent/`

## 🟡 Medium

### PL-02: planner-frontend has rules/vitest-failure-investigation.md (mirrors dev-environment skill) and rules/pre-commit.md. The 

Affects: `planner-frontend` — .agents/rules/


- [ ] Delete rules/vitest-failure-investigation.md. Evaluate pre-commit.md — absorb into frontend-nextjs/rules/ if cross-category, otherwise it will be deleted when symlink is created.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.agents/rules/`

### PREF-01: preference-frontend had a local copy of adversarial-code-review (confirmed identical to dev-environment). Deleted during

Affects: `preference-frontend` — .agents/skills/adversarial-code-review/


- [x] Delete frontend/preference-frontend/.agents/skills/adversarial-code-review/ (completed mid-session).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.agents/skills/adversarial-code-review/`
      _(Completed: 2026-03-10T15:50:00Z)_

### PREF-02: preference-frontend has rules/vitest-failure-investigation.md and rules/git.md. The vitest rule mirrors the canonical de

Affects: `preference-frontend` — .agents/rules/


- [ ] rules/vitest-failure-investigation.md and rules/git.md will be absorbed into frontend-nextjs/rules/ (addressed by ARCH-01). Delete local copies after symlink.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.agents/rules/`

### WF-01: workforce-frontend had a local copy of adversarial-code-review (confirmed identical). Deleted during this audit session.

Affects: `workforce-frontend` — .agents/skills/adversarial-code-review/


- [x] Delete frontend/workforce-frontend/.agents/skills/adversarial-code-review/ (completed mid-session).
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.agents/skills/adversarial-code-review/`
      _(Completed: 2026-03-10T15:50:00Z)_

### WF-02: workforce-frontend has rules/vitest-failure-investigation.md and rules/git.md. The vitest rule mirrors the canonical dev

Affects: `workforce-frontend` — .agents/rules/


- [ ] rules/vitest-failure-investigation.md and rules/git.md will be absorbed into frontend-nextjs/rules/ (addressed by ARCH-01). Delete local copies after symlink.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.agents/rules/`

### SR-01: supabase-receptor had a local copy of adversarial-code-review (confirmed identical). Deleted during this audit session.

Affects: `supabase-receptor` — .agents/skills/adversarial-code-review/


- [x] Delete supabase-receptor/.agents/skills/adversarial-code-review/ (completed mid-session).
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.agents/skills/adversarial-code-review/`
      _(Completed: 2026-03-10T15:50:00Z)_

## 🟢 Low

### DEF-01: documentation/receptor-ecosystem does not exist as a local repository. When created, it will need to be mapped to the do

Affects: `receptor-ecosystem` — .agents/ directory


- [ ] When receptor-ecosystem repo is created: create symlink documentation/receptor-ecosystem/.agents -> dev-environment/.agents/docusaurus. Add .agents to its .gitignore.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/receptor-ecosystem/`


---

## Deferred to Next Audit Cycle

| Item | Reason Deferred |
| :--- | :-------------- |
| DEF-01: receptor-ecosystem .agents symlink | documentation/receptor-ecosystem repository does not yet exist. This task applies when the repo is created. |


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | ARCH-01, ARCH-02, CB-02, FE-01 | Create category structure and canonical workflows |
| 2 | CB-01 | Promote supabase-postgres-best-practices skill to docusaurus category |
| 3 | PL-01, PL-02, PREF-02, WF-02, SR-02 | Delete local duplicates, create symlinks, update .gitignore |
| 4 | DEF-01 | Deferred — receptor-ecosystem setup |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| ARCH-01 | .agents directory architecture | `.agents` | Architectural Drift | 🔴 Critical |
| ARCH-02 | .agents directory structure | `.agents` | Process Gap | 🔴 Critical |
| PL-01 | .agents/skills/ | `skills` | Architectural Drift | 🟠 High |
| SR-02 | .agents/rules/supabase-standards.md | `supabase-standards.md` | Architectural Drift | 🟠 High |
| CB-01 | .agents/skills/supabase-postgres-best-practices/ | `supabase-postgres-best-practices` | Process Gap | 🟠 High |
| CB-02 | .agents/workflows/audit-workflow.md | `audit-workflow.md` | Process Gap | 🟠 High |
| FE-01 | .agent/ directory | `.agent` | Process Gap | 🟠 High |
| PL-02 | .agents/rules/ | `rules` | Architectural Drift | 🟡 Medium |
| PREF-01 | .agents/skills/adversarial-code-review/ | `adversarial-code-review` | Architectural Drift | 🟡 Medium |
| PREF-02 | .agents/rules/ | `rules` | Architectural Drift | 🟡 Medium |
| WF-01 | .agents/skills/adversarial-code-review/ | `adversarial-code-review` | Architectural Drift | 🟡 Medium |
| WF-02 | .agents/rules/ | `rules` | Architectural Drift | 🟡 Medium |
| SR-01 | .agents/skills/adversarial-code-review/ | `adversarial-code-review` | Architectural Drift | 🟡 Medium |
| DEF-01 | .agents/ directory | `receptor-ecosystem` | Process Gap | 🟢 Low |

