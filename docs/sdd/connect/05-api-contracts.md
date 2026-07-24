# API Contracts — Fingrid Connect

**Module:** Fingrid Connect
**Base Path:** `/v1/connect` (WF2/WF3/WF4) + `/v1/connect/admin` (WF5, employee-only) + `/v1/partner` (WF1, pre-existing, extended)
**Developer:** Sudharson (Tech Lead) — see `00-inputs.md` §0.8
**Status:** **Active** — WF1/WF2/WF3/WF4/WF5 all implemented in code as of 2026-07-22. WF2/WF3/
WF4 read-paths, WF2/WF3 write-paths, and all of WF5 **verified live against a real running
server/DB** on 2026-07-22 — see `09-integration-report.md`. WF4's partner-facing write-path
(send/accept/reject), WF5's employee login form specifically, and all of WF1 remain
unverified live (see that report for why in each case).
**Current Version:** 3.3 *(supersedes `alpha-api/docs/api-contract/fingrid-connect-wf2-wf3/contract.md`
— see Changelog)*

## Changelog
| Ver | Date | Author | CR Reference | Change |
|---|---|---|---|---|
| 1.0 | *(undated)* | Original author | — | `contract.md` — WF2/WF3 only, paths never actually implemented as written (see Convention Note) |
| 2.0 | 2026-07-22 | Claude (L5 backfill, verified against real handler/service/route code) | — | Full rewrite: corrected every endpoint path to match what's actually routed in `app/routes/v1.go`; added WF1 (never contracted before); resolved the 2 long-open gate items (approved, see below); corrected response envelope, pagination, and error shape to match real code, not the generic template |
| 2.1 | 2026-07-22 | Sreedhar (owner rulings, recorded by Claude) | — | WF4 endpoints confirmed wanted (real decision, not just consistency ruling); added proposed `POST .../requirement/:id/close` (BR-20) and the BR-19 system-side note; clarified BR-21 is satisfied by construction (one endpoint, no per-origin branch); owner names filled in |
| 3.0 | 2026-07-22 | Claude (L6b implementation) | — | WF4 + close-requirement + BR-19 actually built in `alpha-api` (`match.go`, `directory.go`, `partnership.go`, `requirement.go`, new controllers, routes registered). `go build`/`go vet`/existing test suite all clean. Corrected the docs to match what was actually built where it deviated from the proposal (channel_id param placement, relationship_type labels, directory `listings[]` not implemented). |
| 3.1 | 2026-07-22 | Sudharson (developer request) + Claude (implementation) | — | Added WF5 Admin Oversight & Vetting (4 new endpoints), requested out-of-sequence mid-implementation. Wired the previously-dead-code `RequireEmployee` middleware to a real route group for the first time. Live-verified all 4 endpoints including the EC-10 tier fix. |
| 3.2 | 2026-07-22 | Sudharson (gap flagged) + Claude (implementation) | — | Documented + wired real returning-user sign-in (`POST /v1/auth/login-with-otp`) as `/connect/login`. Previously no login path existed for anyone, new or returning — `OnboardingWizard` never stored a real token. |
| 3.3 | 2026-07-22 | Sudharson (bug: fake channel_id) + Claude (implementation) | — | Resolved the WF1 auth-bootstrap open item: guest token + `POST /v1/partner/create` works with no caller-identity check in `createConnectChannel`. Live-verified 3 real registrations. Response shape for the `connect` branch fully documented for the first time (previously only `channel_id` was confirmed). |

---

## ⚠️ Convention Note — real conventions diverge from both `sdd-05-api-contracts`'s generic template AND from `contract.md`'s own (never-built) design

Same pattern found at L4: this repo has its own established, consistent conventions that this
document follows as authoritative.

