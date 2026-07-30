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
  title: "TDS Management",
  description:
    "DSA payouts, agency commissions, professional fees, contractor payments — a lending business deducts TDS constantly. Fingrid applies the right section and ",
  alternates: { canonical: "/modules/finance/tds-management" },
};

export default function ModulesFinanceTdsManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Finance", "/modules/finance"], ["TDS"]]} />
      <Hero
        eyebrow="Finance · TDS Management"
        title={
          <>
            Deducted at source, <Grad>correct at source.</Grad>
          </>
        }
        lede="DSA payouts, agency commissions, professional fees, contractor payments — a lending business deducts TDS constantly. Fingrid applies the right section and rate at the payment itself, tracks challans, and keeps quarterly returns a compilation instead of a crisis."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Section mapping">
          Payment types mapped to sections — commission, professional,
          contractual — with current rates.
        </Card>
        <Card title="Deduction at payment">
          TDS computed and withheld in the payout and payables flows themselves,
          PAN-validated.
        </Card>
        <Card title="Threshold tracking">
          Per-deductee annual thresholds tracked so deduction starts exactly
          when it should.
        </Card>
        <Card title="Challan management">
          Deposits tracked against liability by section and month, with due-date
          alerts.
        </Card>
        <Card title="Quarterly returns">
          24Q and 26Q data assembled deductee-wise from the same records.
        </Card>
        <Card title="Certificates">
          Form 16A generation support for every deductee, every quarter.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Partner Payouts", "/modules/sales/partner-management-payouts"],
          ["Payroll", "/modules/hrms/payroll-processing"],
          ["GST Management", "/modules/finance/gst-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
