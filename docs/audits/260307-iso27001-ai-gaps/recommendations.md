<!-- audit-slug: 260307-iso27001-ai-gaps -->

# ISO 27001 AI-Specific Gap Recommendations

**Date:** 2026-03-07\
**Scope:** `docs/compliance/iso27001/` — assessed against AI tool usage\
**Branch:** `audit/260307-iso27001-ai-gaps`\
**Source:** [Audit Report](./audit.md) · primary references: OAIC guidance on
privacy and commercially available AI (October 2024); ASD/ACSC "Engaging with
Artificial Intelligence" (January 2024). See audit.md Credible Sources section.

---

## Agent Clarifications (Human-Approved)

| Item                           | Decision                                                                                                                                                                                                                                                                                                                                 |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI tools in scope              | **Google Antigravity** (via Google Workspace Business Standard) is the confirmed AI tool in use                                                                                                                                                                                                                                          |
| GitHub Copilot                 | **Not in use** — no GitHub Copilot licence; no supplier register entry required                                                                                                                                                                                                                                                          |
| Google Workspace plan          | Business Standard — Google Cloud DPA confirmed at [cloud.google.com/terms/data-processing-addendum](https://cloud.google.com/terms/data-processing-addendum) (updated April 2024)                                                                                                                                                        |
| Antigravity training exclusion | ✅ **Confirmed**: When Antigravity is accessed via Google Workspace or GCP, Google states it will **not** collect prompts, content, or model responses. ⚠️ **Caveat**: Antigravity is a no-cost public preview — paid-account exclusions may not fully apply until GA. **Action**: Disable Telemetry (Account → Enable Telemetry = OFF). |
| AI-003 severity                | Confirmed 🟠 High (not 🔴 Critical) — no live PII/customers yet; **production blocker** before first customer onboarding                                                                                                                                                                                                                 |
| OAIC posture (REC-AI-08)       | ✅ **Approved by Founder** (2026-03-07) — R-015 and `governance/scope.md` note authorised for implementation                                                                                                                                                                                                                             |
| Scope boundary                 | This audit extends `260305-iso27001-preaudit` — do not re-implement DOC-series recommendations                                                                                                                                                                                                                                           |
| Finding ID series              | AI-002 through AI-011 (AI-001 reserved for source article reference)                                                                                                                                                                                                                                                                     |
| Severity authority             | Human (Ryan Ammendolea) approves any escalation to 🔴 Critical                                                                                                                                                                                                                                                                           |

---

## Priority Framework

- 🟠 High — Significant gaps that an ISO 27001 auditor will flag; directly
  exploitable
- 🟡 Medium — Gaps that reduce ISMS credibility or create evidence weaknesses

---

## 🟠 High

### REC-AI-01: Add AI tool access control section to Access Control Policy (AI-002)

**Finding:** `policies/access-control.md` — no AI tool access control rules
exist.

An AI assistant (e.g., Antigravity) that processes source code, configuration
files, or design documents is a new access control surface. ISO 27001 Annex A
5.15 (Access control) and 8.2 (Privileged access rights) apply.

- [ ] Add a new section to `docs/compliance/iso27001/policies/access-control.md`
      titled **"2.7 AI Tool Access Control"** with the following content:
  - Define which staff roles may use AI tools with company data (e.g., engineers
    may use Antigravity for code; no staff may input Confidential or Restricted
    data into any AI tool without explicit written approval).
  - Define "privileged AI access" — those who can configure AI system prompts,
    tool integrations, or model parameters.
  - Require that AI tool API keys are treated as privileged credentials subject
    to the same rotation and access-review controls as other service keys.

---

### REC-AI-02: Add AI data input rules to Acceptable Use Policy and Data Classification Scheme (AI-003)

**Finding:** `policies/acceptable-use.md`, `policies/data-classification.md` —
no rules govern prompt-based data input to AI tools.

Employees pasting Confidential data (Worker PII, Workforce Admin PII) into AI
assistants creates an uncontrolled data export pathway. ISO 27001 Annex A 5.12
(Classification of information) and 5.13 (Labelling) apply.

- [ ] Add a section **"5. AI Tool Usage"** to
      `docs/compliance/iso27001/policies/acceptable-use.md`:
  - **Permitted:** Inputting Public and Internal-tier data into approved AI
    tools (Antigravity, Claude, Gemini subject to safe-use conditions).
  - **Prohibited:** Inputting Confidential or Restricted data (e.g., PII,
    credentials, financial records) into any AI tool without explicit ISM
    approval.
  - **Prohibited:** Using personal AI accounts (e.g., personal ChatGPT, personal
    Claude) for work data.
  - Required: Report any unintentional disclosure of Confidential data via AI
    prompt to `alert@commonbond.au` as a potential security incident.
  - **Local/offline models** (e.g., locally running LLMs): require written
    approval from the ISM before use with any company data.
- [ ] Add an **"AI Input Permitted?"** column to the data classification table
      in `docs/compliance/iso27001/policies/data-classification.md`:

  | Tier         | AI Input Permitted?                                                                                        |
  | :----------- | :--------------------------------------------------------------------------------------------------------- |
  | Public       | ✅ Yes — freely permitted with approved tools                                                              |
  | Internal     | ✅ Yes — permitted with approved tools; note: do not use personal AI accounts                              |
  | Confidential | ⚠️ No — prohibited unless explicit ISM written approval obtained; report accidental disclosure immediately |
  | Restricted   | ❌ No — prohibited under all circumstances; treat any accidental disclosure as a data breach               |

---

### REC-AI-03: Add AI-specific risk entries to the Risk Register (AI-004)

**Finding:** `risk-management/risk-register.md` — 10 risks documented, none
AI-specific. ISO 27001 Clause 6.1.2 requires all identified risks to be
assessed.

- [ ] Add the following 4 risk entries to
      `docs/compliance/iso27001/risk-management/risk-register.md`:

  | ID    | Description                                      | Threat                                                           | Impact                                       | Risk Level | Treatment                                        | Owner           | Status  |
  | :---- | :----------------------------------------------- | :--------------------------------------------------------------- | :------------------------------------------- | :--------- | :----------------------------------------------- | :-------------- | :------ |
  | R-011 | AI tool data leakage via prompt input            | Employee pastes PII/credentials into AI assistant                | Confidentiality breach; Privacy Act exposure | Medium     | Reduce — AUP section added; awareness training   | Ryan Ammendolea | Ongoing |
  | R-012 | Prompt injection attack on AI-assisted workflows | Adversarial input manipulates AI output to trigger unsafe action | Integrity failure; potential data exposure   | Medium     | Reduce — input validation; output review gate    | Ryan Ammendolea | Planned |
  | R-013 | AI vendor data retention / training data leakage | Vendor retains prompt data; uses it in model training            | Confidentiality breach; IP leakage           | Medium     | Reduce — DPA terms review; vendor register entry | Ryan Ammendolea | Planned |
  | R-014 | AI-assisted social engineering of staff          | Phishing or impersonation aided by AI-generated content          | Credential theft; initial access             | High       | Reduce — AI-specific awareness training module   | Ryan Ammendolea | Planned |

---

### REC-AI-04: Add AI vendors to the Supplier Security Register (AI-006)

**Finding:** `operations/supplier-register.md` — AI vendors absent despite
processing company code and potentially sensitive data. ISO 27001 Annex A
5.19–5.22 apply.

- [ ] Add the following entry to
      `docs/compliance/iso27001/operations/supplier-register.md`:

  **Google Antigravity (via Google Workspace Business Standard)**
  - Data processed: Source code, configuration context, engineering
    instructions, repository content passed as agent context
  - DPA: ✅ Google Cloud Data Processing Addendum confirmed at
    [cloud.google.com/terms/data-processing-addendum](https://cloud.google.com/terms/data-processing-addendum)
    (updated April 2024)
  - Training exclusion: ✅ When Antigravity is accessed via Google Workspace or
    GCP, Google explicitly states it will **not** collect prompts, content, or
    model responses
  - Caveat: ⚠️ Antigravity is currently a **no-cost public preview**. Paid-
    account training exclusions may not fully apply until it exits preview / GA.
    Re-confirm at next annual supplier review or when Antigravity pricing
    changes.
  - Action: ⚠️ Verify that **Telemetry is OFF** (Account → Enable Telemetry =
    OFF) to prevent interaction collection for model improvement. Log the
    setting, the date confirmed, and the name of person who confirmed it.
  - Trust page:
    [Google Cloud Privacy](https://cloud.google.com/terms/cloud-privacy-notice)
  - **Telemetry confirmation and entry completion due: 2026-04-30**

- [ ] Confirm **GitHub Copilot is not in use** and note that exclusion in the
      supplier register review log (no entry required since it is not an active
      supplier).

---

## 🟡 Medium

### REC-AI-05: Add AI tool and prompt-template change management clause (AI-005)

**Finding:** `policies/document-control.md` / `.agents/` directory — no change
management policy for AI model updates or prompt-template changes. ISO 27001
Annex A 8.32 (Change management) applies.

- [ ] Add a section **"4. AI Tool Change Management"** to
      `docs/compliance/iso27001/policies/document-control.md`:
  - Google Antigravity model version changes must be evaluated for behavioural
    impact before adoption in production engineering workflows.
  - **Prompt-template changes** in `.agents/` (workflow files, skill files) that
    govern Antigravity's actions on production work require a PR review by the
    ISM before merge, using the same approval process as ISMS document changes.
  - AI tool deprecations or service migrations must follow the standard change
    management process.
  - Changes that alter agent behaviour materially (e.g., changing a workflow
    step that affects compliance outputs) should be logged as a ISMS change
    event.

---

### REC-AI-06: Add AI incident types and monitoring requirements to the Incident Response Plan (AI-007)

**Finding:** `operations/incident-response.md` — AI-specific incident classes
not defined. ISO 27001 Annex A 8.15 (Logging) and 8.16 (Monitoring) apply.

- [ ] Add a subsection **"2.5 AI-Specific Incident Types"** to
      `docs/compliance/iso27001/operations/incident-response.md`:
  - **Type:** AI data disclosure — employee pastes Confidential data into AI
    tool. **Response:** Treat as potential data breach; notify ISM; determine
    vendor's data retention position.
  - **Type:** Prompt injection — adversarial input causes AI to execute
    unintended action. **Response:** Isolate workflow; log prompt/output;
    escalate to ISM.
  - **Type:** AI-generated phishing/social engineering targeting staff.
    **Response:** Treat as phishing incident; notify all staff; escalate to ISM.
- [ ] Note in `assurance/internal-audit.md` that AI tool usage should be
      included in the annual internal audit scope (IA-2026-01).

---

### REC-AI-07: Add AI security awareness module to Training & Competency (AI-008)

**Finding:** `operations/training-competency.md` — no AI-specific content. ISO
27001 Annex A 6.3 (Information security awareness, education and training)
applies.

- [ ] Add a row to the security awareness training matrix in
      `docs/compliance/iso27001/operations/training-competency.md`:
  - Module: **"AI Tool Security"**
  - Content: Approved tools list; data classification rules for AI inputs;
    recognition of AI-generated phishing; prompt injection awareness; incident
    reporting for AI-related events.
  - Frequency: Annual; required for all staff including Territory Managers.
- [ ] Note that this module satisfies awareness obligations under R-011, R-012,
      and R-014 (added in REC-AI-03).

---

---

### REC-AI-08: Document OAIC AI regulatory posture (AI-009)

**Finding:** `risk-management/risk-register.md` / `governance/scope.md` — no
documented position on OAIC AI guidance and APP 3 / APP 11 obligations. ISO
27001 Clause 4.2 (Interested parties) applies.

- [ ] Add R-015 to `docs/compliance/iso27001/risk-management/risk-register.md`:

  | ID    | Description                                                                                                                                | Threat                                                                        | Impact                             | Risk Level | Treatment                                                                 | Owner           | Status  |
  | :---- | :----------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :--------------------------------- | :--------- | :------------------------------------------------------------------------ | :-------------- | :------ |
  | R-015 | OAIC AI guidance non-compliance — using Antigravity to process personal information may implicate APP 3 (collection) and APP 11 (security) | Regulatory review or complaint triggered before documented APP posture exists | Regulatory risk; reputational harm | Low        | Reduce — document APP position before production; review OAIC AI guidance | Ryan Ammendolea | Planned |

- [ ] Add a note to `docs/compliance/iso27001/governance/scope.md` under
      "Regulatory Framework" acknowledging OAIC's 2024 AI guidance as a relevant
      interested-party document, and stating that Common Bond's documented
      position will be recorded prior to production launch.

---

### REC-AI-09: Raise NC-006 (Observation) in the Nonconformity Log (Suggestion 4)

**Rationale:** `operations/supplier-register.md` and
`policies/acceptable-use.md` both currently fail to cover an actively-used data
processor (Google Antigravity). Raising this as a formal Observation (not Major
NC) gives an external auditor evidence of proactive ISMS posture rather than a
gap found during review.

- [ ] Add NC-006 to `docs/compliance/iso27001/assurance/nonconformity-log.md`:
  - **ID:** NC-006
  - **Date:** 2026-03-07
  - **Source:** Internal audit — `260307-iso27001-ai-gaps`
  - **Category:** Observation
  - **Description:** Google Antigravity (active AI tool used by engineering) is
    not yet listed in the Supplier Security Register or referenced in the
    Acceptable Use Policy. This represents an undocumented data processor.
  - **Corrective Action:** Implement REC-AI-01 through REC-AI-04 from the
    `260307-iso27001-ai-gaps` recommendations.
  - **Status:** Open
  - **Target Close:** Linked to audit close-out of `260307-iso27001-ai-gaps`.

---

### REC-AI-10: Publish an Approved AI Tools List in the AUP (AI-010)

**Finding:** `policies/acceptable-use.md` — AI tools are prohibited unless
"approved" but no approved list exists anywhere. ISO 27001 Annex A 5.1 (Policies
for information security) requires policies to be actionable. OAIC (2024)
requires governance policies specifying which tools are approved for AI use.

- [ ] Add an **Approved AI Tools** table to
      `docs/compliance/iso27001/policies/acceptable-use.md` as an annex or
      inline in section 5 (AI Tool Usage):

  | Tool               | Provider                                 | Safe-Use Conditions                                                                                                                                 |  Local/Offline?   | Status                                  |
  | :----------------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------: | :-------------------------------------- |
  | Google Antigravity | Google (via Workspace Business Standard) | Input only Public/Internal data; no Confidential without ISM approval; DPA active via Workspace terms                                               | No — cloud-hosted | ✅ Approved                             |
  | Claude (any plan)  | Anthropic                                | Input only Public/Internal data; use organisation account, not personal; do not enable Claude to store conversation history for training if offered | No — cloud-hosted | ✅ Approved (safe-use conditions apply) |
  | Gemini (any plan)  | Google                                   | Input only Public/Internal data; use Google Workspace account, not personal; subject to Workspace terms                                             | No — cloud-hosted | ✅ Approved (safe-use conditions apply) |
  | Local/offline LLMs | Any                                      | Requires written ISM approval before use with company data; security review of model source required                                                |        Yes        | ⚠️ Requires ISM approval                |
  | Any other AI tool  | Any                                      | Not approved; must seek ISM approval before use                                                                                                     |         —         | ❌ Not approved                         |

  **"Safe use" is defined as:**
  - Only Public or Internal-tier data is input into the tool
  - An organisational account (not a personal account) is used
  - Conversation history / model training on inputs is disabled where the option
    exists
  - Outputs are reviewed by a human before being acted upon or shared
  - Any suspected misuse or accidental disclosure is reported immediately

---

### REC-AI-11: Add APP 12/13 Data Subject Request Procedure for AI-Processed Data (AI-011)

**Finding:** No document defines how to respond to a data subject access or
correction request (APP 12 / APP 13) where the personal information in question
was also processed by an AI tool. OAIC (2024) confirms APP 6 applies to personal
information input to AI: use must not extend beyond the primary collection
purpose.

- [ ] Add a subsection to
      `docs/compliance/iso27001/operations/incident-response.md` or a new
      lightweight procedure in `docs/compliance/iso27001/operations/` titled
      **"Data Subject Rights and AI-Processed Information"**:
  - When a data subject submits an APP 12 (access) request: check whether the
    requested personal information was also submitted to an AI tool. If yes,
    note in the response whether that information may be retained by the AI
    provider under their DPA terms and provide Google's privacy URL.
  - When a data subject submits an APP 13 (correction/deletion) request: confirm
    whether deletion from Google Workspace also removes the data from
    Antigravity context storage. Document the outcome.
  - If any uncertainty exists about the AI vendor's retention of the personal
    information, escalate to ISM and treat as potential data breach for NDB
    assessment.
- [ ] Flag this procedure as a production-launch gate: must be confirmed before
      any customer PII enters company systems.

---

## Deferred to Next Audit Cycle

| Item                                           | Reason Deferred                                                                                                                        |
| :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| Full AI model card / system card documentation | Requires clarification of which AI integrations are production-facing (vs. internal tooling); deferred until AI strategy is formalised |
| AI red-teaming / adversarial testing programme | Out of scope at pre-revenue stage; revisit when engineering team grows beyond founder                                                  |
| NIST AI RMF alignment                          | Separate framework; recommended for next ISO 27001 review cycle when AI usage matures                                                  |
| ISO/IEC 42001:2023 AI management system        | Future roadmap; consider as AI governance extension once engineering team scales                                                       |

---

## Implementation Order

| Priority | Finding ID  | Recommendation                                                                   | Effort |
| :------- | :---------- | :------------------------------------------------------------------------------- | :----- |
| 1        | AI-003      | REC-AI-02 — AUP AI usage + AI Input column in data classification                | Low    |
| 2        | AI-010      | REC-AI-10 — Approved AI tools list with safe-use definition                      | Low    |
| 3        | AI-002      | REC-AI-01 — Access control policy AI section                                     | Low    |
| 4        | AI-004      | REC-AI-03 — 4 new risk register entries (R-011–R-014)                            | Low    |
| 5        | AI-009      | REC-AI-08 — R-015 risk entry + OAIC note in scope.md                             | Low    |
| 6        | AI-006      | REC-AI-04 — Antigravity in supplier register + DPA confirm by 2026-04-30         | Low    |
| 7        | (assurance) | REC-AI-09 — Raise NC-006 observation in nonconformity log                        | Low    |
| 8        | AI-005      | REC-AI-05 — AI + prompt-template change management clause in document-control.md | Low    |
| 9        | AI-007      | REC-AI-06 — AI incident types in IRP + internal audit scope note                 | Low    |
| 10       | AI-008      | REC-AI-07 — AI awareness training module                                         | Low    |
| 11       | AI-011      | REC-AI-11 — APP 12/13 data subject request procedure for AI-processed data       | Low    |

> All tasks are low-effort documentation additions achievable in a single
> implementation session. **Human actions required before close-out:** (a) Admin
> Console DPA confirmation for Antigravity by 2026-04-30 (REC-AI-04); (b)
> Founder review of OAIC AI guidance scope note (REC-AI-08).
