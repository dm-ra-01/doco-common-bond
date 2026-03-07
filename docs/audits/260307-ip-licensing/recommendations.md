<!-- audit-slug: 260307-ip-licensing -->

# IP Ownership & Licensing — Recommendations

**Feature Branch:** `audit/260307-ip-licensing`\
**Audit Date:** 2026-03-07\
**Auditor:** Ryan Ammendolea

---

## Agent Clarifications (Human-Approved)

| Item                          | Decision                                                                                                                                         |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| IP Owner                      | MyJMO Pty Ltd (ABN 50 648 051 852) owns all Intellectual Property in the Software                                                                |
| Exclusive Licensee            | Common Bond Pty Ltd (ACN 694 840 394) holds an exclusive licence                                                                                 |
| Prior non-exclusive licence   | A prior non-exclusive license was issued to a third party under invoice-based terms; to be documented but that entity is not named in this audit |
| Licence agreement format      | Produced as a Markdown governance document; a wet-ink/digital signature counterpart is required                                                  |
| ACN in `asic-registration.md` | Transposed digit — correct ACN is 694 840 394 (not 674 840 394) — to be corrected                                                                |
| Deferred items                | Signed counterpart execution and third-party licensee identity — out of scope for this audit                                                     |

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

### IP-003 — Root README.md Contains Incorrect IP Attribution

**Finding:** `README.md` line 201 states "This project is proprietary to Common
Bond. All rights reserved." Common Bond Pty Ltd is the exclusive licensee, not
the IP owner.

**Recommendation:** Update the `README.md` licence section to correctly
attribute ownership to MyJMO Pty Ltd and state Common Bond's status as exclusive
licensee.

**Tasks:**

- [ ] `antigravity-environment` root — Update `README.md` licence section (line
      197–202) to:

```markdown
## 📄 Licence

This software is the exclusive intellectual property of **MyJMO Pty Ltd** (ABN
50 648 051 852), licensed exclusively to **Common Bond Pty Ltd** (ACN 694 840
394). All rights reserved. Unauthorised use is strictly prohibited.
```

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

## Implementation Order

| Phase | Finding IDs | Priority    | Effort | Description                                     |
| :---- | :---------- | :---------- | :----- | :---------------------------------------------- |
| **1** | IP-002      | 🔴 Critical | Low    | Execute the licence agreement (review and sign) |
| **1** | IP-004      | 🟠 High     | Low    | Fix ACN typo in `asic-registration.md`          |
| **1** | IP-003      | 🟠 High     | Low    | Update root README licence attribution          |
| **2** | IP-001      | 🔴 Critical | Medium | Add LICENSE file to all repositories            |
| **2** | IP-006      | 🟡 Medium   | Low    | Create IP Ownership Register                    |
| **2** | IP-005      | 🟡 Medium   | Low    | Update governance index page                    |
| **3** | IP-009      | 🟡 Medium   | Low    | Document prior non-exclusive licence            |
| **3** | IP-007      | 🟡 Medium   | High   | Add copyright headers to source files           |
| **4** | IP-008      | 🟢 Low      | Low    | Add AUTHORS/NOTICE file                         |

---

## Deferred to Next Audit Cycle

| Item                                                | Reason Deferred                                                                        |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------- |
| Identity and status of prior non-exclusive licensee | Business decision; not appropriate to name in a shared repository without legal advice |
| Execution of signed licence counterpart             | Requires human action outside the scope of an agent audit                              |
| Source file copyright header rollout (IP-007)       | High volume; deserves a dedicated implementation session to avoid widespread diffs     |
