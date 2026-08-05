import type { Metadata } from "next";
import { RequirementWizardView } from "../requirement-wizard-view";

export const metadata: Metadata = {
  title: "Post a requirement",
  description: "Publish a new partnership requirement on Fingrid Connect.",
  alternates: { canonical: "/connect/requirements/new" },
};

export default function ConnectNewRequirementPage() {
  return <RequirementWizardView />;
}
