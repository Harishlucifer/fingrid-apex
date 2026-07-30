/**
 * Site navigation — ported from the static generator's nav() and footer().
 * Kept as data so the desktop mega-menu and the mobile accordion render from
 * one source of truth.
 */

export interface NavLink {
  label: string;
  href: string;
  /** Small uppercase group heading rendered above the link. */
  heading?: string;
}

/** A column inside the Modules mega-menu. */
export interface NavColumn {
  label: string;
  href: string;
  links: NavLink[];
}

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string; links: NavLink[]; align?: "end" }
  | { kind: "mega"; label: string; columns: NavColumn[] };

export const NAV: NavItem[] = [
  {
    kind: "menu",
    label: "Products",
    links: [
      {
        heading: "Operating systems",
        label: "LenderOS — for NBFCs & lenders",
        href: "/products/lenderos",
      },
      { label: "BcOS — for business correspondents", href: "/products/bcos" },
      { label: "LspOS — for loan service providers", href: "/products/lspos" },
      { label: "DsaOS — for DSAs", href: "/products/dsaos" },
      {
        heading: "Specialised OS",
        label: "VerifyOS — verification operations",
        href: "/products/verifyos",
      },
      {
        label: "ValuationOS — valuation operations",
        href: "/products/valuationos",
      },
      { label: "CollectOS — collection agencies", href: "/products/collectos" },
      {
        heading: "Portals & apps",
        label: "DSA Portal",
        href: "/products/portals/dsa-portal",
      },
      { label: "Customer Portal", href: "/products/portals/customer-portal" },
      { label: "Customer Mobile App", href: "/products/portals/customer-app" },
      { label: "All products →", href: "/products" },
    ],
  },
  {
    kind: "mega",
    label: "Modules",
    columns: [
      {
        label: "Marketing",
        href: "/modules/marketing",
        links: [
          {
            label: "Campaign Management",
            href: "/modules/marketing/campaign-management",
          },
        ],
      },
      {
        label: "Sales & Channels",
        href: "/modules/sales",
        links: [
          { label: "Field Sales", href: "/modules/sales/field-sales" },
          { label: "Tele Sales", href: "/modules/sales/tele-sales" },
          {
            label: "DSA Channel Sales",
            href: "/modules/sales/dsa-channel-sales",
          },
          {
            label: "BC Channel Sales",
            href: "/modules/sales/bc-channel-sales",
          },
          { label: "Loan Processing", href: "/modules/sales/loan-processing" },
          {
            label: "Targets & Incentives",
            href: "/modules/sales/targets-performance-incentives",
          },
          {
            label: "Partner Mgmt & Payouts",
            href: "/modules/sales/partner-management-payouts",
          },
        ],
      },
      {
        label: "Loan Origination",
        href: "/modules/origination",
        links: [
          { label: "File Login", href: "/modules/origination/file-login" },
          {
            label: "Credit Appraisal (CAM)",
            href: "/modules/origination/credit-appraisal-cam",
          },
          { label: "Verification", href: "/modules/origination/verification" },
          {
            label: "Field Credit / FI-PD",
            href: "/modules/origination/field-credit-fi-pd",
          },
          {
            label: "Underwriting & Rules",
            href: "/modules/origination/underwriting-rule-engine",
          },
          { label: "Disbursement", href: "/modules/origination/disbursement" },
          { label: "Customer 360", href: "/modules/origination/customer-360" },
        ],
      },
      {
        label: "Loan Management",
        href: "/modules/lms",
        links: [
          {
            label: "Loan Accounts",
            href: "/modules/lms/loan-account-management",
          },
          { label: "Repayments", href: "/modules/lms/repayment-management" },
          { label: "Collateral", href: "/modules/lms/collateral-management" },
          { label: "Portfolio", href: "/modules/lms/portfolio-management" },
          { label: "NPA & DPD", href: "/modules/lms/npa-dpd-management" },
          { label: "FLDG", href: "/modules/lms/fldg-management" },
          {
            label: "BC & Co-lending Ops",
            href: "/modules/lms/bc-co-lending-operations",
          },
          {
            label: "Loan Servicing",
            href: "/modules/lms/loan-servicing-operations",
          },
        ],
      },
      {
        label: "Collections & Recovery",
        href: "/modules/collections",
        links: [
          { label: "DigiCollect", href: "/modules/collections/digicollect" },
          { label: "TeleCollect", href: "/modules/collections/telecollect" },
          { label: "FieldCollect", href: "/modules/collections/fieldcollect" },
          {
            label: "Legal & Recovery",
            href: "/modules/collections/legal-recovery",
          },
        ],
      },
      {
        label: "Finance & Accounting",
        href: "/modules/finance",
        links: [
          { label: "Accounting & GL", href: "/modules/finance/accounting-gl" },
          { label: "GST Management", href: "/modules/finance/gst-management" },
          { label: "TDS Management", href: "/modules/finance/tds-management" },
          {
            label: "NBFC Compliance Suite",
            href: "/modules/finance/nbfc-compliance-suite",
          },
        ],
      },
      {
        label: "HR & Payroll",
        href: "/modules/hrms",
        links: [
          {
            label: "Payroll Processing",
            href: "/modules/hrms/payroll-processing",
          },
        ],
      },
      { label: "Analytics & Reports", href: "/modules/analytics", links: [] },
    ],
  },
  {
    kind: "menu",
    label: "Solutions",
    links: [
      { label: "Two-Wheeler Finance", href: "/solutions/two-wheeler" },
      { label: "Home Loan", href: "/solutions/home-loan" },
      { label: "Used Car Finance", href: "/solutions/used-car" },
      { label: "MSME Lending", href: "/solutions/msme" },
      { label: "Co-lending", href: "/solutions/co-lending" },
    ],
  },
  {
    kind: "menu",
    label: "Network",
    links: [
      { label: "Fingrid Connect — matchmaking", href: "/network/connect" },
      { label: "Fingrid OneKey — API access", href: "/network/onekey" },
      {
        heading: "By role",
        label: "For lenders",
        href: "/network/for-lenders",
      },
      { label: "For partners — DSA · LSP · BC", href: "/network/for-partners" },
    ],
  },
  {
    kind: "menu",
    label: "AI",
    links: [
      { label: "Agentic Lending", href: "/ai/agentic-lending" },
      {
        label: "Agentic Configuration (MCP)",
        href: "/ai/agentic-configuration",
      },
      { label: "Agentic Engineering", href: "/ai/agentic-engineering" },
      { label: "AI at Fingrid →", href: "/ai" },
    ],
  },
  {
    kind: "menu",
    label: "Platform",
    links: [
      {
        label: "Configuration Studio",
        href: "/platform/configuration-studio",
      },
      {
        label: "Deployment & Onboarding",
        href: "/platform/deployment-onboarding",
      },
      {
        label: "Architecture & Security",
        href: "/platform/architecture-security",
      },
      { label: "Integrations", href: "/platform/integrations" },
    ],
  },
  { kind: "link", label: "Pricing", href: "/pricing" },
  {
    kind: "menu",
    label: "Resources",
    align: "end",
    links: [
      { label: "Compliance Center", href: "/resources#compliance" },
      { label: "50 Shades of Lending — blog", href: "/resources#blog" },
      { label: "Case Studies", href: "/resources#cases" },
      { label: "Fingrid Fellowship", href: "/resources#fellowship" },
    ],
  },
];

