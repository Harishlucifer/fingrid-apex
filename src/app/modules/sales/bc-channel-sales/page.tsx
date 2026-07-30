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
  title: "BC Channel Sales",
  description:
    "For lenders who source through BCs — and BCs who source for lenders — this module runs the channel: corridor agreements, sourcing targets, file quality and",
  alternates: { canonical: "/modules/sales/bc-channel-sales" },
};

export default function ModulesSalesBcChannelSalesPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["Sales", "/modules/sales"], ["BC Channel"]]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · BC Channel"
        title={
          <>
            Business correspondent sourcing, <Grad>corridor by corridor.</Grad>
          </>
        }
        lede="For lenders who source through BCs — and BCs who source for lenders — this module runs the channel: corridor agreements, sourcing targets, file quality and the commercial relationship, all visible."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="BC onboarding">
          Corridor agreements, product mandates and geographies per BC
          relationship.
        </Card>
        <Card title="Sourcing pipeline">
          BC-sourced files flagged and tracked with the same pipeline discipline
          as direct channels.
        </Card>
        <Card title="Quality metrics">
          FTR, rejection reasons and early-delinquency by BC — the numbers that
          decide corridor renewals.
        </Card>
        <Card title="Commercial terms">
          Service-fee and commission structures per corridor, feeding settlement
          automatically.
        </Card>
        <Card title="Target management">
          Corridor-wise sourcing targets with monthly tracking.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["BcOS", "/products/bcos"],
          [
            "BC & Co-lending Operations",
            "/modules/lms/bc-co-lending-operations",
          ],
        ]}
      />
      <ClosingCta />
    </>
  );
}
