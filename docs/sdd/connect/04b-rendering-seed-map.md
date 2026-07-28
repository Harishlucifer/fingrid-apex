# Rendering & Seed Map — Fingrid Connect

**Module:** Fingrid Connect (`CONNECT`)
**Owner:** Sudharson (Tech Lead — classification) + Implementation Consultant (seed review, still TBD)
**Status:** Draft
**Inputs:** `02-feature-spec.md` v1.0 §4b/§4c, `03-html-ui-reconciliation.md` (L3 provisional annotations), `04-db-schema.md` v1.1 (final DDL)

---

## Step 1 — Classification (CRUD-shape test)

Every L2 §4c step and L3 screen, classified per `references/rendering-decision-guide.md`.
Where this disagrees with the L3 provisional annotation, the flip and reason are recorded —
**schema wins**.

### WF1 — User & Identity Onboarding

| Step | Class | Reasoning |
|---|---|---|
| Enter email | FORM_BUILDER | Single field, single conceptual write |
| Company resolution (search/create-stub/join) | CUSTOM | Multi-table read (platform companies + MCA master), live autocomplete, BR-14 branching — matches L3's own annotation |
| Entity-type lock/select | FORM_BUILDER | Single select field |
| Verify email OTP | HYBRID | Form step + named widget `OtpInput` (async send/resend/verify round-trip beyond a plain field rule) |
| Name/mobile/designation/department/loan-type/territory | FORM_BUILDER | Repeatable rows (territory, loan-type) are standard array-of-rows widgets, not computation |
| Verify mobile OTP | HYBRID | Same as email OTP — widget `OtpInput` |
| Contact-visibility + interests + notifications | FORM_BUILDER | Single-row write into `core_channel_user.preferences` JSON |
| Company now/later/invite-colleague | FORM_BUILDER | Simple choice + optional email field |
| Welcome (access chips, next-step cards) | CUSTOM | Computed display (access gated by BR-11-adjacent entity+AUM logic), not data entry |

### WF2 — Company Profile (C1–C6)

| Step | Class | Reasoning |
|---|---|---|
| C1 Legal Identity | FORM_BUILDER | Single-row write to `onb_entity` |
| C2 Operations & Volume | **HYBRID** | Form step + named widget `DynamicTable` for repeatable branches/geography/loan-mix rows. **Correction:** branches actually bind to `connect_profile.branches` JSON, not `onb_location` (`onb_location` is read-only legacy fallback — see `04-db-schema.md`); geography/loan-mix rows bind to `core_channel_territory`/`core_channel_loan_type` as originally noted |
| C3 Staff & Capacity | **HYBRID** | Form step + `DynamicTable` widget for `staff_by_role` repeatable rows |
| C4 Empanelments & Credentials | **HYBRID** | Form step + named widget `CredentialChecklist` — highlights the entity-type-mandatory credential (BR-03) against the generic credential-type dropdown; plain FORM_BUILDER can't express the entity-type-conditional requirement |
| C5 Digital Capabilities *(LSP-only)* | FORM_BUILDER (step itself) | Simple toggle/field capture. **BR-16 gap carried from L3**: the conditional skip-for-non-LSP is wizard-shell (CUSTOM, built once) logic — not yet implemented anywhere; this classification covers the form only, not the skip behaviour |
| C6 Verify & Publish | CUSTOM | Computed `completion%`/`verification_tier` display + per-claim vetting list + BR-03-gated publish action |

### WF3 — Requirement Listing (R1, R2, R4, R5 — R3 removed, confirmed by owner 2026-07-22)

| Step | Class | Reasoning |
|---|---|---|
| R1 Type & Context | FORM_BUILDER | Select + textarea + multi-select |
| R2 What You Need | FORM_BUILDER | Standard fields, geography multi-select |
| R3 What You Offer | **N/A — CONFIRMED removed** | Owner ruled 2026-07-22: not required. Removed from `connect-flow-prototype.html` at that pass, not just excluded on paper. |
| R4 Counterparty Criteria | FORM_BUILDER | Standard fields, multi-selects |
| R5 Review & Publish | CUSTOM | Computed summary of R1/R2/R4 + BR-06/BR-07-gated publish action (enqueues async cron) |

