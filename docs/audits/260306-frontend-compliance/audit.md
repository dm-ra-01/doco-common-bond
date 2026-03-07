---
title: Frontend Compliance Audit
sidebar_label: Audit
---

# Frontend Compliance Audit

**Date:** 2026-03-06\
**Scope:** `planner-frontend`, `workforce-frontend`, `preference-frontend`\
**Auditor:** Ryan Ammendolea\
**Standard:**
[Frontend Engineering Standards](../../engineering/frontend-standards-overview.md)
(`260306-frontend-standards`)

---

## Executive Summary

All three in-scope frontends demonstrate strong foundational compliance with the
ecosystem architecture: Next.js 16+, Urql 5 + Graphcache, `@graphql-codegen`,
Vitest workspace, Playwright, and Husky are present across all repos. The audit
identified 31 findings across 10 implementation phases, ranging from three 🔴
Critical security/privacy issues to process quality improvements. Primary gap
areas: (a) two carryover typography and Tailwind v4 items, (b) shared tsconfig
baseline drift, (c) missing route-level error/loading boundaries, and (d) a
significant unlayered security surface across all three apps (no CSP headers, no
env variable validation, no server-side session gate in two apps).

| Repository            | Coverage | Issues Found | Overall |
| :-------------------- | :------- | :----------- | :------ |
| `planner-frontend`    | ✅ Good  | 19           | 🟠 High |
| `workforce-frontend`  | ⚠️ Fair  | 20           | 🔴 Crit |
| `preference-frontend` | ⚠️ Fair  | 18           | 🟠 High |

---

## 1. planner-frontend

### 1.1 Technology Stack & Dependencies

**Strengths:**

- Next.js `16.1.5`, React `19.2.3`, Urql `5.x`, `@urql/exchange-graphcache ^9`,
  Vitest `4.x`, Playwright `^1.58` — all at standard versions.
- `@graphql-codegen` client-preset present; `codegen.ts` in root.
- `tailwindcss ^4`, `@tailwindcss/postcss ^4` in deps — correct v4 packages.
- `vitest-axe`, `@axe-core/playwright` present.
- `husky ^9`, `lint-staged` in `package.json` with correct pattern
  (`src/**/*.{ts,tsx}`).

**Gaps:**

- `src/app/globals.css:1` — imports `Public Sans` from Google Fonts;
  `--font-sans` is set to `"Public Sans"` across `:root` and `@theme`. Standard
  §7.1 mandates **Inter** for management apps. (Carryover task.)
- `src/app/globals.css:36` — `@theme { --font-sans: var(--font-sans); }` creates
  a circular self-reference — the Tailwind token resolves to the CSS custom
  property rather than the literal font name.

### 1.2 TypeScript Configuration

**Gaps:**

- `tsconfig.json` is missing four flags from the §17 baseline: `noUnusedLocals`,
  `noUnusedParameters`, `noFallthroughCasesInSwitch`,
  `noUncheckedIndexedAccess`. `allowImportingTsExtensions` is also absent.

### 1.3 CI / Quality Gates

**Strengths:**

- `.github/workflows/codecov.yml` runs `npm run lint` + `npx tsc --noEmit` +
  `npm run test:coverage` — lint, type-check, and unit tests all present.
- `.husky/pre-commit` runs `npm run lint`, `npx tsc --noEmit`,
  `npm run test:coverage`.

**Gaps:**

- CI workflow runs `npm run test:coverage` but **not** `npm run build` — build
  step §14.1 is required.
- No axe/Playwright E2E job in CI (covered only by local `test:e2e` script).

### 1.4 Error & Loading Boundaries

**Strengths:**

- `src/app/error.tsx` exists at root route level.
- `src/app/not-found.tsx` present.

**Gaps:**

- `src/app/(authenticated)/` sub-route group — no dedicated `loading.tsx` or
  `error.tsx` inspected.

---

## 2. workforce-frontend

### 2.1 Technology Stack & Dependencies

