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
  title: "Verification",
  description:
    "KYC, document and reference verification as workflow — not a folder of screenshots. Every check has an owner, a method, a result and a timestamp, and the f",
  alternates: { canonical: "/modules/origination/verification" },
};

export default function ModulesOriginationVerificationPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Origination", "/modules/origination"],
          ["Verification"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Origination · Verification"
        title={
          <>
            Trust, <Grad>verified in-journey.</Grad>
          </>
        }
        lede="KYC, document and reference verification as workflow — not a folder of screenshots. Every check has an owner, a method, a result and a timestamp, and the file can't advance past a failed check without governance."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="KYC verification">
          CKYC, DigiLocker, Aadhaar-based options, PAN validation and video KYC
          journeys.
        </Card>
        <Card title="Document verification">
          Authenticity checks on income, banking and property documents with
          structured results.
        </Card>
        <Card title="Reference checks">
          Personal and business reference verification with recorded outcomes.
        </Card>
        <Card title="Vendor orchestration">
          External verification agencies assigned, tracked and TAT-scored
          automatically.
        </Card>
        <Card title="Result gating">
          Verification outcomes gate underwriting — a failed check needs
          explicit deviation approval.
        </Card>
        <Card title="Evidence trail">
          Every check auditable: who verified, how, when, with what evidence
          attached.
        </Card>
      </CardsSection>
      <Panel title="The same engine powers VerifyOS">
        <p>
          Verification agencies run their whole operation on VerifyOS — the same
          verification engine, agency-side. When your verification partners are
          on it, work orders and reports flow system-to-system.
        </p>
      </Panel>
      <Related
        links={[
          ["VerifyOS", "/products/verifyos"],
          ["Field Credit / FI-PD", "/modules/origination/field-credit-fi-pd"],
          ["Integrations", "/platform/integrations"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
