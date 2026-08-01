import type { Metadata } from "next";
import {
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
  Related,
} from "@/components/site";

export const metadata: Metadata = {
  title: "FieldCollect",
  description:
    "Route-planned visits, geo-stamped outcomes, digital receipts at the doorstep and deposit reconciliation that closes the loop — field collection where the c",
  alternates: { canonical: "/modules/collections/fieldcollect" },
};

export default function ModulesCollectionsFieldcollectPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Collections", "/modules/collections"],
          ["FieldCollect"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Collections · FieldCollect"
        title={
          <>
            Field collections with a <Grad>clean money trail.</Grad>
          </>
        }
        lede="Route-planned visits, geo-stamped outcomes, digital receipts at the doorstep and deposit reconciliation that closes the loop — field collection where the cash trail is as disciplined as the visit plan."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Case allocation">
          Cases assigned by geography, bucket and collector capacity — with
          daily route plans.
        </Card>
        <Card title="Visit evidence">
          GPS and time-stamped visit outcomes; the DCR writes itself from the
          day's work.
        </Card>
        <Card title="Doorstep receipts">
          Digital receipts issued on the spot — cash, UPI or cheque — posting to
          the account instantly.
        </Card>
        <Card title="Deposit reconciliation">
          Collections reconciled against bank deposits per collector, daily.
          Leakage dies here.
        </Card>
        <Card title="Skip tracing">
          Untraceable customers worked through structured skip-tracing workflows
          with new-contact capture.
        </Card>
        <Card title="Agency operations">
          External agencies allocated cases, tracked on performance and paid on
          verified collections.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Legal & Recovery", "/modules/collections/legal-recovery"],
          ["Field Sales", "/modules/sales/field-sales"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
