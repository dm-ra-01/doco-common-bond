<!-- audit-slug: 260307-ip-licensing -->

# IP Ownership & Licensing — Recommendations

**Feature Branch:** `audit/260307-ip-licensing`\
**Audit Date:** 2026-03-07\
**Auditor:** Ryan Ammendolea

---

## Agent Clarifications (Human-Approved)

| Item                           | Decision                                                                                                                                                        |
| :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IP Owner                       | MyJMO Pty Ltd (ABN 50 648 051 852) owns all Intellectual Property in the Software                                                                               |
| Exclusive Licensee             | Common Bond Pty Ltd (ACN 694 840 394) holds an exclusive licence                                                                                                |
| Prior non-exclusive licence    | A prior non-exclusive license was issued to a third party under invoice-based terms; to be documented but that entity is not named in this audit                |
| Licence agreement format       | Produced as a Markdown governance document; a wet-ink/digital signature counterpart is required                                                                 |
| ACN in `asic-registration.md`  | Transposed digit — correct ACN is 694 840 394 (not 674 840 394) — corrected in this audit                                                                       |
| Trade mark — "Receptor"        | "Receptor" is a codename and may change; no trade mark registration needed at this stage                                                                        |
| Trade mark — "Common Bond"     | No registered TM exists. ASIC registration ≠ TM. Engage a trade mark attorney to register in Class 42 (SaaS/software)                                           |
| Sub-repo README IP attribution | Each repo README should add a one-line IP attribution pointing back to the MyJMO–Common Bond licence                                                            |
| Licence agreement versioning   | Agreement has a version history table; any amendment requires a new version row and signed counterpart                                                          |
| AI-generated code copyright    | Settled under s 35(6) _Copyright Act 1968_ (Cth) — MyJMO Pty Ltd owns all AI-assisted code via Ryan Ammendolea as lead engineer; AI is the tool, not the author |
| GitHub Organisation            | Common Bond Pty Ltd to create and own the GitHub Organisation; manage repos. MyJMO Pty Ltd retains IP ownership under the licence agreement                     |
| Open source SCA audit          | Denied by user — out of scope for this audit                                                                                                                    |
| Deferred items                 | Signed counterpart, third-party licensee identity, source file copyright header rollout, DPA, trade mark registration — all deferred                            |

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

- [x] `common-bond` — Correct ACN from `674 840 394` to `694 840 394` in
      `docs/governance/asic-registration.md` (line 9 and the table)

---

## 🟡 Medium

### IP-005 — Governance Index Does Not Reference IP/Licensing

**Finding:** `docs/governance/index.md` does not include any reference to IP
ownership or licensing documentation.

**Tasks:**

- [x] `common-bond` — Update `docs/governance/index.md` to add an "Intellectual
      Property" section referencing the licence agreement and IP ownership
      register

---

### IP-006 — No IP Ownership Register

**Finding:** No document identifies what IP MyJMO Pty Ltd owns and on what terms
it is licensed.

**Recommendation:** Create an IP Ownership Register at
`docs/governance/legal/ip-ownership-register.md`.

**Tasks:**

- [x] `common-bond` — Create `docs/governance/legal/ip-ownership-register.md`
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

### IP-012 — GitHub Repositories Hosted on Personal Account (`dm-ra-01`)

**Finding:** All 9 ecosystem repositories are hosted under `dm-ra-01`, a
personal GitHub account. If the account holder loses access or changes roles,
Common Bond and MyJMO would lose administrative control over their IP assets.
There is no GitHub Organisation providing centralised access management.

**Decision (Human-Approved):** Common Bond Pty Ltd will create and own the
GitHub Organisation account and manage repositories. MyJMO Pty Ltd retains IP
ownership as documented in the licence agreement. These are separate concerns.

**Recommendation:** Create a GitHub Organisation under Common Bond Pty Ltd (e.g.
`common-bond-au`) and migrate all 9 repositories. Update access controls so the
organisation is not dependent on any single personal login.

**Tasks:**

- [ ] Create a GitHub Organisation account registered to Common Bond Pty Ltd
- [ ] Transfer the following repositories from `dm-ra-01` to the new
      organisation:
  - `supabase-receptor`, `match-backend`, `receptor-planner`
  - `planner-frontend`, `preference-frontend`, `workforce-frontend`,
    `website-frontend`, `rotator_worker`
  - `doco-common-bond`
