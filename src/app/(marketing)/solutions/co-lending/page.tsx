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
  title: "Co-lending",
  description:
    "CLM partnerships fail on operations, not intent: split ratios, dual schedules, payment apportionment and month-end reconciliation. Fingrid runs the mechani",
  alternates: { canonical: "/solutions/co-lending" },
};

export default function SolutionsCoLendingPage() {
  return (
    <>
      <Crumbs items={[["Solutions", "/solutions"], ["Co-lending"]]} />
      <Hero
        eyebrow="Solution · Co-lending"
        title={
          <>
            Co-lending mechanics, <Grad>automated.</Grad>
          </>
        }
        lede="CLM partnerships fail on operations, not intent: split ratios, dual schedules, payment apportionment and month-end reconciliation. Fingrid runs the mechanics — 80/20 splits, dual books and partner settlement — so the partnership scales past the pilot."
      />
      <CardsSection
        eyebrow="The playbook"
        title="What the co-lending configuration bundles"
      >
        <Card title="Split origination">
          Files originated once, exposure split per agreement ratio at
          disbursement.
        </Card>
        <Card title="Dual schedules">
          Partner-wise repayment schedules maintained in parallel and kept in
          sync.
        </Card>
        <Card title="Payment splitting">
          Every collection apportioned across partners by ratio and
          appropriation order, automatically.
        </Card>
        <Card title="Settlement & reconciliation">
          Partner settlement statements and reconciliation that closes months in
          hours.
        </Card>
        <Card title="FLDG handling">
          Default-guarantee tracking within regulatory caps, with invocation
          workflows.
        </Card>
        <Card title="Partner reporting">
          Each partner sees their share of the book, their way.
        </Card>
      </CardsSection>
      <Related
        links={[
          [
            "BC & Co-lending Operations",
            "/modules/lms/bc-co-lending-operations",
          ],
          ["FLDG Management", "/modules/lms/fldg-management"],
          ["Bc OS", "/products/bcos"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
