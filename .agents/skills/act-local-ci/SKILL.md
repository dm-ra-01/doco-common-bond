---
name: act-local-ci
description: >
  Run GitHub Actions CI workflows locally using `act`. Spins up an isolated,
  ephemeral Supabase instance inside the act container network so test data is
  completely separate from your development environment. Use when diagnosing CI
  failures without waiting for GitHub queue times.
---

# Local CI with `act`

Run GitHub Actions workflows on your Mac using `act`. The key goal is **full
environment fidelity**: the Supabase instance used by tests is spun up by the
Supabase CLI (`supabase start`) inside the act container — identical to how
GitHub Actions does it — completely isolated from your dev data.

---

## How it Works: The Supabase Isolation Model

```
Your Mac
├── Docker daemon (shared via /var/run/docker.sock)
│   ├── supabase_db_supabase-receptor          ← your dev DB  (port 54322)
│   ├── supabase_kong_supabase-receptor        ← your dev API (port 54321)
│   └── ... other dev containers ...
│
└── act runner container (ghcr.io/catthehacker/ubuntu:js-22.04)
     ├── Node.js v20 (pre-installed — no setup-node PATH issues)
     ├── Supabase CLI (installed by workflow via supabase/setup-cli@v1)
     ├── supabase-receptor/ checkout
     │    └── supabase-ci/config.toml  ← project_id=supabase-receptor-ci
     │                                    API port: 55321  DB port: 55322
     │
     └── supabase start --workdir supabase-ci
          ├── supabase_db_supabase-receptor-ci    ← CI DB  (port 55322)
          ├── supabase_kong_supabase-receptor-ci  ← CI API (port 55321)
          └── (separate containers, separate project name)
               └── URL: http://localhost:55321   ← tests connect here
```

**True isolation via separate project:** `supabase-ci/config.toml` sets
`project_id = "supabase-receptor-ci"` and offsets all ports by +1000. The
Supabase CLI derives Docker container names from `project_id`, so the CI
containers are completely separate from your dev stack. **Both run
concurrently** — no stopping dev Supabase required.

`supabase start --workdir supabase-ci` inside the act runner:

- Spins up a **new Docker project** (`supabase-receptor-ci`) on ports
  55321/55322
- Applies all migrations from `supabase-receptor/supabase/migrations/` in order
- Seeds with Acacia + Monash + test framework data
- Emits **deterministic API keys** (same JWT secret → same keys as dev)
- Containers are destroyed when the act run ends (different project, no
  conflict)

---

## Prerequisites

```bash
# Install act (if not present)
brew install act

# Verify Docker is running
docker info >/dev/null 2>&1 && echo "✅ Docker OK" || echo "❌ Start Docker first"

# Set js-22.04 as the default runner (pre-installs Node v20, ~2GB, avoids PATH issue)
# js-22.04 is built on act-22.04 (~500MB) + Node/yarn/nvm → no setup-node dependency
grep -q 'catthehacker' ~/.actrc 2>/dev/null || \
  echo '-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:js-22.04' >> ~/.actrc

# If already set to act-22.04, switch to js-22.04:
sed -i '' 's|catthehacker/ubuntu:act-22.04|ghcr.io/catthehacker/ubuntu:js-22.04|' ~/.actrc
```

---

## Getting the Deterministic Supabase Keys

Both the dev (`supabase-receptor`) and CI (`supabase-receptor-ci`) instances
derive their keys from the **same JWT secret** in `config.toml`, so the keys are
identical. Get them once from the CI project:

```bash
cd supabase-receptor/

# Start the isolated CI instance (uses supabase-ci/config.toml)
npx supabase start --workdir supabase-ci

# Print deterministic keys
npx supabase status --workdir supabase-ci
```

Copy the `Publishable` and `Secret` keys. They never change as long as
`config.toml`'s JWT secret is unchanged.

---

## Secrets File

Each frontend repo needs a `.secrets` file (gitignored).

```bash
grep -q '\.secrets' .gitignore && echo "✅ Gitignored" || echo "❌ Add .secrets to .gitignore first"
```

### Template (Receptor frontends)

```ini
# .secrets — place in repo root, never commit
# CI Supabase runs on port 55321 (supabase-ci/ config, project_id=supabase-receptor-ci)

# GitHub token for checking out dm-ra-01/supabase-receptor in workflow
EXTERNAL_REPO_TOKEN=<gh auth token>

# Secret key for the local CI Supabase instance
LOCAL_SUPABASE_SECRET_KEY=<Secret key from `supabase status --workdir supabase-ci`>

# Optional — stub values cause test uploads to be skipped gracefully
CODECOV_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
```

