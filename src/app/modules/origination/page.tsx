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
  title: "Loan Origination",
  description:
    "The origination stack is where credit decisions get made — file login, appraisal, verification, field credit, underwriting and disbursement as one connecte",
  alternates: { canonical: "/modules/origination" },
};

export default function ModulesOriginationPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Loan Origination"]]} />
      <Hero
        eyebrow="Module stack · Loan Origination"
        title={
          <>
            From file login to disbursement, <Grad>without the gaps.</Grad>
          </>
        }
        lede="The origination stack is where credit decisions get made — file login, appraisal, verification, field credit, underwriting and disbursement as one connected journey, with the rule engine enforcing policy at every gate."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card href="/modules/origination/file-login" title="File Login">
          Formal file entry with checklists, dedup and login fees.
        </Card>
        <Card
          href="/modules/origination/credit-appraisal-cam"
          title="Credit Appraisal (CAM)"
        >
          The credit assessment memo, assembled from evidence.
        </Card>
        <Card href="/modules/origination/verification" title="Verification">
          KYC, document and reference verification workflows.
        </Card>
        <Card
          href="/modules/origination/field-credit-fi-pd"
          title="Field Credit / FI-PD"
        >
          Field investigation and personal discussion with geo-evidence.
        </Card>
        <Card
          href="/modules/origination/underwriting-rule-engine"
          title="Underwriting & Rule Engine"
        >
          Policy-driven decisioning with deviation governance.
        </Card>
        <Card href="/modules/origination/disbursement" title="Disbursement">
          Sanction to money movement, with every pre-condition gated.
        </Card>
        <Card href="/modules/origination/customer-360" title="Customer 360">
          Everything you know about a customer, on one screen.
        </Card>
      </CardsSection>
      <Panel id="offer" title="Offer Acceptance" note="Also in this stack">
        <p>
          Between sanction and disbursement sits the offer: sanction terms
          presented to the customer, negotiated within policy bounds, and
          formally accepted with an audit trail. In Fingrid this runs as a stage
          of the underwriting-to-disbursement journey — terms locked at
          acceptance are the terms the disbursement module enforces.
        </p>
      </Panel>
      <Panel id="appeal" title="Appeal" note="Governance">
        <p>
          Declined files can be appealed through a structured re-look: grounds
          recorded, escalated to a higher credit authority, and decided with
          full visibility of the original decision. Appeals are governance, not
          a side door — every overturn is documented and reportable.
        </p>
      </Panel>
      <Panel id="vendor" title="Vendor Assignment" note="Operational">
        <p>
          Verification, valuation and legal work gets assigned to empanelled
          vendors automatically — by geography, load and TAT performance — with
          turnaround tracked per work order. The operational plumbing behind the
          Verification and Field Credit modules.
        </p>
      </Panel>
      <Related
        links={[
          ["Loan Processing (pipeline)", "/modules/sales/loan-processing"],
          ["Loan Management", "/modules/lms"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
