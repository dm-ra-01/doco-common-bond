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

### GOV-03: Lack of 'Dual-Control' requirement for destructive autonomous operations. (Round 5 Addition)

Affects: `all` — Agent Safety


- [ ] Formalize a DUAL_CONTROL.md standard for mandatory human-in-the-loop gates.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-governance.md`

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


- [ ] Establish a 'Gold Standard' regression suite using 'LLM-as-a-Judge' models for probabilistic verification of the Planner and Allocator domains.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/agent-quality.md`

### SEC-02: Manual rotation of high-privilege agent credentials. (Round 2 Addition)

Affects: `ecosystem` — Agent Safety


- [ ] Implement automated secret rotation for autonomous tools using Vault and GitHub Actions.
      `/Users/ryan/development/common_bond/antigravity-environment/receptor-infra/.github/workflows/agent-secret-rotation.yml`

### GOV-01: Lack of machine-readable Change Impact Assessments in PRs. (Round 3 Addition)

Affects: `all` — Agent Context


- [ ] Implement a 'PR Auditor' workflow to generate automated impact assessments.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-governance.md`

### VAL-02: Manual verification of complex RLS policies. (Round 3 Addition)

Affects: `supabase-receptor` — Security Validation


- [ ] Implement an 'RLS Auditor' agent persona to provide formal verification of data isolation.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/agent-security.md`

### SEC-03: Lack of Zero-Trust 'Agent-to-Agent' authentication standard. (Round 4 Addition)

Affects: `ecosystem` — Agent Identity


- [ ] Adopt a JWT-based 'Agent Identity' standard for secure inter-persona tool calls.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

### TECH-03: Absence of a mandatory 'Dry-Run' and 'Impact Preview' standard for agentic tools. (Round 4 Addition)

Affects: `all` — Agent Safety


- [ ] Mandate enforced --dry-run and JSON-diff impact previews for all mutating skills.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

### VAL-03: Vulnerability to prompt injection and malicious tool manipulation. (Round 4 Addition)

Affects: `ecosystem` — Agent Safety


- [ ] Integrate an 'Adversarial Tester' agent persona to red-team system prompts in CI/CD.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/compliance/agent-security.md`

### ARCH-05: Risk of runaway agentic processes and resource exhaustion. (Round 5 Addition)

Affects: `ecosystem` — Agent Safety


- [ ] Implement global 'Circuit Breaker' and quota standards for autonomous workflows.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

### TECH-04: Absence of a mandatory 'Safe Rollback' protocol for autonomous actions. (Round 5 Addition)

Affects: `all` — Agent Robustness


- [ ] Mandate the implementation of rollback() methods for all mutating agentic workflows.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

## 🟡 Medium

### DOC-01: Technical documentation is not structured for semantic RAG or LLM context injection.

Affects: `all` — Agent Context


- [ ] Standardize semantic metadata headers for all engineering documentation.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/README.md`

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


- [ ] Define a standard X-Agent-ID header and logging convention for all autonomous tools, including mandatory PII/Secret masking for prompt/completion telemetry.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/logging-standards.md`

### DISC-01: Absence of a centralized machine-readable registry of agentic capabilities. (Round 2 Addition)

Affects: `ecosystem` — Agent Discovery


- [ ] Create a root-level capabilities.json mapping personas to specific skills and workflows.
      `/Users/ryan/development/common_bond/antigravity-environment/README.md`

### DOC-04: Lack of structured 'PITFALLS' documentation for AI agents. (Round 2 Addition)

Affects: `all` — Agent Safety


- [ ] Standardize a CONSTRAINTS.md file for every repository specifically for non-obvious AI pitfalls.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/CONSTRAINTS.md`

### TECH-02: Absence of structured 'Intent' metadata in deployments. (Round 3 Addition)

Affects: `all` — Agentic RCA


- [ ] Standardize a deploy.intent.json metadata file for all production environments.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/deployment-standards.md`

### ARCH-04: Absence of isolated 'Debug Sidecar' agent personas. (Round 3 Addition)

Affects: `receptor-infra` — Agent Personas


- [ ] Design a Read-Only Debug Sidecar pattern for Kubernetes diagnostic isolation.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

### GOV-02: Lack of continuous Agentic Readiness Scoring. (Round 4 Addition)

Affects: `all` — Agent Compliance


- [ ] Implement a CI-driven Readiness Score for every repository.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-governance.md`

### INFRA-02: Absence of high-level 'Agent Decision Logs' in Kubernetes. (Round 4 Addition)

Affects: `receptor-infra` — Agent Traceability


- [ ] Standardize an AgentDecision CRD to record autonomous infrastructure reasoning.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/agent-infrastructure.md`

### VAL-04: Lack of a standardized sandbox Test Harness for agentic tools. (Round 5 Addition)

Affects: `ecosystem` — Agent Testability


- [ ] Implement a 'lib/agent-test-harness' for autonomous tool verification and state-mocking.
      `/Users/ryan/development/common_bond/antigravity-environment/dev-environment/.agents/skills/agent-test-harness/SKILL.md`

### OBS-03: Absence of 'Semantic Heartbeats' to monitor agentic instruction drift. (Round 5 Addition)

Affects: `ecosystem` — Agent Alignment


- [ ] Implement a HealthCheck API for agentic personas to monitor logical alignment.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/docs/engineering/logging-standards.md`