**Strengths:**

- Next.js `16.1.5`, React `19.2.3`, Urql packages, `@graphql-codegen`, Vitest,
  Playwright — all at standard versions.
- `react-hook-form ^7`, `zod ^4`, `lucide-react ^0.563`, `date-fns ^4` —
  approved libraries.
- `vitest-axe ^0.1.0` present.
- Husky present (`husky ^9`).

**Gaps:**

- `tailwindcss ^4` and `@tailwindcss/postcss ^4` are in **devDependencies only**
  — Tailwind v4 is correct but for a CSS build tool this location is valid;
  however `globals.css` has **no `@import "tailwindcss"`** directive (line 1 is
  `:root {`). Without the import, no Tailwind utilities are generated. Tailwind
  v4 requires the `@import "tailwindcss"` directive. (Carryover task.)
- `globals.css` uses raw hex values (`#ffffff`, `#0f172a`) for design tokens —
  standard §7.1 requires HSL CSS custom properties to enable opacity modifiers
  and design token composability.
- No `@theme {}` block in `globals.css` — Tailwind v4 design tokens are not
  registered.
- `layout.tsx:2` imports `Inter` from `next/font/google` and applies it as
  `inter.variable` on `<body>` — font is correct (Inter) but applied as a class
  variable without a corresponding `@theme --font-sans` binding, so Tailwind
  utilities won't resolve it.

### 2.2 TypeScript Configuration

**Gaps:**

- Same as planner: `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`,
  `allowImportingTsExtensions` absent from `tsconfig.json`.

### 2.3 CI / Quality Gates

**Strengths:**

- `codecov.yml` workflow runs lint + type-check + vitest.

**Gaps:**

- `.husky/pre-commit` runs **only** `npm run lint` — missing `npx tsc --noEmit`
  and `npm run test`. Standard §14.2 requires lint + vitest related.
- `package.json` has **no `lint-staged` block** — §14.2 mandates `lint-staged`
  scoped to `src/**/*.{ts,tsx}`.
- CI missing `npm run build` step.
- No axe/Playwright E2E job in CI.

### 2.4 Error & Loading Boundaries

**Gaps:**

- `src/app/` — no `error.tsx` found anywhere in workforce-frontend `src/`.
  Standard §10 requires `error.tsx` at every major route group.
- `src/app/` — no `loading.tsx` found anywhere. Standard §19.1 requires
  `loading.tsx` at every route group.

### 2.5 Sentry / PHI Handling

**Gaps:**

- `src/lib/graphql/client.ts:200-204` — `errorExchange` contains
  `console.error('[GraphQL Error]', error)` and a `// TODO: Send to Sentry`
  comment. Sentry is not installed (`package.json` has no `@sentry/nextjs`).
  Standard §15 mandates Sentry integration with PHI scrubbing across all
  in-scope apps.

### 2.6 Auth Exchange Pattern

**Gaps:**

- `src/lib/graphql/client.ts` uses a non-standard `addAuthToOperationWithToken`
  method. The standard Urql `authExchange` API uses `addAuthToOperation`. The
  implemented pattern may silently fail to attach auth headers — unauthenticated
  API calls in a clinical app are a data exposure risk. **Severity: 🔴
  Critical.**

---

## 3. preference-frontend

### 3.1 Technology Stack & Dependencies

**Strengths:**

- Next.js `^16.1.5`, Urql `^5`, `@urql/exchange-graphcache ^9`, Tailwind v4
  packages, Vitest `^4`, Playwright, `vitest-axe`, Husky.
- Extended mobile stack present: Radix UI, `class-variance-authority`,
  `tailwind-merge`, `framer-motion`, `zustand ^5`, `react-hook-form`, `zod`,
  `@dnd-kit/*`, `@tanstack/react-table` — all permitted.
- `tailwindcss ^4` + `@tailwindcss/postcss ^4` in devDependencies;
  `globals.css:1` has `@import "tailwindcss"` — Tailwind v4 import present.
