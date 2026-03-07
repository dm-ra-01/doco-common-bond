<!-- audit-slug: 260306-frontend-compliance -->

# Frontend Compliance Audit — Recommendations

**Feature branch:** `audit/260306-frontend-compliance` (in `doco-common-bond`)\
**Standard referenced:** `260306-frontend-standards`

---

## Agent Clarifications (Human-Approved)

| Item                       | Decision                                                                                                                                  |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| Sentry DSNs                | Provided — see CROSS-04. Values go in `.env.local` and CI secrets as `NEXT_PUBLIC_SENTRY_DSN`. Do not hardcode in source files.           |
| `noUncheckedIndexedAccess` | Add the flag **and fix all resulting type errors in the same PR** — do not leave CI broken.                                               |
| Geist font exemption       | **Approved** for `preference-frontend` only. Management apps retain Inter. Update §7.2 of the standards doc.                              |
| Sentry data residency      | EU (Germany) — ingest host is `.ingest.de.sentry.io`. Must be registered in ISMS data processing records. See ISO-01 below.               |
| WF-04 severity             | **Bumped to 🔴 Critical.** Silent auth header omission = potential data exposure in a clinical app. Fix with live auth verification test. |
| Parallel CI                | **Approved (CROSS-05).** Replace single-job `codecov.yml` with parallel multi-job matrix in all three repos.                              |
| GraphQL error contract     | **Approved (CROSS-06).** Audit and normalise `CombinedError` handling across all hook files in all three apps.                            |
| JSDoc enforcement          | **Approved (CROSS-07).** Add `eslint-plugin-jsdoc` rule to all three repos' `eslint.config.mjs`.                                          |
| Renovate Bot               | **Approved (CROSS-08).** Add `renovate.json` config; register Renovate as an ISMS tool in ISO 27001 A.12.6.1. See ISO-02.                 |

---

## 🔴 Critical

### WF-01 — Tailwind v4 Setup in workforce-frontend (Carryover)

`globals.css` in `workforce-frontend` has no `@import "tailwindcss"` directive
and no `@theme {}` block, so no Tailwind utilities are generated. The design
token values also use raw hex rather than HSL custom properties.

- [ ] `workforce-frontend` — Add `@import "tailwindcss";` as the first line of
      `src/app/globals.css`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/app/globals.css`
- [ ] `workforce-frontend` — Convert `:root` token values from raw hex to HSL
      custom properties (e.g. `--brand-primary: 239 84% 67%;`)
- [ ] `workforce-frontend` — Add `@theme {}` block mapping tokens into Tailwind
      (e.g.
      `--font-sans: var(--font-sans); --color-brand-primary: hsl(var(--brand-primary));`)
- [ ] `workforce-frontend` — Move `tailwindcss` and `@tailwindcss/postcss` from
      `devDependencies` to `dependencies` in `package.json` (they are build-time
      CSS processors needed at runtime build)

---

## 🟠 High

### CROSS-01 — tsconfig Baseline Drift (All Three)

All three repos are missing required flags from the §17 baseline. **All type
errors introduced by the new flags must be resolved in the same PR** — do not
leave CI in a broken state.

- [ ] `planner-frontend` — Add flags to `tsconfig.json` compilerOptions, then
      fix all resulting type errors:
      `"noUnusedLocals": true, "noUnusedParameters": true, "noFallthroughCasesInSwitch": true, "noUncheckedIndexedAccess": true, "allowImportingTsExtensions": true`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/tsconfig.json`
- [ ] `workforce-frontend` — Same; fix all resulting type errors
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/tsconfig.json`
- [ ] `preference-frontend` — Same; fix all resulting type errors
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/tsconfig.json`

### CROSS-02 — Build Step Missing from CI (All Three)

`codecov.yml` in all three repos does not run `npm run build`, which is a
required §14.1 merge gate.

- [ ] `planner-frontend` — Add `npm run build` step to
      `.github/workflows/codecov.yml` after the vitest step
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/codecov.yml`
- [ ] `workforce-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/codecov.yml`
- [ ] `preference-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/codecov.yml`

### CROSS-04 — Sentry Not Integrated (All Three)

None of the three apps have `@sentry/nextjs` installed. The `workforce-frontend`
`client.ts` has an explicit `// TODO: Send to Sentry` comment. Standard §15
mandates Sentry with PHI scrubbing across all in-scope frontends.

