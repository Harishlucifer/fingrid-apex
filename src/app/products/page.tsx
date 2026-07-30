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
  title: "Products",
  description:
    "Each Fingrid OS composes the same module stacks for a different participant in the lending ecosystem — lenders, BCs, LSPs, DSAs, and the verification, valu",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Crumbs items={[["Products"]]} />
      <Hero
        eyebrow="Products"
        title={
          <>
            Seven operating systems.
            <br />
            One <Grad>lending network.</Grad>
          </>
        }
        lede="Each Fingrid OS composes the same module stacks for a different participant in the lending ecosystem — lenders, BCs, LSPs, DSAs, and the verification, valuation and collection businesses that serve them — on one shared platform and identity layer."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          { label: "Compare on pricing", href: "/pricing", variant: "ghost" },
        ]}
      />
      <CardsSection
        eyebrow="Operating systems"
        title="Pick your seat at the table"
      >
        <Card href="/products/lenderos" title="LenderOS" tag="FOR LENDERS">
          Full-stack lending for NBFCs and banks — all eight module stacks, from
          campaign to GL to regulatory reporting.
        </Card>
        <Card href="/products/bcos" title="BcOS" tag="FOR BCs">
          Business correspondent operations — sourcing, servicing and settlement
          with partner banks, minus lender-only treasury overhead.
        </Card>
        <Card href="/products/lspos" title="LspOS" tag="FOR LSPs">
          Compliant multi-lender distribution for loan service providers under
          the RBI digital lending guidelines.
        </Card>
        <Card href="/products/dsaos" title="DsaOS" tag="FOR DSAs">
          The operating system for DSA businesses — pipeline, submissions,
          payouts and team, in one login.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="Specialised OS"
        title="For the businesses that serve lenders"
        intro="Verification, valuation and collection agencies run real operations too — and when they run on Fingrid, work orders and results flow system-to-system with the lenders they serve."
      >
        <Card href="/products/verifyos" title="VerifyOS" tag="FOR VERIFIERS">
          FI-PD and document verification operations — work orders, field force,
          geo evidence and per-lender billing.
        </Card>
        <Card
          href="/products/valuationos"
          title="ValuationOS"
          tag="FOR VALUERS"
        >
          Property and vehicle valuation — inspections, asset-type templates and
          lender-format reports.
        </Card>
        <Card href="/products/collectos" title="CollectOS" tag="FOR AGENCIES">
          Collection agency operations — allocation, PTPs, DCRs, deposit
          reconciliation and principal-wise billing.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="Portals & apps"
        title="The surfaces your channels and customers touch"
        intro="Purpose-built front doors that plug into whichever OS runs behind them."
      >
        <Card href="/products/portals/dsa-portal" title="DSA Portal">
          Self-serve file submission, status tracking and payout visibility for
          your DSA network.
        </Card>
        <Card href="/products/portals/customer-portal" title="Customer Portal">
          Statements, repayment, service requests and documents — self-service
          that reduces branch load.
        </Card>
        <Card href="/products/portals/customer-app" title="Customer Mobile App">
          The loan in your customer's pocket: EMIs, receipts, requests and
          offers.
        </Card>
        <Card title="Vendor Portal" tag="PLANNED">
          Verification and valuation agency work orders, TATs and invoicing.
          Coming to the portal family.
        </Card>
      </CardsSection>
      <Band
        eyebrow="Under the hood"
        title="One platform. One identity. Zero duplicates."
        ctas={[
          {
            label: "How the network works",
            href: "/network/connect",
            variant: "mint",
          },
        ]}
      >
        Every company and user exists once on the Fingrid network. A DSA
        onboarded on DsaOS appears in a lender's LenderOS tenant as a channel
        partner — the same canonical record, never a copy.
      </Band>
      <ClosingCta />
    </>
  );
}
