<!-- audit-slug: 260311-about-us-documentation -->

# Recommendations — About-Us Documentation Audit

**Branch:** `audit/260311-about-us-documentation`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-11

> [!NOTE]
> This file is **auto-generated** from `recommendations.json`.
> Do not edit it directly — edit the JSON source and re-run
> `python .agents/scripts/render-recommendations.py recommendations.json`.

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| Legal entities | Include both MyJMO Pty Ltd (ACN 648 051 852, IP Owner) and Common Bond Pty Ltd (ACN 694 840 394, Exclusive Licensee, Trustee for Ammendolea Family Trust ABN 50 152 085 287). Document the software licence relationship. |
| StartSpace affiliation | Include StartSpace as a community affiliation on where-we-are.md. Open community of early-stage founders powered by State Library Victoria. |
| PMCV relationship | NO existing formal relationship. Actively working to build one. Monash Health work has piqued PMCV interest. Describe as relationship-building in progress only. |
| Tone | Mostly structured/professional, but occasional personal and candid statements are appropriate — especially on where-we-are.md and founder.md. |
| Headshot photo | Leave a <!-- TODO: add headshot image path --> placeholder comment in founder.md. |
| INFO-04 (our-technology page) | Approved. Internal brief before customer engagements. All repos are private — do not link externally. Include a full internal repo table. |
| INFO-05 (Our Story timeline) | Approved. Mermaid timeline 2005–2026 on founder.md. |
| INFO-06 (ACN numbers) | Approved. MyJMO Pty Ltd ACN 648 051 852; Common Bond Pty Ltd ACN 694 840 394. |
| INFO-07 (SEO frontmatter) | Approved. All about-us pages must include description: frontmatter. |
| INFO-08 (intro.md cross-link) | Approved. Add About Us to Corporate Framework section of intro.md. |
| INFO-09 (who-we-serve page) | Approved. Name Monash Health as active pilot engagement. Profile the typical Medical Workforce Unit customer. |
| INFO-10 (values in action) | Approved. Add concrete example per brand pillar on who-we-are.md. |
| INFO-11 (internal repo table on our-technology.md) | Approved. All repos are private. This is an internal-only brief for pre-customer engagement preparation. Include full internal repo table. |
| INFO-12 (last_reviewed frontmatter) | Approved. Add last_reviewed: 2026-03-11 to all about-us pages. |
| INFO-13 (collapsed: false) | Approved. Set collapsed: false in _category_.json. |


---

## 🟢 Low

### INFO-01: The docs/about-us/ directory was created but contains zero files. Missing cohesive narrative on who Common Bond is, who 

Affects: `doco-common-bond` — docs/about-us


- [x] Create docs/about-us/_category_.json with sidebar label, position 0, collapsed: false, and generated-index link.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/_category_.json`
      _(Completed: 2026-03-11T11:29:00+11:00)_
- [x] Create docs/about-us/index.md as the hub page with card grid linking to all sub-pages, TL;DR summary, and description: frontmatter.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/index.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_
- [x] Create docs/about-us/founder.md as narrative-first profile of Dr Ryan Ammendolea: headshot placeholder, origin story, dual clinical/engineering identity, Mermaid timeline (INFO-05), personal vision statement, last_reviewed: 2026-03-11. Link to strategy/strategy-vision/founder.md for full CV.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/founder.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_
- [x] Create docs/about-us/who-we-are.md: Common Bond Pty Ltd (ACN 694 840 394, trustee for Ammendolea Family Trust ABN 50 152 085 287) and MyJMO Pty Ltd (ACN 648 051 852, IP owner), software licence relationship, solo-founder EOS model, four brand pillars with concrete 'in action' examples (INFO-07), last_reviewed: 2026-03-11.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/who-we-are.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_
- [x] Create docs/about-us/what-we-do.md: Receptor product suite (Workforce, Planner, Preferencer, Allocator), problem solved, SaaS+Consulting flywheel, in/out-of-scope boundaries, last_reviewed: 2026-03-11. Cross-link to strategy/strategy-vision/vision.md.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/what-we-do.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_
- [x] Create docs/about-us/where-we-are.md: pre-revenue active development stage, quarterly rocks, StartSpace community context, solo-founder reality, PMCV relationship-building (piqued interest via Monash Health), last_reviewed: 2026-03-11.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/where-we-are.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_
- [x] Create docs/about-us/our-aims.md: 1yr FY2026 targets (Monash pilot + 3 SaaS clients), 3yr FY2028 ($250k+ ARR, VIC+SA+WA), 10yr (national standard for all healthcare trainee allocations), last_reviewed: 2026-03-11. Cross-link to operations/eos/vto.md.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/our-aims.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-02: No aboutUsSidebar autogenerated entry exists in sidebars.ts.

Affects: `doco-common-bond` — sidebars.ts


- [x] Add aboutUsSidebar autogenerated entry for dirName 'about-us' to sidebars.ts.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/sidebars.ts`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-03: No navbar item exists for the About Us section.