**Sentry project DSNs** (set as `NEXT_PUBLIC_SENTRY_DSN` in `.env.local` and CI
secrets — never hardcode in source):

| App                   | DSN                                                                                               |
| :-------------------- | :------------------------------------------------------------------------------------------------ |
| `planner-frontend`    | `https://6e22456bfab237ec2bae4f2394aa4f7e@o4511001020923904.ingest.de.sentry.io/4511001027280976` |
| `workforce-frontend`  | `https://364bc1b74593f5e8a64fc91f10ff77a0@o4511001020923904.ingest.de.sentry.io/4511001033769040` |
| `preference-frontend` | `https://4ac538c19b314289827ba5340904dff1@o4511001020923904.ingest.de.sentry.io/4511001032458320` |

> **EU residency:** All DSNs ingest via `.ingest.de.sentry.io` (Germany). Data
> does not leave the EU. See ISO-01 for the required ISMS documentation.

- [ ] `planner-frontend` — Install `@sentry/nextjs`; create
      `sentry.client.config.ts` per §15.1 (`scrubPHI` in `beforeSend`, Console
      integration filtered); create `src/lib/sentry.ts` with `scrubPHI` utility
      and unit test; add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local.example` and CI
      secrets
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/`
- [ ] `workforce-frontend` — Same; remove `TODO` comment from
      `src/lib/graphql/client.ts`; replace `console.error` in `errorExchange`
      with `Sentry.captureException(scrubPHI(error))`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/`
- [ ] `preference-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/`

### WF-02 — Husky Pre-commit & lint-staged Missing in workforce-frontend

`.husky/pre-commit` runs only `npm run lint`. `package.json` has no
`lint-staged` block. Standard §14.2 requires both.

- [ ] `workforce-frontend` — Update `.husky/pre-commit` to run `npx lint-staged`
      (not direct eslint)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.husky/pre-commit`
- [ ] `workforce-frontend` — Add `lint-staged` block to `package.json`:
      `"lint-staged": { "src/**/*.{ts,tsx}": ["eslint --fix", "vitest related --run"] }`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/package.json`

### WF-03 — Missing error.tsx and loading.tsx (workforce-frontend)

No `error.tsx` or `loading.tsx` exists at any route level in workforce-frontend.

- [ ] `workforce-frontend` — Add `src/app/error.tsx` (root route group error
      boundary with reset button and reference ID)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/app/error.tsx`
- [ ] `workforce-frontend` — Add `src/app/loading.tsx` (skeleton matching page
      layout — not a spinner)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/app/loading.tsx`
- [ ] `workforce-frontend` — Add per-route `loading.tsx` to each of
      `locations/`, `team-categories/`, `teams/`, `positions/`

### WF-04 — Non-standard authExchange Pattern (workforce-frontend) 🔴 Critical

`src/lib/graphql/client.ts` uses `addAuthToOperationWithToken` which is not the
standard Urql `@urql/exchange-auth` API. This may silently omit auth headers,
leaving API calls unauthenticated — a data exposure risk in a clinical app.

- [ ] `workforce-frontend` — Rewrite `authExchange` in `client.ts` to use the
      standard `addAuthToOperation` pattern from §6.2 (`appendHeaders`)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/lib/graphql/client.ts`
- [ ] `workforce-frontend` — Add a Vitest integration test that instantiates
      `createUrqlClient()`, fires a mock query, and asserts the `Authorization`
      and `apikey` headers are present on the outgoing request
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/test/`

### PL-01 — Public Sans Typography (planner-frontend, Carryover)

`globals.css` imports Public Sans from Google Fonts; standard §7.1 mandates
Inter for all management apps. This is a known carryover task from
`260306-frontend-standards`.

- [ ] `planner-frontend` — Remove Google Fonts `@import url(...)` for Public
      Sans from `src/app/globals.css`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/globals.css`
