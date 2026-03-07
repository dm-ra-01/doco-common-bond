---
title: Frontend Engineering Standards
sidebar_label: Frontend Standards
sidebar_position: 1
---

# Frontend Engineering Standards

> **This is the authoritative source of truth for frontend development standards
> across the Receptor ecosystem.** Applies to: `planner-frontend`,
> `preference-frontend`, `workforce-frontend`.

| Field             | Value                                               |
| :---------------- | :-------------------------------------------------- |
| **Last Reviewed** | 2026-03-06                                          |
| **Reviewed By**   | Ryan Ammendolea (audit `260306-frontend-standards`) |
| **Next Review**   | 2026-09-06                                          |

---

## 1. Technology Stack

| Layer              | Standard                                             | Notes                                                                |
| :----------------- | :--------------------------------------------------- | :------------------------------------------------------------------- |
| **Framework**      | Next.js 16+ (App Router)                             | TypeScript strict mode                                               |
| **Styling**        | Tailwind v4 + CSS Variables (design tokens)          | Use `@theme {}` for token registration; see [§7 Styling](#7-styling) |
| **Data / GraphQL** | Urql 5.x + `pg_graphql`                              | See [GraphQL Standard](./graphql-standard.md)                        |
| **State**          | Urql Graphcache (server) + React Context (UI)        | See [State Management](./state-management.md)                        |
| **Type Gen**       | `@graphql-codegen` (client preset)                   | From live schema + `.graphql` operations                             |
| **Unit Tests**     | Vitest (Workspaces)                                  | See [§5 Testing](#5-testing)                                         |
| **E2E Tests**      | Playwright                                           | See [§5 Testing](#5-testing)                                         |
| **Quality Gates**  | Husky pre-commit (`npm run lint` + `vitest related`) | ESLint + `next lint`; `lint-staged` scoped to `src/**/*.{ts,tsx}`    |

### In-Scope Applications

| App                   | Profile            | Tailwind Stack                                                            |
| :-------------------- | :----------------- | :------------------------------------------------------------------------ |
| `planner-frontend`    | Management desktop | Tailwind v4 + CSS Variables                                               |
| `workforce-frontend`  | Management desktop | Tailwind v4 + CSS Variables                                               |
| `preference-frontend` | Mobile / consumer  | Tailwind v4 + Radix UI (see [§7.2](#72-preference-frontend-mobile-stack)) |

> [!NOTE]
> `website-frontend` (Cloudflare Pages, Vite, Tailwind v3) is a separate product
> outside the management frontend standard. It has its own architecture and is
> not subject to this document.

---

## 2. Repository Structure

All frontend applications follow a standardised `src/` layout:

```
src/
├── app/            # Next.js App Router (pages, layouts, server actions)
├── components/     # UI components (atoms, molecules, organisms)
├── graphql/
│   └── operations.ts   # SSOT for all queries, mutations, fragments
├── hooks/          # Domain-specific React hooks (e.g. usePlan, useRotations)
├── lib/
│   └── graphql/
│       └── client.ts   # Urql client (Graphcache + authExchange + persist)
├── providers/      # React Context providers (Auth, Org, Plan, Permission)
├── services/       # Pure logic & API orchestration (no React)
├── test/
│   ├── mocks/          # MSW handlers
│   ├── setup.ts        # Vitest setupFiles
│   └── test-wrapper.tsx  # Standard render() with all providers
└── types/          # Generated TypeScript types (from DB schema)
```

---

## 3. Architecture Pattern: Service → Hook → Component

All features follow a strict three-layer separation:

```
┌─────────────────────────────────┐
│  Component Layer                │ ← UI only; consumes hooks; no API calls
├─────────────────────────────────┤
│  Hook / Provider Layer          │ ← State transitions; Urql bindings
├─────────────────────────────────┤
│  Service Layer                  │ ← Pure orchestration; typed inputs/outputs
└─────────────────────────────────┘
```

**Rules:**

- Components must not call `client.query()` or `client.mutation()` directly.
- Services must not import React.
- Providers own the Urql query lifecycle (pause conditions, refetch triggers).

---

## 4. Authentication & Access Control

### 4.1 JWT-First Architecture

All apps use Supabase `app_metadata` claims for fast-path authorization:

| Claim             | Type                      | Purpose                                              |
| :---------------- | :------------------------ | :--------------------------------------------------- |
| `global_roles`    | `string[]`                | Platform-wide capabilities (e.g. `globalOrg.create`) |
| `worker_contexts` | `{ worker_id, org_id }[]` | Per-tenant worker identity                           |

**Rule:** Frontend JWT claims drive UI visibility and routing. **Never** use
claims to gate data mutations — Supabase RLS enforces those at the database
level.

### 4.2 Provider Hierarchy

```tsx
<AuthProvider>
    // Monitors onAuthStateChange; parses app_metadata
    <UrqlProvider>
        // Graphcache client with authExchange
        <OrgProvider>
            // Resolves org list from worker_contexts JWT claim
            <PermissionProvider key={org.id}>
                // Scoped ACL; re-mounts on org change
                {children}
            </PermissionProvider>
        </OrgProvider>
    </UrqlProvider>
</AuthProvider>;
```

The `key={org.id}` on `PermissionProvider` forces re-computation of rights when
the org context switches — preventing permission leakage between organisations.

### 4.3 `usePermissions()` Hook

Single entry point for all authorization checks:

```tsx
const { hasGlobalRole, hasRight, isLoading } = usePermissions();
```

| Method                | Usage                                            |
| :-------------------- | :----------------------------------------------- |
| `hasGlobalRole(role)` | Platform-wide actions (e.g. create organisation) |
| `hasRight(right)`     | Org-scoped permissions from ACL                  |
| `isLoading`           | True if session or ACL is still resolving        |

### 4.4 `<Permitted>` Guard Component

Declarative UI gating with discriminated union props (must specify `right`,
`globalRole`, or both):

```tsx
<Permitted right="plan.manage" fallback={<ReadOnlyView />}>
    <EditPanel />
</Permitted>;
```

### 4.5 Middleware Route Guards

Protect route groups in `middleware.ts` by inspecting JWT claims:

- Gate admin paths behind required `global_roles`.
- On unauthorized (but authenticated) access, redirect to `/` — **not**
  `/login`.

---

## 5. Testing

### 5.1 Testing Lifecycle (TDD Order)

1. **Service layer tests** → define before implementing service logic
2. **Hook/provider tests** → `renderHook` with state transition assertions
3. **Component tests** → data display and handler verification
4. **E2E (Playwright)** → full user journey

### 5.2 Vitest — Unit & Integration Workspaces

Use `vitest.workspace.ts` to split unit and integration tests, preventing DB
race conditions:

```typescript
// vitest.workspace.ts
export default [
    {
        test: {
            name: "unit",
            include: ["src/**/*.unit.test.{ts,tsx}"],
            environment: "jsdom",
            fileParallelism: true, // Parallelized
        },
    },
    {
        extends: "vitest.config.ts",
        test: {
            name: "integration",
            include: ["src/**/*.test.{ts,tsx}"],
            exclude: ["src/**/*.unit.test.{ts,tsx}"],
            fileParallelism: false, // Sequential — prevents DB race conditions
        },
    },
];
```

**Naming convention enforces execution model:**

- `*.unit.test.tsx` → parallel Unit project
- `*.test.tsx` → sequential Integration project

> [!WARNING]
> Do not omit `.unit` from logic-only test files. If you do, they run in the
> sequential integration project and negate the performance benefit of
> parallelism.

### 5.3 Vitest Environment Variable Loading

`.env.local` is not auto-loaded by Vitest. Load it explicitly in
`vitest.config.ts`:

```typescript
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, ".env.local") });
```

Also apply in `test/setup.ts` using `process.cwd()` for robust path resolution
at runtime.

### 5.4 MSW — Network-Layer Mocking

Mock GraphQL at the network boundary, not the Urql client:

```typescript
// src/test/mocks/handlers.ts
import { graphql } from "msw";

export const handlers = [
    graphql.query("GetOrgPlans", ({ variables }) => {
        return HttpResponse.json({
            data: { orgPlansCollection: { edges: [] } },
        });
    }),
];
```

All UI tests must use `src/test/test-wrapper.tsx` which wraps with the
`UrqlProvider`, `OrgProvider`, and other context dependencies to ensure
components receive all required context.

MSW localhost bypass pattern (avoid intercepting real local Supabase):

```typescript
beforeAll(() =>
    server.listen({
        onUnhandledRequest(request, print) {
            const url = new URL(request.url);
            if (
                url.hostname === "127.0.0.1" || url.hostname === "localhost"
            ) return;
            print.error();
        },
    })
);
```

### 5.5 Adversarial Test Lenses

Every feature must be tested through six adversarial lenses:

| Lens                 | What to test                                               |
| :------------------- | :--------------------------------------------------------- |
| **Input Validation** | Malformed/unexpected data from the API                     |
| **Race Conditions**  | Simultaneous mutations; background refetch vs. active edit |
| **Error States**     | `CombinedError`, 500 responses, network timeout            |
| **Resilience**       | Offline behaviour (IDB persistence active)                 |
| **Boundaries**       | Empty collections, large datasets, paginated cursors       |
| **Permission**       | UI reflects correct RLS-based access (mocked via JWT)      |

### 5.6 Playwright — E2E

Use global authentication setup to avoid repeated logins:

```typescript
// playwright.config.ts
projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
        name: "chromium",
        use: { storageState: "playwright/.auth/user.json" },
        dependencies: ["setup"],
    },
];
```

**Critical — Use `localhost` not `127.0.0.1`:** Supabase Auth sets cookies for
the `localhost` domain. Accessing via `127.0.0.1` in tests causes auth failures
despite a successful login.

**Dev server config:**

```typescript
webServer: {
    command: `npm run dev -- -p 3010 -H localhost`,
    url: `http://localhost:3010/next.svg`,
    reuseExistingServer: true,
}
```

For mobile assertions, use `toBeAttached()` over `toBeVisible()` — CSS
`display: none` causes `toBeVisible()` to fail even when the element is in the
DOM.

---

## 6. Data Layer & State Management

### 6.1 Core Principles

1. **Single source of truth** — All domain data lives in the Urql Graphcache. Do
   not sync server data into Zustand/Redux.
2. **100% GraphQL** — Use Supabase `pg_graphql`. REST (`.from()`) calls are
   legacy and must be migrated.
3. **Schema-driven types** — Run `npm run codegen` to generate types from the
   live schema. Never hand-author GraphQL types.
4. **Operations centralised** — All queries, mutations, and fragments in
   `src/graphql/operations.ts`.

### 6.2 Urql Client Configuration (`src/lib/graphql/client.ts`)

```typescript
const storage =
    typeof window !== "undefined" && typeof indexedDB !== "undefined"
        ? makeDefaultStorage({ idbName: "receptor-cache-v1", maxAge: 7 })
        : undefined;

const client = createClient({
    url: `${supabaseUrl}/graphql/v1`,
    exchanges: [
        cacheExchange({ schema, storage, keys: {...}, updates: {...}, optimistic: {...} }),
        authExchange(async utils => ({
            addAuthToOperation: (op) => utils.appendHeaders(op, {
                Authorization: `Bearer ${session?.access_token}`,
                apikey: supabaseAnonKey,
            }),
            refreshAuth: async () => { /* Supabase session refresh */ },
        })),
        fetchExchange,
    ],
});
```

**Exchange order matters:** `cacheExchange` → `authExchange` → `fetchExchange`.

### 6.3 IndexedDB Offline Persistence

- TTL: **7-day** retention (`maxAge: 7`).
- Always guard with
  `typeof window !== "undefined" && typeof indexedDB !== "undefined"` to prevent
  JSDOM/SSR breakage.

### 6.4 Optimistic UI

Implement `optimisticResponse` for all high-frequency CRUD mutations. Use the
`updates` config in Graphcache to maintain collection consistency across views
when records are inserted or deleted.

### 6.5 Background Sync Protection (`isEditing` Pattern)

The "clobbering" problem: background refetches must not overwrite active user
input.

```tsx
// In PlanProvider / TeamProvider
const [isEditing, setIsEditing] = useState(false);
const [plansResult] = useGetPlansQuery({ pause: isEditing });

// In form components
useEffect(() => {
    setIsEditing(true);
    return () => setIsEditing(false);
}, []);
```

**Rule:** Queries must be paused when `isEditing` is true. Forms must call
`setIsEditing(true)` on mount and `setIsEditing(false)` on unmount/save.

### 6.6 Transactional State for Drafting Workflows

For high-frequency drafting (e.g., preference reordering, multi-step forms) use
a **localised React Context** scoped to the workflow, optionally backed by
**Zustand** for complex local state. This prevents global state bloat and
protects in-flight edits from background refetches.

---

## 7. Styling

### 7.1 Management Apps (Planner, Workforce)

All management frontends use **Tailwind v4** with CSS custom properties for
design tokens:

```css
/* globals.css */
@import "tailwindcss";

@theme {
    --font-sans: "Inter", system-ui, sans-serif;
    --color-brand-primary: hsl(var(--brand-primary));
    /* ... additional tokens */
}

:root {
    --brand-primary: 271 76% 53%;
    /* ... design system values */
}
```

- **Design tokens** live in `:root` as CSS custom properties (HSL values)
- **`@theme {}`** maps tokens into Tailwind's utility system
- **CSS Modules** for component-specific overrides where needed
- **No `@apply` in component files** — prefer Tailwind utilities directly in JSX

**Typography:** `Inter` across all management apps.

**Icons:** Lucide React (2px stroke weight, consistent action icons).

### 7.2 Preference Frontend (Mobile Stack)

`preference-frontend` is a **mobile-first consumer app** ("on the ward"). It
uses an extended stack appropriate for its UX requirements:

| Addition                       | Purpose                                 |
| :----------------------------- | :-------------------------------------- |
| **Radix UI primitives**        | Accessible dialogs, dropdowns, tooltips |
| **`class-variance-authority`** | Typed component variant API             |
| **`tailwind-merge`**           | Safe Tailwind class composition         |
| **`framer-motion`**            | Gesture animations and transitions      |

**Typography exemption (approved 2026-03-07):** `preference-frontend` is
approved to use **Geist Sans** and **Geist Mono** in place of Inter. Rationale:
it is a bespoke dark-mode mobile interface distinct from the management apps.
Changing to Inter would require a full design rework with no functional benefit
— workers never use this app alongside the management interfaces.

:::note Font Exemption Condition This exemption applies **only** to
`preference-frontend`. All other in-scope frontends (planner-frontend,
workforce-frontend) must use Inter as per §7.1. :::

Tailwind design tokens must be aligned with the ecosystem colour palette to
maintain visual consistency across apps.

---

## 8. Permitted Libraries

These libraries appear across the ecosystem and are approved for use:

| Library                 | Purpose                      | Apps                              |
| :---------------------- | :--------------------------- | :-------------------------------- |
| `react-hook-form`       | Form state management        | workforce, preference             |
| `zod`                   | Schema validation            | workforce, preference             |
| `@tanstack/react-table` | Headless table (sort/filter) | preference                        |
| `framer-motion`         | Animations                   | preference only                   |
| `date-fns`              | Date utilities               | All                               |
| `lucide-react`          | Icon system                  | All                               |
| `zustand`               | Local/draft UI state only    | preference (transactional drafts) |

> [!IMPORTANT]
> `zustand` must only manage local UI and draft state — never GraphQL server
> data. Server state lives in Urql Graphcache exclusively.

---

## 9. Production Readiness Checklist

Before marking any frontend feature complete:

- [ ] **Linting:** `npm run lint` passes with zero warnings
- [ ] **No hardcoded secrets:** All env vars come from `.env.local` / CI secrets
- [ ] **Responsiveness:** Verified on mobile (≤768px), tablet (768–1024px),
      desktop (>1024px)
- [ ] **Error handling:** Boundary checks and fallback UIs for all failed API
      calls
- [ ] **Tests:** Service, hook, component, and E2E layers all pass
- [ ] **Auth patterns:** Uses centralised `AuthContext` / middleware — no ad-hoc
      auth logic
- [ ] **Environment variables:** Registered in `supabase-receptor/setup.conf`
- [ ] **Australian English:** UI strings use `-ise`, `labour`, `colour`,
      `DD/MM/YYYY`

---

## 10. Engineering Conventions

### Naming

| Entity              | Convention                       | Example                        |
| :------------------ | :------------------------------- | :----------------------------- |
| Components          | PascalCase                       | `JobLineCard.tsx`              |
| Hooks               | camelCase with `use` prefix      | `usePreferenceFilter.ts`       |
| Services            | PascalCase with `Service` suffix | `PreferencingService.ts`       |
| GraphQL operations  | PascalCase verbs                 | `GetOrgPlans`, `UpdateJobLine` |
| DB function helpers | `func_` prefix (server-side)     | `func_has_global_role`         |

### Error Handling

- **Global boundaries:** Next.js `error.tsx` at every major route group.
- **User feedback:** Toast notifications for all async operations.
- **Reference IDs:** Fallback UIs should provide a unique reference ID for
  support.

### Australian English (Mandatory)

Receptor serves the Australian healthcare sector. All UI strings must use AU
English:

| ✅ AU Standard                  | ❌ US Variant              |
| :------------------------------ | :------------------------- |
| `-ise` (customise, standardise) | `-ize`                     |
| `labour`, `colour`, `favour`    | `labor`, `color`, `favor`  |
| `haemorrhage`, `anaesthesia`    | `hemorrhage`, `anesthesia` |
| `DD/MM/YYYY` dates              | `MM/DD/YYYY`               |

---

## 11. Security

### Data Safety (PHI)

- **No `console.log` in production** — strict `no-console` ESLint rule.
- **UUIDs only in URLs** — never expose patient or worker IDs or UR numbers.
- Scrub PHI from all analytics payloads before submission.

### Soft Deletes

All clinical entity deletions use a `deleted_at` timestamp pattern for auditing.
Hard deletion is handled by automated background scrubs per Australian health
records legislation.

### MFA

All users (including developers) must have MFA enabled on their Supabase
account.

---

## 12. Server vs Client Components

### 12.1 Decision Rule

Next.js 16 App Router defaults to **Server Components**. Opt into `"use client"`
explicitly and only when required.

| Indicator                                                | Directive                  |
| :------------------------------------------------------- | :------------------------- |
| Uses Urql hooks (`useQuery`, `useMutation`)              | `"use client"`             |
| Uses React state (`useState`, `useEffect`, `useReducer`) | `"use client"`             |
| Renders only from props / fetched data                   | Server Component (default) |
| Contains event handlers (`onClick`, `onChange`)          | `"use client"`             |
| Uses Context or `usePermissions()`                       | `"use client"`             |

### 12.2 IP Protection via Server Components

> [!IMPORTANT]
> Receptor is a first-to-market product. Core business logic — matching
> algorithms, scoring functions, constraint rules — must **never** be shipped in
> the client bundle where it can be read via browser DevTools.

**Rule:** Any function that encodes proprietary logic must live in a Server
Component, Server Action, or backend service. It must never be imported into a
`"use client"` file.

```tsx
// ✅ Correct — algorithm runs server-side, result passed as props
// app/allocations/page.tsx (Server Component)
import { computeAllocationScore } from "@/services/scoring"; // never bundled

export default async function AllocationsPage() {
    const scores = await computeAllocationScore(params);
    return <AllocationView scores={scores} />;
}

// ❌ Wrong — scoring logic is shipped to the browser
// "use client"
// import { computeAllocationScore } from "@/services/scoring";
```

### 12.3 Layout & Auth Boundary

- Route group layouts (`layout.tsx`) that check auth must be Server Components
  reading the Supabase session server-side — not client-side JWT checks.
- The `middleware.ts` redirect is the **first** gate; the layout is the
  **second** gate. Both must be present for protected routes.
- `/` (root) is always accessible; redirects after auth are to the org
  dashboard, never back to `/login`.

---

## 13. Accessibility

### 13.1 Compliance Target

All in-scope applications must meet **WCAG 2.1 Level AA** — the baseline
required by Australian Government Digital Service Standards and appropriate for
a clinical workforce product.

### 13.2 Automated Testing

`vitest-axe` (unit/component) and `@axe-core/playwright` (E2E) are installed
across all frontends. Their use is **mandatory**, not optional:

```typescript
// Component test — vitest-axe
import { axe } from "vitest-axe";

it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<JobLineCard {...props} />);
    expect(await axe(container)).toHaveNoViolations();
});
```

```typescript
// E2E test — axe-core/playwright
import { checkA11y } from "@axe-core/playwright";

test("allocations page passes axe", async ({ page }) => {
    await page.goto("/allocations");
    await checkA11y(page);
});
```

Axe checks must pass in CI. Violations block merge.

### 13.3 Interaction Standards

- **Keyboard navigation:** Every interactive element must be reachable via Tab
  and operable via Enter/Space. Modals must trap focus and restore it on close.
- **Focus management:** After async operations (saving, loading new data), focus
  must be explicitly moved to a logical target — never left at `document.body`.
- **Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text (WCAG 1.4.3).
  Verify token palette choices against this ratio before adding new colours.
- **Mobile assertions in tests:** Use `toBeAttached()` over `toBeVisible()` —
  CSS `display: none` fails `toBeVisible()` even for off-screen-but-valid
  elements.

---

## 14. CI/CD Quality Gates

Pre-commit hooks are a developer convenience; CI gates are the authoritative
merge requirement. Both must be present.

### 14.1 Required CI Checks (every PR)

| Check                 | Command                      | Failure action |
| :-------------------- | :--------------------------- | :------------- |
| **Lint**              | `npm run lint`               | Block merge    |
| **Type check**        | `npx tsc --noEmit`           | Block merge    |
| **Unit tests**        | `npm test -- --project=unit` | Block merge    |
| **Axe accessibility** | Included in Playwright suite | Block merge    |
| **Build**             | `npm run build`              | Block merge    |

### 14.2 Pre-commit (Developer Local)

`husky` runs `lint-staged` on `src/**/*.{ts,tsx}`:

```json
"lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix", "vitest related --run"]
}
```

Pre-commit hooks **must not** be skipped (`--no-verify` is prohibited in team
workflow). CI is the enforcement backstop.

### 14.3 Branch Protection Rules

The `main` branch requires:

- All CI checks passing
- At least one approved review
- No force pushes

---

## 15. PHI Handling, Error Tracking & Observability

### 15.1 Sentry Integration

All in-scope frontends use **Sentry** for error tracking.

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENV,
    // CRITICAL: never send PHI to Sentry
    beforeSend(event) {
        return scrubPHI(event);
    },
    // Do not send console breadcrumbs in production
    integrations: (integrations) =>
        integrations.filter((i) => i.name !== "Console"),
});
```

