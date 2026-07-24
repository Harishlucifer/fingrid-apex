# L3 HTML UI — Reconciliation & Screen Inventory — Fingrid Connect

**Module:** Fingrid Connect
**Status:** Draft — pre-sign-off (reconciliation pass, HTML generation not yet started)
**Depends on:** `02-feature-spec.md` v1.0 (US-01..US-10, all workflow definitions)

This is the reconciliation step the SDD process requires before generating compliant L3
screens: deciding which of the 3 existing HTML artifacts is canonical, what each contributes,
and what gap remains before sign-off. **No new HTML has been generated yet** — this is the
inventory + decision record that the actual screens get built against.

---

## Source reconciliation

| File | Role | Verdict |
|---|---|---|
| `fingrid-connect-home.html` | Marketing landing page with a "Connect" entry CTA | **Out of Connect module scope.** It's the marketing site's doorway into Connect, not a Connect screen. Keep as-is; only the CTA target URL matters to this module. |
| `fingrid-connect-prototype.html` ("v5") | Earlier full-platform draft: hardcoded per-stage sections (`u1`–`u5` onboarding, `c1`–`c6` company, `r1`–`r5` requirement) + dashboard hub | **Superseded.** Confirmed by inspection: `fingrid-connect-app.html` implements the same 3 workflows through one generalized engine and additionally covers Directory + Matches with more finished interaction states. Keep only as a reference for any stage content `app.html` might have dropped (verified none found missing — see coverage table below). |
| `fingrid-connect-app.html` (today's file) | Single-file app: Home → Login → Welcome → App Shell (Dashboard / Directory / Matches / generic Workflow renderer driven by a `WF = {onboard, company, req}` config object) | **Canonical source for L3.** This is the most complete, most recently authored artifact and the one the user pointed to explicitly as the current build. |

**Correction to `01-product-spec.md` Open Question #3:** I had flagged an "Admin persona" as
possibly in-scope based on element IDs `tbAdmin`/`tbUser`. Direct inspection of `app.html`
shows these are just topbar display-state toggles (`tbAdmin` = the normal logged-in-user chip,
labelled "Admin" only as placeholder display text; `tbSignup` = "Creating account…" shown
during onboarding). **There is no separate internal/ops persona in any prototype.** Retracting
that open question — Admin is not a distinct role to spec. `01-product-spec.md` should be
amended to remove persona row "Admin *(internal, open question)*".

**New finding:** `app.html`'s join-existing-company note reads *"You will request to join
this company page — a Page Admin approves your access."* This is **UI copy only** — no
approval/moderation logic exists anywhere in the HTML or in `alpha-api`. This directly
overlaps the "Join-approval workflow" item I listed as **Out of Scope V1** in
`01-product-spec.md`. Two options for the sign-off gate to decide: (a) soften the copy since
V1 ships no approval step (join is instant), or (b) pull join-approval into V1 scope. Flagging
as an **Open Question**, not deciding unilaterally.

---

## Fingrid UI Standards — compliance check against `app.html`

| Standard | Required | `app.html` today | Verdict |
|---|---|---|---|
| Background | White only | `--bg:#f4f6f9` (light grey) used throughout content areas | ❌ **Needs re-skin** |
| Typography | Syne (headings) / DM Sans (body) / IBM Plex Mono (numbers) | `"Inter","Segoe UI",system-ui` | ❌ **Needs re-skin** |
| Modals | None anywhere | None found — all flows are inline step shells or full-screen auth cards | ✅ Compliant |
| Add/Edit | Inline horizontal step workflow | `WF` engine renders stages as an inline step rail (`wfStageNav`/`dstep`), not a modal | ✅ Compliant |
| Delete | Inline confirmation row | Not applicable yet — no delete action exists in any Connect flow | N/A |
| Status badges | Pills per state-machine status | Chips/pills used (`chip-gray`, etc.) but not yet mapped 1:1 to the L2 state machines (e.g. `DRAFT`/`LIVE`/`PUBLISHED` aren't consistently rendered as named-state pills) | ⚠️ Partial — needs mapping pass |
| Financial values | Right-aligned, IBM Plex Mono, INR prefix | AUM/volume figures render as plain inline text, no mono font, inconsistent ₹ prefixing | ❌ **Needs re-skin** |
| Error display | Inline below field | Present for OTP (`u_otpMsg`) — not yet verified for every form field | ⚠️ Partial |

**Conclusion:** `app.html`'s *flow and interaction logic* (the hard part — stage sequencing,
conditional skip for LSP, OTP gating, dashboard/directory/matches wiring) is sound and should
be preserved. Its *visual system* does not meet Fingrid's non-negotiable standard and needs a
re-skin pass (background, type, financial-value formatting, status-pill mapping) before it can
go to Sreedhar for sign-off. This matches `fingrid-connect-integration-plan.md`'s own
"Design translation" section, which already planned a token re-skin — just against apex's
navy/mint palette rather than Fingrid's Syne/DM Sans/IBM Plex Mono system. **These two re-skin
targets need to be reconciled: is Connect's L3 skinned to the Fingrid SDD standard (this repo's
governance) or to apex's existing navy/mint marketing-site theme (the integration plan's
plan)?** Flagging as an **Open Question** — they are not the same palette and the choice
affects every screen.

