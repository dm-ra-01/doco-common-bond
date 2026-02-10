---
title: ISMS Clauses (4-10)
sidebar_label: Clauses
---

import { ControlStatus } from '@site/src/components/compliance/ComplianceComponents';

# ISMS Clauses

The following clauses define the requirements for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS). For each clause we document: **what we have**, **how we intend to address it**, and **what remains to be done**.

---

## 4. Context of the Organization

### 4.1 Understanding the organization and its context

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Vision, scope, and strategic documents in Docusaurus. SWOT analysis completed. |
| **Approach** | Maintain a living record of internal/external issues affecting information security in our strategy docs. Review quarterly. |
| **Evidence** | [Vision](../../../business-planning/strategy-vision/vision) · [SWOT](../../../business-planning/strategy-vision/swot) |

:::note TODO
- [ ] Create a formal "Context of the Organisation" register that explicitly maps issues to information security risks.
- [ ] Schedule quarterly reviews of internal/external issues.
:::

### 4.2 Understanding the needs and expectations of interested parties

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Service catalog and stakeholder references in business planning docs. |
| **Approach** | Maintain a stakeholder register that maps each party's information security requirements. |
| **Evidence** | [Service Catalog](../../../business-planning/product/index) |

:::note TODO
- [ ] Create a formal interested parties register (workers, hospitals, regulators, cloud providers).
- [ ] Document each party's specific security requirements and expectations.
:::

### 4.3 Determining the scope of the ISMS

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | High-level scope statement in this document. |
| **Approach** | Define a formal ISMS scope document that lists all systems, data flows, locations, and exclusions. |

:::info ISMS Scope (Draft)
The scope of our ISMS covers: all software development activities, cloud infrastructure (Supabase, Cloudflare), the Receptor SaaS platform, and supporting business processes. Physical office security is currently out of scope (fully remote team using cloud infrastructure).
:::

:::note TODO
- [ ] Formalise the ISMS scope statement as a standalone, versioned document.
- [ ] Identify and justify any exclusions from the scope.
:::

### 4.4 Information security management system

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | This Docusaurus compliance section serves as the living ISMS documentation. |
| **Approach** | Treat this entire compliance section as the ISMS. Track processes, controls, and improvement actions here. |

:::note TODO
- [ ] Define the interaction between all ISMS processes (risk assessment, internal audit, management review, etc.).
- [ ] Document the ISMS process model (Plan-Do-Check-Act).
:::

---

## 5. Leadership

### 5.1 Leadership and commitment

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Founder-led startup. Security decisions are made directly by the founder. |
| **Approach** | Document management commitment via signed policy statements and scheduled management reviews. |

:::note TODO
- [ ] Draft and sign a management commitment statement for information security.
- [ ] Schedule formal management review meetings (at least annually).
:::

