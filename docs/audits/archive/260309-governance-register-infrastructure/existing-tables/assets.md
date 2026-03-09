# Archive: Asset Register Tables (from asset-register.md)

> Extracted from `docs/compliance/iso27001/operations/asset-register.md`
> before migration to `AssetsDashboard` (Supabase table: `public.assets`).
> Use to verify equivalence against live Supabase data post-migration.

## Information Assets

| ID     | Asset Name                             | Description                                                                                                       | Owner                 | Classification        | Location                                 | Recovery Priority |
| ------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------- | ---------------------------------------- | ----------------- |
| IA-001 | Workforce Admin PII                    | First name, last name, email, telephone number of healthcare organisation staff                                   | Ryan Ammendolea (CEO) | Confidential          | Supabase (production)                    | Critical          |
| IA-002 | Worker PII                             | First name, last name, email, telephone number, work preferences, rotation allocations of clinical workers        | Ryan Ammendolea (CEO) | Confidential          | Supabase (production)                    | Critical          |
| IA-003 | Source code (Receptor)                 | Application source code for all Receptor platform components (frontend, backend, edge functions, database schema) | Ryan Ammendolea (CEO) | Confidential          | GitHub (common-bond org)                 | Critical          |
| IA-004 | ISMS documentation                     | All ISO 27001 policies, procedures, risk registers, and audit records                                             | Ryan Ammendolea (CEO) | Internal              | GitHub / Docusaurus                      | High              |
| IA-005 | Authentication credentials             | API keys, service account secrets, database connection strings, JWT signing secrets                               | Ryan Ammendolea (CEO) | Confidential          | Supabase secrets / environment variables | Critical          |
| IA-006 | Internal business correspondence       | Emails, meeting notes, commercial agreements                                                                      | Ryan Ammendolea (CEO) | Internal–Confidential | Google Workspace                         | Medium            |
| IA-007 | Intellectual property (product design) | Unreleased feature designs, roadmap, competitive strategy                                                         | Ryan Ammendolea (CEO) | Confidential          | Google Workspace / ClickUp               | High              |

## Software and Services

| ID     | Asset Name            | Description                                                                            | Owner                 | Classification     | Location             | Recovery Priority |
| ------ | --------------------- | -------------------------------------------------------------------------------------- | --------------------- | ------------------ | -------------------- | ----------------- |
| SA-001 | Supabase (production) | PostgreSQL database, authentication, storage, edge functions for the Receptor platform | Ryan Ammendolea (CEO) | — (infrastructure) | AWS (US/EU)          | Critical          |
| SA-002 | GitHub                | Source code hosting, CI/CD, version control                                            | Ryan Ammendolea (CEO) | — (infrastructure) | Microsoft Azure (US) | Critical          |
| SA-003 | Cloudflare            | DNS, CDN, Zero Trust access                                                            | Ryan Ammendolea (CEO) | — (infrastructure) | Cloudflare global    | High              |
| SA-004 | Google Workspace      | Corporate email, document storage, calendar, identity provider                         | Ryan Ammendolea (CEO) | — (infrastructure) | Google LLC (US)      | High              |
| SA-005 | ClickUp               | Project and task management                                                            | Ryan Ammendolea (CEO) | — (infrastructure) | AWS (US)             | Low               |

## Hardware

| ID     | Asset Name        | Description                                                                                                                 | Owner                 | Classification | Location                 | Recovery Priority |
| ------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------- | ------------------------ | ----------------- |
| HW-001 | Developer laptops | Personal computing devices used for development and business operations. Device count and model confirmed at annual review. | Ryan Ammendolea (CEO) | Internal       | Remote (staff locations) | Medium            |

## People

| ID     | Asset Name                    | Description                                                                                               | Owner                 | Classification | Location           | Recovery Priority |
| ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------- | -------------- | ------------------ | ----------------- |
| PA-001 | Founder/CEO (Ryan Ammendolea) | Sole decision-maker, technical lead, ISMS owner; key person risk documented as R-006 in the Risk Register | —                     | —              | Remote (Australia) | Critical          |
| PA-002 | Engineering staff             | Software engineers with access to production systems and source code                                      | Ryan Ammendolea (CEO) | —              | Remote             | High              |
