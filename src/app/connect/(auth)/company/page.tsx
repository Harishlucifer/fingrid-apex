import type { Metadata } from "next";
import { CompanyProfileWizardView } from "./company-profile-wizard-view";

export const metadata: Metadata = {
  title: "Company profile",
  description: "Complete your company page on Fingrid Connect.",
  alternates: { canonical: "/connect/company" },
};

export default function ConnectCompanyPage() {
  return <CompanyProfileWizardView />;
}
