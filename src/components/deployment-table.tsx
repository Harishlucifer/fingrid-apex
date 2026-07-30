import Link from "next/link";
import { SectionHeader } from "@/components/site";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HEADERS = ["Model", "Isolation", "Best for", "Commercial shape"];

const ROWS: readonly (readonly [string, string, string, string])[] = [
  [
    "Shared multi-tenant (RLS)",
    "Row-level security — every query tenant-scoped at the database layer",
    "Getting live fast: DSAs, agencies, growing BCs and LSPs",
    "Most economical — subscription only",
  ],
  [
    "Per-tenant database",
    "Your own database on managed infrastructure",
    "Institutions whose policy requires physical data separation",
    "Subscription + dedicated-infra component",
  ],
  [
    "Managed VPC",
    "Dedicated virtual private cloud, network-isolated, Fingrid-operated",
    "Mid-to-large NBFCs balancing control with zero ops burden",
    "Subscription + managed-VPC component",
  ],
  [
    "On-prem / your cloud account",
    "Your data centre or your cloud account — you hold the keys",
    "Banks and NBFCs with strict hosting mandates",
    "Licence + deployment & support agreement",
  ],
  [
    "Source code option",
    "Maximum — source code licensing that de-risks vendor dependency",
    "Institutions whose governance or procurement demands it",
    "Structured per engagement",
  ],
];

/** The second pricing axis: deployment model. Pricing page only. */
export function DeploymentTable() {
  return (
    <section
      id="deployment"
      className="scroll-mt-24 py-[clamp(30px,4.6vw,52px)]"
    >
      <div className="wrap">
        <SectionHeader
          eyebrow="The second axis"
          title="Choose your deployment model"
          intro="Your licence has two dimensions: which OS you run, and how it's deployed. All five models run the same platform with the same upgrade path — you're choosing isolation, control and commercial shape, never features."
        />
        <div className="border-n200 mt-5 overflow-x-auto rounded-[14px] border bg-white">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-n50 hover:bg-n50">
                {HEADERS.map((h) => (
                  <TableHead
                    key={h}
                    className="text-n500 px-4 py-[13px] text-xs tracking-[0.06em] whitespace-normal uppercase"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map(([model, ...rest]) => (
                <TableRow key={model} className="border-n100 border-t">
                  <TableCell className="px-4 py-[13px] align-top whitespace-normal">
                    <b className="text-navy-900 font-semibold">{model}</b>
                  </TableCell>
                  {rest.map((cell) => (
                    <TableCell
                      key={cell}
                      className="text-n700 px-4 py-[13px] align-top whitespace-normal"
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-n500 mt-3.5 max-w-[64ch] text-[15.5px]">
          The technical detail behind each model lives on{" "}
          <Link
            href="/platform/architecture-security"
            className="font-medium text-blue-500 hover:text-blue-600 hover:underline"
          >
            Architecture &amp; Security
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
