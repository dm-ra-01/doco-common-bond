---
title: receptor-ecosystem Decommission Audit
sidebar_position: 1
---

# receptor-ecosystem Docusaurus Site Decommission Audit

**Date:** 2026-03-06\
**Scope:** `documentation/receptor-ecosystem/docs/` — 80 markdown files across 6
top-level sections\
**Auditor:** Ryan Ammendolea\
**Branch:** `audit/260306-receptor-ecosystem-decommission`

---

## Executive Summary

The `receptor-ecosystem` Docusaurus site (80 `.md` files) was originally built
as a catch-all for technical documentation, project tracking, and operational
runbooks. As the ecosystem matured, documentation has progressively migrated to
co-located `docs/` folders within each repository and the `common-bond` site.
This audit categorises every file into one of four dispositions: **Migrate to
common-bond**, **Migrate to repo**, **Archive (superseded/stale)**, or **Delete
(no value retained)**.

| Section                         | Files  | Migrate → common-bond | Migrate → repo | Archive | Delete |
| :------------------------------ | :----: | :-------------------: | :------------: | :-----: | :----: |
| `audits/`                       |   1    |           —           |       1        |    —    |   —    |
| `infrastructure/`               |   7    |           —           |       5        |    1    |   1    |
| `platform/` (design-standards)  |   5    |           2           |       —        |    2    |   1    |
| `platform/` (allocator-backend) |   8    |           —           |       8        |    —    |   —    |
| `platform/` (frontend-apps)     |   6    |           4           |       —        |    2    |   —    |
| `platform/` (planner-backend)   |   13   |           —           |       7        |    6    |   —    |
| `platform/` (top-level)         |   6    |           1           |       1        |    3    |   1    |
| `platform/` (user-stories)      |   6    |           —           |       6        |    —    |   —    |
| `projects/`                     |   26   |           —           |       —        |   22    |   4    |
| `intro.md`                      |   1    |           —           |       —        |    —    |   1    |
| **Total**                       | **80** |         **7**         |     **27**     | **36**  | **7**  |

---

## 1. `audits/` Section (1 file)

### `audits/2026-02-28-best-practice.md`

**Disposition: Migrate → `supabase-receptor/docs/audits/`**

A schema best-practice audit for the CP-SAT planner schema (Feb 2026). Content
is entirely database-specific (RLS subquery wrapping, `SECURITY DEFINER` search
path). Belongs co-located with the `supabase-receptor` repo. Most actionable
items are marked complete; the file retains archival value.

**Gaps:** Uses legacy `:::info` / `:::warning` admonition syntax without
explicit `title:` — would fail Docusaurus v3 strict mode.

---

## 2. `infrastructure/` Section (7 files)

### `infrastructure/environment/common-bond-vm.md`

**Disposition: Migrate → `supabase-receptor/docs/` (or standalone infra
runbook)**

Documents the Ubuntu Hyper-V VM that hosts Docker/Supabase. References a legacy
project structure (`enlocated_supabase_legacy`), hardcoded test user UUIDs, and
an incomplete TODO section. Informationally valuable for the VM operator but
ecosystem-external.

**Gaps:** References `enlocated_supabase_legacy` (stale project name); TODO
markers are unresolved.

### `infrastructure/environment/config-guide.md`

**Disposition: Migrate → `supabase-receptor/docs/` (or standalone infra
runbook)**

Covers SSH hardening, Docker installation, Google Chrome/Antigravity setup on
Ubuntu, swap configuration, VSCode watcher exclusions, Node.js via `nvm`, and
GitLab SSH key setup.

**Gaps:** Titled "VM Configuration Guide" but lives under
`infrastructure/environment/`. References GitLab but org now uses GitHub. The
VSCode watcher exclusions reference `supabase-launchpad` (stale name).

### `infrastructure/environment/development-workspace.md`

**Disposition: Migrate → root workspace `README.md` or `antigravity-environment`
repo docs**

Describes the monorepo workspace structure, agent rules, and contributor
onboarding. Most useful as a root-level contributor guide. Content accurately
reflects present structure (`.agent/rules/` etc.).

**Gaps:** Lists `documentation/receptor-ecosystem` as an active site — will
become stale post-decommission.

### `infrastructure/operations/audit-2026-02-16.md`

**Disposition: Archive (superseded)**

CI/CD gap analysis from February 2026. The 260306-audit-process global audit and
subsequent implementation work has superseded the findings here (GitHub Actions
and quality gates are now implemented in all active frontends).

**Gaps:** Still marks Playwright/Vitest pipelines as "Local-Only" which is no
longer accurate as of March 2026.

### `infrastructure/operations/ci-cd.md`

**Disposition: Migrate → `frontend/rotator_worker/docs/`**

Describes the Codemagic CI/CD pipeline for the legacy Flutter app
(`rotator_worker`). Entirely repo-specific.

### `infrastructure/security/internal-systems.md`

**Disposition: Delete (business planning artefact; wrong home)**

A gap analysis for ERP/CRM/HRIS tooling with a target date of April 2026. This
is a business operations document, not a technical doc. It belongs either in
`common-bond/docs/governance/` or deleted outright; it has no technical
substance.

