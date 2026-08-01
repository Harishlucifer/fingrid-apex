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
  title: "Loan Management",
  description:
    "After disbursement comes the long game: schedules, repayments, collateral, classification and partner settlement, day after day, correctly. The LMS stack i",
  alternates: { canonical: "/modules/lms" },
};

export default function ModulesLmsPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Loan Management"]]} />
      <Hero
        eyebrow="Module stack · Loan Management"
        title={
          <>
            The system of record for every <Grad>rupee on your book.</Grad>
          </>
        }
        lede="After disbursement comes the long game: schedules, repayments, collateral, classification and partner settlement, day after day, correctly. The LMS stack is Fingrid's core — built to reconcile with the GL by construction and with the RBI by design."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card
          href="/modules/lms/loan-account-management"
          title="Loan Account Management"
        >
          The account itself — schedules, balances, statements and lifecycle.
        </Card>
        <Card
          href="/modules/lms/repayment-management"
          title="Repayment Management"
        >
          Receipts, mandates and the appropriation waterfall.
        </Card>
        <Card
          href="/modules/lms/collateral-management"
          title="Collateral Management"
        >
          Security, documents and release across the loan's life.
        </Card>
        <Card
          href="/modules/lms/portfolio-management"
          title="Portfolio Management"
        >
          The book as a whole — composition, concentration, vintage.
        </Card>
        <Card
          href="/modules/lms/npa-dpd-management"
          title="NPA & DPD Management"
        >
          DPD buckets, IRAC classification and provisioning, automated.
        </Card>
        <Card href="/modules/lms/fldg-management" title="FLDG Management">
          Default guarantees within the regulatory framework.
        </Card>
        <Card
          href="/modules/lms/bc-co-lending-operations"
          title="BC & Co-lending Operations"
        >
          Split books, dual schedules and partner settlement.
        </Card>
        <Card
          href="/modules/lms/loan-servicing-operations"
          title="Loan Servicing Operations"
        >
          Reschedule, restructure, redemption, waiver and write-off.
        </Card>
      </CardsSection>
      <Panel
        id="srm"
        title="Service Request Management"
        note="Shared platform capability"
      >
        <p>
          Every customer request — statement, foreclosure quote, address change,
          data-purge under DPDP — runs through one SRM engine with TATs,
          escalations and full trails. It serves the whole platform and surfaces
          here because most requests touch the loan account.
        </p>
      </Panel>
      <Panel id="eod" title="Automation & EOD" note="Proof point">
        <p>
          Interest accrual, DPD movement, classification checks and scheduled
          postings run as an orchestrated end-of-day sequence — ordered,
          monitored and re-runnable. Your book opens each morning already
          correct.
        </p>
      </Panel>
      <Panel id="ews" title="Early Warning System" note="Roadmap">
        <p>
          On the roadmap: behavioural early-warning signals — bounce patterns,
          partial payments, bureau deterioration — surfacing stress before it
          becomes DPD.
        </p>
      </Panel>
      <Related
        links={[
          ["Collections & Recovery", "/modules/collections"],
          ["Finance & Accounting", "/modules/finance"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
