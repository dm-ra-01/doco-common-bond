---
title: Statement of Applicability (SoA)
sidebar_position: 2
---

# Statement of Applicability (SoA)

## 1. Overview
This document identifies the controls from Annex A of ISO/IEC 27001:2022 that are applicable to Common Bond (Receptor Platform).

## 2. Applicability Summary
Given our scale and nature (remote, cloud-native software), we have adopted a "Lite" approach to the SoA.

- **Total Possible Controls:** 93
- **Excluded:** ~20 (Physical security irrelevant to remote work, clear desk policy, etc.)
- **Implemented:** ~40 (Cloud defaults, GitHub settings)
- **Planned:** ~33 (Formal policy drafting, advanced monitoring)

## 3. Justification for Inclusions/Exclusions

### Included (Key Controls)
*   **A.5.15 Access Control:** Critical for SaaS platform security.
*   **A.8.26 Application Security Requirements:** Essential for our development lifecycle.
*   **A.5.23 Information Security for use of Cloud Services:** We are 100% cloud-based (Supabase, Cloudflare).

### Excluded (Justification)
*   **A.7.2 Physical Entry:** We have no offices.
*   **A.7.4 Physical Security Monitoring:** We have no physical perimeter to monitor.
*   **A.7.11 Supporting Utilities:** We do not manage power/water for a data center (handled by AWS/Supabase).

## 4. Full SoA Record
The detailed line-by-line assessment is maintained in an internal spreadsheet: `SA 1 - Statement of Applicability.xlsx`.
