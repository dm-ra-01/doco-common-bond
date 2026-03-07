# ISO 27001 AI-Specific Gap Analysis

**Date:** 2026-03-07\
**Scope:** `docs/compliance/iso27001/` — risk management, policies, operations,
assurance — assessed against AI-specific control requirements. Primary sources:
OAIC guidance on AI and privacy (October 2024); ASD/ACSC "Engaging with
Artificial Intelligence" (January 2024). See Credible Sources section.\
**Auditor:** Ryan Ammendolea\
**Purpose:** Identify gaps in the existing ISMS documentation arising from the
use of AI tools (Google Antigravity via Google Workspace Business Standard) that
are not addressed by the `260305-iso27001-preaudit` findings. Cross- reference
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
| `policies/`        | ❌ None     | 3         |
| `risk-management/` | ❌ None     | 3         |
| `operations/`      | ⚠️ Partial  | 2         |
| `assurance/`       | ❌ None     | 1         |

6 🟠 High · 3 🟡 Medium · 0 🔴 Critical · 0 🟢 Low

---

## 1. Access Control — AI Tools Expand the Attack Surface

### Strengths

- `policies/access-control.md` documents least-privilege, named reviewers, and
  proactive key rotation (added in Session 1 of the prior audit).
- Supabase RLS, GitHub Teams, and Cloudflare Zero Trust are cited as enforcement
  mechanisms.

### Gaps

**AI-002** — `policies/access-control.md`: There is no mention of AI tools in
the access control policy. The ACSC's 2024 guidance explicitly calls out that
organisations must define who can use AI systems, what data types they can
interact with, and who holds privileged access to AI system configuration. This
is not an edge case — Common Bond engineers actively use Antigravity, which
processes source code and potentially config values. No policy governs which
data categories may be shared with AI tools, which staff roles may access AI
configuration, or what the approved tools list is (ASD/ACSC 2024, sections on
"Privileged access" and "Privacy and data protection obligations").

---

## 2. Data Handling — Prompt-Based Leakage Not Covered

### Strengths

- `policies/data-classification.md` (created in Session 2) defines a 4-tier
  scheme (Public → Restricted) with Workforce Admin PII and Worker PII
  classified as Confidential.

### Gaps

