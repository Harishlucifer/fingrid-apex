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
  title: "Agentic Engineering",
  description:
    "Fingrid itself is built with the discipline we sell: a formal specification suite covering every module, AI agent pipelines that build against those specs,",
  alternates: { canonical: "/ai/agentic-engineering" },
};

export default function AiAgenticEngineeringPage() {
  return (
    <>
      <Crumbs items={[["AI", "/ai"], ["Agentic Engineering"]]} />
      <Hero
        pill="How Fingrid is built"
        eyebrow="AI · Agentic Engineering"
        title={
          <>
            Spec-driven development, <Grad>agent-accelerated.</Grad>
          </>
        }
        lede="Fingrid itself is built with the discipline we sell: a formal specification suite covering every module, AI agent pipelines that build against those specs, and provenance on every AI-assisted change. It's why a lean team ships an enterprise platform — and why what ships matches what's specified."
      />
      <CardsSection
        eyebrow="The method"
        title="How spec-driven, agent-accelerated engineering works"
      >
        <Card title="Specification-first">
          Every module begins as a layered specification — domain rules, data
          model, workflows, screens — before code exists.
        </Card>
        <Card title="Agent pipelines">
          AI agents build against the specs: parameterised generation for lender
          integrations, document types and configuration deltas.
        </Card>
        <Card title="Spec-drift detection">
          Automated loops compare the running system against its specification
          and flag divergence — the spec stays true, not decorative.
        </Card>
        <Card title="AI provenance">
          Every AI-assisted change is labelled: which agent, which spec, which
          human reviewed. Nothing merges anonymously.
        </Card>
        <Card title="Gate discipline">
          Formal review gates and code ownership on every change — AI raises
          throughput, not risk.
        </Card>
        <Card title="Compounding skills">
          Engineering knowledge is encoded as reusable skills the agents apply —
          each integration makes the next one faster.
        </Card>
      </CardsSection>
      <Panel title="Why this matters to a buyer">
        <p>
          Engineering method sounds internal until you're the one depending on
          it:
        </p>
        <Bullets>
          <li>
            Delta development at configuration speed — lender-specific changes
            build against specs, not from scratch
          </li>
          <li>
            New integrations follow proven, parameterised pipelines rather than
            heroic one-off projects
          </li>
          <li>
            Auditability extends to the code itself: what the system does is
            written down, and drift is detected, not discovered
          </li>
          <li>
            A platform this broad stays coherent because the specification, not
            tribal memory, is the source of truth
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Agentic Configuration", "/ai/agentic-configuration"],
          ["Deployment & Onboarding", "/platform/deployment-onboarding"],
          ["About Inforvio", "/company"],
        ]}
      />
      <ClosingCta
        title="Judge the method by its output."
        body="Ask us how a lender-specific delta goes from requirement to production."
      />
    </>
  );
}
