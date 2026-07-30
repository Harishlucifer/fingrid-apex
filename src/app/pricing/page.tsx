import type { Metadata } from "next";
import { Card, CardsSection, Crumbs, Grad, Hero } from "@/components/site";
import { DeploymentTable } from "@/components/deployment-table";
import { DemoForm } from "@/components/demo-form";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Every Fingrid OS is licensed per tenant with modular stacks — start with what you run today, switch on stacks as you grow. Dsa OS starts lean for small team",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <Crumbs items={[["Pricing"]]} />
      <Hero
        eyebrow="Pricing"
        title={
          <>
            Priced for the size of your{" "}
            <Grad>operation, not your ambition.</Grad>
          </>
        }
        lede="Every Fingrid OS is licensed per tenant with modular stacks — start with what you run today, switch on stacks as you grow. Dsa OS starts lean for small teams; Lender OS scales to multi-entity institutions."
      />
      <CardsSection
        eyebrow="How licensing works"
        title="Four products, one principle"
        intro="Pay for the OS that matches your role and the stacks you actually use."
      >
        <Card href="/products/dsaos" title="Dsa OS">
          For DSA businesses — per-seat plans that a growing team can afford,
          with wallet-based usage billing on the roadmap.
        </Card>
        <Card href="/products/bcos" title="Bc OS">
          For business correspondents — tenant licence plus per-corridor
          configuration for each partner bank.
        </Card>
        <Card href="/products/lspos" title="Lsp OS">
          For LSPs — tenant licence with per-lender integration and compliance
          configuration.
        </Card>
        <Card href="/products/lenderos" title="Lender OS">
          For NBFCs and banks — tenant licence by entity and book size, with all
          eight stacks available.
        </Card>
        <Card
          href="/products/verifyos"
          title="Verify OS · Valuation OS · Collect OS"
        >
          For verification, valuation and collection businesses —
          operations-sized licences priced on work-order and case volumes.
        </Card>
      </CardsSection>
      <DeploymentTable />
      <DemoForm />
    </>
  );
}
