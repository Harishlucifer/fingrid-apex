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
  title: "GST Management",
  description:
    "Lending operations generate GST on both sides — output tax on fees and charges, input credit on agency and vendor invoices, reverse charge where it applies",
  alternates: { canonical: "/modules/finance/gst-management" },
};

export default function ModulesFinanceGstManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Finance", "/modules/finance"], ["GST"]]} />
      <Hero
        pill="In development"
        eyebrow="Finance · GST Management"
        title={
          <>
            GST from the transactions, <Grad>not from memory.</Grad>
          </>
        }
        lede="Lending operations generate GST on both sides — output tax on fees and charges, input credit on agency and vendor invoices, reverse charge where it applies. Fingrid computes it at the transaction, so the return is a reconciliation, not a reconstruction."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Output liability">
          GST on processing fees, charges and services computed at posting,
          invoice-wise.
        </Card>
        <Card title="Input tax credit">
          ITC captured from vendor and agency invoices with eligibility
          treatment.
        </Card>
        <Card title="Reconciliation">
          Purchase-register-to-2B matching that shows exactly which invoices are
          missing credit.
        </Card>
        <Card title="Reverse charge">
          RCM identification and liability computation on applicable services.
        </Card>
        <Card title="Return-ready data">
          GSTR-1 and 3B data assembled from the books — filed through your
          preferred filing route.
        </Card>
        <Card title="Multi-registration">
          Multiple GSTINs across states handled with registration-wise books.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["TDS Management", "/modules/finance/tds-management"],
          ["Vendor Payables", "/modules/finance#payables"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