---

## US-XX → Screen Mapping

| User Story | Screen(s) in `app.html` | File to produce (per L3 convention) |
|---|---|---|
| US-01 Fast OTP onboarding | `scr-home`, onboarding stages `Identity` | `connect-onboarding-add-edit.html` (stage 1 of 4) |
| US-02 Staged profile with partial save | `WF.company` stages (Legal/Operations/Staff/Empanelments/Digital/Verify) | `connect-company-profile-add-edit.html` |
| US-03 Missing-credential guidance before publish | `WF.company` "Verify" stage | Same file, Verify step — annotate `BR-03` |
| US-04 Publish requirement, get ranked matches | `WF.req` stages + `view-matches` | `connect-requirement-add-edit.html`, `connect-matches-list.html` |
| US-05 Browse directory | `view-directory` | `connect-directory-list.html` |
| US-06 Contact visible for gated lender | `view-directory` detail pane | `connect-directory-detail.html` — annotate `BR-11` |
| US-07 Request without contact visibility | `view-directory` detail pane, restricted state | Same file, alternate state |
| US-08 Accept/reject connect request | *(not present in `app.html` — no screen exists for this yet)* | `connect-response-inbox.html` — **new screen, not reconciled from any source** |
| US-09 View established partnerships | *(not present in `app.html`)* | `connect-partners-list.html` — **new screen, not reconciled from any source** |
| US-10 LSP Digital Capabilities stage | `WF.company` conditional `Digital` stage | Same as US-02 file, annotate `BR-16` |

**Gap found:** US-08 and US-09 (connect-request accept/reject inbox, established partnerships
list) have **no screen in any existing prototype** — matching the L2 finding that their
backing endpoints (BR-13, and the `GET /partnership/relationship` list) are also unbuilt.
These two screens must be designed fresh, not ported.

---

## Required Output Per Module (per `sdd-03-html-ui`)

Not yet generated — listed here as the target file set:

```
docs/sdd/connect/03-html-ui/
  connect-home.html                        <- marketing entry (ported as-is, out of gate scope)
  connect-login.html
  connect-onboarding-add-edit.html         <- WF1, 4 stages + welcome
  connect-company-profile-add-edit.html    <- WF2, 6 stages (5 for non-LSP, BR-16)
  connect-requirement-add-edit.html        <- WF3, 4 stages (R3 removed, confirmed 2026-07-22)
  connect-dashboard.html                   <- overview hub
  connect-directory-list.html
  connect-directory-detail.html            <- contact-gated, BR-11
  connect-matches-list.html
  connect-response-inbox.html              <- NEW — no source screen exists
  connect-partners-list.html               <- NEW — no source screen exists
  connect-flow-prototype.html              <- MANDATORY single click-through covering the
                                               primary path: onboard → publish profile →
                                               publish requirement → view matches → send
                                               request → (once built) accept → see partner
```

Every screen gets a `<!-- render: likely FORM_BUILDER -->` or `<!-- render: CUSTOM -->`
provisional annotation per the flow-source rule, and every BR/EC with UI impact gets an
inline comment, once generation starts.

---

## Open Questions (block sign-off)

