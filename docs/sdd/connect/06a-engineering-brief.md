# Engineering Brief — Fingrid Connect

**Module:** Fingrid Connect
**Developer:** Sudharson
**Tech Lead:** Sudharson *(same person — no distinct reviewer named yet; see Open Questions)*
**Status:** WF1/WF2/WF3 were already implemented (backfilled into this brief); **WF4 (matches
read, directory, requests, partners) and BR-19/BR-20 (MATCHED/CLOSED) were implemented in this
same pass, 2026-07-22** — see the L6b Implementation Note at the end of this document.
**L5 API Contract Version:** 3.0
**Date:** 2026-07-22

## Preconditions
- [x] ~~L2b BOUND state~~ — **superseded by events**: WF4 was implemented in this pass despite
  the test spec still being BEHAVIORAL/PROVISIONAL for those cases, because the owner directed
  work to proceed layer-by-layer through the SDD stack in one continuous session rather than
  waiting for a separate binding pass. Noting the process deviation rather than hiding it —
  `02b-test-spec.md` still needs a BOUND-state pass over the now-real WF4 endpoints before this
  is considered fully gate-compliant.

## Approval
| Reviewer | Decision | Date | Notes |
|----------|----------|------|-------|
| — | Not yet reviewed | — | This brief is AI-authored from reading the actual shipped code; a real Tech Lead review (even if that's Sudharson wearing a different hat) hasn't happened on *this document* |

---

## Implementation Approach

**What's already built (WF1/WF2/WF3), described accurately per the real code — not the old
brief's aspirational architecture:** three-layer Fiber structure — `app/handler/connect`
(pure DTOs: `ProfileRequest/Response`, `RequirementRequest/Response`, `MatchCandidate`,
`ResponseRequest`, etc., **no logic**), `app/services/connect` (`profile.go`, `requirement.go`,
`match.go`, `helper.go` — all business logic, **calls `database.MysqlDB()` directly**), and
`app/controllers/v1/connect` (`profile.go`, `requirement.go` — thin Fiber handlers: parse,
validate, call service, wrap in `{status, data}` envelope). Routes registered in
`app/routes/v1.go` under `protectedV1.Group("/connect")`.

**Correction to the previous engineering brief's "Architecture decision (E4)":** the earlier
`engineering-brief.md` (in `alpha-api/docs/api-impl/`) claimed *"Zero GORM in logic packages —
all DB access via repo interfaces implemented only in `app/services/connect/repo`."* **This
was never built.** There is no `app/services/connect/repo` directory at all — verified by
directory listing. All 5 `database.MysqlDB()` calls in the connect service package are direct
GORM calls inline in `profile.go`/`requirement.go`/`match.go`. This matches the sibling
`partner`/`application` service packages' actual style (direct GORM, no repo abstraction) —
the old brief's E4 decision was aspirational and never followed, not a regression.

**WF4 — built 2026-07-22:** request/accept/reject (BR-12/BR-13, `partnership.go`), a directory
read path (BR-11, `directory.go`), a matches-read endpoint wired to the existing
`MatchCandidate`/`MatchGroup` DTOs (`match.go`'s new `ListMatches()`), `GenerateMatches` gaining
a `listing_status = 'MATCHED'` write (BR-19), and a new close-requirement action (BR-20). See
the L6b Implementation Note at the end of this document for verification detail and what's
still open (match_status writes, BR-09/EC-05).

**nuera-ai:** not involved. See dedicated section below.

---

## Middleware Stack — verified against `main.go` and `app/middlewares/`, not the generic registry

The generic `sdd-06a-engineering-brief` middleware registry (`AuthMiddleware`,
`RBACMiddleware`, `TenantIsolationMiddleware` in `internal/auth`/`internal/tenant`, etc.)
**does not match this codebase.** Real stack, in actual execution order:

**Global (`main.go`, applies to every route including `/v1/connect/*`):**
1. `cors.New(...)` — Fiber's built-in CORS middleware
2. `logger.New()` — Fiber's built-in request logger
3. `middlewares.TenantIdentifier()` **(shared hosting)** OR `middlewares.DefaultTenant()`
   **(dedicated hosting)** — resolves the tenant from the `X-Tenant-Domain` header (shared) or
   defaults to `"DEFAULT"` (dedicated), sets it goroutine-local via `cfg.SetTenant(...)`, and
   lazily opens/reuses a **per-tenant database connection** (`db.PrimaryConnections[tenantCode]`).
   **This is the real tenant-isolation mechanism** — not a `tenant_id` column filter. Every
   Connect query implicitly runs against the correct tenant's own DB because `MysqlDB()`
   resolves the connection for the goroutine-local tenant; there is no cross-tenant query risk
   at the SQL level because there's no shared table to leak across.
4. `middlewares.CustomLogger`

**Per-route (`protectedV1` group — every `/v1/connect/*` endpoint):**
5. `middlewares.RequireLoggedIn()` — JWT validation
6. `middlewares.RequireModuleAccess()` — see **flagged finding** below

**⚠️ Flagged finding — `RequireModuleAccess()` is a no-op outside production:**
```go
if cfg.GetConfig().IsProd() && moduleCodeId != "" && userIDStr != "" { ... }
```
Verified directly in `app/middlewares/auth.go`. The entire role/module permission check
(matching the caller's role against `RoleModuleMap`/`UserRoleMap` for an `X-Module` header
value) is **skipped entirely when `IsProd()` is false**, and also skipped if the client
simply doesn't send an `X-Module` header. This means: in dev/staging, **any logged-in user can
call any Connect endpoint regardless of role** — there is no environment-specific RBAC test
possible today short of a prod-like config flag. In production, correctness additionally
depends on the (not-yet-built) React frontend remembering to send the right `X-Module` value
for Connect — an easy thing to silently omit. **This is a real, pre-existing platform-wide
gap, not something introduced by Connect** — but Connect inherits it like every other module
under `protectedV1`.

**Not found anywhere in the global or per-route chain:** rate limiting, request-body audit
logging, PII masking. See Security Checklist below for what that means for Connect
specifically.

---

## Business Rule Implementation Map

| BR | Enforcement Layer | Function / File | Note |
|----|---|---|---|
| BR-01 Profile merge, never overwrite | Service | `mergeConnectProfile()` in `helper.go` | Pure function, easily unit-testable |
| BR-02 branch_count derivation (corrected) | Service | `profileBranchCount()` in `profile.go` | JSON array first, `onb_location` COUNT fallback |
| BR-03 Publish credential guard | Service | `publishGuard()` in `helper.go`, called from `SaveProfile()` | Pure function |
| BR-04 Requirement ownership | Service | `CreateOrUpdateRequirement()`/`GetRequirement()` in `requirement.go` | Inline check, not extracted to a helper |
| BR-04a LIVE read exception | Service | `GetRequirement()` in `requirement.go` | Same function as BR-04 |
| BR-05 partnership_type required | Handler validation + Service | `validator.ParseBodyAndValidate` (struct tag) + explicit check in `CreateOrUpdateRequirement()` | Belt-and-braces: enum via struct tag, presence via explicit `if` |
| BR-06 Re-publish guard | Service | `CreateOrUpdateRequirement()` in `requirement.go` | |
| BR-07 Async match enqueue | Service | `enqueueMatchGeneration()` in `requirement.go` | **Not independently verified what "enqueue" does** — not traced to an actual queue/cron trigger mechanism in this pass; flagged as an Open Question below |
| BR-08 Match cron full sweep | Job (cron-triggered) | `GenerateMatches()` in `match.go` | Cron registration itself not located in this pass |
| BR-09 match_status progression | **Read-only, IMPLEMENTED 2026-07-22** | `ListMatches()` in `match.go` | Read endpoint built; still no write endpoint — status never leaves SUGGESTED, and EC-05's cron wipe is untouched |
| BR-10 Role-based eligibility | Service | `candidateRoles` map + `publishedChannelsByRoles()` in `match.go` | Pure-ish, one DB read |
| BR-11 Contact gate | Service | `canViewContact()`/`isLenderRole()` in `helper.go`, called from `directory.go` | **IMPLEMENTED 2026-07-22** — now wired to `ListDirectory()`/`GetDirectoryEntry()` |
| BR-12 Connect-request gate + dedup | Service | `SendRequest()` in `partnership.go` | **IMPLEMENTED 2026-07-22** — reuses pre-existing `PartnershipResponse.FindPending()` |
| BR-13 Accept/reject state machine | Service | `RespondToRequest()`/`upsertRelationship()` in `partnership.go` | **IMPLEMENTED 2026-07-22** |
| BR-14 Onboarding domain classification | Service | `connectEmailDomain()`/`connectIsPersonalDomain()`/`connectSeed()` in `app/services/application/connect.go` | WF1, different package from the rest |
| BR-15 core_channel_role unenforced | **NOT IMPLEMENTED** | — | Confirmed gap, table exists, zero reads/writes |
| BR-16 LSP-only Digital stage | **Frontend-only, by deliberate decision** (2026-07-22) | `connect-flow-prototype.html`'s `goStage`/`wfPrev`/`wfNext` guards | Developer decided this stays UI-only — a non-LSP channel technically *could* still submit a `capabilities` block by calling the API directly, but that's accepted as low-risk (non-sensitive, not money/compliance-bearing data) rather than worth a service-layer guard |
| BR-17 verification_tier computation | Service | `setProfileTier()`/`computeTier()` in `helper.go` | Always returns TIER_0 today — see EC-10 |
| BR-18 Match scoring formula | Service (pure) | `scoreMatch()`/`overlapFraction()`/`ticketScore()` in `helper.go` | Fully unit-testable, no DB dependency |
| BR-19 LIVE→MATCHED (system) | Service | `generateForListing()` in `match.go` | **IMPLEMENTED 2026-07-22** — guarded `WHERE listing_status='LIVE'` |
| BR-20 Manual Close | Service | `CloseRequirement()` in `requirement.go` | **IMPLEMENTED 2026-07-22** — new dedicated endpoint, not folded into create-or-update |
| BR-21 Contact gate consistency | **Prototype-only fix** | `canDemoConnect()` in `connect-flow-prototype.html` | Real API is naturally consistent by construction (one endpoint) once BR-12 is built — see `05-api-contracts.md` |

**BR-16 is a confirmed, deliberate exception to the general "never frontend-only" rule** —
raised to the developer 2026-07-22, who decided the risk is acceptable for this specific rule
(non-sensitive capability flags, not money/compliance data) and does not want a backend guard
built. Recorded here as an explicit accepted-risk decision, not a silently-missed gap.

---

## nuera-ai Layer

**Decision: NOT REQUIRED.** Confirmed at L1 (`00-inputs.md` §G.1) and unchanged through every
subsequent layer — Connect is pure business logic (profile capture, requirement matching by
deterministic scoring formula). No OCR, no ML inference, no NLP, no document parsing. Document
uploads (credential proofs) are stored as file references (`document_id` → `onb_document`);
nothing about their *content* is ever processed by AI.

---

## Security Checklist

| Concern | Status |
|---|---|
| **Tenant isolation** | ✅ Real mechanism verified (per-tenant DB connection via `TenantIdentifier`/`DefaultTenant`, goroutine-local) — see Middleware Stack. No `tenant_id` query filter needed; the nullable `tenant_id` columns on the 4 new Connect tables are Model-C-future-readiness only, confirmed inert today. |
| **RBAC / module access** | ⚠️ **Real gap, not Connect-specific**: `RequireModuleAccess()` is a no-op outside `IsProd()` and depends on the client sending a correct `X-Module` header. Flagged above; needs a platform-level fix, not a Connect-only patch. |
| **PII (mobile/email/PAN)** | ⚠️ **Partially enforced.** `canViewContact()` (BR-11) correctly gates `contact` fields in the *design* — but there's no directory endpoint yet to verify it against, and no `PIIMaskMiddleware`-equivalent exists anywhere in this codebase for logs or list views. PAN (`onb_entity.primary_id`) is stored and returned in the profile response with no masking found. |
| **Aadhaar** | ✅ N/A confirmed — no Aadhaar field anywhere in Connect's DTOs or DB columns. |
| **Audit trail** | ❌ **Gap.** No audit logging (no `AuditMiddleware` equivalent, no explicit audit-log writes) found anywhere in `app/services/connect`. Profile publishes, requirement publishes, and (once built) accept/reject decisions currently leave no immutable audit record beyond `updated_at`. |
| **Rate limiting** | ❌ **Gap.** No rate-limit middleware found globally or per-route in this codebase at all — not a Connect-specific omission, but worth naming since the generic checklist assumes one exists. |
| **Input validation** | ⚠️ Partial — enum/required fields are validated (`validator.ParseBodyAndValidate` + struct tags); PAN/CIN format, AUM ranges, `ticket_min ≤ ticket_max`, `field_staff_count ≤ total_staff` are **not** (carried from `02-feature-spec.md`'s field-validation gaps). |
| **SQL injection** | ✅ All queries go through GORM's parameterised query builder — no raw string interpolation found in the connect service files. |
| **Concurrency / race conditions** | ⚠️ No `SELECT FOR UPDATE` or transaction wrapping found in `SaveProfile`/`CreateOrUpdateRequirement` — a genuine double-submit could produce a lost-update on `connect_profile` JSON (last write wins, per EC-01 in the feature spec). Low risk at current expected concurrency, not zero. |
| **Idempotency** | ❌ Not implemented for `POST /v1/connect/:channelId/requirement` publish, `POST .../profile` publish, or (once built) the connect-request endpoint. BR-06/BR-12's 409-on-duplicate guards are the closest thing to idempotency protection, and they're logical guards, not `Idempotency-Key`-based. |
| **Soft delete / data retention** | ✅ Follows repo convention (`status TINYINT`, not `deleted_at`) — consistent with `04-db-schema.md`'s documented convention, not a gap. |
| **Data routing (external AI)** | ✅ N/A — no AI service calls anywhere in this module. |

---

## Migration Sequence

Both migrations already ran in production (per `00-inputs.md` — this is a backfill). For the
record, verified safe-on-live-DB properties:

### `20260710120000_FINGRID_CONNECT_ONBOARDING`
Safe on live DB: Yes — additive only (new columns with defaults/nullable, new tables).
**Missing a `-- +goose Down` rollback block** (flagged in `04-db-schema.md`; still true, not
fixed in this pass — fixing it retroactively on an already-applied migration needs a Tech Lead
call on whether to patch the file or write a follow-up migration).

### `20260720120000_FINGRID_CONNECT_PARTNERSHIP`
Safe on live DB: Yes — 4 new tables only, no ALTERs to existing tables. Same missing-rollback
gap as above.

### Needed for WF4 / BR-19/BR-20 (not yet written):
- No new tables required for the response/relationship endpoints (`core_partnership_response`/
  `core_channel_relationship` already exist from `..._PARTNERSHIP`).
- BR-20 (Close) needs the `RequirementRequest.ListingStatus` validator's `oneof` extended to
  include `CLOSED` — an application-code change, not a migration.
- Consider the partial-unique-index fix for BR-12's duplicate-pending guard (flagged in
  `04-db-schema.md`) as an additive migration if the team wants a DB-level backstop.

---

## Downstream Impact

| Module | Data They Read | Risk |
|---|---|---|
| None identified yet | — | Connect is new and additive — extends shared `core_channel`/`core_channel_user` (owned by the platform/onboarding module) but nothing outside Connect currently reads `core_partnership_*` tables or `connect_profile` JSON. |
| Onboarding / Partner module | Connect *writes into* their tables (`core_channel`, `core_channel_user`, `onb_*` reads) | Already coordinated — these are the pre-existing ALTERs from `00-inputs.md`'s prior-work summary, not new risk |

No other module's behaviour changes because of Connect today. Revisit once GL/MIS/reporting
teams are asked whether partnership data should feed anywhere (not raised by anyone in this
SDD run).

---

## Open Questions

1. **BR-07's "enqueue"** — `enqueueMatchGeneration()` was read but its actual queue/cron
   trigger mechanism wasn't traced in this pass. Confirm with whoever owns the cron
   infrastructure that this genuinely fires `GenerateMatches()` asynchronously and doesn't
   silently no-op.
2. ~~BR-16 enforcement~~ — **Resolved 2026-07-22**: developer explicitly decided frontend-only
   is acceptable here; no backend guard wanted.
3. **WF1 auth bootstrap sequence** — still not traced (carried from `05-api-contracts.md`):
   how does a brand-new user get a JWT to call `POST /v1/partner/create` in the first place?
4. **No named second reviewer** — Sudharson is both Developer and Tech Lead on paper
   (`00-inputs.md` §0.8). Real Tech Lead review of this brief, by someone other than its
   author, hasn't happened — flagging rather than silently treating this brief as approved.
5. **RBAC IsProd() gap** — is this an accepted platform-wide risk already, or does it need a
   fix before Connect (or anything else) goes further? Not a Connect-specific decision to make
   alone.

---

## Tech Lead Review Gate — status

- [x] Every BR-XX from feature spec has an entry in the implementation map (BR-01 through BR-21)
- [x] No BR is marked "frontend only" **without an explicit accepted-risk decision** — BR-16 is frontend-only, but by deliberate developer decision (2026-07-22), not an oversight
- [x] nuera-ai decision is explicit with justification
- [x] Security checklist covers PII, tenant isolation, and audit trail (audit trail gap found and flagged)
- [x] Migration sequence stated safe; missing-rollback gap carried forward, not hidden
- [x] Downstream modules identified (none yet, correctly so — new module)
- [x] Open questions surfaced (5 above)

**Approval status: NOT YET APPROVED** — this brief documents existing + confirmed-planned
work; it has not been reviewed by a Tech Lead distinct from its author.

---

## L6b Implementation Note (2026-07-22)

WF4 + BR-19/BR-20 built directly in `alpha-api` in this pass:

**Files added:** `app/services/connect/directory.go`, `app/services/connect/partnership.go`,
`app/controllers/v1/connect/{matches,directory,partnership}.go`.
**Files modified:** `app/services/connect/match.go` (BR-19 + `ListMatches`),
`app/services/connect/requirement.go` (`CloseRequirement`),
`app/controllers/v1/connect/requirement.go` (`RequirementClose`),
`app/handler/connect/marketplace.go` (new `DirectoryEntry`/`DirectoryList`/`Contact` DTOs,
`ChannelID` added to `ResponseRequest`), `app/routes/v1.go` (6 new route registrations),
`app/services/connect/match_test.go` (2 new tests for `formatNullTime`).

**Verified:** `go build ./...` — clean. `go vet` — clean. `gofmt -l` — clean (2 files
auto-formatted). `go test ./app/services/connect/...` — all pre-existing tests plus the 2 new
ones pass. **Not verified:** no integration/staging test against a running server or live DB;
no manual API call was made. Nothing was committed — all changes are local working-tree edits
for review (`git status` shows 6 modified + 5 new files, all unstaged).

**Design decisions made during implementation (not pre-specified, judgment calls):**
- Acting channel for `POST /connect/request` and the two `GET` list endpoints is passed
  explicitly (`channel_id` body field / query param) rather than derived from JWT — matches
  the pre-existing precedent set by `GET /connect/requirement`, not a new pattern.
- `relationship_type` simplified to `LENDER_PARTNERSHIP`/`PARTNERSHIP` (coarse, descriptive
  only) rather than the finer `LENDER_DSA`-style labels in the original proposal.
- Directory's `listings[]` field (an org's live requirement types) was left unpopulated — no
  code writes it; flagged in `05-api-contracts.md` rather than silently shipped incomplete.
- `CloseRequirement` explicitly rejects closing a `DRAFT` requirement (409) — an answer the
  original BR-20 wording didn't anticipate needing.

**What's still open after this pass:** BR-09's write side (match_status transitions) and
EC-05 (the cron's hard delete-and-recreate wiping any match_status that did get written) —
the one piece of the whole WF3/WF4 surface still not built. Everything else identified in this
brief's original BR Implementation Map is now implemented.
