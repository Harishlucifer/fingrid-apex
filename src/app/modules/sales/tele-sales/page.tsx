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
  title: "Tele Sales",
  description:
    "Calling queues, dispositions and click-to-call for inside sales teams — leads worked systematically instead of from a printout, with every outcome captured",
  alternates: { canonical: "/modules/sales/tele-sales" },
};

export default function ModulesSalesTeleSalesPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["Sales", "/modules/sales"], ["Tele Sales"]]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · Tele Sales"
        title={
          <>
            Every dial, disposition and <Grad>promise, on record.</Grad>
          </>
        }
        lede="Calling queues, dispositions and click-to-call for inside sales teams — leads worked systematically instead of from a printout, with every outcome captured for the next caller."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Smart queues">
          Leads queued by campaign, product and priority — callers work the
          queue, not a spreadsheet.
        </Card>
        <Card title="Click-to-call">
          Dial from the lead card; call logs attach to the lead automatically.
        </Card>
        <Card title="Dispositions">
          Structured outcomes — interested, callback, not eligible — driving the
          next action.
        </Card>
        <Card title="Callback scheduling">
          Promised callbacks surface at the promised time, to the right caller.
        </Card>
        <Card title="Scripts & objections">
          Product scripts and objection handling in front of the caller,
          versioned centrally.
        </Card>
        <Card title="Supervisor analytics">
          Connect rates, talk time and conversion by caller, campaign and hour.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Campaign Management", "/modules/marketing/campaign-management"],
          ["TeleCollect", "/modules/collections/telecollect"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
