# Audit: Frontend Engineering Standards

| Field       | Value                                                                    |
| :---------- | :----------------------------------------------------------------------- |
| **Slug**    | `260306-frontend-standards`                                              |
| **Scope**   | `docs/engineering/frontend-standards-overview.md` + all 4 frontend repos |
| **Date**    | 2026-03-06                                                               |
| **Auditor** | Ryan Ammendolea                                                          |
| **Branch**  | `audit/260306-frontend-standards`                                        |
| **Status**  | ✅ Complete                                                              |

---

## Executive Summary

The documented standard declares Vanilla CSS (CSS Modules + CSS Variables) as
the styling layer and explicitly states "No Tailwind". The actual codebase tells
a different story: **two of the four in-scope frontends actively use Tailwind
v4**, and one (`preference-frontend`) has adopted a full Shadcn/Radix/CVA stack
that is architecturally incompatible with the documented approach. The standard
has drifted from reality and must be reconciled. Additionally, `design-frontend`
is not referenced in the standard at all, typography tokens differ from the
stated standard, and the standard's "See Also" links point to sibling pages that
need verification.

---

## 1. Styling Standard vs. Reality

**Strengths:**

- `workforce-frontend` faithfully implements the documented approach: pure CSS
  variables in `globals.css`, no Tailwind import, CSS Modules for component
  isolation. The standard accurately describes this repo.

**Gaps:**

| Finding                                                                                                                                                                                                                                                                                                                                                                                 | Severity |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **STY-01** `planner-frontend/src/app/globals.css:2` contains `@import "tailwindcss"` and `@layer utilities` blocks, and `package.json:23,30` lists `tailwindcss` as a runtime dependency and `@tailwindcss/postcss` as devDep. This directly contradicts §7.                                                                                                                            | 🔴       |
| **STY-02** `preference-frontend/src/app/globals.css:1-2` uses `@import "tailwindcss"`, `@import "tw-animate-css"`, `@apply border-border` / `@apply bg-background text-foreground` directives throughout. `package.json` adds `class-variance-authority`, `tailwind-merge`, `tw-animate-css`, `@radix-ui/*` (8 packages) — this is a full Shadcn/Radix stack, not a Vanilla CSS system. | 🔴       |
| **STY-03** `preference-frontend` uses `zustand` for state (`package.json:50`) despite §6.1 stating "Do not sync server data into Zustand/Redux."                                                                                                                                                                                                                                        | 🟠       |
| **STY-04** §7 specifies `Inter` / `Roboto` as typography standards; `planner-frontend` uses `Public Sans` (`globals.css:1`). No rationale is documented.                                                                                                                                                                                                                                | 🟡       |

---

## 2. Scope & Application Coverage

**Strengths:**

- The standard correctly identifies the three management frontends by name and
  acknowledges the mobile-first Preferencer pattern.

**Gaps:**

| Finding                                                                                                                                                                                                             | Severity |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| **SCO-01** `design-frontend` exists in `frontend/` and uses Next.js 16 + Tailwind v4 (`package.json`). It is not listed in §1's "Applies to" list, has no governance, and no apparent relationship to the standard. | 🟠       |
| **SCO-02** `website-frontend` appears in §1 "Applies to" list but uses Vite (not Next.js), Tailwind v3, React 18 (not 19), and has no Vitest/Playwright/Husky/GraphQL tooling. It is architecturally disjoint.      | 🟠       |

---

## 3. Technology Stack Accuracy

**Strengths:**

- Framework (Next.js 16+), Data layer (Urql 5.x + pg_graphql), testing tools
  (Vitest workspaces, Playwright, Husky) are all accurate for
  `planner-frontend`, `preference-frontend`, and `workforce-frontend`.

**Gaps:**

| Finding                                                                                                                                                                                                                                                                                                      | Severity |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **STK-01** §1 table states Styling = "Vanilla CSS (CSS Modules + CSS Variables)" and Quality Gates = `npm run lint` (ESLint + `next lint`). For 2 of 4 in-scope apps this is factually wrong.                                                                                                                | 🔴       |
| **STK-02** `preference-frontend/package.json` includes `@hookform/resolvers`, `react-hook-form`, `zod`, `@tanstack/react-table` — none of these are mentioned in the standard. `workforce-frontend` also has `react-hook-form` and `zod`. If these are accepted practice, the standard should document them. | 🟡       |

---

## 4. Architecture Pattern Compliance

**Strengths:**

- Provider hierarchy (§4.2), `usePermissions()` hook (§4.3), `<Permitted>` guard
  (§4.4), and middleware route guards (§4.5) are consistently implemented across
  the codebase per KI evidence.

**Gaps:**

| Finding                                                                                                                                                                                                                                   | Severity |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **ARCH-01** §6.1 "100% GraphQL" rule — `preference-frontend` using `@tanstack/react-table` and Zustand suggests data is being assembled outside of Graphcache in at least some flows. Not verified to be a violation but warrants review. | 🟡       |

---

## 5. Documentation Structural Integrity

**Strengths:**

- §5 (Testing) is thorough and evidenced across all repos.
- Australian English convention (§9) is a useful, concrete governance rule.
- §8 Production Checklist is actionable.

**Gaps:**

| Finding                                                                                                                                                                                                                   | Severity |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| **DOC-01** §1 "See Also" links reference `./state-management.md` and `./graphql-standard.md`; both files exist at `docs/engineering/` but their content has not been verified as current or complete.                     | 🟡       |
| **DOC-02** The standard has no "Last Updated" / version field or ownership attribution. Given the standard has materially diverged from reality, there is no mechanism to know when it was last authoritatively reviewed. | 🟠       |
| **DOC-03** §7 asserts design system approach but provides no link to the `design-frontend` repository which presumably encodes this system.                                                                               | 🟡       |

---

## Cross-Cutting Observations

1. **Standard → Code divergence is a governance risk.** The standard is cited as
   "authoritative source of truth" (line 9) — but it is not true for 2 of 4
   in-scope apps. Junior developers or auditors reading it will build incorrect
   mental models.

2. **Tailwind v4 appears to be the de facto choice** for newer work. This is a
   defensible decision (v4 is CSS-variable-native, so the design token approach
   is preserved), but it needs to be made explicit and the standard updated.

3. **`preference-frontend` is architecturally distinct.** Its Radix/CVA/Shadcn
   stack, Zustand usage, and `framer-motion` dependency mark it as a UX-first
   mobile application, not a management dashboard. The standard conflates the
   two use-cases.

---

## Severity Summary

| Severity    | Count | IDs                                                        |
| :---------- | :---- | :--------------------------------------------------------- |
| 🔴 Critical | 2     | STY-01, STY-02, STK-01 (3 findings share 2 severity slots) |
| 🟠 High     | 3     | STY-03, SCO-01, SCO-02, DOC-02                             |
| 🟡 Low      | 4     | STY-04, STK-02, ARCH-01, DOC-01, DOC-03                    |
