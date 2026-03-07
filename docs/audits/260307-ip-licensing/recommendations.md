<!-- audit-slug: 260307-ip-licensing -->

# IP Ownership & Licensing — Recommendations

**Feature Branch:** `audit/260307-ip-licensing`\
**Audit Date:** 2026-03-07\
**Auditor:** Ryan Ammendolea

---

## Agent Clarifications (Human-Approved)

| Item                           | Decision                                                                                                                                         |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| IP Owner                       | MyJMO Pty Ltd (ABN 50 648 051 852) owns all Intellectual Property in the Software                                                                |
| Exclusive Licensee             | Common Bond Pty Ltd (ACN 694 840 394) holds an exclusive licence                                                                                 |
| Prior non-exclusive licence    | A prior non-exclusive license was issued to a third party under invoice-based terms; to be documented but that entity is not named in this audit |
| Licence agreement format       | Produced as a Markdown governance document; a wet-ink/digital signature counterpart is required                                                  |
| ACN in `asic-registration.md`  | Transposed digit — correct ACN is 694 840 394 (not 674 840 394) — corrected in this audit                                                        |
| Trade mark — "Receptor"        | "Receptor" is a codename and may change; no trade mark registration needed at this stage                                                         |
| Trade mark — "Common Bond"     | ASIC registration ≠ trade mark. Recommend engaging a trade mark attorney to register "Common Bond" in class 42 (SaaS/software)                   |
| Sub-repo README IP attribution | Each repo README should add a one-line IP attribution pointing back to the MyJMO–Common Bond licence                                             |
| Licence agreement versioning   | Agreement now has a version history table; any amendment requires a new version row and signed counterpart                                       |
| Deferred items                 | Signed counterpart execution, third-party licensee identity, source file copyright headers (full rollout) — out of scope for this audit          |

---

## 🔴 Critical

### IP-001 — No Project-Level LICENSE Files in Any Repository

**Finding:** No `LICENSE` or `LICENCE` file exists at the root of any ecosystem
repository. GitHub displays all repositories as "No licence", creating legal
ambiguity.

**Recommendation:** Add a proprietary `LICENSE` file to each active repository.
The file should state that the Software is the intellectual property of MyJMO
Pty Ltd, licensed exclusively to Common Bond Pty Ltd, and that no rights are
granted to any other person.

**Tasks:**

- [ ] `supabase-receptor` — Add `LICENSE` at repo root
- [ ] `match-backend` — Add `LICENSE` at repo root
- [ ] `receptor-planner` — Add `LICENSE` at repo root
- [ ] `planner-frontend` — Add `LICENSE` at repo root
- [ ] `preference-frontend` — Add `LICENSE` at repo root
- [ ] `workforce-frontend` — Add `LICENSE` at repo root
- [ ] `website-frontend` — Add `LICENSE` at repo root
- [ ] `rotator_worker` — Add `LICENSE` at repo root
- [ ] `doco-common-bond` — Add `LICENSE` at repo root

**Suggested LICENSE file content:**

```
Proprietary Software Licence

Copyright © 2024–2026 MyJMO Pty Ltd (ABN 50 648 051 852). All rights reserved.

This software and its source code are the exclusive intellectual property of
MyJMO Pty Ltd. This software is licensed exclusively to Common Bond Pty Ltd
(ACN 694 840 394) under the terms of the MyJMO–Common Bond Exclusive Licence
Agreement dated 7 March 2026.

No other licence, right, or interest in this software is granted to any person
or entity. Unauthorised use, reproduction, distribution, or modification is
strictly prohibited.
```

---

### IP-002 — No Formal Licensing Agreement Exists

**Finding:** No written licensing agreement between MyJMO Pty Ltd and Common
Bond Pty Ltd exists in any location.

**Recommendation:** Execute the `myjmo-common-bond-licence-agreement.md`
agreement (now drafted and located at
`docs/governance/legal/myjmo-common-bond-licence-agreement.md`) as a binding
agreement. Both parties must sign a counterpart (wet-ink or digital). The
executed counterpart should be retained securely and referenced from the IP
Ownership Register.

**Tasks:**

- [ ] `common-bond` — Review the licence agreement at
      `docs/governance/legal/myjmo-common-bond-licence-agreement.md`
- [ ] Obtain executed (signed) counterpart from both parties
- [ ] Retain executed counterpart in secure storage (Notion / physical / legal
      folder)
- [ ] Reference the executed agreement in
      `docs/governance/legal/ip-ownership-register.md`

---

## 🟠 High

### IP-003 — Root README and Sub-Repo READMEs Contain Incorrect IP Attribution

