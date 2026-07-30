import type { Metadata } from "next";
import {
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
} from "@/components/site";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Solutions bundle the right modules, workflows and integrations for a specific asset class — a starting configuration proven on real books, tuned to your po",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <Crumbs items={[["Solutions"]]} />
      <Hero
        eyebrow="Solutions"
        title={
          <>
            Configured for how India <Grad>actually lends.</Grad>
          </>
        }
        lede="Solutions bundle the right modules, workflows and integrations for a specific asset class — a starting configuration proven on real books, tuned to your policy from there."
      />
      <CardsSection eyebrow="Asset classes" title="Five playbooks, live today">
        <Card href="/solutions/two-wheeler" title="Two-Wheeler Finance">
          Dealer-led origination, multi-lender flows, same-day decisions.
        </Card>
        <Card href="/solutions/home-loan" title="Home Loan">
          Stage disbursement, APF, legal-technical checks and 20-year servicing.
        </Card>
        <Card href="/solutions/used-car" title="Used Car Finance">
          Valuation-led underwriting for dealer and refinance journeys.
        </Card>
        <Card href="/solutions/msme" title="MSME Lending">
          Banking, bureau and GST-based assessment for small business credit.
        </Card>
        <Card href="/solutions/co-lending" title="Co-lending">
          CLM-2 mechanics — splits, dual books and settlement — automated.
        </Card>
      </CardsSection>
      <ClosingCta />
    </>
  );
}
