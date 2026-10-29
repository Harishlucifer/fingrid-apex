import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { Crumbs, Hero } from "@/components/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing access to and use of the Fingrid.ai website, applications, APIs and AI-powered services.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  return (
    <>
      <Crumbs items={[["Terms of Use"]]} />
      <Hero
        eyebrow="Legal"
        title="Terms of Use"
        lede="The terms that govern access to and use of the Fingrid.ai website, applications, APIs, AI-powered features and related services operated by Inforvio Technologies."
        ctas={[]}
      />
      <LegalDocument file="terms-of-use.md" />
    </>
  );
}
