# Audit Process Audit

**Date:** 2026-03-06\
**Scope:** All `audit.md` and `implement-audit.md` workflow files across the
Receptor ecosystem and ICU Survival Guide. Repositories covered:
`supabase-receptor`, `receptor-planner`, `match-backend`, `planner-frontend`
(also covering `workforce-frontend` and `preference-frontend` via shared
workflow), `common-bond` (documentation), and `icu-survival` (external — note
§9).\
**Auditor:** Antigravity

---

## Executive Summary

The audit workflow is coherent, well-intentioned, and consistently enforces
feature-branch isolation across repositories that have workflow files. The core
loop — scope → research → adversarial lenses → findings → recommendations →
implement on branch → test-gate → user-approved merge — is sound. However,
several structural gaps reduce the system's robustness and auditability:
`workforce-frontend` and `preference-frontend` have **no audit workflows at
all** (they are independent applications with no `.agents/workflows/` audit
coverage), there is no cross-ecosystem registry of audits ever conducted, no
formal merge/PR review gate before branches land in `main`, no "Definition of
Done" checklist for the audit phase itself, Supabase Deno Edge Functions have no
dedicated audit scope, and minor formatting inconsistencies in session summary
templates that could cause agent confusion.

> **Note:** `workforce-frontend` and `preference-frontend` are independent
> Next.js applications. They have **no audit or implement-audit workflow files**
> — there is no defined process for auditing these two frontends until PROC-14
> is implemented.

#### Next.js frontends

| Criterion                       | planner-frontend | workforce-frontend | preference-frontend |
| ------------------------------- | :--------------: | :----------------: | :-----------------: |
| Dedicated audit workflow        |        ✅        |     ❌ missing     |     ❌ missing      |
| Feature branch enforced (audit) |        ✅        |         ❌         |         ❌          |
| Feature branch enforced (impl)  |        ✅        |         ❌         |         ❌          |
| Slug-qualified identifiers      |    ✅ (REC-)     |         ❌         |         ❌          |
| PR/review gate before merge     |        ❌        |         ❌         |         ❌          |
| Audit Definition of Done        |        ❌        |         ❌         |         ❌          |
| Session summary formatting      |     ✅ fixed     |         —          |          —          |
| Skill path portability          |        ⚠️        |         —          |          —          |
| Frontmatter accuracy            |        ✅        |         —          |          —          |

#### Infrastructure / Supabase

| Criterion                       | supabase-receptor | common-bond (docs) | icu-survival ¹ |
| ------------------------------- | :---------------: | :----------------: | :------------: |
| Dedicated audit workflow        |        ✅         |         ✅         |       ✅       |
| Feature branch enforced (audit) |        ✅         |         ✅         |       ✅       |
| Feature branch enforced (impl)  |        ✅         |         ✅         |       ✅       |
| Slug-qualified identifiers      |     ✅ (REC-)     |     ✅ (DOC-)      |   ✅ (AUD-)    |
| PR/review gate before merge     |        ❌         |         ❌         |       ❌       |
| Audit Definition of Done        |        ❌         |         ❌         |       ❌       |
| Session summary formatting      |        ✅         |      ✅ fixed      |    ✅ fixed    |
| Skill path portability          |        ⚠️         |        N/A         |      N/A       |
| Frontmatter accuracy            |     ✅ fixed      |      ✅ fixed      |    ✅ fixed    |
| Deno Edge Functions in scope    |        ❌         |         —          |       —        |

¹ External — Monash Health; outside Receptor ecosystem

#### Python backends

| Criterion                       | receptor-planner | match-backend |
| ------------------------------- | :--------------: | :-----------: |
| Dedicated audit workflow        |        ✅        |      ✅       |
| Feature branch enforced (audit) |        ✅        |      ✅       |
| Feature branch enforced (impl)  |        ✅        |      ✅       |
| Slug-qualified identifiers      |    ✅ (REC-)     |   ✅ (REC-)   |
| PR/review gate before merge     |        ❌        |      ❌       |
| Audit Definition of Done        |        ❌        |      ❌       |
| Session summary formatting      |        ✅        |   ✅ fixed    |
| Skill path portability          |        ⚠️        |      ⚠️       |
| Frontmatter accuracy            |        ✅        |      ✅       |

---

## 1. Feature Branch Enforcement

### 1.1 Branch Creation (Audit Phase)

**Strengths:**

- All six `audit.md` workflows now include an explicit
  `git checkout -b audit/YYMMDD-short-name` block before the
  `recommendations.md` template is written.
- The branch name is embedded as `**Feature branch:**` in the template, so
  implementation agents receive it in the document metadata without needing to
  infer it.
