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
  title: "Loan Servicing Operations",
  description:
    "Reschedule, restructure, redemption, waiver and write-off — the servicing events that alter a loan's terms or existence. Each runs as a governed workflow w",
  alternates: { canonical: "/modules/lms/loan-servicing-operations" },
};

export default function ModulesLmsLoanServicingOperationsPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["LMS", "/modules/lms"], ["Loan Servicing"]]}
      />
      <Hero
        eyebrow="LMS · Loan Servicing Operations"
        title={
          <>
            When the loan’s life changes,{" "}
            <Grad>the books change correctly.</Grad>
          </>
        }
        lede="Reschedule, restructure, redemption, waiver and write-off — the servicing events that alter a loan's terms or existence. Each runs as a governed workflow with the schedule, classification and accounting consequences applied in one motion."
      />
      <CardsSection
        eyebrow="The lifecycle"
        title="Five operations, one discipline"
      >
        <Card title="Reschedule">
          Tenure and EMI changes with schedule regeneration and customer consent
          on record.
        </Card>
        <Card title="Restructure">
          Restructuring with the classification and provisioning consequences
          the norms require — applied, not overlooked.
        </Card>
        <Card title="Redemption">
          Foreclosure and pre-closure with quote generation, charge application
          per rules, and collateral release triggered.
        </Card>
        <Card title="Waiver">
          Charge and interest waivers under an authority matrix, with P&amp;L
          impact posted transparently.
        </Card>
        <Card title="Write-off">
          Write-off with approvals and full accounting — while collections
          continue on the written-off book, recoveries posting as income.
        </Card>
        <Card title="OTS handling">
          One-time settlements negotiated, approved and tracked through to
          sacrifice accounting.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Legal & Recovery", "/modules/collections/legal-recovery"],
          ["NPA & DPD", "/modules/lms/npa-dpd-management"],
          ["Accounting & GL", "/modules/finance/accounting-gl"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
