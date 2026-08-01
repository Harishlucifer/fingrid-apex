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
  title: "FLDG Management",
  description:
    "First-loss default guarantees are now a regulated instrument with hard caps and invocation discipline. Fingrid tracks FLDG arrangements per partner — cover",
  alternates: { canonical: "/modules/lms/fldg-management" },
};

export default function ModulesLmsFldgManagementPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["LMS", "/modules/lms"], ["FLDG"]]} />
      <Hero
        pill="In development"
        eyebrow="LMS · FLDG Management"
        title={
          <>
            Default guarantees, inside the <Grad>regulatory lines.</Grad>
          </>
        }
        lede="First-loss default guarantees are now a regulated instrument with hard caps and invocation discipline. Fingrid tracks FLDG arrangements per partner — cover, utilisation, invocation and accounting — so the guarantee that protects the book doesn't itself become a compliance finding."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Arrangement registry">
          FLDG agreements per partner with cover form, percentage and portfolio
          linkage.
        </Card>
        <Card title="Cap monitoring">
          Guarantee cover tracked against the regulatory ceiling on the
          underlying portfolio — continuously.
        </Card>
        <Card title="Invocation workflow">
          Default-triggered invocation with timelines, documentation and partner
          communication.
        </Card>
        <Card title="Utilisation tracking">
          Cover consumed vs available, per arrangement, per cohort.
        </Card>
        <Card title="Accounting treatment">
          Invocations and recoveries posted with the correct GL treatment.
        </Card>
        <Card title="Partner statements">
          FLDG position statements both sides can agree on.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Co-lending solution", "/solutions/co-lending"],
          ["BC & Co-lending Ops", "/modules/lms/bc-co-lending-operations"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