### 15.2 PHI Scrubbing Rules

All data leaving the browser — to Sentry, analytics, or any third party — must
be scrubbed of PHI before transmission.

| Data type            | Rule                       |
| :------------------- | :------------------------- |
| Worker names         | Replace with `[WORKER_ID]` |
| UR numbers           | Strip entirely             |
| DOB / dates of birth | Strip entirely             |
| Org names            | Permitted (not PHI)        |
| UUIDs                | Permitted (not reversible) |

Implement a `scrubPHI(event: SentryEvent)` utility in `src/lib/sentry.ts`. This
function must be unit-tested.

### 15.3 Error Handling Layers

| Layer                        | Mechanism                             | Sends to Sentry?                |
| :--------------------------- | :------------------------------------ | :------------------------------ |
| Route group                  | `error.tsx` with `useReportWebVitals` | Yes (auto)                      |
| Async ops                    | `CombinedError` handler in hooks      | Yes (manual `captureException`) |
| `console.log` in prod        | ESLint `no-console` rule              | Prevented                       |
| Unhandled promise rejections | Sentry global handler                 | Yes (auto)                      |

> [!CAUTION]
> Never pass raw `Error` objects containing user-entered data directly to
> `Sentry.captureException()`. Always wrap with the scrubbing utility first.

