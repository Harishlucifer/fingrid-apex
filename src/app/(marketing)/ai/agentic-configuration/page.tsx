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
  title: "Agentic Configuration",
  description:
    "Fingrid exposes its Configuration Studio to AI agents over MCP — the Model Context Protocol. Implementation consultants and client teams describe products,",
  alternates: { canonical: "/ai/agentic-configuration" },
};

export default function AiAgenticConfigurationPage() {
  return (
    <>
      <Crumbs items={[["AI", "/ai"], ["Agentic Configuration"]]} />
      <Hero
        pill="MCP-based"
        eyebrow="AI · Agentic Configuration"
        title={
          <>
            Describe the policy. The agent <Grad>configures the tenant.</Grad>
          </>
        }
        lede="Fingrid exposes its Configuration Studio to AI agents over MCP — the Model Context Protocol. Implementation consultants and client teams describe products, workflows and rules in natural language; the agent translates them into governed configuration, with every change passing the same maker-checker gates a human change would."
      />
      <CardsSection
        eyebrow="How it works"
        title="Natural language in, governed configuration out"
      >
        <Card title="Fingrid MCP server">
          A first-class MCP interface to the platform's configuration engines —
          workflow, rule, task and parameter.
        </Card>
        <Card title="Policy-to-configuration">
          Hand the agent a credit policy document; get back proposed rules,
          grids and deviation matrices to review.
        </Card>
        <Card title="Workflow authoring">
          Describe a journey — 'two-wheeler with dealer sourcing and co-lending
          split' — and the agent drafts the stage flow.
        </Card>
        <Card title="Conversational changes">
          'Raise the FOIR cap for salaried above ₹1L to 60%' becomes a parameter
          change request, effective-dated.
        </Card>
        <Card title="Implementation copilot">
          Consultants configure tenants in a fraction of the clicks — the agent
          handles the mechanics, they handle the judgement.
        </Card>
        <Card title="Any MCP client">
          Works with Claude and other MCP-capable agents your team already uses.
        </Card>
      </CardsSection>
      <Panel title="Governance is non-negotiable">
        <p>Agentic configuration changes are still configuration changes:</p>
        <Bullets>
          <li>
            Every agent-proposed change enters as a draft — maker-checker
            approval before anything goes live
          </li>
          <li>
            Effective dating, versioning and rollback apply identically to agent
            and human changes
          </li>
          <li>
            The audit trail records that an agent proposed it, from what
            instruction, and who approved it
          </li>
          <li>
            Agents operate within role-scoped permissions — an agent can't touch
            what its operator couldn't
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Configuration Studio", "/platform/configuration-studio"],
          ["Deployment & Onboarding", "/platform/deployment-onboarding"],
          ["Agentic Engineering", "/ai/agentic-engineering"],
        ]}
      />
      <ClosingCta
        title="Watch a policy document become a tenant."
        body="Bring a real credit policy to the demo. We'll configure live."
      />
    </>
  );
}
