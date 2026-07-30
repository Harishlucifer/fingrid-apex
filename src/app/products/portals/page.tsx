import type { Metadata } from "next";
import {
  Card,
  CardsSection,
  ClosingCta,
  Crumbs,
  Grad,
  Hero,
} from "@/components/site";

export const metadata: Metadata = {
  title: "Portals & Apps",
  description:
    "Every OS needs surfaces for the people outside your team — channel partners, customers and vendors. Fingrid portals plug straight into the OS behind them, ",
  alternates: { canonical: "/products/portals" },
};

export default function ProductsPortalsPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["Portals & Apps"]]} />
      <Hero
        eyebrow="Portals & apps"
        title={
          <>
            The front doors to your <Grad>lending operation.</Grad>
          </>
        }
        lede="Every OS needs surfaces for the people outside your team — channel partners, customers and vendors. Fingrid portals plug straight into the OS behind them, so what partners and borrowers see is always what your system knows."
      />
      <CardsSection
        eyebrow="The family"
        title="Three live surfaces, one on the way"
      >
        <Card href="/products/portals/dsa-portal" title="DSA Portal">
          Self-serve file submission, document upload, status tracking and
          payout statements for channel partners.
        </Card>
        <Card href="/products/portals/customer-portal" title="Customer Portal">
          Web self-service for borrowers — statements, payments, certificates
          and service requests.
        </Card>
        <Card href="/products/portals/customer-app" title="Customer Mobile App">
          EMIs, receipts, requests and offers in your customer's pocket, on your
          brand.
        </Card>
        <Card title="Vendor Portal" tag="PLANNED">
          Work orders, TATs and invoicing for verification and valuation
          agencies. Joining the family soon.
        </Card>
      </CardsSection>
      <ClosingCta />
    </>
  );
}