| Generic template / `contract.md` says | `alpha-api` actually does (verified in route/handler code) |
|---|---|
| Base path `/api/v1/[module]/` | `/v1/connect/...` — **no `/api` prefix**, and no separate `partner`/`partnership` split; WF2+WF3+WF4 all live under one `/connect` route group |
| `contract.md`: `GET/PUT /v1/partner/:channelId/profile`, `POST .../profile/publish`, `POST .../profile/vetting` (3 endpoints) | **1 endpoint**: `GET /v1/connect/:channelId/profile` + `POST /v1/connect/:channelId/profile` — `action` (`save`\|`publish`) and `stage` (incl. `VETTING`) fields on the single POST body drive all three behaviours. The separate `/publish` and `/vetting` routes were never built. |
| `contract.md`: `POST/PUT/GET /v1/partnership/listing[...]`, `/v1/partnership/directory`, `/v1/partnership/response` | **Renamed wholesale to `/v1/connect/...`**: `POST /v1/connect/:channelId/requirement`, `GET /v1/connect/requirement`, `GET /v1/connect/:channelId/requirement/:requirementId`. `contract.md`'s `/v1/partnership/*` namespace was never implemented under that name anywhere. |
| Response envelope `{data, meta}` | `{"status": 1, "data": ...}` success / `{"status": -1, "error": "<plain string>"}` error — verified in every controller. **No `meta` object** — pagination lives inside `data.pagination`. |
| Pagination `?page=1&per_page=20` | `?page=1&limit=20` (verified in `ListFilter`/`RequirementList`) — **`limit`, not `per_page`** |
| Error shape `{error: {code, message, field}}` | `{"status": -1, "error": "<plain string>"}` — **no `code` field, no `field` attribution, no separate `message`.** The `CONNECT` prefix is already reserved in `sdd-skills/05-api-contracts/references/error-code-registry.md`, but **no module ever assigned `CONNECT_XXX` codes** — every error is an ad-hoc string built in the service layer (`connectErr(status, msg)`). Proposed codes below are a recommendation, not documentation of something that exists. |
| IDs never exposed in list responses | IDs (`requirement_id`, `channel_id`) **are** returned as strings in both list and single-resource responses — verified in `RequirementResponse`/`ChannelSummary`. Deviation kept as-is since changing it now would break the one thing already live. |

---

## WF1 — User & Identity Onboarding *(Active, pre-existing — first time contracted)*

**Not a standalone route.** Delivered as a `connect` sub-object inside the pre-existing
`POST /v1/partner/create` endpoint (`app/services/application/connect.go`'s
`createConnectChannel`, triggered when `data.Connect != nil`). This predates the entire
WF2/WF3 build and was never documented anywhere before this pass.

**Auth bootstrap sequence — RESOLVED 2026-07-22.** `partnerCreateRoute` (and all of
`/v1/partner/*`) sits under `protectedV1` (`RequireLoggedIn` + `RequireModuleAccess`) in
`app/routes/v1.go` — a JWT is required to call the account-creation endpoint itself. Traced:
`createConnectChannel` (`app/services/application/connect.go:41`) takes a `UserDetails` param
but **discards it entirely** (`_ authService.UserDetails`) — no caller-identity check exists
anywhere in the create path. So a no-credentials **guest token**
(`POST /v1/auth/guest`) is sufficient. Verified live: a guest-token call to
`POST /v1/partner/create` with a `connect` sub-object returned a real BIGINT `channel_id`.
**The response does not include a session token** — `POST /v1/auth/login-with-otp` (below)
must run as a required follow-up step to actually authenticate as the newly created user.

---

### POST /v1/partner/create *(connect branch)*

**Description:** Creates or updates the user's identity + company link in one call, driven by
`scenario`. Existing behaviour, not proposed.
**Auth:** Bearer JWT (see bootstrap-sequence caveat above)

**Request Body** (`ConnectParams`, verified in `app/handler/partner/connect.go`):
```json
{
  "channel_user_id": "",
  "email": "ramesh@sundaramsourcing.com",
  "scenario": "create",
  "entity_type": "dsa_firm",
  "company": {
    "action": "create",
    "target_channel_id": "",
    "domain_mismatch": false,
    "source": "manual",
    "cin": "",
    "name": "Sundaram Sourcing Partners LLP",
    "pan": "ABCDE1234F"
  },
  "profile": {
    "first_name": "Ramesh",
    "last_name": "Kumar",
    "mobile": "98XXXXXXXX",
    "designation": "Business Head",
    "department": "",
    "territory": ["Coimbatore", "Tiruppur"],
    "loan_types": ["Two-Wheeler"],
    "linkedin": ""
  },
  "preferences": {
    "visibility": {"mobile": "req", "email": "pub", "linkedin": "pub", "territory": "pub"},
    "interests": ["Lender tie-ups"],
    "notify_email": true
  },
  "company_completion": "now",
  "invite": null
}
```

**Field Validations** (verified in `ConnectParams` struct tags):
| Field | Type | Required | Rules |
|---|---|---|---|
| `channel_user_id` | string | No (set only on update) | — |
| `email` | string | Yes | email format |
| `scenario` | string | Yes | `oneof=personal join create` — maps to BR-14's 3-way domain classification |
| `entity_type` | string | Yes | must resolve via `CHANNEL_ENTITY_TYPE` lookup |
| `company.action` | string | If `company` present | `oneof=join create` |
| `profile.first_name` / `last_name` / `mobile` | string | Yes | — |
| `company_completion` | string | Yes | `oneof=now later invite` |
| `invite.name` / `invite.email` | string | If `company_completion=invite` | email format on `invite.email` |

