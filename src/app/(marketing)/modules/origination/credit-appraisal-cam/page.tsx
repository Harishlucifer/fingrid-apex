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
  title: "Credit Appraisal (CAM)",
  description:
    "The credit assessment memo is where a lending decision lives. Fingrid assembles it from the file itself — bureau, banking, income, obligations, verificatio",
  alternates: { canonical: "/modules/origination/credit-appraisal-cam" },
};

export default function ModulesOriginationCreditAppraisalCamPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["Origination", "/modules/origination"], ["CAM"]]}
      />
      <Hero
        pill="Live"
        eyebrow="Origination · Credit Appraisal"
        title={
          <>
            The CAM, assembled from{" "}
            <Grad>evidence — not typed from memory.</Grad>
          </>
        }
        lede="The credit assessment memo is where a lending decision lives. Fingrid assembles it from the file itself — bureau, banking, income, obligations, verification findings — so your credit team spends its time judging, not collating."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Auto-assembly">
          Bureau scores, tradelines, banking analysis and verification results
          flow into the CAM automatically.
        </Card>
        <Card title="Income & obligations">
          Income computation with FOIR/DBR analysis across applicants and
          existing obligations.
        </Card>
        <Card title="Bureau intelligence">
          Parsed bureau reports — enquiries, delinquencies, exposures —
          presented for decisioning, not as PDFs.
        </Card>
        <Card title="Eligibility computation">
          Loan eligibility per policy grid computed and shown against the ask.
        </Card>
        <Card title="Deviation surfacing">
          Policy deviations flagged in the CAM with their approval status.
        </Card>
        <Card title="Committee-ready output">
          A structured, printable CAM every credit committee member reads the
          same way.
        </Card>
      </CardsSection>
      <Panel title="AI in the CAM — with receipts">
        <p>
          Fingrid's document intelligence reads bank statements and bureau
          reports into structured data before assembly. Every extracted figure
          is traceable to its source document — AI accelerates the memo; humans
          own the decision.
        </p>
      </Panel>
      <Related
        links={[
          [
            "Underwriting & Rules",
            "/modules/origination/underwriting-rule-engine",
          ],
          ["Verification", "/modules/origination/verification"],
          ["MSME solution", "/solutions/msme"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
