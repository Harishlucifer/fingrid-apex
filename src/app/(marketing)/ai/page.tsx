import type { Metadata } from "next";
import {
  Band,
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
} from "@/components/site";

export const metadata: Metadata = {
  title: "AI at Fingrid",
  description:
    "Fingrid is AI-first in three distinct ways: agents inside the lending workflow, agents that configure the platform, and agents that build it. In all three,",
  alternates: { canonical: "/ai" },
};

export default function AiPage() {
  return (
    <>
      <Crumbs items={[["AI"]]} />
      <Hero
        pill="AI with receipts"
        eyebrow="AI at Fingrid"
        title={
          <>
            Agentic AI, everywhere it can be <Grad>audited.</Grad>
          </>
        }
        lede="Fingrid is AI-first in three distinct ways: agents inside the lending workflow, agents that configure the platform, and agents that build it. In all three, the same rule holds — AI accelerates the work, humans own the decision, and every action leaves a trail."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
        ]}
      />
      <CardsSection eyebrow="Three layers" title="Where the agents work">
        <Card href="/ai/agentic-lending" title="Agentic Lending">
          Document extraction, lead chat, call transcription and field voice
          agents inside the lending lifecycle itself.
        </Card>
        <Card href="/ai/agentic-configuration" title="Agentic Configuration">
          Configure tenants through AI agents over MCP — natural language in,
          governed configuration out.
        </Card>
        <Card href="/ai/agentic-engineering" title="Agentic Engineering">
          How Fingrid itself is built: spec-driven development with AI agent
          pipelines and full provenance.
        </Card>
      </CardsSection>
      <Band
        eyebrow="The principle"
        title="AI with receipts"
        ctas={[
          {
            label: "Architecture & Security",
            href: "/platform/architecture-security",
            variant: "mint",
          },
        ]}
      >
        In a regulated industry, an AI you can't audit is a liability. Every
        extraction traces to its source document, every agent action to its
        instruction, every generated line of code to its spec. That's the
        standard, and it doesn't bend for convenience.
      </Band>
      <ClosingCta
        title="See the agents at work."
        body="A demo on real documents and real workflows — yours."
      />
    </>
  );
}
