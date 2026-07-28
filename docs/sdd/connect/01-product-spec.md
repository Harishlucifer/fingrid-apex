# Product Spec — Fingrid Connect

**Module:** Fingrid Connect
**Parent Module:** Platform & Onboarding / Lending & Marketplace *(dual — see Open Questions)*
**Spec Owner:** Sreedhar
**Status:** Draft
**Current Version:** 1.2

## Changelog
| Ver | Date | Author | CR Reference | Summary |
|-----|------|--------|--------------|---------|
| 1.0 | 2026-07-22 | Claude (backfill from 00-inputs.md) | — | Initial spec, reverse-authored from existing L3/L4/L5/L6a/L6b artifacts |
| 1.1 | 2026-07-22 | Sreedhar (owner rulings, recorded by Claude) | — | Resolved: OS-gating doesn't apply (dissolves Legal/Property Agency OQ); join-approval and What-You-Offer confirmed Out of Scope; owner names supplied |
| 1.2 | 2026-07-22 | Sudharson's boss (stakeholder feedback, recorded by Claude) | — | Skin target re-resolved: prototype read as internal-facing, re-themed to fingrid-apex's real production theme (navy/blue/mint, gradient CTAs) |

---

## Problem Statement

DSAs, Lenders, BCs, LSPs, Verification Agencies, Collection Agencies, Legal Agencies, and
Property Agencies today find and vet business partners through phone calls, personal
networks, and unverified claims — with no shared place to publish credentials, discover
counterparties that meet a stated need, or track a partnership request from ask to
agreement. This results in slow partner discovery, no way to confirm a counterparty's scale
or compliance credentials before engaging them, and missed matches between organisations that
would otherwise work well together. Fingrid Connect solves this by giving every player a
verified company profile, a structured way to publish what they need or offer, and an
automated match engine that surfaces qualified counterparties.

## User Personas

| Role | Actions in Module | Primary Need |
|------|------------------|--------------|
| DSA (Individual / Firm) | Onboard, publish company profile, browse directory, post/respond to requirements | Discoverability by lenders; credibility signal (verification tier) |
| LSP / Aggregator | Same as DSA + Digital Capabilities stage (API/app/bureau integration claims) | Show integration maturity to lenders |
| Business Correspondent (BC) | Same as DSA; publish requires RBI BC empanelment credential | Prove regulatory standing before being discoverable |
| Lender (NBFC / Bank / HFC) | Publish sourcing requirements (seek DSA/BC/LSP/co-lender), browse directory with contact access, respond to connect requests | Fast, credentialed sourcing-partner discovery at scale |
| Co-Lending NBFC | Same as Lender + `seek_colender` requirement type | Find compliant co-lending partners |
| Verification Agency | Publish profile + credentials, respond to `seek_verif` requirements | Get discovered by lenders/BCs needing verification services |
| Collection Agency | Publish profile + RDAI credential, respond to `seek_collection` requirements | Same, for collections work |
| Legal Agency | Publish profile + Bar Council credential, respond to `seek_legal` requirements | Same, for legal/repossession work |
| Property Agency | Publish profile + IBBI credential, respond to `seek_property` requirements | Same, for valuation/property work |

*(Retracted: an earlier draft of this table listed a separate internal "Admin" persona based
on `tbAdmin`/`tbUser` element IDs in `fingrid-connect-app.html`. Direct inspection at L3
confirmed these are just topbar display-state toggles — the normal logged-in user's name chip
vs. an in-progress "Creating account…" state — not a distinct role. No internal/ops persona
exists in any prototype. See `03-html-ui-reconciliation.md`.)*

*Role names above are drawn from the `CHANNEL_ENTITY_TYPE` lookup config, not yet checked
against the Fingrid RBAC role registry — **Human Verification Ledger item**.*

## Scope — V1

### In Scope (V1)
- **WF1 — User & Identity Onboarding:** email-domain detection (personal / on-platform /
  new-domain), email + mobile OTP, entity-type selection or lock, designation/department,
  loan-type/territory tagging, contact-visibility preferences.
- **WF2 — Company Profile:** Legal Identity → Operations & Volume → Staff & Capacity →
  Empanelments & Credentials (entity-conditional mandatory) → Digital Capabilities (LSP-only) →
  Verify & Publish, with a computed completion/verification tier.
- **WF3 — Partnership Requirement Capture:** Type & Context → What You Need → Counterparty
  Criteria → Review & Publish (see Out of Scope re: "What You Offer").
- **WF4 — Partnership Match:** cron-generated ranked candidates per live requirement,
  directory search/browse with contact gating, connect-request / accept / reject, and
  established-relationship tracking.

### Out of Scope (V1)
- **Commission / FLDG / partnership-terms negotiation** ("What You Offer," R3) — **confirmed
  by owner 2026-07-22, not required.** Pricing/terms discussion is an off-platform negotiation
  once parties connect, not a structured data capture problem. The R3 stage is being removed
  from the prototype (was live with conflicting required fields — see `03-html-ui-reconciliation.md`).