- The `> [!IMPORTANT]` block in all templates makes the constraint visually
  prominent.

**Gaps:**

- No workflow instructs the agent to verify that the branch was successfully
  pushed (i.e. `git push -u origin audit/YYMMDD-short-name` output is
  confirmed). An unpushed branch could be lost if the local machine is wiped
  before implementation begins.

**Historical context:**

Prior to the workflow formalisation undertaken in March 2026, all audit work —
findings, recommendations, and implementation commits — was committed directly
to `main`. Feature branch enforcement was introduced as part of this audit
workflow standardisation and was made mandatory retroactively across all
repositories. This audit (`260306-audit-process`) is the first to be conducted
entirely under the new branch-enforced process. Earlier audits (e.g.
`260304-acl`, `260305-match-backend`, `260305-graphql-state`) were implemented
directly on `main`; their audit and implementation records are preserved in
`docs/audits/archive/` but their branches cannot be retroactively reconstructed.

### 1.2 Branch Checkout (Implementation Phase)

**Strengths:**

- All six `implement-audit.md` workflows include a `git fetch origin` +
  `git checkout audit/YYMMDD-short-name` block in Step 1.
- If the branch is missing, the agent is instructed to stop and ask the user —
  not to create a fresh branch silently.

**Gaps:**

- No workflow instructs the agent to verify that the working tree is clean (no
  uncommitted changes from a prior session) before beginning work. A dirty
  working tree could contaminate the audit branch with unrelated changes.
- No workflow instructs the agent to confirm the branch is tracking the remote
  (`git status -sb` or `git branch -vv`), making it possible to push to an
  orphaned local branch that is never reflected on the remote.

---

## 2. Merge Gate — Missing PR/Review Stage

**Gaps:**

All `implement-audit.md` workflows specify a 3-condition merge gate:

1. All tasks `[x]`
2. Tests pass
3. User explicitly approves

However, none of the workflows specify:

- Creating a **pull request** for the `audit/` branch into `main`, giving the
  user a diff-based view of all changes before they land.
- Requesting a **review** (even self-review) on GitHub before merging.
- Linking the PR description to the `recommendations.md` slug so the PR is
  traceable in the repository history.

Without a PR, audit branch changes are merged silently. There is no durable,
browsable record in GitHub linking commits to audit tasks. If a future engineer
asks "what changed as part of audit `260305-rls`?", there is no PR to point to —
only commit messages which require knowing the slug.

**Impact:** Reduces the auditability of the audit process itself. The feature
branch exists for isolation, but without a PR the merge leaves no institutional
memory beyond commit messages.

---

## 3. Missing Global Cross-Ecosystem Audit Workflow

**Gaps:**

