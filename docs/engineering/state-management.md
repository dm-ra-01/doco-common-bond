---
title: State Management Standard
sidebar_label: State Management
sidebar_position: 3
---

# Gold Standard: State Management

> Applies to: `planner-frontend`, `preference-frontend`, `workforce-frontend`

---

## Core Principles

1. **Single Source of Truth** — All domain data lives in the **Urql
   Graphcache**. Avoid synchronizing server data into Redux or Zustand unless a
   complex transactional drafting requirement exists.
2. **Minimalist UI State** — Use **React Context** sparingly for high-level UI
   concerns (current organisation, current path, cross-component signalling).
3. **100% GraphQL** — All data interactions use Supabase `pg_graphql`. REST
   (`.from()`) calls are legacy and must be migrated.
4. **Schema-driven types** — `@graphql-codegen` generates types directly from
   the schema and `.graphql` documents. Never hand-author GraphQL domain types.

---

## Offline Resilience

Clinical environments have intermittent connectivity. All apps must be
configured for offline-first resilience:

- **Implementation:** `@urql/exchange-graphcache/default-storage` with IndexedDB
- **TTL:** 7-day retention (`maxAge: 7`)
- **Environment guard:** Always check
  `typeof window !== "undefined" && typeof indexedDB !== "undefined"` before
  initialising storage — this ensures compatibility with JSDOM and SSR
  environments during testing

---

## Optimistic UI

Users must never wait for a server round-trip for standard CRUD operations:

- Implement `optimisticResponse` for all high-frequency mutations (inserts,
  updates, deletes)
- Use the `updates` config in Graphcache to invalidate collection queries when
  records are inserted or deleted, keeping the UI consistent across all views

---

## Background Sync Protection — `isEditing` Pattern

The "clobbering" problem: background refetches must not overwrite active user
input.

```tsx
// In PlanProvider or TeamProvider
const [isEditing, setIsEditing] = useState(false);
const [result] = useGetPlansQuery({ pause: isEditing });

// In editing components — pause on mount, resume on unmount/save
useEffect(() => {
    setIsEditing(true);
    return () => setIsEditing(false);
}, []);
```

**Rules:**

- Queries must pause when `isEditing` is true
- Forms and complex selection UI must call `setIsEditing(true)` on mount and
  `setIsEditing(false)` on unmount or save

---

## Transactional Drafting State

For high-frequency drafting workflows (preference reordering, multi-step forms)
use a localised React Context scoped to the specific workflow:

- Prevents global state bloat
- Protects in-flight user edits from being overwritten by background server
  refetches
- Implement granular dirty tracking (e.g. a `Set` of modified IDs) for selective
  auto-saving

---

## Summary Table

| Concern             | Gold Standard                          |
| :------------------ | :------------------------------------- |
| **Primary State**   | Urql Graphcache (Normalised)           |
| **Secondary State** | React Context (UI-only)                |
| **Communication**   | 100% GraphQL (`pg_graphql`)            |
| **Persistence**     | IndexedDB (`makeDefaultStorage`)       |
| **Performance**     | Optimistic UI for all CRUD             |
| **Sync Safety**     | `isEditing` query pausing              |
| **Type Source**     | Schema-driven `@graphql-codegen`       |
| **Mocking**         | Network-layer MSW (not Urql internals) |

---

## Reference Implementation (`client.ts`)

```typescript
import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { authExchange } from "@urql/exchange-auth";
import schema from "./schema.json";

const storage =
    typeof window !== "undefined" && typeof indexedDB !== "undefined"
        ? makeDefaultStorage({ idbName: "receptor-cache-v1", maxAge: 7 })
        : undefined;

export const client = createClient({
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
    exchanges: [
        cacheExchange({
            schema,
            storage,
            keys: {
                // Register entity key fields for normalised caching
                JobLinesEdge: () => null,
            },
            updates: {
                // Invalidate collection queries on mutation
                Mutation: {
                    insertIntoJobLinesCollection: (result, _args, cache) => {
                        cache.invalidate("Query", "jobLinesCollection");
                    },
                },
            },
            optimistic: {
                updateJobLine: (variables) => ({
                    __typename: "UpdateJobLineResponse",
                    records: [{ ...variables.set }],
                }),
            },
        }),
        authExchange(async (utils) => ({
            addAuthToOperation: (op) =>
                utils.appendHeaders(op, {
                    Authorization: `Bearer ${session?.access_token}`,
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
                }),
            refreshAuth: async () => {
                await supabase.auth.refreshSession();
            },
            didAuthError: (error) =>
                error.graphQLErrors.some((e) =>
                    e.extensions?.code === "PGRST301"
                ),
        })),
        fetchExchange,
    ],
});
```

---

## See Also

- [Frontend Standards](./frontend-standards-overview.md) — Full engineering
  standards
- [GraphQL Standard](./graphql-standard.md) — Urql client, MSW patterns, codegen
