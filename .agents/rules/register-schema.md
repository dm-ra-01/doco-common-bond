# Register Schema Guard

> **Applies to:** All agents operating in the `documentation/common-bond`
> repository who add or modify rows in any governance register.

Before adding a row to any governance register, verify all mandatory columns are
present per the schema definitions below. This guard is an interim control until
all registers are migrated to `supabase-common-bond` (Supabase schema validation
will then replace this rule).

---

## Risk Register (`docs/compliance/iso27001/risk-management/risk-register.md`)

**Mandatory columns for every row:**

| Column | Format | Notes |
| :--- | :--- | :--- |
| `Risk ID` | `R-NNN` (zero-padded, sequential) | Check existing rows for next ID |
| `Description` | Free text — ≥ 10 words | Must not be a single noun |
| `Threat` | Free text | Source of the risk |
| `Impact` | Free text | Consequence if realised |
| `Risk Level` | `🔴 Critical` · `🟠 High` · `🟡 Medium` · `🟢 Low` | Must use the emoji prefix |
| `Risk Owner` | Named individual or role | e.g. `Ryan Ammendolea, CEO` |
| `Treatment Strategy` | Free text | e.g. `Mitigate — …` or `Accept` |
| `Status` | `Planned` · `Ongoing` · `Closed` · `Accepted` · `Transferred` | Exact spelling; no emoji |
| `Cross-Reference` | Register ID or `—` | e.g. `SA-001`, `CA-005` |

---

## Non-Conformity Log (`docs/compliance/iso27001/assurance/nonconformity-log.md`)

**Mandatory columns for every row:**

| Column | Format | Notes |
| :--- | :--- | :--- |
| `NC ID` | `NC-NNN` (zero-padded, sequential) | Check existing rows for next ID |
| `Date Raised` | `YYYY-MM-DD` | ISO date only |
| `Source` | Free text | Where the NC was identified |
| `Description` | Free text — ≥ 10 words | |
| `Status` | `Open` · `In Progress` · `Closed` | Exact spelling |
| `Linked CA` | `CA-NNN` or `—` | Must link to a CA if one exists |

---

## Corrective Actions Register (`docs/compliance/iso27001/assurance/corrective-actions.md`)

**Mandatory columns for every row:**

| Column | Format | Notes |
| :--- | :--- | :--- |
| `CA ID` | `CA-NNN` (zero-padded, sequential) | Check existing rows for next ID |
| `Linked NC` | `NC-NNN` or `—` | |
| `Description` | Free text — ≥ 10 words | |
| `Owner` | Named individual or role | |
| `Target Date` | `YYYY-MM-DD` | |
| `Status` | `Open` · `In Progress` · `Closed` · `Verified` | Exact spelling |

---

## Asset Register (`docs/compliance/iso27001/operations/asset-register.md`)

**Mandatory columns for every row:**

| Column | Format | Notes |
| :--- | :--- | :--- |
| `Asset ID` | `SA-NNN` (software), `HA-NNN` (hardware), etc. | Next sequential in category |
| `Asset Name` | Free text | |
| `Type` | `Software/SaaS` · `Hardware` · `Data` · `Infrastructure` | |
| `Owner` | Named individual or role | |
| `Classification` | Per Data Classification Scheme | e.g. `Confidential`, `Internal` |
| `Supplier` | Supplier name or `—` | Link to Supplier Register if applicable |
| `Risk Reference` | `R-NNN` or `—` | |
| `Notes` | Free text or `—` | |

---

## Supplier Register (`docs/compliance/iso27001/operations/supplier-register.md`)

**Mandatory columns for every row:**

| Column | Format | Notes |
| :--- | :--- | :--- |
| `Supplier` | Company name | |
| `Service Provided` | Free text | |
| `Criticality` | `🔴 Critical` · `🟠 High` · `🟡 Medium` · `🟢 Low` | |
| `DPA Executed` | `✅ Yes` · `❌ No` · `⏳ Pending` | |
| `Data Scope` | Free text | What data the supplier processes |
| `Notes` | Free text or `—` | |

---

## Enforcement

If any mandatory column is missing or uses a non-approved value, the row **must
not be committed**. Fix the row inline before committing.

Once migration to `supabase-common-bond` is complete, this rule file will be
superseded by database-level `NOT NULL` and `CHECK` constraints. At that point,
delete this file and update the register-schema guidance in `docs/engineering/`.
