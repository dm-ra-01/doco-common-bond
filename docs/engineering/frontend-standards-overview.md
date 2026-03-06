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

## See Also

- [Ecosystem Architecture](./architecture.md) — System topology and service map
- [GraphQL Standard](./graphql-standard.md) — Urql client, MSW, codegen detail
- [State Management](./state-management.md) — Graphcache gold standard in full