**Response:** **Legacy shape, unchanged for backward compatibility** (per `contract.md`'s own
correct note on this one point) — `{status, channel_id, result, message}`, not the
`{status, data}` envelope used everywhere else in this module. **Verified live 2026-07-22**
with 3 real registrations (see `09-integration-report.md`) — `channel_id` is a real BIGINT
string (e.g. `"178472661079376711"`), `result.application` carries the created channel's
fields (`name`, `entity_type`, `primary_role`, `dsa_code`, `public_slug`, etc.), and
`result.admin_channel_user` carries the created user/membership record. Duplicate-email retry
correctly returns `{"error":"a user already exists with this email","status":-3}`.

**Error Responses:** Ad-hoc strings via `connectErr` in `app/services/application/connect.go` —
not independently catalogued in this pass (out of this module's own service package, harder to
isolate from the broader `RegisterApplication` error surface).

### POST /v1/auth/login-with-otp — **Returning-user Sign In, IMPLEMENTED 2026-07-22**

**Description:** Real, pre-existing endpoint (not Connect-specific, not new) — mobile-OTP
login for any `UserTypeChannel` account. Wired into Connect's frontend as `/connect/login`
to fix a real gap: previously there was **no way for an already-registered user to sign back
in at all** — `OnboardingWizard` only ever produced a local fake identity and never called a
real endpoint or stored a token.
**Auth:** None (this is the login endpoint itself). Header `X-Platform: PARTNER_PORTAL`
resolves server-side to `UserTypeChannel` (`utility.ValidatePlatform`).

**Request — step 1, send OTP:**
```json
{"mobile": "98XXXXXXXX"}
```
**Response:** `{"status": -6, "message": "OTP send successfully to ..."}` — **`-6` here means
success**, not an error; the endpoint overloads `status` for this one case.

**Request — step 2, verify:**
```json
{"mobile": "98XXXXXXXX", "otp": "123456"}
```
**Response — Success 200:**
```json
{"status": 1, "data": {"user": {"channel_id": "178...", "access_token": "...", "refresh_token": "..."}}}
```
**Special account-state responses (all real, not generic errors):**
| `status` | Meaning | Client handling |
|---|---|---|
| `-100` | Registration flow still pending | Direct to `/connect/join` to finish it |
| `-101` | Pending Fingrid approval | Show waiting message; `channel_token` issued but not a full session |
| `-102` | Registration rejected | Show terminal message |
| `-2` | Invalid credentials (mobile not found, or wrong OTP) | Generic error |

**Verified:** an unregistered mobile number returns `422 {"error":"Invalid credentials","status":-2}`
immediately — confirmed no SMS is sent before that check. **Not verified end-to-end**: the
real happy path sends an actual SMS via the configured provider, so it wasn't exercised
against a real phone number in this pass.

---

## WF2 — Company Profile *(Active)*

### GET /v1/connect/:channelId/profile

**Description:** Assembles the full profile (fan-out across `connect_profile` JSON + `onb_*`).
**Auth:** `RequireLoggedIn` + `RequireModuleAccess` (verified: `protectedV1` group)

