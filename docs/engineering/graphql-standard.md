---
title: GraphQL Standard
sidebar_label: GraphQL Standard
sidebar_position: 2
---

# GraphQL Implementation & Testing Standard

> Applies to: `planner-frontend`, `preference-frontend`, `workforce-frontend`

---

## Implementation Strategy

### Tooling & Code Generation

| Tool                                   | Role                                                                                       |
| :------------------------------------- | :----------------------------------------------------------------------------------------- |
| **Supabase `pg_graphql`**              | Backend GraphQL engine (introspects PostgreSQL schema automatically)                       |
| **`@graphql-codegen` (client preset)** | Generates TypeScript hooks, types, and fragments from `.graphql` files and the live schema |
| **`src/graphql/operations.ts`**        | Single source of truth for all queries, mutations, and fragments                           |

**Rule:** Run `npm run codegen` after every schema change. Never manually author
types for domain data.

### The Urql Client (`src/lib/graphql/client.ts`)

Exchange pipeline (order is critical):

```
cacheExchange (Graphcache) → authExchange → fetchExchange
```

| Exchange            | Role                                                         |
| :------------------ | :----------------------------------------------------------- |
| **`cacheExchange`** | Normalised cache; handles data consistency and optimistic UI |
| **`authExchange`**  | Injects Supabase JWT and handles automatic session refresh   |
| **`fetchExchange`** | Final network layer                                          |

The client is configured with `makeDefaultStorage` (IndexedDB) for offline
resilience — see [State Management](./state-management.md) for the full
reference configuration.

### Service vs. Hook Layer

- **Hooks / Providers:** Prefer generated hooks (e.g. `useGetOrgPlansQuery`)
  directly inside Context Providers.
- **Services:** Use direct `client.mutation()` calls for complex orchestrations
  or mutations outside the React lifecycle.

---

## Testing Framework

### Core Toolchain

| Tool                          | Role                                               |
| :---------------------------- | :------------------------------------------------- |
| **Vitest**                    | Test runner (unit and integration workspace split) |
| **Mock Service Worker (MSW)** | Network-layer GraphQL mocking                      |
| **JSDOM**                     | Browser simulation for component tests             |

### MSW — Network-Layer Mocking

Intercept GraphQL at the **network boundary**, not the React hooks or Urql
internals:

```typescript
// src/test/mocks/handlers.ts
import { graphql, HttpResponse } from "msw";

export const handlers = [
    graphql.query("GetOrgPlans", ({ variables }) =>
        HttpResponse.json({
            data: {
                orgPlansCollection: {
                    edges: [
                        { node: { id: "plan-1", name: "2026 Rotation" } },
                    ],
                },
            },
        })),
    graphql.mutation("UpdateJobLine", ({ variables }) =>
        HttpResponse.json({
            data: {
                updateJobLinesCollection: {
                    records: [{ id: variables.id, ...variables.set }],
                },
            },
        })),
];
```

**Validation rule:** Mock response shapes must match the generated TypeScript
types exactly. Type-mismatched mocks are a common source of false-positive
tests.

### Standard Test Wrapper

All component tests must use `src/test/test-wrapper.tsx` to provide the full
provider context (`UrqlProvider`, `OrgProvider`, `PermissionProvider`, etc.):

```tsx
// src/test/test-wrapper.tsx
export const renderWithProviders = (ui: React.ReactElement) =>
    render(ui, { wrapper: TestProviders });
```

### Localhost Bypass Pattern

When integration tests run against a real local Supabase instance, MSW must not
intercept `localhost` / `127.0.0.1` traffic:

```typescript
beforeAll(() =>
    server.listen({
        onUnhandledRequest(request, print) {
            const url = new URL(request.url);
            if (
                url.hostname === "127.0.0.1" || url.hostname === "localhost"
            ) return;
            print.error(); // Fail on all other unhandled requests
        },
    })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Adversarial Testing Philosophy

Every GraphQL feature must be covered by the **Six Adversarial Lenses**:

| Lens                 | Test for                                                 |
| :------------------- | :------------------------------------------------------- |
| **Input Validation** | Malformed or unexpected data from the API                |
| **Race Conditions**  | Simultaneous mutations; `isEditing` pause logic          |
| **Error States**     | `CombinedError`, HTTP 500, network timeout               |
| **Resilience**       | Offline behaviour (IDB persistence active, no network)   |
| **Boundaries**       | Empty collections, max pagination, extreme timestamps    |
| **Permission**       | UI reflects correct RLS-based access (mocked JWT claims) |

---

## Operations Centralisation

All GraphQL operations live in a single file per repository:

```typescript
// src/graphql/operations.ts

// ─── Queries ────────────────────────────────────────────────
export const GET_ORG_PLANS = gql`
    query GetOrgPlans($orgId: UUID!) {
        orgPlansCollection(filter: { org_id: { eq: $orgId } }) {
            edges { node { id name createdat } }
        }
    }
`;

// ─── Mutations ──────────────────────────────────────────────
export const UPDATE_JOB_LINE = gql`
    mutation UpdateJobLine($id: UUID!, $set: JobLinesUpdateInput!) {
        updateJobLinesCollection(filter: { id: { eq: $id } }, set: $set) {
            records { id }
        }
    }
`;

// ─── Fragments ──────────────────────────────────────────────
export const JOB_LINE_FRAGMENT = gql`
    fragment JobLineFields on JobLines {
        id startdate enddate position_id
    }
`;
```

---

## See Also

- [Frontend Standards](./frontend-standards-overview.md) — Full engineering
  standards
- [State Management](./state-management.md) — Graphcache gold standard
