---
title: Risk Management & Regulatory Compliance
sidebar_label: Risk Management
sidebar_position: 1
---

# Risk Management & Regulatory Compliance

Operating in the Australian Health Tech sector requires a rigorous approach to risk mitigation, particularly regarding patient data and clinical workforce safety.

## 1. Data Privacy & Sovereignty

### A. Australian Privacy Act 1988

Receptor is committed to compliance with the Australian Privacy Principles (APPs).

- **Data Residency:** We host all clinical and sensitive worker data within Australian regions (e.g., AWS Sydney or Azure Australia East) to ensure data sovereignty.
- **De-identification:** We de-identify and aggregate preference data used for large-scale workforce modelling.

### B. Access Control (Row Level Security)

We leverage Supabase's Row Level Security (RLS) to ensure that:

- Medical Workforce Managers access only data within their assigned Local Hospital Network (LHN).
- Junior Medical Officers (JMOs) view only their own preferences and allocated rotations.

## 2. Clinical & Operational Risks

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| **Rostering Errors** (Future scope) | High — Fatigue risk | Automated checks for minimum break times and maximum shift hours (planned for FY2029+ rostering integration) |
| **EPA Non-compliance** | Medium — Education | Real-time tracking of rotation types against Australian Medical Council (AMC) training requirements |
| **Platform Downtime** | High — Operations | Docker-based self-hosting with automated backups and failover procedures |

## 3. Regulatory Alignment

- **Therapeutic Goods Administration (TGA) Classification:** We continuously monitor software features to determine if any 'decision support' elements require TGA registration as Software as a Medical Device (SaMD).
- **AMC Standards:** Regular audits of allocation logic ensure alignment with the National Framework for Prevocational Medical Training.
