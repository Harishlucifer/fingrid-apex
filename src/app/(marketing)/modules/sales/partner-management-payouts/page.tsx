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
  title: "Partner Management & Payouts",
  description:
    "The lifecycle and money side of every external partner — DSAs, dealers, connectors, referral sources — from agreement to disbursement-linked payout, with t",
  alternates: { canonical: "/modules/sales/partner-management-payouts" },
};

export default function ModulesSalesPartnerManagementPayoutsPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Sales", "/modules/sales"],
          ["Partner Mgmt & Payouts"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · Partner Management & Payouts"
        title={
          <>
            Partners paid correctly, <Grad>on time, with proof.</Grad>
          </>
        }
        lede="The lifecycle and money side of every external partner — DSAs, dealers, connectors, referral sources — from agreement to disbursement-linked payout, with the GST and TDS treatment done right."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Partner master">
          One record per partner across types — agreements, grids, bank details,
          status.
        </Card>
        <Card title="Payout grids">
          Product-wise, slab-wise structures with effective dating for mid-cycle
          changes.
        </Card>
        <Card title="Disbursement-linked computation">
          Payouts computed the moment disbursement happens, not at month-end.
        </Card>
        <Card title="Invoice & compliance">
          Invoice collection, GST treatment and TDS deduction applied per
          partner type.
        </Card>
        <Card title="Approval workflow">
          Maker-checker approval with hold and clawback handling.
        </Card>
        <Card title="Partner statements">
          Self-serve statements through the DSA Portal — fewer 'where's my
          payout' calls.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["DSA Channel Sales", "/modules/sales/dsa-channel-sales"],
          ["TDS Management", "/modules/finance/tds-management"],
          ["GST Management", "/modules/finance/gst-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
