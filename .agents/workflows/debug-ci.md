---
description: >
    Debug a failing GitHub Actions CI job locally using `act` with a fully
    isolated, ephemeral Supabase instance. Supabase is started by the Supabase
    CLI inside the act runner container — identical to the GitHub Actions flow —
    using the host Docker socket for container management.
---

# `/debug-ci` — Local CI Debugging with `act`

> **Skill dependency:** Read the `act-local-ci` skill first:
> `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/act-local-ci/SKILL.md`

// turbo-all

---

## Step 1: Identify the failing job

Confirm with the user (or check the GitHub Actions UI):

- **Repository** — e.g. `planner-frontend`, `workforce-frontend`,
  `preference-frontend`
- **Job name** — e.g. `unit-tests`, `codegen-check`, `lint-and-type`, `e2e`
- **Branch or commit** that is failing

```bash
# Navigate to the affected frontend repo
cd /path/to/frontend/<repo-name>

# List all available jobs
act --list
```

---

## Step 2: Verify prerequisites

```bash
# Docker must be running
docker info >/dev/null 2>&1 && echo "✅ Docker running" || echo "❌ Start Docker first"

# act must be installed
act --version 2>/dev/null || brew install act

# Use js-22.04 runner — pre-installs Node v20 (~2GB), eliminates PATH issues
# Switch if you're still on act-22.04:
grep -q 'js-22.04' ~/.actrc 2>/dev/null && echo "✅ .actrc OK" || \
  sed -i '' 's|catthehacker/ubuntu:act-22.04|ghcr.io/catthehacker/ubuntu:js-22.04|' ~/.actrc || \
  echo '-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:js-22.04' >> ~/.actrc

echo "✅ Prerequisites OK"
```

---

## Step 3: Check/create `.secrets` file

```bash
# Verify .secrets is gitignored before creating
grep -q '\.secrets' .gitignore && echo "✅ Gitignored" || {
  echo "❌ Add .secrets to .gitignore first"
  echo ".secrets" >> .gitignore
}

# Check if it already exists
[ -f .secrets ] && echo "✅ .secrets exists" || echo "⚠️  .secrets missing — create from template in skill"
```

The `.secrets` file template is in the `act-local-ci` skill. The Supabase keys
are **deterministic** — get them once from the `supabase-receptor` repo:

```bash
cd /path/to/supabase-receptor
npx supabase start      # Starts CLI-managed local Supabase
npx supabase status     # Prints anon key + service_role key — paste into .secrets
npx supabase stop       # Stop it again (not needed during act run)
```

For `lint-and-type` (no Supabase needed), an empty `.secrets` file is fine:

```bash
touch .secrets
```

---

## Step 4: Run the failing job

```bash
cd /path/to/frontend/<repo-name>

# Jobs that DON'T need Supabase:
act push --job lint-and-type --secret-file .secrets

# Jobs that DO need Supabase (unit-tests, codegen-check, e2e):
# The CI workflow calls `supabase start` inside the runner.
# Pass the Docker socket so the act container can spin up Supabase containers.
act push --job <job-name> \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets

# Apple Silicon — add if you see exec format errors:
act push --job <job-name> \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets \
  --container-architecture linux/amd64
```

> [!NOTE]
> The first run will pull the Supabase CLI Docker images (~1–2 GB). Subsequent
> runs use the Docker layer cache and start in ~30–60 seconds.

Watch the output — every workflow step is printed exactly as it appears in
GitHub Actions.

---

## Step 5: Diagnose and fix

Match the failure output to the appropriate fix:

| Failure                      | Fix                                                                   |
| :--------------------------- | :-------------------------------------------------------------------- |
| TypeScript error             | Fix in source → re-run `lint-and-type`                                |
| Codegen drift                | `npm run codegen && npm run postcodegen` → commit                     |
| Integration test failure     | Fix test or implementation; check DB seed is applying                 |
| `exec format error`          | Add `--container-architecture linux/amd64`                            |
| Supabase connection refused  | Confirm `-v /var/run/docker.sock:/var/run/docker.sock` is present     |
| Wrong auth token / JWT error | Re-run `npx supabase status` and update `.secrets` anon key           |
| E2E dev server won't start   | Check `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321` in `.secrets` |

Iterate: fix → re-run job locally → confirm green → push when clean.

---

## Step 6: Verify full pipeline before pushing

```bash
act push \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets
```

All jobs should be green. Then push your fix and open a PR.

---

## Step 7: Tear down (automatic)

No manual teardown is needed. When the `act` run ends, the runner container is
destroyed. Any Supabase containers spun up by `supabase start` inside the runner
are also destroyed with it — they live entirely inside the act container
network.

Your development Supabase on port 54321 is unaffected throughout.

---

## Quick Reference

```bash
# Dry-run: show execution plan without starting containers
act push --dryrun

# Keep container alive after failure for manual inspection
act push --job unit-tests \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --secret-file .secrets \
  --reuse

# Then exec into the stuck container for debugging:
docker ps  # Find container ID
docker exec -it <container-id> /bin/bash

# Run the cheapest job (no Docker socket needed)
act push --job lint-and-type --secret-file .secrets
```
