import type { Metadata } from "next";
import { CompanyProfileView } from "./company-profile-view";

export const metadata: Metadata = {
  title: "Company profile",
  description: "Your company page on Fingrid Connect.",
  alternates: { canonical: "/connect/company" },
};

export default function ConnectCompanyPage() {
  return <CompanyProfileView />;
}
