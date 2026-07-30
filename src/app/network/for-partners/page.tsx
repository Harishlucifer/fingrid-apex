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
  title: "The Network for Partners",
  description:
    "Borrowers stopped applying lender by lender years ago — why are partners still doing it? One verified profile on Fingrid Connect puts your business in fron",
  alternates: { canonical: "/network/for-partners" },
};

export default function NetworkForPartnersPage() {
  return (
    <>
      <Crumbs items={[["Network"], ["For Partners"]]} />
      <Hero
        pill="Fingrid Network · DSA · LSP · BC"
        eyebrow="For partners"
        title={
          <>
            Apply once. <Grad>Partner everywhere.</Grad>
          </>
        }
        lede="Borrowers stopped applying lender by lender years ago — why are partners still doing it? One verified profile on Fingrid Connect puts your business in front of every lender program that fits, and one OneKey integration lets you transact with all of them."
        ctas={[
          {
            label: "Join the network",
            href: "/pricing#demo",
            variant: "primary",
          },
          {
            label: "DsaOS for your business",
            href: "/products/dsaos",
            variant: "ghost",
          },
        ]}
      />
      <Panel title="Tired of the old way?">
        <p>
          Empanelment by acquaintance. The same KYC documents couriered to every
          lender. A different portal, format and process for each one. Months of
          relationship-building before the first file moves — and no way to know
          which lenders are even looking for partners like you.
        </p>
      </Panel>
      <CardsSection
        eyebrow="The Fingrid way"
        title="How the network works for partners"
      >
        <Card title="One verified profile">
          Build your business profile once — products, geographies, volumes,
          empanelments — verified on the network's identity layer.
        </Card>
        <Card title="Discover programs that fit">
          Lender partnership programs matched to your profile — see who's
          actually looking for what you do, where you do it.
        </Card>
        <Card title="Apply once">
          One application reaches every matching program — no more
          courier-and-pray across ten lenders.
        </Card>
        <Card title="Structured introductions">
          Connection requests both sides can trust — verified identities replace
          the broker-of-a-broker chain.
        </Card>
        <Card title="Empanelment without re-onboarding">
          When a lender says yes, your profile flows into their system as-is —
          the paperwork marathon disappears.
        </Card>
        <Card title="One integration for all">
          With OneKey, integrate once and submit files to every connected lender
          — or skip the build and use hosted journeys.
        </Card>
      </CardsSection>
      <CardsSection
        eyebrow="Two ways in"
        title="Choose how you plug into the network"
      >
        <Card href="/network/connect" title="Through Connect">
          Join the marketplace: get discovered, apply to programs, build your
          lender panel — no engineering required.
        </Card>
        <Card href="/network/onekey" title="Through OneKey">
          For platforms and tech-forward partners: API access to the rails —
          submit, track and receive decisions programmatically.
        </Card>
      </CardsSection>
      <Band
        eyebrow="Run the business too"
        title="The network is better with an OS behind it"
        ctas={[
          { label: "DsaOS", href: "/products/dsaos", variant: "mint" },
          { label: "LspOS", href: "/products/lspos", variant: "ghost" },
          { label: "BcOS", href: "/products/bcos", variant: "ghost" },
        ]}
      >
        Partners on DsaOS, LspOS or BcOS get the network natively — files,
        statuses and payouts flowing between your system and your lenders'
        without re-keying.
      </Band>
      <Related
        links={[
          ["Fingrid Connect", "/network/connect"],
          ["Fingrid OneKey", "/network/onekey"],
          ["Long Tail Aggregation", "/network/onekey#ltap"],
        ]}
      />
      <ClosingCta
        title="Stop guessing which lenders want you."
        body="Join the network with one verified profile — and let the programs find you."
      />
    </>
  );
}
