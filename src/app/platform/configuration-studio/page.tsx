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
  title: "Configuration Studio",
  description:
    "Four engines — workflow, rule, task and parameter — that let your product and credit teams reshape journeys, decisions and checklists themselves. The OS ad",
  alternates: { canonical: "/platform/configuration-studio" },
};

export default function PlatformConfigurationStudioPage() {
  return (
    <>
      <Crumbs items={[["Platform", "/platform"], ["Configuration Studio"]]} />
      <Hero
        pill="Live"
        eyebrow="Configuration Studio"
        title={
          <>
            Change credit policy without a <Grad>code release.</Grad>
          </>
        }
        lede="Four engines — workflow, rule, task and parameter — that let your product and credit teams reshape journeys, decisions and checklists themselves. The OS adapts to your policy; your policy doesn't wait for a sprint."
      />
      <CardsSection eyebrow="The engines" title="Four engines, one studio">
        <Card title="Workflow engine">
          Design stage flows per product — who does what, in what order, with
          what SLAs — and version them safely.
        </Card>
        <Card title="Rule engine">
          Eligibility, deviation and decisioning rules expressed as statements
          your credit head can read and edit.
        </Card>
        <Card title="Task engine">
          Checklists, document requirements and verification tasks generated per
          file, per product, per policy.
        </Card>
        <Card title="Parameter engine">
          Rates, charges, LTVs, FOIR caps and scheme parameters, effective-dated
          and audit-trailed.
        </Card>
      </CardsSection>
      <Panel title="Governance built in">
        <Bullets>
          <li>
            Maker-checker on every configuration change that touches credit or
            money
          </li>
          <li>
            Effective dating — schedule a policy change for the 1st without a
            midnight deployment
          </li>
          <li>
            Full audit trail: who changed what rule, when, and which files it
            affected
          </li>
          <li>
            Service request and ticketing workflows run on the same engines
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Deployment & Onboarding", "/platform/deployment-onboarding"],
          [
            "Underwriting & Rule Engine",
            "/modules/origination/underwriting-rule-engine",
          ],
        ]}
      />
      <ClosingCta />
    </>
  );
}
