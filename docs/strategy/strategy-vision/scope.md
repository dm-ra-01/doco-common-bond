---
title: Scope & Boundaries
sidebar_label: Scope
sidebar_position: 3
---

# Scope & Boundaries

**Defining what Receptor is (and what it is not).**

To maintain our **"Doctor-Developer" agility** and prevent project bloat, we adhere to strict functional boundaries. Receptor is designed to be the "Intelligence Layer" that integrates with, rather than replaces, the existing hospital administrative ecosystem.

---

## Functional Boundary Matrix

### Core Capabilities (In Scope)

| Category | Capability | Status | Notes |
|----------|------------|--------|-------|
| **Position Management** | Teams, locations, positions, staff master data | **In Scope** | Foundation for all allocation activities via Workforce app. |
| **Job Line Planning** | Rotation configuration and timeline building | **In Scope** | End-to-end setup of allocation structures via Planner app. |
| **AMC Compliance** | Training rule validation against AMC standards | **In Scope** | Automating accreditation requirements for clinical experience. |
| **Preferencing** | Mobile-first preference submission | **In Scope** | 5-level system for transparent trainee input via Preferencer app. |
| **Matching** | Preference-driven optimization engine | **In Scope** | Our core IP. Mathematical resolution of choices vs. constraints. |
| **Modelling** | "Sandbox" scenario testing for managers | **In Scope** | Testing the impact of weighting changes before live allocation. |

### Rotation Lifecycle (In Scope — Phased)

| Category | Capability | Status | Notes |
|----------|------------|--------|-------|
| **Rotation Swaps** | Post-allocation term exchange management | **Extension** | Planned FY2027–28: Structured swap requests with approval workflow. |
| **Certificates of Service** | End-of-term documentation generation | **Extension** | Planned FY2027–28: Automated CoS for completed rotations. |
| **Rostering Integration** | Handoff to shift scheduling systems | **Strategic** | FY2029+: API feeds to HealthRoster/Kronos for daily operations. |

### Explicit Exclusions (Out of Scope)

| Category | Capability | Status | Notes |
|----------|------------|--------|-------|
| **Recruitment** | Job advertising, candidate screening, interviews | **Out of Scope** | Pre-employment handled by HR/recruitment teams. |
| **Onboarding** | Contracts, orientation, credentialing, payroll setup | **Out of Scope** | Handled by Medical Workforce *before* allocation begins. |
| **Payroll** | Salary calculation, Award interpretation | **Out of Scope** | Downstream finance systems (Oracle, SAP, Chris21). |
| **Primary Credentialing** | AHPRA registration, provider numbers | **Out of Scope** | Pre-employment verification by Medical Workforce. |

:::info Key Boundary
**Receptor begins where onboarding ends.** We assume workers are already credentialed, contracted, and payroll-configured before they enter the preferencing and allocation workflow.
:::

---

## The Integration Philosophy

> **"We are the 'Brain' that feeds the 'Calendar'."**

Receptor specializes in the **Architecture of Allocation**. We resolve the complex question of *who* goes *where* for the entire year. Once that architecture is finalized, the data is pushed to the calendar system.

### Handoff to Rostering

The final output of Receptor is a **Confirmed Allocation Matrix**.
*   **Receptor says:** "Dr Smith is in Cardiology for Term 3 (Aug-Oct)."
*   **Rostering System says:** "Dr Smith is working the night shift on Tuesday, Aug 14th."

By focusing strictly on the **Allocation Brain**, we ensure our system remains agile, interoperable, and 10x more effective than all-in-one generic HR suites.
