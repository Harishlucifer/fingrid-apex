import type { Metadata } from "next";
import {
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
} from "@/components/site";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Configuration, deployment, security and integrations — the shared foundation that makes each Fingrid OS configurable to your policy and deployable to your ",
  alternates: { canonical: "/platform" },
};

export default function PlatformPage() {
  return (
    <>
      <Crumbs items={[["Platform"]]} />
      <Hero
        eyebrow="Platform"
        title={
          <>
            The layer underneath <Grad>every OS.</Grad>
          </>
        }
        lede="Configuration, deployment, security and integrations — the shared foundation that makes each Fingrid OS configurable to your policy and deployable to your compliance posture."
      />
      <CardsSection eyebrow="Foundation" title="Four pillars">
        <Card
          href="/platform/configuration-studio"
          title="Configuration Studio"
        >
          Workflow, rule, task and parameter engines — change credit policy
          without a code release.
        </Card>
        <Card
          href="/platform/deployment-onboarding"
          title="Deployment & Onboarding"
        >
          Branded tenant setup, configuration and isolated go-lives, in weeks.
        </Card>
        <Card
          href="/platform/architecture-security"
          title="Architecture & Security"
        >
          Multi-tenancy models, Indian data residency and DPDP-ready controls.
        </Card>
        <Card href="/platform/integrations" title="Integrations">
          Bureaus, KYC, eNACH, payments and lender APIs, pre-wired.
        </Card>
      </CardsSection>
      <ClosingCta />
    </>
  );
}
