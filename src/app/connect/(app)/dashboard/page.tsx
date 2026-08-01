import type { Metadata } from "next";
import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Fingrid Connect partner dashboard.",
  alternates: { canonical: "/connect/dashboard" },
};

export default function ConnectDashboardPage() {
  return <DashboardView />;
}