**Path Parameters:** `channelId` (integer, required)

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "channel_id": "1001",
    "entity_type": "dsa_firm",
    "primary_role": "DSA",
    "profile_status": "DRAFT",
    "verification_tier": "TIER_0",
    "legal": {"legal_name": "...", "pan": "...", "cin": "", "website": "", "registered_state": "", "incorporation_year": 2019},
    "operations": {"aum": 120, "monthly_disbursal": 8, "branch_count": 3, "geography": [], "products": [], "loan_mix": []},
    "staff": {"total_staff": 48, "field_staff_count": 32, "staff_by_role": []},
    "empanelments": [],
    "credentials": [{"type": "RBI_BC", "registration_no": "...", "document_id": "...", "vet_status": "PENDING"}],
    "capabilities": null,
    "vetting": [],
    "completion": {"percent": 33, "stages": [{"name": "Legal Identity", "done": true}, {"name": "Operations & Volume", "done": false}]}
  }
}
```
**Note:** `verification_tier` will show `TIER_0` for every channel today — see BR-17/EC-10 in
`02-feature-spec.md` v1.2 (no code path ever sets a claim to `VETTED`).

**Error Responses:**
| HTTP | Condition | Body |
|---|---|---|
| 401 | Missing/invalid JWT | *(handled by middleware, not this handler)* |
| 404 | `channel not found` | `{"status": -1, "error": "channel not found"}` |
| 500 | Unhandled | `{"status": -1, "error": "..."}` |

---

### POST /v1/connect/:channelId/profile

**Description:** Single endpoint for stage-save, publish, and vetting-submit — driven by
`action`/`stage`. **Merges into `connect_profile` JSON, never overwrites** (BR-01).
**Auth:** Same as above.

**Request Body** (`ProfileRequest`, all blocks optional except as noted):
```json
{
  "action": "save",
  "stage": "OPERATIONS",
  "legal": null,
  "operations": {"aum": 250, "monthly_disbursal": 18, "branches": [{"location": "Coimbatore", "address": ""}], "geography": [], "products": [], "loan_mix": []},
  "staff": null,
  "empanelments": null,
  "credentials": null,
  "capabilities": null,
  "vetting": null
}
```

**Publish call:**
```json
{ "action": "publish" }
```

**Vetting-submit call:**
```json
{ "stage": "VETTING", "vetting": [{"claim": "AUM", "document_id": "DOC-5001"}] }
```

**Field Validations:**
| Field | Type | Required | Rules |
|---|---|---|---|
| `action` | string | No | `oneof=save publish`, default implies `save` |
| `stage` | string | No | `oneof=LEGAL OPERATIONS STAFF EMPANELMENT CAPABILITIES VETTING` |
| `empanelments[]` / `credentials[]` / `vetting[]` | array | No | each element `dive`-validated; `credentials[].type` / `vetting[].claim` required within their objects |
| `vetting[].claim` | string | Yes, if `vetting` present | `oneof=AUM MONTHLY_DISBURSAL BRANCH_COUNT STAFF_COUNT REGULATORY_REGISTRATION EMPANELMENT ISO VAPT` |

**Response — Success 200:** Same shape as `GET`'s response (returns the freshly-saved profile).

**Error Responses:**
| HTTP | Condition | Body |
|---|---|---|
| 422 | Body fails validator (`dive` element invalid, bad enum) | `{"status": -1, "error": [...]}` |
| 400 | `invalid stored profile data` (existing JSON malformed — should not happen in practice) | `{"status": -1, "error": "invalid stored profile data"}` |
| 404 | `channel not found` | `{"status": -1, "error": "channel not found"}` |
| **409** | `action=publish` + BR-03 mandatory credential missing | `{"status": -1, "error": "<Credential Label> is mandatory for entity type '<entity_type>' before publishing"}` — e.g. `"RBI BC Empanelment is mandatory for entity type 'bc' before publishing"` |
| 500 | `failed to save profile: ...` | `{"status": -1, "error": "..."}` |

**Performance target:** p95 < 1s (fan-out reads/writes — carried from `contract.md`, not
independently re-measured).

---

## WF3 — Partnership Requirement Listing *(Active)*

### POST /v1/connect/:channelId/requirement

**Description:** Create (no `requirement_id`) or update (`requirement_id` present) a
requirement. `listing_status: "LIVE"` publishes and enqueues match generation (BR-06/BR-07).
**Auth:** Same as above.

**Request Body:**
```json
{
  "requirement_id": "",
  "partnership_type": "seek_dsa",
  "context": "Expanding to Tamil Nadu",
  "products": ["Two-Wheeler"],
  "need": {"geography": {"states": ["Tamil Nadu"], "districts": []}, "target_volume": "₹5 Cr/mo", "ticket_min": 50000, "ticket_max": 200000, "cases_per_month": 80, "expected_tat": "48 hours"},
  "criteria": {"min_verification_tier": "TIER_1", "min_aum": 50, "min_sourcing_capacity": null, "min_branches": null, "min_field_staff": null, "geography": {"states": []}, "certifications": []},
  "visibility": "PUBLIC",
  "listing_status": "DRAFT"
}
```

**Field Validations:**
| Field | Type | Required | Rules |
|---|---|---|---|
| `partnership_type` | string | Yes, on create | `oneof=seek_lender seek_dsa seek_bc seek_colender seek_verif seek_collection seek_legal seek_property seek_empanelment` (BR-05) |
| `criteria.min_verification_tier` | string | No | `oneof=TIER_0 TIER_1 TIER_2 TIER_3` — **see BR-18/EC-10: any value above TIER_0 currently excludes every candidate** |
| `visibility` | string | No | `oneof=PUBLIC INVITE PRIVATE` |
| `listing_status` | string | No | `oneof=DRAFT LIVE` — only `LIVE` triggers publish (BR-06/BR-07) |

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "requirement_id": "2006",
    "channel_id": "1001",
    "channel_user_id": "501",
    "partnership_type": "seek_dsa",
    "context": "Expanding to Tamil Nadu",
    "products": ["Two-Wheeler"],
    "need": {"...": "..."},
    "criteria": {"...": "..."},
    "visibility": "PUBLIC",
    "listing_status": "LIVE",
    "match_count": 0,
    "created_at": "2026-07-22T10:00:00+05:30",
    "updated_at": "2026-07-22T10:00:00+05:30"
  }
}
```
**Note:** `match_count` will read 0 immediately after publish — match generation is async
(BR-07); it only becomes non-zero after the next cron cycle.

