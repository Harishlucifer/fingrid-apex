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
  title: "Loan Processing",
  description:
    "The sales pipeline itself — a deep, seventeen-table file model that carries every lead from first contact through login, and hands complete files to origin",
  alternates: { canonical: "/modules/sales/loan-processing" },
};

export default function ModulesSalesLoanProcessingPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["Sales", "/modules/sales"], ["Loan Processing"]]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · Loan Processing"
        title={
          <>
            The pipeline every other <Grad>module plugs into.</Grad>
          </>
        }
        lede="The sales pipeline itself — a deep, seventeen-table file model that carries every lead from first contact through login, and hands complete files to origination. Every channel writes into it; every dashboard reads from it."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Unified pipeline">
          One pipeline across field, tele, branch, DSA and BC channels —
          stage-consistent, source-attributed.
        </Card>
        <Card title="File assembly">
          Applicant, co-applicant, income, documents and product selection
          assembled progressively.
        </Card>
        <Card title="Stage discipline">
          Configurable stages with SLAs, ownership and ageing — files can't
          silently stall.
        </Card>
        <Card title="Duplicate detection">
          Same customer, two channels? Caught before two teams work one file.
        </Card>
        <Card title="Checklist enforcement">
          Product-wise document and data checklists gate stage movement.
        </Card>
        <Card title="Origination handoff">
          Complete files flow into File Login without re-entry — sales data
          becomes credit data.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["File Login", "/modules/origination/file-login"],
          [
            "Targets & Incentives",
            "/modules/sales/targets-performance-incentives",
          ],
        ]}
      />
      <ClosingCta />
    </>
  );
}
