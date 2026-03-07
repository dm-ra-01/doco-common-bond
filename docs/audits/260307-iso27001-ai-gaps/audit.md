# ISO 27001 AI-Specific Gap Analysis

**Date:** 2026-03-07\
**Scope:** `docs/compliance/iso27001/` — risk management, policies, operations,
assurance — assessed against AI-specific control requirements identified in "SOC
2, ISO 27001, and the Rise of AI Risk" (Medium, March 2026)\
**Auditor:** Ryan Ammendolea\
**Purpose:** Identify gaps in the existing ISMS documentation arising from the
use of AI tools (Antigravity, GitHub Copilot, and any future AI services) that
are not addressed by the `260305-iso27001-preaudit` findings. Cross-reference
with, and extend, that audit — do not duplicate already-raised findings.

---

## Executive Summary

The prior `260305-iso27001-preaudit` produced a substantively-complete ISMS
skeleton for a cloud-native SaaS startup. That audit's scope was the
**traditional ISO 27001 control surface**. The Medium article reviewed here
identifies a second, orthogonal risk surface introduced when organisations use
AI tools operationally: expanded access control responsibilities, new data-
leakage vectors via prompts, AI vendor opacity, changed monitoring requirements,
expanded risk register scope, and AI-specific attack classes. Against that
framework, the existing ISMS documentation has **7 new gaps** — none duplicating
prior findings.

| Section            | AI Coverage | Gap Count |
| ------------------ | ----------- | --------- |
| `policies/`        | ❌ None     | 2         |
| `risk-management/` | ❌ None     | 2         |
| `operations/`      | ⚠️ Partial  | 2         |
| `assurance/`       | ❌ None     | 1         |

4 🟠 High · 3 🟡 Medium · 0 🔴 Critical · 0 🟢 Low

---

## 1. Access Control — AI Tools Expand the Attack Surface

### Strengths

- `policies/access-control.md` documents least-privilege, named reviewers, and
  proactive key rotation (added in Session 1 of the prior audit).
- Supabase RLS, GitHub Teams, and Cloudflare Zero Trust are cited as enforcement
  mechanisms.

### Gaps

**AI-002** — `policies/access-control.md`: There is no mention of AI tools in
the access control policy. The article correctly notes that using AI tools (chat
prompts, code completion) creates a new access control surface: employees can
expose sensitive data through prompt inputs rather than direct DB access, and AI
vendor APIs may hold model configurations that are equivalent to privileged
system access. This is not an edge case — Common Bond engineers actively use
Antigravity, which processes source code and potentially config values. No
policy governs which data categories may be shared with AI tools or which staff
roles may access AI system configuration.

---

## 2. Data Handling — Prompt-Based Leakage Not Covered

### Strengths

- `policies/data-classification.md` (created in Session 2) defines a 4-tier
  scheme (Public → Restricted) with Workforce Admin PII and Worker PII
  classified as Confidential.

### Gaps

**AI-003** — `policies/data-classification.md` / `policies/acceptable-use.md`:
The data classification scheme does not address AI tool usage. Employees could
paste Confidential or Restricted data into AI assistants (e.g., customer PII
into a Copilot prompt, financial records into ChatGPT). The Acceptable Use
Policy (`acceptable-use.md`) covers device usage and password hygiene but has no
clause restricting or governing AI tool data input. Vendor data retention
policies for AI services are not referenced in the Supplier Register.

---

## 3. Risk Register — AI-Specific Risks Absent

### Strengths

- Session 1 of the prior audit expanded the Risk Register from 5 to 10 entries
  (R-001–R-010), adding supplier failure, regulatory breach, incident response
  gap, and BCP failure.

### Gaps

**AI-004** — `risk-management/risk-register.md`: Despite 10 risks now
documented, there are no AI-specific entries. The article identifies 4 risk
categories directly relevant to an AI-enabled SaaS: (a) hallucination /
incorrect AI output causing operational or regulatory harm, (b) adversarial
prompt injection targeting AI-assisted workflows, (c) AI vendor data-retention
or training data leakage, (d) AI-assisted social engineering of staff. For a
company using AI in engineering workflows, these risks are current, not
theoretical. ISO 27001 Clause 6.1.2 requires risk assessment to cover all
identified information risks.

---

## 4. Change Management — No AI Model Versioning Policy

### Strengths

- `policies/document-control.md` covers ISMS document version control via Git/PR
  workflow.

### Gaps

