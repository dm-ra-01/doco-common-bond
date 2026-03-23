# Frontend Authentication Security Audit

**Date:** 2026-03-21\
**Scope:** `planner-frontend`, `preference-frontend`, `workforce-frontend`\
**Auditor:** Ryan Ammendolea\
**Standard:** ISO 27001 A.9 (Access Control), A.14.2 (Secure Development)

---

## Executive Summary

An adversarial code review of the server-first Supabase authentication refactor
across all three management frontends identified **7 security and quality
findings**: 3 critical/high-severity gaps in the auth callback flow (open
redirect, unverified session token, and silent credential failure), and 4
medium-severity consistency issues in client-component auth state management.
All findings apply to the same pattern repeated across all three repositories;
cross-cutting findings are listed first.

| Repository / Area         | Coverage | Issues Found | Overall |
| ------------------------- | -------- | ------------ | ------- |
| `auth/callback/route.ts` (all 3) | ✅ | 3 | 🔴 Critical |
| `lib/supabase/config.ts` (all 3) | ✅ | 1 | 🔴 Critical |
| `utils/supabase/middleware.ts` (all 3) | ✅ | 1 | 🟠 High |
| `providers/AuthProvider.tsx` (preference) | ✅ | 1 | 🟡 Medium |
| `app/layout.tsx` (planner) | ✅ | 1 | 🟡 Medium |
| `components/dashboard-header.tsx` (preference) | ✅ | 1 | 🟡 Medium |

---

## 1. Cross-Cutting — Auth Callback Route (`app/auth/callback/route.ts`)

All three repos share an identical auth callback implementation introduced
during the server-first auth refactor. The callback exchanges an OAuth code
via a custom Edge Function and sets the resulting session server-side.

### 1.1 Open Redirect via Unvalidated `next` Parameter

**Gaps:**

- **ADV-01** `app/auth/callback/route.ts` — `searchParams.get("next") ?? "/"`
  is used directly in `NextResponse.redirect()` without validating that the
  value is a path-relative URL. An attacker can craft a link with
  `?next=https://evil.com` and redirect victims after a successful login.

### 1.2 Unverified Session Token from Edge Function

**Gaps:**

- **ADV-03** `app/auth/callback/route.ts` — the `session` object returned from
  the Edge Function fetch is passed to `supabase.auth.setSession()` without any
  claim verification. A misconfigured or compromised Edge Function could return
  a token from a different Supabase project, which would be accepted silently.

---

## 2. Cross-Cutting — Runtime Secret Guard (`lib/supabase/config.ts`)

### 2.1 Silent Empty-String Fallback for `SUPABASE_ANON_KEY`

**Strengths:**

- All three repos already use a layered fallback:
  `SUPABASE_ANON_KEY ?? NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''` to support both
  VSO runtime injection and local development.

**Gaps:**

- **ADV-02** `lib/supabase/config.ts` — the final `?? ''` means a pod that
  starts with VSO injection failing is indistinguishable from a healthy pod
  until the first authenticated request returns a 401. No startup-time guard
  exists. Every Supabase request silently fails rather than the pod crashing
  loud.

---

## 3. Cross-Cutting — Middleware Deep-Link Preservation (`utils/supabase/middleware.ts`)

### 3.1 Login Redirect Discards Original Path

**Gaps:**

- **ADV-05** `utils/supabase/middleware.ts` — when an unauthenticated user
  visits a protected route, the middleware forwards them to the Edge Function
  auth endpoint with a bare `callbackUrl` of `.../auth/callback`. The original
  path (`request.nextUrl.pathname + search`) is not encoded into a `next`
  parameter, so users always land at `/` after login rather than their intended
  destination.

---

## 4. `preference-frontend` — AuthProvider (`providers/AuthProvider.tsx`)

### 4.1 `supabaseRef.current` Accessed Inside Render-Scope Functions

**Gaps:**

- **ADV-04** `providers/AuthProvider.tsx` — `signOut` and `refreshClaims` are
  closures defined in the component body that call `supabaseRef.current.auth.*`.
  In contrast, `planner-frontend`'s equivalent component uses `useMemo` for a
  stable client reference. The `useRef` pattern in preference risks stale-ref
  bugs if the ref is mutated between renders, and is inconsistent with the
  established pattern.

---

## 5. `planner-frontend` — Root Layout (`app/layout.tsx`)

### 5.1 `getSession()` Result Discarded — Client Re-fetches on Mount

**Gaps:**

- **ADV-06** `app/layout.tsx` — `await supabase.auth.getSession()` is called
  server-side but its return value is not used; `AuthProvider` receives only
  `initialUser` (no `initialSession`). The `AuthProvider` effect then calls
  `getSession()` again client-side, creating a waterfall re-fetch that delays
  auth state availability and produces a flash of unauthenticated content.

---

## 6. `preference-frontend` — Dashboard Header (`components/dashboard-header.tsx`)

### 6.1 Supabase Client Re-Constructed on Every Auth State Change

**Gaps:**

- **ADV-07** `components/dashboard-header.tsx` — `createClient(url, key)` is
  called inside the `useEffect` body, which re-runs on every change to the
  `user` object (including token refreshes). This instantiates a new SDK client
  on every auth state event rather than sharing a single stable instance.

---

## 7. Cross-Cutting Observations

1. **Identical code, identical risk.** ADV-01, ADV-02, ADV-03, and ADV-05
   exist verbatim in all three repos. Any future auth change must be
   coordinated across all three simultaneously — this is a process gap as much
   as a code gap.

2. **`planner-frontend` is the reference implementation** for `AuthProvider`
   (`useMemo` client). `preference-frontend` diverged during the refactor.

3. **No auth-specific unit tests.** The callback route and middleware redirect
   logic have no test coverage. Open redirect and iss-claim checks are entirely
   unexercised.

---

## Severity Summary

| Finding ID | Repository / Area                | File                              | Category     | Severity    |
| ---------- | -------------------------------- | --------------------------------- | ------------ | ----------- |
| ADV-01     | cross-ecosystem (all 3 repos)    | `app/auth/callback/route.ts`      | Security     | 🔴 Critical |
| ADV-02     | cross-ecosystem (all 3 repos)    | `lib/supabase/config.ts`          | Security     | 🔴 Critical |
| ADV-03     | cross-ecosystem (all 3 repos)    | `app/auth/callback/route.ts`      | Security     | 🔴 Critical |
| ADV-04     | `preference-frontend`            | `providers/AuthProvider.tsx`      | Architectural Drift | 🟡 Medium |
| ADV-05     | cross-ecosystem (all 3 repos)    | `utils/supabase/middleware.ts`    | Security     | 🟠 High |
| ADV-06     | `planner-frontend`               | `app/layout.tsx`                  | Tech Debt    | 🟡 Medium |
| ADV-07     | `preference-frontend`            | `components/dashboard-header.tsx` | Architectural Drift | 🟡 Medium |
