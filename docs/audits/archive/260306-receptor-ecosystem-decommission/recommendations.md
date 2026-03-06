<!-- audit-slug: 260306-receptor-ecosystem-decommission -->

# receptor-ecosystem Decommission — Recommendations

**Branch:** `audit/260306-reactor-ecosystem-decommission`\
**Date:** 2026-03-06

---

## 🔴 Critical

### REC-01 — Delete or supersede `platform/ecosystem-standards.md` immediately

`platform/ecosystem-standards.md` describes a technology stack (TailwindCSS 4,
TanStack Query, Radix UI, Sentry, Storybook, `npm create receptor-app`) that is
directly contradicted by actual implementations. This document is a
misinformation risk for new contributors.

- [x] `documentation/receptor-ecosystem` — Delete
      `docs/platform/ecosystem-standards.md`
- [x] `documentation/common-bond` — Create
      `/docs/engineering/frontend-standards-overview.md` that synthesizes the
      current Gold Standard from `gold-standard-state.md`,
      `graphql-standard.md`, and the `frontend-standards` agent rule. Target
      path:
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/frontend-standards-overview.md`

---

## 🟠 High

### REC-02 — Migrate ecosystem architecture overview to `common-bond`

`platform/architecture.md` is cross-repo, current, and accurate. It should
become the canonical architecture reference in `common-bond`.

- [x] `documentation/common-bond` — Create `docs/engineering/architecture.md`
      from `docs/platform/architecture.md`. Update the link in
      `docs/platform/security.md` references. Path:
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/architecture.md`

### REC-03 — Migrate gold standard design documents to `common-bond`

`gold-standard-state.md` and `graphql-standard.md` are the most current and
highest-quality documents in the site. They are cross-repo standards that all
three frontends follow.

- [x] `documentation/common-bond` — Migrate
      `docs/platform/design-standards/gold-standard-state.md` →
      `docs/engineering/state-management.md`
- [x] `documentation/common-bond` — Migrate
      `docs/platform/design-standards/graphql-standard.md` →
      `docs/engineering/graphql-standard.md`
- [x] Fix admonition syntax to Docusaurus v3 format (`:::tip[Title]`) in both
      files during migration.

### REC-04 — Migrate allocator-backend docs to `match-backend`

8 files in `platform/allocator-backend/` are the primary technical reference for
`backend/match-backend`.

- [x] `backend/match-backend` — Create `docs/` directory and migrate:
  - `algorithm.md`, `api-reference.md`, `architecture.md`, `business-rules.md`,
    `data-persistence.md`, `eligibility.md`, `models.md`, `index.md`
  - Base path:
    `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/docs/`

### REC-05 — Migrate `planner-backend/job-line-compliance/` docs to `receptor-planner`

7 files constitute the authoritative technical reference for the
`receptor-planner` Python service.

- [x] `backend/receptor-planner` — Create `docs/` directory and migrate:
  - `architecture.md`, `api-business-rules.md`, `core-logic.md`,
    `data-models.md`, `index.md`, `planner-instructions.md`,
    `ortools-scheduling-research.md`
  - Base path:
    `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/docs/`

### REC-06 — Delete `platform/security.md` (stale draft)

The file describes RLS as "Planned (Draft)" with open TODO items; the live
policies are implemented and documented in
`supabase-receptor/docs/rls-policies.md`. Leaving this in place risks
contradicting the current security posture.

- [x] `documentation/receptor-ecosystem` — Delete `docs/platform/security.md`
- [x] Verify that `supabase-receptor/docs/rls-policies.md` exists and is current
      before deletion.

### REC-07 — Resolve broken internal links before archiving

Multiple pages reference non-existent sibling pages (e.g.,
`../infrastructure/database/rls-policies`,
`infrastructure/operations/testing-guide`,
`../infrastructure/database/legacy-to-new-migration`).

- [x] Audit each migrated file for internal cross-links. Update any links that
      resolve within the new destination repo. Remove links to pages that no
      longer exist.

---

## 🟡 Medium

### REC-08 — Migrate user stories to respective frontend repos

6 files in `platform/user-stories/` belong co-located with their frontends.

- [x] `frontend/preference-frontend` — Migrate `preference-frontend/` stories (3
      files) to `docs/user-stories/`
