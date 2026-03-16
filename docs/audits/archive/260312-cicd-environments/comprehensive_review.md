# Comprehensive Audit Review — 260312-cicd-environments
**57 findings · 99 tasks · 12 phases · Review date: 2026-03-12**

---

## Verdict

> **Yes, with six caveats.** The 57 findings, when fully implemented in phase order, will deliver a genuinely robust CI/CD environment. The coverage is unusually thorough for a one-engineer operation. The caveats below are either implementation risks (things that could fail during execution) or gaps (things not yet in scope) that should be understood before declaring the audit complete.

---

## 1. End-to-End Workflow Coverage Analysis

### dev → ephemeral CI

| Capability | Covered by | Status |
|---|---|---|
| Supabase boots per push | CICD-01, ARCH-01, ARCH-04 | ✅ Structural fix via k3s namespace-per-branch |
| CLI version drift | CICD-02 | ✅ Pinned + Renovate |
| Key format compatibility | KEY-01, CICD-03 | ✅ Dual-key extraction |
| Shared extraction pattern | CICD-09 | ✅ Composite action (structural drift fix) |
| Codegen gate correctness | CGEN-01, CGEN-02 | ✅ git diff pattern |
| Job timeouts | CICD-05 | ✅ 20/10 min limits |
| Dep caching | CICD-07 | ✅ npm/pip cache |
| Test data isolation | ISO-01, ISO-02, ENV-04 | ✅ run-ID namespacing + pg_cron cleanup |
| Backend integration tests | BACK-01 | ✅ Supabase boot in backend CI |
| CI stub credentials | BACK-02 | ✅ Non-scanner-triggering stub |
| Supply chain | SEC-01, SEC-02, CICD-06, SEC-04 | ✅ SHA pins, permissions, Dependabot |

### staging environment

| Capability | Covered by | Status |
|---|---|---|
| Staging environment exists | ENV-01 | ✅ Documented + provisioned |
| Tunnel ingress | ENV-07 | ✅ Cloudflare Tunnel |
| Config templates | ENV-02 | ✅ setup.conf.staging.example |
| Teardown non-interactive | ENV-03 | ✅ --force flag |
| Key docs accuracy | KEY-02 | ✅ key-management.md updated |
| Secrets rotation | ENV-06 | ✅ Schedule + reminder workflow |
| GitHub Environments | CICD-08 | ✅ Staging + prod scoping |
| Promotion checklist | DOC-02, ENV-09 | ⚠️ Overlap — see Caveat 1 |

### prod deployment

| Capability | Covered by | Status |
|---|---|---|
| Migration gate | ENV-05 | ✅ prod-deploy.yml + human approval |
| Edge Function deployment | ENV-10 | ✅ git-tag triggered, rollback documented |
| Branch protection | SEC-03 | ✅ Phase 12 (deferred until CI stable) |
| Required check matrix | PROC-01 | ✅ Phase 2 (moved — now gates Phase 12) |
| Smoke test after deploy | **NONE** | ❌ Gap — see Caveat 2 |

### infrastructure reliability

| Capability | Covered by | Status |
|---|---|---|
| Cluster provisioning | ARCH-04 | ✅ k3s on Hyper-V |
| Secrets management | SEC-06, DOC-01 | ✅ Vault + YubiKey |
| RBAC | SEC-08 | ✅ SA per workload |
| Network isolation | ARCH-08 | ✅ Calico CNI |
| Runtime anomaly detection | SEC-07 | ✅ Falco |
| Observability | ARCH-07 | ✅ Prometheus/Grafana/Loki |
| Alerting | PROC-02 | ✅ Slack (incidents + deployments) |
| TLS | ARCH-10 | ✅ cert-manager DNS-01 wildcard |
| Helm chart governance | ARCH-09 | ✅ Helmfile + quarterly review |
| Container image integrity | SEC-04 | ✅ Digest pinning + verify-images |
| Pull-through cache | ARCH-06 | ✅ Local registry on k3s |

### data integrity and compliance

| Capability | Covered by | Status |
|---|---|---|
| Forensic audit trail | SEC-09 | ✅ pgaudit (DDL/DML/ROLE) |
| Prod backup | ENV-08 | ✅ R2 APAC daily/weekly |
| Backup AUS residency | ENV-11 | ✅ Backblaze B2 SYD secondary |
| DR plan | DOC-05 | ✅ RTO 4h / RPO 24h |
| Physical security SoA | ISO-03 | ✅ Updated post-provisioning |
| ISO 27001 SoA updates | SEC-01, SEC-02, ENV-05, ARCH-07 + others | ✅ Each finding has compliance task |

---

## 2. Six Caveats

