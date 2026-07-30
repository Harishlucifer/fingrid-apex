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
  title: "Customer 360",
  description:
    "A customer isn't a file — they're a history. Customer 360 is the single view of every relationship: loans past and present, repayment behaviour, service re",
  alternates: { canonical: "/modules/origination/customer-360" },
};

export default function ModulesOriginationCustomer360Page() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Origination", "/modules/origination"],
          ["Customer 360"],
        ]}
      />
      <Hero
        eyebrow="Origination · Customer 360"
        title={
          <>
            Everything you know about a customer, <Grad>on one screen.</Grad>
          </>
        }
        lede="A customer isn't a file — they're a history. Customer 360 is the single view of every relationship: loans past and present, repayment behaviour, service requests, family and business connections, and the headroom for the next product."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Relationship timeline">
          Every loan, application, payment and interaction in one chronological
          view.
        </Card>
        <Card title="Exposure & behaviour">
          Total exposure across products with repayment track — the real
          internal credit history.
        </Card>
        <Card title="Connected entities">
          Co-applicants, guarantors, family and business linkages mapped,
          exposure aggregated.
        </Card>
        <Card title="Service history">
          Requests, complaints and their resolution — the health of the
          relationship, visible.
        </Card>
        <Card title="Cross-sell headroom">
          Eligibility for the next product computed from behaviour and existing
          exposure.
        </Card>
        <Card title="One identity">
          Built on the same canonical identity layer as the Fingrid network —
          one customer, one record.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Fingrid Connect identity", "/network/connect"],
          ["Loan Account Management", "/modules/lms/loan-account-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