1. ~~Skin target~~ — **Re-resolved a third time, 2026-07-22 — this is now the live decision.**
   History: (a) originally kept `fingrid-connect-app.html`'s own ad-hoc system; (b) rejected by
   the boss as internal-looking, replaced with fingrid-apex's real marketing theme (navy/blue/
   mint, gradients); (c) **still** read as internal-facing after a structural cleanup pass —
   the direction given was to match the actual look of the two files shared in chat,
   `fingrid-connect-v5.html` and `stage1_email (4).html`, not another reinterpretation.
   **Current decision: teal `#00B09B` / Crimson Pro (headings) / Work Sans (body)**, ported
   verbatim from those two files' own `<style>` blocks — not fingrid-apex's site theme, not a
   generic standard. The structural fixes from pass (c) — no persistent topbar/rail chrome
   during a wizard, dot-stepper instead of tabs — were **kept**, since `stage1_email` itself
   independently uses that exact centered-wizard-no-chrome pattern; the reference files
   confirmed that decision rather than overriding it. See the Re-skin (round 3) note below.
2. ~~Join-approval~~ — **Resolved 2026-07-22**: no approval step exists or is wanted; joining
   is instant. The "Page Admin approves your access" copy was wrong — **corrected in
   `connect-flow-prototype.html` at this pass** (see Resolution Pass below).
3. ~~Confirm US-08/US-09 screens are wanted~~ — **Resolved by proceeding**: built this pass.
4. ~~"What You Offer" conflict~~ — **Resolved 2026-07-22**: confirmed not required. **The R3
   stage has been removed from `connect-flow-prototype.html`** at this pass (see Resolution
   Pass below), not just flagged.
5. ~~Digital Capabilities BR-16 gap~~ — **Resolved 2026-07-22**: fix it now, confirmed. **The
   LSP-only conditional skip has been implemented in `connect-flow-prototype.html`** at this
   pass (see Resolution Pass below).
6. ~~Matches vs. Directory gating asymmetry~~ — **Resolved 2026-07-22**: must be consistent.
   **The Matches "Connect" button now applies the same BR-11 contact gate as Directory's** in
   `connect-flow-prototype.html` (see Resolution Pass below). Recorded as BR-21 in
   `02-feature-spec.md` v1.3 for the real (not-yet-built) API to honour the same way.

---

## Resolution pass (2026-07-22, following owner rulings)

Four fixes applied directly to `connect-flow-prototype.html` after the owner ruled on Open
Questions 2/4/5/6 above:
1. **R3 "What You Offer" stage removed** — dropped from `WF.req.stages` and `reqStage()`;
   requirement wizard is now 4 steps (Type & Context → What You Need → Counterparty Criteria →
   Review & Publish), not 5.
2. **BR-16 LSP-only skip implemented** — `WF.company.stages` navigation now conditionally
   omits the Digital Capabilities step for any `st.entity` other than `LSP / Aggregator`.
3. **Join-approval copy corrected** — `onbCoPick()`'s note no longer promises a "Page Admin
   approves your access" step; rewritten to reflect instant join.
4. **Matches' Connect button now contact-gated** — applies the same lender-type + AUM ≥ ₹100 Cr
   check (BR-11) that Directory's Connect button already had, via a new `canDemoConnect()`
   helper mirroring `helper.go`'s real `canViewContact`.

See the file's own inline comments (search `RESOLVED 2026-07-22`) for exactly what changed.

## Re-theme pass (2026-07-22, later same day — boss feedback)

**Trigger:** Sudharson's boss reviewed the prototype and called it out as looking like an
internal-facing system, not something a DSA/lender/agency would sign up for as a customer
product. Two reference files were shared (`fingrid-connect-v5.html`, `stage1_email (4).html`)
— the original teal/Crimson-Pro/Work-Sans source prototypes this module was reconciled from
at L3. Neither of those, nor `connect-flow-prototype.html`'s prior skin, actually matched
`fingrid-apex`'s real production theme; all three read as generic enterprise-dashboard styling.

**What changed:** pulled real values directly from `tailwind.config.js` (colors: navy
`#01347c`/`#0a4a9e`/`#002058`, mint `#35ea95`/`#5df0ab`/`#1cc075`, blue `#3284ff`/`#5a9fff`/
`#1a6ae0`; font: Inter) and `src/index.css` + `Navbar.jsx` (gradient CTAs
`linear-gradient(to right, navy, blue)` → hover `blue, mint`; rounded-2xl cards; hover-lift +
shadow recipe; glass/blur accents) — not invented or approximated. Applied to:
`:root` tokens, the full-screen auth background (Home/Login/Welcome), all primary CTA buttons
(`.home-primary`, `.auth-btn`, `.btn-next`, `.dcta`), and card radii/hover states (`.dcard`,
`.wf-card`, `.mreq`, `.mcard`, `.rl-card`) — bumped from 9–12px to 18px with hover-lift +
shadow, matching the real site's "modern card" feel instead of flat enterprise-dashboard cards.