- [ ] Update all submodule remote URLs in the monorepo after transfer
- [ ] Update `README.md` and `.llm-context.md` to reference the new organisation
- [ ] Add at least one additional admin user to the organisation for resilience

---

### IP-013 — No End-User Licence Agreement (EULA) for Hospital Customers

**Finding:** The MyJMO–Common Bond licence agreement authorises Common Bond to
sub-license the Software to hospitals, but no EULA or Terms of Service has been
drafted. This is a **product release blocker** — the platform cannot be
commercially released to new hospital customers without it.

**Recommendation:** Draft a hospital-facing EULA/ToS before commercial release.
It must pass MyJMO's IP protections downstream (per clause 3.1(d) of the licence
agreement) and include at minimum: scope of use, data handling obligations,
prohibition on reverse engineering, and termination rights.

**Tasks:**

- [ ] `common-bond` — Create `docs/governance/legal/hospital-eula.md` as a draft
      EULA for hospital End Users
- [ ] Ensure the EULA is reviewed by a lawyer before first commercial hospital
      sign-up
- [ ] Reference the EULA in the IP Ownership Register as the downstream licence
      instrument
- [ ] Add EULA execution as a gate in the product release checklist

---

### IP-014 — IP Risks Absent from Risk Register

**Finding:** `docs/governance/risk-management.md` does not include an IP risk
category. Risks such as trade mark squatting, GitHub account loss, open source
licence violations, and AI authorship uncertainty are not documented.

**Tasks:**

- [ ] `common-bond` — Add an "Intellectual Property Risks" section to
      `docs/governance/risk-management.md` covering: trade mark registration
      gap, GitHub account single point of failure, EULA absence, and open source
      licence exposure

---

## Implementation Order

| Phase | Finding IDs | Priority    | Effort | Description                                           |
| :---- | :---------- | :---------- | :----- | :---------------------------------------------------- |
| **1** | IP-002      | 🔴 Critical | Low    | Execute the licence agreement (review and sign)       |
| **1** | IP-004      | 🟠 High     | Low    | Fix ACN typo in `asic-registration.md` ✅ Done        |
| **1** | IP-003      | 🟠 High     | Medium | Update root + all sub-repo README IP attribution      |
| **1** | IP-013      | 🟠 High     | Medium | Draft hospital EULA (product release blocker)         |
| **2** | IP-001      | 🔴 Critical | Medium | Add LICENSE file to all repositories                  |
| **2** | IP-012      | 🔴 Critical | Medium | Migrate repos to GitHub Organisation (Common Bond)    |
| **2** | IP-006      | 🟡 Medium   | Low    | Create IP Ownership Register ✅ Done                  |
| **2** | IP-005      | 🟡 Medium   | Low    | Update governance index page ✅ Done                  |
| **3** | IP-009      | 🟡 Medium   | Low    | Document prior non-exclusive licence (in IP Register) |
| **3** | IP-011      | 🟡 Medium   | Low    | Trade mark clearance search and registration          |
| **3** | IP-010      | 🟡 Medium   | Low    | Add DPA risk item; seek legal advice                  |
| **3** | IP-014      | 🟡 Medium   | Low    | Add IP risks to risk-management.md                    |
| **3** | IP-007      | 🟡 Medium   | High   | Add copyright headers to source files                 |
| **4** | IP-008      | 🟢 Low      | Low    | Add AUTHORS/NOTICE file                               |

---

## Deferred to Next Audit Cycle

| Item                                                | Reason Deferred                                                                                            |
| :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| Identity and status of prior non-exclusive licensee | Business decision; not appropriate to name in a shared repository without legal advice                     |
| Execution of signed licence counterpart             | Requires human action outside the scope of an agent audit                                                  |
| Open source SCA dependency audit                    | Denied by user — out of scope for this audit                                                               |
| Source file copyright header rollout (IP-007)       | High volume; deserves a dedicated implementation session to avoid widespread diffs                         |
| DPA between entities (IP-010)                       | Requires legal advice on data flows; may not be needed depending on entity interaction                     |
| Trade mark registration (IP-011)                    | Requires human engagement with a trade mark attorney; agent can only document the gap and provide guidance |
