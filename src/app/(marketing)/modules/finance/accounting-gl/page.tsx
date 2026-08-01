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
  title: "Accounting & GL",
  description:
    "Fingrid's GL is dimensional: every posting carries branch, product, channel and cost-centre dimensions, so P&L and balance sheet cut any way you ask — and ",
  alternates: { canonical: "/modules/finance/accounting-gl" },
};

export default function ModulesFinanceAccountingGlPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Finance", "/modules/finance"],
          ["Accounting & GL"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Finance · Accounting & GL"
        title={
          <>
            A general ledger that knows <Grad>which branch made money.</Grad>
          </>
        }
        lede="Fingrid's GL is dimensional: every posting carries branch, product, channel and cost-centre dimensions, so P&L and balance sheet cut any way you ask — and the loan subledger reconciles to the GL by construction, because they're one system."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Dimensional postings">
          Branch, territory, product, channel and cost-centre dimensions on
          every journal line.
        </Card>
        <Card title="Auto-posting">
          Disbursements, receipts, accruals, provisions and write-offs post
          themselves from lending events.
        </Card>
        <Card title="Dimensional P&L & BS">
          Financial statements by any dimension — branch profitability without a
          data-warehouse project.
        </Card>
        <Card title="Subledger reconciliation">
          Loan book and GL agree by design; reconciliation is a report, not a
          project.
        </Card>
        <Card title="Period close">
          Month and year-end close with locks, checklists and audit-friendly
          trails.
        </Card>
        <Card title="Manual journals">
          Governed manual entries with maker-checker, for the exceptions that
          remain.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["NPA provisioning", "/modules/lms/npa-dpd-management"],
          ["GST Management", "/modules/finance/gst-management"],
          ["NBFC Compliance Suite", "/modules/finance/nbfc-compliance-suite"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
