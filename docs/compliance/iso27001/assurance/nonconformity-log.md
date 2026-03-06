---
title: Non-Conformity Log
sidebar_position: 2
---

# Non-Conformity Log

> **Note:** This log tracks deviations from our policies or the ISO standard
> found during audits or daily operations. All entries include the source audit
> slug for cross-referencing.

**Last Reviewed:** 2026-03-06

| ID     | Date       | Source                                          | Description                                                                                                                                                  | Root Cause                              | Corrective Action                                | Status      |
| :----- | :--------- | :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :----------------------------------------------- | :---------- |
| NC-001 | 2025-10-12 | Internal Check                                  | Developer account with MFA disabled on GitHub                                                                                                                | Configuration drift / oversight         | [CA-001](./corrective-actions.md#ca-001-mfa-enforcement) | ✅ Closed   |
| NC-002 | 2026-01-15 | Customer Audit                                  | Missing penetration test report for previous year                                                                                                            | Budget constraints / prioritisation     | [CA-002](./corrective-actions.md#ca-002-penetration-testing) | 🔄 Open     |
| NC-003 | 2026-03-04 | Internal Technical Audit (`260304-acl`)         | Hardcoded service-account email (`allocator_py_admin@commonbond.com`) in RLS policies — bypasses RBAC with no JWT role, no audit trail, no rotation mechanism | Architectural design flaw from early prototype | [CA-003](./corrective-actions.md#ca-003-service-account-rbac-migration) | ✅ Closed   |
| NC-004 | 2026-03-05 | ISO 27001 Docs Audit (`260305-iso27001-preaudit`) | 20 documentation gaps in ISMS: placeholder fields in policies, no approval blocks, Risk Register with only 5 risks and missing R-006 entry, SoA is a stub   | Documentation in draft/template state   | [CA-004](./corrective-actions.md#ca-004-isms-documentation-uplift) | 🔄 In Progress |
| NC-005 | 2026-03-06 | Audit Process Audit (`260306-audit-process`)    | No PR/review gate before audit branches merge to main (PROC-01); no global audit registry (PROC-03); workforce-frontend and preference-frontend have no audit workflows (PROC-14) | Process gaps — audit workflow developed iteratively without full governance structure | [CA-005](./corrective-actions.md#ca-005-audit-process-governance) | 🔄 Open     |