> The `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key) is injected
> automatically by the workflow's `supabase status` step — you don't need it in
> `.secrets`.

---

## Running Jobs

### List all available jobs

```bash
cd <frontend-repo-root>
act --list
```

### Run a specific failing job

```bash
# Jobs that DON'T need Supabase (no docker socket needed)
act push --job lint-and-type --secret-file .secrets

# Jobs that need Supabase (pass docker socket for supabase start)
act push --job unit-tests \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets

act push --job codegen-check \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets

act push --job e2e \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets
```

### Run the full pipeline

```bash
act push \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets
```

### Verbose output

```bash
act push --job unit-tests \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets \
  --verbose
```

---

## Receptor CI Jobs Reference

| Job             | Needs Supabase? | Needs Docker socket? | What it does                                          |
| :-------------- | :-------------- | :------------------- | :---------------------------------------------------- |
| `lint-and-type` | No              | No                   | ESLint + `tsc --noEmit` strict TypeScript check       |
| `codegen-check` | **Yes**         | **Yes**              | Introspects schema → runs codegen → checks type drift |
| `unit-tests`    | **Yes**         | **Yes**              | Vitest unit + integration tests (live Supabase)       |
| `e2e`           | **Yes**         | **Yes**              | Playwright + Axe accessibility (launches dev server)  |

---

## Diagnosing Common Failures

### TypeScript / lint (`lint-and-type`)

Fastest to debug — no Supabase needed:

```bash
act push --job lint-and-type --secret-file .secrets
# Or directly (even faster):
npm run lint && npx tsc --noEmit
```

If `tsc` passes locally but fails in CI: check for extra `strict` flags or
`paths` aliases in `tsconfig.json` that differ per environment.

### Codegen drift (`codegen-check`)

```bash
act push --job codegen-check \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets
```

Means generated types in `src/types/` are out of sync with the DB schema. Fix:

```bash
npm run codegen && npm run postcodegen
git diff src/types/    # Review changes, then commit
```

### Integration test failures (`unit-tests`)

```bash
act push --job unit-tests \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets
```

If you see DB connection errors check:

1. Docker socket is mounted (`-v /var/run/docker.sock:/var/run/docker.sock`)
2. `.secrets` keys match those from `npx supabase status`
3. The custom auth hook (`func_custom_access_token_hook`) is registered —
   `supabase start` applies migrations which create it automatically

### E2E failures (`e2e`)

```bash
act push --job e2e \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets
```

The E2E job launches a Next.js dev server internally. If startup fails:

1. Confirm `NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321` in `.secrets`
2. Check that `supabase start` completed its health check before the server
   started

---

## Troubleshooting

| Symptom                                  | Cause                                                         | Fix                                                                     |
| :--------------------------------------- | :------------------------------------------------------------ | :---------------------------------------------------------------------- |
| `Cannot connect to Docker daemon`        | Docker not running                                            | `open -a Docker`                                                        |
| `exec format error`                      | ARM vs AMD64 mismatch                                         | Add `--container-architecture linux/amd64`                              |
| `secret file not found`                  | `.secrets` missing                                            | Create from template above                                              |
| `supabase start` picks up dev containers | Wrong `--workdir` (pointed at `supabase/` not `supabase-ci/`) | Ensure `--workdir supabase-backend/supabase-ci` in the command          |
| `node: executable file not found`        | Using `act-22.04` (no Node)                                   | Switch `.actrc` to `ghcr.io/catthehacker/ubuntu:js-22.04`               |
| Codegen URL connection refused           | Tests still pointing at port 54321                            | Confirm `NEXT_PUBLIC_SUPABASE_URL: http://127.0.0.1:55321` in env block |
| `supabase start` slow                    | First Docker pull of CI project images                        | ~3–5 min on first run; subsequent runs use layer cache                  |
| Job passes locally, fails in CI          | Env var difference                                            | Compare `.secrets` key names against the workflow `env:` block exactly  |

---

## When to Use `act` vs Running Tools Directly

| Scenario                                | Recommended approach                                       |
| :-------------------------------------- | :--------------------------------------------------------- |
| TypeScript errors or lint               | `npm run lint` / `npx tsc --noEmit` — no containers needed |
| Codegen drift                           | `npm run codegen` directly                                 |
| Integration test debugging (tight loop) | `npm test` directly against your dev Supabase              |
| Integration tests with clean data       | Use `act` — isolated DB, no dev data contamination         |
| Full pipeline gate before PR            | `act push` — closest match to GitHub environment           |
| Suspected CI environment difference     | Use `act` — same runner image, same env var resolution     |
