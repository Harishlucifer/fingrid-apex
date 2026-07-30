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
  title: "Fingrid Connect",
  description:
    "Borrowers stopped applying lender by lender years ago — partners shouldn't have to either. On Fingrid Connect, lenders publish partnership programs and DSA",
  alternates: { canonical: "/network/connect" },
};

export default function NetworkConnectPage() {
  return (
    <>
      <Crumbs items={[["Network"], ["Connect"]]} />
      <Hero
        pill="Apply once · Partner everywhere"
        eyebrow="Fingrid Connect"
        title={
          <>
            The partnership marketplace for{" "}
            <Grad>India’s lending ecosystem.</Grad>
          </>
        }
        lede="Borrowers stopped applying lender by lender years ago — partners shouldn't have to either. On Fingrid Connect, lenders publish partnership programs and DSAs, LSPs and BCs apply once to be matched across all of them, on one verified identity. Not to be confused with Fingrid OneKey, our API access program."
        ctas={[
          {
            label: "Join the network",
            href: "/pricing#demo",
            variant: "primary",
          },
          {
            label: "Fingrid OneKey instead?",
            href: "/network/onekey",
            variant: "ghost",
          },
        ]}
      />
      <CardsSection
        eyebrow="How it works"
        title="Programs, not cold calls"
        intro="The marketplace unit is the partnership program — published by a lender, discovered by partners, matched by fit."
      >
        <Card title="Lenders publish programs">
          Product, geography, partner requirements and commercial framework —
          published to the network with full control over visibility.
        </Card>
        <Card title="Partners apply once">
          One verified profile, one application — matched against every program
          that fits, instead of chasing lenders one by one.
        </Card>
        <Card title="Matching by fit">
          Programs meet partners on product, market and track record — both
          sides see qualified counterparties, not cold lists.
        </Card>
        <Card title="Empanelment hand-off">
          When a match becomes a partnership, the partner flows into the
          lender's OS as a channel partner — no re-onboarding.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="For each side"
        title="Matchmaking that respects how lending partnerships form"
      >
        <Card title="For DSAs & BCs">
          A verified business profile — products, geographies, volumes, lender
          empanelments — visible to lenders scouting for distribution.
        </Card>
        <Card title="For lenders">
          Search and shortlist channel partners by product, market and
          performance signals instead of cold references.
        </Card>
        <Card title="Introductions">
          Structured connection requests replace the broker-of-a-broker chain —
          both sides see who they're dealing with.
        </Card>
        <Card title="Private by default">
          Lenders control what's public; programs can be visible to the network
          or by invitation only.
        </Card>
      </CardsSection>
      <Panel title="How it works: the shared identity layer">
        <p>
          Underneath the matchmaking sits one canonical identity per company and
          per user, onboarded once and recognised across every Fingrid OS.
        </p>
        <Bullets alt>
          <li>
            One canonical record per company — a DSA on Connect, a channel
            partner in a LenderOS tenant, a billing customer in Inforvio ERP are
            relationships linked to the same record, never duplicates
          </li>
          <li>
            KYC and profile data verified once, referenced everywhere with the
            owner's consent
          </li>
          <li>
            Updates propagate — a changed GST number or address corrects itself
            across the network
          </li>
          <li>
            Every relationship is permissioned: lenders see what partners choose
            to share, and vice versa
          </li>
        </Bullets>
      </Panel>
      <Band
        eyebrow="Disambiguation"
        title="Connect is matchmaking. OneKey is API access."
        ctas={[
          { label: "Explore OneKey", href: "/network/onekey", variant: "mint" },
        ]}
      >
        Connect helps businesses find and trust each other. OneKey gives the
        long tail programmatic access to lending rails. They share the identity
        layer — and nothing else.
      </Band>
      <Related
        links={[
          ["Connect for lenders", "/network/for-lenders"],
          ["Connect for partners", "/network/for-partners"],
          ["DsaOS", "/products/dsaos"],
          ["LenderOS", "/products/lenderos"],
        ]}
      />
      <ClosingCta
        title="Get discovered. Or discover."
        body="Join Fingrid Connect as a channel partner or a lender."
      />
    </>
  );
}
