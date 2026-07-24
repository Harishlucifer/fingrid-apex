# Feature Spec — Fingrid Connect

**Module:** Fingrid Connect
**Spec Owner:** Sreedhar (Product) + Sudharson (Developer/Tech Lead)
**Status:** Draft
**Current Version:** 2.5

## Changelog
| Ver | Date | Author | CR Reference | Summary |
|-----|------|--------|--------------|---------|
| 2.5 | 2026-07-23 | Sudharson (request: real OTP, no demo code) + Claude (implementation) | — | Replaced OnboardingWizard's fake `123456` email/mobile check with the real `POST /v1/notification/otp` endpoint (template `OTP_PARTNER_REGISTRATION`, already spoofed, code `4024` — same mechanism Sign In already used). Removed all OTP hint text from the UI. Found + disclosed (not fixed, developer's choice) a pre-existing platform bug: email-OTP verification via MSG91/NetCore/Smtp providers always "verifies" any code — only Sendgrid is actually implemented. |
| 2.4 | 2026-07-23 | Sudharson (request) + Claude (implementation) | — | Added real client-side validation to all three wizards, gating both the "Next" button and the API call it triggers — previously the `required` badges were decorative. Covers required fields, PAN format (all 3 collection points), and two sanity checks the backend itself doesn't enforce (field_staff_count ≤ total_staff, ticket_min ≤ ticket_max). |
| 2.3 | 2026-07-23 | Sudharson (directed full sweep) + Claude (testing) | — | Full scenario sweep beyond the single DSA/NBFC test: all registration variants (create/personal/join/invite), BR-03 credential gate both directions, all 7 partnership_types, contact-gate accept/reject, tier-gate exclusion/inclusion. Found EC-11 (seek_verif/collection/legal/property all share one candidate role, no sub-type distinction) — flagged, not fixed, needs a product decision. Everything else confirmed working correctly. |
| 2.2 | 2026-07-23 | Sudharson (question: is the cron registered?) + Claude (implementation) | — | Found PARTNERSHIP_MATCH was missing from `core_cron_master` despite the standalone scheduler binary (`cron/main.go`) already having a working dispatch case for it. Registered it (`*/5 * * * *`, data-only change, matches the 3 existing rows' shape); confirmed the scheduler binary loads and schedules it cleanly. Complements BR-26's on-publish fix with periodic re-scoring. |
| 2.1 | 2026-07-23 | Sudharson (directed E2E test) + Claude (implementation) | — | Full DSA↔NBFC end-to-end test (register→profile→publish→match→request→approve) found and fixed 3 real backend bugs: BR-26 (match generation was a permanent no-op, 0 rows ever), BR-27 (core_channel.status overload made every self-registered channel invisible to Directory/Matching/Admin), BR-28 (Matches' can_connect checked the wrong party). All verified live end-to-end afterward. |
| 2.0 | 2026-07-22 | Sudharson (report: saves not persisting) + Claude (implementation) | — | Fixed WF2 end-to-end: `goNext()` was advancing regardless of save success, masking a numeric-string-vs-int type mismatch that made every stage with a number field silently fail. Also fixed one blank DynamicTable row blocking a whole stage's save, and added the previously-missing Geography/Products fields (feed BR-18 match scoring directly). All frontend-only; no alpha-api changes needed. Live-verified full stage-by-stage save through publish. |
| 1.9 | 2026-07-22 | Sudharson (ruling: no approval gate) + Claude (implementation) | — | Added BR-25: fixed a permanent structural dead end where no self-registered Connect user could ever sign in (no Created→Approved transition existed anywhere in the codebase). Auto-approve on registration, per explicit developer ruling. Live-verified the full register→login→authenticated-call loop for the first time, using the tenant's existing spoofed-OTP mechanism (no real SMS sent). Fixed an `OtpInput.jsx` bug (hardcoded 6 boxes vs. the real 4-digit spoof code). |
| 1.8 | 2026-07-22 | Sudharson (bug: fake channel_id) + Claude (implementation) | — | Fixed the harder half of WF1: new-registration completion now calls the real `POST /v1/partner/create` (guest token, no auth check in `createConnectChannel`) instead of fabricating a `DEMO-...` string. Added missing Company Name/PAN and invite fields to the wizard; mapped visibility codes correctly. Live-verified 3 real registrations across create/personal scenarios. |
| 1.7 | 2026-07-22 | Sudharson (gap flagged) + Claude (implementation) | — | Fixed: no way for a returning user to sign in — `OnboardingWizard` never stored a real token, so nothing downstream worked for anyone. Wired the real `POST /v1/auth/login-with-otp` as `/connect/login`. New-registration completion itself remains unwired (separate, harder problem). |
| 1.6 | 2026-07-22 | Sudharson (developer request) + Claude (implementation) | — | Added WF5 Admin Oversight & Vetting (BR-22/23/24), an out-of-sequence internal-staff view requested mid-implementation rather than speced beforehand. Resolves EC-10 operationally (vetting claims can now actually be approved). Updated the Vetting Claim state machine (PENDING↔VETTED now both reachable) and EC-10 with a RESOLVED note. |
| 1.0 | 2026-07-22 | Claude (backfill from code + `contract.md` + `engineering-brief.md`) | — | Initial spec, verified against actual `alpha-api` service code, not just the docs |
| 1.1 | 2026-07-22 | Claude (self-correction at L5) | — | Corrected BR-02: v1.0's "verified in code" claim was under-verified (function name grepped, body not read). Real behaviour documented; `contract.md`'s onb_location mapping claim also found wrong. |
| 1.2 | 2026-07-22 | Claude (L5 pass, reading full handler/helper code) | — | Corrected BR-03 credential codes/labels; resolved Vetting Claim state machine to the real 2-state (PENDING/VETTED) set, replacing an invented 3-state guess; added BR-17 (tier computation) and BR-18 (match scoring formula); added EC-10, a P1 chain-reaction bug found by connecting BR-03+BR-17+BR-18 (tier is always TIER_0, silently breaking tier-gated matching) |
| 1.3 | 2026-07-22 | Sreedhar (owner rulings, recorded by Claude) | — | BR-16 confirmed; resolved edit-after-publish (already works, no code needed); added BR-19/BR-20 (MATCHED/CLOSED requirement lifecycle, confirmed real, not yet implemented); added BR-21 (contact gate must apply consistently to Matches, not just Directory) |
| 1.4 | 2026-07-22 | Sudharson (developer decision, recorded by Claude) | — | BR-16 confirmed as a deliberate frontend-only exception to the "never frontend-only" enforcement rule — no backend guard wanted for this rule specifically |
| 1.5 | 2026-07-22 | Claude (L6b implementation) | — | BR-09 (partial), BR-11, BR-12, BR-13, BR-19, BR-20 implemented in `alpha-api` — WF4 is now built end-to-end except match_status writes (BR-09/EC-05 remain open). Updated all affected state machines and the WF4 workflow table accordingly. |

**Verification note:** rules below marked **(verified in code)** were checked directly against
`app/services/connect/{profile,requirement,match}.go`, not just `contract.md`/`engineering-brief.md`
— those two docs were found to have drifted from the shipped implementation (see `00-inputs.md`
§0.6). Rules marked **(per doc, unverified)** come only from the contract/brief and have not been
checked against a running code path (either the endpoint doesn't exist yet, or the behaviour
lives client-side in the not-yet-built React app).

---

## User Stories

US-01: As a **DSA / BC / LSP**, I want to onboard with just my work email and get OTP-verified
       in minutes, so that I can start using Connect without a lengthy signup.

US-02: As a **DSA / BC / LSP / Lender / Co-Lending NBFC / Verification Agency / Collection
       Agency / Legal Agency / Property Agency**, I want to build out my company profile in
       stages and save partial progress, so that I don't lose work if I can't finish in one
       sitting.

US-03: As any entity-type persona, I want the system to tell me exactly which credentials I'm
       missing before I try to publish my profile, so that I'm not surprised by a rejection.

US-04: As a **Lender**, I want to publish a sourcing requirement (geography, ticket size,
       counterparty criteria) and get ranked candidate matches automatically, so that I don't
       have to manually search for DSAs/BCs that fit.

US-05: As any persona, I want to browse a directory of published organisations and filter by
       type/state/product, so that I can find potential partners even without a specific
       requirement posted.

US-06: As a **Lender with AUM ≥ ₹100 Cr**, I want to see a counterparty's contact details in
       the directory, so that I can reach out directly.

US-07: As a smaller organisation (below the AUM gate), I want to still send a connect request
       even without seeing the other side's contact details, so that I'm not locked out of the
       marketplace entirely.

US-08: As the recipient of a connect request, I want to accept or reject it, so that a
       partnership only becomes active with my consent.

US-09: As any persona, I want to see my list of established partnerships, so that I know who
       I'm already connected to without re-checking requests.

US-10: As an **LSP**, I want an extra Digital Capabilities stage in my profile that other
       entity types don't see, so that I can showcase my API/app/bureau integration maturity
       specifically to lenders evaluating aggregators.

---

## Business Rules

BR-01 (verified in code): A company profile write (`ProfileService.Save`) **merges** the
       submitted stage's fields into the existing `connect_profile` JSON block — it never
       replaces the column wholesale. Fields omitted from the request retain their prior value.

~~BR-02 (verified in code): `branch_count` on a profile response is **always derived** as
       `COUNT(onb_location)` for the channel — it is never read from or written to a stored
       field.~~ **CORRECTED at L5 (2026-07-22)** — this was under-verified: I had grepped
       function names in `profile.go` but not read `profileBranchCount`'s actual body. Real
       behaviour: `branch_count` = `len(connect_profile.branches JSON array)` **when that
       array is non-empty**; only falls back to `COUNT(onb_location)` when the JSON array is
       empty (covering channels whose branch data predates Connect / came from the base
       onboarding flow). **`operations.branches[]` submitted through the Connect profile API
       is never written to `onb_location` at all** — it lives purely in `connect_profile.branches`
       JSON (confirmed: no `onb_location` write anywhere in `app/services/connect`). This also
       corrects `contract.md`'s own claim ("branches (C2) → onb_location") — that mapping was
       never actually implemented; `onb_location` is read-only, legacy-fallback data here.

BR-02 (superseding, corrected): `branch_count` = JSON array length of `connect_profile.branches`
       when present; else `COUNT(onb_location)` as a fallback for pre-Connect legacy data.
       New profile submissions never touch `onb_location` — branches live only in JSON.

BR-03 (verified in code): Profile publish is blocked with **HTTP 409** if the channel's
       entity-type-mandatory credential is not present among submitted credentials. Mandatory
       credential per entity type (exact codes, verified in `helper.go`'s `mandatoryCredentials`
       map — **corrected from v1.0's approximate labels**): `bc` → `RBI_BC` ("RBI BC
       Empanelment"); `collection_agency` → `RDAI` ("RDAI Registration"); `property_agency` →
       `IBBI` ("IBBI Registered Valuer Certificate"); `legal_agency` → `BAR_COUNCIL` ("Bar
       Council Enrollment"). Error message names the missing
       credential label and the entity type.

BR-04 (verified in code): A partnership requirement (listing) can only be created, updated, or
       read-for-edit by the **channel that owns it**. Any other channel attempting to
       create/update it gets **HTTP 403** ("requirement not owned by this channel"). Exception:
       any channel may **read** a requirement whose `listing_status = LIVE` regardless of
       ownership (BR-04a).

BR-04a (verified in code): `GET requirement/:id` allows read access to a non-owner **only**
       when `listing_status = LIVE`; a DRAFT requirement is 403 to non-owners.

BR-05 (verified in code): Creating a requirement without `partnership_type` returns **HTTP
       422** ("partnership_type is required"). Allowed values: `seek_lender | seek_dsa |
       seek_bc | seek_colender | seek_verif | seek_collection | seek_legal | seek_property |
       seek_empanelment`.

BR-06 (verified in code): Attempting to set `listing_status = LIVE` on a requirement that is
       **already** `LIVE` returns **HTTP 409** ("requirement already published"). There is no
       re-publish or un-publish action in the current implementation.

BR-07 (verified in code): Publishing a requirement (`listing_status: DRAFT → LIVE`) enqueues
       async match generation for that listing — the publish request itself never computes
       matches inline.

BR-08 (verified in code): Match generation (`GenerateMatches`, the `PARTNERSHIP_MATCH` cron) is
       a **full sweep**: it re-scores every `LIVE` listing against all `PUBLISHED`-profile
       candidate channels of the eligible role(s) for that listing's `partnership_type`, and
       **replaces all match rows** for each listing (hard delete + re-insert) every run. The
       top **10** candidates by score are kept per listing; the rest are discarded, not stored.

BR-09 (**partially implemented 2026-07-22 — still conflicts with BR-08, see EC-05**):
       `match_status` on a match row is meant to progress `SUGGESTED → VIEWED → CONTACTED` as
       the requirement owner interacts with a candidate, or move to `DISMISSED`. A **read**
       endpoint now exists (`GET /connect/:channelId/matches`, `ListMatches()` in `match.go`),
       but **no write path was built** — nothing transitions a match's status away from
       `SUGGESTED` yet, and EC-05's cron wipe is untouched. This rule still describes intent
       beyond current behaviour, just less of a gap than before.

BR-10 (verified in code): Candidate eligibility for a match is role-based on `primary_role`:
       `seek_lender`/`seek_empanelment` → `OWNBOOK`|`COLENDER`; `seek_dsa` → `DSA`|`LSP`;
       `seek_bc` → `BC`; `seek_colender` → `COLENDER`; `seek_verif`/`seek_collection`/
       `seek_legal`/`seek_property` → `SERVICE`. A channel is **never** matched against its
       own listing.

BR-11 (**IMPLEMENTED 2026-07-22**): Contact information (mobile, email) in a `DirectoryEntry`
       is populated **only** when the caller is a channel whose `primary_role` is lender-type
       (`OWNBOOK`|`COLENDER`) **and** `aum ≥ ₹100 Cr`. Otherwise `contact` is `null` with a
       `contact_locked_reason`, and `can_connect` reflects whether the gate passed. Built:
       `ListDirectory()`/`GetDirectoryEntry()` in `directory.go`, reusing the pre-existing pure
       `canViewContact()` from `helper.go`.

BR-12 (**IMPLEMENTED 2026-07-22**): A connect request (`POST /connect/request`, action=REQUEST)
       fails with **HTTP 403** if the caller fails the BR-11 contact gate, and **HTTP 409** if
       a `PENDING` request already exists from the same caller to the same target. Built:
       `SendRequest()` in `partnership.go`, reusing the pre-existing
       `PartnershipResponse.FindPending()` model method (which existed before this pass, unused).

BR-13 (**IMPLEMENTED 2026-07-22**): Accepting or rejecting a connect response (`POST
       /connect/request`, action=ACCEPT\|REJECT) is only valid when the response's current
       status is `PENDING` — acting on any other status returns **HTTP 409**. Accepting
       creates (or reactivates) a `core_channel_relationship` row between the two channels.
       Built: `RespondToRequest()`/`upsertRelationship()` in `partnership.go`.

BR-14 (per doc, unverified): An onboarding email is classified by domain into exactly one of
       three scenarios at signup: **personal** (matches the `PERSONAL_EMAIL_DOMAIN` lookup
       list — gmail.com, yahoo.com, hotmail.com, outlook.com, rediffmail.com, ymail.com,
       icloud.com, protonmail.com, live.com, msn.com), **domain-already-on-platform** (an
       existing channel already uses this domain), or **new-domain** (neither of the above).
       Each scenario branches the onboarding flow differently (personal → individual DSA path;
       on-platform → join-existing-company; new-domain → create-company-stub).

BR-15 (verified in code, table only — no enforcing service code found): The `core_channel_role`
       table models multi-role-per-channel with `role_status ∈ {ACTIVE, INACTIVE, PENDING}`,
       but **no service method reads or writes this table** in the current `app/services/connect`
       package — role assignment logic has not been built yet. Flagged, not a currently
       enforced rule.

BR-16 (**confirmed by product owner 2026-07-22; wording corrected**): The Digital Capabilities
       profile stage (C5) is shown **only** to channels with `entity_type = lsp`; every other
       entity type skips directly from **Empanelments & Credentials (C4) to Verify & Publish
       (C6)** — Staff & Capacity (C3) and Empanelments (C4) are never skipped for anyone.
       **Correction:** an earlier draft of this rule said the skip starts from "Staff &
       Capacity," which would have wrongly also skipped Empanelments — caught while
       implementing the skip logic in the prototype at this pass; the Workflow Definition
       table below (C4's Exit column) had it right all along. Implemented in the prototype at
       this pass — see `03-html-ui-reconciliation.md`.

BR-17 (verified in code, new at L5): `verification_tier` is computed from the **count of
       VETTED claims** (`setProfileTier`/`computeTier` in `helper.go`), recomputed every time
       a `publish` action runs: 0 vetted → `TIER_0`; 1–2 → `TIER_1`; 3–4 → `TIER_2`; 5+ →
       `TIER_3`. Since no code path ever sets a claim to `VETTED` (BR/state-machine note
       above), **every channel's tier is `TIER_0` in the current system**, regardless of how
       many credentials were submitted.

BR-18 (verified in code, new at L5): Match score is a 100-point sum of 4 weighted components
       (`helper.go`'s `scoreMatch`): geography overlap × 30, product overlap × 25, ticket-size
       fit × 20 (all-or-nothing: full 20 if the candidate's typical ticket falls inside
       `[ticket_min, ticket_max]` or if the listing set neither bound; 0 otherwise), and
       `tierRank(candidate) × 25 / 3` (so `TIER_3` = full 25, `TIER_0` = 0). A candidate is
       excluded entirely (not just scored 0) if its tier is below `criteria.min_verification_tier`,
       or its AUM/field-staff/branches fall below the listing's stated minimums — these are
       hard eligibility gates, not scored components. **Given BR-17, every candidate is
       `TIER_0` today, so the tier component of every match score is currently always 0 and
       the `min_verification_tier` gate (if set above `TIER_0`) excludes every candidate.**

BR-19 (**IMPLEMENTED 2026-07-22**): A `LIVE` requirement auto-transitions to `MATCHED` **by
       the system** once the match cron (BR-08) produces at least one eligible candidate for
       it. Built: `generateForListing()` in `match.go`, guarded
       `WHERE listing_status = 'LIVE'` so it fires exactly once and never overwrites a manual
       `CLOSED`.

BR-20 (**IMPLEMENTED 2026-07-22**): The requirement owner can manually transition their own
       `LIVE` or `MATCHED` requirement to `CLOSED` via a dedicated action. Built:
       `POST /connect/:channelId/requirement/:requirementId/close`, `CloseRequirement()` in
       `requirement.go`. **Added during implementation, not in the original design:** closing a
       still-`DRAFT` (never-published) requirement is explicitly rejected (409) — the rule as
       written only anticipated `LIVE`/`MATCHED` as valid starting states, but the code needed
       an explicit answer for `DRAFT` too.

BR-21 (**new, product owner ruling 2026-07-22 — NOT YET IMPLEMENTED**): The BR-11 contact gate
       (lender-type role + AUM ≥ ₹100 Cr) must apply **consistently** to every path that can
       initiate a connect request — both Directory browsing and the Matches "Connect" action —
       not just Directory. **Gap found while wiring the prototype:** the Matches screen's
       Connect button had no gating at all (see `03-html-ui-reconciliation.md`); fixed in the
       prototype at this pass, but the real `POST /connect/request` endpoint (BR-12, still
       unimplemented) must enforce this uniformly regardless of which screen the request
       originated from.

BR-22 (**new, developer request 2026-07-22 — IMPLEMENTED**): Internal Fingrid staff
       (`UserTypeEmployee`) get a read-only oversight view of every partner channel and every
       requirement listing platform-wide, regardless of `profile_status`/`listing_status`/
       `visibility`. Gated by `middlewares.RequireEmployee` (pre-existing but previously
       unwired to any route — see `06a-engineering-brief.md`), not by the partner-facing
       BR-11 contact gate, which does not apply between staff and partners.

BR-23 (**new, developer request 2026-07-22 — IMPLEMENTED**): Internal staff can force any
       requirement to `DRAFT` (unpublish) or `CLOSED` regardless of ownership — a moderation
       override on top of BR-20's owner-only Close. Built `AdminSetRequirementStatus()`;
       unlike the owner-only `CloseRequirement()`, this bypasses the "already closed"/
       "never published" guards since it's an explicit administrative action, not a user
       self-service one.

BR-24 (**new, developer request 2026-07-22 — IMPLEMENTED**): Internal staff can approve
       (`PENDING → VETTED`) or revert (`VETTED → PENDING`) any submitted vetting claim on any
       partner's profile. This is the previously-missing reviewer action noted in the Vetting
       Claim state machine below, and directly resolves **EC-10**. No new persona/HTML was
       speced for this before it was built — an internal admin view was requested directly by
       the developer mid-implementation, out of the normal L1→L8 sequence; documented here
       rather than backfilled as if it had gone through L3 HTML review, since it didn't.

BR-25 (**new, developer ruling 2026-07-22 — IMPLEMENTED**): Fingrid Connect registration is
       **pure self-service — no approval gate**. Discovered while live-testing the real OTP
       login flow: `createConnectChannel` created every new channel at
       `channel.Status = ChannelStatusCreated` (1), and `POST /v1/auth/login-with-otp`
       hard-blocks any channel not already `ChannelStatusApproved` (3) — returning
       `-100 "Registration flow is pending"` — with **no code path anywhere in the codebase,
       Connect or classic, that ever moves a channel from Created to Approved.** This was a
       silent, permanent dead end: every self-registered Connect user would create an account
       and then be structurally unable to ever sign into it. Two options were presented
       (auto-approve at registration vs. add a manual admin-approve action to WF5); the
       developer explicitly chose auto-approve — "in fingrid connect anyone can able to sign
       up without approval." Implemented: `createConnectChannel` now sets
       `channel.Status = ChannelStatusApproved` directly for new (non-join) registrations
       (`app/services/application/connect.go`). **Verified live, full loop**: register →
       real BIGINT `channel_id`, `core_channel.status=3` immediately → real spoofed-OTP login
       (see note below) → real `access_token` → real `GET /connect/:channelId/profile` call
       succeeds with that token. First time this entire chain has been exercised end-to-end
       with zero manual intervention.

**Note on OTP testing without sending real SMS:** this tenant's `LOGIN_WITH_OTP` notification
template (`core_template`) already has `status=2` (spoofed) — combined with this server's
`IsProd()==true`, `spoof==true` fires the very first branch in every SMS provider's
`SendOtp`/`VerifyOtp`, skipping the real network call entirely. The fixed verification code is
this tenant's `tenant_configuration` row `TENANT_SPOOF_OTP_CODE = 4024` (4 digits — tenant-
specific, seed defaults vary). **Found and fixed a real frontend bug while wiring this up:**
`OtpInput.jsx` hardcoded 6 input boxes (matching the old demo code `123456`), which made a
4-digit code physically un-enterable. Added a `length` prop (default 6, `SignIn.jsx`/
`OnboardingWizard.jsx`'s Verify step now pass `length={4}` with a hint pointing at `4024`).

BR-26 (**found + fixed 2026-07-23, developer-directed E2E test — IMPLEMENTED**): Publishing a
       requirement never actually generated any matches, **ever, for any listing platform-
       wide.** `enqueueMatchGeneration()` in `requirement.go` was a literal no-op TODO stub
       (`// TODO: enqueue for the match cron worker`); `core_partnership_match` had 0 rows in
       the entire database before this fix, confirmed via direct query during a live DSA↔NBFC
       match test. The real scoring logic (`generateForListing`, used by the equally-unwired
       `cron.ExecutePartnershipMatch`) was already correct — it was simply never called from
       anywhere. Presented two implementation options (synchronous inline call, matching the
       house convention already used for other "cron"-named functions like
       `cron.ExecuteLoanInterestAccrual`, vs. a goroutine); developer chose synchronous.
       `enqueueMatchGeneration` now loads the just-saved listing and calls
       `generateForListing` directly, inline, during the publish request.

       **Follow-up 2026-07-23:** the synchronous call only scores a listing at the moment it
       publishes — it won't catch a new candidate publishing their profile *after* a
       requirement is already LIVE. Checked whether a periodic sweep is also configured:
       there's a separate standalone scheduler binary (`cron/main.go`, `gocron`-based) that
       polls `core_cron_master` every 2 minutes and dynamically schedules whatever's
       registered there. The Go dispatcher already had a full, working
       `case "PARTNERSHIP_MATCH"` — it was simply never registered in the DB table (only
       `MCA_MASTER`/`DELAY_MONITOR`/`TARGET_CALCULATION` were). Added the missing row
       (`schedule_at='*/5 * * * *'`, matching `DELAY_MONITOR`'s cadence) and confirmed the
       scheduler binary picks it up cleanly. The binary is not started automatically by the
       main API server — it must run as its own process (`go run ./cron/main.go`) for the
       periodic sweep to actually execute.

BR-27 (**found + fixed 2026-07-23, same E2E test — IMPLEMENTED**): `core_channel.status` is
       overloaded in this codebase — `StatusActive` (1, generic active/soft-delete flag, used
       by Directory/Match-candidate-search/WF5-admin-list) and the `ChannelStatusXxx` lifecycle
       enum (`Created`=1, `PendingForApproval`=2, `Approved`=3 — what `login-with-otp` gates
       on) share the same column but different meanings. Because `StatusActive` and
       `ChannelStatusCreated` both happen to equal 1, this collision was invisible until BR-25
       (self-service auto-approve) started writing `ChannelStatusApproved`(3) — at which point
       every Connect-registered channel became simultaneously "able to log in" (status=3 passes
       the login gate) and "invisible to Directory/Matching/the admin view" (status=3 fails
       their `status=StatusActive(1)` filter). Found live: a fully published, correctly-scored
       NBFC candidate returned 0 Directory results and 0 match candidates until this was fixed.
       Resolved by broadening the three Connect-specific channel-status filters (`directory.go`,
       `match.go`'s `publishedChannelsByRoles`, `admin.go`'s `AdminListPartners`) to accept
       *either* value via a shared `activeChannelStatuses` list, rather than touching the
       shared login-gate or `StatusActive`'s platform-wide meaning (out of Connect's scope,
       wider blast radius).

BR-28 (**found + fixed 2026-07-23, same E2E test — IMPLEMENTED**): The Matches endpoint's
       `can_connect` flag (BR-11/BR-21 contact gate) was evaluated against the **matched
       candidate's own** role/AUM instead of the **caller's** — the opposite of Directory's
       (correct) logic, and the opposite of what BR-21 claimed was "satisfied by construction."
       Found live: a non-qualifying DSA caller saw `can_connect:true` on a match purely because
       the matched NBFC itself happened to have AUM ≥ ₹100 Cr — a misleading UI signal, though
       not a security hole (`SendRequest` independently re-checks the real caller and would
       still correctly 403 that DSA). Fixed: `ListMatches` now loads the caller channel once
       and applies `canViewContact` to it, matching `ListDirectory`'s pattern exactly.

**E2E verification (2026-07-23):** all three fixes verified live via a full DSA↔NBFC scenario
— two fresh channels registered, both profiles completed and published, requirement posted and
matched, connect request sent and accepted, relationship visible on both sides. See
`09-integration-report.md` for the complete trace with real IDs.

**Client-side wizard validation added 2026-07-23 (developer request):** none of the three
per-stage wizards (`OnboardingWizard`, `CompanyProfileWizard`, `RequirementWizard`) actually
enforced their own `required` field badges — only a `disabled={saving}` guard existed, so a
user could click "Save & Next" with empty required fields and either silently save incomplete
data (fields the backend itself doesn't require, e.g. `legal_name`/`pan` have no
`validate:"required"` tag) or hit a raw, unexplained backend error (e.g. BR-05's
`partnership_type` 422, which *is* backend-enforced but only manually, not via a struct tag).
Added a `validateStage()`/`validateStage()` gate to each wizard, checked **before** the API
call fires on every "Save & Next"/"Complete Registration": required-field presence
(`legal_name`, `pan`, company PAN, `partnership_type`), PAN format (`ABCDE1234F` pattern, all
three places a PAN is collected), and two sanity checks with no backend equivalent at all
(`field_staff_count` ≤ `total_staff`; `ticket_min` ≤ `ticket_max` — both currently accepted
uncomplained-of by the API, silently producing a listing/profile no real candidate could ever
satisfy). Validation failures block advancement and the API call together, with the message
shown inline; passing validation doesn't change what's sent — the per-stage save behavior
already fixed for WF2/WF3 is unchanged.

**WF1 identity-verification OTP is now real, not a hardcoded demo code (developer request,
2026-07-23).** `OnboardingWizard`'s email and mobile "verify" steps previously did a fake
local check (`code === '123456'`), never touching the backend. Replaced with the real,
pre-existing, generic pre-registration verification endpoint —
`POST /v1/notification/otp` (`app/controllers/v1/notification/controller.go`'s `Otp()`),
template `OTP_PARTNER_REGISTRATION` (already spoofed, `core_template.status=2`, same tenant-
wide `TENANT_SPOOF_OTP_CODE` = `4024` used by Sign In's `login-with-otp`) — gated only by a
guest token, the same as `registerConnectAccount`. One real mechanism, 4-digit code,
everywhere; no demo/hardcoded value left in the app. All OTP hint text removed from the UI
per developer request (the code is delivered the same way a real, non-spoofed deployment
would deliver it — nothing to hint at).

**Found, disclosed, NOT fixed (developer's explicit choice) — a pre-existing, unrelated
platform bug:** `POST /v1/notification/otp`'s email path is provider-dependent, and the
`OTP_PARTNER_REGISTRATION` template's assigned provider is MSG91.
`Msg91.VerifyEmail()`/`NetCore.VerifyEmail()`/`Smtp.VerifyEmail()`
(`app/factory/email_provider/{msg91,netcore,smtp}.go`) are **unconditional stubs that always
return `"verified"` regardless of the code entered** — confirmed live, a wrong code (`9999`)
also "verified" successfully. Only `Sendgrid.VerifyEmail` is actually implemented (correctly
checks the spoof code, or a real Redis-stored OTP otherwise). Mobile OTP (via the SMS
providers) is correctly implemented and does reject wrong codes — verified live repeatedly.
**Practical effect:** the wizard's "verify your email" step currently accepts any 4-digit
entry; presented the fix (bring MSG91/NetCore/Smtp in line with Sendgrid's existing correct
pattern) to the developer, who chose to leave alpha-api untouched and disclose this instead —
it's a pre-existing, platform-wide gap unrelated to Connect, not something to silently patch
around in this module.

---

## State Machine — Company Profile (`connect_profile.profile_status`)

```
States: DRAFT | PUBLISHED

Transitions:
  DRAFT → PUBLISHED : Owner submits publish action AND BR-03 mandatory-credential check passes

Terminal states: none — `PUBLISHED` is not terminal for editing purposes (see resolution below).
States requiring approval to exit: none (publish is self-service, gated only by BR-03).
```

**Resolved 2026-07-22 (product owner): a company profile CAN be edited after publish.** No
status-reversion transition is actually needed to achieve this — re-checked `SaveProfile` in
`profile.go` and confirmed **it has no guard blocking stage-saves when `profile_status` is
already `PUBLISHED`.** A save merges new field values in regardless of current status
(BR-01), and `profile_status` simply stays `PUBLISHED` throughout — it never needs to round-trip
through `DRAFT`. So this already works today; the earlier "Open Question" was based on an
incomplete read of the state machine (I'd assumed no edit path existed because no *status*
transition existed, without checking whether edits require one). No code change needed here.

## State Machine — Vetting Claim (per-credential, within a profile)

**Corrected at L5 (superseding v1.0's "Unknown — propose"):** verified directly in
`helper.go` — only **two** values exist, `vetStatusPending = "PENDING"` and
`vetStatusVetted = "VETTED"`. **There is no `REJECTED` value anywhere in the code.** My
earlier proposed 3-state machine (PENDING/VERIFIED/REJECTED) was invented without a code
check and is wrong — replaced below.

```
States: PENDING | VETTED

Transitions:
  PENDING → VETTED : Internal-staff reviewer approves the claim (BR-24, below)
  VETTED → PENDING : Internal-staff reviewer reverts (same action, reverse direction)

Terminal states: none — reversible either direction by design (a wrongly-approved claim can
be reverted).
```

**IMPLEMENTED 2026-07-22 (WF5 — admin view, product owner request).** This was the real gap
flagged above: no reviewer action existed anywhere. Built `AdminSetVetting()` in
`app/services/connect/admin.go`, routed at `POST /connect/admin/:channelId/vetting`
(employee-only, BR-22). Verified live: approving a real test channel's `AUM` claim moved
`verification_tier` from `TIER_0` to `TIER_1` immediately (recomputed via the pre-existing
`setProfileTier()`), then reverted cleanly back. This is the operational fix for **EC-10**
(below) — matching was never actually broken code, it was missing an approval workflow.

## State Machine — Partnership Requirement (`core_partnership_listing.listing_status`)

```
States: DRAFT | LIVE | MATCHED | CLOSED

Transitions (as implemented):
  DRAFT → LIVE : Owner publishes (BR-06/BR-07); irreversible in current code.
  LIVE → MATCHED : SYSTEM-triggered (BR-19) — set automatically once the match cron produces
                   at least one eligible candidate for this listing.
  LIVE/MATCHED → CLOSED : Owner-triggered (BR-20) — manual "Close Requirement" action, no
                          automatic trigger.

Terminal states: CLOSED.
```

**IMPLEMENTED 2026-07-22** — both transitions built (see BR-19/BR-20). All 4 states are now
reachable in code, closing the gap this section used to flag.

## State Machine — Partnership Match (`core_partnership_match.match_status`)

```
States: SUGGESTED | VIEWED | CONTACTED | DISMISSED

Transitions (documented intent, per doc unverified):
  SUGGESTED → VIEWED     : Requirement owner opens the match card
  VIEWED    → CONTACTED  : Owner sends a connect request against this candidate
  Any       → DISMISSED  : Owner dismisses the candidate

Terminal states: DISMISSED, CONTACTED (both proposed as terminal for that match record).
```

**Conflict flagged (EC-05 below):** BR-08's full-replace cron behaviour destroys this entire
state machine every run — there is currently no mechanism to preserve `VIEWED`/`CONTACTED`/
`DISMISSED` across a regeneration cycle. This must be resolved (either the cron preserves
status for still-eligible candidates, or the status dimension is redesigned) before BR-09
can be implemented.

## State Machine — Partnership Response (`core_partnership_response.response_status`)

```
States: PENDING | ACCEPTED | REJECTED

Transitions (**IMPLEMENTED 2026-07-22**):
  (created) → PENDING   : REQUEST action creates the row (`SendRequest()`)
  PENDING   → ACCEPTED  : Recipient ACCEPT action (BR-13); creates/reactivates a relationship (`RespondToRequest()`)
  PENDING   → REJECTED  : Recipient REJECT action (BR-13)

Terminal states: ACCEPTED, REJECTED (no re-open transition specified — still true, not built).
```

## State Machine — Channel Relationship (`core_channel_relationship.relationship_status`)

```
States: ACTIVE | INACTIVE

Transitions (created/reactivated path **IMPLEMENTED 2026-07-22**; deactivation still open):
  (created) → ACTIVE   : A PENDING response is ACCEPTED (`upsertRelationship()` in `partnership.go`
                          — also reactivates an existing INACTIVE row for the same pair rather
                          than creating a duplicate)
  ACTIVE    → INACTIVE : Still no trigger built or designed — Unknown, propose: manual
                          termination by either party? Not part of this implementation pass.

Terminal states: none confirmed.
```

## State Machine — Channel Role (`core_channel_role.role_status`)

```
States: ACTIVE | INACTIVE | PENDING

Transitions: undocumented — see BR-15. Table exists, no service enforces transitions yet.
```

---

## Module & Master Inventory

| Item | Kind | Placement | Governance | Lifecycle? |
|------|------|-----------|-----------|-----------|
| Company Profile (`connect_profile` + fan-out) | Transaction | This module | Self-service publish, gated by BR-03 | Yes — Company Profile state machine above |
| Partnership Requirement (Listing) | Transaction | This module | Self-service publish, gated by BR-05/BR-06 | Yes — Requirement state machine above |
| Partnership Match | Transaction (system-generated) | This module | None — cron-owned, no human maker/checker | Yes — Match state machine (currently non-persistent, see EC-05) |
| Partnership Response | Transaction | This module | Self-service accept/reject by recipient | Yes — Response state machine above |
| Channel Relationship | Transaction | This module | System-created on accept; no direct create | Yes — Relationship state machine above |
| Channel Role (`core_channel_role`) | Master (config, module-private) | This module | Undecided — BR-15 flags no enforcing code yet | Yes, nominally — not yet enforced |
| Entity Type (`CHANNEL_ENTITY_TYPE` lookup) | Enumeration | Platform Settings → `core_lookup_master`, Studio-managed | Direct edit by Ops Admin | No |
| Personal Email Domain list (`PERSONAL_EMAIL_DOMAIN` lookup) | Enumeration | Platform Settings → `core_lookup_master` | Direct edit by Ops Admin | No |
| Vetting Claim / Credential type | Master (domain, referenced) | Owned by onboarding/verification module (`onb_document`, `onb_empanelment`); Connect reads/writes into it | Owner module's rules | Ref only |
| AUM ≥ ₹100 Cr contact-gate threshold | Tunable scalar | **Currently hardcoded** — should move to Studio Parameters (L4b OPS table) per placement rule #5 | Ops Admin, no deploy — **not yet migrated, flagged in 00-inputs §G.2** | N/A |
| Match top-N cap (currently 10) | Tunable scalar | Same as above — hardcoded in `match.go` (`matchTopN`) | Same — flagged for L4b | N/A |

---

## Workflow Definitions

### Workflow — WF1 User & Identity Onboarding

| Stage | Step | Actor | Entry condition | Exit → |
|-------|------|-------|----------------|--------|
| Identity | Enter email | End User | — | Domain classified (BR-14) |
| Identity | Company resolution | End User | Domain scenario known | Search/select (platform+MCA) or create-stub or join-existing |
| Identity | Entity-type lock/select | End User | Company resolved | Email OTP sent |
| Identity | Verify email OTP | End User | OTP sent | Stage 2 |
| Your Details | Name, mobile, designation/department, loan types | End User | Stage 1 complete | Mobile OTP sent |
| Your Details | Verify mobile OTP | End User | OTP sent | Stage 3 |
| Preferences | Contact visibility, interests, notifications | End User | Stage 2 complete | Stage 4 |
| Company | Now / later / invite-colleague choice | End User | Stage 3 complete | Registration complete |
| Welcome | View access chips + next-step cards | End User | Registration complete | Dashboard |

**Returning-user sign-in — IMPLEMENTED 2026-07-22 (developer request, gap found during
manual review).** The table above only ever covers *new* registration; there was no path back
in for a user who already completed it — `OnboardingWizard` only ever produced a local, fake
`channelId` and never called a real endpoint or stored a token, so nothing downstream could
authenticate for anyone, new or returning. Fixed by wiring the real, pre-existing
`POST /v1/auth/login-with-otp` (mobile OTP, `X-Platform: PARTNER_PORTAL` → `UserTypeChannel`)
as a genuine Sign In screen (`/connect/login`), storing the real `access_token`/`channel_id`.
Not live-verified end-to-end (a real SMS OTP would be sent to a real phone number); verified
instead that an unregistered mobile cleanly returns `422 Invalid credentials` before any OTP
is sent, and that the request/response wiring matches the controller exactly.

**New-registration completion — IMPLEMENTED 2026-07-22 (developer flagged: fake `channelId`
strings like `DEMO-1784726037339` cannot work — `channel_id` is a BIGINT column, generated
server-side via `utility.UniqueId()`, never client-generated).** This was the other, harder
half of the original auth-bootstrap question. Resolved: `createConnectChannel`
(`app/services/application/connect.go`) performs **no caller-identity check at all** — the
`UserDetails` it's given is discarded — so a no-credentials guest token
(`POST /v1/auth/guest`) is sufficient authorization to call `POST /v1/partner/create`'s
`connect` sub-object as a brand-new, unauthenticated visitor. `OnboardingWizard` now: (1)
collects Company Name + PAN (previously missing entirely — required by the real DTO for
non-personal-domain creation) and invite name/email (previously missing — required when
`company_completion=invite`), (2) maps UI visibility values (`public`/`request`/`private`) to
the real API's codes (`pub`/`req`/`priv`), (3) calls the real endpoint via a guest token to
get a **real BIGINT channel_id**, then (4) immediately runs the same real OTP login as Sign In
(registration alone returns no session token) to actually authenticate before entering the
dashboard. **Out of scope, per standing product owner ruling** ("no approval to join existing
company," `00-inputs.md`): the "join an existing company" scenario (`company.action=join`) is
not built in this wizard — only "create new" and "personal."

**Verified live** against the real dev DB, three real registrations covering all three
scenarios this wizard actually uses: `scenario=create` (manual company, real `channel_id
178472661079376711`), `scenario=personal` (real `channel_id 178472665025113660`), and an
earlier `scenario=create` call (`channel_id 178472642075880356`) that also confirmed the
duplicate-email guard (`-3 "a user already exists with this email"`) fires correctly on a
retried call. **Not verified**: the real OTP send/verify step immediately following
registration — same reasoning as Sign In, a real SMS would be sent to a real number. See
`09-integration-report.md`.

### Workflow — WF2 Company Profile (6 stages, C1–C6)

| Stage | Step | Actor | Entry condition | Exit → |
|-------|------|-------|----------------|--------|
| C1 Legal Identity | Legal name, PAN/CIN, incorporation, state, website | Channel Owner/Admin | — | C2 |
| C2 Operations & Volume | AUM, disbursal, branches, geography, products, loan mix | Channel Owner/Admin | C1 saved | C3 |
| C3 Staff & Capacity | Total/field staff, staff-by-role | Channel Owner/Admin | C2 saved | C4 |
| C4 Empanelments & Credentials | Empanelments + entity-conditional mandatory credentials (BR-03) | Channel Owner/Admin | C3 saved | C5 if `lsp`, else C6 (BR-16) |
| C5 Digital Capabilities *(LSP only)* | App/website/bureau/ISO/VAPT/API capability flags | Channel Owner/Admin | entity_type = lsp | C6 |
| C6 Verify & Publish | Review completion %, upload proof per claim, publish | Channel Owner/Admin | All mandatory credentials present (BR-03) | profile_status = PUBLISHED |

**Fixed 2026-07-22 (developer report: "on every step the api call need to happen to save") —
three real bugs, all frontend-only, no alpha-api changes needed:**

1. **Silent-advance-on-failure (the core bug).** `CompanyProfileWizard`'s `goNext()`
   unconditionally advanced `stepIdx` regardless of whether the stage's save actually
   succeeded — `saveStage()` caught its own errors and never signalled failure back to the
   caller. `RequirementWizard` (WF3) already did this correctly (`if (r) setStepIdx(...)`);
   this wizard didn't. Combined with bug 2 below, this meant **every stage with a numeric
   field silently failed to save while the UI happily moved to the next step**, giving false
   confidence that data was persisted. Fixed: `saveStage` now returns true/false;
   `goNext` only advances on success.
2. **Numeric fields sent as strings.** Every plain `<input>`/`DynamicTable` cell produces a
   string; `ProfileRequest`'s numeric fields (`incorporation_year`, `aum`,
   `monthly_disbursal`, `total_staff`, `field_staff_count`, `count`, `monthly_amount`,
   `active_since`) are real Go `int`/`float64`. alpha-api's JSON unmarshal does not coerce —
   verified live this 400s with `"cannot unmarshal string into Go struct field ... of type
   int"`. Fixed with a `num()` helper at the payload-building boundary (not inside
   `DynamicTable`, which stays a plain string-grid component).
3. **One blank DynamicTable row blocked the whole stage.** `ClientName`/`Type` are
   `validate:"required"` server-side; a half-filled empanelment/credential row (added via
   "+ Add row" but not yet typed into) 422s the *entire* array, not just that row. Fixed by
   filtering rows with an empty required field before sending (`cleanRows()`).

**Also added, previously missing from the UI entirely:** `ProfileOperations.Geography`/
`Products` exist in the real DTO and feed BR-18's match-scoring geo/product-overlap
components directly (`buildScoreCandidate` reads `cp["geography"]`/`cp["products"]`), but no
stage ever collected them — every published profile would score 0 on both components
regardless of actual fit, a silent scoring gap sitting alongside EC-10. Added "Primary
states"/"Products offered" pill-selects to C2, matching the pattern already used in WF3's own
Requirement Listing wizard.

**Verified live**, full stage-by-stage save through publish, on real test channel
`178472800818732956`: LEGAL → OPERATIONS (incl. geography/products) → STAFF → EMPANELMENT →
publish, `profile_status` ends `PUBLISHED`, `completion.percent` climbs correctly at each step
(16→33→50→66→83%).

### Workflow — WF3 Partnership Requirement Listing (4 stages — R3 removed, confirmed 2026-07-22)

| Stage | Step | Actor | Entry condition | Exit → |
|-------|------|-------|----------------|--------|
| R1 Type & Context | Partnership type (BR-05), context, products | Requirement Owner | — | R2 |
| R2 What You Need | Geography, target volume, ticket min/max, cases/month, TAT | Requirement Owner | R1 saved | R4 |
| ~~R3 What You Offer~~ | **REMOVED, confirmed by owner 2026-07-22** — was `Out of Scope V1`, now confirmed not required at all, not just deferred | — | — | — |
| R4 Counterparty Criteria | Min verification tier, min AUM, min sourcing capacity, min branches/field staff, geography overlap, certifications | Requirement Owner | R2 saved | R5 |
| R5 Review & Publish | Review summary, publish (BR-06/BR-07) | Requirement Owner | R4 saved | listing_status = LIVE, match generation enqueued |
| Post-publish (system) | Auto-flip to MATCHED once ≥1 eligible match exists (BR-19) | SYSTEM | listing_status = LIVE | listing_status = MATCHED |
| Post-publish (owner) | Manual "Close Requirement" action (BR-20) | Requirement Owner | listing_status ∈ {LIVE, MATCHED} | listing_status = CLOSED |

### Workflow — WF4 Match & Partnership Response *(system + human — IMPLEMENTED 2026-07-22, except match_status write)*

| Stage | Step | Actor | Entry condition | Exit → |
|-------|------|-------|----------------|--------|
| Generation | Score all LIVE listings against eligible candidates (BR-08, BR-10) | SYSTEM (cron) | Listing is LIVE | Match rows replaced (top 10); listing → MATCHED if ≥1 found (BR-19) |
| Review | Owner views ranked matches | Requirement Owner | Matches exist | Read endpoint built (`GET .../matches`); match_status write (VIEWED) still *not implemented, BR-09* |
| Directory browse | Search/filter published organisations | Any Channel | — | `GET /connect/directory` — implemented (BR-11) |
| Request | Send connect request | Any Channel | Contact gate evaluated (BR-11/BR-12) | `POST /connect/request` — implemented, response_status = PENDING |
| Decision | Accept or reject | Recipient Channel | response_status = PENDING (BR-13) | Implemented — ACCEPTED → relationship created / REJECTED |
| Closure | Manual close | Requirement Owner | listing_status ∈ {LIVE, MATCHED} | `POST .../requirement/:id/close` — implemented (BR-20) |

Every stage above traces to a state/transition in the corresponding state machine section.
**Remaining gap:** match_status write (BR-09/EC-05) — the one piece of WF4 left unbuilt.

### Workflow — WF5 Admin Oversight & Vetting *(internal-staff, IMPLEMENTED 2026-07-22)*

**Out-of-sequence note:** unlike WF1–WF4, this workflow was not speced at L1/L2 before being
built — the developer requested an internal admin view directly, mid-implementation, after
noticing the partner-facing module had no discoverable entry point separate from an admin
oversight need. No L3 HTML prototype exists for these screens (they were built directly as
React, styled deliberately differently — dark/plain — from the customer-facing teal system so
staff and partners can never be confused). Documented here after the fact, per BR-22/23/24.

| Stage | Step | Actor | Entry condition | Exit → |
|-------|------|-------|----------------|--------|
| Login | Employee signs in (`POST /auth/login-with-password`, `X-Platform: EMPLOYEE_PORTAL`) | Fingrid Employee | Real employee account (pre-existing auth, not Connect-specific) | Admin token stored client-side |
| Partner Oversight | Browse/search every partner channel, any profile_status (BR-22) | Fingrid Employee | Authenticated as employee | Drill into one partner |
| Vetting Queue | Review a partner's submitted claims; approve → VETTED or revert → PENDING (BR-24) | Fingrid Employee | Partner has ≥1 submitted claim | verification_tier recomputed live (BR-17) |
| Requirement Oversight | Browse every requirement listing, any status (BR-22) | Fingrid Employee | Authenticated as employee | Filter/search |
| Moderation | Force a listing to DRAFT (unpublish) or CLOSED regardless of owner (BR-23) | Fingrid Employee | Listing exists | listing_status updated |

**Verification note:** every endpoint (partner list, vetting set, requirement list,
requirement status) was verified live against the real dev DB using a manually-signed test
JWT with `userType: EMPLOYEE` (same signing key the running server already uses from its own
`.env`) — not a real employee account, since none were available. The `RequireEmployee` gate
itself, and all 4 admin endpoints' actual logic (including the EC-10 fix), are confirmed
working. The employee **login form** is wired to the real, pre-existing login endpoint but
was not exercised against a real password — see `09-integration-report.md`.

---

## Edge Cases and Exception Flows

EC-01 (Concurrent users): Two users on the same channel edit the same profile stage
       simultaneously. **Expected (proposed, unconfirmed):** last-write-wins per BR-01's merge
       semantics — no optimistic locking exists in `ProfileService.Save` today. Flag as a gap
       if concurrent edits are a real scenario (multi-user companies are explicitly supported
       per WF1's "invite-colleague").

EC-02 (Duplicate submission): User double-clicks "Publish Requirement." **Expected (verified
       in code):** BR-06 returns 409 on the second call — safe by design.

EC-03 (External service failure): Email/mobile OTP gateway is down during WF1. **Expected:**
       undocumented — current implementation uses a stubbed demo code (`123456`), so this
       edge case has never been exercised against a real gateway. Needs a real-gateway failure
       behaviour defined before WF1 leaves demo mode.

EC-04 (Boundary value): A candidate channel's AUM is **exactly** ₹100 Cr for the BR-11 contact
       gate. **Expected (proposed):** gate uses `≥`, so exactly ₹100 Cr passes. Needs owner
       confirmation the boundary is inclusive.

EC-05 (Partial failure / data loss — **newly discovered, not in any existing doc**): The
       `PARTNERSHIP_MATCH` cron **hard-deletes and recreates** every match row for a listing
       on every run (`ReplaceForListing`). Any `VIEWED`/`CONTACTED`/`DISMISSED` status a user
       set on a match is silently wiped back to `SUGGESTED` at the next cron cycle. This
       directly undermines BR-09/US-04 once that status tracking is built. **Must be resolved
       before WF4's Review step is implemented** — either the cron preserves status for
       candidates still eligible, or match "status" needs a separate table that survives
       regeneration.

EC-06 (Empty state): A channel has zero live requirements / zero matches / zero relationships.
       **Expected:** dashboard cards should show an explicit empty state, not an error — not
       yet verified against any implemented endpoint.

EC-07 (Role conflict): A user belongs to a channel with multiple `core_channel_role` rows
       (e.g. both DSA and BC). **Expected:** undocumented — BR-15 already flags that no code
       enforces `core_channel_role` at all yet.

EC-08 (Data migration): WF1 already has production users under `POST /v1/partner/create`
       before this spec existed. **Expected:** this spec must not silently redefine WF1
       behaviour — any BR affecting WF1 must be validated against existing production data
       before being treated as a new rule (see `00-inputs.md` — WF1 has no contract doc, so
       its actual constraints are currently only in the code, not written down anywhere else).

EC-09 (Holiday/calendar): Not applicable — no date-driven business logic (no PTP-style
       deadlines) exists in Connect's current scope.

EC-10 (Chain reaction, newly discovered at L5 — **P1 severity, not just an edge case**):
       No code path ever sets a vetting claim to `VETTED` (state-machine note above) →
       every channel's `verification_tier` is always `TIER_0` (BR-17) → any requirement that
       sets `criteria.min_verification_tier` above `TIER_0` (BR-18's eligibility gate)
       **excludes every possible candidate, always**, and the tier component of every score
       that does compute is always 0/25. **This silently breaks the core matching feature for
       any requirement with a non-trivial tier requirement**, with no error or empty-state
       message distinguishing "no candidates exist" from "the tier gate is unsatisfiable by
       design." Root cause is a missing feature (a claim-review/approve action), not a bug in
       any single function — flagging as the highest-priority item for whoever picks up BR-13
       or credential review work next.

       **RESOLVED 2026-07-22 (BR-24):** the missing claim-review action now exists —
       `POST /connect/admin/:channelId/vetting`. Verified live that approving one claim moves
       a channel out of `TIER_0`. Residual gap: there is still no UI/process for a partner to
       know their claim is sitting in the internal admin's queue (no notification wired), and
       no SLA on how quickly staff review it — the matching feature is no longer structurally
       broken, but is now dependent on internal staff actually working the vetting queue.

EC-11 (found 2026-07-23, full scenario sweep — **not fixed, flagging only**): The four
       "service agency" partnership types — `seek_verif`, `seek_collection`, `seek_legal`,
       `seek_property` — all map to the single candidate role `SERVICE` in `match.go`'s
       `candidateRoles`, with no further distinction by agency sub-type. Confirmed live: a
       requirement posted as `seek_legal` matched a **Verification** Agency (score 75,
       identical to a genuine `seek_verif` match) — any published `SERVICE`-role channel
       matches any of the four requirement types interchangeably, regardless of what kind of
       agency it actually is. Root cause: `primary_role` is too coarse a signal for this
       distinction; `entity_type` (`verif_agency`/`collection_agency`/`legal_agency`/
       `property_agency`) carries the real information but isn't consulted in scoring or
       eligibility. Needs a product/design decision on the right fix (score by `entity_type`
       directly? require a stricter role taxonomy for service channels?) before someone
       changes `candidateRoles`/`scoreMatch` — not something to guess at silently.

---

## Field-Level Validations

### Company Profile (`PUT /partner/:channelId/profile`)

| Field | Type | Required | Validation Rules |
|-------|------|----------|-------------------|
| `stage` | Dropdown | No | `oneof: LEGAL \| OPERATIONS \| STAFF \| EMPANELMENT \| CAPABILITIES` |
| `legal.pan` / `legal.cin` | Text | No | No format validation found in code — **gap**, PAN/CIN format checks are not enforced |
| `operations.aum` / `operations.monthly_disbursal` | Number | No | No min/max enforced in code — **gap** |
| `operations.branches[]` | Array | No | Each element validated via `dive` (struct-level, not further specified) |
| `operations.geography[]` | Array | No | `{state, districts}` shape; no cross-check against a state master found |
| `staff.total_staff` / `staff.field_staff_count` | Integer | No | No enforcement that `field_staff_count ≤ total_staff` found — **gap** |
| `empanelments[]` / `credentials[]` | Array | No | `dive`; credential presence checked only at publish time (BR-03), not at save time |
| `capabilities` | Object | No (LSP-only, BR-16) | No server-side enforcement that non-LSP submissions are rejected — **confirmed acceptable by developer 2026-07-22, frontend-only by deliberate decision, not a gap to close** |

### Partnership Requirement (`POST/PUT /partnership/listing`)

| Field | Type | Required | Validation Rules |
|-------|------|----------|-------------------|
| `partnership_type` | Dropdown | Yes (create) | BR-05 enum; 422 if missing on create |
| `need.ticket_min` / `need.ticket_max` | Number | No | No `min ≤ max` cross-check found in code — **gap** |
| `criteria.min_verification_tier` | Dropdown | No | `oneof: TIER_0 \| TIER_1 \| TIER_2 \| TIER_3` (per contract; not independently re-verified in code) |
| `visibility` | Dropdown | No | `oneof: PUBLIC \| INVITE \| PRIVATE`, default `PUBLIC` |
| `listing_status` | Dropdown | No | `oneof: DRAFT \| LIVE`; only `LIVE` triggers BR-06/BR-07 |

---

## Notifications & Triggers

*(Unknown — propose: 00-inputs §B.5 was not answered. Drafted for confirmation.)*

| Trigger | Recipient | Channel | Template |
|---------|-----------|---------|----------|
| Match generated for a listing | Requirement Owner | In-App | `CONNECT_MATCH_GENERATED_OWNER` |
| Connect request received | Target Channel | In-App + Email | `CONNECT_REQUEST_RECEIVED` |
| Connect request accepted | Requesting Channel | In-App + Email | `CONNECT_REQUEST_ACCEPTED` |
| Connect request rejected | Requesting Channel | In-App | `CONNECT_REQUEST_REJECTED` |
| Profile publish blocked (BR-03) | Channel Owner | In-App | `CONNECT_PROFILE_PUBLISH_BLOCKED` |
| Credential vetting reviewed | Channel Owner | In-App + Email | `CONNECT_VETTING_REVIEWED` |

None of the above are implemented — no notification dispatch code exists in
`app/services/connect` today.

---

## Output Checklist

- [x] Every user story maps to a persona in the product spec
- [x] Every BR is uniquely numbered; unverified/doc-only BRs explicitly tagged
- [x] Threshold values stated explicitly where known; gaps marked where code has none
- [x] State machines cover all terminal states known; unreachable designed states flagged
- [x] Module & Master Inventory present; every master has a placement + governance ruling
- [ ] Every workflow'd master has lifecycle states — **Channel Role governance undecided (BR-15)**
- [x] Every 4c stage/step traces to a state/transition; unimplemented ones flagged, not hidden
- [x] Edge cases include a concurrent-user scenario (EC-01) and a genuinely new one found in code (EC-05)
- [ ] All notification templates named — **none implemented yet, proposed only**
- [x] No CR tags needed — this is the initial version