---

## 16. URL & Navigation State

### 16.1 State Location Decision Tree

| State type                            | Location                 | Rationale                        |
| :------------------------------------ | :----------------------- | :------------------------------- |
| Selected entity (e.g. org, plan, run) | React Context / Provider | Session-scoped; not bookmarkable |
| Active filters, search, sort          | URL search params        | Deep-linkable; back-button safe  |
| Pagination cursor                     | URL search params        | Shareable; reload-safe           |
| Draft / in-progress form              | Local Context or Zustand | Must survive local navigation    |
| Server data                           | Urql Graphcache          | Never in URL or local state      |

### 16.2 Next.js App Router Patterns

```tsx
// Reading search params (Server Component — preferred)
export default function PlansPage({
    searchParams,
}: {
    searchParams: { filter?: string; page?: string };
}) {
    const filter = searchParams.filter ?? "all";
    // ...
}

// Writing search params (Client Component — when user-driven)
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const setFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("filter", value);
        router.push(`${pathname}?${params.toString()}`);
    };
}
```

### 16.3 Rules

- **Never** use `router.push` to encode server state — it should only encode UI
  navigation intent.
- **Pagination cursors** belong in URL params so that sharing a URL lands the
  recipient on the same page.
- **Selected entity IDs** (current org, current plan) belong in Provider context
  — they are session state, not navigation state.
