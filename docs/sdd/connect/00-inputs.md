# SDD Layer 0 — Inputs — Fingrid Connect

**Fill type:** Lightweight (Sections 0, A.4, B.2 + delta-notes on the rest) — per sdd-00-inputs
Rule 1: this is a **brownfield first-time spec of an existing-but-unspecced module**. L3
(HTML), L4 (DB), L5 (API contract, WF2/WF3 only), and L6a/L6b (partial) already exist in the
repos; no L0/L1/L2 has ever been written. This file captures what's known and routes the rest
— it does not re-derive design already sitting in `contract.md` / `engineering-brief.md` /
the migrations.

**Route (0.5):** New module → full L1–L13. Treated as a **backfill run**: L1/L2 will be
reverse-authored from what's built; L3/L4/L5/L6a get reconciled (not regenerated) against
existing artifacts; L6b/L8 continue forward from current implementation state.

**Expected artifact list this run produces, in order:** L1 product spec → L2 feature spec
(BR-numbered, absorbing the informal rule tables already in `engineering-brief.md`) → L2b
test spec → L3 reconciliation (one canonical flow from the 3 overlapping HTMLs, **UI
sign-off gate**) → L4 backfill doc (schema already shipped; document it since the original
plan docs were deleted) → L5 contract extended to WF1 + the 2 open gate items resolved →
L6a brief corrected to match actual L6b state → L6b completes the 5 missing endpoints → L8
React build (superseding the stale `integration-plan.md` assumptions).

