# DB Schema — Fingrid Connect

**Module:** Fingrid Connect
**Schema Owner:** Sudharson (Developer/Tech Lead) — see `00-inputs.md` §0.8
**Status:** Production *(already migrated and running in `alpha-api`)* — this document is a
**backfill**, not new design; the DDL below is Production, not Draft.
**Current Version:** 1.1
**DB:** `alpha-api` — **per-tenant database instances** (Model A/B), not a shared schema with
a `tenant_id` column (see Convention Note below).

## Migration History
| Migration ID | Version | Date | CR Reference | Description |
|---|---|---|---|---|
| `20260710120000_FINGRID_CONNECT_ONBOARDING` | 1.0 | 2026-07-10 | — | `core_channel`/`core_channel_user` new columns, `core_channel_role`, territory/loan-type child tables, lookup seeds (WF1) |
| `20260720120000_FINGRID_CONNECT_PARTNERSHIP` | 1.1 | 2026-07-20 | — | `core_partnership_listing/match/response`, `core_channel_relationship` (WF3/WF4) |

**Deleted design docs (recoverable, not lost):** `mcp/fingrid-connect-wf2-wf3-schema-plan.md`
and `mcp/fingrid-connect-wf2-wf3-er.md` (+ `.svg`) existed during design and were intentionally
removed post-implementation in commit `a68e260e1` ("Fingrid connect removed plans"), per this
repo's Golden Rule 13 ("Git is version history... never v2.md copies"). Retrievable via
`git show a68e260e1^:mcp/fingrid-connect-wf2-wf3-schema-plan.md` if the original design
rationale is ever needed beyond what's reconstructed here.

---

## ⚠️ Convention Note — this repo's real DDL convention diverges from `sdd-04-db-schema`'s generic template

The generic skill (`04-db-schema/references/db-mandatory-columns.md`) mandates
`id INT UNSIGNED AUTO_INCREMENT`, `tenant_id INT UNSIGNED NOT NULL` on every table,
`deleted_at DATETIME NULL` soft-delete, and `utf8mb4_unicode_ci`. **None of these hold in
`alpha-api`**, and this is not a Connect-specific deviation — it's the actual, consistent
house convention across the entire codebase (checked against `onb_checklist_result`,
`core_consent`, and others migrated in the same period):

| Generic template says | `alpha-api` actually does | Why (verified) |
|---|---|---|
| `id INT UNSIGNED AUTO_INCREMENT` | `id BIGINT NOT NULL` (app-generated, no auto-increment) | Consistent across every recent migration checked, not just Connect's |
| `tenant_id INT UNSIGNED NOT NULL` on every table | Absent on most tables; **nullable** `BIGINT` on the 4 new Connect tables | Multi-tenancy here is **per-tenant database connection** (Model A/B) — no shared-schema tenant filtering exists. Connect's tables ship a nullable `tenant_id` only for **future** Model-C (shared-schema) readiness; it is inert today. Per `engineering-brief.md`: "no manual `tenant_id` filters." |
| `deleted_at DATETIME NULL` soft delete | `status TINYINT NOT NULL` (1 = active convention, per `core_channel`/`core_*` pattern) | Same pattern used everywhere else in this codebase |
| `utf8mb4_unicode_ci` | `utf8mb4_general_ci` on the 4 new tables (unspecified, defaults to schema default, on the older onboarding ALTERs) | Matches existing `core_*` tables |
| Module-prefixed table names (`tele_*`) | `core_channel*`, `core_partnership_*` — **shared platform-domain prefix**, not a private `connect_*` namespace | Channel/company is a pre-existing shared platform entity; Connect extends it rather than owning a private copy — correct per the master-placement-rule "domain master owned by another module... reference it, never duplicate" |

**This document uses the actual, verified `alpha-api` convention below, not the generic
template.** Recommend the sdd-skills maintainers add an `alpha-api`-specific override note to
`04-db-schema/references/db-mandatory-columns.md` so future modules aren't scored against a
convention this codebase has never followed.

---

## Table Ownership

### Owned by this module (new tables)
| Table | Purpose | Migration |
|---|---|---|
| `core_channel_role` | Multi-role-per-channel (DSA/BC/OWNBOOK/COLENDER/LSP), `role_status` | v1.0 |
| `core_channel_user_territory` | Per-user territory tagging (raw name + resolved master id) | v1.0 |
| `core_channel_user_loan_type` | Per-user loan-type tagging | v1.0 |
| `core_partnership_listing` | A published partnership requirement (WF3) | v1.1 |
| `core_partnership_match` | Cron-generated ranked candidates per listing (WF4) | v1.1 |
| `core_partnership_response` | Connect request / accept / reject (WF4) | v1.1 |
| `core_channel_relationship` | Established partnership between two channels (WF4) | v1.1 |

