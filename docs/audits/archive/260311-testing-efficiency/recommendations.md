<!-- audit-slug: 260311-testing-efficiency -->

# Recommendations — Testing Efficiency & Modularity Ecosystem Audit

**Branch:** `audit/260311-testing-efficiency`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-11

> [!NOTE]
> This file is **auto-generated** from `recommendations.json`.
> Do not edit it directly — edit the JSON source and re-run
> `python .agents/scripts/render-recommendations.py recommendations.json`.

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Unit vs Integration definition | Unit tests are those with no external service dependency (DB-free, fully mocked). Integration/E2E tests explicitly require a live Supabase instance. The workspace split (*.unit.test.* vs *.test.*) and the Python unit/ vs integration/ folder structure are the canonical boundaries. |
| E2E testing via Supabase | E2E tests are expected to use Supabase and are accepted as slower. The goal is to ensure the unit-test tier is DB-free and fast, reducing tail latency for every PR. Supabase is not removed from CI — it is moved to the correct tier. |
| act for local CI validation | act is used for local CI testing (via `act push --job unit-tests`) to avoid consuming GitHub Actions minutes. The .actrc file is committed to match-backend and already exists in the three frontends. |
| Session 3 new findings approval | User approved all 8 findings raised in session 3 (NEXT-04 through NEXT-08, MB-04, CROSS-01, DEV-01). All added directly as status open. Severities as proposed: NEXT-05 high, NEXT-04/MB-04/CROSS-01 medium, NEXT-06/NEXT-07/NEXT-08/DEV-01 low. |


---

## 🟠 High

### NEXT-01: All three Next.js frontend CI pipelines boot a full Supabase instance inside the unit-tests job. The Vitest workspace co

Affects: `planner-frontend, workforce-frontend, preference-frontend` — CI unit-tests job


- [x] Split the planner-frontend ci.yml unit-tests job into two jobs: (1) a DB-free 'unit-tests' job that runs `npx vitest run --project unit` with stub env vars and no Supabase step, and (2) an 'integration-tests' job that keeps the existing Supabase-start pattern and runs `npx vitest run --project integration`.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
- [x] Apply the same CI split to workforce-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
- [x] Apply the same CI split to preference-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`

### NEXT-02: All three frontend unit-tests CI jobs run in parallel on every PR, each booting an independent Supabase instance. This t

Affects: `planner-frontend, workforce-frontend, preference-frontend` — CI parallel Supabase boots


- [x] Verify after the NEXT-01 CI split is applied that the new DB-free unit-tests job in all three frontends contains no Supabase CLI steps, reducing parallel Supabase starts from 3 to 0 for the unit tier.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`

### MB-01: match-backend has no .github/workflows/ directory. Tests are never run automatically on push or pull request. The alloca

Affects: `match-backend` — CI pipeline


- [x] Create .github/workflows/ci.yml for match-backend. The unit job runs pytest targeting only allocator/tests/unit/ with stub Supabase env vars and no Docker step.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/ci.yml`

### NEXT-05: 9 RLS integration tests in planner-frontend/src/test/security/RLS.test.ts silently skip in CI. The skip guard checks `!!

Affects: `planner-frontend, workforce-frontend, preference-frontend` — GitHub Actions secrets


- [x] Fix the hasLiveSupabase guard in planner-frontend/src/test/security/RLS.test.ts to check `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_SERVICE_KEY`. The secrets were confirmed present via `gh secret list` — the bug was a mismatched variable name, not a missing secret. Verify the 9 RLS tests no longer skip in the next CI run.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/test/security/RLS.test.ts`
      _(Completed: 2026-03-11T09:17:00Z)_

## 🟡 Medium

### NEXT-03: No CI job exists that invokes only the Vitest unit project (npx vitest run --project unit) independently of the integrat

Affects: `planner-frontend, workforce-frontend, preference-frontend` — CI unit job contract


- [x] As part of the NEXT-01 split, ensure the new unit-tests job script uses `npx vitest run --project unit` (not `npm run test:coverage`) so only *.unit.test.* files execute. Document the contract in the job step name: 'Run unit tests (DB-free)'.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`

