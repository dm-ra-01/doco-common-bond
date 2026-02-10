---
title: ISO/IEC 27001:2022 Compliance
sidebar_label: Overview
slug: /compliance/iso27001
---

# ISO/IEC 27001:2022 Compliance

This is the living Information Security Management System (ISMS) documentation for Receptor. It tracks our compliance status against the ISO/IEC 27001:2022 standard — honestly.

:::caution Early Stage
Receptor is a pre-revenue startup. Many controls are **documented as planned or in-progress**, not yet fully implemented. This documentation serves as both a compliance tracker and a roadmap to certification.
:::

## ISMS Scope (Draft)

The scope of our ISMS covers:
- All software development activities for the Receptor platform
- Cloud infrastructure (Supabase, Cloudflare, GitHub)
- The Receptor SaaS platform and its data (worker preferences, allocation data)
- Supporting business processes operated by Common Bond

**Exclusions:** Physical office security (fully remote, cloud-native team).

## Key Sections

- **[ISMS Clauses (4-10)](./clauses/index.md)**: Management system requirements with approach tables and TODOs.
- **[Annex A Controls](./controls/index.md)**: The 93 security controls across 4 themes.
- **[Statement of Applicability (SoA)](./soa.md)**: Which controls apply and why.
- **[Compliance Tasks](./tasks.md)**: Phased task list for achieving certification.

## Current Status

| Area | Status |
|------|--------|
| ISMS Clauses (4-10) | 🟡 Mostly partial/TODO — foundational documents needed |
| Organizational Controls (5) | 🟡 Many policies not yet drafted |
| People Controls (6) | 🔴 Most controls TODO |
| Physical Controls (7) | 🟡 Largely inherited from cloud providers (needs documentation) |
| Technological Controls (8) | 🟡 Technical foundations exist, formalisation needed |

## Approach

We treat this Docusaurus section as a **living compliance dashboard**. Each clause and control includes:
1. **Status badge** — honest assessment of current state
2. **Approach** — how we intend to address the requirement
3. **Evidence links** — to existing documentation where applicable
4. **TODOs** — specific actions needed

This is a working document. Statuses will be updated as controls are implemented.
