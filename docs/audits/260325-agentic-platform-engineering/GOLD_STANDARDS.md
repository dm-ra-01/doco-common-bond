# APE Gold Standards & Reference Architectures

This document defines the "Gold Standards" used as benchmarks for the **260325-agentic-platform-engineering** audit, drawing from Microsoft and GitHub's 2025 "Golden Path" for Agentic Platform Engineering.

## 1. Industry Benchmarks (External)

### 1.1 The "Golden Path" for APE (Microsoft)
- **Concept**: A production-ready blueprint where AI agents observe, reason, and act with built-in guardrails.
- **Reference**: [Microsoft Agentic Platform Engineering Guide](https://learn.microsoft.com/en-us/azure/architecture/guide/agentic-platform/agentic-platform-engineering)

### 1.2 Model Context Protocol (MCP)
- **Role**: The "universal connector" for AI agents to access tools and context across disparate platforms (GitHub, Azure, Local).
- **Standard**: Adoption of MCP for all specialized agent tools to ensure interoperability.

### 1.3 Agent Identity & Governance (Entra Agent ID)
- **Role**: Every autonomous process must have a unique, traceable identity.
- **Standard**: Mapping agent personas to GitHub Bot accounts or specialized Vault roles with narrowly scoped OIDC permissions.

---

## 2. Internal Reference Implementations (Ecosystem)

The following files in the Receptor ecosystem are designated as "Gold Standard" implementations for agents to follow:

### 2.1 Infrastructure Contracts
- **File**: `receptor-infra/.agents/infrastructure-contracts.md`
- **Why**: Demonstrates a high-quality mapping of human-readable intent to machine-readable Vault paths and tool schemas.

### 2.2 API Metadata
- **File**: `receptor-planner/openapi.json`
- **Why**: Provides the definitive machine-readable contract for agentic service consumption.

### 2.3 Proactive Observation Loops
- **File**: `receptor-infra/.github/workflows/helm-upgrade-check.yml`
- **Why**: Exemplifies the "Observe -> Surface -> Remediation" loop by detecting drift and surfacing it via structured GitHub issues.

### 2.4 Semantic Context
- **File**: `Documentation/common-bond/docs/audits/audit-registry.md`
- **Why**: A perfect example of a machine-readable governance registry that agents can both read and update.
