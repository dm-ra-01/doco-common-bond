---
title: Risk Register
sidebar_position: 2
---

# Risk Register

> **Note:** This is a snapshot of our key risks. The active register is maintained in a secure spreadsheet/tool accessible by the Security Team.

## Top Risks Snapshot

| ID | Description | Threat | Impact | Risk Level | Treatment Strategy | Status |
|:---|:---|:---|:---|:---|:---|:---|
| R-001 | **Laptop Loss/Theft** | Data leak via stolen device | Confidentiality breach | Medium | **Reduce:** Full-disk encryption (FileVault) & Strong Passwords | Implemented |
| R-002 | **Phishing Attack** | Credential theft | Unauth access to systems | High | **Reduce:** MFA on all accounts + Security Awareness Training | Implemented |
| R-003 | **Cloud Misconfiguration** | S3 Bucket / Database exposed | Data Leak | High | **Reduce:** IaC reviews, RLS policies on Supabase | Implemented |
| R-004 | **Dependency Vulnerabilities** | Exploit on older libraries | System Compromise | Medium | **Reduce:** Dependabot alerts & regular updates | Ongoing |
| R-005 | **Insider Threat** | Staff copying data | Data Leak | Medium | **Reduce:** Least Privilege access, Background checks | Ongoing |

## Full Register Access
[Link to Secure Risk Register (Internal Only)]
