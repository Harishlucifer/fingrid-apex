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
  title: "Deployment & Onboarding",
  description:
    "A structured path from signature to production: branding, configuration, data migration and an isolated go-live — run by an implementation playbook, not im",
  alternates: { canonical: "/platform/deployment-onboarding" },
};

export default function PlatformDeploymentOnboardingPage() {
  return (
    <>
      <Crumbs
        items={[["Platform", "/platform"], ["Deployment & Onboarding"]]}
      />
      <Hero
        eyebrow="Deployment & Onboarding"
        title={
          <>
            Go-lives measured in <Grad>weeks, not quarters.</Grad>
          </>
        }
        lede="A structured path from signature to production: branding, configuration, data migration and an isolated go-live — run by an implementation playbook, not improvisation."
      />
      <CardsSection
        eyebrow="The path"
        title="From kickoff to first disbursement"
      >
        <Card title="Branding">
          Your logo, colours and domain across every OS surface, portal and
          document.
        </Card>
        <Card title="Configuration">
          Products, hierarchy, workflows and rules set up in Configuration
          Studio against your policy documents.
        </Card>
        <Card title="Data onboarding">
          Masters, live book and history migrated with reconciliation reports
          you sign off on.
        </Card>
        <Card title="Isolated go-live">
          Your tenant goes live in isolation — UAT, parallel run, cutover —
          without other tenants in the blast radius.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Configuration Studio", "/platform/configuration-studio"],
          ["Architecture & Security", "/platform/architecture-security"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