- URL params must be sanitised before use. Never interpolate raw search param
  values into GraphQL variables without validation.

---

## 17. TypeScript Configuration Baseline

Every in-scope frontend must include the following `tsconfig.json` baseline.
Deviating from this configuration requires explicit Engineering Lead approval.

```json
{
    "compilerOptions": {
        "strict": true,
        "target": "ES2017",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "preserve",
        "incremental": true,
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"] },
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedIndexedAccess": true
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
```

`strict: true` enables: `strictNullChecks`, `noImplicitAny`,
`strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`,
`noImplicitThis`, `alwaysStrict`, and `useUnknownInCatchVariables`.

`noUncheckedIndexedAccess` (not part of `strict`) is additionally enforced. This
means array index and object key access returns `T | undefined`, forcing
explicit null checks on collection element access — critical for a clinical app
where empty collections are a real and common data state.

> [!NOTE]
> `exactOptionalPropertyTypes` is intentionally excluded — it causes
> disproportionate friction with React prop patterns and offers limited safety
> benefit beyond what `strictNullChecks` already provides.

**CI enforcement:** `npx tsc --noEmit` runs in CI on every PR (§14). Type errors
block merge.

---

## 18. Dependency Version Governance

### 18.1 Version Range Policy

Use caret ranges (`^X.Y.Z`) for all dependencies. npm's caret range already
prevents automatic major version jumps — `^4.0.0` will never auto-install `5.x`.
Minor and patch updates are permitted to come in silently; the test suite is the
safety net.