**Source docs consulted for prefill:**
`fingrid-apex/docs/{fingrid-connect-home,fingrid-connect-prototype,fingrid-connect-app}.html`,
`fingrid-apex/docs/fingrid-connect-integration-plan.md`,
`alpha-api/migrations/product/20260710120000_FINGRID_CONNECT_ONBOARDING.sql`,
`alpha-api/migrations/product/20260720120000_FINGRID_CONNECT_PARTNERSHIP.sql`,
`alpha-api/docs/api-contract/fingrid-connect-wf2-wf3/contract.md`,
`alpha-api/docs/api-impl/fingrid-connect-wf2-wf3/engineering-brief.md`,
`alpha-api/app/{handler,services,controllers/v1}/connect/*`, `alpha-api/app/routes/v1.go`,
git history (`a68e260e1` — L4 plan docs deleted post-implementation),
`sdd-skills/00-inputs/references/questionnaire-template.md` (capability tracker, item #1).

---

## Section 0 — Identity & Triage

- **0.1 Matrix item # and name:** #1 — *Fingrid Connect — User, Company, Partnership*
  (PREFILLED — confirm; source: sdd-skills capability tracker).
- **0.2 Category:** **PREFILLED — confirm.** Spans two: *Platform & Onboarding* (WF1 user/company
  creation) + *Lending & Marketplace* (WF3 requirement/match). No single category owns it —
  confirm which governs the spec folder, or accept dual-category.
- **0.3 Product lines: RESOLVED (owner ruling, 2026-07-22).** Connect does not gate by OS at
  all — it is platform-level, visible regardless of which product line (LenderOS/DsaOS/
  VerifyOS/CollectOS) a tenant is provisioned as. This also resolves the Legal Agency /
  Property Agency question below: they don't need a product-line home either, since nothing
  in Connect is OS-scoped. See `04b-rendering-seed-map.md` and `seeds/connect-seed.yaml` for
  the nav-seed correction this implies.
- **0.4 Per-OS variance:** **Unknown — propose:** no per-OS variance. Connect is a single
  cross-OS platform module; the real variance axis is **per-entity-type** (12 types), already
  handled in code (`candidateRoles` map in `match.go`, the mandatory-credential table per
  entity type in `contract.md`'s publish-guard notes). One spec, no per-OS split.
- **0.5 Work type:** **New module → full L1–L13**, run as a backfill (see Route above). Not
  "Enhancement" — there is no existing spec suite to CR into.
- **0.6 Prior Fingrid work:** **PREFILLED — confirm.** Substantial and uneven:
  - *L3:* 3 overlapping HTML prototypes in `fingrid-apex/docs/` — `fingrid-connect-home.html`,
    `fingrid-connect-prototype.html` (≈ "stage1_email" + "fingrid-connect-v5" per the
    integration plan), and `fingrid-connect-app.html` (adds a login screen + admin/user tab
    toggle not analyzed anywhere else). Never reconciled into one canonical flow; no UI
    sign-off recorded.
  - *L4:* 2 migrations live in `alpha-api` (onboarding: `core_channel`/`core_channel_role`/
    `core_channel_user` extensions; partnership: `core_partnership_listing/match/response` +
    `core_channel_relationship`). The original design docs (`mcp/fingrid-connect-wf2-wf3-schema-plan.md`,
    `-er.md`) were deleted post-implementation (commit `a68e260e1`) — recoverable from git
    history, not in the working tree.
  - *L5:* `contract.md` covers **WF2 (Company Profile) + WF3 (Requirements/Marketplace) only**.
    WF1 (user/identity onboarding — already in production per the contract's own scope note:
    `POST /v1/partner/create`, `GET /v1/partner/:channelId`, `GET /v1/channel/`) has **no
    contract doc**. Two gate items in `contract.md` (`PUT /partnership/response/:id`,
    `GET /partnership/relationship`) were left "approve or defer" and never closed.
  - *L6a:* `engineering-brief.md` (WF2+WF3) — describes 8 endpoints and a `PartnershipService`
    that do not fully exist in code; brief is ahead of implementation, not behind it.
  - *L6b:* Partial. Routed + working: profile get/save, requirement create/update/list/get.
    **Not implemented**: matches getter, connect-request/accept/reject, list-partners,
    directory list/detail — `marketplace.go` has only DTOs, no logic, not wired into
    `routes/v1.go`. The match cron scorer (`GenerateMatches`) works but has no API to read it.
  - *L8:* Not started. `fingrid-connect-integration-plan.md` is the only artifact, and it's
    **stale** — written to assume a mock-only data layer "for later API swap," not knowing the
    real API already exists and is partly live.
- **0.7 Client driver & deadline:** **NEEDS YOUR INPUT** — no source names a client or date.
  Which client(s)/priority (P1/P2/P3)?
- **0.8 Spec owner / Tech Lead / QA owner: RESOLVED (2026-07-22).** Sreedhar — Product/Spec
  Owner. Sudharson — Developer/Tech Lead (building this). QA owner still unnamed.

## Section A.4 — Explicitly OUT of V1

**Unknown — propose** (draft below; ruthlessness required from the product owner per the
template — please amend/confirm):
- Commission/FLDG/partnership-terms negotiation ("What You Offer," R3) — `contract.md`
  states this is excluded by decision; no endpoint carries it.
- Join-approval workflow for a colleague joining an existing company page (mentioned as
  "invite-colleague" in Stage 4 of onboarding, but no approval/moderation flow specified).
- In-app messaging/chat between matched partners — only a structured request/accept/reject
  state machine exists, no free-form messaging beyond the `message` field on a response.
- Real-time/synchronous match computation — matches are cron-only, never computed inline.
- Mobile app (Flutter) support — no mention anywhere in prior work.
- Multi-tenant (Model-C) live behavior — `tenant_id` columns ship nullable/inert; only
  Model-A/B is real for V1.

## Section B.2 — Business rules already known

**PREFILLED — confirm** (extracted from `contract.md` / `engineering-brief.md` / migrations):
- Company profile writes **merge** into `core_channel.data → connect_profile` JSON — never
  overwrite the column.
- `branch_count` is **derived**, `COUNT(onb_location)` — not stored.
- Profile **publish is blocked (409)** without entity-type-mandatory credentials: `bc` → RBI
  BC empanelment; `collection_agency` → RDAI; `property_agency` → IBBI; `legal_agency` → Bar
  Council.
- Contact/PII (mobile, email) is **gated**: visible in `DirectoryEntry` only when the caller
  is a lender-type entity with `aum ≥ ₹100 Cr`; otherwise null + `contact_locked_reason`.
  Never present in list views.
- A listing can only be acted on by its **owning channel** — else 403.
- Connect-request state machine: `PENDING → ACCEPTED | REJECTED`; acting on a non-`PENDING`
  response → 409. Duplicate pending request to the same target → 409.
- Requirement publish (`DRAFT → LIVE`) **enqueues** match generation; matches are always
  precomputed by cron (`GenerateMatches`, top-10 per listing) — the read endpoint never
  computes inline.
- Onboarding email-domain detection (`PERSONAL_EMAIL_DOMAIN` lookup) branches into 3
  scenarios: personal email / domain-already-on-platform / new domain.
- Entity type drives `role` + `category` (`CHANNEL_ENTITY_TYPE` lookup config: role ∈
  {DSA, LSP, BC, OWNBOOK, COLENDER, SERVICE}; category ∈ {SOURCING, MERCHANT, SERVICING}).
- Digital Capabilities stage (Company Profile C5) is **LSP-only**, conditionally skipped for
  every other entity type.

## Delta notes — remaining sections (vs. existing artifacts, not re-elicited)

- **A (rest):** Personas = the 7 named in the user's own description (DSA, Lender, BC, LSP,
  Verification Agency, Collection Agency, Legal Agency) + an implicit 8th "Admin" persona
  surfacing only in today's `fingrid-connect-app.html` (login + admin/user toggle) — **not
  yet named as a persona anywhere else; needs an owner decision on whether Admin is in-scope
  for this SDD run or a separate item.**
- **C (test spec):** No worked money examples needed — Connect **stores** figures (AUM,
  disbursal, ticket size) entered by users; it does not **compute** money (no payroll/TDS/FLDG/
  IRR-style derivation). Per C.2's rule, this is the required explicit owner statement rather
  than silence — **please confirm this reading is correct.**
- **D (UI):** Screen inventory is the reconciliation problem itself — see 0.6/L3 above. No
  Flutter/mobile screens per A.4.
- **E (data):** Entities and tables already exist (see L4 in 0.6) — L4 backfill doc should
  document, not redesign, unless the review below finds gaps.
- **F (API):** Idempotency already has a guard for the one operation that needed it (duplicate
  connect-request → 409). No payment/filing-style idempotency risk identified.
- **G (engineering/config):** No nuera-ai — this is pure business logic/matching, not
  OCR/ML/NLP. No OPS-tunable params identified yet (e.g., the ₹100 Cr AUM gate and the top-10
  match cap are currently hardcoded — candidates for an L4b OPS param if Ops needs to tune them
  without a deploy; **owner call needed**).
- **H (release/GTM):** Unknown — propose: first deployment target is likely the internal
  Fingrid tenant (per the user's framing: "community facing module ... with internal admin
  view"), platform-wide feature rather than a single named client. **Needs confirmation.**

---

## Grading (Step 3)

**Blocking-weak — resolved 2026-07-22:**
- **0.7 Client driver & deadline — still open.** Not addressed in this ruling round; needs an
  answer before this spec can formally leave Draft status, even though it doesn't block
  ongoing technical work.
- ~~0.8 Spec owner / Tech Lead / QA owner~~ — **RESOLVED**: Sreedhar (Product/Spec Owner),
  Sudharson (Developer/Tech Lead). QA owner still unnamed.
- ~~A.4 V1 exclusions~~ — **RESOLVED**: owner confirmed the "What You Offer" (commission/FLDG)
  exclusion directly; join-approval exclusion also confirmed (no approval step exists/wanted).

**Weak-but-nonblocking, resolved:** 0.3 legal/property-agency OS mapping — **RESOLVED**,
Connect doesn't gate by OS at all, question dissolves.

**Still weak-but-nonblocking:** 0.2 category split, C.2 money statement, H.1 deployment
target, G.2 OPS-tunable params.

---

## Output Checklist
- [x] Every section present (Section 0 full; A.4/B.2 full; rest as delta notes per Rule 1 fill type)
- [x] Every prefill confirmed or removed — 0.3, 0.8, and A.4 confirmed by owner 2026-07-22; remaining items are non-blocking
- [ ] Blocking-weak list empty — **0.7 (client/deadline) is the only item still open**
- [x] Route + expected artifact list stated at top
- [ ] Tracker row updated; PR opened — tracker status updated to `⏳` in this pass; no PR (per
      your call, filed in `fingrid-apex/docs/sdd/connect/` rather than a `fingrid-docs` repo)
