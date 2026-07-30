import type { Metadata } from "next";
import { Bullets, Crumbs, Grad, Hero, Panel } from "@/components/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "What we've learned building lending systems — and lending businesses — in India, written down for the ecosystem.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <Crumbs items={[["Resources"]]} />
      <Hero
        eyebrow="Resources"
        title={
          <>
            Lending knowledge, <Grad>shared openly.</Grad>
          </>
        }
        lede="What we've learned building lending systems — and lending businesses — in India, written down for the ecosystem."
      />
      <Panel id="compliance" title="Compliance Center" note="Resource">
        <p>
          Plain-language explainers on the regulatory frameworks Indian lenders
          operate under — and how Fingrid implements them.
        </p>
        <Bullets>
          <li>
            IRAC norms: asset classification, NPA marking and provisioning,
            explained operationally
          </li>
          <li>RBI digital lending guidelines for LSPs, DSAs and lenders</li>
          <li>
            Penal charges after the 2024 circular: what changed in practice
          </li>
          <li>
            FLDG within the regulatory framework: caps, invocation and
            accounting
          </li>
        </Bullets>
      </Panel>
      <Panel id="blog" title="50 Shades of Lending — the blog" note="Blog">
        <p>
          A founder's field notes from three decades around Indian lending —
          family lending business to DSA operations to building a lending OS.
          The stories behind the workflows.
        </p>
        <Bullets alt>
          <li>
            Why every lender's 'standard process' is different, and what that
            means for software
          </li>
          <li>The economics of a DSA business, honestly told</li>
          <li>Co-lending partnerships: where they break and why</li>
        </Bullets>
      </Panel>
      <Panel id="cases" title="Case studies" note="Customers">
        <p>
          How lending businesses run on Fingrid — configuration choices, go-live
          timelines and what changed operationally. Published with customer
          consent as they go live.
        </p>
      </Panel>
      <Panel id="fellowship" title="Fingrid Fellowship" note="Program">
        <p>
          A four-month, build-first program in Coimbatore for engineers and
          product minds who want to work on real fintech systems — three tracks,
          one production codebase.
        </p>
        <Bullets alt>
          <li>
            Full Stack track — Golang and React on production lending systems
          </li>
          <li>
            AI &amp; Data track — Python, LLM pipelines and document
            intelligence
          </li>
          <li>
            Product, Design &amp; Marketing track — shipping the product around
            the code
          </li>
        </Bullets>
      </Panel>
    </>
  );
}