- [x] `frontend/planner-frontend` — Migrate `planner-frontend/` story (1 file)
      to `docs/user-stories/`
- [x] Update any cross-references from `platform/security.md` (AB-01 links) if
      not deleted per REC-06.

### REC-09 — Migrate infrastructure runbooks to `supabase-receptor`

`common-bond-vm.md` and `config-guide.md` contain operational runbooks for the
Supabase host environment. While partially stale, they contain unique procedural
knowledge.

- [x] `supabase-receptor` — Create `docs/operations/vm-setup.md` by merging and
      modernising `common-bond-vm.md` and `config-guide.md` during migration.
  - Remove references to GitLab SSH — replace with GitHub equivalents.
  - Remove `supabase-launchpad` and `enlocated_supabase_legacy` references
    (stale project names).
  - Path:
    `/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/docs/operations/vm-setup.md`

### REC-10 — Migrate CI/CD doc to `rotator_worker`

`infrastructure/operations/ci-cd.md` covers the Codemagic pipeline for the
Flutter legacy app exclusively.

- [x] `frontend/rotator_worker` — Create `docs/ci-cd.md` from
      `infrastructure/operations/ci-cd.md`. Path:
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/rotator_worker/docs/ci-cd.md`

### REC-11 — Migrate OR-Tools migration report to `match-backend`

`projects/completed-misc/ortools-migration-report.md` contains unique technical
findings on the MILP solver migration with no duplicate elsewhere in the
ecosystem.

- [x] `backend/match-backend` — Add to `docs/` as `ortools-migration-report.md`
      Path:
      `/Users/ryan/development/common_bond/antigravity-environment/backend/match-backend/docs/ortools-migration-report.md`

### REC-12 — Migrate frontend app briefs to respective frontends

`platform/frontend-apps/receptor-preferencer.md`, `receptor-planner.md`,
`receptor-management.md` are product briefs for individual apps.

- [x] `frontend/preference-frontend` — Add `docs/product-brief.md` from
      `receptor-preferencer.md`
- [x] `frontend/planner-frontend` — Add `docs/product-brief.md` from
      `receptor-planner.md`
- [x] `frontend/rotator_worker` — Add `docs/product-brief.md` from
      `receptor-management.md`

### REC-13 — Migrate `public-landing-page.md` to `common-bond`

The public landing page brief covers Common Bond's marketing site and is
ecosystem-level business content.

- [x] `documentation/common-bond` — Add to `docs/product/landing-page.md` Path:
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/product/landing-page.md`

---

## 🟢 Low

### REC-14 — Archive planner dev journal (`planner-audit-1` through `planner-audit-6`)

6 sequential development journal entries for `receptor-planner`. Entirely
superseded; valuable only for historical provenance.

