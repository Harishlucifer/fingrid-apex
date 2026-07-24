# Fingrid Connect — Integration Plan

**STATUS UPDATE (2026-07-22): implemented.** This plan's Phase 0 foundation and Phases 1–4
screen ports are now built at `src/connect/` and routed at `/connect/*` in `App.jsx`. Two
things changed from what's written below, both because reality moved on since this plan was
drafted: (1) the "mock/demo only" data-layer decision no longer applies to any workflow — a
real Go API was built in `alpha-api` (see `docs/sdd/connect/05-api-contracts.md`) and
`src/connect/services/connectApi.js` calls it directly, including WF1 (onboarding): both
new-registration (`POST /v1/partner/create` via a no-credentials guest token) and
returning-user sign-in (`POST /v1/auth/login-with-otp`) are real, closing what was originally
an open auth-bootstrap question. (2) The visual
system is NOT apex's navy/mint Tailwind theme this plan describes — after stakeholder
feedback the module was themed to match `fingrid-connect-v5.html`/`stage1_email`'s own teal/
Crimson-Pro/Work-Sans system instead (see `docs/sdd/connect/03-html-ui-reconciliation.md`).
The architecture below (Context+reducer store, shared primitives, route list) is otherwise
still accurate to what was built. Kept for historical reference rather than rewritten.

---

Integrating the **Fingrid Connect** workflows (from the two HTML prototypes) into the existing
`fingrid-apex` React application.

## Decisions (locked)

| Area | Decision |
|---|---|
| **Design system** | Re-skin Connect to apex **navy/mint + Inter** (drop teal / Crimson Pro) |
| **Data layer** | **Mock/demo only**, behind a service seam for later API swap |
| **Route / entry** | Dedicated **`/connect`** zone with its own layout |
| **OTP / auth** | Keep **demo code `123456`** (email + mobile), stubbed for later real auth |

---

## Context

### What exists today (`fingrid-apex`)
- React 18 + Vite + Tailwind + react-router-dom v6 + react-helmet-async.
- Marketing site with pages under `/products/...`.
- A `FinGrid Network` section is already scaffolded at `src/pages/network/` — `Register`,
  `Discover`, `Network`, `DealRoom`, `ProfileDueDiligence`, `Integrate` — but they are **empty
  one-line stubs** wrapping `ProductDetailPage`. The `/products/network/register` CTA is the
  natural entry point into Connect.
- Tailwind theme: `navy` / `mint` / `blue` palette, Inter font.

### The prototypes
Two standalone HTML + vanilla JS files with their own CSS design system (teal, Crimson Pro /
Work Sans). They overlap and together define "Fingrid Connect":

| Prototype | What it is |
|---|---|
| `stage1_email` | The **refined onboarding** — 4 stages + welcome, with email OTP, mobile OTP, MCA company-register search, personal / found / new-domain scenarios |
| `fingrid-connect-v5` | The **fuller platform** — rougher onboarding, plus **Company Profile** (6 stages), **Requirement Listing** (5 stages), and a **Dashboard hub** (overview + Directory + Matches) |

### Core reality: this is a port, not an embed
The HTML cannot be dropped in. The prototypes rely on global mutable state (`st`, `state`),
direct `document.getElementById` DOM mutation, inline `onclick`, and a different CSS token system.
Integrating means **rebuilding the flows as React components** driven by shared state. The
prototypes become the **spec + design reference + mock data source**, not the code. The logic
(entity-type rules, OTP, autocomplete filtering, match scoring, conditional stage skipping for
LSP/lender) translates almost 1:1.

---

## Architecture

**1. Reconcile the two prototypes into one canonical flow** (they duplicate Stage 1):
- **Onboarding / User Creation** → adopt `stage1_email`'s version (OTP + MCA search is better).
- **Company Profile (6 stages)**, **Requirement Listing (5 stages)**, **Dashboard / Directory /
  Matches** → from `fingrid-connect-v5`.

**2. Mount Fingrid Connect as an "app" zone**, separate from marketing chrome. It is stateful and
authenticated-feeling, unlike the marketing pages. Own layout (rail/stepper, no marketing
Navbar/Footer), under a `/connect` route namespace.

**3. Proposed structure**

```
src/connect/
  ConnectLayout.jsx           # rail + progress shell, no marketing nav
  state/ConnectContext.jsx    # Context + reducer: the single store (replaces `st`/`state`)
  data/                       # ports of prototype constants (mock layer)
    lenders.js  companyMaster.js  directory.js  platformCompanies.js
    entityTypes.js  designations.js  regCreds.js  partnershipTypes.js  vetClaims.js
  services/connectApi.js      # thin async seam over data/ so a real API swaps in later
  onboarding/  (Stage1..Stage4 + Welcome)
  company/     (Legal, Operations, Staff, Empanelments, Digital, Verify)
  requirements/(Type, Need, Offer, Criteria, Review)
  dashboard/   (Overview, Directory, Matches)
  components/  (OtpInput, EntitySearch, Stepper, Pills, PrivacyToggle, DynamicTable, ...)
```

