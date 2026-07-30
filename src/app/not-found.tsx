import Link from "next/link";
import { CtaRow, Eyebrow } from "@/components/site";

export default function NotFound() {
  return (
    <section className="pt-[clamp(44px,7vw,84px)] pb-[clamp(44px,7vw,84px)]">
      <div className="wrap">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display mt-4 max-w-[22ch] text-[clamp(34px,5.4vw,60px)] leading-[1.02] font-bold tracking-[-0.03em]">
          That page isn't on the <span className="text-grad">fabric.</span>
        </h1>
        <p className="text-n500 mt-5 max-w-[62ch] text-[clamp(16.5px,1.8vw,19.5px)] leading-[1.55]">
          The link may be out of date. Start from the products overview, or the
          module stacks, and you'll find your way.
        </p>
        <CtaRow
          className="mt-[30px]"
          ctas={[
            {
              label: "All products",
              href: "/products",
              variant: "primary",
              arrow: true,
            },
            {
              label: "Module stacks",
              href: "/modules/origination",
              variant: "ghost",
            },
          ]}
        />
        <p className="text-n400 mt-8 text-sm">
          Or head back to the{" "}
          <Link
            href="/"
            className="font-semibold text-blue-500 hover:underline"
          >
            home page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
