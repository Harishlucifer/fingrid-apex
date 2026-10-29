import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { Crumbs, Hero } from "@/components/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Inforvio Technologies collects, uses, discloses, stores and protects personal data processed through Fingrid.ai.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Crumbs items={[["Privacy Policy"]]} />
      <Hero
        eyebrow="Legal"
        title="Privacy Policy"
        lede="What information we collect, why we collect it, how we use and disclose it, where it may be processed, how long it may be retained, and how to contact us about your personal data."
        ctas={[]}
      />
      <LegalDocument file="privacy-policy.md" />
    </>
  );
}
