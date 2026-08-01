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
  title: "Targets, Performance & Incentives",
  description:
    "Territory targets cascade down the hierarchy, performance is scored from real pipeline data, and incentives compute from the same numbers — one loop, so th",
  alternates: { canonical: "/modules/sales/targets-performance-incentives" },
};

export default function ModulesSalesTargetsPerformanceIncentivesPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Modules"],
          ["Sales", "/modules/sales"],
          ["Targets & Incentives"],
        ]}
      />
      <Hero
        pill="Live"
        eyebrow="Sales · Targets, Performance & Incentives"
        title={
          <>
            Target, scorecard and payout — <Grad>one closed loop.</Grad>
          </>
        }
        lede="Territory targets cascade down the hierarchy, performance is scored from real pipeline data, and incentives compute from the same numbers — one loop, so the field trusts the payout and managers trust the scoreboard."
      />
      <CardsSection eyebrow="Capabilities" title="What it does">
        <Card title="Territory targets">
          Targets by geography, product and period, cascading from zone to
          branch to executive.
        </Card>
        <Card title="Live scorecards">
          Achievement tracked against disbursement, files and portfolio quality
          — updated as files move.
        </Card>
        <Card title="Incentive plans">
          Slab, percentage and kicker structures configured per role and
          product.
        </Card>
        <Card title="Team & individual">
          Individual and team-level incentive logic, including manager overrides
          on team achievement.
        </Card>
        <Card title="Payout computation">
          Incentives computed from system data, approved maker-checker, handed
          to payroll.
        </Card>
        <Card title="Dispute trail">
          Every computed number traces to the files behind it — disputes die in
          minutes.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["Field Sales", "/modules/sales/field-sales"],
          ["Payroll", "/modules/hrms/payroll-processing"],
          ["Sales MIS", "/modules/analytics"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
