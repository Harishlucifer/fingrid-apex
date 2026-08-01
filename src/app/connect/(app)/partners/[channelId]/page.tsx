import type { Metadata } from "next";
import { PartnerDetailView } from "./partner-detail-view";

export const metadata: Metadata = {
  title: "Partner detail",
  description: "Details for a Fingrid Connect partner organisation.",
};

export default function ConnectPartnerDetailPage() {
  return <PartnerDetailView />;
}
