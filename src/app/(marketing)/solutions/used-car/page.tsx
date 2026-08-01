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
  title: "Used Car Finance",
  description:
    "Where the asset's real value is the underwriting question: valuation-led journeys, dealer and refinance flows, and LTV discipline on a depreciating, hetero",
  alternates: { canonical: "/solutions/used-car" },
};

export default function SolutionsUsedCarPage() {
  return (
    <>
      <Crumbs items={[["Solutions", "/solutions"], ["Used Car"]]} />
      <Hero
        eyebrow="Solution · Used Car"
        title={
          <>
            Used car finance, <Grad>valuation-first.</Grad>
          </>
        }
        lede="Where the asset's real value is the underwriting question: valuation-led journeys, dealer and refinance flows, and LTV discipline on a depreciating, heterogeneous asset class."
      />
      <CardsSection
        eyebrow="The playbook"
        title="What the used-car configuration bundles"
      >
        <Card title="Valuation workflow">
          Vehicle inspection and valuation as a gated step — LTV computed on
          assessed value, not sticker price.
        </Card>
        <Card title="Dealer & DSA channels">
          Used-car dealer empanelment alongside DSA sourcing, each with their
          own payout logic.
        </Card>
        <Card title="Refinance journeys">
          Loans against owned vehicles with RC verification and hypothecation
          workflows.
        </Card>
        <Card title="Age & model policy">
          Rule-engine policies on vehicle age at maturity, model categories and
          geography.
        </Card>
        <Card title="Repossession-ready">
          Collections escalating into repossession workflows with proper
          documentation when it comes to that.
        </Card>
      </CardsSection>
      <Related
        links={[
          [
            "Underwriting & Rules",
            "/modules/origination/underwriting-rule-engine",
          ],
          ["FieldCollect", "/modules/collections/fieldcollect"],
          ["Legal & Recovery", "/modules/collections/legal-recovery"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
