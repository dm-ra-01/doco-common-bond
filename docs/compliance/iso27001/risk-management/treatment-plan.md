---
title: Risk Treatment Plan
sidebar_position: 3
---

# Risk Treatment Plan

| Version | Effective Date | Approved By          | Last Reviewed | Next Review |
| ------- | -------------- | -------------------- | ------------- | ----------- |
| 1.1     | 2026-03-05     | Ryan Ammendolea, CEO | 2026-03-06    | 2026-09-01  |

## Overview

This plan details the specific actions required to mitigate identified risks
from the Risk Register. Treatments are categorised as Reduce, Avoid, Transfer,
or Accept per the [Risk Methodology](./methodology.md).

## Active Treatments

| Risk ID | Risk Description              | Treatment Action                                                                                                     | Owner                 | Due Date | Status         |
| :------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------- | :-------------------- | :------- | :------------- |
| R-004   | Dependency Vulnerabilities    | Enable automatic security updates for non-breaking changes                                                           | Ryan Ammendolea (CEO) | Q3 2026  | 📅 Planned     |
| R-006   | Key Person Risk               | Document key architecture decisions and specialised knowledge across Receptor Ecosystem Docusaurus and as agent-executable audit workflows (bus factor mitigation) | Ryan Ammendolea (CEO) | Q4 2026  | 🔄 In Progress |
| R-007   | Regulatory Breach             | Draft Incident Response Plan and Data Classification Scheme; engage legal advice on Privacy Act / statutory retention intersection | Ryan Ammendolea (CEO) | Q2 2026  | 📅 Planned     |
| R-009   | Lack of Incident Response     | Draft and test Incident Response Plan; establish formal escalation path. See `operations/incident-response.md`       | Ryan Ammendolea (CEO) | Q2 2026  | 📅 Planned     |
| R-010   | Business Continuity Failure   | Draft Business Continuity Plan; confirm RTO target of 4 hours in documented runbook                                  | Ryan Ammendolea (CEO) | Q3 2026  | 📅 Planned     |
| R-011   | Data Retention Non-Compliance | Develop formal data retention and deletion schedule; obtain customer consent terms; seek legal advice on APP erasure obligations vs statutory retention | Ryan Ammendolea (CEO) | Q2 2026  | 📅 Planned     |
| R-012   | Insufficient Audit Coverage   | Implement global audit registry (PROC-03), dedicated workflows for workforce-frontend and preference-frontend (PROC-14), PR merge gate (PROC-01). See [CA-005](../assurance/corrective-actions.mdx#ca-005-audit-process-governance) | Ryan Ammendolea (CEO) | Q2 2026  | 🔄 In Progress |

## Completed Treatments

| Date Verified | Risk ID | Treatment | Evidence |
| :------------ | :------ | :-------- | :------- |
| 2025-10-13 | R-002 | **MFA Enforcement:** Enabled on GitHub organisation — all members verified | CA-001 closed; GitHub org settings confirmed |
| 2026-Q4    | R-001 | **Database Backups:** Configured daily automated backups on Supabase (PITR) enabled; RPO confirmed at 12 hours | Supabase dashboard configuration |
| 2026-03-05 | R-003 | **ACL Architecture Modernisation:** Replaced hardcoded email service identity (`allocator_py_admin`) with JWT-claim-based RBAC. Implemented two-layer delegation constraint architecture (ARCH-2) and strict scope validation (ARCH-1B). | Adversarial ACL Audit `260304-acl`; re-audit `260305-adversarial` confirmed no remaining hardcoded bypasses. CA-003 closed. |
| 2026-03-05 | R-003 | **RLS Policy Hardening:** Distributed idempotency patterns (ARCH-3), standardised security function naming (`func_` prefix), zero-DB-cost JWT helpers for all RLS checks | ACL Modernisation Audit implementation — all pgTAP tests passing |
| 2026-03-05 | R-003, R-004 | **Match-Backend Security Review:** Verified timing-safe authentication, TOCTOU mitigations, empty-list guards against PostgREST wildcard returns, orchestration gate pattern | Match-Backend Audit `260305-match-backend` — all pytest tests passing |
| 2026-03-05 | R-003, R-004 | **GraphQL & State Management Review:** Validated cacheExchange, authExchange, and isEditing guards across all three frontends | GraphQL Audit `260305-graphql-state` — all TypeScript and unit tests passing |
