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
  title: "Two-Wheeler Finance",
  description:
    "Dealer-led origination where the customer is standing at the counter: dealer onboarding, in-showroom journeys, multi-lender routing and decisions fast enou",
  alternates: { canonical: "/solutions/two-wheeler" },
};

export default function SolutionsTwoWheelerPage() {
  return (
    <>
      <Crumbs items={[["Solutions", "/solutions"], ["Two-Wheeler"]]} />
      <Hero
        eyebrow="Solution · Two-Wheeler"
        title={
          <>
            Two-wheeler finance at <Grad>showroom speed.</Grad>
          </>
        }
        lede="Dealer-led origination where the customer is standing at the counter: dealer onboarding, in-showroom journeys, multi-lender routing and decisions fast enough to close the sale before the chai goes cold."
      />
      <CardsSection
        eyebrow="The playbook"
        title="What the two-wheeler configuration bundles"
      >
        <Card title="Dealer network">
          Parent-child dealer and branch code structures, empanelment, payouts
          and dealer performance tracking.
        </Card>
        <Card title="Showroom journey">
          Lead to file at the counter — KYC, bureau-in-journey and scheme
          selection on the spot.
        </Card>
        <Card title="Multi-lender routing">
          Route files across your lender panel by scheme, geography and approval
          odds.
        </Card>
        <Card title="Schemes & subvention">
          Manufacturer and dealer subvention schemes with correct charge and
          payout accounting.
        </Card>
        <Card title="Fast decisioning">
          Rule-engine decisions on bureau, FOIR and scheme parameters — minutes,
          not days.
        </Card>
        <Card title="Collections">
          Bucket-wise collection strategy tuned for high-volume, small-ticket
          portfolios.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Loan Origination", "/modules/origination"],
          ["Partner Management", "/modules/sales/partner-management-payouts"],
          ["Collections", "/modules/collections"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
