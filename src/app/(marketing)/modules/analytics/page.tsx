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
  title: "Analytics & Reports",
  description:
    "Every module writes to one data spine, so reporting isn't an export project — it's a gallery of live views, from the MD's morning dashboard to the bureau s",
  alternates: { canonical: "/modules/analytics" },
};

export default function ModulesAnalyticsPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["Analytics & Reports"]]} />
      <Hero
        eyebrow="Module stack · Analytics & Reports"
        title={
          <>
            The numbers your board and the <Grad>RBI both ask for.</Grad>
          </>
        }
        lede="Every module writes to one data spine, so reporting isn't an export project — it's a gallery of live views, from the MD's morning dashboard to the bureau submission file, all agreeing with each other because they come from the same source."
      />
      <CardsSection eyebrow="The gallery" title="Views across the lifecycle">
        <Card title="MD Dashboard">
          The institution at a glance — disbursement, book, collections
          efficiency, NPA — for the corner office.
        </Card>
        <Card title="Branch Dashboard">
          Each branch's pipeline, disbursement, portfolio and collections in its
          own cockpit.
        </Card>
        <Card title="Sales MIS">
          Channel-wise, product-wise, executive-wise sourcing performance
          against targets.
        </Card>
        <Card title="Business & Origination">
          Login-to-disbursement funnels, TAT analysis and rejection analytics.
        </Card>
        <Card title="PDD Tracking">
          Post-disbursement documents pending, ageing and chased — before they
          become audit findings.
        </Card>
        <Card title="Loan Management">
          Book composition, accrual and repayment analytics off the live LMS.
        </Card>
        <Card title="Collection & Recovery">
          Bucket-wise efficiency, PTP performance, collector and agency
          productivity.
        </Card>
        <Card title="NPA & Bad Debts">
          Classification movement, provisioning and recovery on written-off
          accounts.
        </Card>
        <Card title="Bureau Reporting">
          Submission-ready bureau reporting data prepared on cycle, every cycle.
        </Card>
        <Card title="Usage & Status">
          Platform usage views and bulk status downloads for operations teams.
        </Card>
      </CardsSection>
      <Panel
        id="beat"
        title="Beat Plan & Activity Tracking"
        note="Deep-dive view"
      >
        <p>
          The analytical companion to Field Sales: planned-versus-actual beat
          coverage, visit productivity, geography heat and executive activity —
          the view that tells a sales head whether the field force is where the
          plan says it is.
        </p>
      </Panel>
      <Related
        links={[
          ["Field Sales", "/modules/sales/field-sales"],
          ["Portfolio Management", "/modules/lms/portfolio-management"],
          ["MD-level demos", "/pricing#demo"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