export const FOOTER: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Products",
    links: [
      { label: "LenderOS", href: "/products/lenderos" },
      { label: "BcOS", href: "/products/bcos" },
      { label: "LspOS", href: "/products/lspos" },
      { label: "DsaOS", href: "/products/dsaos" },
      { label: "VerifyOS", href: "/products/verifyos" },
      { label: "ValuationOS", href: "/products/valuationos" },
      { label: "CollectOS", href: "/products/collectos" },
      { label: "Portals & Apps", href: "/products/portals" },
    ],
  },
  {
    heading: "Modules",
    links: [
      { label: "Loan Origination", href: "/modules/origination" },
      { label: "Loan Management", href: "/modules/lms" },
      { label: "Collections", href: "/modules/collections" },
      { label: "Finance & Accounting", href: "/modules/finance" },
      { label: "Analytics & Reports", href: "/modules/analytics" },
    ],
  },
  {
    heading: "Network",
    links: [
      { label: "Fingrid Connect", href: "/network/connect" },
      { label: "Fingrid OneKey", href: "/network/onekey" },
      { label: "For Lenders", href: "/network/for-lenders" },
      { label: "For Partners", href: "/network/for-partners" },
      { label: "Solutions", href: "/solutions" },
      { label: "Platform", href: "/platform" },
      { label: "AI at Fingrid", href: "/ai" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Inforvio", href: "/company" },
      { label: "Resources", href: "/resources" },
      { label: "Pricing", href: "/pricing" },
      { label: "Fellowship", href: "/resources#fellowship" },
    ],
  },
];
