# Benchmark Mapping & Gap Analysis

This document provides a systematic review of all 32 findings from the **260325-agentic-platform-engineering** audit against the 5 established global benchmarks.

## 1. CNCF Platform Engineering Maturity Model (v1.0)
*Focus: Evolution from "Provisional" to "Optimizing" platform consumers.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **PROC-01/02** | ✅ Strong Alignment | These "Agent Context" files are the literal requirement for Level 2 (Operational) maturity. |
| **DISC-01** | ⚠️ Partial Alignment | CNCF suggests a "Product Mindset". We need to treat our Agents as first-class "Product Users" with a dedicated portal/registry. |
| **DOC-01/02** | ✅ Strong Alignment | Moving to "Structured Context" is the key differentiator for Level 3 (Scalable) AI consumption. |

## 2. OpenTelemetry GenAI Semantic Conventions
*Focus: Standardized telemetry for LLM and Agent operations.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **OBS-01** | ⚠️ Needs Modification | Must adopt `gen_ai.system` and `gen_ai.usage` naming. |
| **TECH-02** | ✅ Strong Alignment | "Deployment Intent" maps to OTel's requirement for span metadata. |
| **INFRA-02** | ✅ Strong Alignment | AgentDecision CRDs are the Kubernetes-native equivalent of OTel "Reasoning Spans". |

## 3. NIST AI Risk Management Framework (AI RMF)
*Focus: Accountability, Transparency, and Human Oversight.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **GOV-03** | ✅ Strong Alignment | "Dual-Control" is a textbook requirement for NIST's "Manage" function. |
| **SEC-01** | ⚠️ Partial Alignment | Needs to explicitly address "Explainability" (Why did the agent make this decision?). |
| **VAL-03** | ✅ Strong Alignment | Red-teaming is mandated by the NIST AI Safety Institute (AISI). |

## 4. GitHub Agentic Workflows (2025)
*Focus: Intent-Driven Automation and Asynchronous Execution.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **ARCH-01** | ✅ Strong Alignment | Matches GitHub's "Agentic Remediation" pattern. |
| **PROC-04** | ✅ Strong Alignment | Direct alignment with GitHub's "Test Healing" initiatives. |
| **TECH-03** | ✅ Strong Alignment | "Dry-Run" is a core security gate in GitHub's Agentic Security Model. |

## 5. Model Context Protocol (MCP)
*Focus: Universal interoperability and context discovery.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **ARCH-02** | ⚠️ Needs Modification | "Agentic Contracts" should be refactored into **MCP Resource Servers**. |
| **DOC-05** | ✅ Strong Alignment | Semantic search is the primary "Discovery" tool for MCP-enabled agents. |

---

## 🚀 Summary of Required Modifications

1. **Refactor ARCH-02**: Shift from custom `contracts.md` to **MCP (Model Context Protocol)** for service discovery.
2. **Enhance SEC-01**: Add an **"Explanation Requirement"** to agent governance (Agents must justify actions in natural language).
3. **Normalize OBS-01**: Rename internal headers to match **OpenTelemetry GenAI** semantic conventions.
4. **Pivot VAL-01**: Adopt **"LLM-as-a-Judge"** (probabilistic) as the primary verification standard over unit tests.