- [x] `backend/receptor-planner` — Create `docs/archive/` and place all 6 files
      there, clearly labelled as development journal artefacts (not current
      docs). Path:
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/docs/archive/`

### REC-15 — Delete internal-systems business planning doc

`infrastructure/security/internal-systems.md` is an informal ERP/CRM gap
analysis (target date April 2026) in the wrong location. If the roadmap for
business tooling is actively tracked, migrate to `common-bond/docs/governance/`.

- [x] `documentation/receptor-ecosystem` — Delete
      `docs/infrastructure/security/internal-systems.md`
- [x] ERP/CRM roadmap not actively tracked — no migration required.

### REC-16 — Delete agent scratch file

`platform/design-standards/audits/prompt.md` is an AI generation prompt, not
documentation.

- [x] `documentation/receptor-ecosystem` — Delete
      `docs/platform/design-standards/audits/prompt.md`

### REC-17 — Archive `projects/` section (22+ files)

The `projects/` section of 26 files tracks development initiatives that are now
complete, superseded, or tracked via GitHub Issues. Archive rather than migrate.

- [x] `documentation/receptor-ecosystem` — Do not migrate any file from
      `docs/projects/` except:
  - `ortools-migration-report.md` (handled by REC-11)
- [x] No summary project history created in `common-bond` — projects/ content is
      superseded; historical context is captured in the audit.md itself.

### REC-18 — Update `development-workspace.md` and remove receptor-ecosystem reference

`infrastructure/environment/development-workspace.md` references
`documentation/receptor-ecosystem/` as an active documentation site. Once
decommissioned, this will be a stale link.

- [x] Update `README.md` in the root workspace to reflect the decommission.
- [x] Documentation section updated with table of co-located doc locations and
      decommission notice. receptor-ecosystem link removed from setup guide.

---

## Implementation Order

Priority execution phases for the implementation agent:

| Phase | Recs                                   | Description                                                | Effort |
| :---- | :------------------------------------- | :--------------------------------------------------------- | :----- |
| **1** | REC-01, REC-06, REC-15, REC-16         | Immediate deletions — eliminate misinformation             | Low    |
| **2** | REC-02, REC-03                         | Migrate ecosystem standards to `common-bond`               | Medium |
| **3** | REC-04, REC-05, REC-11                 | Migrate backend technical docs to respective repos         | Medium |
| **4** | REC-08, REC-09, REC-10, REC-12, REC-13 | Migrate frontend and ops docs                              | Medium |
| **5** | REC-14, REC-17, REC-18                 | Archive and housekeeping                                   | Low    |
| **6** | REC-07                                 | Broken link audit and resolution across all migrated files | Low    |

> [!NOTE]
> After all migrations in each phase are complete, run `npm run gen-graph` in
> `documentation/common-bond/` to keep the knowledge graph in sync with newly
> added pages.

---

---

## Session Close — Finalisation (2026-03-06)

**Re-Audit Status:** ✅ All 18 recommendations verified as implemented\
**Re-Audit file:** [`re-audit.md`](./re-audit.md)\
**Build verification:** `npm run build` passes in `documentation/common-bond`
(`[SUCCESS] Generated static files in "build"`)

### Verification Summary

| REC    | Scope                        | Evidence                                                                      |
| :----- | :--------------------------- | :---------------------------------------------------------------------------- |
| REC-01 | Delete ecosystem-standards   | `documentation/receptor-ecosystem` fully decommissioned (dir gone)            |
| REC-02 | Architecture → common-bond   | `common-bond/docs/engineering/architecture.md` ✅                             |
| REC-03 | Gold standards → common-bond | `state-management.md`, `graphql-standard.md` ✅                               |
| REC-04 | Allocator → match-backend    | 8 files in `match-backend/docs/allocator/` ✅                                 |
| REC-05 | Planner → receptor-planner   | 7 files in `receptor-planner/docs/job-line-compliance/` ✅                    |
| REC-06 | Delete security.md           | receptor-ecosystem deleted ✅                                                 |
| REC-07 | Broken links resolved        | Build passes; no new broken links introduced ✅                               |
| REC-08 | User stories → frontends     | `preference-frontend/docs/user-stories/` (3 files), `planner-frontend` (1) ✅ |
| REC-09 | VM setup → supabase-receptor | `supabase-receptor/docs/operations/vm-setup.md` ✅                            |
| REC-10 | CI/CD → rotator_worker       | `rotator_worker/docs/ci-cd.md` ✅                                             |
| REC-11 | OR-Tools → match-backend     | `match-backend/docs/ortools-migration-report.md` ✅                           |
| REC-12 | Product briefs → frontends   | product-brief.md in preference, planner, rotator_worker ✅                    |
| REC-13 | Landing page → common-bond   | `common-bond/docs/product/landing-page.md` ✅                                 |
| REC-14 | Archive dev journal          | `receptor-planner/docs/archive/` (6 planner-audit-*.md files) ✅              |
| REC-15 | Delete internal-systems.md   | receptor-ecosystem deleted ✅                                                 |
| REC-16 | Delete prompt.md             | receptor-ecosystem deleted ✅                                                 |
| REC-17 | Archive projects/            | receptor-ecosystem deleted; ortools handled via REC-11 ✅                     |
| REC-18 | Update root README.md        | Decommission notice on lines 47 & 146 of README.md ✅                         |

This audit is **CLOSED**.

---

## Out of Scope

The following matters were observed but are out of scope for this decommission
audit:

- `documentation/receptor-ecosystem` Docusaurus site configuration,
  `sidebars.ts`, and `docusaurus.config.ts` — these are for the next
  implementation agent to handle as a teardown task.
- `blog/` section — not reviewed as it contains site blog posts; recommend
  deleting with the site.
- `static/knowledge-graph.json` — will become stale; no action needed if site is
  deleted.
