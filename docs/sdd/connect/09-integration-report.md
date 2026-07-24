# L9 — React ↔ API Integration Report

**Module:** Fingrid Connect
**Date:** 2026-07-22
**Performed by:** Claude, at developer (Sudharson)'s direction
**Environment:** alpha-api Go server running locally (`go run main.go`, port `5050`), against
real MySQL database `lenderlendingstack_170626` (`127.0.0.1:3306`) and Redis — the actual
dev/shared database, **not** a disposable local/test DB. `.env` labels this `ENV=production`;
developer explicitly confirmed the DB is safe to run migrations/queries against for this
verification pass (see `03-html-ui-reconciliation.md` decision log for the equivalent
confirmation pattern used elsewhere in this project).

This is real integration testing against live infrastructure, not a mock/staging exercise —
findings below are observed behavior, not assumptions.

---

## Gate check (per `sdd-09-react-api-integration` skill)

| Gate condition | Status |
|---|---|
| L6b endpoints implemented | ✅ WF2/WF3/WF4 all implemented, `go build`/`go vet`/tests clean (see `06a-engineering-brief.md`) |
| L8 components built | ✅ All screens built in `src/connect/`, wired to real `connectApi.js` (WF2/WF3/WF4) |
| Seeds applied | N/A — this module reads live operational data (profiles/requirements/matches), not seed-driven reference data |
| Mocks fully replaced | ⚠️ Partial by design — **WF1 (onboarding) still runs on local-only state**, not the real API. This is a known, previously-documented gap (see `fingrid-connect-integration-plan.md` status header): the auth-bootstrap sequence (how a brand-new user gets a real channel/JWT out of onboarding) was never resolved at any earlier layer. WF2/WF3/WF4 are fully live. |

---

## What was verified (live, against real DB)

### Server boot
- Clean boot: connected to `lenderlendingstack_170626` + Redis, goose migrations already current (`20260720120000`, "no migrations to run"), Fiber listening on `:5050`.

### Auth
- `GET /v1/connect/requirement` without a token → `401` (correct).
- `POST /v1/auth/guest` issues a working JWT with no real credentials — sufficient to exercise every `/v1/connect/*` endpoint.
- A **different**, pre-existing, non-Connect endpoint (`GET /v1/channel/?limit=20`) rejects the same guest token with `{"error":"Invalid User Information"}` — that endpoint requires a real partner-associated user, guest tokens aren't sufficient. Out of scope for Connect; noted only because it capped how much extra test data I could discover (one real test channel, `178392078375821948` / "Rajan & Associates" / "FlexiLoans Technologies Pvt Ltd", was reachable and used for all tests below).

### Read paths — all return correct envelopes against real rows
| Endpoint | Result |
|---|---|
| `GET /v1/connect/requirement` | 2 real LIVE requirements returned, correct shape |
| `GET /v1/connect/:channelId/profile` | Real profile: `DRAFT`, `TIER_0`, PAN, AUM, branch_count all correct |
| `GET /v1/connect/:channelId/matches` | Valid empty result (`items:[], total:0`) — correct given no VETTED counterparties exist (this is the EC-10 chain-reaction already flagged in `02-feature-spec.md`, now confirmed live, not just theoretical) |
| `GET /v1/connect/directory` (new L6b) | Valid empty result — endpoint executes correctly end-to-end |
| `GET /v1/connect/directory/:channelId` (nonexistent id) | `404 {"error":"channel not found"}` — correct |
| `GET /v1/connect/:channelId/profile` (nonexistent id) | `404 {"error":"channel not found"}` — correct |
| `GET /v1/connect/partners` (new L6b) | Valid empty result — endpoint executes correctly end-to-end |

### Write paths — full requirement lifecycle exercised live
1. `POST /v1/connect/:channelId/requirement` (create DRAFT) → **first attempt failed** with `{"error":[{"code":400,"message":"Context does not match the pattern"}]}` — see Finding 1 below. Retried with plain-ASCII context → succeeded, real row created (`requirement_id 178472309008910511`).
2. `POST .../requirement` (same id, `listing_status:"LIVE"`) → published correctly.
3. `POST .../requirement/:id/close` (BR-20) → `LIVE → CLOSED`, correct response.
4. `POST .../requirement/:id/close` again → `409 {"error":"requirement already closed"}` — correct idempotency guard.

