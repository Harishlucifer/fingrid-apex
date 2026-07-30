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
  title: "DSA Portal",
  description:
    "Your DSAs submit files, upload documents, track status and see payout statements themselves — instead of calling your branch team for every update. Cleaner",
  alternates: { canonical: "/products/portals/dsa-portal" },
};

export default function ProductsPortalsDsaPortalPage() {
  return (
    <>
      <Crumbs
        items={[
          ["Products", "/products"],
          ["Portals", "/products/portals"],
          ["DSA Portal"],
        ]}
      />
      <Hero
        eyebrow="DSA Portal"
        title={
          <>
            Give every channel partner a <Grad>professional front door.</Grad>
          </>
        }
        lede="Your DSAs submit files, upload documents, track status and see payout statements themselves — instead of calling your branch team for every update. Cleaner files in, fewer calls, faster payouts out."
      />
      <CardsSection
        eyebrow="Capabilities"
        title="What partners do in the portal"
      >
        <Card title="File submission">
          Guided submission with product-wise document checklists — incomplete
          files never enter your queue.
        </Card>
        <Card title="Status tracking">
          Live stage visibility from login to disbursement, with query and
          re-submission handling.
        </Card>
        <Card title="Document exchange">
          Deficiency lists and uploads in one thread — no documents lost in
          WhatsApp.
        </Card>
        <Card title="Payout statements">
          Disbursement-linked payout computation, statements and invoice
          submission with GST.
        </Card>
        <Card title="Team access">
          Partner-side sub-users with role-based access to their own files only.
        </Card>
        <Card title="Announcements">
          Rate changes, scheme launches and policy updates pushed to the whole
          network at once.
        </Card>
      </CardsSection>
      <Related
        links={[
          ["DSA Channel Sales module", "/modules/sales/dsa-channel-sales"],
          [
            "Partner Management & Payouts",
            "/modules/sales/partner-management-payouts",
          ],
          ["DsaOS", "/products/dsaos"],
        ]}
      />
      <ClosingCta />
    </>
  );
}