### WF4 — Match & Partnership Response

| Step / Screen | Class | Reasoning |
|---|---|---|
| Generation (cron) | N/A — system step, no screen | BR-08 |
| Review (ranked match cards) | CUSTOM | Computed scoring display, interactive cards — precedent "List/queue screens: CUSTOM always" |
| Directory browse | CUSTOM | Server-driven filter/pagination + BR-11-gated computed field |
| Directory detail (contact-gated) | CUSTOM | Same gate, single-record composed read |
| Connect Requests inbox (US-08) | CUSTOM | Precedent: "Approval/checker screens... queue of multiple pending items → CUSTOM (queue + decision panel)". This is a queue (multiple pending rows), not a single-record accept/reject, so it does **not** qualify for the HYBRID exception in the precedent table. |
| My Partners list (US-09) | **CUSTOM — FLIPPED from L3's provisional FORM_BUILDER** | L3's `03-html-ui-reconciliation.md` provisionally annotated this "likely FORM_BUILDER — read-only list, no workflow logic." The precedent table is explicit: **"List/queue screens: CUSTOM always."** Schema/precedent wins per L4b Rule 1 — flipping to CUSTOM. Reason for the flip: even a read-only list is still a list/queue, and the undirected `channel_a_id`/`channel_b_id` query noted in `04-db-schema.md` means the read is a small composed query, not a single-table passthrough a form-builder list view could serve. |
| Dashboard (Overview) | CUSTOM | Composed dashboard, multiple live stat cards — explicit CUSTOM trigger per decision guide |
| Home / Login / Welcome auth shell | **Out of this module's build-list** | Platform-level auth shell, not module-specific FORM_BUILDER/CUSTOM — no seed entry needed; pre-existing platform concern |

**Flip summary (for L3 annotation tuning):** 1 flip recorded — My Partners list,
FORM_BUILDER → CUSTOM.

---

## Step 2 — Form Definitions (FORM_BUILDER / HYBRID steps only)

All bindings cross-checked against `04-db-schema.md` v1.1 — no phantom columns.

### CONNECT_ONBOARD_IDENTITY_FORM
| Field | Column | Type | Rules |
|---|---|---|---|
| email | *(not a stored column pre-verification — resolved to `core_channel` domain match at submit)* | TEXT | required, email format |

### CONNECT_ONBOARD_ENTITY_TYPE_FORM
| Field | Column | Type | Rules |
|---|---|---|---|
| entityType | `core_channel.entity_type` | SELECT | required, lookup: `CHANNEL_ENTITY_TYPE` |