### Altered (columns added to existing tables, not owned by Connect)
| Table | Owned By | Columns Added | Migration |
|---|---|---|---|
| `core_channel` | Platform / onboarding module | `primary_role`, `public_slug`, `trust_score`, `tenant_code`, `tenant_conversion_status`, `hosting_type` | v1.0 |
| `core_channel_user` | Platform / onboarding module | `role_in_page`, `member_status`, `designation`, `department`, `linkedin_url`, `preferences` (JSON) | v1.0 |

### Referenced, not owned or altered
| Table | Owned By | How Used |
|---|---|---|
| `onb_entity` | Onboarding module | Legal identity (C1: legal_name, PAN/CIN, incorporation, state, website) |
| `onb_location` | Onboarding module | **Read-only fallback for `branch_count`** — only counted when `connect_profile.branches` JSON is empty (BR-02, corrected in `02-feature-spec.md` v1.1). Branches submitted through the Connect profile API are never written here; they live in `connect_profile.branches` JSON only. |
| `onb_document` | Onboarding module | Credential proof documents (C4) |
| `onb_empanelment` | Onboarding module | Lender empanelment records (C4) |
| `core_territory` | Platform module | FK target for `core_channel_user_territory.territory_id` |
| `core_loan_type` | Platform module | FK target for `core_channel_user_loan_type.loan_type_id` |
| `core_channel_territory` | Platform module (pre-existing, `BASELINE` migration) | C2 Operations geography — `(id, territory_id, channel_id, all_lender_enabled, status)`. Verified present via `app/models/partner/channel_territory.go`; matches `contract.md`'s "(existing)" claim. |
| `core_channel_loan_type` | Platform module (pre-existing, `BASELINE` migration) | C2 Operations products — `(id, loan_type_id, channel_territory_id, status)`. **Note:** links to a `channel_territory_id`, not directly to `channel_id` — a product is scoped to one of the channel's territory rows, not the channel as a whole. Verified via `app/models/partner/channel_loan_type.go`. |
| `core_lookup_master` | Platform module | `CHANNEL_ENTITY_TYPE` (12 values), `PERSONAL_EMAIL_DOMAIN` (10 values) — seeded by v1.0, served via existing `GET /v1/lookup` |

**`connect_profile` — no DDL, JSON-in-column (verified directly in `profile.go`, not just
`contract.md`):** Company profile figures (aum, monthly_disbursal, total_staff,
field_staff_count, tier, status, staff_by_role, loan_mix, capabilities, **and `branches`**)
live inside `core_channel.data → connect_profile` JSON. **`branches` is included here despite
`contract.md` claiming it maps to `onb_location`** — verified in code that it does not; see
the `onb_location` row above and `02-feature-spec.md` v1.1's BR-02 correction. Zero schema
cost, but **zero query-ability without a JSON path expression** — flagged in Index Strategy
below since this is the one place a real index gap exists.

---

## Table Definitions

### core_channel_role (v1.0)

**Purpose:** A channel (company) can hold multiple roles simultaneously (e.g. both DSA and BC).
**Insert:** On role assignment during onboarding or a later role-add action.
**Update:** `role_status` transitions (BR-15 — **currently unenforced**, see `02-feature-spec.md`).
**Delete:** Never — soft-deactivate via `status`.