**Error Responses:**
| HTTP | Condition |
|---|---|
| 404 | `requirement not found` (update with unknown `requirement_id`) |
| 403 | `requirement not owned by this channel` (BR-04) |
| 409 | `requirement already published` (BR-06 — re-publish attempt) |
| 422 | `partnership_type is required` (BR-05 — create without it) |
| 500 | `failed to save requirement: ...` |

---

### GET /v1/connect/:channelId/requirement/:requirementId

**Description:** Single-requirement read. Non-owner allowed only if `listing_status = LIVE` (BR-04a).
**Auth:** Same as above.

**Error Responses:** `403` (`requirement not owned by this channel`, when DRAFT + not owner), `404`.

---

### GET /v1/connect/requirement

**Description:** Paginated list — "my requirements" (filtered by `channel_id`) or public
LIVE listings depending on query params.
**Auth:** Same as above.

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `channel_id` | integer | — | Filter to one channel's requirements |
| `partnership_type` | string | — | Filter |
| `state` | string | — | Filter |
| `product` | string | — | Filter |
| `listing_status` | string | — | Filter |
| `page` | integer | 1 | **`page`, not `per_page`-paired — see `limit` below** |
| `limit` | integer | 20 | **Named `limit` in this codebase, not `per_page`** |

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "items": [ { "requirement_id": "2006", "...": "..." } ],
    "pagination": {"page": 1, "limit": 20, "total": 48}
  }
}
```

---

### POST /v1/connect/:channelId/requirement/:requirementId/close — **IMPLEMENTED 2026-07-22**

**Description:** Manual owner action closing a `LIVE` or `MATCHED` requirement (BR-20).
Separate endpoint, not folded into create-or-update, since `CLOSED` is a one-way terminal
action. **Built:** `CloseRequirement()` in `app/services/connect/requirement.go`,
`RequirementClose` controller, route registered in `routes/v1.go`.
**Auth:** Same as above.

**Response — Success 200:** Same shape as the requirement resource, with `listing_status: "CLOSED"`.

**Error Responses:**
| HTTP | Condition |
|---|---|
| 403 | `requirement not owned by this channel` (BR-04) |
| 409 | `requirement already closed` |
| 409 | `cannot close a requirement that was never published` (DRAFT — added during implementation, not in the original design) |

**Related — BR-19, IMPLEMENTED:** `generateForListing()` in `match.go` now updates
`listing_status = 'MATCHED'` (guarded `WHERE listing_status = 'LIVE'`, so it never fires twice
or reverses a manual `CLOSED`) whenever it writes ≥1 match row for that listing. No new
endpoint — purely a cron-side change.

---

## WF4 — Match & Partnership Response — **IMPLEMENTED 2026-07-22**

All 4 endpoints below are now built: service functions in `app/services/connect/` (`match.go`,
`directory.go`, `partnership.go`), controllers in `app/controllers/v1/connect/`, routes
registered in `routes/v1.go`. Verified: `go build ./...` and `go vet` clean, existing test
suite (`go test ./app/services/connect/...`) still passes, `gofmt` clean. **Not yet verified:**
against a real running server/DB — no integration/staging test was run in this pass.

**Design deviation from the original proposal, made during implementation:** these 4 endpoints
have no `channelId` path segment (unlike profile/requirement), so the acting channel is passed
explicitly — as a `channel_id` query param for `GET`s, and a `channel_id` body field for the
`POST`. This matches the pre-existing precedent already set by `GET /v1/connect/requirement`
(which takes `channel_id` as a query param, not derived from JWT) — consistency with what was
already shipped, not a new pattern invented for WF4.

### GET /v1/connect/:channelId/matches?requirement_id=...

**Description:** Reads cron-materialised matches (BR-08), grouped by requirement — never
computes inline. **Built:** `ListMatches()` in `match.go`, `MatchList` controller.
**Auth:** Same as above.

**Query Parameters:** `requirement_id` (optional — omit to get matches across all of the
channel's listings).

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "items": [
      {
        "requirement_id": "2006",
        "partnership_type": "seek_dsa",
        "matches": [
          {"match_id": "9001", "channel_id": "3002", "name": "Suresh DSA Co", "entity_type": "dsa_firm", "state": "Tamil Nadu", "aum": 0, "verification_tier": "TIER_0", "vetted": false, "score": 75, "breakdown": {"geo": 30, "product": 25, "ticket": 20, "tier": 0}, "match_status": "SUGGESTED", "can_connect": true, "generated_at": "2026-07-22T06:00:00+05:30"}
        ]
      }
    ],
    "pagination": {"page": 1, "limit": 1, "total": 1}
  }
}
```
**Note — EC-05 still unresolved:** `match_status` above will still read `SUGGESTED` forever —
this endpoint only *reads* the column; the cron's hard delete-and-recreate (EC-05) was not
touched by this implementation pass. BR-19 (listing-level `MATCHED`) and EC-05 (row-level
`match_status`) are two different columns on two different tables; fixing one does not fix
the other.

