---
title: Document Control
sidebar_position: 2
---

# Document Control Policy

| Version | Effective Date | Approved By          | Next Review |
| ------- | -------------- | -------------------- | ----------- |
| 1.0     | ⚠️ Confirm     | Ryan Ammendolea, CEO | ⚠️ Confirm  |

## 1. Purpose

To ensure that all documents within the ISMS are adequately controlled,
approved, and available to those who need them.

## 2. Policy

We use **Git (GitHub)** and this **Docusaurus** site as our primary document
control system.

### 2.1 Creation and Update

- All ISMS documents are Markdown files stored in the `antigravity-environment`
  repository.
- Changes are proposed via **Pull Requests (PRs)**.
- PRs for ISMS documents require review and approval by the Information Security
  Manager (or delegate).

### 2.2 Version Control

- Git provides a complete audit trail of all changes (who, what, when).
- The `main` branch represents the current approved version of the ISMS.

### 2.3 Review

- Documents are reviewed at least **annually** or upon significant changes to
  the organization or threat landscape.
- Obsolete documents are either archived (via Git history) or deleted to prevent
  unintended use.

### 2.4 External Documents

External documents (e.g., ISO standards, laws, customer contracts) are
identified and controlled by the CTO.

## 3. AI Tool Change Management

_ISO 27001 Annex A 8.32 (Change management) — added 2026-03-09 per audit
`260307-iso27001-ai-gaps` REC-AI-05._

- **Model version changes:** Google Antigravity model version updates must be
  evaluated for behavioural impact before adoption in production engineering
  workflows. Changes that alter outputs materially should be documented.
- **Prompt-template changes:** Changes to `.agents/` workflow and skill files
  that govern Antigravity's actions on ISMS or compliance work require a PR
  review by the ISM before merge, using the same approval process as ISMS
  document changes.
- **Service migrations and deprecations:** AI tool deprecations (e.g.,
  Antigravity exiting preview, migration to a different approved tool) follow
  the standard change management process: PR + ISM review + approval table
  update.
- **Compliance-impacting changes:** Changes to agent behaviour that materially
  affect compliance outputs (e.g., changes to audit workflows, risk assessment
  prompts) must be logged as an ISMS change event in the corrective actions or
  non-conformity log as appropriate.
