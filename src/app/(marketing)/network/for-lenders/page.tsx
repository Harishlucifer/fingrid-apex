import type { Metadata } from "next";
import {
  Band,
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
  title: "The Network for Lenders",
  description:
    "Distribution is a lender's growth engine and its biggest operational headache — finding partners, vetting them, integrating them, monitoring them. The Fing",
  alternates: { canonical: "/network/for-lenders" },
};

export default function NetworkForLendersPage() {
  return (
    <>
      <Crumbs items={[["Network"], ["For Lenders"]]} />
      <Hero
        pill="Fingrid Network · For lenders"
        eyebrow="For lenders"
        title={
          <>
            Pre-qualified partners. <Grad>Lower onboarding risk.</Grad>
          </>
        }
        lede="Distribution is a lender's growth engine and its biggest operational headache — finding partners, vetting them, integrating them, monitoring them. The Fingrid Network turns that into a managed pipeline: publish what you're looking for, meet verified counterparties, and empanel them straight into your OS."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "How Connect works",
            href: "/network/connect",
            variant: "ghost",
          },
        ]}
      />
      <Panel title="The partnership problem">
        <p>
          Every lender knows the cycle: a partner arrives by reference,
          diligence happens over email, onboarding takes weeks of
          document-chasing, and monitoring afterward is an annual formality.
          Multiply by every DSA, LSP and BC on the panel, and channel operations
          becomes its own department.
        </p>
      </Panel>
      <CardsSection
        eyebrow="The Fingrid way"
        title="How the network works for lenders"
      >
        <Card title="Publish partnership programs">
          Define what you're looking for — product, geography, partner profile,
          commercial framework — and publish to the network on your terms.
        </Card>
        <Card title="Meet verified counterparties">
          Partners arrive with verified profiles: KYC, empanelments, geographies
          and track signals — diligence starts from evidence, not a PDF by
          email.
        </Card>
        <Card title="Full control, zero public commitment">
          Programs can be network-visible or invitation-only; you decide who
          sees what, and nothing you publish binds you to empanel anyone.
        </Card>
        <Card title="Empanel into your OS">
          Accepted partners flow into Lender OS as channel partners — same
          canonical identity, agreements and payout grids attached, no
          re-onboarding.
        </Card>
        <Card title="One integration for all">
          With OneKey, one integration receives files from every connected
          partner — no per-counterparty projects.
        </Card>
        <Card title="Monitor on live data">
          Partner performance — conversion, FTR, early delinquency — tracked on
          real pipeline data, not annual reviews.
        </Card>
      </CardsSection>
      <Band
        eyebrow="The point"
        title="Grow distribution without growing distribution overhead"
        ctas={[
          {
            label: "Publish your first program",
            href: "/pricing#demo",
            variant: "mint",
          },
          {
            label: "OneKey for lenders",
            href: "/network/onekey",
            variant: "ghost",
          },
        ]}
      >
        The network handles discovery, verification and plumbing. Your channel
        team spends its time on the judgement calls — which partners, which
        markets, which terms.
      </Band>
      <Related
        links={[
          ["Lender OS", "/products/lenderos"],
          ["DSA Channel Sales", "/modules/sales/dsa-channel-sales"],
          [
            "Partner Management & Payouts",
            "/modules/sales/partner-management-payouts",
          ],
        ]}
      />
      <ClosingCta
        title="Your next hundred partners, without the hundred headaches."
        body="See the lender side of the network — publishing, matching and empanelment — live."
      />
    </>
  );
}