Affects: `doco-common-bond` — docusaurus.config.ts


- [x] Add a top-level 'About Us' navbar item in docusaurus.config.ts pointing at the aboutUsSidebar, positioned before the Business dropdown.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docusaurus.config.ts`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-04: No non-technical technology overview exists for advisors and partners. The our-technology.md page serves as an internal 

Affects: `doco-common-bond` — docs/about-us


- [x] Create docs/about-us/our-technology.md as an internal pre-customer-engagement brief: plain-language overview of the full technology stack (Supabase, Cloudflare, OR-Tools/Python match-backend, Next.js frontends, Flutter mobile); include a table of all internal repos with one-line descriptions (supabase-receptor, match-backend/planner-backend, planner-frontend, workforce-frontend, preference-frontend, documentation); explain the 'why' behind each choice. last_reviewed: 2026-03-11.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/our-technology.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-05: No chronological origin story timeline exists. A Mermaid timeline from 2005–2026 would make the journey credible and hum

Affects: `doco-common-bond` — docs/about-us/founder.md


- [x] Add a Mermaid timeline to docs/about-us/founder.md spanning: 2005 (engineering career start), 2007–2010 (BSc Internetworking, Murdoch), 2008–2020 (St John Ambulance), 2016–2019 (MD, Notre Dame), 2020 (internship Fiona Stanley & Fremantle), 2021 (Critical Care HMO Monash), 2023 (ICU Registrar + Receptor v1 + Monash ICU Survival Guide), 2024 (Receptor public launch), 2026 (first major pilot).
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/founder.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-06: Legal entity table should include ASIC ACN numbers. Confirmed: MyJMO Pty Ltd ACN 648 051 852; Common Bond Pty Ltd ACN 69

Affects: `doco-common-bond` — docs/about-us/who-we-are.md


- [x] Include ACN numbers in who-we-are.md entity table: MyJMO Pty Ltd ACN 648 051 852 (IP Owner); Common Bond Pty Ltd ACN 694 840 394 (Exclusive Licensee, Trustee for Ammendolea Family Trust ABN 50 152 085 287).
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/who-we-are.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-07: All about-us pages lack description: frontmatter for Docusaurus SEO and generated-index card previews.

Affects: `doco-common-bond` — docs/about-us


- [x] Ensure all about-us markdown files include description: frontmatter (1–2 sentences, SEO-friendly). Satisfied inline as each file is created in INFO-01 and INFO-04.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-08: Homepage intro.md has no link to About Us, making the section undiscoverable from the entry point.

Affects: `doco-common-bond` — docs/intro.md


- [x] Add an 'About Us' entry to the Corporate Framework section of docs/intro.md, linking to ./about-us/ with a brief one-line description.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/intro.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-09: No page describes who uses Receptor or the profile of Common Bond's target customers. At this pre-revenue stage, naming 

Affects: `doco-common-bond` — docs/about-us


- [x] Create docs/about-us/who-we-serve.md: profile the target customer (Medical Workforce Units in metropolitan Australian health services), name Monash Health as the active pilot engagement, describe the typical decision-maker (Director of Medical Services or Medical Workforce Manager), note the expansion pathway (interstate, specialist colleges, nursing). last_reviewed: 2026-03-11.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/who-we-serve.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-10: The four brand pillars on who-we-are.md will be stated without proof points. Concrete 'in action' examples per pillar tr

Affects: `doco-common-bond` — docs/about-us/who-we-are.md


- [x] Add an 'Our Values in Action' section to who-we-are.md with one concrete example per pillar: Clinical Empathy (Ryan works rostered ICU shifts while building Receptor); Explainable Integrity (every allocation decision in Receptor is mathematically traceable, not black-box); Operational Agility (entire multi-app enterprise platform built and maintained by one engineer); Shared Bond (preferencing system put decision-making back in the hands of junior doctors). Satisfied within INFO-01-T4.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/who-we-are.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-11: our-technology.md should include a table of all internal repositories as an internal architecture brief, helping the fou

Affects: `doco-common-bond` — docs/about-us/our-technology.md


- [x] Include a full internal repository table in our-technology.md listing all repos with one-line descriptions: supabase-receptor (Postgres/Auth/RLS/migrations), match-backend/planner-backend (Python OR-Tools + FastAPI allocation engine), planner-frontend (Next.js job line planning UI), workforce-frontend (Next.js position/team/staff management UI), preference-frontend (Next.js worker preferencing), dev-environment (shared agent infrastructure, scripts, schemas), documentation (all Docusaurus documentation sites). Mark as internal brief only. Satisfied within INFO-04-T1.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/our-technology.md`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-12: About-us pages have no explicit last_reviewed date. As the company grows, these pages will need periodic refreshing; a r