**AI-003** — `policies/data-classification.md` / `policies/acceptable-use.md`:
The data classification scheme does not address AI tool usage. The OAIC's
October 2024 guidance on commercially available AI explicitly states that
organisations should avoid entering personal information into AI tools and must
establish governance policies covering AI usage (OAIC, 2024, "Governance and
policies" and "Avoid entering sensitive information" sections). The AUP covers
device usage and password hygiene but has no clause restricting or governing AI
tool data input, and the data classification scheme provides no per-tier
guidance on AI input permissions.

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

**AI-005** — There is no change management policy for AI tool/model updates or
prompt-template changes. The article highlights that updating a model can alter
system behaviour materially: fine-tuning can introduce bias or safety failures;
prompt-template changes can degrade output quality; model deprecations can break
workflows without warning. For Common Bond specifically, behavioural agent
instructions live as `.md` files in `.agents/` (workflow files, skill files) and
directly govern Antigravity's actions on production engineering work. These
prompt templates are version-controlled in Git but are not referenced in any
change management or document control policy — no PR review requirement exists
for `.agents/` file changes. This is a concrete gap against Annex A control 8.32
(Change management) and the existing `policies/document-control.md` ISMS
PR-review framework.

---

## 5. Supplier Register — AI Vendors Not Listed

### Strengths

- `operations/supplier-register.md` (created in Session 2) covers the 5 critical
  suppliers: Supabase, Cloudflare, GitHub, Google Workspace, ClickUp. DPA status
  column included.

### Gaps

**AI-006** — `operations/supplier-register.md`: **Google Antigravity** (accessed
via Google Workspace Business Standard) is absent from the Supplier Security
Register. Antigravity processes source code, repository context, and engineering
instructions as agent context — making it a data processor under ISO 27001 Annex
A 5.19–5.22. The Google Workspace Business Standard subscription includes
Google's standard Data Processing Amendment (DPA), which partially covers this
exposure. However, (a) no supplier register entry exists for Antigravity, (b) it
is not documented what data classifications are permitted as AI input, and (c)
it is not confirmed whether Workspace Business Standard terms explicitly exclude
Antigravity context data from model training. GitHub Copilot is confirmed not in
use and does not require an entry.

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
has no AI-specific module. The ACSC's 2024 guidance lists staff training as the
first mitigation for organisations engaging with AI, noting that employees must
understand AI constraints, privacy and data obligations, and what to do when
something goes wrong (ASD/ACSC 2024, "Suitably qualified staff" and "What will
your organisation do if something goes wrong?" sections). ISO 27001 Annex A
control 6.3 requires training to address current threat vectors.

---

## 8. Approved AI Tools — No Approved List Defined

### Strengths

- `policies/acceptable-use.md` will be amended (REC-AI-02) to prohibit
  non-approved AI tools.

### Gaps

**AI-010** — `policies/acceptable-use.md`: The AUP explicitly prohibits
"non-approved" AI tools, but no approved tools list exists anywhere in the ISMS.
Without the list, the policy is unenforceable — staff cannot know what is
permitted. The OAIC (2024) requires organisations to establish "governance
policies and procedures" that include specifying which AI tools are approved for
use. Common Bond currently allows Google Antigravity (confirmed). Claude
(Anthropic) and Gemini (Google) are approved subject to safe-use conditions;
local/offline models require special ISM approval.

---

## 9. Data Subject Rights — No AI Data Deletion Procedure

### Strengths

- `operations/incident-response.md` covers NDB notifications.
- `policies/data-classification.md` classifies PII.

### Gaps

**AI-011** — No document addresses data subject rights (APP 12 — access; APP 13
— correction) for personal information that was also processed by an AI tool. If
Antigravity processed a document containing personal information, it is unclear:
(a) whether that information can be located and provided on an APP 12 request,
(b) whether it can be corrected or deleted on an APP 13 request, and (c) whether
Google's data retention policies allow deletion. The OAIC (2024) states that APP
6 applies to personal information input into AI systems — use or disclosure must
be limited to the primary collection purpose. This is a low-risk gap while no
PII flows through AI tools, but a documented procedure must exist before
production.

---

## 8. Regulatory Posture — OAIC AI Guidance Not Addressed

### Strengths

- The ISMS includes a Privacy Act 1988 / APP reference in `governance/scope.md`.
- `operations/incident-response.md` documents the NDB notification obligation
  under the Privacy Act.

### Gaps

**AI-009** — `risk-management/risk-register.md` / `governance/scope.md`: The
Office of the Australian Information Commissioner (OAIC) published guidance in
2024 confirming that organisations processing personal information using AI
tools are subject to the Australian Privacy Principles (APPs). Specifically, APP
3 (collection limitation — is AI use a form of collection?) and APP 11 (security
of personal information — does using an AI tool constitute an adequate security
measure?). Common Bond has no documented position on whether its current
Antigravity usage complies with these APP expectations. This is a regulatory
posture gap rather than an operational gap — the risk is low while no PII flows
through AI tools, but a documented position should exist before production. ISO
27001 Clause 4.2 (Understanding needs of interested parties) requires regulatory
obligations to be identified and addressed in the ISMS.

---

## Cross-Cutting Observations

| Observation                                                                                                                                                                                                                | Files Affected                                                                                |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **The ISMS was designed before AI tool use was normalised.** All existing policies treat data access via DB/API as the risk model. Prompt-based access is unaddressed.                                                     | `policies/access-control.md`, `policies/acceptable-use.md`, `policies/data-classification.md` |
| **The Supplier Register omits AI providers, which are now primary data processors.** This is an Annex A 5.19–5.22 gap.                                                                                                     | `operations/supplier-register.md`                                                             |
| **No AI risk entries in the Risk Register creates a compliance blind spot.** If an ISO 27001 auditor asks "what is your AI risk posture?", the current documentation cannot answer.                                        | `risk-management/risk-register.md`                                                            |
| **The `.agents/` directory governs production AI behaviour but sits outside any formal change control policy.** Prompt-template files are version-controlled but have no PR-review or ISM-approval requirement documented. | `policies/document-control.md`, `.agents/`                                                    |

---

## Annex A Control Mapping

| Finding ID | Controls (ISO 27001:2022 Annex A)                                              |
| :--------- | :----------------------------------------------------------------------------- |
| AI-002     | 5.15 Access control · 8.2 Privileged access rights                             |
| AI-003     | 5.12 Classification of information · 5.13 Labelling of information             |
| AI-004     | Clause 6.1.2 Information security risk assessment                              |
| AI-005     | 8.32 Change management                                                         |
| AI-006     | 5.19 Information security in supplier relationships · 5.20–5.22 Supplier chain |
| AI-007     | 8.15 Logging · 8.16 Monitoring activities                                      |
| AI-008     | 6.3 Information security awareness, education and training                     |
| AI-009     | Clause 4.2 Needs of interested parties (regulatory obligations)                |
| AI-010     | 5.1 Policies for information security · 5.15 Access control                    |
| AI-011     | Clause 4.2 Needs of interested parties · APP 6, 12, 13 (Privacy Act 1988)      |

---

## Severity Summary

| Finding ID | File                                                      | Category                                                           | Severity  |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| AI-002     | `policies/access-control.md`                              | Coverage Gap (no AI tool access control surface or approved list)  | 🟠 High   |
| AI-003     | `policies/acceptable-use.md`, `data-classification.md`    | Coverage Gap (no AI data input / prompt data-handling rules)       | 🟠 High   |
| AI-004     | `risk-management/risk-register.md`                        | Coverage Gap (no AI-specific risk entries)                         | 🟠 High   |
| AI-005     | `policies/document-control.md`, `.agents/`                | Coverage Gap (no AI model/tool/prompt-template change management)  | 🟡 Medium |
| AI-006     | `operations/supplier-register.md`                         | Coverage Gap (AI vendors absent from supplier register)            | 🟠 High   |
| AI-007     | `operations/incident-response.md`                         | Coverage Gap (no AI incident types or AI monitoring requirements)  | 🟡 Medium |
| AI-008     | `operations/training-competency.md`                       | Coverage Gap (no AI-specific security awareness content)           | 🟡 Medium |
| AI-009     | `risk-management/risk-register.md`, `governance/scope.md` | Regulatory Accuracy (OAIC AI/APP posture undocumented)             | 🟠 High   |
| AI-010     | `policies/acceptable-use.md`                              | Coverage Gap (no approved AI tools list defined)                   | 🟠 High   |
| AI-011     | `operations/` / `policies/`                               | Regulatory Accuracy (no APP 12/13 procedure for AI-processed data) | 🟠 High   |

> **Note:** Finding IDs begin at AI-002 to avoid collision with the prior
> audit's DOC-01 series. AI-001 is reserved for the source article reference.

> **AI-003 severity note:** Confirmed 🟠 High (not escalated to 🔴 Critical). No
> customers or live PII at this stage. This finding is a **production blocker**
> — it must be resolved before any customer data enters the system. Revisit
> severity at first customer onboarding.

---

## Credible Sources

The following sources were critically appraised for relevance and authority
before being used to inform audit findings and recommendations.

| #    | Source                                                                                                                                                                                          | Publisher                                                                                              | Date          | Relevance                                                                                                                                                                                                                                                                                                                                                                                                                           | Findings cited                                 |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| S-01 | [Guidance on privacy and the use of commercially available AI products](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/guidance-for-ai)             | Office of the Australian Information Commissioner (OAIC)                                               | October 2024  | ✅ **High** — Authoritative Australian government guidance; directly addresses APP 3, 5, 6, 10, 11 obligations for organisations using AI tools; explicitly covers commercially available AI products (not just developers). Applicable to Common Bond's Antigravity usage.                                                                                                                                                         | AI-003, AI-009, AI-010, AI-011                 |
| S-02 | [Engaging with Artificial Intelligence](https://www.cyber.gov.au/resources-business-and-government/governance-and-user-education/artificial-intelligence/engaging-with-artificial-intelligence) | Australian Signals Directorate (ASD) / Australian Cyber Security Centre (ACSC)                         | January 2024  | ✅ **High** — Authoritative Australian government cybersecurity guidance; co-authored with international partners (CISA, NCSC-UK, CCCS, NZ NCSC); directly addresses prompt injection, data poisoning, access control, supply chain risk, staff training, and privacy for AI systems used by organisations. Maps directly to ISO 27001 Annex A controls.                                                                            | AI-002, AI-003, AI-004, AI-006, AI-007, AI-008 |
| S-03 | [ISO/IEC 42001:2023 — Information technology — Artificial intelligence — Management system](https://www.iso.org/standard/81230.html)                                                            | International Organisation for Standardisation (ISO) / International Electrotechnical Commission (IEC) | December 2023 | ⚠️ **Medium** — International standard for AI Management Systems; uses same High-Level Structure as ISO 27001 enabling integration. Addresses AI-specific risk assessment (bias, adversarial manipulation, hallucination), impact assessment (Clause 6.1.4), and ethical AI controls. Deferred for implementation but referenced here as forward roadmap for next ISMS review cycle. Not used to support current findings directly. | Deferred                                       |

> **Excluded sources:** A Medium article ("SOC 2, ISO 27001, and the Rise of AI
> Risk", March 2026) was used as initial inspiration to scope this audit but was
> excluded from formal references as it does not meet the credibility standard
> required for ISO 27001 audit evidence. All findings in this audit are
> substantiated by sources S-01 and S-02 above.