| Scenario                | Action                                     |
| :---------------------- | :----------------------------------------- |
| Minor/patch update      | Permitted; absorbed automatically          |
| Critical security patch | Update immediately via dedicated PR        |
| Major version bump      | PR required; **Engineering Lead approval** |

### 18.2 Major Version Upgrade Process

A major version bump (e.g. `next: 16 → 17`, `tailwindcss: 4 → 5`) requires:

1. A dedicated PR titled `chore(deps): upgrade [package] vX → vY`
2. Migration notes summary in the PR description
3. All CI checks passing (§14)
4. Engineering Lead approval before merge

### 18.3 Review Cadence

- **Monthly:** Run `npm outdated` across all frontends; triage security
  advisories.
- **Quarterly:** Engineering Lead reviews major version opportunities.

---

## 19. Suspense, Streaming & Loading States

### 19.1 Every Async Route Needs a `loading.tsx`

Next.js streams Server Component output. Without a `loading.tsx`, users see a
blank page until the full render completes.

```
src/app/
├── (dashboard)/
│   ├── layout.tsx
│   ├── loading.tsx        ← Required at every route group
│   ├── error.tsx          ← Required at every route group
│   └── plans/
│       ├── page.tsx
│       └── loading.tsx    ← Override for specific slow routes
```

