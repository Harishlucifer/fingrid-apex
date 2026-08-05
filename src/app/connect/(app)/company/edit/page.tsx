import type { Metadata } from "next";
import { CompanyProfileWizardView } from "./company-profile-wizard-view";

export const metadata: Metadata = {
  title: "Edit company profile",
  description: "Complete your company page on Fingrid Connect.",
  alternates: { canonical: "/connect/company/edit" },
};

export default function ConnectCompanyEditPage() {
  return <CompanyProfileWizardView />;
}
