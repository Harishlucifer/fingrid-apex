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
  title: "BC & Co-lending Operations",
  description:
    "Co-lending and BC arrangements put two institutions on one loan — split exposures, parallel schedules, shared collections and monthly settlement. This modu",
  alternates: { canonical: "/modules/lms/bc-co-lending-operations" },
};

export default function ModulesLmsBcCoLendingOperationsPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["LMS", "/modules/lms"], ["BC & Co-lending"]]}
      />
      <Hero
        eyebrow="LMS · BC & Co-lending Operations"
        title={
          <>
            Two lenders, one loan, <Grad>zero reconciliation pain.</Grad>
          </>
        }
        lede="Co-lending and BC arrangements put two institutions on one loan — split exposures, parallel schedules, shared collections and monthly settlement. This module runs those mechanics as one operation instead of four spreadsheets."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Split exposure">
          Loans held in agreement ratio, with each partner's principal and
          interest tracked separately.
        </Card>
        <Card title="Dual schedules">
          Partner-wise repayment schedules maintained in parallel and
          regenerated together on any change.
        </Card>
        <Card title="Receipt apportionment">
          Every collection split across partners by ratio and appropriation
          order, automatically.
        </Card>
        <Card title="BC receivables">
          Service fees and commissions computed per corridor agreement, invoiced
          with correct tax treatment.
        </Card>
        <Card title="Repayment status sync">
          Status updates flow between BC books and principal-lender books — both
          sides see one truth.
        </Card>
        <Card title="Settlement statements">
          Period settlement computed, documented and reconciled — month-end
          closes in hours.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Co-lending solution", "/solutions/co-lending"],
          ["Bc OS", "/products/bcos"],
          ["FLDG Management", "/modules/lms/fldg-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
