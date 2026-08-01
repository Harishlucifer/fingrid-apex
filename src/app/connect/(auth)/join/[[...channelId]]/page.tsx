import type { Metadata } from "next";
import { OnboardingWizardView } from "./onboarding-wizard-view";

export const metadata: Metadata = {
  title: "Join Fingrid Connect",
  description: "Register your organisation on Fingrid Connect.",
  alternates: { canonical: "/connect/join" },
};

export default function ConnectJoinPage() {
  return <OnboardingWizardView />;
}
