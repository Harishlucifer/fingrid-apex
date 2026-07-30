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
  title: "Home Loan",
  description:
    "Long-tenor lending with property at the centre: legal and technical verification, APF projects, stage disbursement against construction progress, and servi",
  alternates: { canonical: "/solutions/home-loan" },
};

export default function SolutionsHomeLoanPage() {
  return (
    <>
      <Crumbs items={[["Solutions", "/solutions"], ["Home Loan"]]} />
      <Hero
        eyebrow="Solution · Home Loan"
        title={
          <>
            Home loans, from file to <Grad>final NOC.</Grad>
          </>
        }
        lede="Long-tenor lending with property at the centre: legal and technical verification, APF projects, stage disbursement against construction progress, and servicing built for a 20-year relationship."
      />
      <CardsSection
        eyebrow="The playbook"
        title="What the home-loan configuration bundles"
      >
        <Card title="Legal & technical">
          Title verification, valuation and technical reports as first-class
          workflow steps with vendor TATs.
        </Card>
        <Card title="APF projects">
          Approved-project files where legal is pre-cleared — faster files,
          tracked at project level.
        </Card>
        <Card title="Stage disbursement">
          Tranche release against construction stages, with inspection gates
          before each release.
        </Card>
        <Card title="Balance transfer">
          BT-in journeys with takeover letters, list-of-documents and
          foreclosure coordination.
        </Card>
        <Card title="PMAY & subsidies">
          Subsidy-linked processing hooks for government scheme workflows.
        </Card>
        <Card title="Long-tenor servicing">
          Re-pricing, part-payments, tenure changes and property document
          custody over decades.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Collateral Management", "/modules/lms/collateral-management"],
          ["Verification", "/modules/origination/verification"],
          ["APF Sales", "/modules/sales#apf"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
