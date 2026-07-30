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
  title: "Verify OS",
  description:
    "Verify OS runs verification operations end to end — for the agencies that perform FI, PD and document checks across lenders, and for lender verification des",
  alternates: { canonical: "/products/verifyos" },
};

export default function ProductsVerifyosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["Verify OS"]]} />
      <Hero
        pill="For verification agencies · Lender verification desks"
        eyebrow="Verify OS"
        title={
          <>
            Verification as an <Grad>operating business.</Grad>
          </>
        }
        lede="Verify OS runs verification operations end to end — for the agencies that perform FI, PD and document checks across lenders, and for lender verification desks managing them. Work orders in, geo-evidenced reports out, TATs and billing accounted for."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "Verification module",
            href: "/modules/origination/verification",
            variant: "ghost",
          },
        ]}
        stats={[
          ["Multi", "Lender empanelments"],
          ["Geo", "Evidence on every visit"],
          ["TAT", "Scored per work order"],
        ]}
      />
      <CardsSection eyebrow="What's inside" title="From work order to invoice">
        <Card title="Work order intake">
          Verification requests flow in from empanelled lenders — through
          Fingrid or via API — with SLAs attached.
        </Card>
        <Card title="Field force management">
          Verifiers mapped to geographies, assigned by load and location,
          tracked on the ground.
        </Card>
        <Card title="FI & PD execution">
          Structured residence, office and business templates with GPS-stamped,
          photographed visits.
        </Card>
        <Card title="Document verification">
          Authenticity checks with structured findings — not scanned notes.
        </Card>
        <Card title="Report generation">
          Standardised verification reports delivered back to each lender in
          their expected format.
        </Card>
        <Card title="TAT & quality">
          Turnaround and quality scoring per verifier and per lender
          relationship.
        </Card>
        <Card title="Billing">
          Volume-based invoicing per lender with GST treatment — the commercial
          loop closed.
        </Card>
        <Card title="Multi-lender operations">
          Serve many lenders from one system, each relationship's data strictly
          separated.
        </Card>
      </CardsSection>
      <Panel title="One engine, both sides of the desk">
        <p>
          Verify OS runs on the same verification engine as the Verification
          module inside Lender OS — so a lender on Fingrid and an agency on
          Verify OS exchange work orders and reports natively, without email
          attachments.
        </p>
      </Panel>
      <Related
        links={[
          ["Verification module", "/modules/origination/verification"],
          ["Field Credit / FI-PD", "/modules/origination/field-credit-fi-pd"],
          ["Fingrid Connect", "/network/connect"],
        ]}
      />
      <ClosingCta
        title="Run your verification business on rails."
        body="See Verify OS configured for your lender panel and field force."
      />
    </>
  );
}
