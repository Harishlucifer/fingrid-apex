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
  title: "Field Sales",
  description:
    "Beat plans, geo-tracked visits and mobile-first file capture for the field teams that source most of India's secured lending — with managers seeing coverag",
  alternates: { canonical: "/modules/sales/field-sales" },
};

export default function ModulesSalesFieldSalesPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["Sales", "/modules/sales"], ["Field Sales"]]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · Field Sales"
        title={
          <>
            Feet on street, <Grad>data in system.</Grad>
          </>
        }
        lede="Beat plans, geo-tracked visits and mobile-first file capture for the field teams that source most of India's secured lending — with managers seeing coverage and conversion instead of guessing from evening phone calls."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Beat planning">
          Plan weekly beats by territory and dealer/customer clusters; track
          planned vs actual coverage.
        </Card>
        <Card title="Geo-tracked visits">
          Check-in and check-out with GPS and selfie evidence — visits that
          actually happened.
        </Card>
        <Card title="Mobile file capture">
          Leads and documents captured at the customer's doorstep, synced to the
          pipeline instantly.
        </Card>
        <Card title="Activity tracking">
          Visits, calls and follow-ups rolled into daily activity reports
          without manual reporting.
        </Card>
        <Card title="Territory management">
          Executives mapped to territories; leads route to the right person
          automatically.
        </Card>
        <Card title="Manager cockpit">
          Team location, coverage, pipeline and conversion in one supervisory
          view.
        </Card>
      </CardsSection>
      <Related
        links={[
          [
            "Targets & Incentives",
            "/modules/sales/targets-performance-incentives",
          ],
          ["Beat analytics", "/modules/analytics"],
          ["FieldCollect", "/modules/collections/fieldcollect"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