- **Join-approval workflow** for a colleague joining an existing company page — **confirmed by
  owner 2026-07-22: no approval step exists or is wanted.** Joining is instant. (The
  prototype's copy claiming a "Page Admin" approval step was wrong and has been corrected.)
- **In-app messaging** between matched partners — deferred; only the structured
  request/accept/reject state machine ships in V1, with a single free-text `message` field.
- **Real-time/synchronous match computation** — matches are cron-generated only; deferred
  because inline scoring at request time was not costed for V1 load.
- **Mobile (Flutter) app support** — deferred; no mobile persona identified in prior work.
- **Multi-tenant (Model-C) live behaviour** — `tenant_id` columns ship nullable/inert for
  future readiness only; deferred until Model-C is prioritised elsewhere on the roadmap.

*(Out-of-scope list drafted from `00-inputs.md` §A.4 — flagged there as Claude-proposed,
not yet owner-confirmed. **Human Verification Ledger item.**)*

## Business Objectives

*(Unknown — propose: no target metrics were supplied in 00-inputs §0.7. Drafted for owner
confirmation — **Human Verification Ledger item.**)*

| Objective | Metric | Target |
|-----------|--------|--------|
| Fast credentialed onboarding | Time from signup start to published company profile | < 20 minutes for a returning-domain company, < 2 business days where a new credential upload/verification is required |
| Reliable verification signal | % of published profiles with all entity-type-mandatory credentials on file | 100% (enforced by the 409 publish guard already in code) |
| Requirement-to-match latency | Time from requirement publish to first ranked match appearing | < 24 hours (one cron cycle) |
| Marketplace liquidity | % of published, live requirements that receive at least one connect request within 30 days | > 50% |
| PII discipline | % of directory views where contact info is exposed outside the AUM≥₹100 Cr gate | 0% (already enforced server-side) |

## Assumptions and Dependencies

### Assumptions
- The onboarding identity tables (`core_channel`, `core_channel_user`, `onb_entity`,
  `onb_location`, `onb_document`, `onb_empanelment`) already exist from the base
  onboarding/partner module and Connect extends them rather than owning them outright.
- RBAC roles for each entity type are configured in the platform's role-permission module
  (not verified against this spec — see Human Verification Ledger).
- A cron/scheduler infrastructure exists to run the `PARTNERSHIP_MATCH` job.
- Company search at onboarding (MCA master / employer master) is served by the existing
  `GET /v1/employer/` lookup, not a new integration.

### Dependencies
| Dependency | Type | Notes |
|------------|------|-------|
| Onboarding / Partner module (`onb_*`, `core_channel*`) | Internal | Identity, legal entity, location, document, empanelment records Connect reads/writes into |
| Lookup / Config Master (`core_lookup_master`) | Internal | Entity types, personal-email-domain list, product/state dropdowns |
| Role & Permission module | Internal | RBAC roles per entity type — **not yet cross-checked** |
| Scheduler / Cron worker | Internal | Runs `GenerateMatches` (WF4) |
| SMS/Email OTP gateway | External | WF1 email + mobile OTP (currently stubbed with demo code `123456` per `fingrid-connect-integration-plan.md`) |

## Non-Functional Requirements

| Requirement | Expectation |
|-------------|-------------|
| Performance | p95 < 1s on all interactive endpoints (profile, listing, directory reads/writes); match generation is async, no API SLA |
| Availability | 99.9% uptime; 1000+ concurrent users |
| Timezone | All timestamps in Asia/Kolkata (IST) |
| Data Privacy | Contact PII (mobile/email) never returned outside the lender + AUM≥₹100 Cr gated path; never in list views |
| Data Sensitivity | No Aadhaar data touched by this module *(unconfirmed — **Human Verification Ledger item**, per Golden Rule 15's zero-cloud Aadhaar handling elsewhere in Fingrid)* |
| Compliance | Entity-type-mandatory credentials (RBI BC empanelment, RDAI, Bar Council, IBBI) must be on file before a profile can publish |

---

## Open Questions

1. **Parent module / category** — Connect spans Platform&Onboarding and Lending&Marketplace;
   which owns spec governance? (00-inputs §0.2)
2. ~~Legal Agency / Property Agency product-line mapping~~ — **Resolved 2026-07-22**: Connect
   does not gate by OS at all; it's platform-level regardless of tenant product line. This
   dissolves the question for these two entity types along with every other one. See
   `00-inputs.md` §0.3 and the nav-seed correction in `seeds/connect-seed.yaml`.
3. ~~Admin persona scope~~ — **Resolved at L3**: no separate Admin persona exists in any
   prototype; retracted (see Personas table note above).
4. **Business objective targets above are proposed, not owner-supplied** — need confirmation
   or replacement.
5. ~~Join-approval~~ — **Resolved 2026-07-22**: no approval step exists or is wanted — joining
   an existing company is instant. `fingrid-connect-app.html`'s "a Page Admin approves your
   access" copy was wrong and has been corrected in the prototype (see
   `03-html-ui-reconciliation.md`). Join-approval stays Out of Scope V1, confirmed.
6. ~~Skin target~~ — **Re-resolved 2026-07-22**: the earlier call (keep `fingrid-connect-app.html`'s
   own design system) was overturned by actual stakeholder feedback (looked internal-facing,
   not customer-facing). Now re-themed to `fingrid-apex`'s real production theme (navy/blue/mint,
   gradient CTAs, rounded-2xl cards). See `03-html-ui-reconciliation.md`.

## Human Verification Ledger

Items generated without a merged owner answer in 00-inputs.md — require explicit sign-off
before this spec moves from Draft to Active:
- [x] Admin persona claim retracted after direct L3 inspection — no longer needs verification
- [ ] Persona role names checked against the actual Fingrid RBAC role registry
- [x] Out-of-scope list (A.4) confirmed by product owner (2026-07-22: What You Offer / commission-FLDG, and join-approval, both confirmed excluded)
- [ ] Business objective targets confirmed or replaced by product owner
- [ ] Aadhaar/zero-cloud statement confirmed as not-applicable to this module
- [ ] Client driver & deadline (00-inputs §0.7) supplied
- [x] Spec/Tech Lead owner names supplied (00-inputs §0.8: Sreedhar / Sudharson) — QA owner still unnamed
- [ ] Spec/Tech Lead/QA owner names (00-inputs §0.8) supplied
