---
title: Testing Efficiency & Modularity Audit
sidebar_position: 1
---

# Testing Efficiency & Modularity Ecosystem Audit

**Date:** 2026-03-11\
**Scope:** `backend/receptor-planner`, `backend/match-backend`,
`frontend/planner-frontend`, `frontend/workforce-frontend`,
`frontend/preference-frontend`, `supabase-receptor` (pgTAP + Edge Functions)\
**Auditor:** Ryan Ammendolea\
**Standard:** CI/CD best practices — unit-test isolation, mock boundaries,
fast-feedback loops

---

## Executive Summary

This audit identifies 9 findings across all six in-scope repositories. The
primary concern is that CI/CD pipelines are degraded by a structural confusion
between **unit** tests (which must be DB-free and fast) and **integration/E2E**
tests (which legitimately require Supabase). All three Next.js frontends boot a
full Supabase instance inside their `unit-tests` CI job despite having a Vitest
workspace already configured to separate the two tiers. `match-backend` has no
CI pipeline at all. Edge function test coverage is effectively zero — one
fixture file exists but issues no real assertions against the function handler.
`supabase-receptor`'s pgTAP suite has no CI gate.

| Repository / Area               | Coverage  | Issues Found | Overall |
| ------------------------------- | --------- | ------------ | ------- |
| `planner-frontend` (Next.js)    | ⚠️ Hybrid | 2            | ⚠️      |
| `workforce-frontend` (Next.js)  | ⚠️ Hybrid | 2            | ⚠️      |
| `preference-frontend` (Next.js) | ⚠️ Hybrid | 2            | ⚠️      |
| `backend/receptor-planner`      | ✅ Good   | 1            | ✅      |
| `backend/match-backend`         | ❌ None   | 3            | ❌      |
| `supabase-receptor` (pgTAP)     | ⚠️ Local  | 2            | ⚠️      |
| `supabase-receptor` (Functions) | ❌ None   | 1            | ❌      |

Severity breakdown: 🟠 High: 3 · 🟡 Medium: 5 · 🟢 Low: 1

---

## 1. Next.js Frontends (planner-frontend, workforce-frontend, preference-frontend)

### 1.1 Hybrid Unit Test Jobs — Supabase Boots Unnecessarily

**Strengths:**

- All three repos have adopted `vitest.workspace.ts` with a proper `unit`
  project (parallelised, `*.unit.test.*`) and `integration` project (sequential,
  `*.test.*`).
- The workspace split correctly separates logic-only, millisecond tests from
  DB-dependent ones at the Vitest level.
- MSW is configured in conftest/setup for mocking GraphQL/network calls in truly
  isolated tests.
- RLS tests (`RLS.test.ts`) correctly use `describe.skipIf(!hasLiveSupabase)` to
  gate live-DB execution.

**Gaps:**

- **NEXT-01** [`planner-frontend/.github/workflows/ci.yml` L54–L68, L79–L81] The
  `unit-tests` CI job checks out `supabase-receptor`, installs Supabase CLI, and
  runs `supabase start --workdir supabase-backend/supabase-ci` **before**
  running the Vitest suite. This means every PR waits for a complete Supabase
  boot (~60–120 s) even for tests that do not require a database. The workspace
  split at the Vitest level is rendered moot by the CI job boundary: Vitest runs
  all tests (unit + integration) in a single `npm run test:coverage` invocation
  inside the same Supabase-dependent job.

- **NEXT-02** [`workforce-frontend/.github/workflows/ci.yml` L44–L66,
  `preference-frontend/.github/workflows/ci.yml` L44–L69] Identical pattern to
  NEXT-01. All three frontends share the same CI job template — the `unit-tests`
  job spins up Supabase across all three repos for every pull request. Because
  the jobs run in parallel, three independent Supabase-start sequences run
  simultaneously per PR, tripling the infrastructure cost.

### 1.2 Missing Pure-Unit CI Job (No Supabase)

**Gaps:**

