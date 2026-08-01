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
  title: "Fingrid OneKey",
  description:
    "Fingrid OneKey is our API access program — programmatic entry to the lending rails for partners and lenders alike. Partners integrate once and reach every ",
  alternates: { canonical: "/network/onekey" },
};

export default function NetworkOnekeyPage() {
  return (
    <>
      <Crumbs items={[["Network"], ["OneKey"]]} />
      <Hero
        pill="API access · Long-tail program"
        eyebrow="Fingrid OneKey"
        title={
          <>
            Integrate once. Transact with{" "}
            <Grad>every connected counterparty.</Grad>
          </>
        }
        lede="Fingrid OneKey is our API access program — programmatic entry to the lending rails for partners and lenders alike. Partners integrate once and reach every connected lender; lenders integrate once and receive from every connected partner. This is not Fingrid Connect: Connect is matchmaking between businesses; OneKey is API access to rails."
        ctas={[
          {
            label: "Request API access",
            href: "/pricing#demo",
            variant: "primary",
          },
          {
            label: "Looking for Connect?",
            href: "/network/connect",
            variant: "ghost",
          },
        ]}
      />
      <CardsSection
        eyebrow="Two sides, one key"
        title="OneKey for partners. OneKey for lenders."
      >
        <Card title="OneKey for partners">
          One integration to submit files and receive decisions across every
          connected lender — instead of building and maintaining a separate
          integration per lender portal.
        </Card>
        <Card title="OneKey for lenders">
          One integration to receive files from every connected partner —
          sourcing volume without an integration project per counterparty.
        </Card>
        <Card title="One format">
          Files, statuses and decisions move in one canonical format — mapped
          once to each side's systems, reused forever.
        </Card>
        <Card title="One identity">
          OneKey rides the shared identity layer — your entity onboards once,
          transacts everywhere, with every counterparty knowing exactly who
          they're dealing with.
        </Card>
      </CardsSection>
      <CardsSection eyebrow="The program" title="How access works">
        <Card title="Lending APIs">
          Submit files, track status and receive decisions programmatically
          against connected counterparties.
        </Card>
        <Card title="Sandbox-first">
          Build and certify against a sandbox before a single live file moves.
        </Card>
        <Card title="Flexible integration paths">
          Full API for engineering teams; lighter paths — hosted journeys and
          file-based exchange — where a full build isn't warranted.
        </Card>
        <Card title="Usage-based">
          Priced for the long tail — pay for calls, not seats.
        </Card>
      </CardsSection>
      <Panel id="ltap" title="Long Tail Aggregation Program" note="Program">
        <p>
          Small DSAs and BCs often can't carry LSP compliance obligations alone.
          The Long Tail Aggregation Program places them under a compliant
          aggregation umbrella — disclosure, consent and grievance handling
          operated centrally, so the smallest channel partner can still work
          with regulated lenders correctly.
        </p>
        <Bullets>
          <li>
            Aggregator-of-record handles LSP obligations; sub-partners operate
            under its cover
          </li>
          <li>
            Every sub-partner still gets a canonical network identity — no
            anonymous intermediaries
          </li>
          <li>
            Lenders see the full chain: who sourced, under whose umbrella, with
            what disclosures
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Fingrid Connect", "/network/connect"],
          ["Lsp OS", "/products/lspos"],
          ["Integrations", "/platform/integrations"],
        ]}
      />
      <ClosingCta
        title="Build on the rails."
        body="Tell us what you're building; we'll get you sandbox keys."
      />
    </>
  );
}