---

## 3. `platform/design-standards/` (5 files)

### `design-standards/gold-standard-state.md`

**Disposition: Migrate → `common-bond/docs/engineering/state-management.md`**

High-quality, current, and accurate. Defines the Urql Graphcache gold standard
(IndexedDB persistence, `isEditing` pattern, optimistic UI) that all three
frontends follow. Cross-repo applicability makes `common-bond` the right home.

### `design-standards/graphql-standard.md`

**Disposition: Migrate → `common-bond/docs/engineering/graphql-standard.md`**

High-quality, current. Covers Urql client config, MSW mocking patterns, Vitest
workspace setup, and adversarial testing philosophy. Cross-repo standard
document.

### `design-standards/audits/260304/audit.md` and `recommendations.md`

**Disposition: Archive (superseded)**

The 260304 frontend stack audit is marked `COMPLETE / SIGNED`. Its findings have
been implemented (ACL modernization, GraphQL consolidation). The authoritative
record now lives in `supabase-receptor/docs/audits/archive/` and is indexed in
the common-bond audit registry.

**Note:** These files present stale data (e.g., "Tailwind CSS 4.0" in the stack
table — at time of audit this was the planned stack; the apps actually use
Vanilla CSS).

### `design-standards/audits/prompt.md`

**Disposition: Delete**

An internal AI prompt used to generate the 260304 audit. Zero documentation
value; it is an agent scratch file.

---

## 4. `platform/allocator-backend/` (8 files)

**Disposition: All 8 files → Migrate to `backend/match-backend/docs/`**

The allocator backend section (algorithm, API reference, architecture, business
rules, data persistence, eligibility, models, index) is the primary technical
reference for `match-backend`. Co-location with the repository makes discovery
and maintenance easier.

**Gaps:** `api-reference.md` references environment-specific URL patterns that
may need updating. `eligibility.md` cross-links to the planner which may no
longer exist post-decommission.

---

## 5. `platform/frontend-apps/` (6 files)

### `frontend-apps/receptor-preferencer.md`, `planner-backend.md`, `receptor-management.md`

**Disposition: Migrate → respective frontend `docs/` directories**

Each file is a product brief for the corresponding frontend app.
`receptor-management.md` covers the deprecated Flutter admin — archive it in
`frontend/rotator_worker/docs/`.

### `frontend-apps/public-landing-page.md`

**Disposition: Migrate → `common-bond/docs/product/`** (or
`website-frontend/docs/`)

A product brief for the public landing/marketing site — ecosystem-level
positioning content appropriate for `common-bond`.

### `frontend-apps/receptor-preferencer-user-stories.md` and `receptor-preferencer-ui-design.md`

**Disposition: Archive (superseded)**

Early-phase user stories and UI design notes for the Preferencer that predate
the current implementation. The preferencer is now complete and the
authoritative design intent lives in KI `preference_frontend_system_design`.

---

## 6. `platform/planner-backend/` (13 files)

### `planner-audit-1.md` through `planner-audit-6.md`

**Disposition: Archive (6 files, completed dev journal entries)**

Sequential audit/development journal entries documenting the iterative
development of `planner-backend`. Valuable as historical artefacts but entirely
superseded by the current codebase state. If retained, move to
`backend/planner-backend/docs/archive/`.

### `job-line-compliance/` (7 files: architecture, api-business-rules, core-logic, data-models, index, planner-instructions, ortools-scheduling-research)

**Disposition: Migrate to `backend/planner-backend/docs/`**

These are the authoritative technical reference docs for the `planner-backend`
Python service. `ortools-scheduling-research.md` in particular contains unique,
non-superseded solver design rationale.

**Gaps:** `survey-abstraction-strategy.md`, `state-strategies.md`, and
`refactor-project.md` are mid-project planning docs (Disposition: Archive).

### `postgresql-schema.md`

**Disposition: Archive (superseded)**

A legacy schema reference that predates the current declarative
`supabase/schemas/` structure. The `database-schema.md` in
`supabase-receptor/docs/` is the SSOT.

---

## 7. `platform/` Top-Level (6 files)

### `platform/architecture.md`

**Disposition: Migrate → `common-bond/docs/engineering/architecture.md`**

The ecosystem architecture overview (Mermaid diagrams, component table, Supabase
services, infrastructure diagram) is cross-repo in nature and belongs in
`common-bond`. It is current and accurate.

### `platform/ecosystem-standards.md`

**Disposition: Archive / do not migrate (significantly stale)**

This 282-line document references the wrong technology stack: **TailwindCSS 4**
and **TanStack Query** are cited as mandatory, but the actual ecosystem uses
**Vanilla CSS** and **Urql/Graphcache**. A number of aspirational standards
(command palette, Sentry, `npm create receptor-app`) are unimplemented.
Migrating this document would legitimize stale standards; content should be
superseded by `common-bond`'s `engineering/` section drawing from current KIs.

**Severity: 🔴** — This document directly contradicts the documented gold
standard if encountered by a new contributor.

