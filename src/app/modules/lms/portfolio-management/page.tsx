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
  title: "Portfolio Management",
  description:
    "Individual accounts are operations; the portfolio is strategy. Composition, concentration, vintage behaviour and roll rates — the analytical layer that tur",
  alternates: { canonical: "/modules/lms/portfolio-management" },
};

export default function ModulesLmsPortfolioManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["LMS", "/modules/lms"], ["Portfolio"]]} />
      <Hero
        pill="In development"
        eyebrow="LMS · Portfolio Management"
        title={
          <>
            See the book the way a <Grad>CRO sees it.</Grad>
          </>
        }
        lede="Individual accounts are operations; the portfolio is strategy. Composition, concentration, vintage behaviour and roll rates — the analytical layer that turns a ledger of loans into a managed book."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Composition views">
          The book cut by product, geography, channel, ticket size and tenor —
          instantly.
        </Card>
        <Card title="Concentration monitoring">
          Exposure concentration by borrower group, sector and geography against
          internal limits.
        </Card>
        <Card title="Vintage analysis">
          Cohort performance by origination period — is this year's book better
          than last year's?
        </Card>
        <Card title="Roll rates">
          Bucket-to-bucket movement showing where delinquency is forming and
          curing.
        </Card>
        <Card title="Channel quality">
          Portfolio performance traced back to sourcing channel and partner.
        </Card>
        <Card title="Trend alerts">
          Deteriorating segments surfaced before they surface themselves.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["NPA & DPD", "/modules/lms/npa-dpd-management"],
          ["Analytics & Reports", "/modules/analytics"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
