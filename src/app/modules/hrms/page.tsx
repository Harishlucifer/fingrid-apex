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
  title: "HR & Payroll",
  description:
    "Lending is a people business — field executives, telecallers, credit officers, collectors. The HRMS stack keeps the team master, leave and statutory payrol",
  alternates: { canonical: "/modules/hrms" },
};

export default function ModulesHrmsPage() {
  return (
    <>
      <Crumbs items={[["Modules"], ["HR & Payroll"]]} />
      <Hero
        eyebrow="Module stack · HR & Payroll"
        title={
          <>
            The team behind the book, <Grad>managed on the same system.</Grad>
          </>
        }
        lede="Lending is a people business — field executives, telecallers, credit officers, collectors. The HRMS stack keeps the team master, leave and statutory payroll on the platform, so incentives computed from pipeline data land in the same salary run."
      />
      <CardsSection eyebrow="In this stack" title="Modules">
        <Card
          href="/modules/hrms/payroll-processing"
          title="Payroll Processing"
        >
          Statutory payroll — PF, ESI, PT, TDS — with incentive integration.
        </Card>
      </CardsSection>
      <Panel
        id="employee"
        title="Employee Management"
        note="Also in this stack"
      >
        <p>
          The employee master behind everything: roles, reporting lines, branch
          and territory mapping — the same hierarchy that targets cascade down
          and approvals climb up.
        </p>
      </Panel>
      <Panel id="leave" title="Leave Management" note="Also in this stack">
        <p>
          Leave types, balances, applications and approvals — feeding attendance
          into payroll without a separate reconciliation.
        </p>
      </Panel>
      <Panel id="holiday" title="Holiday Calendar" note="Also in this stack">
        <p>
          State-wise holiday calendars that the whole platform respects — due
          dates, presentation cycles and TAT clocks all know when a branch is
          closed.
        </p>
      </Panel>
      <Related
        links={[
          [
            "Targets & Incentives",
            "/modules/sales/targets-performance-incentives",
          ],
          ["TDS Management", "/modules/finance/tds-management"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
