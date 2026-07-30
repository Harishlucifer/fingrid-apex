import type { Metadata } from "next";
import {
  Bullets,
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
  title: "Legal & Recovery",
  description:
    "When collection becomes recovery, every instrument has its own law, timeline and paperwork. Fingrid runs them all as governed workflows — pre-legal notice ",
  alternates: { canonical: "/modules/collections/legal-recovery" },
};

export default function ModulesCollectionsLegalRecoveryPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Collections", "/modules/collections"],
          ["Legal & Recovery"],
        ]}
      />
      <Hero
        eyebrow="Collections · Legal & Recovery"
        title={
          <>
            The full legal toolkit, run as{" "}
            <Grad>workflow — not a lawyer’s drawer.</Grad>
          </>
        }
        lede="When collection becomes recovery, every instrument has its own law, timeline and paperwork. Fingrid runs them all as governed workflows — pre-legal notice to SARFAESI to repossession to settlement — with cases, counsel, costs and outcomes tracked on the system of record."
      />
      <CardsSection eyebrow="The instruments" title="One module, every remedy">
        <Card title="Pre-legal notices">
          Demand and recall notices generated from account data, dispatched and
          acknowledged on record.
        </Card>
        <Card title="Section 138 proceedings">
          Cheque-bounce cases with the statutory notice timelines the law
          enforces — tracked so deadlines are never missed.
        </Card>
        <Card title="SARFAESI action">
          Demand notice, possession and auction stages for eligible secured
          assets, with the procedural record each stage requires.
        </Card>
        <Card title="Civil suits & arbitration">
          Recovery suits and arbitration proceedings tracked through hearings,
          orders and awards.
        </Card>
        <Card title="Lok Adalat">
          Settlement through Lok Adalat with pre-litigation referral and award
          capture.
        </Card>
        <Card title="Repossession">
          Asset repossession with authorisations, inventory documentation and
          custody chain — done by the book.
        </Card>
        <Card title="OTS & settlement">
          One-time settlements from proposal to approval matrix to sacrifice
          accounting.
        </Card>
        <Card title="Counsel & costs">
          Advocates and agencies empanelled, cases assigned, legal costs tracked
          per case and recovered where awarded.
        </Card>
      </CardsSection>
      <Panel title="Why legal belongs on the lending system">
        <Bullets>
          <li>
            Legal action starts from live account data — no re-typing
            outstanding amounts into notices
          </li>
          <li>
            Statutory timelines tracked by the system; a missed limitation date
            is a lost case
          </li>
          <li>
            Recovery outcomes post back to the loan account and GL — including
            OTS sacrifice and write-off recovery accounting
          </li>
          <li>
            One case history across collection attempts, legal action and
            settlement — audit-ready always
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          [
            "Loan Servicing (write-off & OTS)",
            "/modules/lms/loan-servicing-operations",
          ],
          ["Collateral Management", "/modules/lms/collateral-management"],
          ["FieldCollect", "/modules/collections/fieldcollect"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