**Performance target:** p95 < 1s — indexed read (`idx_cpm_listing_score`), never recomputes.

---

### GET /v1/connect/directory?channel_id=...

**Description:** Browse published organisations, contact-gated by the caller's own channel.
**Built:** `ListDirectory()` in `directory.go`, `DirectoryList` controller.
**Auth:** Same as above.

**Query Parameters:** `channel_id` (caller, required), `q` (name search), `entity_type`,
`state`, `page`, `limit`.

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "items": [
      {"channel_id": "3001", "name": "Ramesh BC Partners", "entity_type": "bc", "primary_role": "BC", "state": "Maharashtra", "aum": 0, "staff": 580, "branches": 12, "verification_tier": "TIER_0", "vetted": false, "contact": null, "contact_locked_reason": "Contact visible only to lender-type channels with AUM >= Rs 100 Cr", "can_connect": false}
    ],
    "pagination": {"page": 1, "limit": 20, "total": 6}
  }
}
```
**Implementation note:** filtering by `profile_status = PUBLISHED` and by `q`/`state` happens
in application code after a DB fetch (matches the pre-existing pattern in
`publishedChannelsByRoles` in `match.go`), not via a JSON-path SQL `WHERE` — pagination is
therefore in-memory too. Fine at current scale; revisit if directory size grows (same flag
already raised in `04-db-schema.md`'s Index Strategy).
**`listings[]` (the org's live requirement types) was NOT implemented** — `DirectoryEntry`
has no code populating it; left as an empty field. Flagging rather than silently omitting from
this doc.

### GET /v1/connect/directory/:channelId?caller_channel_id=...

Single-record detail, same gate. **Built:** `GetDirectoryEntry()`, `DirectoryGet` controller.

---

### POST /v1/connect/request

**Description:** Send / accept / reject a connect request — `action` drives the branch
(BR-12/BR-13). **Built:** `SendRequest()`/`RespondToRequest()` in `partnership.go`,
`PartnershipRequest` controller (single route, branches on `action`).
**Auth:** Same as above.
**BR-21:** the BR-11 contact gate applies here regardless of screen of origin — one endpoint,
no per-origin branch to keep consistent, confirmed by construction.

**Request Body:**
```json
{ "channel_id": "1001", "action": "REQUEST", "to_channel_id": "1002", "requirement_id": "2006", "message": "Interested in a DSA tie-up." }
```

**Field Validations:**
| Field | Type | Required | Rules |
|---|---|---|---|
| `channel_id` | string | Yes | **Added during implementation** — the acting channel (sender for REQUEST, recipient for ACCEPT/REJECT); not in the original proposed shape |
| `action` | string | Yes | `oneof=REQUEST ACCEPT REJECT` |
| `to_channel_id` | string | If `action=REQUEST` | — |
| `request_id` | string | If `action=ACCEPT\|REJECT` | must reference a `PENDING` row (BR-13) |

**Response — Success 200:** `PartnershipResponseResp` — includes `relationship_id` once an
ACCEPT creates or reactivates a `core_channel_relationship` row.

**Error Responses:**
| HTTP | Condition |
|---|---|
| 403 | Caller fails BR-11 contact gate on a `REQUEST` |
| 403 | `request not addressed to this channel` (ACCEPT/REJECT by someone other than the recipient — added during implementation) |
| 404 | `request not found` |
| 409 | Duplicate `PENDING` request to same target (BR-12) — enforced in application code via `FindPending`; **still no DB unique constraint**, see `04-db-schema.md`'s gap note |
| 409 | `request is not PENDING` (BR-13) |
| 422 | `to_channel_id is required` / `request_id is required` |

---

### GET /v1/connect/partners?channel_id=...

**Description:** List established relationships (US-09), either side of the pairing.
**Built:** `ListPartners()` in `partnership.go`, `PartnerList` controller — reuses the
pre-existing `ChannelRelationship.FindByChannel()` model method, which **already** queries
`WHERE channel_a_id = ? OR channel_b_id = ?` correctly (the undirected-storage risk flagged in
`04-db-schema.md` is a real *performance* concern for large tables, not a correctness bug —
the query itself was already right).
**Auth:** Same as above.

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "items": [{"relationship_id": "501", "relationship_type": "LENDER_PARTNERSHIP", "relationship_status": "ACTIVE", "counterparty": {"channel_id": "1001", "name": "...", "...": "..."}, "connected_at": "2026-07-22T10:00:00+05:30"}],
    "pagination": {"page": 1, "limit": 1, "total": 1}
  }
}
```
**Note:** `relationship_type` values changed during implementation from the originally
documented `LENDER_DSA` (and other pairwise-specific labels) to a simpler
`LENDER_PARTNERSHIP` / `PARTNERSHIP` — a coarser, descriptive-only label derived from whether
either party is lender-type. Not used for any gating logic; revisit if finer-grained types are
ever needed.