**AI-005** — There is no change management policy for AI tool/model updates. The
article highlights that updating a model can alter system behaviour materially:
fine-tuning can introduce bias or safety failures; prompt-template changes can
degrade output quality; model deprecations can break workflows without warning.
For a team using Antigravity as an agent in production engineering workflows,
model version changes are equivalent to a software deployment and carry
equivalent change risk. No existing document addresses this. Relevant Annex A
controls: 8.32 (Change management).

---

## 5. Supplier Register — AI Vendors Not Listed

### Strengths

- `operations/supplier-register.md` (created in Session 2) covers the 5 critical
  suppliers: Supabase, Cloudflare, GitHub, Google Workspace, ClickUp. DPA status
  column included.

### Gaps

**AI-006** — `operations/supplier-register.md`: AI vendors (Anthropic /
Antigravity, GitHub Copilot / Microsoft, OpenAI if used) are absent from the
Supplier Security Register. The article notes that AI vendors introduce opacity
beyond traditional SaaS: training data practices, model update cadence, data
retention, and safety testing methods may not be discoverable without proactive
assessment. ISO 27001 Annex A controls 5.19–5.22 (supplier relationships)
explicitly require all third parties accessing information assets to be
assessed. AI APIs that receive code context, configuration data, or user data
are in scope.

---

## 6. Monitoring — No AI-Specific Monitoring or Incident Criteria

### Strengths

- `assurance/nonconformity-log.md` has two genuine NC records.
- `operations/incident-response.md` documents a 5-phase response process with
  Privacy Act NDB obligations.

### Gaps

**AI-007** — `operations/incident-response.md` / `assurance/internal-audit.md`:
The Incident Response Plan does not define AI-specific incident types:
hallucination-driven errors affecting customers, prompt injection attacks,
AI-assisted social engineering, or model output bias events. The internal audit
schedule does not include an AI tool review scope. The article notes that
auditors increasingly expect evidence of AI-specific monitoring, including
prompt/output logging, escalation pathways for unsafe outputs, and bias reviews.
ISO 27001 Annex A control 8.15 (Logging) and 8.16 (Monitoring activities) apply.

---

## 7. Employee Awareness — No AI-Specific Security Training

### Strengths

- `operations/training-competency.md` covers general security awareness, MFA,
  and phishing awareness.

### Gaps

**AI-008** — `operations/training-competency.md`: Security awareness training
has no AI-specific module. The article is explicit: untrained employees are the
primary vector for AI-enabled data leakage (pasting PII into public tools,
falling for AI-generated phishing, misusing AI outputs without verification).
ISO 27001 Annex A control 6.3 (Information security awareness) requires training
to address current threat vectors. AI tool misuse is now a current and
documented threat vector.

---

## Cross-Cutting Observations

| Observation                                                                                                                                                                         | Files Affected                                                                                |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **The ISMS was designed before AI tool use was normalised.** All existing policies treat data access via DB/API as the risk model. Prompt-based access is unaddressed.              | `policies/access-control.md`, `policies/acceptable-use.md`, `policies/data-classification.md` |
| **The Supplier Register omits AI providers, which are now primary data processors.** This is an Annex A 5.19–5.22 gap.                                                              | `operations/supplier-register.md`                                                             |
| **No AI risk entries in the Risk Register creates a compliance blind spot.** If an ISO 27001 auditor asks "what is your AI risk posture?", the current documentation cannot answer. | `risk-management/risk-register.md`                                                            |

---

## Severity Summary

| Finding ID | File                                                   | Category                                                          | Severity  |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------- | --------- |
| AI-002     | `policies/access-control.md`                           | Coverage Gap (no AI tool access control surface definition)       | 🟠 High   |
| AI-003     | `policies/acceptable-use.md`, `data-classification.md` | Coverage Gap (no AI data input / prompt data-handling rules)      | 🟠 High   |
| AI-004     | `risk-management/risk-register.md`                     | Coverage Gap (no AI-specific risk entries)                        | 🟠 High   |
| AI-005     | `policies/document-control.md`                         | Coverage Gap (no AI model / tool change management)               | 🟡 Medium |
| AI-006     | `operations/supplier-register.md`                      | Coverage Gap (AI vendors absent from supplier register)           | 🟠 High   |
| AI-007     | `operations/incident-response.md`                      | Coverage Gap (no AI incident types or AI monitoring requirements) | 🟡 Medium |
| AI-008     | `operations/training-competency.md`                    | Coverage Gap (no AI-specific security awareness content)          | 🟡 Medium |

> **Note:** Finding IDs begin at AI-002 to avoid collision with the prior
> audit's DOC-01 series. AI-001 is reserved for the source article reference.