**Finding:** `README.md` line 201 states "This project is proprietary to Common
Bond. All rights reserved." Common Bond Pty Ltd is the exclusive licensee, not
the IP owner. No sub-repo README contains any IP attribution.

**Recommendation:** Update root `README.md` and add a one-line IP attribution to
each sub-repo README.

**Tasks:**

- [ ] `antigravity-environment` root — Update `README.md` licence section (line
      197–202) to:

```markdown
## 📄 Licence

This software is the exclusive intellectual property of **MyJMO Pty Ltd** (ABN
50 648 051 852), licensed exclusively to **Common Bond Pty Ltd** (ACN 694 840
394). All rights reserved. Unauthorised use is strictly prohibited.
```

- [ ] `supabase-receptor` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `match-backend` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `receptor-planner` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `planner-frontend` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `preference-frontend` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648
      051 852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `workforce-frontend` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648
      051 852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `website-frontend` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `rotator_worker` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._
- [ ] `doco-common-bond` — Add to `README.md`: _© MyJMO Pty Ltd (ABN 50 648 051
      852). Exclusively licensed to Common Bond Pty Ltd._

---

### IP-004 — Incorrect ACN in `asic-registration.md`

**Finding:** `docs/governance/asic-registration.md` records the ACN as **674 840
394** — the correct ACN is **694 840 394** (transposed digits).

**Tasks:**

- [ ] `common-bond` — Correct ACN from `674 840 394` to `694 840 394` in
      `docs/governance/asic-registration.md` (line 9 and the table)

---

## 🟡 Medium

### IP-005 — Governance Index Does Not Reference IP/Licensing

**Finding:** `docs/governance/index.md` does not include any reference to IP
ownership or licensing documentation.

**Tasks:**

- [ ] `common-bond` — Update `docs/governance/index.md` to add an "Intellectual
      Property" section referencing the licence agreement and IP ownership
      register

---

### IP-006 — No IP Ownership Register

**Finding:** No document identifies what IP MyJMO Pty Ltd owns and on what terms
it is licensed.

**Recommendation:** Create an IP Ownership Register at
`docs/governance/legal/ip-ownership-register.md`.

**Tasks:**

- [ ] `common-bond` — Create `docs/governance/legal/ip-ownership-register.md`
      (template provided below)

**Template:**

```markdown
# IP Ownership Register

| Asset                                              | Owner                              | Type                     | Licence   | Licensee                              | Agreement                                        |
| :------------------------------------------------- | :--------------------------------- | :----------------------- | :-------- | :------------------------------------ | :----------------------------------------------- |
| Receptor Workforce Management Platform (all repos) | MyJMO Pty Ltd (ABN 50 648 051 852) | Software + Documentation | Exclusive | Common Bond Pty Ltd (ACN 694 840 394) | MyJMO–Common Bond Licence Agreement (2026-03-07) |
```

---

### IP-007 — No Copyright Notices in Source Files

**Finding:** No source files across any repository contain copyright headers or
proprietary notices.

**Recommendation:** Add a standard copyright comment block to source files.
Given the volume (hundreds of files), this is best addressed via a consistent
file header enforced through linting or a pre-commit hook.

**Tasks:**

- [ ] Define a standard copyright header for `.py`, `.ts`, `.tsx`, `.sql`,
      `.dart` files
- [ ] Add to `.editorconfig` or a custom lint rule (e.g. via
      `eslint-plugin-header` for TS/TSX)
- [ ] Apply retroactively to key entry-point files in each repo as a starting
      point

---

### IP-009 — Prior Non-Exclusive Licence Not Documented

**Finding:** A prior non-exclusive licence was issued to a third party under
invoice-based terms. This arrangement is not recorded in any governance
document.

**Recommendation:** Create a brief record of the prior arrangement in the IP
Ownership Register or a discrete legal note, including the approximate period,
scope, and termination/expiry status.

**Tasks:**

- [ ] `common-bond` — Add a "Prior Licences" section to
      `docs/governance/legal/ip-ownership-register.md` documenting the prior
      non-exclusive arrangement

---

## 🟢 Low

### IP-008 — No NOTICE or AUTHORS File

**Finding:** No repository contains a `NOTICE` or `AUTHORS` file documenting IP
origin or development attribution.

**Recommendation:** Consider adding a root-level `AUTHORS` file to the monorepo
environment that records development history and attribution to MyJMO Pty Ltd.

**Tasks:**

- [ ] `antigravity-environment` root — Add `AUTHORS` or `NOTICE` file (optional,
      low priority)

---

---

## 🟡 Medium (continued)

### IP-010 — No Data Processing Agreement Between MyJMO Pty Ltd and Common Bond Pty Ltd

