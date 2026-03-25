# Agentic Platform Engineering Readiness Audit

**Date:** 2026-03-25\
**Scope:** Ecosystem-wide (9 repositories)\
**Auditor:** Ryan Ammendolea\
**Standard:** Agentic Platform Engineering (APE) Reference Architectures (Microsoft/GitHub 2025)

---

## Executive Summary

The Receptor ecosystem possesses a mature **internal** agent infrastructure (`.agents/` symlink system), but is almost entirely lacking in **external** agentic readiness. There is a complete absence of industry-standard context files (`AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`) and agent personas. This restricts the ability of developers to use common tools like GitHub Copilot and Cursor effectively across the platform.

**Total Findings:** 31 (2 Critical, 17 High, 10 Medium, 2 Low)

| Repository / Area | Coverage | Issues Found | Overall |
| ----------------- | -------- | ------------ | ------- |
| All Repositories  | ❌       | 31           | 🔴 Poor  |
| .agents/ Shared   | ✅       | 0            | 🟢 Good  |
| Documentation     | ⚠️       | 4            | 🟡 Fair  |

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

### 1.2 Knowledge Graph Consumability

**Strengths:**
- `.agents/` symlinks provide Antigravity with excellent context.

**Gaps:**
- **DOC-01** (All Repos): Technical documentation is written for human stakeholders; it is not structured for RAG or LLM context Injection (lacks semantic metadata).
- **DOC-02** (2/9 Repos): `.llm-context.md` exists but is rudimentary and lacks the depth required for complex platform engineering tasks.

---

## 2. Infrastructure Gaps

### 2.1 Agentic Workflows

**Strengths:**
- CI/CD pipelines are robust and well-documented.
- **Reference Implementation**: `receptor-planner/openapi.json` is a machine-readable schema that provides high-quality metadata for agent callers.
- **Reference Implementation**: `receptor-infra/.github/workflows/helm-upgrade-check.yml` demonstrates a proactive observation loop that surfaces issues for human/agent review.

**Gaps:**
- **ARCH-01** (Ecosystem): No standard for agent-initiated GitOps PRs. While "Cluster Doctor" logic is documented by Microsoft, we have no equivalent automated diagnostic → PR loop.
- **ARCH-05** (Ecosystem): Risk of runaway agentic processes and resource exhaustion.
- **ARCH-02** (Shared Services): Lack of standardized "Agentic Contracts" (like `infrastructure-contracts.md`) for Supabase and Allocator services to guide cross-repo consumption.
- **PROC-04** (All): No standard for 'Agentic CI/CD Gates' like AI-driven test healing.

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
