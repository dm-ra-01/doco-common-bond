<!-- audit-slug: 260325-agentic-platform-engineering -->

# Recommendations — Agentic Platform Engineering Readiness Audit

**Branch:** `audit/260325-agentic-platform-engineering`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-25

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---


---

## 🔴 Critical

### PROC-01: Complete absence of standard AGENTS.md files at repository roots.

Affects: `all` — Agent Context


- [ ] Create AGENTS.md in dev-environment following the open-standard (build/test/style).
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/AGENTS.md`
- [ ] Propagate AGENTS.md to all 9 repositories as root context files.
      `/Users/ryan/development/common_bond/antigravity-environment/README.md`

## 🟠 High

### PROC-02: Absence of repository-wide copilot-instructions.md files.

Affects: `all` — Agent Context


- [ ] Create .github/copilot-instructions.md in common-bond to define global architectural guardrails.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/.github/copilot-instructions.md`

### ARCH-01: No existing standard for agent-authored GitOps PRs for automated remediation.

Affects: `ecosystem` — GitOps Workflows


- [ ] Propose a design for a 'Cluster Auditor' agent that can generate remediation PRs in documentation/common-bond.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-remediation.md`

### SEC-01: Lack of 'Permissions & Safety' governance for autonomous agents. (Iterative Improvement Proposal)

Affects: `all` — Agent Safety


- [ ] Establish a Permission and Safety standard for agentic platform tools, defining read-only vs. write-scoped credentials and required human gates.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/about-us/our-technology.md`

### PROC-04: No standard for 'Agentic CI/CD Gates' like AI-driven test healing. (Iterative Improvement Proposal)

Affects: `all` — Agentic Workflows


- [ ] Prototype a 'Test Healer' workflow integration using Playwright's agentic capabilities in planner-frontend.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/.github/workflows/ai-healer.yml`

### CROSS-01: Inconsistent error message formatting across repos. (Iterative Improvement Proposal)

Affects: `all` — Diagnostic Standardization


- [ ] Enforce a standardized structured logging (JSON) format across all Python services to improve agentic root cause analysis.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/logging-standards.md`

### ARCH-02: Lack of standardized 'Agentic Contracts' for shared services (Supabase, Match, Planner).

Affects: `all` — Agent Contracts


- [ ] Standardize the .agents/contracts.md format across all shared compute and data services.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

### VAL-01: No automated benchmark to verify agent performance against domain-specific problems. (Round 2 Addition)

Affects: `ecosystem` — Agent Validation


- [ ] Establish a 'Gold Standard' regression suite for the Planner and Allocator domains.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/agent-quality.md`

### SEC-02: Manual rotation of high-privilege agent credentials. (Round 2 Addition)

Affects: `ecosystem` — Agent Safety


- [ ] Implement automated secret rotation for autonomous tools using Vault and GitHub Actions.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/workflows/agent-secret-rotation.yml`

## 🟡 Medium

### PROC-03: No standard .github/agents/ directory for specialized task instruction files.

Affects: `all` — Agent Personas


- [ ] Implement .github/agents/ in common-bond and dev-environment using the Microsoft Cluster Doctor pattern.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/.github/agents/README.md`

### DOC-03: Absence of 'Reference Implementation' pointers in documentation for agentic imitation. (Iterative Improvement Proposal)

Affects: `all` — Agent Context


- [ ] Identify one 'canonical' service for each technology stack (Python, Next.js, Supabase) and tag as reference implementation for AI tool context.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/reference-implementations.md`

### TECH-01: Outdated/Missing openapi.json or schema.sql exports in non-local shared locations. (Iterative Improvement Proposal)

Affects: `all` — Agent Context


- [ ] Standardize the generation and publishing of OpenAPI specs and SQL schemas for every compute service.
      `/Users/ryan/development/common_bond/antigravity-environment/README.md`

### OBS-01: No mechanism to distinguish agent-initiated mutations in logs from human actions. (Round 2 Addition)

Affects: `all` — Agent Traceability


- [ ] Define a standard X-Agent-ID header and logging convention for all autonomous tools.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/logging-standards.md`

### DISC-01: Absence of a centralized machine-readable registry of agentic capabilities. (Round 2 Addition)

Affects: `ecosystem` — Agent Discovery


- [ ] Create a root-level capabilities.json mapping personas to specific skills and workflows.
      `/Users/ryan/development/common_bond/antigravity-environment/README.md`

### DOC-04: Lack of structured 'PITFALLS' documentation for AI agents. (Round 2 Addition)

Affects: `all` — Agent Safety


- [ ] Standardize a CONSTRAINTS.md file for every repository specifically for non-obvious AI pitfalls.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/CONSTRAINTS.md`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | PROC-01, PROC-02 | Foundational context files are required before specialized agents can operate reliably. |
| 2 | PROC-03, ARCH-01 | High-level orchestration and specialized personas enable autonomous remediation. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| PROC-01 | Agent Context | `AGENTS.md` | Process Gap | 🔴 Critical |
| PROC-02 | Agent Context | `copilot-instructions.md` | Process Gap | 🟠 High |
| ARCH-01 | GitOps Workflows | `agent-remediation.md` | Architecture | 🟠 High |
| SEC-01 | Agent Safety | `our-technology.md` | Security | 🟠 High |
| PROC-04 | Agentic Workflows | `ai-healer.yml` | Process Gap | 🟠 High |
| CROSS-01 | Diagnostic Standardization | `logging-standards.md` | Consensus | 🟠 High |
| ARCH-02 | Agent Contracts | `agent-infrastructure.md` | Architecture | 🟠 High |
| VAL-01 | Agent Validation | `agent-quality.md` | Compliance | 🟠 High |
| SEC-02 | Agent Safety | `agent-secret-rotation.yml` | Security | 🟠 High |
| PROC-03 | Agent Personas | `README.md` | Process Gap | 🟡 Medium |
| DOC-03 | Agent Context | `reference-implementations.md` | Documentation Gap | 🟡 Medium |
| TECH-01 | Agent Context | `README.md` | Tech Debt | 🟡 Medium |
| OBS-01 | Agent Traceability | `logging-standards.md` | Observability | 🟡 Medium |
| DISC-01 | Agent Discovery | `README.md` | Architecture | 🟡 Medium |
| DOC-04 | Agent Safety | `CONSTRAINTS.md` | Documentation Gap | 🟡 Medium |

