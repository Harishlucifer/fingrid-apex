import type { Metadata } from "next";
import {
  Band,
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
  title: "Lender OS",
  description:
    "Every stack a lender needs — marketing to collections to the general ledger to the RBI return — in one multi-entity, multi-branch, multi-product system. Re",
  alternates: { canonical: "/products/lenderos" },
};

export default function ProductsLenderosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["Lender OS"]]} />
      <Hero
        pill="For NBFCs · Banks · HFCs"
        eyebrow="Lender OS"
        title={
          <>
            The complete operating system for <Grad>regulated lenders.</Grad>
          </>
        }
        lede="Every stack a lender needs — marketing to collections to the general ledger to the RBI return — in one multi-entity, multi-branch, multi-product system. Replace the patchwork of LOS, LMS, collection tool, Tally and Excel with one platform that reconciles by construction."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "See the module stacks",
            href: "/modules/origination",
            variant: "ghost",
          },
        ]}
        stats={[
          ["8/8", "Module stacks included"],
          ["Multi", "Entity · branch · product"],
          ["GL", "Dimensional accounting"],
          ["RBI", "IRAC · NPA · reporting"],
        ]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="All eight stacks, wired together"
        intro="Data flows in one direction: entered once at origination, carried through servicing and collections, posted to the GL, reported to the regulator."
      >
        <Card href="/modules/origination" title="Origination">
          File login, CAM, verification, FI-PD, underwriting and
          rule-engine-driven decisioning through to disbursement.
        </Card>
        <Card href="/modules/lms" title="Loan Management">
          Repayment schedules, appropriation, collateral, NPA &amp; DPD
          automation, FLDG and co-lending settlement.
        </Card>
        <Card href="/modules/collections" title="Collections & Recovery">
          Digital, tele and field collection channels escalating into legal and
          recovery workflows.
        </Card>
        <Card href="/modules/finance" title="Finance & Accounting">
          Dimensional GL with branch, product and channel P&amp;L; GST, TDS and
          the NBFC compliance suite.
        </Card>
        <Card href="/modules/sales" title="Sales & Channels">
          Field, tele, branch, DSA and BC channels with territory targets and
          incentive automation.
        </Card>
        <Card href="/modules/marketing" title="Marketing">
          Campaigns and lead attribution connected to the same pipeline your
          branches work.
        </Card>
        <Card href="/modules/hrms" title="HR & Payroll">
          Team master, leave and statutory payroll for field-heavy lending
          organisations.
        </Card>
        <Card href="/modules/analytics" title="Analytics & Reports">
          MD and branch dashboards, sales MIS, NPA analytics and bureau
          reporting.
        </Card>
      </CardsSection>
      <Panel title="Built for how NBFCs are actually examined">
        <p>
          Lender OS treats compliance as an output of clean operations, not a
          quarterly scramble.
        </p>
        <Bullets>
          <li>
            IRAC-aligned asset classification with automated DPD buckets, NPA
            marking and provisioning entries
          </li>
          <li>
            Income recognition control on NPA accounts — interest suspended,
            tracked and reversed per RBI norms
          </li>
          <li>
            Penal charges handled as charges, not capitalised interest, per the
            RBI 2024 circular
          </li>
          <li>
            Loan subledger reconciles to the GL by design — every servicing
            event posts double-entry
          </li>
          <li>
            Regulatory reporting suite on the roadmap: DNBS returns, ALM
            statements and ECL computation from the same books
          </li>
        </Bullets>
      </Panel>
      <Band
        eyebrow="Multi-everything"
        title="One tenant, your whole institution"
        ctas={[
          {
            label: "Architecture & security",
            href: "/platform/architecture-security",
            variant: "mint",
          },
          {
            label: "Configuration Studio",
            href: "/platform/configuration-studio",
            variant: "ghost",
          },
        ]}
      >
        Entities, branches, products, channels and roles modelled the way your
        org chart and RBI registration actually look — with maker-checker
        controls where they matter.
      </Band>
      <Related
        links={[
          ["Co-lending solution", "/solutions/co-lending"],
          ["Two-Wheeler finance", "/solutions/two-wheeler"],
          ["NBFC Compliance Suite", "/modules/finance/nbfc-compliance-suite"],
          ["Pricing", "/pricing"],
        ]}
      />
      <ClosingCta
        title="Run your book on one system of record."
        body="We'll configure a working Lender OS demo on your products and hierarchy."
      />
    </>
  );
}
