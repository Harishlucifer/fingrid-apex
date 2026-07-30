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
  title: "Valuation OS",
  description:
    "Valuation OS runs property and vehicle valuation operations — work orders from empanelled lenders, field inspections with photographic evidence, asset-type ",
  alternates: { canonical: "/products/valuationos" },
};

export default function ProductsValuationosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["Valuation OS"]]} />
      <Hero
        pill="For valuation agencies · Technical desks"
        eyebrow="Valuation OS"
        title={
          <>
            Valuations that lenders can <Grad>lend against.</Grad>
          </>
        }
        lede="Valuation OS runs property and vehicle valuation operations — work orders from empanelled lenders, field inspections with photographic evidence, asset-type templates and reports that arrive in the format each lender's credit team expects."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "Collateral Management",
            href: "/modules/lms/collateral-management",
            variant: "ghost",
          },
        ]}
        stats={[
          ["Multi", "Asset classes"],
          ["Geo", "Stamped inspections"],
          ["Multi", "Lender formats"],
        ]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="From work order to valuation report"
      >
        <Card title="Work order intake">
          Valuation requests from empanelled lenders with asset details,
          priority and SLA.
        </Card>
        <Card title="Asset-type templates">
          Residential, commercial, land, and vehicle templates with the
          parameters each asset class demands.
        </Card>
        <Card title="Field inspection">
          Geo-stamped site visits with structured measurements, photographs and
          observations.
        </Card>
        <Card title="Valuation computation">
          Market, realisable and distress values computed with methodology on
          record.
        </Card>
        <Card title="Report delivery">
          Lender-wise report formats generated and delivered digitally —
          traceable, versioned.
        </Card>
        <Card title="Valuer network">
          Empanelled valuers managed by geography, qualification and load.
        </Card>
        <Card title="TAT & billing">
          Turnaround tracking per order and volume-based invoicing per lender.
        </Card>
      </CardsSection>
      <Panel title="Wired into the lending journey">
        <p>
          When the lender is on Fingrid, valuation work orders originate from
          the loan file itself — and the completed valuation lands back in the
          file, the CAM and the collateral registry without re-entry.
        </p>
      </Panel>
      <Related
        links={[
          ["Home Loan solution", "/solutions/home-loan"],
          ["Used Car solution", "/solutions/used-car"],
          ["Verify OS", "/products/verifyos"],
        ]}
      />
      <ClosingCta
        title="Put your valuation practice on the platform."
        body="See Valuation OS on your asset classes and lender panel."
      />
    </>
  );
}