## 🟢 Low

### DOC-02: Rudimentary .llm-context.md files lack the depth required for complex platform tasks.

Affects: `all` — Agent Context


- [ ] Expand .llm-context.md in critical service repos (Planner, Allocator).
      `/Users/ryan/development/common_bond/antigravity-environment/backend/receptor-planner/.llm-context.md`

### DOC-05: Lack of a dedicated Semantic Search API for agents into Docusaurus. (Round 3 Addition)

Affects: `ecosystem` — Agent Discovery


- [ ] Expose the Docusaurus internal index via a dedicated Agent Search endpoint.
      `/Users/ryan/development/common_bond/antigravity-environment/documentation/common-bond/README.md`


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | PROC-01, PROC-02, PROC-03, DOC-01, DOC-02 | Establishing AGENTS.md and formalizing the 'Golden Path' benchmarks is the prerequisite for all autonomous operations. |
| 2 | SEC-01, SEC-02, SEC-03, GOV-01, GOV-02, GOV-03 | Securing agent identities and defining human-in-the-loop gates ensures safe platform operations. |
| 3 | OBS-01, OBS-03, TECH-02, CROSS-01, INFRA-02 | Standardized logs and decision tracking enable root cause analysis of agentic failures. |
| 4 | ARCH-01, ARCH-02, ARCH-04, ARCH-05, DISC-01, DOC-05 | Contracts and centralized capability registries align specialized agents across repositories. |
| 5 | VAL-01, VAL-02, VAL-03, VAL-04, TECH-01, TECH-03, TECH-04, PROC-04, DOC-04 | Benchmarks, test harnesses, and rollback protocols provide the final layer of autonomous robustness. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| PROC-01 | Agent Context | `AGENTS.md` | Process Gap | 🔴 Critical |
| GOV-03 | Agent Safety | `agent-governance.md` | Governance | 🔴 Critical |
| PROC-02 | Agent Context | `copilot-instructions.md` | Process Gap | 🟠 High |
| ARCH-01 | GitOps Workflows | `agent-remediation.md` | Architecture | 🟠 High |
| SEC-01 | Agent Safety | `our-technology.md` | Security | 🟠 High |
| PROC-04 | Agentic Workflows | `ai-healer.yml` | Process Gap | 🟠 High |
| CROSS-01 | Diagnostic Standardization | `logging-standards.md` | Consensus | 🟠 High |
| ARCH-02 | Agent Contracts | `agent-infrastructure.md` | Architecture | 🟠 High |
| VAL-01 | Agent Validation | `agent-quality.md` | Compliance | 🟠 High |
| SEC-02 | Agent Safety | `agent-secret-rotation.yml` | Security | 🟠 High |
| GOV-01 | Agent Context | `agent-governance.md` | Governance | 🟠 High |
| VAL-02 | Security Validation | `agent-security.md` | Compliance | 🟠 High |
| SEC-03 | Agent Identity | `agent-infrastructure.md` | Security | 🟠 High |
| TECH-03 | Agent Safety | `agent-infrastructure.md` | Reliability | 🟠 High |
| VAL-03 | Agent Safety | `agent-security.md` | Security Validation | 🟠 High |
| ARCH-05 | Agent Safety | `agent-infrastructure.md` | Architecture | 🟠 High |
| TECH-04 | Agent Robustness | `agent-infrastructure.md` | Reliability | 🟠 High |
| DOC-01 | Agent Context | `README.md` | Documentation Gap | 🟡 Medium |
| PROC-03 | Agent Personas | `README.md` | Process Gap | 🟡 Medium |
| DOC-03 | Agent Context | `reference-implementations.md` | Documentation Gap | 🟡 Medium |
| TECH-01 | Agent Context | `README.md` | Tech Debt | 🟡 Medium |
| OBS-01 | Agent Traceability | `logging-standards.md` | Observability | 🟡 Medium |
| DISC-01 | Agent Discovery | `README.md` | Architecture | 🟡 Medium |
| DOC-04 | Agent Safety | `CONSTRAINTS.md` | Documentation Gap | 🟡 Medium |
| TECH-02 | Agentic RCA | `deployment-standards.md` | Instrumentation | 🟡 Medium |
| ARCH-04 | Agent Personas | `agent-infrastructure.md` | Architecture | 🟡 Medium |
| GOV-02 | Agent Compliance | `agent-governance.md` | Governance | 🟡 Medium |
| INFRA-02 | Agent Traceability | `agent-infrastructure.md` | Observability | 🟡 Medium |
| VAL-04 | Agent Testability | `SKILL.md` | Validation | 🟡 Medium |
| OBS-03 | Agent Alignment | `logging-standards.md` | Observability | 🟡 Medium |
| DOC-02 | Agent Context | `.llm-context.md` | Documentation Gap | 🟢 Low |
| DOC-05 | Agent Discovery | `README.md` | Architecture | 🟢 Low |

