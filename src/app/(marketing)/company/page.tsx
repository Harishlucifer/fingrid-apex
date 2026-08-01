import type { Metadata } from "next";
import {
  Band,
  Card,
  CardsSection,
  Crumbs,
  Grad,
  Hero,
} from "@/components/site";

export const metadata: Metadata = {
  title: "About Inforvio",
  description:
    "Fingrid.ai is built by Inforvio Technologies — a team that came to software from the lending side: family lending business, DSA operations, digital aggrega",
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  return (
    <>
      <Crumbs items={[["Company"]]} />
      <Hero
        eyebrow="Company"
        title={
          <>
            Built in Coimbatore. Built from <Grad>lending, for lending.</Grad>
          </>
        }
        lede="Fingrid.ai is built by Inforvio Technologies — a team that came to software from the lending side: family lending business, DSA operations, digital aggregation. We didn't study the domain to build the product; the domain is where we're from."
      />
      <CardsSection
        eyebrow="What we believe"
        title="The convictions behind the product"
      >
        <Card title="Lending is a network">
          Lenders, BCs, LSPs and DSAs are one ecosystem. Software that serves
          only one seat fragments it; we build for the whole table.
        </Card>
        <Card title="Compliance is architecture">
          RBI norms aren't a reporting layer to bolt on — they're constraints
          the system should satisfy by construction.
        </Card>
        <Card title="AI with receipts">
          AI belongs in lending where its work can be audited — document
          intelligence, assembly, drafting — never as an unaccountable
          decision-maker.
        </Card>
        <Card title="India-first">
          Data residency, DPDP, vernacular realities, informal-economy
          underwriting — designed in, not localised in.
        </Card>
      </CardsSection>
      <Band
        eyebrow="Join us"
        title="We hire builders who want the domain, not just the stack"
        ctas={[
          {
            label: "Fingrid Fellowship",
            href: "/resources#fellowship",
            variant: "mint",
          },
        ]}
      >
        Engineering, product and implementation roles in Coimbatore — plus the
        Fingrid Fellowship for those earlier in the journey.
      </Band>
    </>
  );
}
