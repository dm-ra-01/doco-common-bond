---
title: Who We Are
sidebar_label: Who We Are
sidebar_position: 3
description: Common Bond's corporate identity, legal structure, brand values, and how we operate as a solo-founder healthcare technology company using the EOS framework.
last_reviewed: 2026-03-11
---

import { FrameworkCard, MatrixGrid } from
'@site/src/components/BusinessPlanning';

# Who We Are

**Common Bond: building the fairness infrastructure Australia's hospitals
need.**

---

## The Corporate Structure

Common Bond operates through two related legal entities. This structure
separates intellectual property ownership from commercial operations — a
deliberate decision to protect the core technology as the company scales.

| Entity                  | ACN         | ABN                                      | Role                                                                                                                                                                                                                |
| :---------------------- | :---------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **MyJMO Pty Ltd**       | 648 051 852 | —                                        | Intellectual Property Owner. Holds all Receptor source code, algorithms, and proprietary assets under the Software Licence Agreement.                                                                               |
| **Common Bond Pty Ltd** | 694 840 394 | 50 152 085 287 (Ammendolea Family Trust) | Exclusive Licensee. Operates the business, engages with clients, and commercialises the Receptor platform under licence from MyJMO Pty Ltd. Common Bond Pty Ltd is the trustee for **The Ammendolea Family Trust**. |

The **Software Licence Agreement** between MyJMO Pty Ltd (Licensor) and Common
Bond Pty Ltd (Licensee) establishes an exclusive, perpetual licence to
commercialise all Receptor IP, with appropriate royalty and governance
provisions.

:::note For ISO 27001 and governance purposes, Common Bond Pty Ltd is the entity
referenced in all client agreements, ISMS documentation, and external
communications. MyJMO Pty Ltd is the registered holder of the underlying
intellectual property. :::

---

## How We Operate

Common Bond is a **solo-founder company** operating under the **Entrepreneurial
Operating System (EOS)** — a framework that gives small, high-accountability
teams the same strategic rigour as larger organisations.

The founder currently fills four critical seats:

| Seat                    | Responsibilities                                                             |
| :---------------------- | :--------------------------------------------------------------------------- |
| **Visionary**           | 10-year direction, R&D breakthroughs, clinical and government relationships  |
| **Integrator**          | Day-to-day operations, P&L, process management                               |
| **Service Delivery**    | Client onboarding, constraint mapping, allocation audits, customer happiness |
| **Product Engineering** | Software architecture, algorithm optimisation, platform security             |

This is not a limitation — it is a deliberate feature of our early stage. The
founder's ability to simultaneously understand the SQL and the SOP (standard
operating procedure) means Receptor is built with zero translation loss between
what doctors need and what the software does.

As we scale beyond the pilot phase, dedicated specialists will fill each seat.
See the [Talent Roadmap](../operations/eos/talent-roadmap) for details.

---

## Our Brand Values

The name "Common Bond" reflects the relationship between a health service and
its staff — a bond that is strengthened when the most complex administrative
processes are handled with empathy, transparency, and mathematical integrity.

### The Four Pillars

<MatrixGrid columns={2}>
  <FrameworkCard title="Clinical Empathy" icon="🩺">
    <strong>We solve problems for doctors because we are doctors.</strong>
    <p>Traditional healthcare software is built by enterprise vendors who observe the workflow from the outside. Common Bond's founder is an active hospital doctor who lives the workflow daily — identifying with burnout, fatigue, and the frustration of opaque systems.</p>
    <p><em>In action: Ryan continues to work rostered ICU shifts at Monash Health while building and maintaining Receptor. Every product decision is filtered through his lived clinical experience.</em></p>
  </FrameworkCard>

<FrameworkCard title="Explainable Integrity" icon="⚖️">
    <strong>The "Glass Box" principle — no black boxes.</strong>
    <p>Every allocation decision in Receptor is mathematically traceable and auditable. Doctors have a right to know why they received a particular rotation. We reject opaque AI in favour of constraint-driven optimisation that can be explained to a junior doctor in plain English.</p>
    <p><em>In action: the Receptor allocation report shows each doctor the preference satisfaction score and constraint that determined their match.</em></p>
  </FrameworkCard>

<FrameworkCard title="Operational Agility" icon="⚡️">
    <strong>Moving at the speed of clinical need.</strong>
    <p>Common Bond operates with the speed and cost-effectiveness that large consultancies cannot match. Because we understand both the SQL and the SOP, we deliver 10x faster than traditional enterprise vendors — without the enterprise overhead.</p>
    <p><em>In action: the entire multi-application Receptor platform — Workforce, Planner, Preferencer, and Allocator — is designed, built, and maintained by a single engineer.</em></p>
  </FrameworkCard>

<FrameworkCard title="Shared Bond" icon="🤝">
    <strong>Strengthening the employer-employee relationship.</strong>
    <p>A fair, transparent allocation system doesn't just improve a roster — it changes how a doctor feels about their employer. We believe this shift in institutional trust is what makes health services genuine employers of choice.</p>
    <p><em>In action: the Receptor preferencing system put meaningful decision-making power back into the hands of junior doctors for the first time at our pilot sites.</em></p>
  </FrameworkCard>
</MatrixGrid>

---

## Our Technology Philosophy

We deliberately choose best-in-class, composable technologies over monolithic
vendor lock-in:

- **Supabase** for the database and authentication layer — enterprise-grade
  Postgres with row-level security built in.
- **Cloudflare** for global edge delivery — fast, secure, and cost-effective at
  scale.
- **OR-Tools (Google)** for the matching engine — industrial-grade constraint
  solving, not heuristics.
- **Open standards** (GraphQL, REST) for all internal APIs — no proprietary
  interchange formats.

See [Our Technology](./our-technology) for a full internal architecture brief.

---

:::tip For Governance Context For ISO 27001 compliance documentation, risk
register, and asset inventory referencing these entities, see
[Compliance](../compliance/iso27001/). :::
