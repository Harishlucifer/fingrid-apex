import type { Metadata } from "next";
import { PartnerOversightView } from "./partner-oversight-view";

export const metadata: Metadata = {
  title: "Partners & Vetting",
  description: "Internal Fingrid Connect partner oversight and vetting queue.",
};

export default function ConnectAdminPartnersPage() {
  return <PartnerOversightView />;
}