`loading.tsx` must render a **skeleton that matches the page structure** — not a
spinner centred on screen. Skeletons preserve layout stability and communicate
context to clinical users under time pressure.

### 19.2 Client-Side Suspense Boundaries

Wrap independently-fetching client subtrees in `<Suspense>` so they load in
parallel rather than blocking each other:

```tsx
// ✅ Correct — table loads independently
<Suspense fallback={<TableSkeleton rows={10} />}>
    <WorkforceTable orgId={orgId} />
</Suspense>;

// ❌ Wrong — single Suspense at route root blocks everything
```

### 19.3 `useSearchParams()` Requires a Suspense Wrapper

`useSearchParams()` in a Client Component forces Next.js to de-optimise the
entire route (no streaming) unless the component is wrapped in `<Suspense>`:

```tsx
<Suspense fallback={<FilterBarSkeleton />}>
    <FilterBar /> {/* contains useSearchParams() */}
</Suspense>;
```

This is a Next.js requirement, not optional.

---

## 20. GraphQL Error Handling Contract

All Urql hooks return a `CombinedError`. Three distinct error types require
different handling:

| Error type                    | Detection                                  | Required action                      |
| :---------------------------- | :----------------------------------------- | :----------------------------------- |
| **Network error**             | `error.networkError !== null`              | Show retry UI; do not redirect       |
| **Application GraphQL error** | `graphQLErrors` present, code ≠ `PGRST301` | Toast to user + Sentry               |
| **Auth error (PGRST301)**     | `extensions.code === "PGRST301"`           | Silent refresh → `/login` on failure |