There is no workflow covering an audit that spans multiple repositories
simultaneously (e.g. "audit how authentication is implemented across
supabase-receptor, receptor-planner, match-backend, and all three frontends").
The current six workflow files cover repositories individually and do not
provide:

- A research pattern for cross-repo concerns (e.g. how to correlate RLS policy
  gaps in `supabase-receptor` with frontend JWT handling in `planner-frontend`).
- A cross-repo `recommendations.md` structure with a canonical home.
- Guidance on which repository owns the implementation of a cross-cutting fix.
- A slug namespace that is unambiguous across repositories (current slugs are
  repo-local; two different repos could both produce `260305-auth` without
  conflict discovery).

The user explicitly identified this as a known gap during the workflow design
conversation. Recommended home for a global audit workflow: `common-bond`
(`documentation/common-bond/.agents/workflows/global-audit.md`). Recommended
home for global audit reports: `docs/infrastructure/audits/` within the same
repository.

---

## 4. Missing Audit Registry

**Gaps:**

There is no index — in any repository or in the common-bond documentation site —
of audits that have been conducted. A future engineer or the user has no easy
answer to:

- "What did we audit last quarter?"
- "Has `match-backend` auth ever been audited?"
- "What is the status of the `260305-rls` audit — are all recommendations done?"

Each repository's `docs/audits/` directory contains the flat files but there is
no machine-readable or human-readable registry (e.g. an `index.md` in
`docs/audits/`, or a `docs/infrastructure/audits/index.md` in common-bond)
aggregating status across all repos.

---

## 5. Session Summary Template Inconsistencies

### 5.1 Fields on same line vs. backslash-newline format

**Expected format** (supabase-receptor, receptor-planner):

```markdown
**Audit slug:** `YYMMDD-short-name`\
**Feature branch:** `audit/YYMMDD-short-name`\
**Implemented this session:** REC-04 [YYMMDD-short-name], …\
**Test status:** All passing — [X] tests\
**Remaining:** …
```

**Actual format in match-backend** (`implement-audit.md` line 192–196):

```markdown
**Audit slug:** `YYMMDD-short-name` **Feature branch:**
`audit/YYMMDD-short-name` **Implemented this session:** REC-04
```

Fields are concatenated inline within the markdown code block. Without the `\`
trailing newlines, agents reading this template will produce a one-liner
summary.

**Same issue** in `icu-survival/implement-audit.md` at line 189–191.

**Impact:** Agents populating the session summary template will produce dense,
hard-to-parse summaries that reduce the quality of the handoff brief.

### 5.2 Session summary missing Feature branch field in planner-frontend

`planner-frontend/implement-audit.md` was not updated to include
`**Feature branch:**` in the session summary code block (lines 176–184). An
implementation agent on a planner-frontend audit will produce a session summary
that omits the branch name, meaning the next agent has to re-read
`recommendations.md` to discover which branch to check out.

---

## 6. Stale Frontmatter Descriptions

### 6.1 supabase-receptor implement-audit.md

`supabase-receptor/.agents/workflows/implement-audit.md` frontmatter (line 2):

```
description: Implement tasks … commits to main, then briefs the next agent …
```

The frontmatter was not updated when the workflow body was updated to enforce
feature-branch commits. The description is now factually incorrect.

### 6.2 common-bond implement-audit.md step 5 heading

`common-bond/.agents/workflows/implement-audit.md` Step 5 heading (line 171):

```markdown
## Step 5: Commit to Main
```

The heading was not updated when the body was changed to push to the feature
branch. An agent reading only the heading will receive the wrong instruction.

### 6.3 icu-survival implement-audit.md description

`icu-survival/.agents/workflows/implement-audit.md` frontmatter (line 2):

```
description: … commits to main, then briefs the next agent.
```

Same stale description issue — the body enforces branch commits, but the
frontmatter still says "main".

---

## 7. Adversarial Skill Path — Hardcoded Absolute Paths

All `audit.md` workflows reference the adversarial-code-review skill using an
absolute filesystem path, e.g.:

```
/Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/.agents/skills/adversarial-code-review/SKILL.md
```

This path is:

- Username-specific (`ryan`) — breaks if the repo is used by another developer
  or on a different workstation.
- Duplicated across all audit.md files — a rename of the skill directory would
  require updating six files.

The common-bond and icu-survival audit workflows do not reference the
adversarial skill at all (common-bond uses "Editorial Lens"; icu-survival lists
its own adversarial perspectives inline). This is a consistency gap — not a
defect, but it means the skill improvements are not automatically available to
documentation audits.

---

## 8. No Audit Definition of Done

None of the `audit.md` workflows include a formal checklist that an agent or
human reviewer can use to confirm that the audit is complete before
`recommendations.md` is finalised and handed off. Current flow goes from
"research" → "write audit.md" → "write recommendations.md" → `notify_user`
without any explicit gate. Specific gaps:

- No instruction to verify that **every finding in `audit.md` has a
  corresponding REC/DOC/AUD item** in `recommendations.md` (or an explicit
  decision not to act).
- No instruction to verify the **Implementation Order** is internally consistent
  (no circular dependencies, no Phase N+1 item depending on an unresolved Phase
  N item).
- No instruction to do a **final slug check** — confirm audit slug in `audit.md`
  header, `recommendations.md` HTML comment, all recommendation identifiers, and
  branch name are all consistent with each other.

---

## 9. Missing Dedicated Audit Coverage for Supabase Deno Edge Functions

`supabase-receptor` contains Deno/TypeScript Edge Functions (in
`supabase/functions/`) including shared utilities in
`supabase/functions/_shared/`. The `supabase-receptor/audit.md` workflow
mentions Edge Functions in the scope description but does not give them the same
systematic attention as SQL schemas, migrations, or RLS policies.

The current audit Step 3 research path only references Edge Functions as a
secondary check. There are no equivalent prompts for:

- **Security review of Deno functions** — checking for missing `Authorization`
  header validation, CORS misconfigurations, environment variable exposure, or
  `Deno.env.get()` calls leaking secrets.
- **Deno-specific testing** — there is no `supabase functions test` or
  `deno check` step equivalent to the pgTAP gate.
- **Shared utility review** — `_shared/` helpers are cross-cutting and
  high-blast-radius but not explicitly called out as an audit area.
- **TypeScript type safety** — no `deno check` type-check step in any audit or
  implement-audit workflow.

**Impact:** An audit of RLS and access control in supabase-receptor could pass
all pgTAP tests while leaving a privilege escalation vulnerability in an Edge
Function that bypasses RLS entirely. The two layers are not audited uniformly.

---

## 10. Missing Audit Workflows for workforce-frontend and preference-frontend

`workforce-frontend` and `preference-frontend` are independent Next.js
applications with no audit or implement-audit workflow files of their own.
Unlike `planner-frontend`, these two frontends have only a `git-workflow.md`
and skills under `.agents/`. There is no defined process for:

- Auditing their codebases adversarially.
- Scoping, recording, and tracking findings.
- Implementing audit recommendations on a feature branch with a test gate.

**Impact:** `workforce-frontend` owns the organisational capacity model (the
primary data source for the entire Receptor planning pipeline), and
`preference-frontend` handles worker preference collection and sentiment
mapping. Both are high-value audit targets with zero current coverage.

---

## 11. ICU Survival — Outside Receptor Ecosystem

`icu-survival` is a separate Docusaurus repository owned by (or operated for)
Monash Health and sits outside the Common Bond / Receptor product ecosystem. Key
distinctions:

- Recommendation identifiers use `AUD-NN [slug]` rather than `REC-NN [slug]`.
- Audit reports live in `dev-docs/audits/` not `docs/audits/` (important — the
  `docs/` content is the published clinical site; `dev-docs/` is internal).
- The merge gate must include **Lead Consultant clinical sign-off** for any
  protocol content changes, not just test pass + user approval.
- The repository does not participate in the common-bond Docusaurus build, has
  no Supabase integration, and has no pgTAP or pytest test suite.

These distinctions are correctly captured in the icu-survival workflows. The gap
is that there is no note in the global audit context (wherever that is defined)
distinguishing icu-survival's governance requirements from those of Receptor
repos.

---

## Severity Summary

| Finding ID | Area                                                               | File(s)                                            | Severity           |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------- | ------------------ |
| PROC-01    | Merge gate — no PR before merging audit branch                     | All implement-audit.md                             | 🟠 High            |
| PROC-02    | No global cross-ecosystem audit workflow                           | (missing)                                          | 🟠 High            |
| PROC-03    | No audit registry or index                                         | (missing)                                          | 🟠 High            |
| PROC-13    | Deno Edge Functions have no dedicated audit scope or test gate     | supabase-receptor/audit.md, implement-audit.md     | 🟠 High            |
| PROC-04    | Session summary template fields concatenated on one line           | match-backend, icu-survival implement-audit.md     | 🟡 Medium ✅ fixed |
| PROC-05    | Feature branch field missing from planner-frontend session summary | planner-frontend/implement-audit.md                | 🟡 Medium ✅ fixed |
| PROC-06    | Stale Step 5 heading — "Commit to Main"                            | common-bond/implement-audit.md                     | 🟡 Medium ✅ fixed |
| PROC-07    | Stale frontmatter descriptions (said "commits to main")            | supabase-receptor, icu-survival implement-audit.md | 🟡 Medium ✅ fixed |
| PROC-08    | No Audit Definition of Done checklist                              | All audit.md                                       | 🟡 Medium          |
| PROC-14    | No audit workflows for workforce-frontend or preference-frontend    | (missing)                                          |  High           |
| PROC-09    | Working tree cleanliness not checked before implementation         | All implement-audit.md                             | 🟢 Low             |
| PROC-10    | Branch remote tracking not verified after checkout                 | All implement-audit.md                             | 🟢 Low             |
| PROC-11    | Branch push success not confirmed (audit phase)                    | All audit.md                                       | 🟢 Low             |
| PROC-12    | Adversarial skill paths hardcoded as absolute filesystem paths     | All audit.md (Receptor repos)                      | 🟢 Low             |
| PROC-15    | Audit files are token-inefficient — all five `audit.md` files exceed 12,000 bytes (largest: `260305-iso27001-preaudit/audit.md` at 22,109 bytes). Verbose prose, repeated headers, and redundant context bloat token cost for every agent that reads them during implementation sessions. | All audit.md files | 🟡 Medium |

---

## What's Done Well

- **Slug-qualified identifiers** are enforced consistently across all repositories
  with workflow files. The `<!-- audit-slug: ... -->` header plus
  `REC/DOC/AUD-NN [slug]` format is a genuinely good design — it makes
  cross-audit references unambiguous.
- **Feature branch isolation** is now enforced from both sides (audit phase
  creates the branch; implement phase verifies and checks out the branch).
- **Test gates** are repo-appropriate: pgTAP for supabase-receptor, pytest for
  Python backends, and Docusaurus preview for documentation sites.
- **Human decision escalation** patterns are correctly present in all
  documentation workflows (common-bond and icu-survival), ensuring agents don't
  draft policy or clinical content unilaterally.
- **Session briefing** (the next-agent summary at the bottom of
  `recommendations.md`) is a sophisticated and effective handoff pattern. The
  checkpoint approach makes multi-session work resumable without context loss.