- `@theme inline {}` block present in `globals.css`.

**Gaps:**

- `globals.css:9` — `--font-sans: var(--font-geist-sans)` and `layout.tsx:2`
  imports `Geist` + `Geist_Mono` fonts. Standard §7.1 mandates **Inter**
  ecosystem-wide. Geist is an unapproved font.
- `package.json` — no `lint-staged` block present.

### 3.2 TypeScript Configuration

**Gaps:**

- Same as planner/workforce: `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`,
  `allowImportingTsExtensions` absent.

### 3.3 CI / Quality Gates

**Strengths:**

- `codecov.yml` same as other repos with lint + tsc + vitest.

**Gaps:**

- `.husky/pre-commit:1-3` — runs `npm run lint`, `npx tsc --noEmit`,
  `npm run test:coverage` but **no `lint-staged`**. The pre-commit hook runs the
  full test suite rather than the scoped `vitest related --run`.
- CI missing `npm run build` step.
- No axe/Playwright E2E job in CI.

### 3.4 Error & Loading Boundaries

**Gaps:**

- No `error.tsx` found in `src/` — standard §10 requires `error.tsx` at every
  major route group.
- No `loading.tsx` found in `src/` — standard §19.1 requires `loading.tsx` at
  route groups.

### 3.5 Structure Deviation

**Gaps:**

- `src/gql/` directory exists alongside `src/graphql/` — standard §2 defines a
  single `src/graphql/operations.ts` SSOT. Dual directories suggest unmigrated
  code.
- `src/context/` directory exists alongside `src/providers/` — standard §2 uses
  `providers/` only.
- `src/store/` directory (Zustand) — permitted, but standard §6.6 specifies
  Zustand must only manage local/draft state.

---

## 4. Cross-Cutting Observations

### 4.1 tsconfig Baseline Drift (All Three)