### 20.1 `authExchange` Handles PGRST301 Centrally

PGRST301 (JWT expired) is intercepted by the Urql `authExchange` before any hook
sees it. It silently refreshes the session and retries the operation — hooks
never observe the error.

```typescript
authExchange(async (utils) => ({
    didAuthError: (error) =>
        error.graphQLErrors.some((e) => e.extensions?.code === "PGRST301"),
    refreshAuth: async () => {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
            await supabase.auth.signOut();
            router.push("/login");
        }
    },
}));
```

**Rule:** Never handle PGRST301 inside individual hooks. The `authExchange` is
the single, centralised handler.

### 20.2 Standard Hook Error Pattern

```typescript
const { data, error, fetching } = useGetPlansQuery({ variables });

if (fetching) return <LoadingSkeleton />;

if (error?.networkError) {
    return <ErrorBoundary type="network" onRetry={reExecuteQuery} />;
}

if (error?.graphQLErrors.length) {
    Sentry.captureException(scrubPHI(error)); // §15
    return <ErrorBoundary type="application" referenceId={generateId()} />;
}
```

Network errors get a **retry button**. Application errors get a **reference ID**
for support. Auth errors are invisible — handled upstream by `authExchange`.

---

## 21. Component Documentation Standard

### 21.1 What Requires Documentation

