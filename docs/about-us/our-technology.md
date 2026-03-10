---
title: Our Technology
sidebar_label: Our Technology
sidebar_position: 8
description: An internal technology brief for Common Bond and Receptor — plain-language architecture overview, technology stack rationale, and internal repository index for pre-customer and advisor conversations.
last_reviewed: 2026-03-11
---

import { FrameworkCard, MatrixGrid } from
'@site/src/components/BusinessPlanning';

# Our Technology

:::caution Internal Brief This document is an **internal reference only** —
intended to prepare the founder (and future team members) for technical
conversations with hospital IT teams, advisors, and procurement panels. It is
published internally, not to customers. :::

---

## Architecture in One Sentence

Receptor is a **multi-application SaaS platform** powered by a Postgres database
(Supabase), served globally via Cloudflare's edge network, with a Google
OR-Tools constraint optimisation engine at its core — all designed, built, and
maintained by a single engineer as a solo-developer platform.

---

## The Technology Stack

### Core Infrastructure

<MatrixGrid columns={2}>
  <FrameworkCard title="Supabase" icon="🗄️">
    <strong>Database, Authentication & Real-time</strong>
    <p>Enterprise-grade managed Postgres with Row-Level Security (RLS) as the backbone of all multi-tenant data isolation. Supabase provides the PostgreSQL instance, JWT-based authentication (with custom <code>app_metadata</code> claims for role management), and real-time subscriptions for live allocation updates.</p>
    <p><strong>Why Supabase over a raw Postgres instance?</strong> We get enterprise features (connection pooling, automatic backups, point-in-time recovery, edge functions) with the operational simplicity to suit a solo-developer team.</p>
  </FrameworkCard>
  <FrameworkCard title="Cloudflare" icon="☁️">
    <strong>Edge Delivery, Workers & Pages</strong>
    <p>All Receptor frontends are deployed as Cloudflare Pages — globally distributed static sites with fast edge delivery. Cloudflare Workers provide lightweight serverless compute for authentication gate functions and API proxy logic, without a dedicated backend fleet.</p>
    <p><strong>Why Cloudflare?</strong> Global performance at near-zero marginal cost at our scale. Workers eliminate the need for a traditional app server. The security model (DDoS, WAF, zero-trust access control) is enterprise-grade out of the box.</p>
  </FrameworkCard>
  <FrameworkCard title="Google OR-Tools" icon="⚙️">
    <strong>Constraint Optimisation Engine</strong>
    <p>Google's open-source operations research library — the same engine used for production scheduling across Google's global data centres. We use the CP-SAT solver to find optimal allocation solutions across thousands of constraint combinations in seconds.</p>
    <p><strong>Why OR-Tools over a custom algorithm or generic AI?</strong> Medical allocation is a constraint satisfaction problem with hard requirements (mandatory clinical experiences, AMC compliance, specialty boundaries). OR-Tools produces <em>provably optimal</em>, <em>fully explainable</em> solutions — not black-box predictions.</p>
  </FrameworkCard>
  <FrameworkCard title="Python + FastAPI" icon="🐍">
    <strong>Allocation Microservice</strong>
    <p>The matching engine runs as a containerised Python microservice (FastAPI) that receives allocation job requests from the Supabase Edge Function orchestrator, runs the OR-Tools solver, and writes results back atomically to Postgres via RPC. Decoupled from the frontend layer — can run independently in batch mode.</p>
  </FrameworkCard>
  <FrameworkCard title="Next.js" icon="⚛️">
    <strong>Web Frontend Applications</strong>
    <p>All three administrative web applications (Workforce, Planner, and Preferencer admin panel) are built in Next.js 14+ with the App Router, TypeScript, and a GraphQL client (urql) for strict data contract enforcement with automated type drift detection.</p>
  </FrameworkCard>
  <FrameworkCard title="Flutter" icon="📱">
    <strong>Mobile Preferencing App</strong>
    <p>The doctor-facing Preferencer is a Flutter mobile application — one codebase targeting iOS and Android. Flutter provides fast, native-feeling UI with full offline-first capability for doctors submitting preferences from wards or between shifts.</p>
  </FrameworkCard>
