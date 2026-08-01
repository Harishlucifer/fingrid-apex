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
  title: "Underwriting & Rule Engine",
  description:
    "Eligibility grids, knockout criteria, deviation matrices and sanction authority — expressed as rules your credit head can read, executed consistently on ev",
  alternates: { canonical: "/modules/origination/underwriting-rule-engine" },
};

export default function ModulesOriginationUnderwritingRuleEnginePage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Origination", "/modules/origination"],
          ["Underwriting"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Origination · Underwriting & Rule Engine"
        title={
          <>
            Your credit policy, running as <Grad>executable rules.</Grad>
          </>
        }
        lede="Eligibility grids, knockout criteria, deviation matrices and sanction authority — expressed as rules your credit head can read, executed consistently on every file, changed without a code release."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Policy as rules">
          Age, income, FOIR, LTV, bureau and geography criteria as readable rule
          statements.
        </Card>
        <Card title="Knockouts & grids">
          Hard declines applied instantly; eligibility grids compute amount,
          rate and tenure bands.
        </Card>
        <Card title="Deviation matrix">
          Out-of-policy conditions routed to the right approval authority by
          deviation type and severity.
        </Card>
        <Card title="Sanction authority">
          Approval limits by role and amount — the system knows who can sanction
          what.
        </Card>
        <Card title="Decision audit">
          Every decision stores the rule version, inputs and outcome —
          explainable to an inspector years later.
        </Card>
        <Card title="Policy versioning">
          Effective-dated rule changes via Configuration Studio, with
          maker-checker.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Configuration Studio", "/platform/configuration-studio"],
          ["Credit Appraisal", "/modules/origination/credit-appraisal-cam"],
          ["Disbursement", "/modules/origination/disbursement"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
