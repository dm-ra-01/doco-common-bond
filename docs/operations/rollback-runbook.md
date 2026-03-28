# Rollback Runbook

**Owner:** Ryan Ammendolea (CEO)  
**Audit ref:** 260316-terraform-iac-gap — LIFE-04  
**Last updated:** 2026-03-19  

This runbook covers rollback procedures for all five application services
in the Receptor ecosystem: `planner-frontend`, `preference-frontend`,
`workforce-frontend`, `match-backend`, and `planner-backend`.

> **Pre-requisite:** `kubectl` with a valid kubeconfig. Run all commands with
> the `KUBECONFIG` env var set, e.g. `KUBECONFIG=/path/to/kubeconfig kubectl ...`

---

## 1. Frontend Rollback (planner / preference / workforce)

Frontend services deploy as k8s Deployments in their respective namespaces
(`planner-staging`, `preference-staging`, `workforce-staging`).

### Option A: Re-trigger from Previous Tag (preferred)

1. Find the last known-good commit SHA in GitHub Actions run history.
2. Re-trigger `deploy.yml` via `workflow_dispatch` pointing at that SHA, or
   push a revert commit to `main`.

### Option B: `kubectl rollout undo`

```bash
# Roll back to the previous ReplicaSet immediately
kubectl rollout undo deployment/planner-frontend -n planner-staging
kubectl rollout undo deployment/preference-frontend -n preference-staging
kubectl rollout undo deployment/workforce-frontend -n workforce-staging

# Verify recovery
kubectl rollout status deployment/planner-frontend -n planner-staging
```

### Option C: Pin a Specific Image Tag

```bash
kubectl set image deployment/planner-frontend \
  frontend=ghcr.io/dm-ra-01/planner-frontend:staging-<sha> \
  -n planner-staging
```

---

## 2. Backend Rollback (match-backend / planner-backend)

Both backends run as always-on FastAPI Deployments (see ADR-010, ADR-011).

```bash
# Roll back to the previous ReplicaSet
kubectl rollout undo deployment/match-backend -n match-staging
kubectl rollout undo deployment/planner-backend -n planner-staging

# Verify liveness
kubectl rollout status deployment/match-backend -n match-staging
kubectl logs -l app=match-backend -n match-staging --tail=50
```

### Health Check After Rollback

```bash
kubectl port-forward svc/match-backend 8080:80 -n match-staging
curl http://localhost:8080/health
# Expected: {"status": "ok"}
```

---

## 3. Database Migration Rollback

> [!CAUTION]
> Supabase migrations are **forward-only**. Never revert by deleting migration
> files. Never drop columns or tables without a prior full backup.

### Policy

1. If a migration causes an application error, **first roll back the
   application** (Section 1 or 2) to a version compatible with the existing schema.
2. Then write a **compensating migration** — a new numbered `.sql` file that
   restores the prior state (e.g., `ALTER TABLE ... ADD COLUMN` with backfill).
3. The migration file itself is never deleted or modified after being applied.

### Emergency Restore from Backup

If a destructive migration runs and application rollback is insufficient:

```bash
# On ctrl-01: list recent Azure Blob backups
rclone ls azure-aus:receptor-backups/ | sort | tail -5

# Restore procedure: see supabase-receptor/docs/operations/disaster-recovery.md
```

---

## 4. Deployment Health Monitoring

A **DeploymentErrorRateSpike** PrometheusRule will be implemented in
`receptor-infra/monitoring/alerts/deployment-alerts.yaml` to fire if HTTP
5xx rate exceeds 5% in any app namespace within 5 minutes of a new rollout.

Until that alert is in place:
- Watch the Grafana HTTP error rate panel after every deploy.
- Set a manual 10-minute observation window after production deploys.

---

## 5. Post-Rollback Checklist

- [ ] All pods `Running`; liveness and readiness probes passing
- [ ] VSO secrets synced: `kubectl get vaultstaticsecret -A`
- [ ] Smoke test passing: `GET /health` (backends) / UI loads (frontends)
- [ ] Posted to `#incidents` Slack (even near-miss events)
- [ ] Post-mortem filed within 24 h for any P1/P2 incident
- [ ] This runbook updated if the incident revealed a gap

---

## See Also

- `supabase-receptor/docs/operations/disaster-recovery.md` — backup restore
- `supabase-receptor/docs/operations/incident-response.md` — P1/P2/P3 tiers
- `supabase-receptor/docs/operations/promotion-runbook.md` — staging → production
- `match-backend/docs/ADR-010-match-backend-runtime.md`
- `planner-backend/docs/ADR-011-planner-backend-runtime.md`
