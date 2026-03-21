<!-- audit-slug: 260321-frontend-auth-security -->

# Recommendations — Frontend Authentication Security Audit

**Branch:** `audit/260321-frontend-auth-security`\
**Auditor:** Ryan Ammendolea\
**Date:** 2026-03-21

:::note
This file is **auto-generated** from `recommendations.json`.
Do not edit it directly — edit the JSON source and re-run
`python .agents/scripts/render-recommendations.py recommendations.json`.
:::

---

## Agent Clarifications (Human-Approved)

| Item | Decision |
| :--- | :------- |
| ADV-03 token verification scope | The iss claim check is a misconfiguration guard, not a cryptographic signature verification. Signature validation is handled by Supabase server-side. This is the appropriate trust boundary given the Edge Function is first-party infrastructure. |
| ADV-05 Edge Function passthrough | The Edge Function is confirmed to pass the redirect_to parameter intact, so encoding next into the callbackUrl before forwarding will survive the round-trip. |
| Retrospective registration | This audit is registered retrospectively. All findings were identified and implemented in conversation 0e378e24-33e7-4919-969e-88478c6b34c0 before the audit files were created. The feature branch (audit/260321-frontend-auth-security) was created on the same day as implementation. Implementation branches in the three target repos are named audit/260319-cicd-workflow-health (the concurrent CI/CD audit branch; work was committed there before this audit's branch was formally created). |


---

## 🔴 Critical

### ADV-01: Open redirect vulnerability: the `next` query parameter is used unvalidated in NextResponse.redirect(), allowing an atta

Affects: `cross-ecosystem` — app/auth/callback/route.ts


- [x] Validate `next` parameter in planner-frontend callback: reject absolute URLs and protocol-relative paths; fall back to '/'.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/auth/callback/route.ts`
      _(Completed: 2026-03-21T05:05:00Z)_
- [x] Validate `next` parameter in preference-frontend callback.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/app/auth/callback/route.ts`
      _(Completed: 2026-03-21T05:05:00Z)_
- [x] Validate `next` parameter in workforce-frontend callback.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/app/auth/callback/route.ts`
      _(Completed: 2026-03-21T05:05:00Z)_

### ADV-02: Silent production failure: SUPABASE_ANON_KEY falls back to an empty string when VSO injection fails, causing every Supab

Affects: `cross-ecosystem` — lib/supabase/config.ts


- [x] Add production guard in planner-frontend config.ts: throw an error at module load time if SUPABASE_ANON_KEY is empty and NODE_ENV is production.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/lib/supabase/config.ts`
      _(Completed: 2026-03-21T05:03:00Z)_
- [x] Add production guard in preference-frontend config.ts.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/lib/supabase/config.ts`
      _(Completed: 2026-03-21T05:03:00Z)_
- [x] Add production guard in workforce-frontend config.ts.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/lib/supabase/config.ts`
      _(Completed: 2026-03-21T05:03:00Z)_

### ADV-03: Token issuer not verified: the session returned by the Edge Function fetch is passed to setSession() without checking th

Affects: `cross-ecosystem` — app/auth/callback/route.ts


- [x] In planner-frontend callback, decode the JWT payload and verify iss starts with SUPABASE_URL before calling setSession. Redirect to auth-code-error on mismatch.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/auth/callback/route.ts`
      _(Completed: 2026-03-21T05:07:00Z)_
- [x] Same iss claim check in preference-frontend callback.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/app/auth/callback/route.ts`
      _(Completed: 2026-03-21T05:07:00Z)_
- [x] Same iss claim check in workforce-frontend callback.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/app/auth/callback/route.ts`
      _(Completed: 2026-03-21T05:07:00Z)_

## 🟠 High

### ADV-05: Middleware login redirect constructs the callback URL without a `next` parameter. After authentication, users always lan

Affects: `cross-ecosystem` — utils/supabase/middleware.ts


- [x] In planner-frontend middleware, append next=encodeURIComponent(pathname+search) to the callbackUrl before forwarding to the Edge Function.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/utils/supabase/middleware.ts`
      _(Completed: 2026-03-21T05:13:00Z)_
- [x] Same fix in preference-frontend middleware.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/utils/supabase/middleware.ts`
      _(Completed: 2026-03-21T05:13:00Z)_
- [x] Same fix in workforce-frontend middleware.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/workforce-frontend/src/utils/supabase/middleware.ts`
      _(Completed: 2026-03-21T05:13:00Z)_

## 🟡 Medium

### ADV-04: preference-frontend AuthProvider uses supabaseRef.current inside signOut and refreshClaims closures. planner-frontend us

Affects: `preference-frontend` — providers/AuthProvider.tsx


- [x] Replace supabaseRef pattern in preference AuthProvider with useMemo client. Update signOut and refreshClaims to use the memoized reference.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/providers/AuthProvider.tsx`
      _(Completed: 2026-03-21T05:15:00Z)_

### ADV-06: layout.tsx calls getSession() server-side but discards the result. AuthProvider receives only initialUser (no initialSes

Affects: `planner-frontend` — app/layout.tsx


- [x] Capture the getSession() result in planner layout.tsx and pass it as initialSession to AuthProvider.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/planner-frontend/src/app/layout.tsx`
      _(Completed: 2026-03-21T05:16:00Z)_

### ADV-07: createClient() is called inside a useEffect body that depends on the user object, causing a new Supabase SDK instance to

Affects: `preference-frontend` — components/dashboard-header.tsx


- [x] Memoize the Supabase client in dashboard-header.tsx with useMemo([], []). Change effect dep from user to user?.id to avoid re-fetching on token refresh.
      `/Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/components/dashboard-header.tsx`
      _(Completed: 2026-03-21T05:15:00Z)_


---


---

## Implementation Order

| Phase | Finding IDs | Rationale |
| :---- | :---------- | :-------- |
| 1 | ADV-01, ADV-02, ADV-03 | Must Fix: open redirect, silent credential failure, and unverified session token are production security risks requiring immediate remediation. |
| 2 | ADV-05 | Deep-link preservation is high severity (broken UX + potential for auth bypass edge cases) and shares the same callback/middleware surface as phase 1. |
| 3 | ADV-04, ADV-06, ADV-07 | Should Fix: architectural drift and client-side waterfall are quality improvements that reduce future risk but have no immediate security impact. |


---

## Severity Summary

| Finding ID | Area | File | Category | Severity |
| :--------- | :--- | :--- | :------- | :------- |
| ADV-01 | app/auth/callback/route.ts | `route.ts` | Security | 🔴 Critical |
| ADV-02 | lib/supabase/config.ts | `config.ts` | Security | 🔴 Critical |
| ADV-03 | app/auth/callback/route.ts | `route.ts` | Security | 🔴 Critical |
| ADV-05 | utils/supabase/middleware.ts | `middleware.ts` | Security | 🟠 High |
| ADV-04 | providers/AuthProvider.tsx | `AuthProvider.tsx` | Architectural Drift | 🟡 Medium |
| ADV-06 | app/layout.tsx | `layout.tsx` | Tech Debt | 🟡 Medium |
| ADV-07 | components/dashboard-header.tsx | `dashboard-header.tsx` | Architectural Drift | 🟡 Medium |

