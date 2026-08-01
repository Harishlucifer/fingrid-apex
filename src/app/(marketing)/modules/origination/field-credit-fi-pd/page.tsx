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
  title: "Field Credit / FI-PD",
  description:
    "For the India where income is informal and addresses are approximate, field investigation and personal discussion are the credit check. Fingrid runs FI-PD ",
  alternates: { canonical: "/modules/origination/field-credit-fi-pd" },
};

export default function ModulesOriginationFieldCreditFiPdPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Origination", "/modules/origination"],
          ["FI-PD"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Origination · Field Credit"
        title={
          <>
            Field investigation with <Grad>evidence that stands up.</Grad>
          </>
        }
        lede="For the India where income is informal and addresses are approximate, field investigation and personal discussion are the credit check. Fingrid runs FI-PD as structured mobile workflow — geo-tagged, templated, photographed."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Structured templates">
          Residence, office and business FI templates with product-specific
          questions.
        </Card>
        <Card title="Geo & photo evidence">
          GPS-stamped visits with photo capture — the report proves the visit
          happened.
        </Card>
        <Card title="PD recording">
          Personal discussion findings — business understanding, income
          assessment — captured in the credit officer's structured words.
        </Card>
        <Card title="Assignment & TAT">
          FI work orders assigned to internal officers or agencies by geography,
          with TAT tracking.
        </Card>
        <Card title="CAM integration">
          Findings land directly in the CAM as verification evidence.
        </Card>
        <Card title="Discrepancy flags">
          Mismatches with declared data flagged for underwriting attention
          automatically.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Credit Appraisal", "/modules/origination/credit-appraisal-cam"],
          ["MSME solution", "/solutions/msme"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