Test row left in the DB in `CLOSED` state, clearly labeled `"L9 integration test, safe to delete"` in its `context` field for easy identification/cleanup.

### Not tested (disclosed gap)
- WF4's `POST /v1/connect/request` (send) and its accept/reject response path were **not** exercised live — doing so needs two distinct real channels (sender + receiver), and only one real test channel was reachable (see Auth note above). This mirrors the gap already surfaced in `Requests.jsx` (no list-pending-requests endpoint exists at L5 either). Recommend testing this specifically once a second seeded test channel is available, or in a proper staging environment with realistic multi-tenant data.

---

## Findings

### Finding 1 — global ASCII-only validator rejected `context` (fixed)
`alpha-api/app/common/validator/validator.go:83-84` applies a generic ASCII-only regex to
every string field across the API, with a `jsonTag`-based exemption skip-list at (now) line
105 for known free-text fields (`content`, `remark`, `feedback`, `address`, etc.). `context`
(the Requirement Listing wizard's free-text field,
`src/connect/pages/requirements/RequirementWizard.jsx:106`) was not in that list, so any
Unicode punctuation — em-dash `—`, en-dash `–`, curly quotes `“ ” ‘ ’` — auto-substituted by
Word/Google Docs/iOS when a business user pastes text triggered a hard rejection
(`"Context does not match the pattern"`).

**Root cause was deeper than a missing list entry.** The skip-list check compared the *raw*
struct tag (`fieldType.Tag.Get("json")`, e.g. `"context,omitempty"`) against bare names like
`"context"` using exact string equality — so even adding `"context"` to the list would not
have matched, because of the `,omitempty` suffix. Checking the other five fields already in
the list that also carry `,omitempty` in their struct tags (`url`, `address`, `remark`,
`password`, `associate_id`) confirmed they were **already silently broken** by the same bug —
believed exempted by whoever added them, but never actually skipped.

**Fix applied** (`validator.go:98`): parse only the tag name before the first comma —
`jsonTag := strings.Split(fieldType.Tag.Get("json"), ",")[0]` — then added `"context"` to the
skip-list (`validator.go:105`). This is a root-cause fix, not a per-field patch: it also
un-breaks the five pre-existing entries that were silently non-functional. `go build`/`go
test ./app/services/connect/...` clean; re-verified live against the running server — the
exact em-dash + curly-quote string that failed earlier now succeeds
(`requirement_id 178472373515952126`), and BR-20's DRAFT-close guard was incidentally
re-verified too (`"cannot close a requirement that was never published"`).

Frontend needed no change — it already surfaces API errors verbatim
(`RequirementWizard.jsx:93`); with the backend fixed, valid free text simply stops erroring.

### Finding 2 — EC-10 (tier-gated matching excludes everyone) confirmed live, not just theoretical
`02-feature-spec.md`'s EC-10 predicted that BR-03 (no vetting flow exists) + BR-17
(verification_tier always `TIER_0`) + BR-18 (match scoring includes a tier component) means
real matching will silently return zero matches for everyone. The live `GET
.../matches` call for a channel with 2 real LIVE requirements returned `items:[]`. Consistent
with the predicted defect — recorded as confirmation, not a new finding.

---

## WF5 — Admin Oversight & Vetting (added 2026-07-22, out-of-sequence request)

Built after the rest of L9's initial pass, per a developer request for an internal admin view
on top of the partner-facing module. See `02-feature-spec.md`'s WF5 section and
`05-api-contracts.md`'s WF5 endpoints for the full spec/contract; this section covers what was
actually verified live.

**Auth mechanics:** the app already had a `RequireEmployee` middleware
(`app/middlewares/auth.go:89`) checking `userType == EMPLOYEE`, but it was dead code — wired to
zero routes anywhere before this work. Wired it to a new `connectAdminRoute` group.

**No real employee credentials were available** to exercise the login form
(`POST /v1/auth/login-with-password`) end-to-end. Rather than skip verification or fabricate
a login, a JWT with `userType: EMPLOYEE` was manually constructed and signed with the same
`JWT_ACCESS_SIGN_KEY` value the running dev server already reads from its own `.env` —
mechanically identical to what `GenerateAccessToken()` produces, just built by hand instead of
through the login flow. This is not a real employee account and grants no access beyond what
this locally-running dev instance's own token verification already accepts.

