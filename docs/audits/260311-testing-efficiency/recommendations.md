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


---

## 🟠 High

### NEXT-01: All three Next.js frontend CI pipelines boot a full Supabase instance inside the unit-tests job. The Vitest workspace co

Affects: `planner-frontend, workforce-frontend, preference-frontend` — CI unit-tests job


- [ ] Split the planner-frontend ci.yml unit-tests job into two jobs: (1) a DB-free 'unit-tests' job that runs `npx vitest run --project unit` with stub env vars and no Supabase step, and (2) an 'integration-tests' job that keeps the existing Supabase-start pattern and runs `npx vitest run --project integration`.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`
- [ ] Apply the same CI split to workforce-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/ci.yml`
- [ ] Apply the same CI split to preference-frontend ci.yml.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/ci.yml`

### NEXT-02: All three frontend unit-tests CI jobs run in parallel on every PR, each booting an independent Supabase instance. This t

Affects: `planner-frontend, workforce-frontend, preference-frontend` — CI parallel Supabase boots


- [ ] Verify after the NEXT-01 CI split is applied that the new DB-free unit-tests job in all three frontends contains no Supabase CLI steps, reducing parallel Supabase starts from 3 to 0 for the unit tier.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`

### MB-01: match-backend has no .github/workflows/ directory. Tests are never run automatically on push or pull request. The alloca

Affects: `match-backend` — CI pipeline


- [ ] Create .github/workflows/ci.yml for match-backend. The unit job runs pytest targeting only the unit-tier test files (test_solver.py, test_models.py, test_preferences.py, test_api.py, test_service.py) with stub Supabase env vars and no Docker step.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/.github/workflows/ci.yml`

## 🟡 Medium

### NEXT-03: No CI job exists that invokes only the Vitest unit project (npx vitest run --project unit) independently of the integrat

Affects: `planner-frontend, workforce-frontend, preference-frontend` — CI unit job contract


- [ ] As part of the NEXT-01 split, ensure the new unit-tests job script uses `npx vitest run --project unit` (not `npm run test:coverage`) so only *.unit.test.* files execute. Document the contract in the job step name: 'Run unit tests (DB-free)'.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ci.yml`

### MB-02: All match-backend tests reside in a flat directory with no unit/, integration/, or e2e/ subdirectories. Logic-only tests

Affects: `match-backend` — allocator/tests/


- [ ] Restructure allocator/tests/ to match the receptor-planner pattern: create unit/, integration/, and e2e/ subdirectories. Move test_solver.py, test_models.py, test_preferences.py, test_excel_ingestion.py, test_api.py, test_service.py to unit/. Move test_supabase_integration.py to integration/. Update pyproject.toml testpaths accordingly.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/allocator/tests/`

### MB-03: test_supabase_end_to_end_integration calls get_supabase_client() and supabase_populator.populate() unconditionally on L1

Affects: `match-backend` — allocator/tests/test_supabase_integration.py


- [ ] Add a session-scoped skip guard: `pytest.mark.skipif(not os.getenv('SUPABASE_URL') or 'test.com' in os.getenv('SUPABASE_URL',''), reason='Live Supabase required')`. This mirrors the describe.skipIf(!hasLiveSupabase) pattern used in planner-frontend/src/test/security/RLS.test.ts.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/allocator/tests/test_supabase_integration.py`

### DB-01: supabase-receptor has 18 pgTAP database test files covering structural, referential, functional, security, performance, 

Affects: `supabase-receptor` — pgTAP test suite


- [ ] Create .github/workflows/ci.yml in supabase-receptor. Add a 'database-tests' job that checks out the repo, installs Supabase CLI, runs `supabase start --ignore-health-check`, then `supabase test db`.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.github/workflows/ci.yml`

### EF-01: The only edge function test file (supabase/functions/planner-orchestration/index.test.ts) contains 3 placeholder Deno.te

Affects: `supabase-receptor` — Edge Functions


- [ ] Refactor planner-orchestration/index.ts to export a named `handler(req: Request): Promise<Response>` function instead of using an anonymous Deno.serve callback. This enables the existing test file to actually invoke the handler.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/functions/planner-orchestration/index.ts`
- [ ] Rewrite planner-orchestration/index.test.ts to import and invoke the exported handler with mocked Request objects, covering: CORS preflight -> 200, missing Authorization -> 401, valid payload -> handler proceeds past auth gate.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/functions/planner-orchestration/index.test.ts`
- [ ] Add minimal smoke-test files for auth, invalidate-session, and force-refresh-on-role-change edge functions, testing at minimum: missing auth header -> 401, valid structure -> handler doesn't throw.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/functions/auth/`

## 🟢 Low

### DB-02: supabase/tests/database/11_security_policies.test.sql is the smallest file in the database test suite at 572 bytes. The 

Affects: `supabase-receptor` — pgTAP security suite


- [ ] Expand 11_security_policies.test.sql to serve as an explicit RLS truth matrix for all tables. Each table should have at least one row verifying: anon sees 0 rows, authenticated non-member sees 0 rows, authenticated member sees expected rows.
      `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/tests/database/11_security_policies.test.sql`

### PL-01: receptor-planner/.github/workflows/ci.yml pins Python to 3.9 (L19) but pyproject.toml declares requires-python = '>=3.11

Affects: `receptor-planner` — CI Python version


- [ ] Update receptor-planner CI yml python-version to '3.11' (or '3.12') to align with the pyproject.toml requires-python constraint.
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.github/workflows/ci.yml`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | NEXT-01, NEXT-02, NEXT-03, MB-01 | Highest leverage: splits CI unit-test jobs to be DB-free across all three Next.js frontends and creates the missing CI pipeline for match-backend. Directly reduces PR tail latency. |
| 2 | MB-02, MB-03 | Restructures match-backend test directory and adds skip guards so unit-level tests can run without a live Supabase instance. Unblocks contributors and enables the CI pipeline created in Phase 1. |
| 3 | DB-01, EF-01 | Adds CI gate for supabase-receptor pgTAP tests and converts placeholder edge function tests to real assertions. Both require a live Supabase so belong in the integration tier of CI. |
| 4 | DB-02, PL-01 | Coverage and hygiene improvements that are lower priority but improve long-term maintainability. Safe to batch as a single small PR per repo. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| NEXT-01 | CI unit-tests job | `ci.yml` | Test Isolation | 🟠 High |
| NEXT-02 | CI parallel Supabase boots | `ci.yml` | CI Performance | 🟠 High |
| MB-01 | CI pipeline | `ci.yml` | Process Gap | 🟠 High |
| NEXT-03 | CI unit job contract | `ci.yml` | CI Structure | 🟡 Medium |
| MB-02 | allocator/tests/ | `tests` | Test Organization | 🟡 Medium |
| MB-03 | allocator/tests/test_supabase_integration.py | `test_supabase_integration.py` | Test Isolation | 🟡 Medium |
| DB-01 | pgTAP test suite | `ci.yml` | Process Gap | 🟡 Medium |
| EF-01 | Edge Functions | `index.ts` | Test Coverage | 🟡 Medium |
| DB-02 | pgTAP security suite | `11_security_policies.test.sql` | Test Coverage | 🟢 Low |
| PL-01 | CI Python version | `ci.yml` | Hygiene | 🟢 Low |

