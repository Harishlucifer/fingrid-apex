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
  title: "Architecture & Security",
  description:
    "Multi-tenancy models that match your risk appetite, data that stays in India, and controls designed for DPDP and lender infosec questionnaires.",
  alternates: { canonical: "/platform/architecture-security" },
};

export default function PlatformArchitectureSecurityPage() {
  return (
    <>
      <Crumbs
        items={[["Platform", "/platform"], ["Architecture & Security"]]}
      />
      <Hero
        eyebrow="Architecture & Security"
        title={
          <>
            Enterprise-grade, <Grad>India-resident.</Grad>
          </>
        }
        lede="Multi-tenancy models that match your risk appetite, data that stays in India, and controls designed for DPDP and lender infosec questionnaires."
      />
      <CardsSection
        eyebrow="Architecture"
        title="Five deployment models, one platform"
        intro="The same codebase and upgrade path across all five — your infosec posture picks the isolation level, not the feature set."
      >
        <Card title="Shared multi-tenant (RLS)">
          Row-level security isolation on shared infrastructure — every query
          tenant-scoped at the database layer. The fastest, most economical
          path.
        </Card>
        <Card title="Per-tenant database">
          Your tenant, your own database — physical data separation for
          institutions whose policy requires it, on managed infrastructure.
        </Card>
        <Card title="Managed VPC">
          A dedicated, Fingrid-managed virtual private cloud for your deployment
          — network-isolated, with your compliance controls, our operations.
        </Card>
        <Card title="On-prem / your cloud account">
          Fingrid deployed in your data centre or your own cloud account — you
          hold the keys, the platform stays current.
        </Card>
        <Card title="Source code option">
          For institutions whose governance demands it: source code licensing
          arrangements that de-risk vendor dependency. Discussed per engagement.
        </Card>
      </CardsSection>
      <Panel id="models" title="How the models price">
        <p>
          Deployment model is the second axis of your licence — the commercial
          framing of all five models is on the pricing page.
        </p>
        <Bullets alt>
          <li>See deployment models on the pricing page →</li>
        </Bullets>
      </Panel>
      <Panel title="Security & privacy posture">
        <Bullets>
          <li>
            All customer data resident in Indian regions, including AI/document
            processing paths
          </li>
          <li>
            DPDP-aligned: consent capture, purpose limitation, and data-purge
            workflows via Service Request Management
          </li>
          <li>
            Role-based access with maker-checker on sensitive operations; full
            audit logging
          </li>
          <li>
            Encryption in transit and at rest; tenant-scoped keys on dedicated
            models
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Deployment & Onboarding", "/platform/deployment-onboarding"],
          ["Integrations", "/platform/integrations"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
