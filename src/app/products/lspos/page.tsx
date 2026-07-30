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
  title: "LspOS",
  description:
    "LspOS is the operating system for loan service providers under the RBI digital lending framework — run sourcing, servicing and collections across multiple ",
  alternates: { canonical: "/products/lspos" },
};

export default function ProductsLsposPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["LspOS"]]} />
      <Hero
        pill="For loan service providers"
        eyebrow="LspOS"
        title={
          <>
            Multi-lender distribution, with the{" "}
            <Grad>guardrails built in.</Grad>
          </>
        }
        lede="LspOS is the operating system for loan service providers under the RBI digital lending framework — run sourcing, servicing and collections across multiple regulated entities with the disclosure, consent and data-handling discipline the guidelines demand."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "Long Tail Aggregation",
            href: "/network/onekey",
            variant: "ghost",
          },
        ]}
        stats={[
          ["Multi", "Regulated-entity flows"],
          ["RBI", "Digital lending aligned"],
          ["7", "Stacks composed for LSPs"],
        ]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="Everything an LSP operation runs on"
      >
        <Card
          href="/modules/sales/loan-processing"
          title="Multi-lender pipeline"
        >
          One pipeline, many regulated entities — route files by product,
          geography and lender appetite.
        </Card>
        <Card href="/modules/origination" title="Compliant journeys">
          Key-fact statements, lender disclosure and consent capture where the
          guidelines require them.
        </Card>
        <Card href="/modules/sales" title="Sourcing channels">
          Field, tele and digital sourcing with campaign attribution back to
          cost per file.
        </Card>
        <Card href="/modules/lms" title="Servicing & requests">
          Customer servicing and grievance handling with TATs you can evidence.
        </Card>
        <Card href="/modules/collections" title="Collections support">
          Collection workflows where your lender agreements permit them — logged
          and auditable.
        </Card>
        <Card href="/modules/finance" title="Your own books">
          GL, GST and TDS for the LSP entity itself — fee income, payouts,
          agency costs.
        </Card>
      </CardsSection>
      <Panel title="Compliance as architecture, not afterthought">
        <Bullets>
          <li>
            Lender-of-record visible on every customer-facing surface and
            document
          </li>
          <li>
            Data flows scoped per regulated entity — one lender's data never
            leaks into another's view
          </li>
          <li>
            Consent, disclosure and grievance registers maintained as
            first-class records
          </li>
          <li>
            Small DSAs and BCs under your umbrella? The Long Tail Aggregation
            Program extends your compliance cover to them
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Fingrid OneKey", "/network/onekey"],
          ["DsaOS", "/products/dsaos"],
          ["Fingrid Connect", "/network/connect"],
        ]}
      />
      <ClosingCta
        title="Scale distribution without scaling regulatory risk."
        body="See LspOS configured for your lender panel."
      />
    </>
  );
}
