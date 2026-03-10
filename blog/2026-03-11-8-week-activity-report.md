---
slug: 8-week-activity-report
title: "What I Built in 8 Weeks"
authors: [ryan]
date: 2026-03-11T09:00:00+11:00
tags: [engineering, governance, product, clinical, devlog]
---

I said I hadn't been very busy. The commit history disagreed.

This is a summary of what I actually built across the Common Bond codebase
between January 13 and March 11, 2026 — pulled directly from the GitHub activity
log across all repositories.

<!--truncate-->

## The Numbers

| Metric                   | Count                                         |
| :----------------------- | :-------------------------------------------- |
| Active repositories      | 14                                            |
| Estimated merged commits | 120+                                          |
| New repositories created | 5                                             |
| Formal audits closed     | 9                                             |
| Languages/stacks touched | TypeScript, Python, PLpgSQL, JavaScript, Dart |

## Five Simultaneous Work Streams

### 1. Platform Bootstrap (Jan 13 – Feb 9)

The entire Receptor ecosystem migrated from GitLab to GitHub. Every repository
was updated: LLM context files, centralised agent rules, E2E authentication
refactoring across all frontends.

The Supabase schema got its first major expansion — attractiveness scoring,
hardened RLS policies, and a complete auth overhaul with modular functions and a
premium redesign. Three frontends implemented centralized auth in a single
coordinated push on 8 February.

The `rotator_worker` Flutter app shipped v1.38 (labelled "MAJOR" — the way I
always do when it actually is).

### 2. Product Feature Delivery (Feb 9 – Mar 4)

This was the densest development window.

**`preference-frontend`** received its most significant engineering investment
to date: a full GraphQL/Urql migration replacing direct Supabase REST calls.
This meant offline caching persistence, rewritten MSW intercept handlers, and
fixing concurrent/RLS test suites to match. Plus submission guardrails, conflict
detection, and performance benchmarks.

**`planner-frontend`** saw 17+ commits across five calendar days in March. The
highlights:

- Tailwind v4 upgrade
- "Premium Industrial" UI — a deliberate visual language decision
- A hierarchical service error system with adversarial testing
- TanStack Query provider replacing the previous data fetching layer
- A timeline and analytics view

**`workforce-frontend`** modernised its state management and standardised its
testing toolchain.

All three frontends ran their own adversarial audit cycles — independent code
reviews specifically looking for bugs and security issues I might have missed
while writing the code.

### 3. Clinical Tool Work (Mar 5–7)

`icu-survival` — the Docusaurus site used by Monash and Latrobe ICU doctors —
was rebuilt substantially in a single session.

On **7 March**, I committed 15 times in one day:

1. Migrated from Cloudflare Workers Sites to Pages Functions
2. Built a self-contained OAuth 2.0 PKCE flow (Google + Apple Sign-In, 30-day
   session TTL, IP bypass for Monash/Latrobe networks)
3. Invite code gating with rate limiting (5 attempts per email per 15 minutes)
4. Invite code analytics, admin dashboard, and revocation controls
5. JWKS JWT verification for Google One Tap
6. Page view analytics with admin "top pages"
7. TOS and Privacy Policy pages
8. Full README rewrite with architecture, KV schema, and deployment guide

On **5–6 March**, three reports from the 2025 Monash Health Medical Training
Survey were published — primary source data cross-validated against XLSX exports
and live government API calls. The ICU unaccredited cohort report was flagged
with a danger admonition: four converging distress signals including a 22×
wellbeing spike and a 34-percentage-point drop in support access. That's the
kind of finding that should go somewhere people can act on it.

Clinical content was also peer-reviewed: standardised terminology (Intensivist,
FiO₂, RRT), corrected medication errors, restructured shock and hyponatraemia
guidelines.

### 4. Governance Infrastructure (Mar 6–10)

A new Supabase instance (`supabase-common-bond`) was created specifically for
corporate governance data — completely separate from the product database. Seven
migrations were applied to production covering every governance table: ISMS
registers, audit registry, NC/CA log, SoA, compliance data. Twelve public tables
seeded.

Nine structured audits were completed across this period, each requiring:
findings issued, recommendations implemented across repositories, re-audit
performed, registry updated, PR merged. Areas covered included frontend
compliance, IP licensing, ISO 27001 AI-specific gaps, an audit of the audit
process itself, and governance register infrastructure.

A full ICU survival guide peer review of an Internal Medicine Journal manuscript
submission was also bootstrapped — custom Docusaurus tooling with seven React
components (IssuesTable, QuestionsTable, DataExtractsPanel, ChecklistPanel,
PdfViewer), full methodology docs, deployed to Cloudflare Pages.

### 5. Developer Tooling (Mar 9–10)

The final push: agent infrastructure consolidation across all 9 Receptor
ecosystem repositories simultaneously. Five category directories created in a
canonical location, 27 workflow files standardised to a JSON-native format,
local `.agents/` directories removed from every repo, symlinks created, 9 PRs
raised and merged on the same day.

This is the kind of work that's hard to explain to anyone not inside the
codebase. It doesn't ship a feature. But it halves the maintenance surface for
every future automation session.

---

## On Feeling Unproductive

The instinct to say "I haven't been very busy" made sense before I looked at the
data. None of these projects shipped to a public launch. A lot of the governance
and infrastructure work is invisible to anyone not reading the commit log.

But the actual picture is different. Work crossed professional domains in
parallel — software engineering alongside clinical informatics, corporate
governance, and academic peer review, all in the same eight-week window. Tasks
were completed to a standard that includes adversarial review, formal
re-auditing, and structured verification. Infrastructure investments were made
that compound over time.

The more interesting observation isn't the volume. It's that so much of this
work was _connective tissue_ — the kind of work that makes future work faster,
safer, and more legible. That type of effort tends to be invisible precisely
because it succeeds.

---

_Data source: GitHub API, `dm-ra-01`, all repositories, January 13 – March
11, 2026._