### Caveat 1 — DOC-02 and ENV-09 Are Duplicate Runbooks (Consistency Issue)

`DOC-02` ("Promotion runbook" — Phase 7) and `ENV-09` ("Staging-to-production promotion checklist" — Phase 1) both produce a document at `docs/operations/promotion-runbook.md`. They will either collide at write time or one will silently overwrite the other.

**Recommendation:** In DOC-02-T1, change the target to point at the same `promotion-runbook.md` with the explicit note that DOC-02 *extends* the ENV-09 document with post-provisioning staging URLs, smoke test commands, and the live ENV-05 workflow link — rather than creating a separate doc.

### Caveat 2 — No Post-Deploy Smoke Test Workflow

`ENV-09` (promotion checklist) mentions "run staging smoke tests" as Step 1, but no finding creates those smoke tests. The audit covers integration tests (BACK-01), pgTAP tests, and E2E Playwright tests — but there is no simple HTTP health check workflow that fires immediately after a staging or production deploy to confirm: (1) Kong API is responding on the Cloudflare Tunnel URL; (2) Auth endpoint returns 200; (3) A canary database query succeeds.

Without this, a broken deploy is only caught when a human manually tests it or Grafana fires an alert.

**Recommendation:** Add a finding `CICD-10` (Low, Process Gap) — a 10-line GitHub Actions workflow step in `prod-deploy.yml` and a staging equivalent that runs `curl -f https://staging-api-829c83.commonbond.au/health` and `curl -f https://api.commonbond.au/health` post-deploy. This is a 30-minute task with outsized operational value.

### Caveat 3 — ARCH-04 Is the Single Critical Path (Risk)

