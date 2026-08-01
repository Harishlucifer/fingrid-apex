import type { Metadata } from "next";
import { RequirementModerationView } from "./requirement-moderation-view";

export const metadata: Metadata = {
  title: "Requirement Moderation",
  description: "Internal Fingrid Connect requirement listing moderation.",
};

export default function ConnectAdminRequirementsPage() {
  return <RequirementModerationView />;
}
