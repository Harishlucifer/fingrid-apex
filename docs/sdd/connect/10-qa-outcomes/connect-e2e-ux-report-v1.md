# End-to-End UX Test Report — Fingrid Connect

**Module:** Fingrid Connect (partner-facing app: Onboarding, Company Profile, Requirement
Listing, Directory, Matches, Requests, Partners)
**Test type:** Live end-to-end functional pass against the real backend, plus a code-level UX
review of the corresponding frontend screens
**Environment:** `alpha-api` on `:5050` (developer's own `go run main.go`, real MySQL DB
`lenderlendingstack_170626`), `fingrid-apex` dev server on `:5173`
**Testing method:** See "Method note" below — important caveat on what was and wasn't verified
**Date:** 2026-07-24
**Status:** Conditional pass — 2 critical backend bugs found, 1 business-rule question, 2
frontend UX gaps found and fixed during this pass

---

## Method note (read this first)

I don't have a browser-automation tool in this environment — I can't literally click through
the rendered UI myself. So this pass has two halves, and I'm keeping them clearly separated
rather than blending them into one "it works" claim:

1. **Live API testing** — real HTTP calls against the running `alpha-api`, using the *exact*
   request shapes `connectApi.js` sends, walking two brand-new test identities through the
   full lifecycle: registration → OTP verification → sign-in → company profile → requirement
   listing → directory browse → connect request → accept/reject/cancel → partners →
   session refresh/logout. This part is real, reproducible, and is where all the bugs below
   were found.
2. **Code review of the frontend** — reading every screen's component code to check loading
   states, error surfacing, disabled/busy states, and navigation, and cross-checking that
   against what the live API actually returns.

What this does **not** cover: actual rendered layout/visual issues, click-target sizing,
responsiveness, or anything only visible in a real browser. Everything below is either a
backend behavior (verified live) or a frontend logic gap (verified by reading the code against
live API responses).

