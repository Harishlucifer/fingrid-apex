import type { Metadata } from "next";
import { RequestsView } from "./requests-view";

export const metadata: Metadata = {
  title: "Connect requests",
  description: "Manage incoming and outgoing partnership requests.",
  alternates: { canonical: "/connect/requests" },
};

export default function ConnectRequestsPage() {
  return <RequestsView />;
}