- [ ] `planner-frontend` — Add `Inter` via `next/font/google` in `layout.tsx`
      and bind it to `--font-sans` CSS variable (same pattern as
      workforce-frontend `layout.tsx:5-8`)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/layout.tsx`
- [ ] `planner-frontend` — Update `globals.css`
      `@theme { --font-sans: "Inter", ... }` (literal font name, not
      `var(--font-sans)` — see PL-02)

### PR-01 — Geist Font in preference-frontend

**Proposed exemption:** `preference-frontend` is the mobile consumer app. It
uses Geist (a clean, legible sans-serif well-suited to dense mobile interfaces)
and has a deliberately distinct dark-mode design. Since the standard
acknowledges `preference-frontend` has an "extended stack appropriate for its UX
requirements" (§7.2), a font exemption is reasonable — but it must be formally
registered.

**Recommendation:** Approve an exemption for `preference-frontend` to use Geist
in place of Inter, with the rationale documented in the standards doc under
§7.2, and a note added to `preference-frontend/.agents/` context. This avoids
visual regression in a deliberately differentiated app.

- [ ] `common-bond` — Update `docs/engineering/frontend-standards-overview.md`
      §7.2 to list Geist as the approved font for `preference-frontend`
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/frontend-standards-overview.md`

---

## 🟡 Medium

### CROSS-03 — No Playwright/Axe Step in CI (All Three)

Axe accessibility checks are required merge gates (§14.1) but run only locally.

- [ ] `planner-frontend` — Add Playwright/axe E2E job to `codecov.yml`
- [ ] `workforce-frontend` — Same
- [ ] `preference-frontend` — Same

### PL-02 — Circular @theme Reference (planner-frontend)

`globals.css:36` has `@theme { --font-sans: var(--font-sans); }` — this resolves
to the CSS custom property itself, not the font name string. Tailwind can't
process it. Fix is subsumed by PL-01 (switch to Inter), but note the
anti-pattern.

- [ ] Subsumed by PL-01. No separate action required once PL-01 is implemented.

### PL-03 — Authenticated Route Group Needs error.tsx/loading.tsx (planner-frontend)

`src/app/(authenticated)/` sub-route group has no dedicated `error.tsx` or
`loading.tsx`.

- [ ] `planner-frontend` — Add `src/app/(authenticated)/error.tsx`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/(authenticated)/error.tsx`
- [ ] `planner-frontend` — Add `src/app/(authenticated)/loading.tsx` (skeleton)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/(authenticated)/loading.tsx`

### PR-02 — Dual GraphQL/Context Directories (preference-frontend)

`src/gql/` and `src/graphql/` coexist; `src/context/` and `src/providers/`
coexist. Standard §2 defines single directories for each.

- [ ] `preference-frontend` — Consolidate `src/gql/` into `src/graphql/`; update
      import paths
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/`
- [ ] `preference-frontend` — Migrate `src/context/` contents into
      `src/providers/`; update import paths

### PR-03 — Missing error.tsx and loading.tsx (preference-frontend)

No error boundary or loading skeleton at any route level.

- [ ] `preference-frontend` — Add `src/app/error.tsx`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/app/error.tsx`
- [ ] `preference-frontend` — Add `src/app/loading.tsx` (skeleton matching
      mobile layout)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/app/loading.tsx`

---

## 🟠 High (Additional)

### CROSS-05 — No Parallel Multi-Job CI Pipeline (All Three)

All CI runs as one sequential job. A lint failure waits ~90s for Supabase to
boot. Replace with a parallel matrix: `lint-and-type` (no Supabase needed),
`unit-tests`, `build`, and `e2e` (depends on `build`).

- [ ] `planner-frontend` — Rewrite `.github/workflows/codecov.yml` as a
      multi-job workflow with `needs:` dependencies between jobs
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/codecov.yml`
- [ ] `workforce-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/.github/workflows/codecov.yml`
- [ ] `preference-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/.github/workflows/codecov.yml`

### CROSS-06 — GraphQL Error Handling Contract Not Verified (All Three)

§20 defines a strict `CombinedError` handling contract. Hook files have not been
audited against it. Inconsistent handling risks silently swallowed errors or
duplicate Sentry noise.

- [ ] `planner-frontend` — Grep all `useQuery`/`useMutation` hooks for
      `CombinedError` handling; normalise to the §20 pattern (network error →
      retry UI, graphQL error → `Sentry.captureException` + toast, PGRST301 →
      silent authExchange)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/`
- [ ] `workforce-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/`
- [ ] `preference-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/`

---

## 🟡 Medium (Additional)

### CROSS-07 — JSDoc Not Enforced by ESLint (All Three)

§21 mandates JSDoc on exported hooks and service functions. No ESLint rule
enforces this — pre-production is when this habit must be established.

- [ ] `planner-frontend` — Install `eslint-plugin-jsdoc`; add rule
      `jsdoc/require-jsdoc` scoped to exported functions in `src/hooks/` and
      `src/services/` in `eslint.config.mjs`
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/eslint.config.mjs`
- [ ] `workforce-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/eslint.config.mjs`
- [ ] `preference-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/eslint.config.mjs`

