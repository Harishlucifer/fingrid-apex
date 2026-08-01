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
  title: "TeleCollect",
  description:
    "Collection calling as managed operation: bucket-wise queues, click-to-call, structured dispositions and PTPs that come back to haunt the caller — in a good",
  alternates: { canonical: "/modules/collections/telecollect" },
};

export default function ModulesCollectionsTelecollectPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Collections", "/modules/collections"],
          ["TeleCollect"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Collections · TeleCollect"
        title={
          <>
            Every promise to pay, <Grad>tracked to its date.</Grad>
          </>
        }
        lede="Collection calling as managed operation: bucket-wise queues, click-to-call, structured dispositions and PTPs that come back to haunt the caller — in a good way — on the promised date."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Strategy queues">
          Cases queued by bucket, amount and risk — callers work priority, not
          alphabetical order.
        </Card>
        <Card title="PTP management">
          Promises to pay recorded with dates and amounts, tracked to
          kept/broken, driving next actions.
        </Card>
        <Card title="Dispositions">
          Structured call outcomes feeding the case history every channel can
          see.
        </Card>
        <Card title="Click-to-call">
          Dial from the case card with call logs attached automatically.
        </Card>
        <Card title="Compliance guardrails">
          Calling-hour discipline and contact-frequency rules built into the
          workflow.
        </Card>
        <Card title="Escalation triggers">
          Broken PTPs and non-contact route cases to field or legal per
          strategy.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["FieldCollect", "/modules/collections/fieldcollect"],
          ["DigiCollect", "/modules/collections/digicollect"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