### `platform/database-functions.md`

**Disposition: Migrate → `supabase-receptor/docs/`**

A reference for Supabase database functions. Repo-specific; belongs co-located.

### `platform/security.md`

**Disposition: Archive (highly stale)**

References RLS policies as "planned / draft", with open `:::info TODO` blocks.
The finalized RLS architecture is documented in
`supabase-receptor/docs/rls-policies.md` and the ACL architecture KI. This file
would mislead readers.

### `platform/onboarding.md` and `platform/ui-ux-plans.md`

**Disposition: Archive**

Early-phase onboarding flow notes and UI/UX planning documents. Superseded by
current implementation.

---

## 8. `platform/user-stories/` (6 files)

**Disposition: All 6 files → Migrate to respective frontend `docs/`
directories**

- `preference-frontend/` stories (3 files) →
  `frontend/preference-frontend/docs/user-stories/`
- `planner-frontend/` stories (1 file) →
  `frontend/planner-frontend/docs/user-stories/`
- `index.md` → useful index, could accompany the above

**Gaps:** User story files reference `AB-01` abuse scenario cross-links that
will break on move.

---

## 9. `projects/` Section (26 files)

The entire `projects/` section documents development initiatives that are either
completed, superseded, or now tracked via GitHub Issues/PRs.

### Completed (`projects/completed-misc/`) — 2 files

- `common-bond-setup.md` → Archive; historical "First 30 Days" operational
  roadmap.
- `ortools-migration-report.md` → Migrate to `backend/match-backend/docs/`;
  unique technical findings on solver migration from OR-Tools.

### `projects/core-suite/` — 4 files

All completed project briefs (`frontend-redevelopment.md`,
`planner-frontend.md`, `preferencer-frontend.md`, `workforce-frontend.md`).
**Archive.**

### `projects/hybrid-ai/` — 2 files

AI co-pilot planning documents (`planner-ai.md`, `preferencer-ai.md`). Not
started; entirely aspirational. **Archive.** If the AI roadmap is still
relevant, migrate summary to `common-bond/docs/product/roadmap.md`.

### `projects/infrastructure/` — 7 files

`supabase-migration.md`, `unified-cicd-pipeline.md`, `allocator-refactoring.md`
— projects now complete or superseded. **Archive.** `planner-integration/` (5
files) — the integration is complete. **Archive.**

### `projects/security-testing/` — 2 files

`security-audit.md` and `test-code-review.md` — "Not Started" status, superseded
by the 260304 ACL audit and the 260306 audit-process work. **Archive.**

### `projects/overview.md`

**Disposition: Delete** — provides a navigational overview of a section being
archived. No standalone value.

---

## 10. `intro.md`

**Disposition: Delete** — This is the Docusaurus site home page. Once the site
is decommissioned, it is meaningless.

---

## Cross-Cutting Observations

### Broken Internal Links

The `projects/overview.md` and `platform/architecture.md` reference pages that
have already fallen out of sync (`../infrastructure/database/rls-policies`,
`../infrastructure/database/legacy-to-new-migration`,
`infrastructure/operations/testing-guide`). These broken links confirm the site
has not been maintained as a cohesive unit.

### Admonition Syntax (Docusaurus v3)

Multiple files use `:::info`, `:::warning`, `:::tip` without a `title:`
parameter. While this renders correctly, strict Docusaurus v3 deployments (as
used in `common-bond`) require `:::info[Title]` syntax or use of the
`remark-docusaurus-admonitions` compatibility shim. Files migrated to
`common-bond` will need admonition updates.

### ecosystem-standards.md — Active Misinformation Risk

The most critical finding is `platform/ecosystem-standards.md`. It describes a
stack (TailwindCSS, TanStack Query, Radix UI, Storybook, Sentry) that does not
reflect the actual implementation (Vanilla CSS, Urql, no Storybook/Sentry). A
developer reading this document would form incorrect mental models of the
platform.

---

## Severity Summary

| Finding ID | File                                          | Category                                          | Severity    |
| :--------- | :-------------------------------------------- | :------------------------------------------------ | :---------- |
| DECOM-01   | `platform/ecosystem-standards.md`             | Architectural Drift / Active Misinformation       | 🔴 Critical |
| DECOM-02   | `infrastructure/security/internal-systems.md` | Wrong home — business doc in technical repo       | 🟠 High     |
| DECOM-03   | `platform/security.md`                        | Stale draft — contradicts live RLS implementation | 🟠 High     |
| DECOM-04   | Multiple — broken internal links              | Documentation Gap                                 | 🟠 High     |
| DECOM-05   | `infrastructure/environment/config-guide.md`  | GitLab SSH refs, stale project names              | 🟡 Medium   |
| DECOM-06   | Multiple — Docusaurus v3 admonition syntax    | Tech Debt                                         | 🟡 Medium   |
| DECOM-07   | `platform/design-standards/audits/prompt.md`  | Scratch agent file not removed                    | 🟢 Low      |
| DECOM-08   | `projects/` section (26 files)                | Stale project tracking                            | 🟢 Low      |
