# Agentic Platform Engineering Readiness Audit

**Date:** 2026-03-25\
**Scope:** Ecosystem-wide (9 repositories)\
**Auditor:** Ryan Ammendolea\
**Standard:** Agentic Platform Engineering (APE) Reference Architectures (Microsoft/GitHub 2025)

---

## Executive Summary

The Receptor ecosystem possesses a mature **internal** agent infrastructure but is "Provisional" in terms of **External Benchmark Parity** (CNCF Level 1). The lack of industry-standard context files (`AGENTS.md`) and interoperable protocol support (MCP) restricts external AI tools from navigating the platform with the same efficiency as internal agents.

**Total Findings:** 32 (2 Critical, 17 High, 11 Medium, 2 Low)

| Repository / Area | Coverage | Issues Found | Overall |
| ----------------- | -------- | ------------ | ------- |
| All Repositories  | ❌       | 32           | 🔴 Poor  |
| Documentation     | ⚠️       | 4            | 🟡 Fair  |

---

## 🌟 Gold Standards

This audit evaluates the ecosystem against the **2025 APE Golden Path**. The following specialized benchmarks are used to define "excellence":

### Industry Benchmarks (External)
- **[Golden Path Architecture](https://learn.microsoft.com/en-us/azure/architecture/guide/agentic-platform/agentic-platform-engineering)**: Microsoft's Production-ready blueprint for agentic AI.
- **MCP (Model Context Protocol)**: Universal interoperability for AI tools and context discovery.
- **Agent Identity (Entra ID Pattern)**: Unique, traceable identities for every autonomous persona.

### Internal Reference Implementations
For detailed internal baselines and benchmark mapping, see **[GOLD_STANDARDS.md](./GOLD_STANDARDS.md)** and **[BENCHMARK_MAPPING.md](./BENCHMARK_MAPPING.md)**.
- **Contracts**: `receptor-infra/.agents/infrastructure-contracts.md`
- **Observation Loops**: `receptor-infra/.github/workflows/helm-upgrade-check.yml`
- **Machine Discovery**: `planner-backend/openapi.json`

---

## 1. Context and Metadata Gaps

### 1.1 Standard "Agent Files"

**Strengths:**
- High-quality internal documentation exists in `documentation/common-bond`.
- Consistent folder structure across 9 repos.
- **Reference Implementation**: `receptor-infra/.agents/infrastructure-contracts.md` provides a structured mapping of Vault identities to workflows.

**Gaps:**
- **PROC-01** (All Repos): No `AGENTS.md` files present to guide AI tools on build, test, and style conventions.
- **PROC-02** (All Repos): No `.github/copilot-instructions.md` to enforce repository-wide guardrails for Copilot.
- **PROC-03** (All Repos): Absence of `.github/agents/` for specialized personas (e.g. Cluster Doctor, SQL Auditor).

### 1.2 Knowledge Graph & Interoperability

**Strengths:**
- `.agents/` symlinks provide Antigravity with excellent local context.
- **Standards Alignment**: Use of OpenAPI 3.0 provides a machine-readable foundation for tool discovery.

**Gaps:**
- **DOC-01** (All Repos): Documentation lacks the semantic metadata required for Level 3 (Scalable) RAG injection.
- **ARCH-02** (Shared Services): Absence of **MCP (Model Context Protocol)** resource servers. Shared compute/data services lack the "universal connector" required for cross-platform agentic interop.

---

## 2. Infrastructure Gaps

### 2.1 Intent-Driven Operations

**Strengths:**
- Robust CI/CD pipelines with high-quality metadata.
- **Standards Alignment**: `receptor-infra` proactive observation loops mirror the "Continuous AI" pattern.

**Gaps:**
- **ARCH-01** (Ecosystem): Lack of **Intent-Driven GitOps** (GitHub 2025). No standard for autonomous diagnostic → PR loops.
- **ARCH-05** (Ecosystem): Risk of non-deterministic resource exhaustion without "Budgeting Gates".
- **PROC-04** (All): No 'Agentic CI/CD Gates' like **Probabilistic Test Healing**.

---

## 3. Governance and Safety Gaps

### 3.1 Agent Safety

**Gaps:**
- **GOV-03** (All): Lack of 'Dual-Control' requirement for destructive autonomous operations.
- **SEC-01** (All): Lack of 'Permissions & Safety' governance for autonomous agents. No clear policy on write-scoped credentials for AI tools.

### 3.2 Standardization

**Gaps:**
- **DOC-03** (All): Absence of 'Reference Implementation' pointers in documentation for agentic imitation.
- **TECH-01** (All): Outdated/Missing openapi.json or schema.sql exports in non-local shared locations.
- **CROSS-01** (All): Inconsistent error message formatting across repos, hindering agentic RCA.

---

## Severity Summary

| Finding ID | Repository / Area | File | Category | Severity    |
| ---------- | ----------------- | ---- | -------- | ----------- |
| PROC-01    | All               | —    | Process  | 🔴 Critical |
| GOV-03     | All               | —    | Governance | 🔴 Critical |
| PROC-02    | All               | —    | Process  | 🟠 High     |
| ARCH-01    | Ecosystem         | —    | Architecture  | 🟠 High     |
| ARCH-02    | Shared Services   | —    | Architecture  | 🟠 High     |
| ARCH-05    | Ecosystem         | —    | Architecture  | 🟠 High     |
| SEC-01     | All               | —    | Security      | 🟠 High     |
| SEC-02     | Ecosystem         | —    | Security      | 🟠 High     |
| SEC-03     | Ecosystem         | —    | Security      | 🟠 High     |
| GOV-01     | All               | —    | Governance    | 🟠 High     |
| VAL-01     | Ecosystem         | —    | Compliance    | 🟠 High     |
| VAL-02     | Supabase          | —    | Compliance    | 🟠 High     |
| VAL-03     | Ecosystem         | —    | Compliance    | 🟠 High     |
| TECH-03    | All               | —    | Reliability   | 🟠 High     |
| TECH-04    | All               | —    | Reliability   | 🟠 High     |
| PROC-04    | All               | —    | Process       | 🟠 High     |
| CROSS-01   | All               | —    | Consensus     | 🟠 High     |
| PROC-03    | All               | —    | Process       | 🟡 Medium   |
| DOC-01     | All               | —    | Documentation | 🟡 Medium   |
| DOC-03     | All               | —    | Documentation | 🟡 Medium   |
| TECH-01    | All               | —    | Tech Debt     | 🟡 Medium   |
| TECH-02    | All               | —    | Instrumentation | 🟡 Medium   |
| OBS-01     | All               | —    | Observability | 🟡 Medium   |
| OBS-03     | Ecosystem         | —    | Observability | 🟡 Medium   |
| INFRA-02   | Infrastructure    | —    | Observability | 🟡 Medium   |
| DISC-01    | Ecosystem         | —    | Architecture  | 🟡 Medium   |
| ARCH-04    | Infrastructure    | —    | Architecture  | 🟡 Medium   |
| VAL-04     | Ecosystem         | —    | Validation    | 🟡 Medium   |
| DOC-04     | All               | —    | Documentation | 🟡 Medium   |
| GOV-02     | All               | —    | Governance    | 🟡 Medium   |
| DOC-02     | All               | —    | Documentation | 🟢 Low      |
| DOC-05     | Ecosystem         | —    | Architecture  | 🟢 Low      |
