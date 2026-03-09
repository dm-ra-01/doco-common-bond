---
name: audit-registry
description: >
    Canonical rules for reading and writing audit-registry.md, including the
    four permitted status values, when each status applies, who sets it, and
    the commit conventions for registry updates. Use this in any workflow that
    touches the audit registry: auditing, implementation, and finalisation.
---

# Audit Registry

The audit registry is the PROC-03 compliance record for all audits in the
ecosystem. **It must be updated before every session ends** — it is not optional
and is never deferred to a follow-up commit.

---

## Registry Location

```
documentation/common-bond/docs/audits/audit-registry.md
```

This file lives in the `common-bond` repo regardless of whether the audit is
cross-ecosystem or repo-local. Every audit (local and global) appears here.

---

## The Four Statuses

Use **only** these four values. Do not invent alternatives.

| Status             | Meaning                                                         | Who sets it                        |
| :----------------- | :-------------------------------------------------------------- | :--------------------------------- |
| 🔄 Drafting        | Audit branch open; `audit.md` and `recommendations.md` in draft | Audit agent                        |
| 📋 Findings Issued | Audit branch merged; implementation not yet started             | Audit agent (at merge)             |
| 🔧 Implementing    | Implementation actively underway (at least one task ticked)     | Implementation agent               |
| ✅ Closed          | All recommendations actioned **or formally deferred**           | Finalise agent (re-audit confirms) |

> [!IMPORTANT]
> **`✅ Closed` is not set when audit documents are finalised.** It is set only
> after the re-audit step of `/finalise-global-audit` or `/finalise-local-audit`
> confirms that every recommendation is either implemented or formally deferred.
> Setting `Closed` prematurely is a compliance error.

---

## Status Transition Rules

```
Audit agent creates audit branch
        ↓
  🔄 Drafting       ← set when first adding the registry row
        ↓
  (audit branch merged to main)
        ↓
  📋 Findings Issued ← set in the merge commit or immediately after
        ↓
  (implementation begins)
        ↓
  🔧 Implementing   ← set by the first implementation session
        ↓
  (all tasks ticked or deferred + re-audit passes)
        ↓
  ✅ Closed         ← set only by finalise workflow after re-audit
```

---

## Registry Row Format

When adding a row, follow the existing format in `audit-registry.md`. Include:

- Date heading (group rows under `## YYYY-MM` headings)
- Audit slug with link to `audit.md`
- Scope (repo or "Cross-ecosystem")
- Status (from the four above)
- Link to `recommendations.md`

Update the row in-place as the status transitions — do not add a second row for
the same audit.

---

## When to Update

| Workflow / moment                             | Action                                    |
| :-------------------------------------------- | :---------------------------------------- |
| Audit agent creates the audit directory       | Add row; set `🔄 Drafting`                |
| Audit branch merged to main                   | Update row; set `📋 Findings Issued`      |
| First implementation session begins           | Update row; set `🔧 Implementing`         |
| Finalise workflow confirms all tasks done     | Update row; set `✅ Closed`               |
| Audit is archived (files moved to `archive/`) | Update row links to point at archive path |

---

## Commit Conventions

Always commit the registry update **together** with the other files changed in
that step, not as a separate standalone commit.

| Step                            | Example commit message                                              |
| :------------------------------ | :------------------------------------------------------------------ |
| Initial audit files             | `audit(YYMMDD-slug): initial audit.md and recommendations.md`       |
| Status update (findings issued) | `audit(YYMMDD-slug): mark findings issued`                          |
| Session close (implementing)    | `audit(YYMMDD-slug): mark CROSS-NN complete; session close`         |
| Registry + archive (closed)     | `audit(YYMMDD-slug): close audit; update registry links to archive` |

> [!NOTE]
> Implementation agents commit the `recommendations.md` checkbox updates and the
> registry status update in the **same** commit. Never leave one without the
> other.

---

## After Archiving

When the finalise workflow moves audit files to `archive/`, update the registry
row links to point to the new paths:

```markdown
[audit.md](../audits/archive/YYMMDD-slug/audit.md)
[recommendations.md](../audits/archive/YYMMDD-slug/recommendations.md)
```

Commit this registry link update to `main` (not the audit branch, which will
have been deleted by this point).
