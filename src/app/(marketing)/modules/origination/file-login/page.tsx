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
  title: "File Login",
  description:
    "File login is the formal gate into credit — where the application is complete, the customer is deduplicated, fees are collected and the clock starts. Get i",
  alternates: { canonical: "/modules/origination/file-login" },
};

export default function ModulesOriginationFileLoginPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Origination", "/modules/origination"],
          ["File Login"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Origination · File Login"
        title={
          <>
            The moment a lead becomes a <Grad>credit file.</Grad>
          </>
        }
        lede="File login is the formal gate into credit — where the application is complete, the customer is deduplicated, fees are collected and the clock starts. Get it right and everything downstream moves faster."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Completeness gate">
          Product-wise checklists enforced at login — incomplete files don't
          enter credit queues.
        </Card>
        <Card title="Dedup & negative checks">
          Customer dedup and internal negative-list screening before the file
          exists.
        </Card>
        <Card title="Login fees">
          Fee collection with receipts, posted to accounting from day zero.
        </Card>
        <Card title="Applicant structure">
          Applicants, co-applicants and guarantors captured with their roles and
          relationships.
        </Card>
        <Card title="TAT clock">
          Login timestamps start the SLA clocks every later stage is measured
          against.
        </Card>
        <Card title="Channel attribution">
          Source channel and partner carried on the file for payout and
          analytics downstream.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Credit Appraisal", "/modules/origination/credit-appraisal-cam"],
          ["Loan Processing", "/modules/sales/loan-processing"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
