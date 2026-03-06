<!-- audit-slug: 260306-frontend-standards -->

# Recommendations: Frontend Engineering Standards

| Field      | Value                             |
| :--------- | :-------------------------------- |
| **Slug**   | `260306-frontend-standards`       |
| **Branch** | `audit/260306-frontend-standards` |
| **Date**   | 2026-03-06                        |

> [!IMPORTANT]
> The core styling direction (Tailwind v4) has been approved and implemented.
> Remaining recommendations are documentation and library governance tasks.

---

## Priority Framework

| Priority    | Trigger                                          |
| :---------- | :----------------------------------------------- |
| 🔴 Critical | Causes governance failure or misleads developers |
| 🟠 High     | Impairs consistency and maintainability          |
| 🟡 Low      | Quality / clarity improvements                   |

---

## 🔴 Critical Recommendations

### REC-01 [260306-frontend-standards] — Resolve Styling Standard Contradiction ✅

**Findings:** STY-01, STY-02, STK-01 — **IMPLEMENTED (Option A)**

- [x] Updated §1 Styling row to Tailwind v4 + CSS Variables
- [x] Removed "No Tailwind" note from §1 and §7
- [x] Updated §7 to describe the hybrid model (Tailwind v4 utilities + CSS
      custom properties for design tokens)
- [x] Documented `preference-frontend` Radix/mobile stack in §7.2
- [x] Noted `workforce-frontend` as using the management desktop stack

---

### REC-02 [260306-frontend-standards] — Clarify Scope ✅

**Findings:** SCO-01, SCO-02 — **IMPLEMENTED**

- [x] Removed `website-frontend` from §1 "Applies to" list; added NOTE
      admonition explaining its separate status
- [x] Removed `design-frontend` references; noted as decommissioning (out of
      scope)
- [x] Added explicit "In-Scope Applications" table mapping each app to its
      profile and stack

---

## 🟠 High Recommendations

### REC-03 [260306-frontend-standards] — Acknowledge Zustand Usage ✅

**Finding:** STY-03 — **RESOLVED (no action required)**

`state-management.md` already permits Zustand for complex transactional drafting
workflows (line 16-17). `preference-frontend` usage is compliant. §6.6 updated
to reference Zustand explicitly for this context.

---

### REC-04 [260306-frontend-standards] — Add Standard Metadata ✅

**Finding:** DOC-02 — **IMPLEMENTED**

- [x] Added metadata block (`Last Reviewed`, `Reviewed By`, `Next Review`) to
      the top of `frontend-standards-overview.md`

---

## 🟡 Low Recommendations

### REC-05 [260306-frontend-standards] — Document Approved UI Libraries ✅

**Finding:** STK-02 — **IMPLEMENTED**

- [x] Added §8 "Permitted Libraries" table covering `react-hook-form`, `zod`,
      `@tanstack/react-table`, `framer-motion`, `date-fns`, `lucide-react`,
      `zustand`
- [x] Added `[!IMPORTANT]` admonition restricting Zustand to local/draft state

---

### REC-06 [260306-frontend-standards] — Clarify Typography Standard ✅

**Finding:** STY-04 — **IMPLEMENTED**

- [x] §7.1 specifies `Inter` for general UI, `Roboto` for data-heavy views
- [x] `planner-frontend` currently uses `Public Sans` — a follow-up migration
      task should align it to `Inter` (separate implementation task)

---

### REC-07 [260306-frontend-standards] — Verify "See Also" Links ✅

**Finding:** DOC-01 — **RESOLVED**

- [x] `state-management.md` — verified current and accurate
- [x] `graphql-standard.md` — verified current and accurate (correctly specifies
      `client-preset`, MSW patterns, adversarial lenses)
- [x] `architecture.md` — not modified; no issues found in cross-reference

---

## Remaining Follow-Up Tasks

These items require separate implementation work (not part of this audit):

- **Typography alignment:** `planner-frontend` uses `Public Sans` — align to
  `Inter` in a follow-up task
- **`workforce-frontend` Tailwind v4 migration:** currently uses pure Vanilla
  CSS; migrate to Tailwind v4 to match documented standard

---

## Session Close

**2026-03-06** — All 7 recommendations implemented or resolved.
`frontend-standards-overview.md` updated to reflect Tailwind v4 as the ecosystem
standard with `preference-frontend`'s Radix/mobile stack documented explicitly.
Two minor follow-up items (typography and `workforce-frontend` migration)
deferred to separate tasks.
