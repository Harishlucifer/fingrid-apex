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
  title: "Marketing",
  description:
    "Lending marketing isn't measured in impressions — it's measured in files that convert. The Marketing stack runs campaigns and attribution wired directly in",
  alternates: { canonical: "/modules/marketing" },
};

export default function ModulesMarketingPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Marketing"]]} />
      <Hero
        eyebrow="Module stack · Marketing"
        title={
          <>
            Marketing that ends in a <Grad>disbursed loan.</Grad>
          </>
        }
        lede="Lending marketing isn't measured in impressions — it's measured in files that convert. The Marketing stack runs campaigns and attribution wired directly into the same pipeline your sales and credit teams work."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card
          href="/modules/marketing/campaign-management"
          title="Campaign Management"
        >
          Multi-channel campaigns with lead capture, source attribution and
          cost-per-file economics.
        </Card>
      </CardsSection>
      <Panel id="assets" title="Marketing Assets" note="Also in this stack">
        <p>
          A shared library for creatives, brochures and rate cards — versioned,
          so the field always sends the current one. Lives inside Campaign
          Management as the asset layer behind every campaign.
        </p>
      </Panel>
      <Related
        links={[
          ["Sales & Channels", "/modules/sales"],
          ["Tele Sales", "/modules/sales/tele-sales"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
