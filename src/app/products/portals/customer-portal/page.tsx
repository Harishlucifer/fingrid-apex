import type { Metadata } from "next";
import {
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
  Related,
} from "@/components/site";

export const metadata: Metadata = {
  title: "Customer Portal",
  description:
    "Statements, payments, certificates and service requests — the things borrowers call your branch for, available on the web on your brand, backed by the same",
  alternates: { canonical: "/products/portals/customer-portal" },
};

export default function ProductsPortalsCustomerPortalPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Products", "/products"],
          ["Portals", "/products/portals"],
          ["Customer Portal"],
        ]}
      />
      <Hero
        eyebrow="Customer Portal"
        title={
          <>
            Self-service that actually <Grad>reduces branch load.</Grad>
          </>
        }
        lede="Statements, payments, certificates and service requests — the things borrowers call your branch for, available on the web on your brand, backed by the same LMS your team uses."
      />
      <CardsSection eyebrow="Capabilities" title="What customers do themselves">
        <Card title="Account overview">
          Outstanding, next EMI, schedule and transaction history — always
          current, straight from the LMS.
        </Card>
        <Card title="Payments">
          Pay EMIs and overdue amounts online; receipts post to the loan account
          instantly.
        </Card>
        <Card title="Statements & certificates">
          SOA, interest certificates and repayment schedules, self-downloaded
          any time.
        </Card>
        <Card title="Service requests">
          Raise and track requests — from address change to foreclosure quote —
          with visible TATs.
        </Card>
        <Card title="Documents">
          Welcome kits, agreements and NOC on closure, in one place.
        </Card>
        <Card title="Offers">
          Pre-approved top-ups and cross-sell offers, shown to the right
          customers only.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Customer Mobile App", "/products/portals/customer-app"],
          ["Service Request Management", "/modules/lms#srm"],
          ["Repayment Management", "/modules/lms/repayment-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