**Not changed:** the interaction logic, workflow structure, and all BR/gap annotations from
the prior two passes — this was a visual-only re-skin, no behavior touched. Verified: JS still
parses clean, div/style tags balanced, opened locally for visual check (no automated visual
regression tooling available in this environment).

## Restructure pass (2026-07-22, third pass — "still looks internal facing")

**Trigger:** the color re-theme alone wasn't enough — user reported it *still* read as
internal-facing after the palette swap. Correct diagnosis: the problem was never just color,
it was structure. A persistent icon-sidebar + a dense topbar ("Business Date", a "Select…"
master-picker, a generic "search by.." bar) + a boxed segmented tab-strip for wizard stages is
literally the standard shape of an internal ops console / CRM admin panel — recoloring it
doesn't change what it *is*. `stage1_email (4).html` (one of the two reference files shared
earlier) already demonstrated the right customer-facing pattern for a wizard: a centered
column, no persistent app chrome, a numbered dot-and-line stepper instead of tabs.

**What changed (structural, not just color):**
- **Topbar gutted**: removed the `.tb-select` ("Select…" dropdown), `.tb-search` ("search
  by.."), and `.tb-date` ("Business Date") — none of these meant anything for Connect; they
  were internal-console chrome carried over by habit. Kept: back button, brand mark,
  notification bell, user chip.
- **Stage tabs → numbered stepper**: `.stage-tabs`/`.stage-tab` rebuilt from a boxed
  segmented tab-bar into a dot-and-connecting-line stepper (numbered circles, done-state
  checkmarks, active-state glow ring) — the same pattern as `stage1_email`'s `.stage-nav`.
  `renderTabs()` in the JS now generates this markup.
- **Icon-rail hidden during wizards**: added a `shell.is-workflow` class, toggled in
  `openWF()`/`railGo()`, that hides `.rail` and centers `.main` as a single ~820px column
  with generous padding whenever an onboarding/company-profile/requirement wizard is active.
  The rail comes back only for the logged-in Dashboard/Directory/Matches/Requests/Partners
  home base, where a nav is a legitimate pattern (there's somewhere to navigate between).
- Added a dedicated `#wfPageTitle` heading inside the workflow view, since the old
  `.page-head` (where the wizard title used to render) is now hidden in `is-workflow` mode.

**Not changed:** BR/gap annotations, business logic, the brand color tokens from the prior
pass. Verified: JS parses clean, div tags balanced (239/239), opened locally.

**Still not verified:** an actual design review from Sudharson's boss — every pass so far has
been my own judgment applied to their stated complaint ("looks internal facing"), not a
signed-off customer-facing design. Recommend an explicit round of stakeholder feedback on
*this* version before treating the skin/structure question as closed a third time.

## Re-skin pass, round 3 (2026-07-22 — "do it like shared HTML")

**Trigger:** direction to match the actual look of the two files shared in chat,
`fingrid-connect-v5.html` and `stage1_email (4).html`, rather than my own reinterpretation —
neither the fingrid-apex theme (round 1) nor the structural-only fix (round 2) had been
confirmed against real reference material.

**What changed:** ported the shared files' actual `:root` tokens verbatim — teal `#00B09B`
(primary, was navy/blue/mint), ink/slate/muted grayscale, `--bs`/`--bm` blue accent (kept,
matches their own secondary-accent usage for links and `.step-num` badges), Crimson Pro for
all headings, Work Sans for body (added the Google Fonts `<link>` for both). Every gradient
CTA from round 1 (`.home-primary`, `.auth-btn`, `.btn-next`, `.dcta`) was flattened to solid
teal / teal-dark on hover, matching the shared files' actual `.btn-teal`/`.send-otp-btn`/
`.continue-btn` recipe — no gradients in either source file. All blue-tinted shadow rgba
values (leftover from round 1) reworked to teal-tinted. The full-page auth background now
uses `linear-gradient(135deg,#0F1D2E 0%,#1A3A5C 60%,#00B09B 100%)` — lifted directly from
`fingrid-connect-v5.html`'s own `.co-found-banner`/`.dc-banner` gradient recipe, not invented.

**Kept from round 2 (not overwritten):** the dot-stepper, the stripped-down topbar, and hiding
the rail during wizards — `stage1_email (4).html` independently uses a centered wizard with
zero persistent chrome, which validates rather than contradicts that structural decision.

**Kept from all prior passes (the actual point of doing CSS-only ports, not adopting the
shared files' markup/JS wholesale):** every confirmed business-rule fix — R3 removed, BR-16
LSP-only skip, BR-21 contact-gate consistency on Matches, the Requests-inbox and Partners-list
screens (US-08/09). Neither shared file has any of these; they predate those fixes. Porting
their visual language onto the already-correct interaction layer avoided reintroducing bugs
already closed out in `02-feature-spec.md`.

**Verified:** JS parses clean, div/style tags balanced. **Not verified:** still no confirmed
sign-off from the actual stakeholder — this is the third attempt at reading their intent
correctly; recommend a direct side-by-side comparison with them before calling this closed.

## Generation pass (2026-07-22)

`connect-flow-prototype.html` produced at `03-html-ui/connect-flow-prototype.html`, extending
`fingrid-connect-app.html` in place (skin decision: keep the file's own existing design system,
per product owner — the Fingrid SDD Syne/DM Sans/IBM Plex Mono standard does **not** apply to
this module). Per-screen frozen static files were **not** generated separately — this is a
single-page click-through app, not a multi-page tool, so the one flow-prototype already serves
as the screen inventory; splitting it into 11 near-duplicate static fragments was judged to add
no real inspection value. Revisit if L4b's classification pass needs isolated frozen frames.

Additions in this pass:
- **Connect Requests inbox** and **My Partners** screens (US-08/US-09) — built fresh, wired
  with working accept/reject/partner-list demo state (previously only DTOs existed at L6b,
  no screen anywhere).
- BR/US-numbered comments throughout the JS; provisional FORM_BUILDER/CUSTOM render hints
  per workflow stage.
- Matches' "Connect" button now tracks real demo state (`sentRequests`) instead of a dead
  `alert()`.
- Two conflicts surfaced **in the artifact itself** (visible amber banners, not just doc
  comments) rather than silently resolved: the "What You Offer" stage vs. the L5 decision to
  exclude commission/FLDG; the Digital Capabilities stage vs. BR-16's LSP-only conditional
  skip (not implemented).
- New asymmetry found: Directory's Connect button is contact-gated (BR-11); the Matches
  Connect button is not — flagged, not resolved.

Verification performed: JS parsed clean (`node --check`), HTML div tags balanced (245/245),
all 7 view containers wired consistently. **Not** verified: an actual browser click-through
by a human — opened locally for the user to confirm before treating this as sign-off-ready.

## Sign-Off Checklist (from `sdd-03-html-ui`) — status

- [x] Every US-XX has a corresponding screen (US-08/US-09 built fresh this pass)
- [x] Every field in Feature Spec Field Validations appears in a screen
- [ ] Every status from State Machine appears as a badge — partial; PENDING/ACCEPTED/REJECTED
      and ACTIVE now shown (Requests/Partners), DRAFT/LIVE/PUBLISHED still plain text/notes
      rather than named-state pills — needs a follow-up pass if pill-per-status is required
- [x] Every BR with UI impact annotated with comment (BR-02,03,05,06,07,08,10,11,12,13,14,16)
- [x] No modals anywhere
- [x] All forms use inline horizontal step workflow
- [x] White background — **still waived relative to the generic Fingrid SDD standard**, but
      the app content areas (`--bg:#f4f6f9`) and white cards now match `fingrid-apex`'s own
      real light-background convention, not an arbitrary prototype choice (re-themed 2026-07-22)
- [x] Realistic Indian dummy data used (Ramesh, Priya, Sundaram Sourcing, etc.)
- [x] Role-specific views — **N/A**: no distinct roles beyond entity-type; BR-16's LSP-only
      conditional skip is now implemented (Resolution pass, 2026-07-22)
- [ ] Sreedhar sign-off received — **not yet formally recorded**, but all 4 blocking Open
      Questions (skin, join-approval, What-You-Offer, BR-16, Matches/Directory gating) are now
      ruled on and implemented as of the 2026-07-22 Resolution pass. Only remaining open items
      are non-blocking (Admin persona already resolved; pill-per-status is a nice-to-have).
