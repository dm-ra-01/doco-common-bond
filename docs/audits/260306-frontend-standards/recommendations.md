<!-- audit-slug: 260306-frontend-standards -->

# Recommendations: Frontend Engineering Standards

| Field      | Value                             |
| :--------- | :-------------------------------- |
| **Slug**   | `260306-frontend-standards`       |
| **Branch** | `audit/260306-frontend-standards` |
| **Date**   | 2026-03-06                        |

> [!IMPORTANT]
> The standard documented in `docs/engineering/frontend-standards-overview.md`
> materially diverges from the actual codebase. The primary decision required is
> **whether to standardise on Tailwind v4 or enforce a rollback to Vanilla
> CSS**. All other recommendations depend on this choice. This is a human
> decision — the agent should not choose for you.

---

## Priority Framework

| Priority    | Trigger                                          |
| :---------- | :----------------------------------------------- |
| 🔴 Critical | Causes governance failure or misleads developers |
| 🟠 High     | Impairs consistency and maintainability          |
| 🟡 Low      | Quality / clarity improvements                   |

---

## 🔴 Critical Recommendations

### REC-01 [260306-frontend-standards] — Resolve Styling Standard Contradiction

**Findings:** STY-01, STY-02, STK-01

The standard claims Vanilla CSS only. `planner-frontend` and
`preference-frontend` use Tailwind v4 in production. One of two paths must be
chosen:

**Option A — Adopt Tailwind v4 as the standard** _(recommended: lower effort,
consistent with current trajectory)_

- [ ] Update §1 Styling row:
      `Tailwind v4 (CSS-variable-native) + CSS Variables for design tokens`
- [ ] Remove "No Tailwind" note from §1 table and §7 prose
- [ ] Update §7 to describe the hybrid model: Tailwind v4 for utilities + CSS
      custom properties for design tokens
- [ ] Note that `workforce-frontend` is a legacy Vanilla CSS exception until
      migrated
- [ ] Document `@tailwindcss/postcss` as the required PostCSS config

**Option B — Enforce Vanilla CSS rollback**

- [ ] Remove `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`,
      `class-variance-authority`, `tailwind-merge` from `planner-frontend` and
      `preference-frontend`
- [ ] Replace `@import "tailwindcss"` and all `@apply` directives in both
      `globals.css` files with equivalent Vanilla CSS
- [ ] Remove all `@radix-ui/*` packages from `preference-frontend` (the Shadcn
      ecosystem is Tailwind-coupled)

---

### REC-02 [260306-frontend-standards] — Clarify Scope: `website-frontend` and `design-frontend`

**Findings:** SCO-01, SCO-02

- [ ] Remove `website-frontend` from §1 "Applies to" list — it uses Vite, React
      18, Tailwind v3 and has no overlap with the management frontend standard
- [ ] Either add `design-frontend` to the "Applies to" list with its own
      governance sub-section, or explicitly exclude it with a note (e.g.,
      "design-frontend is a UI prototype sandbox — not subject to this
      standard")
- [ ] Add a separate `website-frontend` standard section or link to a separate
      standards doc if governance is needed there

---

## 🟠 High Recommendations

### REC-03 [260306-frontend-standards] — Acknowledge Zustand Usage in `preference-frontend`

**Finding:** STY-03

§6.1 prohibits syncing server data into Zustand/Redux. `preference-frontend`
uses `zustand` (`package.json:50`).

- [ ] Audit `preference-frontend` Zustand stores to confirm they manage local UI
      state only (not GraphQL server data)
- [ ] If confirmed UI-only: update §6.1 to permit `zustand` for local/draft
      state — distinguish from "syncing server data"
- [ ] If confirmed mixed: raise a separate task to migrate server data back to
      Graphcache

---

### REC-04 [260306-frontend-standards] — Add Standard Metadata

**Finding:** DOC-02

- [ ] Add a metadata block to the top of `frontend-standards-overview.md`:
  ```
  Last Reviewed: YYYY-MM-DD
  Reviewed By: [Engineering Lead]
  Next Review: YYMMDD (6-month cadence recommended)
  ```
- [ ] Add this file to a documentation review schedule (can be a
      `docs/audits/audit-registry.md` note)

---

## 🟡 Low Recommendations

### REC-05 [260306-frontend-standards] — Document Approved UI Libraries

**Finding:** STK-02

`react-hook-form`, `zod`, `@tanstack/react-table`, `framer-motion` appear in
production apps without mention in the standard.

- [ ] Add a "Permitted UI Libraries" section to §1 or §9, listing:
  - Form handling: `react-hook-form` + `zod` (validation)
  - Tables: `@tanstack/react-table`
  - Animation: `framer-motion` (mobile/consumer apps only)
  - Date utilities: `date-fns`

---

### REC-06 [260306-frontend-standards] — Clarify Typography Standard

**Finding:** STY-04

§7 specifies `Inter` / `Roboto`. `planner-frontend` uses `Public Sans`.

- [ ] Either update §7 to list `Public Sans` as an approved alternative, or
      mandate `Inter` for `planner-frontend` and update the import in
      `planner-frontend/src/app/globals.css:1`

---

### REC-07 [260306-frontend-standards] — Verify "See Also" Links

**Finding:** DOC-01

- [ ] Review `state-management.md` content against §6 gold standards
- [ ] Review `graphql-standard.md` content against §3 and §6 gold standards
- [ ] Confirm `architecture.md` correctly reflects the current system topology

---

## Implementation Order

1. **REC-01** (blocker for all styling work — human decision required first)
2. **REC-02** (independent, low-risk scope fix)
3. **REC-04** (independent, metadata only)
4. **REC-03** (depends on REC-01 direction being set)
5. **REC-05**, **REC-06**, **REC-07** (independent documentation tasks)