```sql
CREATE TABLE IF NOT EXISTS `core_channel_role` (
    `id`            BIGINT      NOT NULL,
    `channel_id`    BIGINT      NOT NULL,
    `role`          VARCHAR(32) NOT NULL,   -- DSA | BC | OWNBOOK | COLENDER | LSP
    `role_status`   VARCHAR(16) NOT NULL,   -- ACTIVE | INACTIVE | PENDING
    `onboarding_id` BIGINT      NULL,
    `created_at`    DATETIME    NOT NULL,
    `updated_at`    DATETIME    NOT NULL,
    `status`        TINYINT     NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_core_channel_role_core_channel1_idx` (`channel_id` ASC) VISIBLE,
    CONSTRAINT `fk_core_channel_role_core_channel1`
        FOREIGN KEY (`channel_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION);
```

**Known gap (BR-15, verified in code):** no service in `app/services/connect` reads or writes
this table. It exists and is FK-sound but is not yet load-bearing for any behaviour.

---

### core_channel_user_territory / core_channel_user_loan_type (v1.0)

**Purpose:** Per-user tagging so Ramesh Kumar's territory ("Coimbatore, Tiruppur, Erode") and
loan-type interests are queryable, not just a display string. Stores both the raw text (what
the user typed) and a resolved master id (when the platform can match it) — a common
"progressive enhancement" pattern for free-text-that-should-become-a-master-reference.

```sql
CREATE TABLE IF NOT EXISTS `core_channel_user_territory` (
    `id`              BIGINT       NOT NULL,
    `channel_user_id` BIGINT       NOT NULL,
    `territory_id`    BIGINT       NULL,
    `territory_name`  VARCHAR(128) NULL,
    `created_at`      DATETIME     NOT NULL,
    `updated_at`      DATETIME     NOT NULL,
    `status`          TINYINT      NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_ccu_territory_core_channel_user1_idx` (`channel_user_id` ASC) VISIBLE,
    INDEX `fk_ccu_territory_core_territory1_idx` (`territory_id` ASC) VISIBLE,
    CONSTRAINT `fk_ccu_territory_core_channel_user1`
        FOREIGN KEY (`channel_user_id`) REFERENCES `core_channel_user` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_ccu_territory_core_territory1`
        FOREIGN KEY (`territory_id`) REFERENCES `core_territory` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `core_channel_user_loan_type` (
    `id`              BIGINT       NOT NULL,
    `channel_user_id` BIGINT       NOT NULL,
    `loan_type_id`    BIGINT       NULL,
    `loan_type_name`  VARCHAR(128) NULL,
    `created_at`      DATETIME     NOT NULL,
    `updated_at`      DATETIME     NOT NULL,
    `status`          TINYINT      NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_ccu_loan_type_core_channel_user1_idx` (`channel_user_id` ASC) VISIBLE,
    INDEX `fk_ccu_loan_type_core_loan_type1_idx` (`loan_type_id` ASC) VISIBLE,
    CONSTRAINT `fk_ccu_loan_type_core_channel_user1`
        FOREIGN KEY (`channel_user_id`) REFERENCES `core_channel_user` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_ccu_loan_type_core_loan_type1`
        FOREIGN KEY (`loan_type_id`) REFERENCES `core_loan_type` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION);
```

---

### core_partnership_listing (v1.1)

**Purpose:** A partnership requirement a channel publishes (WF3, US-04). R1/R2/R4/R5 form
data lives entirely in `data` JSON — only the fields needed for filtering/indexing are real
columns (BR-04/BR-05/BR-06 all key off `channel_id` and `listing_status`, not JSON contents).
**Insert:** `POST /connect/:channelId/requirement` with no `requirement_id` (BR-05).
**Update:** `PUT`-shaped same endpoint with `requirement_id` (BR-01-style merge into `data`).
**Delete:** Never — no delete endpoint exists; only status transitions.

```sql
CREATE TABLE IF NOT EXISTS `core_partnership_listing` (
    `id`               BIGINT      NOT NULL,
    `channel_id`       BIGINT      NOT NULL,             -- owning company page (BR-04)
    `channel_user_id`  BIGINT      NULL,                 -- who created it
    `partnership_type` VARCHAR(32) NULL,                 -- BR-05 enum (seek_lender | seek_dsa | ...)
    `visibility`       VARCHAR(16) NULL DEFAULT 'PUBLIC',-- PUBLIC | INVITE | PRIVATE
    `listing_status`   VARCHAR(16) NULL DEFAULT 'DRAFT', -- DRAFT | LIVE | MATCHED | CLOSED — only DRAFT/LIVE reachable in code, see 02-feature-spec.md state machine gap
    `data`             JSON        NULL,                 -- context, products, need{}, criteria{}
    `tenant_id`        BIGINT      NULL,                 -- Model-C readiness only, inert today
    `status`           TINYINT     NOT NULL,
    `created_at`       DATETIME    NOT NULL,
    `updated_at`       DATETIME    NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_cpl_channel` (`channel_id` ASC) VISIBLE,
    INDEX `idx_cpl_type_status` (`partnership_type` ASC, `listing_status` ASC) VISIBLE,
    CONSTRAINT `fk_cpl_core_channel1`
        FOREIGN KEY (`channel_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Key query patterns:**
```sql
-- BR-04a: non-owner read allowed only when LIVE
SELECT * FROM core_partnership_listing WHERE id = ? AND (channel_id = ? OR listing_status = 'LIVE');

-- BR-08: cron's full sweep of eligible listings
SELECT * FROM core_partnership_listing WHERE listing_status = 'LIVE';
```

---

### core_partnership_match (v1.1)

**Purpose:** Cron-materialised ranked candidates per listing (WF4, US-04). **Never written by
an API request** — only by `GenerateMatches()`.
**Insert:** Full-sweep cron, `matchTopN = 10` per listing (BR-08).
**Update:** Never — see the hard delete+recreate pattern below.
**Delete:** Hard delete, every cron cycle, via `ReplaceForListing` — **this is EC-05**, the
match-status-wipe bug documented in `02-feature-spec.md`. Flagging again here because it's a
DDL-level fact: there is no column or mechanism in this table that could survive a
delete+recreate even if the application layer wanted to preserve `match_status`.

```sql
CREATE TABLE IF NOT EXISTS `core_partnership_match` (
    `id`                   BIGINT      NOT NULL,
    `listing_id`           BIGINT      NOT NULL,
    `candidate_channel_id` BIGINT      NOT NULL,
    `score`                INT         NULL DEFAULT 0,
    `match_status`         VARCHAR(16) NULL DEFAULT 'SUGGESTED', -- SUGGESTED | VIEWED | CONTACTED | DISMISSED — see EC-05
    `data`                 JSON        NULL,                     -- score breakdown, reason
    `generated_at`         DATETIME    NULL,
    `tenant_id`            BIGINT      NULL,
    `status`               TINYINT     NOT NULL,
    `created_at`           DATETIME    NOT NULL,
    `updated_at`           DATETIME    NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_cpm_listing_score` (`listing_id` ASC, `score` DESC) VISIBLE,
    INDEX `idx_cpm_candidate` (`candidate_channel_id` ASC) VISIBLE,
    CONSTRAINT `fk_cpm_core_partnership_listing1`
        FOREIGN KEY (`listing_id`) REFERENCES `core_partnership_listing` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_cpm_core_channel1`
        FOREIGN KEY (`candidate_channel_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Recommended fix for EC-05 (schema-level option, for the L4b/L6b ruling):** either (a) add a
natural key `UNIQUE(listing_id, candidate_channel_id)` and change `GenerateMatches` to
`UPSERT` instead of delete+recreate — preserving `match_status` for candidates still eligible
— or (b) move `match_status` to a separate `core_partnership_match_interaction` table keyed
by `(listing_id, candidate_channel_id)` that the cron never touches. Not implemented here —
this is a design option for whoever resolves EC-05, not a decision made unilaterally in this
backfill pass.

**Key query pattern:**
```sql
-- "My Matches" pane, grouped by listing, highest score first
SELECT * FROM core_partnership_match
WHERE listing_id IN (SELECT id FROM core_partnership_listing WHERE channel_id = ?)
ORDER BY listing_id, score DESC;
```

---

### core_partnership_response (v1.1)

**Purpose:** Connect request / accept / reject between two channels (WF4, US-08, BR-12/BR-13).
**Insert:** `action=REQUEST` — **endpoint not yet implemented** (see `02-feature-spec.md`).
**Update:** `action=ACCEPT|REJECT`, guarded to `response_status = PENDING` only (BR-13).
**Delete:** Never designed.

```sql
CREATE TABLE IF NOT EXISTS `core_partnership_response` (
    `id`               BIGINT      NOT NULL,
    `listing_id`       BIGINT      NULL,                 -- null when initiated from directory, not a listing
    `from_channel_id`  BIGINT      NOT NULL,
    `to_channel_id`    BIGINT      NOT NULL,
    `response_type`    VARCHAR(16) NULL,                 -- REQUEST | ACCEPT | REJECT
    `response_status`  VARCHAR(16) NULL DEFAULT 'PENDING',-- PENDING | ACCEPTED | REJECTED
    `data`             JSON        NULL,                 -- message
    `tenant_id`        BIGINT      NULL,
    `status`           TINYINT     NOT NULL,
    `created_at`       DATETIME    NOT NULL,
    `updated_at`       DATETIME    NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_cpr_from` (`from_channel_id` ASC) VISIBLE,
    INDEX `idx_cpr_to_status` (`to_channel_id` ASC, `response_status` ASC) VISIBLE,
    CONSTRAINT `fk_cpr_from_core_channel1`
        FOREIGN KEY (`from_channel_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_cpr_to_core_channel1`
        FOREIGN KEY (`to_channel_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Schema gap found in this backfill pass (new, not previously documented anywhere):** there is
**no unique constraint** preventing two `PENDING` rows for the same `(from_channel_id,
to_channel_id)` pair. BR-12's duplicate-pending 409 guard, once implemented, will have to be
enforced entirely in application code with no DB-level backstop — normally acceptable, but
worth a partial unique index if this table ever gets written from more than one code path
(e.g. a future bulk-invite feature). Flagged, not added, since adding an index to a production
table is a migration decision for whoever implements BR-12, not something to slip in silently
here.

**Key query pattern:**
```sql
-- BR-12: duplicate-pending guard (once implemented)
SELECT 1 FROM core_partnership_response
WHERE from_channel_id = ? AND to_channel_id = ? AND response_status = 'PENDING';
```

---

### core_channel_relationship (v1.1)

**Purpose:** An established partnership between two channels (WF4, US-09), created when a
response is accepted (BR-13).
**Insert:** On `PUT /partnership/response/:id` with `action=ACCEPT` — **not yet implemented**.
**Update:** `relationship_status` ACTIVE → INACTIVE — trigger undocumented anywhere (see
`02-feature-spec.md`'s state machine Open Question).
**Delete:** Never designed.

```sql
CREATE TABLE IF NOT EXISTS `core_channel_relationship` (
    `id`                   BIGINT      NOT NULL,
    `channel_a_id`         BIGINT      NOT NULL,
    `channel_b_id`         BIGINT      NOT NULL,
    `relationship_type`    VARCHAR(32) NULL,             -- LENDER_DSA | ...
    `relationship_status`  VARCHAR(16) NULL DEFAULT 'ACTIVE', -- ACTIVE | INACTIVE
    `data`                 JSON        NULL,
    `tenant_id`            BIGINT      NULL,
    `status`               TINYINT     NOT NULL,
    `created_at`           DATETIME    NOT NULL,
    `updated_at`           DATETIME    NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_ccr_a` (`channel_a_id` ASC) VISIBLE,
    INDEX `idx_ccr_b` (`channel_b_id` ASC) VISIBLE,
    CONSTRAINT `fk_ccr_a_core_channel1`
        FOREIGN KEY (`channel_a_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_ccr_b_core_channel1`
        FOREIGN KEY (`channel_b_id`) REFERENCES `core_channel` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Schema gap found in this backfill pass:** a relationship is directional in storage
(`channel_a_id`/`channel_b_id`) but every query pattern needs it to behave as undirected (does
a relationship exist between X and Y, in either order?). No index supports `channel_b_id = ?
OR channel_a_id = ?` efficiently as a single lookup — "My Partners" (US-09) for channel Y would
currently need `WHERE channel_a_id = ? OR channel_b_id = ?`, which can't use either single-
column index as a covering scan. Flagged for whoever implements the `GET
/partnership/relationship` endpoint (currently unbuilt).

**Key query pattern (once the read endpoint exists):**
```sql
SELECT * FROM core_channel_relationship
WHERE (channel_a_id = ? OR channel_b_id = ?) AND relationship_status = 'ACTIVE';
```

---

## Alterations to Shared Tables

### core_channel (owned by the platform/onboarding module)

```sql
-- Migration: 20260710120000_FINGRID_CONNECT_ONBOARDING
ALTER TABLE `core_channel`
    ADD COLUMN `primary_role`             VARCHAR(32)  NULL              AFTER `partner_category`,
    ADD COLUMN `public_slug`              VARCHAR(160) NULL              AFTER `name`,
    ADD COLUMN `trust_score`              INT          NULL DEFAULT 0    AFTER `dsa_status`,
    ADD COLUMN `tenant_code`              VARCHAR(64)  NULL              AFTER `trust_score`,
    ADD COLUMN `tenant_conversion_status` VARCHAR(32)  NULL DEFAULT 'NONE' AFTER `tenant_code`,
    ADD COLUMN `hosting_type`             VARCHAR(16)  NULL              AFTER `tenant_conversion_status`,
    ADD UNIQUE INDEX `uq_core_channel_public_slug` (`public_slug` ASC) VISIBLE;
```
**Note:** `entity_type` and `partner_category` already existed on `core_channel` prior to
Connect — only the 6 columns above were added.

### core_channel_user (owned by the platform/onboarding module)

```sql
-- Migration: 20260710120000_FINGRID_CONNECT_ONBOARDING
ALTER TABLE `core_channel_user`
    ADD COLUMN `role_in_page`  VARCHAR(16)  NULL DEFAULT 'MEMBER' AFTER `user_id`,
    ADD COLUMN `member_status` VARCHAR(24)  NULL DEFAULT 'ACTIVE' AFTER `role_in_page`,
    ADD COLUMN `designation`   VARCHAR(128) NULL AFTER `member_status`,
    ADD COLUMN `department`    VARCHAR(128) NULL AFTER `designation`,
    ADD COLUMN `linkedin_url`  VARCHAR(256) NULL AFTER `department`,
    ADD COLUMN `preferences`   JSON         NULL AFTER `linkedin_url`;  -- visibility, interests, notify_email
```

**Coordination required:** both ALTERs touch tables owned by the onboarding/platform module —
notify that module's Tech Lead before any further ALTER (per SDD's shared-table protocol),
even though these two have already shipped.

**Config-driven lookup seeds (`core_lookup_master`, INSERT IGNORE = idempotent):**
`CHANNEL_ENTITY_TYPE` (12 rows: dsa_ind, dsa_firm, lsp, bc, nbfc, bank, hfc, colender,
verif_agency, collection_agency, legal_agency, property_agency — each with a `configuration`
JSON mapping to `role`/`category`) and `PERSONAL_EMAIL_DOMAIN` (10 common personal-email
domains, feeding BR-14's onboarding branching).

---

## Index Strategy

| Table | Index | Type | Justification |
|---|---|---|---|
| `core_partnership_listing` | `(channel_id)` | Single | BR-04 ownership check on every write |
| `core_partnership_listing` | `(partnership_type, listing_status)` | Composite | BR-08 cron sweep filters by both |
| `core_partnership_match` | `(listing_id, score DESC)` | Composite | "My Matches" read, pre-sorted |
| `core_partnership_match` | `(candidate_channel_id)` | Single | Reverse lookup — "who am I matched to" (not yet used by any endpoint) |
| `core_partnership_response` | `(from_channel_id)` | Single | "Sent by you" list (US-08) |
| `core_partnership_response` | `(to_channel_id, response_status)` | Composite | Incoming-PENDING inbox query (US-08, BR-13) |
| `core_channel_relationship` | `(channel_a_id)`, `(channel_b_id)` | Single, separately | **Gap noted above** — does not efficiently cover the undirected "my partners" lookup |
| `connect_profile` (JSON in `core_channel.data`) | **none** | — | **Gap**: any filter/sort on AUM, verification_tier, staff count etc. (exactly what Directory search/BR-11's gate and BR-08's candidate scoring need) requires a full scan + JSON extraction today. `publishedChannelsByRoles` in `match.go` already does this — acceptable at current scale, but flagged as the first thing to revisit if Directory or match-candidate volume grows. A generated/virtual column with a functional index on `profile_status`, `aum`, and `primary_role`-adjacent fields would be the fix. |

**Avoid:** relying on `core_partnership_match.data` (JSON breakdown) for anything queryable —
it's write-once display data, not a filter target.

---

## Output Checklist (against this repo's real convention, not the generic template)

- [x] All new tables have `id`, `created_at`, `updated_at`, `status` — the actual mandatory set here
- [ ] `tenant_id` — present but nullable/inert on all 4 new tables; **not** "NOT NULL on every table" per generic template, and that's correct for this repo's per-tenant-DB model, not a gap
- [x] Monetary values — none stored as new columns in this module (AUM/disbursal live in `connect_profile` JSON, entered as user-typed numbers, not validated as DECIMAL anywhere — see `02-feature-spec.md` field-validation gaps)
- [x] No MySQL ENUM types used — all status/type columns are VARCHAR
- [x] All FK constraints follow `fk_[child]_[parent]` naming
- [x] Indexes named `idx_[table]_[columns]` or descriptive equivalents
- [x] Key query patterns documented per table
- [x] Alterations to shared tables (`core_channel`, `core_channel_user`) listed with coordination note
- [ ] Rollback blocks — **missing.** Neither Connect migration has a `-- +goose Down` block
      (verified: `grep "goose Down"` on both files returns nothing), unlike other recent
      migrations in this repo (e.g. `onb_checklist_result`, which has one). This is a real,
      Connect-specific gap, not a repo convention — both migrations should get a rollback
      block added.
- [x] Charset `utf8mb4` on all new `CREATE TABLE` — collation is `_general_ci`, matching repo convention, not `_unicode_ci` per generic template (see Convention Note)