Phase 3 (k3s core cluster) is the dependency for Phases 5, 6, 7, 8, 9, 10 — essentially everything. Phases 4 and 5 (CI YAML fixes) are explicitly designed to be parallel-safe, which is correct. But if Phase 3 takes longer than expected (Hyper-V VM networking, k3s control plane instability, Vault PKCS#11 setup complexity), the entire audit stalls.

**Recommendation:** Make this risk explicit in the Phase 1 ADRs (DOC-03): document the "Phase 3 fallback" — if k3s provisioning exceeds 2 weeks, intermediate staging can be provisioned as Docker Compose on the raw host with a Cloudflare Tunnel (no k3s required for ENV-07 or ENV-01 to proceed). This keeps the dev→staging workflow unblocked while the cluster is being built.

### Caveat 4 — PROC-01 Requires CI to Be Finalized (Living Document Risk)

`PROC-01` (required check matrix) is now in Phase 2 — correctly ahead of Phase 12 branch protection. But Phase 2 occurs **before** Phases 4 and 5 add new CI jobs (e.g., the `integration-tests` job changes in BACK-01, timeout annotations from CICD-05, the composite action in CICD-09). The check matrix written in Phase 2 will be stale before the cluster even exists.

**Recommendation:** Tag `PROC-01` explicitly as a "living document — final pass required in Phase 11". Add a `PROC-01-T2` task: "After Phase 5 CI hardening, review and update the required check matrix for any new or renamed jobs before Phase 12 branch protection is enabled." This ensures the matrix used in Phase 12 is current.

### Caveat 5 — Backup CronJob Location Is Undefined

`ENV-08-T1` specifies a cron job for the backup script at `scripts/backup-prod.sh` but does not specify *where* the cron is scheduled: Windows Task Scheduler on the host, a k3s `CronJob` resource, or a Linux crontab on a VM. This is an operationally significant gap.

**If k3s CronJob:** Backup fails silently if k3s is unhealthy — exactly when you need the backup most (during a disaster).

**If Windows Task Scheduler / VM crontab:** Backup is independent of k3s health — the correct choice. But it needs WSL2 (for `rclone` and `pg_dumpall`) or a dedicated Linux VM crontab.

**Recommendation:** In `ENV-08-T1`, explicitly specify: "Schedule via crontab in the control-plane Ubuntu VM (not as a k3s CronJob), so backups run regardless of k3s cluster health. The VM must have `pg_dumpall`, `rclone`, and network access to the Postgres pod port-forwarded via `kubectl port-forward`."

### Caveat 6 — Supabase Community Helm Chart Is Not Official

`ARCH-04-T3` deploys Supabase to k3s using the community Helm chart (`supabase-community/supabase-kubernetes`). This chart is community-maintained, not officially supported by Supabase. There is a known pattern where community Helm charts lag Docker Compose releases by weeks-to-months, particularly for major Supabase versions.

**Recommendation:** Add a note in ADR-001 (k3s selection) acknowledging this risk: "If the community Helm chart falls significantly behind the official Docker Compose release, the fallback is to run Supabase as Docker Compose inside a k3s Pod using a Docker-in-Docker (DinD) sidecar, or to pin the Helm chart to a known-working Supabase version and accept delayed upgrades until the chart catches up." This is not a blocker but must be in the ADR to avoid a future decision being made without this context.

---

## 3. Minor Consistency Issues

| Issue | Finding Pair | Fix |
|---|---|---|
| `DOC-01` is "Secrets Vault" (key-management TODO) but Vault is now DOC-01 Vault config docs | DOC-01 description is pre-Vault — references "Bitwarden/Doppler" | Description should be updated to reflect that the decision was made (Vault OSS — see clarification) and DOC-01 now means "write the Vault OIDC/database-secrets-engine guide" |
| `ENV-09` is in Phase 1 (PLAN) but its T1 task references "staging smoke tests (list specific test commands)" that don't yet exist | ENV-09, Caveat 2 | Either reference `CICD-10` once it's created, or note in ENV-09 that the smoke test commands will be defined during Phase 5 |
| `ARCH-07-T2` references "email/Slack" for Alertmanager routing but `PROC-02` clarification confirms Slack-only | ARCH-07, PROC-02 | Change "email/Slack" in ARCH-07-T2 to "Slack only (2 webhooks: incidents + deployments)" |
| Phase 2 rationale still mentions `ISO-03` but ISO-03 is now Phase 11 only | Phase 2 rationale in recommendations.json | Remove ISO-03 reference from Phase 2 rationale |

---

## 4. End-to-End Flow After All Phases Complete

```
Developer commits → GitHub PR
  │
  ├─ [Phase 12: SEC-03] Branch protection: PR required, CI must pass
  │
  └─ GitHub Actions (self-hosted runner on k3s — ARCH-04-T5)
       │
       ├─ [CICD-09] Composite supabase-start action
       │     Boots ephemeral Supabase in receptor-ci-&#60;branch&#62; namespace
       │     (~30-60s warm, vs 4min cold before Phase 3)
       │
       ├─ Integration tests → unit tests → codegen gate → E2E
       │     [KEY-01/CICD-03] Correct keys  [CGEN-01/02] git diff gate
       │
       └─ All pass → merge to main
            │
            ├─ [ENV-07] Cloudflare Tunnel → staging-api-829c83.commonbond.au
            │     Migration auto-applied to staging (supabase db push --linked)
            │     [CICD-10 proposed] Smoke test fires
            │
            └─ Stakeholder review → trigger prod-deploy.yml
                  [ENV-05] GitHub Environment protection: human approval required
                  [ENV-10] Edge Functions: fn/&#60;name&#62;/vX.Y.Z tag triggers deploy
                  [CICD-10 proposed] Prod smoke test fires
                  [PROC-02] Slack #deployments notification sent
                       │
                       └─ Ongoing: Falco (SEC-07) monitors runtime
                                   Grafana (ARCH-07) monitors metrics
                                   pgaudit (SEC-09) logs all DDL/DML
                                   Daily R2 backup (ENV-08) + B2 AUS copy (ENV-11)
```

---

## 5. Final Assessment

**What the audit gets right:**
- The phase ordering is sound. Planning before provisioning before CI hardening before branch protection is the correct sequence.
- The 57 findings cover all five layers: CI correctness, environment management, secrets/security, observability, and compliance. Nothing major is missing except the proposed smoke test.
- The CICD-09 composite action is the most structurally valuable late addition — it prevents the entire class of "we fixed it in one repo but forgot the others" failures.
- SEC-08 (RBAC) and SEC-09 (pgaudit) at High severity are correctly calibrated. Missing either of these in production would be a genuine security gap.
- The data residency constraint on ENV-11 (AUS-only) is correct given the healthcare-adjacent nature of the customer data (hospital workforce scheduling).

**What to resolve before implementation begins:**
1. Add `PROC-01-T2` (post-Phase-5 check matrix refresh) — prevents stale branch protection ruleset.
2. Clarify ENV-08-T1 backup cron host (VM crontab, not k3s CronJob).
3. Create `CICD-10` (post-deploy smoke test) — 30-minute task, high operational value.
4. Merge DOC-02 + ENV-09 into a single living document.
5. Update ARCH-07-T2 description from "email/Slack" → "Slack only".
6. Add Phase 3 fallback plan to DOC-03 (k3s contingency).

**Confidence assessment:** If all 57 findings (+ the 3-4 minor amendments above) are implemented in phase order, the resulting CI/CD environment will exceed the robustness of most funded early-stage startups. The only remaining risk is operational — Phase 3 (k3s provisioning) is the hardest and riskiest phase, and its success determines everything downstream.
