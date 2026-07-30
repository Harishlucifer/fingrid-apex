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
  title: "Payroll Processing",
  description:
    "PF, ESI, professional tax and TDS on salaries, computed per structure and statute — with the incentives your sales and collection teams earned flowing in f",
  alternates: { canonical: "/modules/hrms/payroll-processing" },
};

export default function ModulesHrmsPayrollProcessingPage() {
  return (
    <>
      <Crumbs
        items={[["Modules"], ["HR & Payroll", "/modules/hrms"], ["Payroll"]]}
      />
      <Hero
        eyebrow="HRMS · Payroll Processing"
        title={
          <>
            Salary runs with the statutory <Grad>maths done right.</Grad>
          </>
        }
        lede="PF, ESI, professional tax and TDS on salaries, computed per structure and statute — with the incentives your sales and collection teams earned flowing in from the same platform that measured them."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Salary structures">
          Earning and deduction components per grade, with revisions
          effective-dated.
        </Card>
        <Card title="Statutory computation">
          PF, ESI, PT and salary TDS computed per current rules, with
          contribution reports.
        </Card>
        <Card title="Incentive integration">
          Approved incentives from Sales and Collections land in the run
          automatically.
        </Card>
        <Card title="Attendance & leave">
          Leave and attendance feed pay days without a separate reconciliation
          step.
        </Card>
        <Card title="Salary slips">
          Slip generation and distribution, with year-to-date statements.
        </Card>
        <Card title="GL posting">
          Payroll posts to the dimensional GL — people cost lands on the right
          branch and cost centre.
        </Card>
      </CardsSection>
      <Related
        links={[
          [
            "Targets & Incentives",
            "/modules/sales/targets-performance-incentives",
          ],
          ["Accounting & GL", "/modules/finance/accounting-gl"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