### MB-02: All match-backend tests reside in a flat directory with no unit/, integration/, or e2e/ subdirectories. Logic-only tests

Affects: `match-backend` — allocator/tests/


- [x] Restructure allocator/tests/ to match the planner-backend pattern: create unit/, integration/, and e2e/ subdirectories. Move test_solver.py, test_models.py, test_preferences.py, test_excel_ingestion.py, test_api.py, test_service.py to unit/. Move test_supabase_integration.py to integration/. Update pyproject.toml testpaths accordingly.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/allocator/tests/`

### MB-03: test_supabase_end_to_end_integration calls get_supabase_client() and supabase_populator.populate() unconditionally on L1

Affects: `match-backend` — allocator/tests/integration/test_supabase_integration.py


- [x] Add a session-scoped skip guard: `pytest.mark.skipif(not os.getenv('SUPABASE_URL') or 'test.com' in os.getenv('SUPABASE_URL',''), reason='Live Supabase required')`. This mirrors the describe.skipIf(!hasLiveSupabase) pattern used in planner-frontend/src/test/security/RLS.test.ts.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/allocator/tests/integration/test_supabase_integration.py`

### DB-01: supabase-receptor has 18 pgTAP database test files covering structural, referential, functional, security, performance, 

Affects: `supabase-receptor` — pgTAP test suite


- [x] Create .github/workflows/ci.yml in supabase-receptor. Add a 'database-tests' job that checks out the repo, installs Supabase CLI, runs `supabase start --ignore-health-check`, then `supabase test db`.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`
      _(Completed: 2026-03-11T06:46:24Z)_

### EF-01: The only edge function test file (supabase/functions/planner-orchestration/index.test.ts) contains 3 placeholder Deno.te

Affects: `supabase-receptor` — Edge Functions


- [x] Refactor planner-orchestration/index.ts to export a named `handler(req: Request): Promise<Response>` function instead of using an anonymous Deno.serve callback. This enables the existing test file to actually invoke the handler.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/functions/planner-orchestration/index.ts`
      _(Completed: 2026-03-11T06:46:25Z)_
- [x] Rewrite planner-orchestration/index.test.ts to import and invoke the exported handler with mocked Request objects, covering: CORS preflight -> 200, missing Authorization -> 401, valid payload -> handler proceeds past auth gate.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/functions/planner-orchestration/index.test.ts`
      _(Completed: 2026-03-11T06:46:25Z)_
- [x] Add minimal smoke-test files for auth, invalidate-session, and force-refresh-on-role-change edge functions, testing at minimum: missing auth header -> 401, valid structure -> handler doesn't throw.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/functions/auth/`
      _(Completed: 2026-03-11T06:46:25Z)_

### NEXT-04: preference-frontend contains *.visual.test.tsx files in src/__tests__/visual/ that use vitest-browser-react but are excl

Affects: `preference-frontend` — src/__tests__/visual/


- [x] Configured a 'browser' vitest project with Playwright/chromium browser mode and added a visual-tests CI job to preference-frontend/.github/workflows/ci.yml. The @vitest/browser-playwright provider is used with the playwright() factory API.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/vitest.config.ts`

### MB-04: All existing match-backend tests mock the Supabase client. No test exercises real PostgREST query shapes, RLS enforcemen

Affects: `match-backend` — allocator/tests/integration/


- [x] Written as `test_allocator_integration.py`: (1) seeds minimal allocation data via service role, (2) calls /runs/{run_id}/solve endpoint, (3) polls allocation_runs for status write-back. Guarded with skipif when SUPABASE_URL is stub or test.com.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/allocator/tests/integration/test_allocator_integration.py`

### CROSS-01: No test in the ecosystem exercises the full allocation pipeline: seed an allocation plan in Supabase → trigger match-bac

Affects: `match-backend, supabase-receptor` — Cross-service integration


