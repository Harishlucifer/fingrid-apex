import type { Metadata } from "next";
import { MatchesView } from "./matches-view";

export const metadata: Metadata = {
  title: "My matches",
  description: "Auto-matched partner candidates ranked by fit.",
  alternates: { canonical: "/connect/matches" },
};

export default function ConnectMatchesPage() {
  return <MatchesView />;
}