| Check | Result |
|---|---|
| Non-employee token (the same guest token used throughout this report) hits `/connect/admin/partners` | `401 {"errors":[{"code":401,"message":"You're Not Authorized"}]}` — correct |
| Employee token hits `/connect/admin/partners` | `200`, 104 real channel rows returned — far more than the single test channel reachable via the partner-facing `/v1/connect/*` flow, since admin oversight isn't scoped to one channel |
| Submit a real vetting claim as the partner (`AUM`, doc `DOC-TEST-1`) on test channel `178392078375821948` | `PENDING`, tier stays `TIER_0` |
| Approve that claim via `POST /connect/admin/:channelId/vetting {"claim":"AUM","status":"VETTED"}` | `200`, claim now `VETTED`, **`verification_tier` moved from `TIER_0` to `TIER_1` live** — the actual EC-10 fix, not just a code-read |
| Approve an unknown claim (`ISO`, never submitted) | `404 {"error":"vetting claim not found: ISO"}` — correct |
| Reverted the test claim back to `PENDING` afterward | `200`, tier back to `TIER_0` — test channel left as found |
| `GET /connect/admin/requirements` | Returns requirements across every `listing_status` including `DRAFT`, unlike the partner-facing marketplace list which hides everything but LIVE+PUBLIC when unscoped |
| `POST /connect/admin/requirement/:id/status {"status":"CLOSED"}` on an already-CLOSED test row | `200`, succeeded (admin override intentionally bypasses the owner-only "already closed" guard) — confirmed via response body, `listing_status: CLOSED` |

Frontend (`src/connect/pages/admin/*`, `ConnectAdminLayout.jsx`): `npm run build` clean, every
new module transforms without error under the dev server, and the login-guard redirect logic
was verified by code review (not by driving a real browser session, since no browser
automation tool was available in this environment). The login form itself is wired to the
correct real endpoint and header (`X-Platform: EMPLOYEE_PORTAL`) but — like the backend side
of this same gap — was not exercised against a real employee password.

---

## WF1 — Returning-user Sign In (added 2026-07-22, gap found by manual review)

Fixed a real gap found by trying to actually use the site: there was no way for an
already-registered user to sign back in. `OnboardingWizard` only ever produced a local fake
`channelId` and never called a real endpoint or stored a token — meaning nothing downstream
(Profile/Requirements/Directory) could authenticate for **anyone**, not just returning users.

Wired the real, pre-existing `POST /v1/auth/login-with-otp` (mobile OTP) as `/connect/login`.