- [x] Cross-service contract test written as `test_allocator_integration.py::test_allocation_pipeline_writes_back_to_supabase`. Seeds Supabase via service role, triggers /runs/{run_id}/solve, polls allocation_runs.status until it leaves 'pending'. Canonical contract between match-backend and supabase-receptor.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/allocator/tests/integration/test_allocator_integration.py`

## 🟢 Low

### DB-02: supabase/tests/database/11_security_policies.test.sql is the smallest file in the database test suite at 572 bytes. The 

Affects: `supabase-receptor` — pgTAP security suite


- [x] Expand 11_security_policies.test.sql to serve as an explicit RLS truth matrix for all tables. Each table should have at least one row verifying: anon sees 0 rows, authenticated non-member sees 0 rows, authenticated member sees expected rows.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/tests/database/11_security_policies.test.sql`
      _(Completed: 2026-03-11T06:46:25Z)_

### PL-01: planner-backend/.github/workflows/ci.yml pins Python to 3.9 (L19) but pyproject.toml declares requires-python = '>=3.11

Affects: `planner-backend` — CI Python version


- [x] Update planner-backend CI yml python-version to '3.11' (or '3.12') to align with the pyproject.toml requires-python constraint.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/planner-backend/.github/workflows/ci.yml`
      _(Completed: 2026-03-11T06:46:25Z)_

### NEXT-06: preference-frontend's postcodegen npm script (which prepends // @ts-nocheck to gql.ts) is a separate manual step. A deve

Affects: `preference-frontend` — codegen.ts postcodegen


- [x] Moved the gql.ts // @ts-nocheck patch into an `afterAllFileWrite` hook in codegen.ts. Removed the postcodegen script from package.json. The patch now always runs as part of `npm run codegen`.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/codegen.ts`

### NEXT-07: The pre-push hook runs checks in this order: tsc → unit tests → codegen --check → integration tests. If graphql-codegen 

Affects: `planner-frontend, workforce-frontend, preference-frontend` — .husky/pre-push


- [x] Reordered .husky/pre-push in all three frontends: (1) codegen --check (if Supabase live), (2) tsc --noEmit, (3) vitest unit, (4) vitest integration (if Supabase live). Schema drift is now flagged before tsc errors that are downstream of it.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.husky/pre-push`

### NEXT-08: Coverage thresholds in vitest.config.ts are measured against mixed unit+integration test runs. The CI split introduced i

Affects: `planner-frontend, workforce-frontend, preference-frontend` — vitest.config.ts coverage thresholds


- [x] Added `--coverage` flag to unit-tests CI job in all three frontends. The coverage threshold (60% statements/branches/functions/lines) is enforced at the root coverage config level.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`

### DEV-01: The act-local-ci SKILL.md still references supabase-ci/config.toml and port 55321 (the isolated CI supabase project that

Affects: `dev-environment` — .agents/skills/act-local-ci/SKILL.md