Test data created this pass (left in the shared dev DB, per this project's established
practice — see `connect-qa-report-v1.md`'s convention note): channels named `E2E UX Co ...`,
emails `*@e2euxtest.example`.

---

## Executive summary

| Severity | Count | Where |
|---|---|---|
| Critical (backend, cross-module blast radius) | 2 | `alpha-api` core auth utilities |
| High (backend, Connect-scoped business rule — needs a product decision, not a fix) | 1 | `alpha-api` `SendRequest` |
| Medium (frontend UX gap) | 2 | Found and **fixed** during this pass |
| Informational | 1 | Completion-percentage semantics |

None of the critical/high findings were fixed — they're outside Connect's own module code (or
touch a business rule I'm not positioned to unilaterally decide) and are flagged for your call.
The two medium frontend gaps were fixed directly since they're unambiguous, same-pattern
extensions of a bug you already had me fix in `Directory.jsx` earlier this session.

---

## Critical findings (backend)

### C-1. `CleanCountryCode` corrupts any mobile number that happens to start with "91"

**File:** `alpha-api/app/common/utility/utility.go:676`

```go
func CleanCountryCode(inputString, countryCode string) string {
    if strings.HasPrefix(inputString, countryCode) {
        result := inputString[len(countryCode):]
        return result
    }
    ...
}
```

This strips the leading `"91"` from *any* string that starts with it, with no length check.
A perfectly valid 10-digit Indian mobile number like `9100011539` or `9187654321` gets
mangled into an 8-digit garbage string (`00011539`) before every mobile-based lookup —
because the function can't distinguish "a `+91`/`91`-prefixed 12-digit number" from "a normal
10-digit number that happens to start with 91."

**Live reproduction:** I registered two channels with otherwise-identical payloads — one
with mobile `9000011539` (works), one with `9100011539` (fails). Both landed correctly in
`core_user` (verified directly in MySQL: `user_type='CHANNEL', status=1`, correct mobile
string, no duplicates). `POST /alpha/v1/auth/login-with-otp` with just `{"mobile":
"9100011539"}` (the *send-OTP* step, before any OTP is even involved) returns
`{"status":-2,"error":"Invalid credentials"}` immediately. Re-registering the same identity
with mobile `7200812152` (doesn't start with 91) fixed it instantly with no other change.

**Impact:** this function is used in 10 places across the codebase (`app/services/application/
audience.go`, `partner.go`, `application.go`, `app/services/onboarding/person.go`,
`app/models/los/application.go`, `app/controllers/v1/onboarding/controller.go`, both v1 and v2
`auth/controller.go`) — not just Connect. Any real user whose mobile number starts with 91 is
silently and permanently unable to sign in via OTP anywhere in the platform. This is a
plain string-length bug, not a business decision — the fix is straightforward (only strip the
prefix if the remainder is a valid national-number length), but I didn't apply it myself
because the blast radius spans well outside the Connect module I've been asked to work in.

### C-2. Refresh tokens are issued with a `NotBefore` claim that makes them unusable until the access token has already expired

**File:** `alpha-api/app/services/auth/auth.go:143-179` (the token-generation function)

```go
expireTime := time.Now().Add(time.Minute * 30) // 30 minutes  — access token's own expiry
...
refreshClaims := AccessClaims{
    ...,
    jwt.RegisteredClaims{
        IssuedAt:  jwt.NewNumericDate(time.Now()),
        Issuer:    cfg.GetConfig().Tenant,
        NotBefore: jwt.NewNumericDate(expireTime),   // <- reuses the ACCESS token's expiry
        ExpiresAt: jwt.NewNumericDate(refreshExpireTime),
    },
}
```

The refresh token's `nbf` (not-before) claim is set to `expireTime` — the *access* token's own
30-minute expiry — instead of `time.Now()`. This looks like a copy-paste variable reuse. The
practical effect: a refresh token is not valid until the moment its paired access token
expires.

**Live reproduction:** immediately after a real sign-in (`POST /alpha/v1/auth/login-with-otp`
with a valid OTP), I called `POST /alpha/v1/auth/refresh` with the fresh `refresh_token` from
that same response. It returned `{"error":"invalid refresh token","status":-2}` every time —
verified with a brand-new login+refresh pair in a single isolated command to rule out any
stale-variable artifact.

**Why this matters despite "working" in the common case:** the refresh flow I built into
`fingrid-apex/src/connect/services/connectApi.js` only calls `/auth/refresh` *reactively*,
triggered by an actual `401` on some other call — and a `401` for a plain-expired token by
definition only happens after `expireTime` has passed, so `nbf` will already be satisfied by
then. In that narrow path, this bug is likely mostly dormant. But it completely breaks: any
proactive/silent refresh done shortly before expiry (a common pattern to avoid ever showing a
loading state on the user's next click), and it broke my own direct verification that the
refresh endpoint works at all. I'd treat "the refresh token doesn't actually work until the
access token is already dead" as a correctness bug regardless of whether the current reactive
usage happens to route around it — it defeats the basic purpose of having a refresh token.

I didn't fix this either — `app/services/auth/auth.go` is shared token-issuance code used by
every user type on the platform, not Connect-specific.

---

## High finding (business-rule question, not a code bug)

### H-1. Only lender-type channels with AUM ≥ ₹100 Cr can ever *send* a connect request

**File:** `alpha-api/app/services/connect/partnership.go:26-28`

```go
fromCp := channelProfileData(from)
if !canViewContact(from.PrimaryRole, floatOr(fromCp["aum"])) {
    return result, connectErr(403, "not eligible to send connect requests (BR-11 contact gate)")
}
```

`canViewContact` is the exact same helper used everywhere else in the codebase to decide "can
this caller see a listing's phone/email" (per its own doc comments in `directory.go`:
*"Contact visible only to lender-type channels with AUM >= Rs 100 Cr"*). `SendRequest` reuses
it as a blanket eligibility gate on the **sender**, not just a contact-visibility check.

**Live reproduction:** Company B (a freshly-registered DSA firm, `AUM=0`, non-lender role)
attempted `POST /connect/request` toward Company A (an NBFC). Response:
`{"error":"not eligible to send connect requests (BR-11 contact gate)","status":-1}`, HTTP
403. Meanwhile Company A → B worked fine (A is a ≥₹100 Cr lender).

**Net effect:** DSAs, BCs, LSPs, and all the servicing agencies — i.e. most of the entity
types this marketplace exists to onboard — can never proactively reach out to a lender they
want to work with. They can only wait to be discovered and contacted.

**I'm flagging this rather than fixing it** because I can't tell from the code alone whether
this is an intentional design choice (e.g. "only large lenders may initiate, to control
inbound volume") or a genuine misuse of a differently-scoped helper. Worth noting: I did
verify the frontend is at least **internally consistent** about it — both `Directory.jsx` and
`Matches.jsx` compute their "Connect"/"Restricted" button state from the same `can_connect`
field the backend returns (which reflects this exact same caller-side gate), so a DSA user
browsing Directory or Matches today would already see every button disabled as "Restricted" —
they wouldn't hit a raw, unexplained 403. But the underlying business rule itself — can a DSA
ever initiate contact with anyone? — is worth a direct decision from you rather than me
guessing at the "correct" fix.

---

## Medium findings — frontend UX gaps (fixed during this pass)

### M-1. `Matches.jsx` had the same "already partnered" / "duplicate pending request" gap `Directory.jsx` was fixed for earlier

Confirmed live: after Company A and Company B became ACTIVE partners, I called
`POST /connect/request` again from A → B. It succeeded (`200`, a brand-new `PENDING` request
row), even though the two channels already have an active relationship — the backend only
blocks a duplicate *pending* request, not a duplicate request against an already-partnered
channel (accepting it turned out harmless — `upsertRelationship` correctly deduplicated back
to the same `relationship_id` — but it left a redundant, confusing entry in both sides'
Requests history).

`Directory.jsx` already had a client-side fix for this exact pattern (cross-referencing
`GET /connect/partners`), but `Matches.jsx` — which is at least as likely a place to encounter
an already-partnered candidate, since match generation doesn't exclude existing partners
either — never got the same treatment. **Fixed**: `Matches.jsx` now loads `listPartners` and
`listRequests` the same way `Directory.jsx` does, and shows "🤝 Already Partners" (no button)
or "Requested" + disabled state instead of always offering "Connect".

### M-2. (Same session, already fixed prior to this pass) `Directory.jsx`'s already-partnered state

Re-verified live as part of this pass rather than re-explained — still correct. Not a new
finding, listed here only for completeness of the E2E trace.

---

## Informational

### I-1. Company Profile completion percentage can never reach 100% if Empanelments/Digital stay empty

Live-verified: both test companies published successfully with `Empanelments` fully empty
(no lender tie-ups, no credentials) — the backend correctly treats that stage as optional for
entity types with no `mandatoryCredential` (BR-03). But the `completion.percent` field returned
alongside the profile stays capped below 100 (66% in both my tests: 4 of 6 stages marked
`done`) even after a successful publish, because the `Empanelments`/`Digital` stages are marked
`done: false` when genuinely empty rather than "not applicable." `CompanyProfileWizard.jsx`'s
Verify stage shows this percentage directly to the user (`"{percent}% complete"`) right next to
the successful "PUBLISHED" state — a user could reasonably read "66% complete" next to
"✓ PUBLISHED" as a sign something is still missing, when nothing actually is. Not fixing this
since it's ambiguous whether "complete" should mean "all stages filled" or "all *required*
stages filled" — worth a product call, not a code bug.

---

## What passed cleanly (full live verification)

- **WF1 Onboarding**: guest-token bootstrap, `POST /partner/create`, identity OTP send/verify
  (`4024`, tenant-spoofed, not hardcoded), sign-in OTP send/verify, real `access_token` +
  `refresh_token` returned and usable.
- **WF2 Company Profile**: `GET` before any save returns a correct empty/draft shape; every
  stage save (`LEGAL`/`OPERATIONS`/`STAFF`/`EMPANELMENT`) persists and the `completion` object
  updates incrementally and correctly; publish works for a clean profile; **mandatory-credential
  gate (BR-03) correctly blocks publish** for a BC entity missing its `RBI_BC` credential
  (409, clear message naming the exact missing credential) and correctly allows it for entity
  types with none.
- **WF3 Requirement Listing**: draft create → publish to LIVE → synchronous match generation
  (BUG-002's earlier fix confirmed still correct — the publish response reflects the
  post-match `MATCHED` status immediately, not stale `LIVE`) → `GET`/list all consistent.
- **WF4 Directory/Matches/Requests/Partners**: Directory correctly shows only published
  profiles with contact gated by BR-11; duplicate-pending-request 409 confirmed
  (`"a pending request to this channel already exists"`); REQUEST → ACCEPT → relationship
  visible from both sides confirmed; REJECT confirmed; CANCEL confirmed, including the
  wrong-actor guard (a channel cannot cancel a request it didn't send — 403, `"request was not
  sent by this channel"`).
- **Session lifecycle**: a garbage/expired access token correctly 401s in the exact envelope
  shape (`{"errors":[{"code":401,...}]}`) the frontend's refresh-interceptor is built to catch;
  logout (`GET /alpha/v2/auth/logout`) works and returns `{"status":1}`.

## Not covered by this pass

- Actual rendered UI (see Method note) — visual layout, click targets, responsiveness.
- The email-verification-stub gap already disclosed in `02-feature-spec.md`
  (`Msg91`/`NetCore`/`Smtp` `.VerifyEmail` unconditionally return "verified").
- BUG-003 (concurrent double-publish race) and EC-11 (service-agency cross-matching), both
  already tracked as open/deferred in `connect-qa-report-v1.md`.
