import type { Metadata } from "next";
import {
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
  title: "NBFC Compliance Suite",
  description:
    "For regulated lenders, the books must also answer to the regulator — borrowings, asset-liability maturity, prudential returns and expected credit loss. The",
  alternates: { canonical: "/modules/finance/nbfc-compliance-suite" },
};

export default function ModulesFinanceNbfcComplianceSuitePage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Finance", "/modules/finance"],
          ["NBFC Compliance Suite"],
        ]}
      />
      <Hero
        eyebrow="Finance · NBFC Compliance Suite"
        title={
          <>
            The lender-only layer: treasury to <Grad>the RBI return.</Grad>
          </>
        }
        lede="For regulated lenders, the books must also answer to the regulator — borrowings, asset-liability maturity, prudential returns and expected credit loss. The Compliance Suite builds that layer on the same dimensional GL, so the return agrees with the books because it comes from them."
      />
      <CardsSection
        eyebrow="The suite"
        title="Four capabilities, one set of books"
      >
        <Card title="Treasury">
          Borrowings, facilities and repayment obligations tracked with
          cost-of-funds visibility.
        </Card>
        <Card title="ALM">
          Asset-liability maturity bucketing from the loan book and borrowing
          schedules — the structural liquidity view ALCO needs.
        </Card>
        <Card title="Regulatory reporting">
          Prudential returns — DNBS-family and CRAR computation — assembled from
          GL and loan-book data rather than rebuilt in Excel.
        </Card>
        <Card title="ECL computation">
          Ind AS 109 expected credit loss: staging, PD/LGD-based computation and
          provision reconciliation against IRAC floors.
        </Card>
      </CardsSection>
      <Panel title="One principle: returns from the books">
        <p>
          Every number in a regulatory return traces to postings in the GL and
          accounts in the loan book. When the examiner asks, the drill-down
          exists.
        </p>
      </Panel>
      <Related
        links={[
          ["Accounting & GL", "/modules/finance/accounting-gl"],
          ["NPA & DPD", "/modules/lms/npa-dpd-management"],
          ["LenderOS", "/products/lenderos"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