**Known scaling note (carried from `04-db-schema.md`):** relationship rows are directional in
storage; the query backing this endpoint uses
`WHERE channel_a_id = ? OR channel_b_id = ?` (correct, already implemented), which cannot use
either single-column index as a covering scan. A performance concern at scale, not a
correctness issue — revisit if this table grows large.

---

## WF5 — Admin Oversight & Vetting — **IMPLEMENTED 2026-07-22**

**Out-of-sequence:** requested directly by the developer mid-implementation, not speced at
L1/L2 beforehand. See `02-feature-spec.md`'s WF5 section (BR-22/23/24) and
`09-integration-report.md` for the verification approach (manually-signed test JWT, since no
real employee credentials were available).

**Auth:** `middlewares.RequireEmployee` (checks `userType == EMPLOYEE`) on top of the standard
`RequireLoggedIn` + `RequireModuleAccess` already applied to every `/v1/connect/*` route.
`RequireEmployee` existed in the codebase before this work but was previously wired to zero
routes anywhere in the app — this is its first live use.

### GET /v1/connect/admin/partners?entity_type=&profile_status=&q=&page=&limit=

**Description:** Every partner channel, any `profile_status`, no BR-11 contact gate (internal
oversight, not the partner-facing directory). Doubles as the vetting queue via
`pending_vetting_count`.
**Built:** `AdminListPartners()` in `admin.go` (service), `AdminPartnerList` controller.

**Response — Success 200:**
```json
{
  "status": 1,
  "data": {
    "items": [{"channel_id": "178...", "name": "Rajan & Associates", "entity_type": "dsa_firm", "primary_role": "DSA", "profile_status": "DRAFT", "verification_tier": "TIER_0", "aum": 120, "pending_vetting_count": 0, "created_at": "2026-07-13 11:03:04"}],
    "pagination": {"page": 1, "limit": 20, "total": 104}
  }
}
```

### POST /v1/connect/admin/:channelId/vetting

**Description:** Approve (`VETTED`) or revert (`PENDING`) one submitted vetting claim by its
`claim` label. Recomputes `verification_tier` (BR-17) and persists. **This is the EC-10 fix.**
**Built:** `AdminSetVetting()` — reuses `setProfileTier()`/`decodeVetting()` from the existing
profile machinery rather than duplicating the tier logic.

**Request:**
```json
{"claim": "AUM", "status": "VETTED"}
```
**Response — Success 200:** the full `ProfileResponse` (same shape as `GET .../profile`), with
`vetting[].vet_status` and `verification_tier` updated.
**Errors:** `404` claim not found on this profile · `422` status not one of VETTED/PENDING.

**Verified live:** approving a real test channel's `AUM` claim moved `verification_tier` from
`TIER_0` to `TIER_1` immediately; reverted cleanly back to `TIER_0`/`PENDING` afterward.

### GET /v1/connect/admin/requirements?channel_id=&partnership_type=&listing_status=&page=&limit=

**Description:** Every requirement listing platform-wide, any `listing_status`/`visibility` —
unlike `GET /connect/requirement` (WF3), an empty `channel_id` here means "everyone," not
"public LIVE marketplace only."
**Built:** `AdminListRequirements()` — same query shape as `ListRequirements()` minus the
LIVE+PUBLIC restriction that applies when unscoped.

### POST /v1/connect/admin/requirement/:requirementId/status

