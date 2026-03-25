# Benchmark Mapping & Gap Analysis

This document provides a systematic review of all 32 findings from the **260325-agentic-platform-engineering** audit against the 5 established global benchmarks.

## 1. CNCF Platform Engineering Maturity Model (v1.0)
*Focus: Evolution from "Provisional" to "Optimizing" platform consumers.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **PROC-01/02** | ✅ Strong Alignment | These "Agent Context" files are the literal requirement for Level 2 (Operational) maturity. |
| **DISC-01** | ✅ Strong Alignment | Aligning with the "Product Mindset" (CNCF Level 3) for AI consumers. |
| **DOC-01/02** | ✅ Strong Alignment | Moving to "Structured Context" is the key differentiator for Level 3 (Scalable) AI consumption. |

## 2. OpenTelemetry GenAI Semantic Conventions
*Focus: Standardized telemetry for LLM and Agent operations.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **OBS-01** | ✅ Strong Alignment | Normalizing to OpenTelemetry GenAI Semantic Conventions (`gen_ai.system`, `gen_ai.usage`). |
| **TECH-02** | ✅ Strong Alignment | "Deployment Intent" maps to OTel's requirement for span metadata. |
| **INFRA-02** | ✅ Strong Alignment | AgentDecision CRDs are the Kubernetes-native equivalent of OTel "Reasoning Spans". |

## 3. NIST AI Risk Management Framework (AI RMF)
*Focus: Accountability, Transparency, and Human Oversight.*

| Finding ID | Alignment Status | Gap / Refinement Needed |
| :--- | :--- | :--- |
| **GOV-03** | ✅ Strong Alignment | "Dual-Control" is a textbook requirement for NIST's "Manage" function. |
| **SEC-01** | ✅ Strong Alignment | Implementing NIST AI RMF requirement for "Intent Justification" (Explainability). |
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
| **ARCH-02** | ✅ Strong Alignment | Refactored into **MCP (Model Context Protocol)** Resource Servers for universal interoperability. |
| **DOC-05** | ✅ Strong Alignment | Semantic search is the primary "Discovery" tool for MCP-enabled agents. |

---

## ✅ Modifications Implemented
All gaps identified in the initial benchmark survey have been resolved in the finding definitions:
1. **MCP ADOPTION**: `ARCH-02` now mandates the universal connector standard.
2. **NIST SAFETY**: `SEC-01` now includes mandatory intent justification.
3. **OTel SEMANTICS**: `OBS-01` now uses normalized telemetry naming.
4. **PROBABILISTIC VAL**: `VAL-01` now uses LLM-as-a-Judge.
