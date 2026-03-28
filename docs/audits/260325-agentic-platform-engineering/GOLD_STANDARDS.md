# APE Gold Standards & Reference Architectures

This document defines the "Gold Standards" used as benchmarks for the **260325-agentic-platform-engineering** audit, drawing from Microsoft and GitHub's 2025 "Golden Path" for Agentic Platform Engineering.

## 1. Industry Benchmarks (External)

### 1.1 CNCF Platform Engineering Maturity Model (v1.0)
- **Role**: Defines "AI Agentic Readiness" as a core track for platform maturity.
- **Alignment**: Validates our investment in **Structured Context (AGENTS.md)** and **Discoverable Registries** to move from "Provisional" to "Scalable" maturity for AI consumers.

### 1.2 OpenTelemetry GenAI Semantic Conventions
- **Role**: Standardized vocabulary for LLM and Agent tracing (tokens, tool calls, model info).
- **Alignment**: Supports **OBS-01** (Traceability) and **INFRA-02** (Decision Logs). Our `X-Agent-ID` maps to `gen_ai.system` attributes.

### 1.3 NIST AI Risk Management Framework (AI RMF) / AISI
- **Role**: Global benchmark for trustworthy AI, emphasizing Accountability and Transparency.
- **Alignment**: Supports **GOV-03** (Dual-Control) and **SEC-01** (Safety). NIST's **AISI** initiative specifically targets agent decision-making robustness.

### 1.4 GitHub Agentic Workflows (2025 Architecture)
- **Role**: Reference architecture for "Continuous AI" using Intent-Driven Automation.
- **Alignment**: Validates our **.agents/workflows** hub and the use of natural-language intent files to drive CI/CD actions.

### 1.5 Model Context Protocol (MCP)
- **Role**: The "universal connector" for AI context and tool discovery.
- **Alignment**: Supports **DOC-05** and **ARCH-02**. Cited by Microsoft as the standard for cross-platform agentic interop.

---

## ⚖️ Refutations & Refinements

Based on these external standards, our implementation should be refined in two areas:

1. **Deterministic vs. Probabilistic (Refines VAL-01)**: Industry standards (GitHub/Optimum) suggest moving beyond binary unit tests to "LLM-as-a-Judge" evaluations for agentic outputs.
2. **Privacy-Preserving Logs (Refines OBS-01)**: OpenTelemetry GenAI conventions warn against logging raw prompts/completions by default. Our logging standard must include PII/Secret masking for agentic telemetry.

---

## 2. Internal Reference Implementations (Ecosystem)

The following files in the Receptor ecosystem are designated as "Gold Standard" implementations for agents to follow:

### 2.1 Infrastructure Contracts
- **File**: `receptor-infra/.agents/infrastructure-contracts.md`
- **Why**: Demonstrates a high-quality mapping of human-readable intent to machine-readable Vault paths and tool schemas.

### 2.2 API Metadata
<<<<<<< HEAD
- **File**: `planner-backend/openapi.json`
=======
- **File**: `receptor-planner/openapi.json`
>>>>>>> origin/main
- **Why**: Provides the definitive machine-readable contract for agentic service consumption.

### 2.3 Proactive Observation Loops
- **File**: `receptor-infra/.github/workflows/helm-upgrade-check.yml`
- **Why**: Exemplifies the "Observe -> Surface -> Remediation" loop by detecting drift and surfacing it via structured GitHub issues.

### 2.4 Semantic Context
- **File**: `Documentation/common-bond/docs/audits/audit-registry.md`
- **Why**: A perfect example of a machine-readable governance registry that agents can both read and update.
