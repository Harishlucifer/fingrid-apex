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
  title: "Sales & Channels",
  description:
    "Field teams, telecallers, branches, DSAs and BCs — Indian lending is sourced through many hands. The Sales stack runs them all on one pipeline, with target",
  alternates: { canonical: "/modules/sales" },
};

export default function ModulesSalesPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Sales & Channels"]]} />
      <Hero
        eyebrow="Module stack · Sales & Channels"
        title={
          <>
            Every channel that sources a loan, <Grad>on one system.</Grad>
          </>
        }
        lede="Field teams, telecallers, branches, DSAs and BCs — Indian lending is sourced through many hands. The Sales stack runs them all on one pipeline, with targets, performance and payouts computed from the same data."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card href="/modules/sales/field-sales" title="Field Sales">
          Beat plans, geo-tracked visits and field pipelines for feet-on-street
          teams.
        </Card>
        <Card href="/modules/sales/tele-sales" title="Tele Sales">
          Calling queues, dispositions and click-to-call for inside sales.
        </Card>
        <Card href="/modules/sales/dsa-channel-sales" title="DSA Channel Sales">
          Empanelment to payout for your DSA network.
        </Card>
        <Card href="/modules/sales/bc-channel-sales" title="BC Channel Sales">
          Business correspondent sourcing with corridor-wise operations.
        </Card>
        <Card href="/modules/sales/loan-processing" title="Loan Processing">
          The sales pipeline itself — file movement from lead to sanction.
        </Card>
        <Card
          href="/modules/sales/targets-performance-incentives"
          title="Targets, Performance & Incentives"
        >
          Territory targets, scorecards and incentive automation in one loop.
        </Card>
        <Card
          href="/modules/sales/partner-management-payouts"
          title="Partner Management & Payouts"
        >
          Partner lifecycle and disbursement-linked payout computation.
        </Card>
      </CardsSection>
      <Panel id="branch" title="Branch Sales" note="Also in this stack">
        <p>
          Walk-ins and branch-originated files run on the same pipeline as every
          other channel — captured at the branch, attributed to the branch, and
          counted in branch P&amp;L. No separate module needed; the branch is a
          channel like any other, with its own targets and dashboards.
        </p>
      </Panel>
      <Panel id="apf" title="APF Sales" note="Also in this stack">
        <p>
          For housing lenders, Approved Project Files turn a project, not a
          customer, into the sales unit. Fingrid tracks APF projects, builder
          relationships and per-project pipelines so files from an approved
          project move on pre-cleared legal rails.
        </p>
      </Panel>
      <Panel id="ai" title="AI Sales Assistants" note="Roadmap">
        <p>
          In development: a Lead AI Chat assistant that qualifies and books
          inbound leads conversationally, and a Field Voice Agent that lets
          field executives log visits and update files by voice, in the language
          they work in.
        </p>
      </Panel>
      <Related
        links={[
          ["Marketing", "/modules/marketing"],
          ["Loan Origination", "/modules/origination"],
          ["Dsa OS", "/products/dsaos"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
