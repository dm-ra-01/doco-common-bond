---
title: Management Review
sidebar_label: Management Review
sidebar_position: 4
description: Annual management review agenda template for ISO 27001:2022 Clause 9.3. Includes ISMS health metrics, performance against objectives, and forward-looking improvement planning.
---

# 🧭 Management Review

> **ISO 27001:2022 Clause 9.3** — _"Top management shall review the organisation's information security management system at planned intervals to ensure its continuing suitability, adequacy and effectiveness."_

**Frequency:** Annual (minimum) | **Owner:** Ryan Ammendolea, CEO | **Next Review:** 2027-03-01

---

## Purpose

The Management Review is the Clause 9.3 mandated formal review of the ISMS by top management.
It provides documented evidence that leadership actively monitors the ISMS and drives continual improvement.

Outputs from this meeting must be recorded and retained as documented information per **ISO 27001 Clause 7.5**.

---

## Agenda Template

The following agenda items are **mandatory** for ISO 27001:2022 Clause 9.3 compliance.

### 1. Previous Review Follow-up

- [ ] Review action items from the previous management review
- [ ] Confirm completion status for each action owner and due date
- [ ] Carry forward any outstanding items with revised due dates and rationale

### 2. Changes Relevant to the ISMS

Per **Clause 9.3.2(a)**:

- [ ] Changes to external and internal context (legal, regulatory, contractual, competitive)
- [ ] New or changed products, services, or operations in scope
- [ ] Organisational changes (staff, roles, structure) affecting security responsibilities
- [ ] Technology changes (infrastructure, SaaS tools, cloud providers)
- [ ] Changes to interested parties' requirements

Refer to: [Risk Register](/docs/compliance/iso27001/risk-management/risk-register)

### 3. Information Security Performance

Per **Clause 9.3.2(b)**:

#### 3a. Non-Conformities and Corrective Actions
- Review open non-conformities and their corrective action status
- Refer to: live NC Log and CA Register in `supabase-common-bond`

#### 3b. Security Monitoring & Measurement Results
- Review any security incidents from the period
- Review access control review outcomes
- Review results of technical vulnerability scans (if performed)

#### 3c. Audit Results
- Internal audit findings since last review
- External certification body findings (if Stage 1/2 audit performed)
- Refer to: [Audit Registry](/docs/audits/audit-registry)

#### 3d. Fulfilment of Information Security Objectives
- Review objectives set at the previous review
- Assess achievement against measurable targets

### 4. Risk Treatment Performance

Per **Clause 9.3.2(c)**:

- [ ] Review Risk Register — confirm all Ongoing treatments have evidence links (ISO 27001 Clause 8.3)
- [ ] Review risk levels for any risks that have changed since last review
- [ ] Confirm formal acceptance for any risks where treatment is not cost-justified
- Refer to: [Risk Register Dashboard](/docs/compliance/iso27001/risk-management/risk-register)

### 5. Supplier and Third-Party Performance

Per **Clause 9.3.2(d)**:

- [ ] Review Supplier Security Register — confirm DPA status for all suppliers
- [ ] Review any sub-processor additions or changes (Privacy Act APP 8)
- Refer to: Supplier Register in `supabase-common-bond`

### 6. ISMS Health Metrics

> **Clause 9.1** — Measurement, analysis and evaluation.

The following live metrics are sourced from the
[ISMS Health Dashboard](/docs/registers/isms-health). Review each KPI card during the meeting:

| Metric | View | Target |
|:-------|:-----|:-------|
| **Risk treatment coverage** | `v_risk_treatment_coverage` — % of Ongoing risks with evidence | 100% |
| **SoA completion** | `v_soa_completion` — implemented / applicable controls | Trend upward annually |
| **Supplier DPA status** | `v_supplier_dpa_status` — % suppliers with executed DPA | 100% |
| **NC closure rate** | `v_nc_closure_rate` — % of NCs closed within 90 days | ≥80% |

→ **[Open ISMS Health Dashboard →](/docs/registers/isms-health)**

Discuss any metric outside target threshold and assign a corrective action owner.

### 7. Opportunities for Improvement

Per **Clause 9.3.2(e)**:

- [ ] Review recommendations from the current audit cycle
- [ ] Discuss opportunities for process improvement
- [ ] Review Statement of Applicability completion trend
- Refer to: [SoA Dashboard](/docs/compliance/iso27001/operations/soa-dashboard)

### 8. Resources

Per **Clause 9.3.2(f)**:

- [ ] Confirm adequacy of current resources (budget, tools, personnel) for ISMS operation
- [ ] Identify any resource gaps and assign resolution owner

### 9. Review Outputs

Per **Clause 9.3.3** — record the following decisions and actions:

| Output | Owner | Due Date |
|:-------|:------|:---------|
| Continual improvement actions | | |
| Any changes to ISMS scope | | |
| Resource allocation decisions | | |
| Updated information security objectives | | |

---

## Record Retention

Meeting minutes and this completed agenda template must be retained as **documented information** per
**ISO 27001 Clause 7.5** for a minimum of **5 years** (consistent with certification renewal cycles).

Store completed records in the Audit Registry: [/docs/audits/audit-registry](/docs/audits/audit-registry)

---

## References

- ISO 27001:2022 Clause 9.3 (Management Review)
- ISO 27001:2022 Clause 9.1 (Monitoring, Measurement, Analysis and Evaluation)
- ISO 27001:2022 Clause 7.5 (Documented Information)
- [ISMS Health Dashboard](/docs/registers/isms-health)
- [Risk Register Dashboard](/docs/compliance/iso27001/risk-management/risk-register)
- [SoA Dashboard](/docs/compliance/iso27001/operations/soa-dashboard)
- [Audit Registry](/docs/audits/audit-registry)