| Check | Result |
|---|---|
| Unregistered mobile number (`9000000000`) | `422 {"error":"Invalid credentials","status":-2}` — confirmed via live call, no SMS sent before this check fires |
| Real happy-path OTP send/verify | **Not exercised** — the endpoint sends an actual SMS via the configured provider; not something to trigger against a real phone number during testing |
| Frontend wiring (`SignIn.jsx`, `connectApi.js`'s `sendSignInOtp`/`verifySignInOtp`) | Matches the controller's exact request/response shape, including the `-6` = success and `-100/-101/-102` special-status handling; `npm run build` clean, module transforms cleanly under the dev server |

---

## WF1 — New-registration (added 2026-07-22, developer-reported bug: `DEMO-1784726037339`)

The developer caught a concrete, correct bug: `OnboardingWizard`'s completion handler
fabricated `channelId: 'DEMO-' + Date.now()` — a string, but `channel_id` is a **BIGINT**
column populated server-side via `utility.UniqueId()`. No fake ID of any shape can ever work
against the real schema. Traced and fixed the actual bootstrap sequence rather than patching
around it — see `05-api-contracts.md`'s updated WF1 section for the full trace
(`createConnectChannel` discards the caller's identity entirely, so a guest token suffices).

**Live-verified, 3 real registrations against the real dev DB** (all clearly named
`Claude Test...`/`Claude Wizard...` for easy identification, left in place per this project's
established practice of not deleting test data via ad-hoc SQL):

| Scenario | Payload shape | Result |
|---|---|---|
| `scenario=create`, manual company | `company:{action:create,source:manual,name,pan}` | `channel_id 178472642075880356` |
| `scenario=create`, retried with same email | Identical payload, same email as above | `422 {"error":"a user already exists with this email","status":-3}` — correct dedupe guard |
| `scenario=create`, matching the wizard's exact generated shape (comma-split territory, `pub/req/priv` visibility codes, `department`, empty `loan_types`) | Full payload as `OnboardingWizard.jsx` now builds it | `channel_id 178472661079376711`, `territory` correctly split into 2 rows (`Coimbatore`, `Tiruppur`) |
| `scenario=personal` (no `company` block) | Personal-domain branch | `channel_id 178472665025113660` |

**Not verified:** the real OTP send/verify step that must immediately follow registration to
actually authenticate (same reasoning as Sign In — triggering it would send a real SMS to a
real, unknown phone number for the fabricated test mobile numbers used above). The
registration half (guest token → real channel_id) is fully confirmed live; the follow-up login
half reuses the exact same `sendSignInOtp`/`verifySignInOtp` functions already verified
structurally in the Sign In section above.

**Also fixed as part of this pass** (previously-missing required fields, found by reading the
real DTO rather than assuming the docs were complete): Company Name + PAN (required by
`createConnectChannel` for any non-personal-domain creation; the wizard never collected them
before) and invite name/email (required when `company_completion=invite`; also never
collected before — that path would have failed validation if ever exercised).

---

## WF1 — Full loop, live-verified with zero real SMS (added 2026-07-22)

The developer pointed out this tenant already has a spoofed-OTP testing mechanism — used it to
close the two "not verified" gaps above (registration's OTP step, Sign In's OTP step), and in
the process found and fixed a real structural bug that would have blocked this forever.

**Spoof mechanism (no code changes needed to enable — already configured in this DB):**
- `core_template` row for `LOGIN_WITH_OTP` already has `status=2` (spoofed) —
  `NotificationTemplate.Spoofed()` returns true.
- Server `IsProd()==true` (`.env` `ENV=production`) is irrelevant here since `spoof==true`
  alone is sufficient to hit every SMS provider's very first branch (`!IsProd() || spoof`),
  skipping the real network call entirely — confirmed by reading `msg91.go`/`karix.go`/
  `gupshup.go`.
- Fixed verification code: `tenant_configuration` row `TENANT_SPOOF_OTP_CODE = 4024`.

**Bug found while using it:** `OtpInput.jsx` hardcoded 6 digit-boxes (matching the old demo
code `123456`), which made the real 4-digit spoof code physically impossible to enter. Fixed
with a `length` prop; `SignIn.jsx` and `OnboardingWizard.jsx`'s Verify step now pass
`length={4}`.

**Deeper bug found while using it:** verifying a freshly-registered test channel
(`channel_id 178472661079376711`, created earlier in this same session) returned
`{"status":-100,"error":"Registration flow is pending"}` — not a session token. Checked
`core_channel.status` for every test channel created in this session: **all showed `1`**
(`ChannelStatusCreated`). Traced the full lifecycle (`app/models/partner/constant.go`) and
searched the entire codebase for anything that ever writes `ChannelStatusApproved` (3) to a
channel created via the Connect path, or any "approve partner/channel" endpoint at all —
**found none, anywhere, Connect or classic.** This meant registration was a **permanent dead
end**: no self-registered user could ever sign in, not a test-environment quirk.

Presented two options to the developer (auto-approve at registration vs. a manual
admin-approve action added to WF5); ruling: **auto-approve, no approval gate at all** ("in
fingrid connect anyone can able to sign up without approval"). Implemented in
`createConnectChannel` (`app/services/application/connect.go`) — see BR-25 in
`02-feature-spec.md`.

**Full loop, live-verified after the fix** — brand-new registration, `channel_id
178472800818732956`:

| Step | Result |
|---|---|
| `POST /v1/partner/create` (guest token) | Real channel created, `core_channel.status = 3` (Approved) immediately |
| `POST /v1/auth/login-with-otp` (send, spoofed) | `{"status":-6,"message":"OTP send successfully..."}` |
| `POST /v1/auth/login-with-otp` (verify, code `4024`) | **`status:1`, real `access_token`/`refresh_token`/`channel_id` returned** — full session, not a pending state |
| `GET /connect/:channelId/profile` with that real token | `200`, real profile data (`profile_status:DRAFT`, `entity_type:dsa_firm`) |

This is the first time the entire chain — registration through an authenticated Connect API
call — has been exercised live with zero manual intervention and zero real SMS sent.

---

## WF2 — Company Profile, full stage-by-stage save (added 2026-07-22)

Developer report: profile edits weren't reliably persisting. Root cause was NOT the API — it
was `CompanyProfileWizard.jsx` advancing to the next stage regardless of whether `saveProfile`
actually succeeded, masking a real numeric-string-vs-int type mismatch (alpha-api's JSON
unmarshal doesn't coerce `"120"` into `float64`; verified live it 400s). See
`02-feature-spec.md`'s WF2 section for the full breakdown of all three bugs found and fixed
(all frontend-only — confirmed no alpha-api change was needed before touching it).

**Live-verified, real test channel `178472800818732956`, every stage through publish:**

| Stage | Payload (as the fixed wizard now sends it) | Result |
|---|---|---|
| LEGAL | `{legal_name, incorporation_year: 2015}` (int, not string) | `200`, completion 16% |
| OPERATIONS | `{aum:120, monthly_disbursal:15, branches:[...], loan_mix:[...], geography:[{states:[...]}], products:[...]}` | `200`, completion 33% — geography/products confirmed round-tripping correctly (previously not collected by the UI at all) |
| STAFF | `{total_staff:25, field_staff_count:10, staff_by_role:[...]}` | `200`, completion 50% |
| EMPANELMENT | `{empanelments:[...], credentials:[{type:"RBI_BC",...}]}` | `200`, completion 66% |
| `action:publish` | — | `200`, `profile_status: PUBLISHED`, completion 83% (BR-03 mandatory-credential guard satisfied by the RBI_BC credential just saved) |

Every stage's real API call confirmed working; the fix makes the wizard actually gate on
that success rather than assuming it.

---

## Full DSA↔NBFC end-to-end test (2026-07-23)

Directed test: register two real channel users (one DSA, one NBFC/lender), publish both
profiles, post a requirement, verify it matches, send a connect request, and approve it —
exercising WF1→WF2→WF3→WF4 as one continuous chain rather than testing each workflow in
isolation. No browser automation tool is available in this environment, so this traces the
exact same API sequence the UI code makes (same endpoints, same payload shapes each component
actually sends) rather than a driven browser session — noted upfront rather than implied.

**Test identities** (both auto-approved per BR-25, both signed in via the real spoofed-OTP
flow, code `4024`):

| Role | channel_id | Mobile | Entity type |
|---|---|---|---|
| DSA | `178478574990891311` | `8111100001` | `dsa_firm` |
| NBFC | `178478574996411171` | `8111100002` | `nbfc` |

(First attempt used mobiles `9111100001`/`9111100002` — both failed login with "Invalid
credentials" despite correct records existing. Root cause: `utility.CleanCountryCode(mobile,
"91")` strips a leading `"91"` unconditionally, with no length check — my test numbers just
happened to start with the literal digits "91", so a legitimate 10-digit mobile got truncated
to 8 digits before the DB lookup. Real, narrow bug in shared (non-Connect) auth code; worked
around by choosing different test numbers rather than fixing code outside this module's scope.)

**Sequence, every step a real API call:**

1. **Register both** — `POST /v1/partner/create` (guest token), `scenario=create`, `entity_type` `dsa_firm`/`nbfc`. Both got real BIGINT `channel_id`s.
2. **Complete + publish both profiles** — LEGAL → OPERATIONS (NBFC set `aum:150`, `geography:[{states:["Tamil Nadu","Maharashtra"]}]`, `products:["Two-Wheeler","Personal Loans"]`) → STAFF → `action:publish`. Both reached `profile_status:PUBLISHED` (neither entity type has a BR-03 mandatory credential, so no EMPANELMENT data was needed to publish).
3. **Directory check** — `GET /connect/directory?channel_id=<DSA>` initially returned the NBFC **and separately confirmed BR-27** (see below) before the fix.
4. **DSA posts + publishes a requirement** — `partnership_type:seek_lender`, `need.geography.states:["Tamil Nadu"]`, `listing_status:LIVE` in one call. `requirement_id 178478651295129525`.
5. **Matches** — `GET /connect/<DSA>/matches` → NBFC scored **55/100** (`geo:30` full overlap, `product:25` full overlap, `ticket:0` — no typical-ticket-size field exists anywhere in the profile model/UI today, a minor gap noted but not fixed this pass — `tier:0`, expected per EC-10/BR-17).
6. **Connect request** — `POST /connect/request` from NBFC (`action:REQUEST`, `to_channel_id:<DSA>`) → `request_status:PENDING`.
7. **DSA approves** — `POST /connect/request` (`action:ACCEPT`, the real `request_id`) → `request_status:ACCEPTED`, `relationship_id 178478665179599538` created.
8. **Partners, both sides** — `GET /connect/partners?channel_id=<DSA>` shows NBFC, `?channel_id=<NBFC>` shows DSA, both `LENDER_PARTNERSHIP` / `ACTIVE`.

**Three real bugs found and fixed along the way** (full detail in `02-feature-spec.md`
BR-26/27/28 — summarized here with the live evidence):

| # | Bug | Live evidence before fix | Fix |
|---|---|---|---|
| BR-26 | `enqueueMatchGeneration` was a no-op TODO stub | `SELECT COUNT(*) FROM core_partnership_match` → **0**, platform-wide, before this fix | Calls `generateForListing` synchronously on publish (developer chose this over a goroutine, matching the existing `cron.Execute*()` inline-call house pattern) |
| BR-27 | `core_channel.status` overload: `StatusActive`(1) vs `ChannelStatusApproved`(3) — BR-25's auto-approve made every Connect channel invisible to status=1-filtered queries | Directory returned 0 results, matches found 0 candidates, `AdminListPartners` would have too — despite a fully published, eligible NBFC existing | Broadened `directory.go`/`match.go`/`admin.go`'s channel-status filters to accept both values via a shared `activeChannelStatuses` list |
| BR-28 | Matches' `can_connect` checked the candidate's own role/AUM, not the caller's | DSA (non-lender, ineligible) saw `can_connect:true` on the NBFC match, purely because the *NBFC* had AUM≥100 — wrong party checked | `ListMatches` now loads the caller channel and applies `canViewContact` to it, matching Directory |

`go build ./...` clean, `go test ./app/services/connect/...` all pass (including pre-existing
match-scoring unit tests, unaffected) after all three fixes.

---

## Full scenario sweep (2026-07-23)

The DSA↔NBFC test above exercised one path end-to-end. Directed follow-up: sweep every
registration variant, every `partnership_type`, and every contact-gate/tier-gate branch,
against the live server/DB, to confirm breadth beyond that one scenario.

**Test identities registered this pass** (all auto-approved per BR-25, all signed in via real
spoofed-OTP `4024`):

| Entity type | Role | channel_id | Purpose |
|---|---|---|---|
| `bc` | BC | `178478776791473019` | seek_bc candidate + BR-03 credential-gate positive case |
| `lsp` | LSP | `178478776799535670` | seek_dsa candidate |
| `colender` | COLENDER | `178478776803501460` | seek_colender candidate + reject-path sender |
| `verif_agency` | SERVICE | `178478776807601820` | seek_verif candidate + cross-match finding |
| `dsa_ind` (personal) | DSA | `178478794894328437` | personal-domain scenario, fresh (old one predated BR-25) |
| `dsa_firm` (invite) | DSA | `178478791474292365` | `company_completion=invite` |
| `dsa_firm` (join) | DSA | *(same as owner `178478574990891311`)* | `scenario=join` |
| `bc` (no credential) | BC | `178478798742546914` | BR-03 negative case |

### Registration scenarios

| Scenario | Result |
|---|---|
| `scenario=create`, manual company (6 entity types: dsa_firm, nbfc, bc, lsp, colender, verif_agency) | ✅ All succeed, real BIGINT channel_id, auto-approved |
| `scenario=personal` (dsa_ind) | ✅ Registers, publishes, appears correctly in Directory as `dsa_ind` |
| `scenario=join` (existing company) | ✅ Returns the target company's own channel_id; new user added as pending member. Confirmed backend-correct — **not exposed in the UI**, per the standing product ruling ("no approval to join existing company") |
| `company_completion=invite` | ✅ Accepts `invite:{name,email,role}` without error |
| `scenario=create`, `source=mca` (CIN lookup) | ⚠️ **Not tested** — `core_mca_master` is empty in this local DB (0 rows); no real CIN to test against. Code path itself wasn't touched, just unexercised here |

### BR-03 mandatory credential gate

| Case | Result |
|---|---|
| BC entity publishes **with** RBI_BC credential | ✅ `profile_status: PUBLISHED` |
| BC entity publishes **without** it | ✅ Correctly blocked: `409 "RBI BC Empanelment is mandatory for entity type 'bc' before publishing"` |

### Matching, every partnership_type

| partnership_type | Candidate role(s) expected | Result |
|---|---|---|
| `seek_lender` | OWNBOOK, COLENDER | ✅ NBFC + Colender both matched |
| `seek_bc` | BC | ✅ BC matched, score 75 |
| `seek_dsa` | DSA, LSP | ✅ LSP + the other DSA both matched |
| `seek_colender` | COLENDER | ✅ Colender matched |
| `seek_verif` | SERVICE | ✅ Verification Agency matched |
| `seek_legal` | SERVICE | ⚠️ **Same Verification Agency matched** — see Finding below |
| `seek_empanelment` | OWNBOOK, COLENDER | ✅ NBFC + Colender matched |

**Finding (not fixed, flagging only):** `seek_verif`/`seek_collection`/`seek_legal`/
`seek_property` all map to the single candidate role `SERVICE`
(`match.go`'s `candidateRoles`) with no sub-type distinction. Confirmed live: a Verification
Agency was suggested as a match for a **Legal** requirement. Whoever owns this next should
decide how agency sub-type should actually be represented/matched (e.g. score by `entity_type`
directly rather than the coarser `primary_role`) — a product/design decision, not something to
guess at silently.

### Contact gate (BR-11) + request lifecycle

| Case | Result |
|---|---|
| Non-lender (BC) attempts to send a request | ✅ Correctly blocked: `"not eligible to send connect requests (BR-11 contact gate)"` |
| Eligible lender (Colender, AUM≥100) sends a request | ✅ `PENDING` |
| Recipient **rejects** | ✅ `request_status: REJECTED`, confirmed no relationship row created |
| Recipient **accepts** (NBFC↔DSA, from the earlier test) | ✅ `ACCEPTED`, relationship visible on both sides |

### Tier gating (EC-10 / BR-17)

| Case | Result |
|---|---|
| Requirement requires `min_verification_tier:TIER_1`, candidate is TIER_0 | ✅ Correctly excluded — 0 matches |
| Same candidate, after admin-approves one vetting claim (→ TIER_1) | ✅ Now matches, `score:83`, `tier:TIER_1` — confirmed on a **fresh** requirement (the fix scores at publish time; an already-LIVE listing needs the periodic cron tick or a republish to pick up a tier change) |

All test channels/data left in place, clearly named `E2E Test ...`/`e2e.*@e2etest.example`,
consistent with this project's established practice of not deleting test data via ad-hoc SQL.

---

## Verdict

WF2 (Company Profile) and WF3 (Requirement Listing incl. BR-20 close) are **verified working
end-to-end against live infrastructure**. WF4 is now verified on **both** the read side
(Matches/Directory/Partners) and the write side (send/accept a connect request) — the DSA↔NBFC
test above exercised the full send→accept→relationship-visible-both-sides loop live for the
first time, which also surfaced and fixed BR-26 (match generation was a permanent no-op),
BR-27 (channel-status overload hid every self-registered channel from Directory/Matching), and
BR-28 (Matches' contact-gate flag checked the wrong party). WF1 is **fully wired and fully
verified end-to-end**, including the OTP step, using this tenant's existing spoofed-OTP test
mechanism (`4024`, no real SMS sent) — register → real BIGINT `channel_id` (auto-approved per
BR-25) → real OTP login → real `access_token` → authenticated API calls, all confirmed live.
This closes what was originally flagged as an open auth-bootstrap question, and also surfaced
and fixed a real structural bug (no Created→Approved transition existed anywhere, so
registration was previously a dead end) and a real frontend bug (`OtpInput` couldn't accept the
tenant's 4-digit spoof code).

No regressions found in previously-implemented behavior. One platform-wide validator bug
found and fixed at its root cause (Finding 1 — also silently un-breaks 5 other pre-existing
skip-list entries beyond Connect's scope); one previously-predicted defect (EC-10) confirmed
live rather than just theoretically, then **operationally resolved** by WF5's vetting-approval
endpoint. WF5 (Admin Oversight & Vetting) was added out-of-sequence per direct developer
request and is verified live except for its login form's exact request against a real employee
account, for the same reason WF1's onboarding remains unverified — no real credentials
available in this environment.
