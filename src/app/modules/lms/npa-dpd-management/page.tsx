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
  title: "NPA & DPD Management",
  description:
    "DPD computation, SMA and NPA classification, provisioning and income recognition control — the RBI's IRAC framework implemented as daily automation, so cla",
  alternates: { canonical: "/modules/lms/npa-dpd-management" },
};

export default function ModulesLmsNpaDpdManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["LMS", "/modules/lms"], ["NPA & DPD"]]} />
      <Hero
        pill="Live"
        eyebrow="LMS · NPA & DPD Management"
        title={
          <>
            IRAC classification, run by the{" "}
            <Grad>system — not the spreadsheet.</Grad>
          </>
        }
        lede="DPD computation, SMA and NPA classification, provisioning and income recognition control — the RBI's IRAC framework implemented as daily automation, so classification is a fact of the system rather than a month-end negotiation."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Daily DPD engine">
          Days-past-due computed account-wise in EOD — including the day-end
          position norms examiners check.
        </Card>
        <Card title="SMA & NPA marking">
          SMA-0/1/2 and NPA classification applied automatically per IRAC
          timelines.
        </Card>
        <Card title="Borrower-level classification">
          One account slips, all accounts of the borrower classify — as the
          norms require.
        </Card>
        <Card title="Provisioning">
          Provision computation by classification bucket, posted to the GL with
          movement tracking.
        </Card>
        <Card title="Income recognition">
          Interest on NPA accounts suspended, tracked in shadow, recognised only
          on realisation.
        </Card>
        <Card title="Upgrade discipline">
          NPA upgrades only when the norms are met — arrears cleared, not merely
          reduced.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Collections", "/modules/collections"],
          ["NBFC Compliance Suite", "/modules/finance/nbfc-compliance-suite"],
          ["Accounting & GL", "/modules/finance/accounting-gl"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