### CROSS-08 — No Automated Dependency Governance (All Three)

§18 relies on a manual monthly `npm outdated` cadence. Renovate Bot provides
automated grouped PRs for minor/patch updates and security patches. Aligns with
ISO 27001 A.12.6.1. See ISO-02.

- [ ] `planner-frontend` — Add `renovate.json` to repo root with grouped
      minor/patch updates and major-version hold (requires Engineering Lead
      approval per §18)
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/renovate.json`
- [ ] `workforce-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/renovate.json`
- [ ] `preference-frontend` — Same
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/renovate.json`

### PR-04 — preference-frontend: lint-staged Missing

`.husky/pre-commit` runs tests directly rather than via `lint-staged`.

- [ ] `preference-frontend` — Add `lint-staged` block to `package.json`:
      `"lint-staged": { "src/**/*.{ts,tsx}": ["eslint --fix", "vitest related --run"] }`

### ISO-01 — Sentry Not Registered as Data Processor in ISMS

Sentry is a third-party service receiving error telemetry from all three
frontends, storing data in Germany. Requires ISMS registration.

- [ ] `common-bond` — Add Sentry to the ISMS data processing register (supplier
      name, data categories, storage region: EU/Germany, PHI scrubbing:
      confirmed via `beforeSend`)
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/`

### ISO-02 — Renovate Bot Not Registered as Development Tooling in ISMS

Renovate Bot will have read access to dependency files and write access to raise
PRs on all three frontend repos. Under ISO 27001 A.12.6.1 (Technical
Vulnerability Management) it should be documented as an approved development
tool with its access scope declared.

- [ ] `common-bond` — Add Renovate Bot to ISMS operations documentation; note
      access scope (read package.json, raise PRs) and approval by Engineering
      Lead
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/iso27001/`

---

## Proposed Exemption: Geist Font for preference-frontend

| Field         | Value                                                                                                                                                                                                                                                                                                                                                        |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**       | `preference-frontend`                                                                                                                                                                                                                                                                                                                                        |
| **Standard**  | §7.1 (Inter for all management apps)                                                                                                                                                                                                                                                                                                                         |
| **Exemption** | Use Geist Sans / Geist Mono in place of Inter                                                                                                                                                                                                                                                                                                                |
| **Rationale** | `preference-frontend` is a mobile-first consumer app with a deliberately dark, immersive aesthetic distinct from management apps. Geist is optimised for high-density reading on small screens. Changing to Inter would require a significant design rework with no functional benefit since workers never use this app alongside the management interfaces. |
| **Condition** | Exemption must be documented in §7.2 of the standards document and referenced in `.agents/` repo context.                                                                                                                                                                                                                                                    |

---

## Implementation Order

| Phase | Priority | Finding IDs                             | Note                                         |
| :---- | :------- | :-------------------------------------- | :------------------------------------------- |
| 1     | 🔴 Crit  | WF-01, WF-04                            | Tailwind v4 + auth fix — critical blockers   |
| 2     | 🟠 High  | PL-01, PR-01 (exemption first)          | Typography — finalise Inter migration        |
| 3     | 🟠 High  | WF-02, WF-03                            | Workforce quality gates & error boundaries   |
| 4     | 🟠 High  | CROSS-01, CROSS-02, CROSS-04            | tsconfig, CI build, Sentry (all repos)       |
| 5     | 🟠 High  | CROSS-05, CROSS-06                      | Parallel CI pipeline; GraphQL error contract |
| 6     | 🟡 Med   | PL-03, PR-02, PR-03, CROSS-03, CROSS-07 | Boundaries; dir cleanup; E2E CI; JSDoc lint  |
| 7     | 🟡 Med   | CROSS-08                                | Renovate Bot setup (all repos)               |
| 8     | 🟢 Low   | PR-04, ISO-01, ISO-02                   | lint-staged; ISMS registrations              |
