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
  title: "Campaign Management",
  description:
    "Run campaigns across digital, field and referral channels with every lead tagged to its source — and follow it through login, sanction and disbursement to ",
  alternates: { canonical: "/modules/marketing/campaign-management" },
};

export default function ModulesMarketingCampaignManagementPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Marketing", "/modules/marketing"],
          ["Campaign Management"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Marketing · Campaign Management"
        title={
          <>
            Know which rupee of marketing <Grad>became a loan.</Grad>
          </>
        }
        lede="Run campaigns across digital, field and referral channels with every lead tagged to its source — and follow it through login, sanction and disbursement to a true cost per disbursed file."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Campaign setup">
          Define campaigns by product, geography, channel and budget with
          start-end control.
        </Card>
        <Card title="Lead capture">
          Landing forms, QR codes, field entry and referral links all writing
          into one lead pool.
        </Card>
        <Card title="Source attribution">
          Every file carries its campaign lineage from first touch to
          disbursement.
        </Card>
        <Card title="Funnel analytics">
          Lead → contact → login → sanction → disbursement conversion,
          campaign-wise.
        </Card>
        <Card title="Cost economics">
          Spend against disbursed volume — cost per file, per lakh disbursed,
          per channel.
        </Card>
        <Card title="Pipeline handoff">
          Qualified leads route to tele or field queues automatically by
          geography and product.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Tele Sales", "/modules/sales/tele-sales"],
          ["Field Sales", "/modules/sales/field-sales"],
          ["Analytics", "/modules/analytics"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
