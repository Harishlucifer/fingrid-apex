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
  title: "Disbursement",
  description:
    "Disbursement is where mistakes get expensive. Fingrid gates the release behind every pre-condition — documentation, mandates, insurance, deductions — and p",
  alternates: { canonical: "/modules/origination/disbursement" },
};

export default function ModulesOriginationDisbursementPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Origination", "/modules/origination"],
          ["Disbursement"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Origination · Disbursement"
        title={
          <>
            The money moves only when <Grad>everything is true.</Grad>
          </>
        }
        lede="Disbursement is where mistakes get expensive. Fingrid gates the release behind every pre-condition — documentation, mandates, insurance, deductions — and posts the accounting the moment money moves."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Pre-disbursement checklist">
          Agreement execution, eNACH registration, insurance and PDD conditions
          gated before release.
        </Card>
        <Card title="Deduction handling">
          Processing fees, insurance and broken-period interest computed and
          netted correctly.
        </Card>
        <Card title="Beneficiary controls">
          Penny-drop validated beneficiaries — dealer, builder, BT lender or
          customer per product rules.
        </Card>
        <Card title="Tranche support">
          Stage disbursement for construction-linked products, each tranche
          gated on inspection.
        </Card>
        <Card title="Instant accounting">
          Disbursement posts to the loan account and GL simultaneously — no
          end-of-day catch-up.
        </Card>
        <Card title="Welcome kit">
          Schedule, agreement copy and welcome letter generated at disbursement.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Loan Account Management", "/modules/lms/loan-account-management"],
          ["Home Loan solution", "/solutions/home-loan"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
