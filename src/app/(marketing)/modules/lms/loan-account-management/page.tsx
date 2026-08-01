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
  title: "Loan Account Management",
  description:
    "Schedules, balances, accruals and statements for every account on the book — the record every other module, every customer query and every audit ultimately",
  alternates: { canonical: "/modules/lms/loan-account-management" },
};

export default function ModulesLmsLoanAccountManagementPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["LMS", "/modules/lms"], ["Loan Accounts"]]}
      />
      <Hero
        pill="Live"
        eyebrow="LMS · Loan Account Management"
        title={
          <>
            The loan account, kept <Grad>exactly right.</Grad>
          </>
        }
        lede="Schedules, balances, accruals and statements for every account on the book — the record every other module, every customer query and every audit ultimately points at."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Schedule engine">
          EMI, structured, bullet and step-up schedules generated per product
          maths, regenerated correctly on change.
        </Card>
        <Card title="Interest accrual">
          Daily accrual per product method, posted through EOD, reconciled to
          the GL.
        </Card>
        <Card title="Balance integrity">
          Principal, interest, charges and advance components tracked separately
          — no mystery balances.
        </Card>
        <Card title="Statements & certificates">
          SOA, repayment schedules and interest certificates on demand,
          self-served through portals.
        </Card>
        <Card title="Charges & penal">
          Charge application per policy, with penal charges as charges — never
          capitalised — per RBI norms.
        </Card>
        <Card title="Lifecycle states">
          Active, closed, written-off and restructured states with the
          transitions governed.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Repayment Management", "/modules/lms/repayment-management"],
          ["Accounting & GL", "/modules/finance/accounting-gl"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
