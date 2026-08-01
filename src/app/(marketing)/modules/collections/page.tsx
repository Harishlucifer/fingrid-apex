import type { Metadata } from "next";
import {
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
  Panel,
  Related,
} from "@/components/site";

export const metadata: Metadata = {
  title: "Collections & Recovery",
  description:
    "From a payment nudge to a SARFAESI notice, collections is one continuum. The Collections stack runs digital, tele and field channels on a shared case view,",
  alternates: { canonical: "/modules/collections" },
};

export default function ModulesCollectionsPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Collections & Recovery"]]} />
      <Hero
        eyebrow="Module stack · Collections & Recovery"
        title={
          <>
            Collections that escalate with <Grad>discipline, not drama.</Grad>
          </>
        }
        lede="From a payment nudge to a SARFAESI notice, collections is one continuum. The Collections stack runs digital, tele and field channels on a shared case view, escalating into legal and recovery when — and only when — the strategy says so."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card href="/modules/collections/digicollect" title="DigiCollect">
          Digital-first collections — reminders, payment links and self-cure
          journeys.
        </Card>
        <Card href="/modules/collections/telecollect" title="TeleCollect">
          Collection calling with PTPs, dispositions and queue strategy.
        </Card>
        <Card href="/modules/collections/fieldcollect" title="FieldCollect">
          Field collections with routes, receipts and deposit reconciliation.
        </Card>
        <Card
          href="/modules/collections/legal-recovery"
          title="Legal & Recovery"
        >
          The full legal toolkit — notices to SARFAESI to repossession to OTS.
        </Card>
      </CardsSection>
      <Panel id="upload" title="Collection Upload" note="Also in this stack">
        <p>
          Bulk receipt uploads from agencies, partner banks and payment files —
          validated, matched to accounts and posted with exception handling for
          the lines that don't match. The operational bridge between external
          collection sources and your book.
        </p>
      </Panel>
      <Panel
        id="incentives"
        title="Collection Incentives & Agency Payouts"
        note="Also in this stack"
      >
        <p>
          Collector incentives and agency commissions computed from actual
          collections — bucket-wise, resolution-wise — with maker-checker
          approval and GST/TDS-correct payout processing for agencies.
        </p>
      </Panel>
      <Related
        links={[
          ["Collect OS — for agencies", "/products/collectos"],
          ["Repayment Management", "/modules/lms/repayment-management"],
          ["NPA & DPD", "/modules/lms/npa-dpd-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