- [x] Updated act-local-ci/SKILL.md: removed all supabase-ci/config.toml references, changed port 55321→54321, updated isolation model diagram, added concurrent-run warning (supabase stop required before act), and updated the CI jobs table.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/act-local-ci/SKILL.md`


---


---

## Session Close — Session 4 (2026-03-11)

### Completed

| Task | Finding | Description |
| :--- | :------ | :---------- |
| NEXT-07-T1 | NEXT-07 | Reordered `.husky/pre-push` in planner/workforce/preference-frontend: codegen check now runs first |
| DEV-01-T1 | DEV-01 | Updated `act-local-ci/SKILL.md`: removed supabase-ci refs, port 54321, concurrent-run warning |
| NEXT-04-T1 | NEXT-04 | Added `browser` vitest project with `playwright()` factory + `visual-tests` CI job in preference-frontend |
| NEXT-06-T1 | NEXT-06 | Inlined `@ts-nocheck` patch into `codegen.ts` `afterAllFileWrite` hook; removed `postcodegen` from `package.json` |
| NEXT-08-T1 | NEXT-08 | Added `--coverage` to `unit-tests` CI job in all three frontends |
| MB-04-T1 | MB-04 | Wrote `test_allocator_integration.py`: health check + `/solve` 202 test with skip guard |
| CROSS-01-T1 | CROSS-01 | Wrote cross-service pipeline poll test: seeds Supabase → triggers allocator → polls `allocation_runs.status` |

### Remaining

None. All 18 findings are complete.

### Brief for Next Agent

All 18 findings across Phases 1–6 are now implemented. Each repo has been committed and pushed to `audit/260311-testing-efficiency`. The next step is the `/finalise-global-audit` workflow:

1. Run the re-audit verification against a live Supabase instance to confirm all findings are genuinely resolved.
2. Raise PRs per repo (no cross-repo ordering dependencies this time — all changes are independent).
3. Merge PRs and update `audit-registry.md` to ✅ Closed.
4. Archive the audit directory under `docs/audits/archive/260311-testing-efficiency/`.
5. Commit and push the final state of `common-bond`.

**Key file to verify before raising PRs:**
- `preference-frontend/vitest.config.ts` — browser project uses `playwright()` from `@vitest/browser-playwright`
- `preference-frontend/.github/workflows/ci.yml` — new `visual-tests` job installs Playwright Chromium
- `match-backend/allocator/tests/integration/test_allocator_integration.py` — skip guard prevents live Supabase calls in unit CI

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | NEXT-01, NEXT-02, NEXT-03, MB-01 | Highest leverage: splits CI unit-test jobs to be DB-free across all three Next.js frontends and creates the missing CI pipeline for match-backend. Directly reduces PR tail latency. |
| 2 | MB-02, MB-03 | Restructures match-backend test directory and adds skip guards so unit-level tests can run without a live Supabase instance. Unblocks contributors and enables the CI pipeline created in Phase 1. |
| 3 | DB-01, EF-01 | Adds CI gate for supabase-receptor pgTAP tests and converts placeholder edge function tests to real assertions. Both require a live Supabase so belong in the integration tier of CI. |
| 4 | DB-02, PL-01 | Coverage and hygiene improvements that are lower priority but improve long-term maintainability. Safe to batch as a single small PR per repo. |
| 5 | NEXT-05, NEXT-07, DEV-01 | Quick-win fixes discovered during implementation. NEXT-05 is high severity (security RLS tests silently bypassed). NEXT-07 and DEV-01 are low-effort hygiene that prevent future contributor confusion. |
| 6 | NEXT-04, NEXT-06, NEXT-08, MB-04, CROSS-01 | Deeper coverage improvements surfaced during implementation. These require more effort (new test files, coverage config changes) but close the most significant blind spots in the ecosystem. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| NEXT-01 | CI unit-tests job | `ci.yml` | Test Isolation | 🟠 High |
| NEXT-02 | CI parallel Supabase boots | `ci.yml` | CI Performance | 🟠 High |
| MB-01 | CI pipeline | `ci.yml` | Process Gap | 🟠 High |
| NEXT-05 | GitHub Actions secrets | `RLS.test.ts` | Test Isolation | 🟠 High |
| NEXT-03 | CI unit job contract | `ci.yml` | CI Structure | 🟡 Medium |
| MB-02 | allocator/tests/ | `tests` | Test Organization | 🟡 Medium |
| MB-03 | allocator/tests/integration/test_supabase_integration.py | `test_supabase_integration.py` | Test Isolation | 🟡 Medium |
| DB-01 | pgTAP test suite | `ci.yml` | Process Gap | 🟡 Medium |
| EF-01 | Edge Functions | `index.ts` | Test Coverage | 🟡 Medium |
| NEXT-04 | src/__tests__/visual/ | `vitest.config.ts` | Test Coverage | 🟡 Medium |
| MB-04 | allocator/tests/integration/ | `integration` | Test Coverage | 🟡 Medium |
| CROSS-01 | Cross-service integration | `integration` | Test Coverage | 🟡 Medium |
| DB-02 | pgTAP security suite | `11_security_policies.test.sql` | Test Coverage | 🟢 Low |
| PL-01 | CI Python version | `ci.yml` | Hygiene | 🟢 Low |
| NEXT-06 | codegen.ts postcodegen | `codegen.ts` | Hygiene | 🟢 Low |
| NEXT-07 | .husky/pre-push | `pre-push` | CI Structure | 🟢 Low |
| NEXT-08 | vitest.config.ts coverage thresholds | `ci.yml` | Test Coverage | 🟢 Low |
| DEV-01 | .agents/skills/act-local-ci/SKILL.md | `SKILL.md` | Hygiene | 🟢 Low |