</MatrixGrid>

### Supporting Standards & Tooling

| Concern             | Tool/Approach                                                                       |
| :------------------ | :---------------------------------------------------------------------------------- |
| **API Type Safety** | GraphQL with automated CodeGen from live Supabase schema; drift detection in CI     |
| **Database Safety** | Declarative schema migrations (never manual edits); Supabase CLI diff workflow      |
| **Testing**         | Vitest (unit), Playwright (E2E web), pgTAP (database), pytest (Python microservice) |
| **CI/CD**           | GitHub Actions; `supabase-ci` environment for isolated migration testing            |
| **Security**        | ISO 27001 ISMS active; RLS on all tables; PHI scrubbing from client-side caches     |
| **Documentation**   | Docusaurus; multiple internal sites maintained in source control                    |

---

## Why This Stack?

This is not a startup stack assembled from whatever was fashionable. Every tool
was chosen for a specific reason:

1. **Postgres** is the only database capable of supporting the combination of
   complex relational medical data, real-time subscriptions, and row-level
   security that Receptor requires in a single managed product.
2. **No ORM** — we write typed SQL directly for anything performance-sensitive.
   Healthcare data models are too complex for ORM magic to be safe or
   performant.
3. **Cloudflare over AWS/Azure** — we deliberately avoided a hyperscaler
   dependency for a single-developer product. Cloudflare's pricing model scales
   down to near-zero at our current stage and scales up without vendor lock-in.
4. **OR-Tools over LLM/ML** — allocation is a deterministic constraint problem,
   not a prediction problem. Using a constraint solver means every allocation
   output can be explained, audited, and challenged — which is a legal and
   ethical requirement when the outcomes affect people's careers.

---

## Internal Repository Index

The following repositories constitute the complete Receptor ecosystem. All repos
are **private**. This index is for internal team orientation and pre-engagement
briefings.

| Repository                           | Language / Stack                                   | Description                                                                                                                                                                                                     |
| :----------------------------------- | :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase-receptor`                  | PostgreSQL, Supabase CLI                           | All database migrations, schema definitions, RLS policies, stored functions, seed data, and CI configuration for the Receptor Supabase instance. The single source of truth for the data layer.                 |
| `match-backend` / `receptor-planner` | Python 3.12, FastAPI, OR-Tools                     | Containerised allocation microservice. Receives allocation jobs from the orchestrator Edge Function, runs the CP-SAT constraint solver, writes results back to Postgres atomically via RPC.                     |
| `planner-frontend`                   | Next.js 14 (App Router), TypeScript, urql, GraphQL | Job line planning application for Medical Workforce Managers. Defines the annual rotation structure, validates AMC framework requirements, and exports job line data to the allocator.                          |
| `workforce-frontend`                 | Next.js 14, TypeScript, urql, GraphQL              | Position, team, and staff management application. Master data for all allocation activities — the source of truth for who works where and in what role.                                                         |
| `preference-frontend`                | Next.js 14 + Flutter, TypeScript, Dart             | Dual web/mobile preferencing application. Admin panel (Next.js) for configuring preference windows; doctor-facing app (Flutter) for submitting ranked preferences on web and mobile.                            |
| `dev-environment`                    | Shell, Python, YAML                                | Canonical shared agent infrastructure: scripts, schemas, skills, and workflows used across all repositories. The single source of truth for AI agent tooling and CI/CD conventions.                             |
| `documentation`                      | Docusaurus (TypeScript)                            | All Docusaurus documentation sites: `common-bond` (this site — corporate, strategy, compliance), `receptor-ecosystem` (deprecated), and supporting internal Docusaurus deployments. Hosted on Cloudflare Pages. |

---

:::tip For Deeper Reading

- [Database Schema](../infrastructure/database-schema) — full schema
  documentation with entity-relationship diagrams
- [Engineering Standards](../engineering/) — coding standards, testing
  requirements, and CI conventions :::