**4. Shared UI primitives to build once** (repeated across all three workflows):
`OtpInput`, `EntitySearch` (autocomplete dropdown), `Stepper` / `ProgressRail`, `PillSelect`
(single + multi), `PrivacyToggle`, `DynamicTable` (add/remove rows), `Card`, `Alert`,
`EntityAvatar`.

**5. Routing** (nested under `/connect`, rendered inside `ConnectLayout`, outside marketing chrome):

| Route | Screen |
|---|---|
| `/connect/join` | Onboarding (4 stages + welcome) |
| `/connect/dashboard` | Dashboard hub |
| `/connect/company` | Company Profile workflow |
| `/connect/requirements/new` | Requirement Listing workflow |
| `/connect/directory` | Partner Directory |

---

## Design translation (applies to every screen)

The prototype tokens map cleanly to the existing theme — re-skinning is mechanical, not a redesign:

| Prototype | → apex equivalent |
|---|---|
| `--teal #00B09B` (primary/accent) | `mint` (accent) / `navy` (primary) — split by role |
| `--ink #1A2332` (headings) | `navy` |
| Crimson Pro (serif headings) | Inter (drop serif; use existing weights) |
| Work Sans (body) | Inter |
| teal progress / steppers / pills-on | mint accents on navy |

**Token role split to settle in Phase 0:** teal did two jobs in the prototypes — primary buttons
*and* accent/progress. In apex, `navy` reads as primary and `mint` as accent. So: primary CTAs →
navy; progress / success / selected-state → mint. Apply consistently.

---

## Phased delivery

### Phase 0 — Foundations (critical path)
1. `ConnectLayout.jsx` — app shell (left rail: stepper + progress; main content). No marketing nav.
2. `state/ConnectContext.jsx` — Context + reducer replacing global `st`/`state`. Holds:
   `email/domain/entityKey/isPersonal`, selected company, onboarding answers, company-profile
   stage completion, requirements array, directory filters, access flags.
3. `data/` — port prototype constants verbatim as ES modules (LENDER_DB, COMPANY_MASTER, DIR_DATA,
   PLATFORM_COMPANIES, ET + DESIG + DEPT + REG_CREDS, PT, VET_CLAIMS).
4. `services/connectApi.js` — async seam: `lookupDomain`, `searchCompanies`, `sendOtp`,
   `verifyOtp` (returns `code === '123456'`), `publishRequirement`, `getMatches`. Reads from
   `data/` now; real fetch later touches only this file.
5. Shared primitives (see list above).

### Phase 1 — Onboarding (`/connect/join`, from `stage1_email`)
- **Stage 1 Identity:** email → debounced domain detect → 3 scenarios (personal / domain-on-platform /
  new-domain) → company search (platform + MCA master) or create-stub / join-existing → entity-type
  lock or select → **demo email OTP** → continue.
- **Stage 2 Your Details:** name, work email (readonly), **demo mobile OTP**, designation pills +
  department (driven by entity type), loan-type pills, LinkedIn.
- **Stage 3 Preferences:** contact-visibility toggles (public / on-request / private), "looking for"
  interests, notifications.
- **Stage 4 Company:** now / later / invite-colleague choice → Complete Registration.
- **Welcome:** avatar, access chips (contact access gated by entity + AUM), next-step cards → Dashboard.

### Phase 2 — Dashboard hub (`/connect/dashboard`, from `fingrid-connect-v5`)
Overview (3 workflow status cards: user / company / requirements + quick access), **Directory**
(filter chips, search, detail pane with contact-gating by entity + AUM ≥ ₹100 Cr), **Matches**
(empty until a requirement is posted).

### Phase 3 — Company Profile (`/connect/company`, 6 stages)
Legal Identity → Operations & Volume → Staff & Capacity → Empanelments & Credentials
(entity-conditional mandatory creds) → **Digital Capabilities (LSP-only, conditionally skipped)** →
Verify & Publish. Preserves the prototype's conditional routing (skip digital stage for non-LSP).

### Phase 4 — Requirement Listing (`/connect/requirements/new`, 5 stages)
Type & Context (partnership types filtered by entity) → What You Need → What You Offer →
Counterparty Criteria → Review & Publish → pushes into ConnectContext and **auto-populates Matches**.

### Phase 5 — Polish
- Persistence: mirror ConnectContext to `localStorage` (survives refresh; demo-friendly).
- SEO via existing `src/components/SEO.jsx` on the entry route.
- Responsive pass (rail collapses on mobile), keyboard handling for OTP / autocomplete.
- Wire existing `/products/network/register` CTA → `/connect/join`.

### Routing changes (`src/App.jsx`)
Add a nested `/connect/*` group rendered inside `ConnectLayout` **outside** the marketing
`Navbar` / `Footer` wrapper (small layout refactor so Connect routes bypass marketing chrome).

---

## Effort shape
Phase 0 is the critical path — everything depends on the store + primitives. Phases 1–4 are then
largely independent screen ports. Phase 1 (onboarding) alone gives a demoable, self-contained flow
if sequencing for an early milestone.

## Suggested next step
Write out the **ConnectContext state shape** + **primitive component contracts** (props / state)
before building. Once agreed, the rest falls into place fast.