- **NEXT-03** [Cross-cutting, all three frontend `ci.yml` files] No CI job
  exists that runs only `*.unit.test.*` files without booting Supabase. The
  Vitest workspace is configured correctly for the `unit` sub-project to run in
  isolation (`include: ['src/**/*.unit.test.{ts,tsx}']`) but no CI job invokes
  only that named project (e.g., `vitest --project unit`). A standalone DB-free
  job would give developers sub-30-second feedback on logic regressions without
  any infrastructure dependency.

---

## 2. Backend / Python — receptor-planner

### 2.1 Reference Implementation

**Strengths:**

- `tests/` is structured into `unit/`, `integration/`, and `e2e/` subdirectories
  — matching the canonical pattern from the Python Testing Standards KI.
- `conftest.py` (root-level) mocks `SupabaseService.create_client` via
  `unittest.mock.patch` as an `autouse` fixture, so every test is DB-isolated by
  default unless explicitly overridden.
- Environment variables are injected via `monkeypatch` — no `.env` file read
  required in CI.
- `pytest.ini` enforces `--cov-fail-under=95`, providing a meaningful coverage
  floor.
- The single CI workflow (`ci.yml`) passes stub Supabase env vars and runs all
  tests without any Docker or Supabase CLI step.

**Gaps:**

- **PL-01** [`receptor-planner/.github/workflows/ci.yml` L19] Python version
  pinned to `3.9` but `pyproject.toml` declares `requires-python = ">=3.11"`.
  Mismatched runtimes can mask deprecation warnings or compatibility regressions
  in CI that only appear in production (3.11+). Note: this is a minor hygiene
  issue surfaced as a scope-adjacent finding.

---

## 3. Backend / Python — match-backend

### 3.1 No CI Pipeline

**Gaps:**

- **MB-01** [`match-backend/` — no `.github/workflows/` directory]
  `match-backend` has no CI workflow file. Tests are never run automatically on
  push or pull request. Any regression in the allocator core is invisible until
  manual testing or a downstream system fails.

### 3.2 Flat Test Structure (Unit + Integration Combined)

**Gaps:**

- **MB-02** [`match-backend/allocator/tests/` — directory listing] All tests
  reside in a single, flat directory with no `unit/`, `integration/`, or `e2e/`
  subdirectories. The directory contains `test_solver.py`, `test_models.py`, and
  `test_preferences.py` (logic-only tests that run in under 5 seconds) alongside
  `test_supabase_integration.py` (a full end-to-end test that populates a live
  Supabase instance, solves, and writes back allocations). Running `pytest`
  picks up all files indiscriminately, meaning every local test run requires a
  live Supabase environment.

### 3.3 Live Supabase Required for Integration Test — No Skip Guard

**Gaps:**

- **MB-03** [`allocator/tests/test_supabase_integration.py` L14–L29]
  `test_supabase_end_to_end_integration` calls
  `get_supabase_client(role="service_role")` and then
  `supabase_populator.populate()` unconditionally. There is no
  `pytest.mark.skipif`, `importorskip`, or env-var guard to skip the test when a
  live Supabase instance is unavailable. This prevents any developer without a
  running Supabase from executing even the unit-level tests (since `pytest`
  collects and runs all files). The `conftest.py` does monkeypatch env vars, but
  the test directly instantiates a real client and calls a live endpoint.

---

## 4. Supabase Receptor — pgTAP Database Tests

### 4.1 No CI Gate for Database Tests

**Gaps:**

- **DB-01** [`supabase-receptor/supabase/tests/database/` — 18 test files; no
  `.github/workflows/` directory in `supabase-receptor`] The pgTAP suite (18
  files covering structural, referential, functional, security, performance, and
  quality concerns) is run locally via `npx supabase test db` but there is no CI
  workflow in the `supabase-receptor` repository to run it automatically on push
  or pull request. A schema migration could break validated RLS logic, trigger
  transitions, or delegation constraints with no automated detection.

### 4.2 Security Test Coverage Gap

**Gaps:**

