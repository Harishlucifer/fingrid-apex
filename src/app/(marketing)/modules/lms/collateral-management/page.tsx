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
  title: "Collateral Management",
  description:
    "Property, vehicles, gold and financial assets — the collateral behind secured lending, tracked with valuations, charge status, document custody and the rel",
  alternates: { canonical: "/modules/lms/collateral-management" },
};

export default function ModulesLmsCollateralManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["LMS", "/modules/lms"], ["Collateral"]]} />
      <Hero
        pill="In development"
        eyebrow="LMS · Collateral Management"
        title={
          <>
            Security, tracked from charge <Grad>to release.</Grad>
          </>
        }
        lede="Property, vehicles, gold and financial assets — the collateral behind secured lending, tracked with valuations, charge status, document custody and the release workflow at closure that customers judge you by."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Collateral registry">
          Every security linked to its loans — including shared and
          cross-collateralised structures.
        </Card>
        <Card title="Valuation tracking">
          Initial and periodic revaluations with LTV monitored against current
          value.
        </Card>
        <Card title="Charge management">
          Hypothecation, mortgage and CERSAI/charge-registration status per
          asset.
        </Card>
        <Card title="Document custody">
          Title documents tracked in and out of custody with movement logs.
        </Card>
        <Card title="Release workflow">
          On closure: document release with checklists, authorisations and
          customer acknowledgement.
        </Card>
        <Card title="Insurance linkage">
          Asset insurance policies tracked with expiry alerts.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Home Loan solution", "/solutions/home-loan"],
          ["Legal & Recovery", "/modules/collections/legal-recovery"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
