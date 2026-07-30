import type { Metadata } from "next";
import {
  Bullets,
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
  title: "Agentic Lending",
  description:
    "Fingrid's lending agents do the work that consumes human hours between decisions: reading documents into structured data, qualifying leads, transcribing ca",
  alternates: { canonical: "/ai/agentic-lending" },
};

export default function AiAgenticLendingPage() {
  return (
    <>
      <Crumbs items={[["AI", "/ai"], ["Agentic Lending"]]} />
      <Hero
        pill="Live in production · Expanding"
        eyebrow="AI · Agentic Lending"
        title={
          <>
            AI inside the lending workflow — <Grad>not beside it.</Grad>
          </>
        }
        lede="Fingrid's lending agents do the work that consumes human hours between decisions: reading documents into structured data, qualifying leads, transcribing calls, taking field updates by voice. Each one operates inside the workflow, with its output traceable and its limits explicit."
      />
      <CardsSection eyebrow="In production" title="Working today">
        <Card title="AI document extraction" tag="LIVE">
          Bank statements, bureau reports and KYC documents read into structured
          data — every extracted figure traceable to its source page.
        </Card>
        <Card title="Bureau report intelligence" tag="LIVE">
          Bureau PDFs parsed into scores, tradelines, enquiries and
          delinquencies that land directly in the CAM.
        </Card>
        <Card title="Bank statement analysis" tag="LIVE">
          Cash flows, bounces, obligations and concentration computed from raw
          statements — processed within Indian data residency.
        </Card>
        <Card title="Privacy-tiered processing" tag="LIVE">
          Documents route by sensitivity: identity documents on the strictest
          paths, all financial processing India-resident.
        </Card>
      </CardsSection>
      <CardsSection eyebrow="In development" title="The conversational layer">
        <Card title="Lead Chat AI">
          An assistant that qualifies inbound leads conversationally — product,
          eligibility, documents — and books them into the pipeline.
        </Card>
        <Card title="Call transcription">
          Tele-sales and collection calls transcribed and summarised —
          dispositions suggested, quality review made scalable.
        </Card>
        <Card title="Field voice agent">
          Field executives log visits and update files by voice, in the language
          they work in — the system does the typing.
        </Card>
        <Card title="CAM assembly assistance">
          Draft credit notes assembled from file evidence for the credit officer
          to review, edit and own.
        </Card>
      </CardsSection>
      <Panel title="The rules our lending agents follow">
        <Bullets>
          <li>
            AI never sanctions a loan — decisioning stays with the rule engine
            and credit authority; agents prepare, humans decide
          </li>
          <li>
            Every extraction is source-linked: click the number, see the
            document it came from
          </li>
          <li>
            Customer data processed within Indian data residency requirements,
            with document-sensitivity routing
          </li>
          <li>
            Agent outputs enter the file as drafts and evidence — reviewed,
            never silently final
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          [
            "Credit Appraisal (CAM)",
            "/modules/origination/credit-appraisal-cam",
          ],
          ["Tele Sales", "/modules/sales/tele-sales"],
          ["Architecture & Security", "/platform/architecture-security"],
        ]}
      />
      <ClosingCta
        title="Bring your worst documents."
        body="The best demo of extraction is your own scanned bank statements. We're ready."
      />
    </>
  );
}
