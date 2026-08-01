import type { Metadata } from "next";
import {
  Band,
  Card,
  CardsSection,
  ClosingCta,
  Grad,
  Hero,
} from "@/components/site";

export const metadata: Metadata = {
  title: {
    absolute: "The operating fabric for India's lending ecosystem — Fingrid.ai",
  },
  description:
    "An operating system for every player — lenders, BCs, LSPs, DSAs, verifiers, valuers and collection agencies — woven together on one platform, one identity ",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero
        home
        pill="Multi-tenant · AI-native · Built for Indian lending"
        eyebrow="The lending operating fabric"
        title={
          <>
            The <Grad>operating fabric</Grad> for India’s lending ecosystem.
          </>
        }
        lede="An operating system for every player — lenders, BCs, LSPs, DSAs, verifiers, valuers and collection agencies — woven together on one platform, one identity layer and one partnership marketplace. Configured to your credit policy, not the other way around."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "Explore the platform",
            href: "/platform",
            variant: "ghost",
          },
        ]}
        stats={[
          ["7", "Operating systems"],
          ["8", "Module stacks"],
          ["40+", "Lending modules"],
          ["RBI", "Compliance-first"],
        ]}
      />
      <CardsSection
        eyebrow="Products"
        title="An OS for every seat at the lending table"
        intro="The same platform, composed differently for each participant in India's lending ecosystem — with one shared identity layer underneath."
      >
        <Card href="/products/lenderos" title="Lender OS" tag="FOR LENDERS">
          The complete stack for NBFCs and banks — origination, LMS,
          collections, GL accounting, HR and regulatory analytics in one system.
        </Card>
        <Card href="/products/bcos" title="Bc OS" tag="FOR BCs">
          Business correspondent operations end to end: sourcing, servicing, BC
          receivables and co-lending settlement with partner banks.
        </Card>
        <Card href="/products/lspos" title="Lsp OS" tag="FOR LSPs">
          Run a compliant loan service provider operation — multi-lender
          distribution with the RBI digital-lending guardrails built in.
        </Card>
        <Card href="/products/dsaos" title="Dsa OS" tag="FOR DSAs">
          A real operating system for DSA businesses — leads, files, lender
          submissions, payouts and team management in one login.
        </Card>
        <Card href="/products/verifyos" title="Verify OS" tag="FOR VERIFIERS">
          Verification operations for FI-PD and document-check agencies — work
          orders, geo evidence, TATs and billing.
        </Card>
        <Card
          href="/products/valuationos"
          title="Valuation OS"
          tag="FOR VALUERS"
        >
          Property and vehicle valuation operations — inspections, asset
          templates and lender-ready reports.
        </Card>
        <Card href="/products/collectos" title="Collect OS" tag="FOR AGENCIES">
          Collection agency operations — allocation, tele and field workflows,
          DCRs and per-principal billing.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="Agentic AI"
        title="AI with receipts, at three layers"
        intro="Agents inside the lending workflow, agents that configure the platform, and agents that build it — all auditable by design."
      >
        <Card href="/ai/agentic-lending" title="Agentic Lending">
          AI document extraction live in production; lead chat, call
          transcription and field voice agents in development.
        </Card>
        <Card href="/ai/agentic-configuration" title="Agentic Configuration">
          Describe your credit policy in natural language; an agent configures
          the tenant over MCP — maker-checker intact.
        </Card>
        <Card href="/ai/agentic-engineering" title="Agentic Engineering">
          How Fingrid is built: spec-driven development with agent pipelines and
          provenance on every change.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="Module stacks"
        title="Eight stacks. One lifecycle."
        intro="Every stack is deep enough to replace a point product, and connected enough that data entered once flows all the way to the GL."
      >
        <Card href="/modules/marketing" title="Marketing">
          Campaigns, lead capture and attribution feeding straight into your
          sales pipeline.
        </Card>
        <Card href="/modules/sales" title="Sales & Channels">
          Field, tele, branch, DSA and BC channels with targets, incentives and
          partner payouts.
        </Card>
        <Card href="/modules/origination" title="Loan Origination">
          File login to disbursement — CAM, verification, FI-PD, underwriting
          and rule engine.
        </Card>
        <Card href="/modules/lms" title="Loan Management">
          Accounts, repayments, collateral, NPA &amp; DPD, FLDG and co-lending
          operations.
        </Card>
        <Card href="/modules/collections" title="Collections & Recovery">
          Digital, tele and field collections through to legal action and
          recovery.
        </Card>
        <Card href="/modules/finance" title="Finance & Accounting">
          Dimensional GL, GST, TDS and the NBFC compliance suite.
        </Card>
        <Card href="/modules/hrms" title="HR & Payroll">
          Employees, leave and statutory payroll for lending teams.
        </Card>
        <Card href="/modules/analytics" title="Analytics & Reports">
          MD dashboards to bureau reporting — the numbers your board and RBI
          both ask for.
        </Card>
      </CardsSection>
      <Band
        eyebrow="The Partnership Marketplace"
        title="Apply once. Partner everywhere."
        ctas={[
          {
            label: "For lenders",
            href: "/network/for-lenders",
            variant: "mint",
          },
          {
            label: "For partners",
            href: "/network/for-partners",
            variant: "ghost",
          },
          {
            label: "How Connect works",
            href: "/network/connect",
            variant: "ghost",
          },
        ]}
        mini={[
          ["1", "Application, many lenders"],
          ["1", "Canonical identity per company"],
          ["0", "Duplicate onboarding"],
        ]}
      >
        On Fingrid Connect, lenders publish partnership programs — product,
        geography, requirements — and DSAs, LSPs and BCs apply once to be
        matched across all of them, on one shared identity. Fingrid OneKey opens
        the same rails through APIs: integrate once, transact with every
        connected counterparty.
      </Band>
      <CardsSection
        eyebrow="Solutions"
        title="Configured for how India actually lends"
        intro="Product playbooks that bundle the right modules, workflows and integrations for each asset class."
      >
        <Card href="/solutions/two-wheeler" title="Two-Wheeler Finance">
          Dealer-led origination, multi-lender flows and same-day disbursement.
        </Card>
        <Card href="/solutions/home-loan" title="Home Loan">
          Stage disbursement, APF, legal-technical verification and long-tenor
          servicing.
        </Card>
        <Card href="/solutions/used-car" title="Used Car Finance">
          Valuation-led underwriting with dealer and refinance journeys.
        </Card>
        <Card href="/solutions/msme" title="MSME Lending">
          Banking, bureau and GST-based assessment for India's small businesses.
        </Card>
        <Card href="/solutions/co-lending" title="Co-lending">
          CLM-2 operations: 80/20 splits, dual GLs and partner settlement,
          automated.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="Platform"
        title="Enterprise plumbing, product-team speed"
        intro="The layer underneath every OS — configuration, deployment, security and integrations."
      >
        <Card
          href="/platform/configuration-studio"
          title="Configuration Studio"
        >
          Workflow, rule, task and parameter engines — change credit policy
          without a release.
        </Card>
        <Card
          href="/platform/deployment-onboarding"
          title="Deployment & Onboarding"
        >
          Branded, isolated tenant go-lives measured in weeks, not quarters.
        </Card>
        <Card
          href="/platform/architecture-security"
          title="Architecture & Security"
        >
          Multi-tenancy, Indian data residency and DPDP-ready controls.
        </Card>
        <Card href="/platform/integrations" title="Integrations">
          Bureaus, KYC, eNACH, payments and lender APIs — pre-wired.
        </Card>
      </CardsSection>
      <ClosingCta
        title="See Fingrid on your own lending book."
        body="A working demo configured to your products, hierarchy and credit policy — not a slide deck."
      />
    </>
  );
}
