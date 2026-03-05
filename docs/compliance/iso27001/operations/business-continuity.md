---
title: Business Continuity Plan
sidebar_position: 6
---

# Business Continuity Plan

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## 1. Purpose

This plan ensures that Common Bond Pty Ltd and MyJMO Pty Ltd can continue
essential business functions and restore critical services following a
disruptive event. It satisfies the requirements of ISO/IEC 27001:2022 controls
5.29 (Information security during disruption) and 5.30 (ICT readiness for
business continuity).

## 2. Scope

This plan covers all information systems and processes critical to the operation
of the Receptor platform, including the database, backend functions,
authentication infrastructure, and source code repositories.

## 3. Recovery Objectives

| Objective                          | Target   | Basis                                                                                                 |
| ---------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| **Recovery Time Objective (RTO)**  | 4 hours  | Maximum acceptable downtime for the Receptor platform before operational impact becomes unacceptable. |
| **Recovery Point Objective (RPO)** | 12 hours | Maximum acceptable data loss; satisfied by Supabase PITR (see Section 5).                             |

## 4. Critical Systems and Dependencies

| System                         | Provider           | RTO Impact | Recovery Method                                    |
| ------------------------------ | ------------------ | ---------- | -------------------------------------------------- |
| PostgreSQL database            | Supabase           | Critical   | PITR + Supabase failover                           |
| Authentication (Supabase Auth) | Supabase           | Critical   | Supabase failover                                  |
| Edge functions                 | Supabase           | High       | Redeploy from GitHub                               |
| Source code                    | GitHub (Microsoft) | High       | Local clones; push to alternate host if needed     |
| DNS / CDN                      | Cloudflare         | High       | Cloudflare redundant PoPs; DNS failover            |
| Corporate email                | Google Workspace   | Medium     | Google SLA; fallback to mobile + alternate contact |
| Project management             | ClickUp            | Low        | Manual coordination via email/Slack                |

## 5. Recovery Mechanisms

### 5.1 Database Recovery — Supabase PITR

Supabase Point-in-Time Recovery (PITR) is enabled for the Common Bond production
project. PITR provides continuous WAL archiving, enabling restoration to any
point within the retention window.

- **RPO achieved:** Near-zero (WAL streaming); satisfies the 12-hour RPO target.
- **RTO achieved:** Restoration to a specific point takes approximately 30–90
  minutes depending on recovery size. Combined with infrastructure
  reconfiguration, the 4-hour RTO is achievable.
- **Process:** In the event of data loss or corruption, the Founder/CEO (or
  delegated engineer) initiates a PITR restoration via the Supabase dashboard or
  CLI, targeting the last known-good timestamp.

### 5.2 Application Recovery

The Receptor platform backend (edge functions, schema, RLS policies) is fully
version-controlled in GitHub. Recovery steps:

1. Provision a new Supabase project (or restore the existing project).
2. Apply the declarative schema via the Supabase CLI migration tool.
3. Redeploy edge functions via `supabase functions deploy`.
4. Update environment variables and API keys in the deployment configuration.
5. Validate with a smoke test before reopening to users.

### 5.3 Access Recovery

In the event of identity provider (Google Workspace) disruption:

- Supabase dashboard access is available via email/password authentication as a
  fallback.
- GitHub access is available via personal access tokens stored securely offline.
- Cloudflare access via API token if Zero Trust is unavailable.

:::tip Key Person Note All recovery credentials and access methods are
documented and stored securely by Ryan Ammendolea (Founder/CEO). A succession
plan for access recovery in the event of key person unavailability is a Phase 2
action (see Risk R-006 in the Risk Register). :::

## 6. Disruption Scenarios

### Scenario A: Supabase Platform Outage

| Step | Action                                                                            | Owner       |
| ---- | --------------------------------------------------------------------------------- | ----------- |
| 1    | Monitor Supabase status page ([status.supabase.com](https://status.supabase.com)) | Founder/CEO |
| 2    | Notify affected client contacts if outage exceeds 1 hour                          | Founder/CEO |
| 3    | If outage exceeds 4 hours, evaluate migrating to a standby Supabase project       | Founder/CEO |
| 4    | Post recovery, review logs for data integrity and initiate PITR if needed         | Founder/CEO |

### Scenario B: Credential Compromise

1. Immediately revoke all compromised keys via Supabase dashboard, GitHub, and
   Cloudflare.
2. Rotate all related credentials.
3. Initiate the Incident Response Plan in parallel.
4. Restore from PITR to a pre-compromise timestamp if data integrity is in
   doubt.

### Scenario C: Key Person Unavailability (Founder/CEO)

:::warning Action Required A documented succession plan for key person
unavailability has not yet been formalised. The Founder/CEO must document
recovery credential locations and designate a trusted contact with access
authority. This is tracked as R-006 in the Risk Register and is a Phase 2
priority. :::

## 7. Testing

The BCP is tested annually via a tabletop exercise reviewing each scenario
above. PITR restoration is tested on a staging project annually to verify the
recovery process and RTO. Test results are recorded in the Management Review
record.

## 8. Plan Review

This plan is reviewed annually and after any activation. The Founder/CEO is
responsible for maintaining this plan and ensuring recovery credentials remain
accessible and current.
