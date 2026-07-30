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
  title: "DigiCollect",
  description:
    "The cheapest collection is the one that never needed a human. DigiCollect runs reminder journeys, payment links and self-cure flows so early buckets resolv",
  alternates: { canonical: "/modules/collections/digicollect" },
};

export default function ModulesCollectionsDigicollectPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Collections", "/modules/collections"],
          ["DigiCollect"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Collections · DigiCollect"
        title={
          <>
            Most customers just need a <Grad>nudge and a link.</Grad>
          </>
        }
        lede="The cheapest collection is the one that never needed a human. DigiCollect runs reminder journeys, payment links and self-cure flows so early buckets resolve digitally — and your callers and field teams work only the cases that need them."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Reminder journeys">
          Pre-due and overdue sequences across SMS, WhatsApp and email, tuned by
          bucket and behaviour.
        </Card>
        <Card title="Payment links">
          One-tap payment links that post to the loan account instantly, with
          digital receipts.
        </Card>
        <Card title="Self-cure flows">
          Customers see dues, pay, and get receipts without speaking to anyone.
        </Card>
        <Card title="Behaviour-based intensity">
          Habitual on-time payers get gentle nudges; risk patterns escalate
          earlier.
        </Card>
        <Card title="Bounce follow-up">
          eNACH returns trigger immediate digital follow-up with re-presentation
          coordination.
        </Card>
        <Card title="Channel handoff">
          Digital non-responders route to TeleCollect queues automatically, with
          full context.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["TeleCollect", "/modules/collections/telecollect"],
          ["Repayment Management", "/modules/lms/repayment-management"],
          ["Customer App", "/products/portals/customer-app"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
