---
name: audit-verification-gates
description: >
    Canonical per-repo verification commands, code-coverage assessment pattern,
    and the Destructive Operations Gate used during audit implementation and
    finalisation. Use this skill in any implement or finalise workflow before
    committing changes or declaring an audit complete.
---

# Audit Verification Gates

Every implementation session ends with a verification gate before committing.
Every finalisation session runs the gate again as part of the re-audit. The
commands here are the canonical source of truth — do not improvise alternatives
without surfacing the reason to the user.

---

## Per-Repo Verification Commands

Run the gate appropriate for the repo being checked. Do **not** skip a gate on
the grounds that the changes seem trivial — a type error or build failure is
cheaper to find before commit than after a cross-repo PR.

| Repo type             | Verification command(s)                               |
| :-------------------- | :---------------------------------------------------- |
| Docusaurus site       | `npm run build`                                       |
| Python backends       | `pytest`                                              |
| Next.js frontends     | `npx tsc --noEmit` **and** `npm run test`             |
| Supabase (migrations) | `supabase db reset`, `supabase test db`, `deno check` |

> [!NOTE]
> For integration test failures on Next.js frontends where a live Supabase
> instance is required, see the `act-local-ci` skill:
> `.agents/skills/act-local-ci/SKILL.md` It explains how to run the full CI
> pipeline locally with an isolated ephemeral Supabase — identical to the GitHub
> Actions environment.

---

## Code Coverage Assessment

Required during re-audit (finalisation). For each PR's `codecov/patch` check,
categorise every uncovered file using the table below and document the
assessment in `re-audit.md`. Do not declare an audit complete without this
assessment on record.

### Categorisation

| Category           | Examples                                                                                                                                                           | Action                     |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------- |
| **Acceptable gap** | Config files (`next.config.ts`, `sentry.client.config.ts`), infra scaffolding (`error.tsx`, `loading.tsx`, `robots.txt`), generated files (`graphql/generated.ts`) | No test required           |
| **Must remediate** | New business logic — hooks, services, actions, utilities with no test coverage                                                                                     | Write tests before merging |

### `re-audit.md` coverage table format

```markdown
## Code Coverage Assessment — <repo-name>

| File                   | Gap reason                                 | Acceptable? |
| :--------------------- | :----------------------------------------- | :---------- |
| `error.tsx`            | React error boundary — no unit test needed | ✅ Yes      |
| `robots.txt`           | Static file — no unit test needed          | ✅ Yes      |
| `graphql/generated.ts` | Generated file — no unit test needed       | ✅ Yes      |
| `useSomeHook.ts`       | New business logic, no test written        | ❌ Must fix |
```

Add one table per repo reviewed. If all gaps are acceptable, state that
explicitly. Never leave the coverage section blank.

### Checking coverage status

```bash
# Via gh CLI
gh pr checks <PR-number> --repo <owner>/<repo>
```

Or use `mcp_github-mcp-server_pull_request_read` (method: `get_status`) to
inspect all status check results including `codecov/patch`.

---

## Destructive Operations Gate

Before executing any operation that **cannot be easily reversed**, pause and use
`notify_user` to confirm with the user. This applies in all implementation and
finalisation sessions.

| Operation type                        | Examples                                                                             |
| :------------------------------------ | :----------------------------------------------------------------------------------- |
| Deleting or removing data stores      | Removing IndexedDB storage, clearing caches, dropping columns                        |
| Removing or rewriting auth flows      | Changing `authExchange`, modifying session handling, altering middleware             |
| Removing dependencies                 | Uninstalling packages that other code may depend on                                  |
| Rewriting core infrastructure files   | `next.config.ts`, `layout.tsx`, `client.ts`, `globals.css`                           |
| Setting CI secrets (single or bulk)   | Confirm correct value and all target repos before running `gh secret set`            |
| Any finding marked 🔴 Critical        | Always surface the implementation plan before executing                              |
| Cross-repo bulk operations via `meta` | Run repo-by-repo if uncertain — bulk `meta git` writes affect multiple repos at once |

> [!WARNING]
> "The recommendation says to do X" is not sufficient justification to proceed
> without pausing. If you are uncertain whether an implementation is safe, ask.
> A question costs seconds; a wrong implementation costs a re-audit.

---

## Setting CI Secrets

No manual GitHub portal step is required. Use the gh CLI:

```bash
gh secret set SECRET_NAME --body "value" --repo owner/repo-name
```

Always confirm:

1. The correct value is in the Agent Clarifications table (never in source)
2. The correct target repo(s) before running in bulk

---

## Session Close Brief (Implementation Sessions)

At the end of every implementation session, append a **Session Close** section
to `recommendations.md`:

```markdown
## Session Close — YYYY-MM-DD

**Completed:** [Finding IDs marked done this session] **Remaining:** [Open
finding IDs with target repo, or "None — audit complete"] **Blocked:** [Finding
IDs blocked on external action with reason, or "None"] **PR order note:** [If
multiple repos need PRs and one depends on another, note the merge order — e.g.
"Merge supabase-receptor first; planner-frontend schema imports depend on it"]
**Brief for next agent:** [What the next agent needs upfront — new decisions
made during implementation that should be added to the Agent Clarifications
table, any skipped verification steps with reason, files refactored mid-session]
```

Commit the updated `recommendations.md` and the registry status update
**together** in a single commit before ending the session.
