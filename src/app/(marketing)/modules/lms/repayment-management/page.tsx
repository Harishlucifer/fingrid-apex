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
  title: "Repayment Management",
  description:
    "eNACH presentations, UPI collections, field receipts and branch deposits — every rupee received lands on the right account and splits across dues in the co",
  alternates: { canonical: "/modules/lms/repayment-management" },
};

export default function ModulesLmsRepaymentManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["LMS", "/modules/lms"], ["Repayments"]]} />
      <Hero
        pill="Live"
        eyebrow="LMS · Repayment Management"
        title={
          <>
            Every receipt, appropriated <Grad>by the book.</Grad>
          </>
        }
        lede="eNACH presentations, UPI collections, field receipts and branch deposits — every rupee received lands on the right account and splits across dues in the configured appropriation order, with bounce handling that starts the follow-up automatically."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Mandate operations">
          eNACH registration, presentation cycles, re-presentation and mandate
          health tracking.
        </Card>
        <Card title="Appropriation waterfall">
          Receipts split across charges, penal, interest and principal in your
          configured order — consistently, every time.
        </Card>
        <Card title="Multi-mode receipting">
          Digital, field and branch receipts on one engine, each with instant
          customer receipts.
        </Card>
        <Card title="Bounce handling">
          Returns captured with reasons, bounce charges applied per policy,
          collection follow-up triggered.
        </Card>
        <Card title="Advance & excess">
          Advance EMIs and excess amounts held and adjusted per policy, visibly.
        </Card>
        <Card title="Deposit reconciliation">
          Field and branch collections reconciled against bank deposits —
          leakage has nowhere to hide.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["DigiCollect", "/modules/collections/digicollect"],
          ["NPA & DPD", "/modules/lms/npa-dpd-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
