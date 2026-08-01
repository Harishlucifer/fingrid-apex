import type { Metadata } from "next";
import { RequirementWizardView } from "../requirement-wizard-view";

export const metadata: Metadata = {
  title: "Edit requirement",
  description: "Continue editing a partnership requirement draft.",
};

export default function ConnectEditRequirementPage() {
  return <RequirementWizardView />;
}