### CONNECT_ONBOARD_DETAILS_FORM
| Field | Column | Type | Rules |
|---|---|---|---|
| firstName / lastName | *(no separate first/last columns exist — `core_channel_user` has no name split found in L4; binds to platform user profile, out of Connect's own DDL)* | TEXT | required — **flag: verify against platform user table, not re-specified here** |
| designation | `core_channel_user.designation` | TEXT | required |
| department | `core_channel_user.department` | SELECT | optional, lookup: department enum (not yet in `core_lookup_master` — **gap, needs a lookup group added**) |
| territory[] | `core_channel_user_territory.territory_name` (+ resolved `territory_id`) | ENTITY_REF (multi) | required, min 1 |
| loanType[] | `core_channel_user_loan_type.loan_type_name` (+ resolved `loan_type_id`) | ENTITY_REF (multi) | optional |
| linkedinUrl | `core_channel_user.linkedin_url` | TEXT | optional, URL format |

### CONNECT_ONBOARD_PREFS_FORM
| Field | Column | Type | Rules |
|---|---|---|---|
| mobileVisibility / emailVisibility / linkedinVisibility / territoryVisibility / lookingFor / notifyEmail | all inside `core_channel_user.preferences` JSON | SELECT | optional — no per-key validation found in code, **gap carried from `02-feature-spec.md`** |

### CONNECT_ONBOARD_COMPANY_LINK_FORM (post-decision step only — the search itself is CUSTOM)
| Field | Column | Type | Rules |
|---|---|---|---|
| mode | *(routing only, not persisted)* | — | required, oneof: new, join |
| legalName / pan / cin / incorporationYear / registeredState / website | `onb_entity.*` | TEXT/NUMBER | per `04-db-schema.md` C1 mapping |

### CONNECT_COMPANY_LEGAL_FORM (C1)
| Field | Column | Type | Rules |
|---|---|---|---|
| legalName | `onb_entity.legal_name` | TEXT | required |
| pan | `onb_entity.primary_id` | TEXT | required — **no PAN format validation found in code (`02-feature-spec.md` gap)** |
| cin | `onb_entity.secondary_id` | TEXT | optional |
| incorporationYear | `onb_entity.*` | NUMBER | optional |
| registeredState | `onb_entity.*` | SELECT | optional, lookup: state master |
| website | `onb_entity.*` | TEXT | optional, URL format |

### CONNECT_COMPANY_OPERATIONS_FORM (C2 — HYBRID, DynamicTable slot for arrays)
| Field | Column | Type | Rules |
|---|---|---|---|
| aum | `core_channel.data.connect_profile.aum` (JSON) | MONEY | optional — **no min/max enforced, gap** |
| monthlyDisbursal | `core_channel.data.connect_profile.monthly_disbursal` (JSON) | MONEY | optional |
| branches[] *(DynamicTable slot)* | `core_channel.data.connect_profile.branches` (JSON) | — | array, stored directly in JSON (corrected — not `onb_location`, see above); `branch_count` is derived from this array's length, falling back to `COUNT(onb_location)` only when the array is empty (BR-02, corrected) |
| geography[] *(DynamicTable slot)* | `core_channel_territory.territory_id` | ENTITY_REF (multi) | optional |
| products[] *(DynamicTable slot)* | `core_channel_loan_type.loan_type_id` | ENTITY_REF (multi) | optional — **binds via `channel_territory_id`, not directly to channel** (see `04-db-schema.md` note) |
| loanMix[] | `core_channel.data.connect_profile.loan_mix` (JSON) | — | `{loan_type, monthly_amount}` per row |

### CONNECT_COMPANY_STAFF_FORM (C3 — HYBRID)
| Field | Column | Type | Rules |
|---|---|---|---|
| totalStaff / fieldStaffCount | `core_channel.data.connect_profile.*` (JSON) | NUMBER | optional — **no `field_staff_count ≤ total_staff` cross-check, gap** |
| staffByRole[] *(DynamicTable slot)* | `core_channel.data.connect_profile.staff_by_role` (JSON) | — | `{role, count, locations}` per row |

### CONNECT_COMPANY_EMPANELMENT_FORM (C4 — HYBRID, CredentialChecklist slot)
| Field | Column | Type | Rules |
|---|---|---|---|
| empanelments[] | `onb_empanelment.*` | — | array |
| credentials[] *(CredentialChecklist slot)* | `onb_document.*` | FILE + SELECT | type, registration_no, document_id — checklist widget highlights the BR-03 mandatory type for this channel's `entity_type` |

### CONNECT_COMPANY_DIGITAL_FORM (C5 — LSP-only)
| Field | Column | Type | Rules |
|---|---|---|---|
| mobileApp / partnerPortalUrl / bureauIntegrations / iso27001 / vaptFirm / apiReady | `core_channel.data.connect_profile.capabilities` (JSON) | mixed | optional — **no server-side rejection of this block for non-LSP entity types found (`02-feature-spec.md` gap)** |

### CONNECT_REQUIREMENT_TYPE_FORM (R1)
| Field | Column | Type | Rules |
|---|---|---|---|
| partnershipType | `core_partnership_listing.partnership_type` | SELECT | required (BR-05), lookup: 9 `seek_*` values |
| context | `core_partnership_listing.data.context` (JSON) | TEXTAREA | optional |
| products[] | `core_partnership_listing.data.products` (JSON) | SELECT (multi) | optional |

### CONNECT_REQUIREMENT_NEED_FORM (R2)
| Field | Column | Type | Rules |
|---|---|---|---|
| need.geography.states/districts | `core_partnership_listing.data.need.geography` (JSON) | ENTITY_REF (multi) | optional |
| need.targetVolume | `core_partnership_listing.data.need` (JSON) | TEXT | optional |
| need.ticketMin / ticketMax | `core_partnership_listing.data.need` (JSON) | MONEY | optional — **no min≤max cross-check, gap** |
| need.casesPerMonth | `core_partnership_listing.data.need` (JSON) | NUMBER | optional |
| need.expectedTat | `core_partnership_listing.data.need` (JSON) | TEXT | optional |

### CONNECT_REQUIREMENT_CRITERIA_FORM (R4)
| Field | Column | Type | Rules |
|---|---|---|---|
| criteria.minVerificationTier | `core_partnership_listing.data.criteria` (JSON) | SELECT | optional, oneof TIER_0..TIER_3 |
| criteria.minAum / minSourcingCapacity | same | MONEY | optional |
| criteria.minBranches / minFieldStaff | same | NUMBER | optional |
| criteria.geography.states | same | ENTITY_REF (multi) | optional |
| criteria.certifications | same | SELECT (multi) | optional |

**Skipped (no form needed):** R5 Review & Publish (CUSTOM, computed summary only, its
`visibility`/`listing_status` fields are single-value publish-action inputs bound directly in
the CUSTOM component, not a separate form).

---

## Step 3 — Seed YAML

See `seeds/connect-seed.yaml` (sibling file, same directory). Summary of contents:
module registry entry, `CHANNEL_ENTITY_TYPE`/`PERSONAL_EMAIL_DOMAIN` lookups (already seeded
by the v1.0 migration itself — reproduced here for seed-YAML completeness/idempotency, not a
second seeding), 4 workflow definitions (verbatim from L2 §4c), 15 form definitions (Step 2
above), rollback block.

**Nav / role visibility — RESOLVED 2026-07-22 (owner ruling):** Connect does not gate by OS at
all — it's platform-level, visible regardless of tenant product line. The seed YAML now ships
a single `os: ALL` nav entry instead of one row per named OS. This also dissolves the earlier
Legal Agency / Property Agency mapping question (`01-product-spec.md` OQ #2) — they don't need
an OS home either, since nothing in Connect is OS-scoped for any entity type. The seed file's
former "DO NOT MERGE" warning has been removed accordingly.

---

## Step 3b — OPS Parameters Table

Both tunables found hardcoded in `alpha-api` service code during the L2/L4 passes, now formally
routed to Studio-managed parameters instead of staying code constants:

| Key | Type | Default | Safe Range | Description | managed_by |
|---|---|---|---|---|---|
| `CONNECT_CONTACT_GATE_MIN_AUM_CR` | NUMBER | 100 | 10–1000 | BR-11: minimum AUM (₹ Cr) a lender-type channel needs to see gated contact info in the Directory | OPS |
| `CONNECT_MATCH_TOP_N` | NUMBER | 10 | 3–50 | BR-08: max candidates the match cron keeps per listing (`matchTopN` in `match.go`) | OPS |
| `CONNECT_OTP_RESEND_COOLDOWN_SECONDS` | NUMBER | 30 *(proposed — not found in code; WF1 OTP is fully stubbed, see `02-feature-spec.md` EC-03)* | 15–120 | Resend cooldown once WF1 leaves demo-OTP mode | OPS |

Defaults ride the seed YAML as insert-if-absent — never overwrite a live Ops value. Actual
code (`match.go`'s `const matchTopN = 10`, and the `contact gate ≥ 100` check in the
not-yet-implemented directory service) will need to read from Studio config instead of a Go
constant before this table is anything more than aspirational — **flagged as an L6b follow-up,
not done in this pass**.

---

## Step 3c — Test-Spec BOUND-state trigger

`02b-test-spec.md` was authored BEHAVIORAL alongside L2, before this classification existed.
Now that Step 1's classification is final: **no cases in that spec need FORM_BUILDER pruning**
— every WF2/WF3/WF4 test case written so far targets CUSTOM steps or cross-cutting BRs (BR-01
through BR-16), not a plain FORM_BUILDER field-validation path that the platform's own
form-engine parity suite would already cover. This is because the BEHAVIORAL pass focused on
business-rule enforcement, not per-field UI validation — nothing to mark `COVERED-BY-PARITY`.
QA owner should still re-read `02b-test-spec.md` against this map before L6b's first commit,
per the mandatory BOUND-state gate.

---

## Step 4 — Hand-off Lists

**L5 skip-list (FORM_BUILDER/HYBRID steps — ride the platform form-engine, L5 does not need
bespoke contracts for these):** CONNECT_ONBOARD_IDENTITY_FORM, CONNECT_ONBOARD_ENTITY_TYPE_FORM,
CONNECT_ONBOARD_DETAILS_FORM, CONNECT_ONBOARD_PREFS_FORM, CONNECT_ONBOARD_COMPANY_LINK_FORM
(the form portion only — the search/decision logic ahead of it is still CUSTOM),
CONNECT_COMPANY_LEGAL_FORM, CONNECT_COMPANY_OPERATIONS_FORM, CONNECT_COMPANY_STAFF_FORM,
CONNECT_COMPANY_EMPANELMENT_FORM, CONNECT_COMPANY_DIGITAL_FORM, CONNECT_REQUIREMENT_TYPE_FORM,
CONNECT_REQUIREMENT_NEED_FORM, CONNECT_REQUIREMENT_CRITERIA_FORM.

**L8 build-list (CUSTOM — this is the whole React scope, nothing else):** Company resolution
(search/create-stub/join widget), Welcome access-chips view, C6 Verify & Publish (completion%
+ vetting list + publish guard), R5 Review & Publish (summary + publish guard), Match Review
cards, Directory browse + detail (contact-gated), Connect Requests inbox (queue + decision
panel), My Partners list (flipped to CUSTOM this pass), Dashboard Overview. Named custom
widgets needed inside HYBRID steps: `OtpInput`, `DynamicTable`, `CredentialChecklist` — build
once, reuse across every stage that needs them (matches `fingrid-connect-integration-plan.md`'s
own "Shared UI primitives to build once" list almost exactly).

**Renders-from-seeds statement (Golden Rule 17 gate — NOT yet executed, this is the intended
sequence):**
```
1. Provision a fresh tenant DB.
2. Run goose migrations: 20260710120000_FINGRID_CONNECT_ONBOARDING,
   20260720120000_FINGRID_CONNECT_PARTNERSHIP (plus every prior baseline migration
   core_channel/onb_* depend on).
3. go run cmd/configseed --tenant=<fresh-tenant> --file=seeds/connect-seed.yaml
4. Confirm: module CONNECT appears in nav for a user seeded with each visible role;
   CONNECT_ONBOARDING workflow renders start-to-finish from seed alone, no code-side
   hardcoded stage list required.
```
**Not yet verified against a real fresh tenant** — `cmd/configseed` and the nav-rendering
pipeline were not exercised in this SDD pass. This is the explicit prerequisite L9 gate; do not
start L9 integration work until step 4 above has actually been run and confirmed once.

---

## Output Checklist

- [x] Every step classified with CRUD-shape reasoning noted for CUSTOM calls
- [x] All bindings verified against L4 DDL — no phantom columns (cross-checked `core_channel_territory`/`core_channel_loan_type` existence directly in `alpha-api` migrations + Go models before binding)
- [x] Seed YAML idempotent + rollback (delete-by-code) block present (see `seeds/connect-seed.yaml`)
- [x] L5 skip-list and L8 build-list emitted
- [ ] Renders-from-seeds statement — sequence stated, **not yet executed/confirmed** against a real fresh tenant
