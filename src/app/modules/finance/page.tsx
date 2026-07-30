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
  title: "Finance & Accounting",
  description:
    "Every lending event posts double-entry the moment it happens — into a dimensional GL that answers questions Tally can't: which branch made money, which pro",
  alternates: { canonical: "/modules/finance" },
};

export default function ModulesFinancePage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Finance & Accounting"]]} />
      <Hero
        eyebrow="Module stack · Finance & Accounting"
        title={
          <>
            Books that close because they were <Grad>never open-ended.</Grad>
          </>
        }
        lede="Every lending event posts double-entry the moment it happens — into a dimensional GL that answers questions Tally can't: which branch made money, which product, which channel. GST, TDS and the NBFC compliance suite ride the same books."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card href="/modules/finance/accounting-gl" title="Accounting & GL">
          Multi-dimensional general ledger with branch, product and channel
          P&amp;L.
        </Card>
        <Card href="/modules/finance/gst-management" title="GST Management">
          Output liability, ITC and return-ready reconciliation.
        </Card>
        <Card href="/modules/finance/tds-management" title="TDS Management">
          Deduction, challans and quarterly returns, wired to payouts.
        </Card>
        <Card
          href="/modules/finance/nbfc-compliance-suite"
          title="NBFC Compliance Suite"
        >
          Treasury, ALM, regulatory reporting and ECL — the lender-only layer.
        </Card>
      </CardsSection>
      <Panel
        id="vendor"
        title="Vendor & Purchase Management"
        note="Also in this stack"
      >
        <p>
          Vendor master, purchase workflows and approvals for operating spend —
          verification agencies, valuers, IT, facilities — with the payables
          that follow.
        </p>
      </Panel>
      <Panel id="payables" title="Vendor Payables" note="Also in this stack">
        <p>
          Invoice booking with GST and TDS treatment applied, approval workflows
          and payment scheduling — payables that reconcile because they were
          booked correctly.
        </p>
      </Panel>
      <Panel
        id="emp-incentive"
        title="Employee Incentive Management"
        note="Also in this stack"
      >
        <p>
          Computed incentives from the Sales and Collections stacks flow here
          for financial approval and payroll handoff — one bridge between
          performance data and salary credit.
        </p>
      </Panel>
      <Panel
        id="reimbursement"
        title="Expense Reimbursement"
        note="Also in this stack"
      >
        <p>
          Field-heavy teams spend on the road. Claims with receipts, policy
          checks and approvals, posting to the right cost centres.
        </p>
      </Panel>
      <Related
        links={[
          ["Loan Management", "/modules/lms"],
          ["Analytics & Reports", "/modules/analytics"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