**Finding:** The licence agreement covers IP rights but does not address
inter-entity data handling. If MyJMO Pty Ltd processes healthcare Personal
Information on behalf of Common Bond Pty Ltd (or vice versa), the _Privacy Act
1988_ (Cth) and the APPs may require a Data Processing Agreement (DPA).

**Recommendation:** Review the data flows between the two entities with a
privacy lawyer. If any Personal Information is shared or processed across entity
lines, a DPA should be prepared.

**Tasks:**

- [ ] `common-bond` — Add IP-010 DPA gap to `docs/governance/risk-management.md`
      as a privacy risk item
- [ ] Engage legal advice on whether a DPA is required given the healthcare data
      context

---

### IP-011 — "Common Bond" Brand Not Protected by Registered Trade Mark

**Finding:** ASIC company registration for "Common Bond Pty Ltd" does not
constitute a registered trade mark under the _Trade Marks Act 1995_ (Cth).
Without a registered trade mark, a third party could register "Common Bond" as a
trade mark for software or healthcare services, potentially requiring a rebrand.

**Advice on ASIC registration vs trade mark:**

- **ASIC company name registration** gives you the right to operate under the
  name as a corporate entity in Australia. It prevents another company from
  registering the same company name with ASIC.
- **Trade mark registration** (via IP Australia) gives you exclusive rights to
  use a name or logo as a _brand identifier_ for specific goods/services
  (classes). It is a separate, stronger right.
- These are independent systems — ASIC registration does **not** automatically
  protect the name as a trade mark, and vice versa.
- For a SaaS healthcare platform, the relevant class is likely **Class 42**
  (software, SaaS, technology services) and possibly **Class 44**
  (medical/healthcare services).
- "Receptor" is noted as a codename that may change — no trade mark registration
  is recommended for it at this stage.

**Recommendation:** Engage a registered trade mark attorney to conduct a
clearance search and, if clear, register "Common Bond" in Class 42 (and consider
Class 44) with IP Australia. Cost is typically AUD $250–$400 per class for
online filing.

**Tasks:**

- [ ] `common-bond` — Add trade mark status to IP Ownership Register
      (`docs/governance/legal/ip-ownership-register.md`)
- [ ] Engage a trade mark attorney or use IP Australia's self-service portal for
      a clearance search
- [ ] File trade mark application if clearance search is clean

---

## 🟢 Low

### IP-008 — No NOTICE or AUTHORS File

**Finding:** No repository contains a `NOTICE` or `AUTHORS` file documenting IP
origin or development attribution.

**Recommendation:** Consider adding a root-level `AUTHORS` file to the monorepo
environment that records development history and attribution to MyJMO Pty Ltd.

**Tasks:**

- [ ] `antigravity-environment` root — Add `AUTHORS` or `NOTICE` file (optional,
      low priority)

---

## Implementation Order

| Phase | Finding IDs | Priority    | Effort | Description                                           |
| :---- | :---------- | :---------- | :----- | :---------------------------------------------------- |
| **1** | IP-002      | 🔴 Critical | Low    | Execute the licence agreement (review and sign)       |
| **1** | IP-004      | 🟠 High     | Low    | Fix ACN typo in `asic-registration.md` ✅ Done        |
| **1** | IP-003      | 🟠 High     | Medium | Update root + all sub-repo README IP attribution      |
| **2** | IP-001      | 🔴 Critical | Medium | Add LICENSE file to all repositories                  |
| **2** | IP-006      | 🟡 Medium   | Low    | Create IP Ownership Register ✅ Done                  |
| **2** | IP-005      | 🟡 Medium   | Low    | Update governance index page ✅ Done                  |
| **3** | IP-009      | 🟡 Medium   | Low    | Document prior non-exclusive licence (in IP Register) |
| **3** | IP-011      | 🟡 Medium   | Low    | Trade mark clearance search and registration          |
| **3** | IP-010      | 🟡 Medium   | Low    | Add DPA risk item; seek legal advice                  |
| **3** | IP-007      | 🟡 Medium   | High   | Add copyright headers to source files                 |
| **4** | IP-008      | 🟢 Low      | Low    | Add AUTHORS/NOTICE file                               |

---

## Deferred to Next Audit Cycle

| Item                                                | Reason Deferred                                                                                            |
| :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| Identity and status of prior non-exclusive licensee | Business decision; not appropriate to name in a shared repository without legal advice                     |
| Execution of signed licence counterpart             | Requires human action outside the scope of an agent audit                                                  |
| Source file copyright header rollout (IP-007)       | High volume; deserves a dedicated implementation session to avoid widespread diffs                         |
| DPA between entities (IP-010)                       | Requires legal advice on data flows; may not be needed depending on how the entities interact              |
| trade mark registration (IP-011)                    | Requires human engagement with a trade mark attorney; agent can only document the gap and provide guidance |