TypeScript types are self-documenting for simple components. A JSDoc comment
(the `/** ... */` hover tooltip you see in VS Code) is only required where types
alone don't explain the _why_:

| Target                                   | Required?                                             |
| :--------------------------------------- | :---------------------------------------------------- |
| Exported hooks (`useX`)                  | ✅ Yes — one-liner above the function                 |
| Service functions                        | ✅ Yes — one-liner above the function                 |
| Shared UI components (used in 3+ places) | ✅ Yes — one-liner + prop notes for non-obvious props |
| Page components                          | ❌ No — filename is sufficient                        |
| Local one-off components                 | ❌ No                                                 |

### 21.2 Format

One sentence explaining _why_ the hook/service exists, not what the types say:

```typescript
/**
 * Returns org-scoped permissions for the active session.
 * Combines global_roles JWT claims with the per-org ACL from Supabase.
 * Must be called inside PermissionProvider.
 */
export function usePermissions(): PermissionsContext { ... }

/**
 * Pauses the active plan query while the user is editing to prevent
 * background refetches from clobbering unsaved input.
 */
export function usePlanEditor(planId: string): PlanEditorContext { ... }
```

### 21.3 Anti-Patterns

```typescript
// ❌ Redundant — types already say this
/** @param planId The plan ID. @returns The plan. */

// ❌ Implementation detail — use an inline comment instead
/** Calls useGetPlansQuery with the org ID from context. */

// ✅ Explains a non-obvious contract
/** Must be called inside PlanProvider. Returns null outside of plan context. */
```

---

## See Also

- [Ecosystem Architecture](./architecture.md) — System topology and service map
- [GraphQL Standard](./graphql-standard.md) — Urql client, MSW, codegen detail
- [State Management](./state-management.md) — Graphcache gold standard in full
