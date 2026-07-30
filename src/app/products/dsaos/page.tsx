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
  title: "DsaOS",
  description:
    "Most DSAs run on WhatsApp, Excel and memory. DsaOS gives you what the lenders have — pipeline, files, submissions, payouts, team and accounts — in one logi",
  alternates: { canonical: "/products/dsaos" },
};

export default function ProductsDsaosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["DsaOS"]]} />
      <Hero
        pill="For DSA businesses"
        eyebrow="DsaOS"
        title={
          <>
            Your DSA business, finally on an <Grad>operating system.</Grad>
          </>
        }
        lede="Most DSAs run on WhatsApp, Excel and memory. DsaOS gives you what the lenders have — pipeline, files, submissions, payouts, team and accounts — in one login built for how DSA businesses actually work."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "Join Fingrid Connect",
            href: "/network/connect",
            variant: "ghost",
          },
        ]}
        stats={[
          ["5", "Stacks composed for DSAs"],
          ["Multi", "Lender submissions"],
          ["1", "Login for everything"],
        ]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="From lead to payout, without the spreadsheet"
      >
        <Card href="/modules/sales/loan-processing" title="Sales pipeline">
          Leads, follow-ups and file status across every lender you work with —
          one board, no chaos.
        </Card>
        <Card href="/modules/marketing" title="Marketing">
          Campaigns and referral tracking so you know which channel actually
          pays.
        </Card>
        <Card
          href="/modules/sales/targets-performance-incentives"
          title="Team management"
        >
          Telecallers, field executives and sub-DSAs with targets, geographies
          and incentive plans.
        </Card>
        <Card href="/modules/finance" title="Finance">
          Payout tracking, invoicing with GST, TDS on payouts received — your
          books, clean.
        </Card>
        <Card href="/modules/hrms" title="HR & payroll">
          Salaries and incentives for your team, computed from the same pipeline
          data.
        </Card>
        <Card href="/modules/analytics" title="Reports">
          Conversion, lender-wise performance and earnings — the numbers that
          run the business.
        </Card>
      </CardsSection>
      <Panel title="On the DsaOS roadmap" note="Roadmap">
        <p>Capabilities being built specifically for the DSA workflow:</p>
        <Bullets>
          <li>
            Wallet &amp; credit points — prepaid and postpaid usage billing with
            a transparent credit ledger
          </li>
          <li>
            CIBIL in-journey — pull the bureau report inside the file journey,
            with customer consent, before submission
          </li>
          <li>
            Lender Apply RPA — submit to lender portals automatically instead of
            re-keying every application
          </li>
          <li>
            Single login — one identity across DsaOS, lender portals you're
            connected to, and Fingrid Connect
          </li>
        </Bullets>
      </Panel>
      <Band
        eyebrow="Network effect"
        title="DsaOS is your door into the Fingrid network"
        ctas={[
          {
            label: "Fingrid Connect",
            href: "/network/connect",
            variant: "mint",
          },
        ]}
      >
        Onboard once, get discovered by lenders on Fingrid Connect, and appear
        in their LenderOS as a channel partner — same identity, no duplicate
        KYC.
      </Band>
      <Related
        links={[
          ["DSA Portal", "/products/portals/dsa-portal"],
          ["DSA Channel Sales", "/modules/sales/dsa-channel-sales"],
          ["Pricing", "/pricing"],
        ]}
      />
      <ClosingCta
        title="Run your DSA business like a company, not a contact list."
        body="Get set up on DsaOS in days."
      />
    </>
  );
}
