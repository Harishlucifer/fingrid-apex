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
  title: "Bc OS",
  description:
    "Bc OS mirrors the full Lender OS operating stack for business correspondents — sourcing, servicing, collections and accounting — minus the lender-only treasu",
  alternates: { canonical: "/products/bcos" },
};

export default function ProductsBcosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["Bc OS"]]} />
      <Hero
        pill="For business correspondents"
        eyebrow="Bc OS"
        title={
          <>
            Run BC operations like a <Grad>first-class lender.</Grad>
          </>
        }
        lede="Bc OS mirrors the full Lender OS operating stack for business correspondents — sourcing, servicing, collections and accounting — minus the lender-only treasury layers you don't carry. Your partner banks see clean files; you see your whole business."
        ctas={[
          {
            label: "Book a demo",
            href: "/pricing#demo",
            variant: "primary",
            arrow: true,
          },
          {
            label: "BC & co-lending operations",
            href: "/modules/lms/bc-co-lending-operations",
            variant: "ghost",
          },
        ]}
        stats={[
          ["7", "Stacks composed for BCs"],
          ["Multi", "Partner-bank ready"],
          ["BC", "Receivables built in"],
        ]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="The lender stack, composed for the BC model"
      >
        <Card href="/modules/sales" title="Sourcing & sales">
          Field and tele sales, branch sourcing and target management for BC
          field armies.
        </Card>
        <Card href="/modules/origination" title="Origination">
          File login through verification and credit — files reach your partner
          bank complete and compliant.
        </Card>
        <Card href="/modules/lms" title="Servicing">
          Repayment schedules synced with the principal lender, service requests
          and customer 360.
        </Card>
        <Card
          href="/modules/lms/bc-co-lending-operations"
          title="BC receivables"
        >
          Track service-fee receivables, commission structures and settlement
          with each partner bank.
        </Card>
        <Card href="/modules/collections" title="Collections">
          Digital, tele and field collection with DCRs and deposit
          reconciliation your bank can audit.
        </Card>
        <Card href="/modules/finance" title="Finance & HR">
          Your own books — GL, GST, TDS — plus payroll for a distributed field
          team.
        </Card>
      </CardsSection>
      <Panel title="Why BCs outgrow spreadsheets and bank portals">
        <p>
          A BC business runs on two ledgers: the bank's and yours. Bc OS keeps
          yours complete.
        </p>
        <Bullets>
          <li>
            Repayment status flows between your book and the principal lender's
            — no month-end reconciliation marathon
          </li>
          <li>
            Commission and service-fee receivables computed per agreement,
            invoiced with GST treatment applied
          </li>
          <li>
            Collections deposited and reconciled with an audit trail your
            partner bank's inspection team will accept
          </li>
          <li>
            Multi-bank from day one — run corridors for several principal
            lenders without mixing books
          </li>
        </Bullets>
      </Panel>
      <Related
        links={[
          ["Lsp OS", "/products/lspos"],
          ["Co-lending solution", "/solutions/co-lending"],
          ["Fingrid Connect", "/network/connect"],
        ]}
      />
      <ClosingCta
        title="Give your partner banks a reason to send more volume."
        body="See Bc OS configured for your corridors and commission structures."
      />
    </>
  );
}
