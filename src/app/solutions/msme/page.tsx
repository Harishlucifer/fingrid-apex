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
  title: "MSME Lending",
  description:
    "MSME underwriting is an evidence problem — banking, bureau and GST tell the real story. This configuration assembles that evidence into a CAM your credit c",
  alternates: { canonical: "/solutions/msme" },
};

export default function SolutionsMsmePage() {
  return (
    <>
      <Crumbs items={[["Solutions", "/solutions"], ["MSME"]]} />
      <Hero
        eyebrow="Solution · MSME"
        title={
          <>
            Credit for the businesses that <Grad>run India.</Grad>
          </>
        }
        lede="MSME underwriting is an evidence problem — banking, bureau and GST tell the real story. This configuration assembles that evidence into a CAM your credit committee can decide on, for secured and unsecured programs alike."
      />
      <CardsSection
        eyebrow="The playbook"
        title="What the MSME configuration bundles"
      >
        <Card title="Banking analysis">
          Bank statement ingestion and analysis — cash flows, bounces,
          concentration — feeding the CAM.
        </Card>
        <Card title="GST-based assessment">
          Turnover corroboration from GST filings alongside declared financials.
        </Card>
        <Card title="Entity handling">
          Proprietorships, partnerships, LLPs and companies — with co-applicant
          and guarantor structures.
        </Card>
        <Card title="Program lending">
          Template-driven programs with eligibility grids for scale, plus
          judgmental tracks for larger tickets.
        </Card>
        <Card title="Field verification">
          Business-premises FI-PD with geo-tagged evidence for the
          informal-economy reality.
        </Card>
        <Card title="Working capital patterns">
          EMI, structured and bullet repayment options per program.
        </Card>
      </CardsSection>
      <Related
        links={[
          [
            "Credit Appraisal (CAM)",
            "/modules/origination/credit-appraisal-cam",
          ],
          ["Field Credit / FI-PD", "/modules/origination/field-credit-fi-pd"],
          ["GST Management", "/modules/finance/gst-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