- **DB-02** [`supabase/tests/database/11_security_policies.test.sql` — 572
  bytes] The security policies test file is the smallest test file in the suite
  at 572 bytes. The `37_functional_rls_advanced.test.sql` (11 712 bytes)
  provides substantial RLS coverage, but `11_security_policies.test.sql` appears
  to be a near-stub. Given the RLS-first security posture of the ecosystem, this
  file warrants expansion to serve as an explicit, policy-level truth matrix
  rather than delegating all RLS coverage to the functional test files.

---

## 5. Supabase Receptor — Edge Functions

### 5.1 Placeholder-Only Function Tests

**Gaps:**

- **EF-01** [`supabase/functions/planner-orchestration/index.test.ts` — the only
  edge function test file in the repo] The file contains 3 `Deno.test` blocks,
  none of which import or invoke the actual function handler from `index.ts`.
  The tests assert on input fixture data only (e.g.,
  `assertEquals(req.method, "OPTIONS")` and
  `assertEquals(typeof payload.allocation_run_id, "string")`). The comment on
  L14–L16 explicitly notes the handler must be refactored to export a named
  function before it can be tested. Five other edge functions (`auth`,
  `force-refresh-on-role-change`, `invalidate-session`, `match-orchestrator`)
  have zero test files.

---

## 6. Cross-Cutting Observations

**6.1 Unit / Integration Boundary Definition is Missing from CI Contracts**

No CI workflow in the ecosystem includes a comment or step name that formally
defines the contract for the `unit-tests` job (i.e., "this job MUST pass with no
external services"). The workforce-frontend and planner-frontend `ci.yml` files
label the job `Unit Tests (mocked Supabase)` but then immediately start
Supabase. This creates ambiguity for new contributors and implementation agents.

**6.2 `receptor-planner` is the Reference Implementation for Python Testing**

`receptor-planner` is the only backend service with a proper `unit/`,
`integration/`, `e2e/` folder split, a fully mocked conftest, CI running without
Supabase, and coverage enforcement. It should be adopted as the canonical
pattern for `match-backend`.

**6.3 Frontend `vitest --project unit` as the DB-Free CI Command**

Vitest workspaces allow targeting a named project:
`npx vitest run --project unit`. This command exists today and would run only
`.unit.test.*` files without Supabase — it is simply not used in any CI job.

---

## Severity Summary

| Finding ID | Repository / Area                                               | File                                                             | Category          | Severity  |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------- | --------- |
| NEXT-01    | `planner-frontend`, `workforce-frontend`, `preference-frontend` | `.github/workflows/ci.yml` (unit-tests job)                      | Test Isolation    | 🟠 High   |
| NEXT-02    | All three Next.js frontends                                     | `.github/workflows/ci.yml` (parallel Supabase boots)             | CI Performance    | 🟠 High   |
| MB-01      | `match-backend`                                                 | No `.github/workflows/` directory                                | Process Gap       | 🟠 High   |
| NEXT-03    | All three Next.js frontends                                     | `.github/workflows/ci.yml` (no standalone unit job)              | CI Structure      | 🟡 Medium |
| MB-02      | `match-backend`                                                 | `allocator/tests/` (flat structure)                              | Test Organization | 🟡 Medium |
| MB-03      | `match-backend`                                                 | `allocator/tests/test_supabase_integration.py` L14–L29           | Test Isolation    | 🟡 Medium |
| DB-01      | `supabase-receptor`                                             | No `.github/workflows/` directory                                | Process Gap       | 🟡 Medium |
| EF-01      | `supabase-receptor` (Edge Functions)                            | `supabase/functions/planner-orchestration/index.test.ts` L14–L16 | Test Coverage     | 🟡 Medium |
| DB-02      | `supabase-receptor`                                             | `supabase/tests/database/11_security_policies.test.sql`          | Test Coverage     | 🟢 Low    |
| PL-01      | `receptor-planner`                                              | `.github/workflows/ci.yml` L19 vs `pyproject.toml`               | Hygiene           | 🟢 Low    |
