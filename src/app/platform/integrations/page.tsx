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
  title: "Integrations",
  description:
    "Bureaus, KYC, mandates, payments and lender APIs — the integrations every Indian lending operation needs, already built and maintained so your go-live isn'",
  alternates: { canonical: "/platform/integrations" },
};

export default function PlatformIntegrationsPage() {
  return (
    <>
      <Crumbs items={[["Platform", "/platform"], ["Integrations"]]} />
      <Hero
        eyebrow="Integrations"
        title={
          <>
            The Indian lending stack, <Grad>pre-wired.</Grad>
          </>
        }
        lede="Bureaus, KYC, mandates, payments and lender APIs — the integrations every Indian lending operation needs, already built and maintained so your go-live isn't hostage to a vendor queue."
      />
      <CardsSection eyebrow="Categories" title="What's on the rails">
        <Card title="Credit bureaus">
          Bureau pulls and report parsing wired into the file journey — scores
          and tradelines land in the CAM automatically.
        </Card>
        <Card title="KYC & onboarding">
          CKYC, DigiLocker, Aadhaar-based journeys, PAN validation and video KYC
          options.
        </Card>
        <Card title="Mandates & repayment">
          eNACH registration and presentation, UPI collections and
          payment-gateway receipts.
        </Card>
        <Card title="Banking & statements">
          Bank statement ingestion and analysis feeding straight into credit
          assessment.
        </Card>
        <Card title="Lender & partner APIs">
          Submission and status APIs toward principal lenders and co-lending
          partners.
        </Card>
        <Card title="Communication">
          SMS, WhatsApp and email for OTPs, notices and campaigns,
          DLT-compliant.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Fingrid OneKey", "/network/onekey"],
          ["Verification", "/modules/origination/verification"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