**Description:** Force a listing to `DRAFT` (unpublish) or `CLOSED` regardless of ownership —
a moderation override on top of BR-20's owner-only Close.
**Built:** `AdminSetRequirementStatus()` — bypasses the "already closed"/"never published"
guards in `CloseRequirement()` since this is an explicit administrative action.

**Request:**
```json
{"status": "CLOSED", "reason": "optional, not yet surfaced anywhere"}
```
**Errors:** `422` status not one of DRAFT/CLOSED · `404` requirement not found.

---

## Error Code Catalogue

**Reality today:** no `CONNECT_XXX` codes exist anywhere in the code — every error is a plain
string via `connectErr(status, msg)`. The `CONNECT` prefix is pre-registered in
`sdd-skills/05-api-contracts/references/error-code-registry.md` but unused. Proposed
allocation below (**not implemented — a recommendation for whoever picks up hardening this
module**, consistent with how the rest of Fingrid catalogues errors):

| Proposed Code | HTTP | Message | Trigger | Status |
|---|---|---|---|---|
| `CONNECT_001` | 404 | Channel not found | `GetProfile`/`SaveProfile` | Would formalize existing behaviour |
| `CONNECT_002` | 404 | Requirement not found | `GetRequirement`/`CreateOrUpdateRequirement` | Would formalize existing behaviour |
| `CONNECT_003` | 403 | Requirement not owned by this channel | BR-04 | Would formalize existing behaviour |
| `CONNECT_004` | 409 | Requirement already published | BR-06 | Would formalize existing behaviour |
| `CONNECT_005` | 422 | partnership_type is required | BR-05 | Would formalize existing behaviour |
| `CONNECT_006` | 409 | Mandatory credential missing for entity type | BR-03 | Would formalize existing behaviour |
| `CONNECT_007` | 403 | Contact gate failed (AUM/entity-type) | BR-11 | **Behaviour implemented** (plain-string error, no code yet — same as every other row here) |
| `CONNECT_008` | 409 | Duplicate pending connect request | BR-12 | **Behaviour implemented** |
| `CONNECT_009` | 409 | Response is not PENDING | BR-13 | **Behaviour implemented** |
| `CONNECT_010` | 409 | Requirement already CLOSED | BR-20 | **Behaviour implemented** |

## Performance Targets

*(Carried from `contract.md`, not independently re-measured against a live environment in
this pass — flagged as inherited, not verified.)*

| Endpoint | Target |
|---|---|
| `GET/POST /v1/connect/:channelId/profile` | p95 < 1s |
| `POST /v1/connect/:channelId/requirement` | p95 < 1s |
| `GET /v1/connect/requirement` | p95 < 1s, paginated |
| `GET /v1/connect/:channelId/matches` *(proposed)* | p95 < 1s, indexed read only |
| `GET /v1/connect/directory` *(proposed)* | p95 < 1s, paginated + filtered, Redis-cache candidate |
| Match generation cron | Async — **not** an API SLA |

Concurrency: 1000+ users, 99.9% uptime, IST timestamps — carried from `contract.md`, unverified.

---

## Contract Approval Gate — checklist

- [x] Every implemented L3 UI screen maps to a real endpoint (WF1/WF2/WF3 all confirmed against actual route code)
- [x] Every request field maps to a DB column or documented JSON path (cross-checked against `04-db-schema.md` — the `branches`→`onb_location` correction from BR-02 carried through here too)
- [x] Every state transition has an endpoint + guard error (DRAFT→PUBLISHED 409, DRAFT→LIVE 409, response PENDING→ACCEPT/REJECT 409 proposed)
- [x] Error catalogue stated as reality (no codes exist) + proposed formalization, not conflated
- [x] Envelope corrected to real shape (`{status, data}`, not the generic `{data, meta}`)
- [x] Perf targets stated; flagged as inherited/unverified rather than freshly measured
- [x] **The two † system-need endpoints — CONFIRMED by product owner 2026-07-22** (see WF4 header note)
- [x] **Requirement lifecycle (MATCHED/CLOSED) — IMPLEMENTED 2026-07-22.** MATCHED is system-set (BR-19) in `generateForListing()`; CLOSED is a manual owner action via `POST .../requirement/:id/close` (BR-20).
- [ ] **Confirm the `core_channel.data` merge rule regression test exists** — not verified in this pass; `mergeConnectProfile` was read and confirmed correct by inspection, but no test execution was run
- [ ] **Approved by Developer + Tech Lead** — Sreedhar (Product) and Sudharson (Developer/Tech Lead) are now named as the owners (`00-inputs.md` §0.8); formal sign-off on this specific document is still pending
- [ ] **Staging/integration verification** — new WF4 code builds and unit-tests clean but has not been exercised against a real running server or database in this pass