Affects: `doco-common-bond` — docs/about-us


- [x] Add last_reviewed: 2026-03-11 frontmatter to all about-us markdown files. Satisfied inline as each file is created in INFO-01, INFO-04, and INFO-09.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/`
      _(Completed: 2026-03-11T11:29:00+11:00)_

### INFO-13: Docusaurus sidebar categories default to collapsed. For About Us, expanded-on-render is better UX — visitors immediately

Affects: `doco-common-bond` — docs/about-us/_category_.json


- [x] Set collapsed: false in docs/about-us/_category_.json. Satisfied within INFO-01-T1.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/_category_.json`
      _(Completed: 2026-03-11T11:29:00+11:00)_


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | INFO-01, INFO-04, INFO-05, INFO-06, INFO-07, INFO-09, INFO-10, INFO-11, INFO-12, INFO-13 | All content creation tasks — 9 about-us markdown files plus _category_.json. INFO-05, INFO-06, INFO-07, INFO-10, INFO-11, INFO-12, INFO-13 are satisfied inline within the files created by INFO-01, INFO-04, and INFO-09. |
| 2 | INFO-02, INFO-03, INFO-08 | Navigation wiring and homepage cross-link. Applied after content files exist. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| INFO-01 | docs/about-us | `_category_.json` | Documentation Gap | 🟢 Low |
| INFO-02 | sidebars.ts | `sidebars.ts` | Configuration Gap | 🟢 Low |
| INFO-03 | docusaurus.config.ts | `docusaurus.config.ts` | Configuration Gap | 🟢 Low |
| INFO-04 | docs/about-us | `our-technology.md` | Documentation Gap | 🟢 Low |
| INFO-05 | docs/about-us/founder.md | `founder.md` | Documentation Gap | 🟢 Low |
| INFO-06 | docs/about-us/who-we-are.md | `who-we-are.md` | Documentation Gap | 🟢 Low |
| INFO-07 | docs/about-us | `about-us` | Documentation Gap | 🟢 Low |
| INFO-08 | docs/intro.md | `intro.md` | Documentation Gap | 🟢 Low |
| INFO-09 | docs/about-us | `who-we-serve.md` | Documentation Gap | 🟢 Low |
| INFO-10 | docs/about-us/who-we-are.md | `who-we-are.md` | Documentation Gap | 🟢 Low |
| INFO-11 | docs/about-us/our-technology.md | `our-technology.md` | Documentation Gap | 🟢 Low |
| INFO-12 | docs/about-us | `about-us` | Documentation Gap | 🟢 Low |
| INFO-13 | docs/about-us/_category_.json | `_category_.json` | Configuration Gap | 🟢 Low |


---

## Session Close — 2026-03-11

**Completed:** INFO-01, INFO-02, INFO-03, INFO-04, INFO-05, INFO-06, INFO-07, INFO-08, INFO-09, INFO-10, INFO-11, INFO-12, INFO-13 (all 13 findings, all 19 tasks)

**Remaining:** None — audit complete

**Blocked:** None

**PR order note:** Single-repo audit; one PR for `doco-common-bond` into `main`.

**Brief for next agent:** All about-us content is implemented in `docs/about-us/` (9 files). Navigation wired in `sidebars.ts`, `docusaurus.config.ts`, and `docs/intro.md`. User also added blog configuration (`docusaurus.config.ts` blog section + Journal navbar item + `blog/` directory) on the same branch. PMCV is accurately described as relationship-in-progress. ACNs for both entities are embedded in `who-we-are.md`.
