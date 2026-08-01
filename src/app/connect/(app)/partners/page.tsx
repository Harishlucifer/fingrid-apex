import type { Metadata } from "next";
import { PartnersView } from "./partners-view";

export const metadata: Metadata = {
  title: "My partners",
  description: "Organisations you've connected with on Fingrid Connect.",
  alternates: { canonical: "/connect/partners" },
};

export default function ConnectPartnersPage() {
  return <PartnersView />;
}
