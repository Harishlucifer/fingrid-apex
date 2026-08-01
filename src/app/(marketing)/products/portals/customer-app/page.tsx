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
  title: "Customer Mobile App",
  description:
    "A white-labelled mobile app for borrowers — EMIs, receipts, requests and offers — that keeps your brand on their home screen for the life of the loan.",
  alternates: { canonical: "/products/portals/customer-app" },
};

export default function ProductsPortalsCustomerAppPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Products", "/products"],
          ["Portals", "/products/portals"],
          ["Customer App"],
        ]}
      />
      <Hero
        eyebrow="Customer Mobile App"
        title={
          <>
            The loan, in your customer’s <Grad>pocket.</Grad>
          </>
        }
        lede="A white-labelled mobile app for borrowers — EMIs, receipts, requests and offers — that keeps your brand on their home screen for the life of the loan."
      />
      <CardsSection
        eyebrow="Capabilities"
        title="Built for the repayment relationship"
      >
        <Card title="EMI & dues">
          Upcoming EMI, overdue alerts and one-tap payment.
        </Card>
        <Card title="Receipts">
          Instant digital receipts for every payment, synced with the LMS.
        </Card>
        <Card title="Service requests">
          Raise, track and get notified — without calling anyone.
        </Card>
        <Card title="Statements">SOA and certificates on demand.</Card>
        <Card title="Offers & top-ups">
          Eligible offers surfaced in-app, applied in a few taps.
        </Card>
        <Card title="Your brand">
          Your name, your colours, your icon — Fingrid stays invisible.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Customer Portal", "/products/portals/customer-portal"],
          ["DigiCollect", "/modules/collections/digicollect"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
