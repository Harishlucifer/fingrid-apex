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
  title: "Collect OS",
  description:
    "Collect OS gives collection agencies the same machinery lenders have — case allocation, tele and field workflows, PTPs, DCRs, deposit reconciliation and per",
  alternates: { canonical: "/products/collectos" },
};

export default function ProductsCollectosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["Collect OS"]]} />
      <Hero
        pill="For collection agencies"
        eyebrow="Collect OS"
        title={
          <>
            The operating system for <Grad>collection agencies.</Grad>
          </>
        }
        lede="Collect OS gives collection agencies the same machinery lenders have — case allocation, tele and field workflows, PTPs, DCRs, deposit reconciliation and per-lender billing — with the conduct discipline that keeps principal relationships healthy."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "Collections stack",
            href: "/modules/collections",
            variant: "ghost",
          },
        ]}
        stats={[
          ["Multi", "Principal lenders"],
          ["DCR", "Written by the system"],
          ["100%", "Deposit reconciliation"],
        ]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="From allocation file to settled invoice"
      >
        <Card title="Case allocation">
          Allocation files from principal lenders ingested, validated and
          distributed to teams by bucket and geography.
        </Card>
        <Card title="Tele collection">
          Calling queues, dispositions and PTP tracking — the TeleCollect
          engine, agency-side.
        </Card>
        <Card title="Field collection">
          Route-planned visits with geo evidence, doorstep digital receipts and
          daily DCRs that write themselves.
        </Card>
        <Card title="Deposit reconciliation">
          Every rupee collected reconciled to bank deposits, collector-wise,
          daily — the report principals actually audit.
        </Card>
        <Card title="Conduct guardrails">
          Calling-hour and contact-frequency discipline built into workflow —
          protection for the agency and its principals.
        </Card>
        <Card title="Performance analytics">
          Resolution rates, bucket-wise efficiency and collector productivity
          per principal.
        </Card>
        <Card title="Agency billing">
          Commission computed from verified collections per agreement, invoiced
          with correct GST treatment.
        </Card>
        <Card title="Multi-principal operations">
          Work for many lenders from one system with each principal's cases and
          data ring-fenced.
        </Card>
      </CardsSection>
      <Panel title="Native to the lender's book">
        <p>
          When the principal runs on Fingrid, allocation, receipts and status
          flow system-to-system — collections post to the lender's loan accounts
          in real time, and settlement statements agree on both sides by
          construction.
        </p>
      </Panel>
      <Related
        links={[
          ["FieldCollect", "/modules/collections/fieldcollect"],
          ["TeleCollect", "/modules/collections/telecollect"],
          ["AgencyOS billing patterns", "/modules/finance"],
        ]}
      />
      <ClosingCta
        title="Give your principals a reason to allocate more."
        body="See Collect OS on your buckets, geographies and principal agreements."
      />
    </>
  );
}