All three `tsconfig.json` files are missing the following §17 required flags:
`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
`noUncheckedIndexedAccess`, and `allowImportingTsExtensions`. The baseline was
standardised in `260306-frontend-standards` but has not yet been applied to the
repos.

### 4.2 No Build Step in CI (All Three)

None of the three `codecov.yml` workflows includes a `npm run build` step.
Standard §14.1 lists build as a required CI check that blocks merge.

### 4.3 No Playwright/Axe CI Step (All Three)

Playwright E2E and axe accessibility checks exist as local scripts but are
absent from CI. Standard §14.1 lists axe accessibility as a required merge gate.

### 4.4 Sentry Missing (All Three)

`workforce-frontend` and `preference-frontend` have no `@sentry/nextjs` in
`package.json`. `planner-frontend` references Sentry in `client.ts` comments but
also has no `@sentry/nextjs` in deps.

### 4.5 No Parallel Multi-Job CI Pipeline (All Three)

All three `codecov.yml` workflows run as a single sequential job: install → lint
→ tsc → Supabase boot → test. A lint failure stalls until after the Supabase
boot completes (~60–90s). There is no parallel job matrix. Splitting into
parallel jobs (`lint-and-type`, `unit-tests`, `build`, `e2e`) would give faster,
more specific failure signals and is the standard for production CI pipelines.

### 4.6 GraphQL Error Handling Contract Not Verified (All Three)

§20 defines an explicit CombinedError handling contract (network error → retry
UI; graphQL error → Sentry + toast; PGRST301 → silent authExchange). The audit
did not inspect hook implementations against this contract. Hooks across all
three frontends may be inconsistently handling or swallowing errors.

### 4.7 JSDoc Enforcement Not Automated (All Three)

§21 mandates JSDoc one-liners on all exported hooks and service functions. No
ESLint rule enforces this — compliance is entirely on developer discipline.
There is no automated check that a new exported hook lacks a doc comment.

### 4.8 No Automated Dependency Governance (All Three)

§18 specifies a monthly manual `npm outdated` cadence. No Renovate Bot or
Dependabot configuration exists in any of the three repos. Without automation,
security patches are discovered reactively. Under ISO 27001 A.12.6.1 (Management
of technical vulnerabilities), automated patch tracking is a recommended
control.

### 4.9 No Type-Safe Environment Variable Validation (All Three)

All three apps access env vars via raw `process.env.NEXT_PUBLIC_*` strings. A
missing or misnamed variable silently becomes `undefined` at runtime. There is
no Zod-validated env schema to fail the build on misconfiguration.

### 4.10 No Content-Security-Policy or Security Headers (All Three)

No `next.config.ts` in any of the three repos sets a `Content-Security-Policy`
or other security headers (`X-Frame-Options`, `X-Content-Type-Options`,
`Strict-Transport-Security`, `Referrer-Policy`). Under ISO 27001 A.14.2,
technical security controls must be built into the software development process.
A CSP is the primary defence against XSS for Next.js SPAs.

### 4.11 GraphQL Codegen Drift — No CI Gate (All Three)

`@graphql-codegen` is run manually. A schema change in `supabase-receptor`
(e.g., new column, renamed type) silently renders the frontend's generated types
stale until a developer runs `codegen` locally. No CI step verifies that
committed generated types match the current schema.

### 4.12 Playwright Global Auth Setup (Workforce, Preference)

**`planner-frontend`** has a fully compliant §5.6 implementation:
`globalSetup: './e2e/global-setup.ts'` + `storageState: '.auth/user.json'` in
both project definitions. This is the **reference implementation** for the other
two apps.

**`workforce-frontend`** and **`preference-frontend`** both have `storageState`
set on their Playwright projects and a `setup` project dependency — but neither
has an explicit `globalSetup:` key in `playwright.config.ts`. Authentication is
handled via the setup project but without a dedicated global setup file, making
the auth lifecycle less explicit and harder to extend (e.g., for multiple
roles).

### 4.13 No Server-Side Session Check in Authenticated Layouts (Workforce, Preference)

**`planner-frontend`** correctly implements §12.3: `layout.tsx` is an `async`
Server Component that calls `supabase.auth.getUser()` before rendering. This
prevents flash-of-unauthenticated-content and ensures middleware-level redirect
is backed by a server check.

**`workforce-frontend`** and **`preference-frontend`** use client-side
`AuthProvider` context only. Users may briefly see protected content before the
client hydrates and discovers the session is absent.

### 4.14 `no-console` Not Enforced by ESLint (All Three)

No ESLint `no-console` rule exists. `console.log` and `console.error` calls
throughout the codebase risk exposing PHI — patient-adjacent data, worker IDs,
or session artefacts — in browser DevTools on shared or kiosk machines.

### 4.15 Server Actions Not Validated with Zod (planner-frontend)

`planner-frontend` has `src/app/actions/` containing Server Actions that accept
raw `FormData` or object arguments from the client. No Zod `parse()` call gates
the entry point of any action. An invalid or malicious payload shape can cause
unhandled exceptions or corrupt state.

### 4.16 `vitest-axe` Installed but Usage Unverified (All Three)

`vitest-axe` is listed as a dev dependency across all three repos, but the audit
did not find any test files containing `axe()` calls or `toHaveNoViolations()`
assertions. Installed-but-unused accessibility tooling creates false compliance
confidence.

### 4.17 Graphcache IndexedDB PHI Retention — 7-Day maxAge (workforce-frontend)

`src/lib/graphql/client.ts:16-21` configures `makeDefaultStorage` with
`maxAge: 7` (7 days). Clinical workforce data (org hierarchy, positions, worker
assignments) persists in the browser's IndexedDB for 7 days after the session
ends. On shared or borrowed devices this constitutes an uncontrolled PHI
retention window. **Decision: reduce to session-lifetime; update ISO 27001.**

### 4.18 `@next/next/no-img-element` Suppression Risk (All Three)

The Next.js ESLint plugin includes `@next/next/no-img-element` to catch bare
`<img>` elements that bypass `next/image`'s lazy loading, WebP optimisation, and
— critically — the `images.remotePatterns` whitelist in `next.config.ts`. The
rule exists but may be locally suppressed or bypassed. No audit of current
suppression comments has been performed.

---

## Severity Summary

| Finding ID | Repository            | File                                 | Category            | Severity    |
| :--------- | :-------------------- | :----------------------------------- | :------------------ | :---------- |
| CROSS-01   | all                   | `tsconfig.json`                      | Architectural Drift | 🟠 High     |
| CROSS-02   | all                   | `.github/workflows/codecov.yml`      | Process Gap         | 🟠 High     |
| CROSS-03   | all                   | `.github/workflows/codecov.yml`      | Process Gap         | 🟡 Medium   |
| CROSS-04   | all                   | `package.json` / `sentry`            | Security            | 🟠 High     |
| CROSS-05   | all                   | `.github/workflows/codecov.yml`      | Process Gap         | 🟠 High     |
| CROSS-06   | all                   | `src/**/hooks/`, `src/**/providers/` | Architectural Drift | 🟠 High     |
| CROSS-07   | all                   | `eslint.config.mjs`                  | Process Gap         | 🟡 Medium   |
| CROSS-08   | all                   | `.github/workflows/` (missing)       | Process Gap         | 🟡 Medium   |
| CROSS-09   | all                   | `src/env.ts` (missing)               | Security            | 🟡 Medium   |
| CROSS-10   | all                   | `next.config.ts`                     | Security            | 🟠 High     |
| CROSS-11   | all                   | `.github/workflows/`                 | Process Gap         | 🟡 Medium   |
| CROSS-12   | workforce, preference | `playwright.config.ts`               | Process Gap         | 🟡 Medium   |
| CROSS-13   | workforce, preference | `src/app/layout.tsx`                 | Security            | 🟠 High     |
| CROSS-14   | all                   | `eslint.config.mjs`                  | Security            | 🟡 Medium   |
| CROSS-15   | planner               | `src/app/actions/`                   | Security            | 🟠 High     |
| CROSS-16   | all                   | `src/**/*.test.tsx`                  | Process Gap         | 🟡 Medium   |
| CROSS-17   | all                   | `eslint.config.mjs` / `src/**/*.tsx` | Security            | 🟡 Medium   |
| CROSS-18   | all                   | `src/app/layout.tsx`                 | Process Gap         | 🟡 Medium   |
| CROSS-19   | all                   | `public/robots.txt` (missing)        | Security            | 🟡 Medium   |
| WF-01      | workforce             | `src/app/globals.css`                | Tech Debt           | 🔴 Critical |
| WF-02      | workforce             | `.husky/pre-commit`, `package.json`  | Process Gap         | 🟠 High     |
| WF-03      | workforce             | `src/app/`                           | Architectural Drift | 🟠 High     |
| WF-04      | workforce             | `src/lib/graphql/client.ts`          | Security            | 🔴 Critical |
| WF-05      | workforce             | `src/lib/graphql/client.ts:16-21`    | Security / Privacy  | 🔴 Critical |
| PL-01      | planner               | `src/app/globals.css`                | Tech Debt           | 🟠 High     |
| PL-02      | planner               | `src/app/globals.css:36`             | Tech Debt           | 🟡 Medium   |
| PL-03      | planner               | `src/app/(authenticated)/`           | Process Gap         | 🟡 Medium   |
| PR-01      | preference            | `src/app/globals.css`, `layout.tsx`  | Tech Debt           | 🟠 High     |
| PR-02      | preference            | `src/`                               | Architectural Drift | 🟡 Medium   |
| PR-03      | preference            | `src/app/`                           | Process Gap         | 🟡 Medium   |
| PR-04      | preference            | `package.json`                       | Process Gap         | 🟢 Low      |
| PR-05      | preference            | `src/store/`                         | Security / Privacy  | 🟡 Medium   |
