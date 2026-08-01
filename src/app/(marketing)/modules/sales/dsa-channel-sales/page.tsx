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
  title: "DSA Channel Sales",
  description:
    "Empanelment, file flow, performance and payouts for the DSA channel — the sourcing engine of Indian retail lending, managed with the same rigour as your ow",
  alternates: { canonical: "/modules/sales/dsa-channel-sales" },
};

export default function ModulesSalesDsaChannelSalesPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["Sales", "/modules/sales"], ["DSA Channel"]]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · DSA Channel"
        title={
          <>
            Your DSA network, run like a <Grad>channel, not a rolodex.</Grad>
          </>
        }
        lede="Empanelment, file flow, performance and payouts for the DSA channel — the sourcing engine of Indian retail lending, managed with the same rigour as your own branches."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Empanelment">
          DSA onboarding with KYC, agreements and payout grids — maker-checker
          controlled.
        </Card>
        <Card title="File submission">
          Files flow in through the DSA Portal with checklists enforced at the
          source.
        </Card>
        <Card title="Channel hierarchy">
          DSAs, sub-DSAs and connectors modelled as they exist, with attribution
          down the chain.
        </Card>
        <Card title="Performance tracking">
          Login-to-disbursement conversion, FTR rates and portfolio quality by
          DSA.
        </Card>
        <Card title="Payout linkage">
          Disbursements drive payout computation per grid — no month-end Excel
          reconciliation.
        </Card>
        <Card title="Network comms">
          Scheme launches and rate changes broadcast to the whole channel at
          once.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["DSA Portal", "/products/portals/dsa-portal"],
          ["Partner Payouts", "/modules/sales/partner-management-payouts"],
          ["Fingrid Connect", "/network/connect"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