### 5.2 Policy

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | RLS strategy document exists but is a *technical design*, not a top-level security policy. |
| **Approach** | Create a formal Information Security Policy that sets direction and principles. Technical policies (RLS, key management) will be subordinate. |
| **Related** | [RLS Strategy](../https://docs.commonbond.au/receptor/docs/infrastructure/rls-policies) (technical design, not the policy itself) |

:::note TODO
- [ ] **Draft a top-level Information Security Policy** — covering purpose, scope, principles, and management commitment.
- [ ] Have the policy formally approved and signed by leadership.
- [ ] Communicate the policy to all team members and relevant stakeholders.
:::

### 5.3 Organizational roles, responsibilities and authorities

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Founder holds all roles currently (small startup). EOS Accountability Chart exists. |
| **Approach** | Define explicit ISMS roles (e.g., Information Security Officer, even if the founder holds the role). |
| **Evidence** | [Accountability Chart](../../../business-planning/operations/eos/accountability-chart) |

:::note TODO
- [ ] Formally assign ISMS roles and document responsibilities (who is responsible for risk management, incident response, etc.).
:::

---

## 6. Planning

### 6.1 Actions to address risks and opportunities

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | High-level risk management document in Governance section. Clinical/operational risks identified. |
| **Approach** | Implement a formal risk assessment methodology. Maintain a risk register with treatment plans. |
| **Evidence** | [Risk Management](../../../governance-and-legal/risk-management) |

:::note TODO
- [ ] **Adopt a risk assessment methodology** (e.g., qualitative 5×5 matrix).
- [ ] Create a formal **Risk Register** with likelihood, impact, risk owner, and treatment plan for each risk.
- [ ] Document risk acceptance criteria.
:::

### 6.2 Information security objectives and planning to achieve them

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No formal security objectives defined yet. |
| **Approach** | Define measurable security objectives aligned with the security policy (e.g., "zero critical vulnerabilities in production", "100% RLS coverage"). |

:::note TODO
- [ ] Define at least 3 measurable information security objectives.
- [ ] Create plans to achieve each objective (who, what, when, resources).
:::

### 6.3 Information security risk treatment

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Statement of Applicability (SoA) started. Annex A controls documented in this section. |
| **Approach** | Map each identified risk to one or more Annex A controls. Document the risk treatment plan. |

:::note TODO
- [ ] Complete the formal risk treatment plan linked to the Risk Register.
- [ ] Finalise the Statement of Applicability (SoA) with justifications for inclusions/exclusions.
:::

---

## 7. Support

### 7.1 Resources

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Small team. Cloud infrastructure (Supabase, Cloudflare) provides most security tooling. |
| **Approach** | Identify resource needs for ISMS implementation and operation. Budget for security tools/training. |

:::note TODO
- [ ] Document the resources allocated to ISMS implementation (time, budget, tools).
:::

### 7.2 Competence

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Founder has software engineering and security background. |
| **Approach** | Maintain a competence matrix. Identify training needs as the team grows. |

:::note TODO
- [ ] Create a competence matrix for ISMS-related roles.
- [ ] Plan ISO 27001 Lead Implementer training for the founder.
:::

### 7.3 Awareness

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No formal security awareness programme. |
| **Approach** | Develop a lightweight security awareness programme for all team members (even contractors). |

:::note TODO
- [ ] Create a security awareness briefing document.
- [ ] Define onboarding security checklist for new team members.
:::

### 7.4 Communication

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Internal comms via GitHub/Slack. No formal communication plan for security matters. |
| **Approach** | Define what needs to be communicated, to whom, when, and how for security-related matters. |

:::note TODO
- [ ] Create an ISMS communication plan (internal and external).
:::

### 7.5 Documented information

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Docusaurus serves as our living documentation platform. Version control via Git. |
| **Approach** | Use Docusaurus + Git as the primary document management system. Define document control procedures. |

:::note TODO
- [ ] Define a document control procedure (versioning, review, approval, retention).
- [ ] Ensure all ISMS documents follow a consistent template with metadata (owner, last reviewed, version).
:::

---

## 8. Operation

### 8.1 Operational planning and control

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Infrastructure setup scripts (`setup.sh`), Docker orchestration, CI/CD via Codemagic. |
| **Approach** | Ensure operational procedures are documented and security controls are embedded in CI/CD and deployment workflows. |

:::note TODO
- [ ] Document operational security procedures (deployment, incident handling, change management).
- [ ] Implement security gates in CI/CD pipelines (dependency scanning, SAST).
:::

### 8.2 Information security risk assessment

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No formal risk assessment has been conducted. |
| **Approach** | Conduct the initial risk assessment using the methodology defined in Clause 6.1. Schedule recurring assessments. |

:::note TODO
- [ ] **Conduct the initial information security risk assessment.**
- [ ] Document results in the Risk Register.
- [ ] Schedule annual reassessment.
:::

### 8.3 Information security risk treatment

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No formal risk treatment plan. |
| **Approach** | For each risk in the register, select treatment options (mitigate, accept, transfer, avoid) and assign owners. |

:::note TODO
- [ ] Implement risk treatment plan based on risk assessment results.
- [ ] Obtain management approval for residual risks.
:::

---

## 9. Performance evaluation

### 9.1 Monitoring, measurement, analysis and evaluation

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Basic monitoring via Supabase dashboard. No formal security metrics. |
| **Approach** | Define KPIs for ISMS performance (e.g., open vulnerabilities, incident response time, control implementation %). |

:::note TODO
- [ ] Define ISMS performance metrics and KPIs.
- [ ] Implement a dashboard or periodic reporting mechanism.
:::

### 9.2 Internal audit

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No internal audit programme. |
| **Approach** | Establish an internal audit programme. For a startup, this can be lightweight — self-assessments with documented evidence. |

:::note TODO
- [ ] Define an internal audit programme (scope, frequency, methodology).
- [ ] Conduct the first internal audit prior to certification.
:::

### 9.3 Management review

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No formal management review of the ISMS. |
| **Approach** | Schedule periodic management reviews covering: audit results, risk status, incidents, improvement opportunities. |

:::note TODO
- [ ] Schedule the first management review.
- [ ] Define the management review agenda template (inputs and outputs per ISO 27001).
:::

---

## 10. Improvement

### 10.1 Continual improvement

<ControlStatus status="partial" />

| Aspect | Detail |
|--------|--------|
| **What we have** | Living documentation approach. Git history tracks changes. |
| **Approach** | Use this documentation as the primary mechanism for tracking improvements. Maintain a corrective action log. |

:::note TODO
- [ ] Create a corrective/preventive action log.
:::

### 10.2 Nonconformity and corrective action

<ControlStatus status="todo" />

| Aspect | Detail |
|--------|--------|
| **What we have** | No formal nonconformity process. |
| **Approach** | Define a lightweight process for identifying, documenting, and resolving nonconformities. |

:::note TODO
- [ ] Define a nonconformity and corrective action procedure.
- [ ] Create a nonconformity register template.
:::
