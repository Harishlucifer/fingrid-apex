import Link from "next/link";
import { CtaRow, Eyebrow } from "./cta";
import { cn } from "@/lib/utils";
import type { CrumbTuple, Cta, StatTuple } from "./types";

/** Gradient phrase inside a headline. */
export function Grad({ children }: { children: React.ReactNode }) {
  return <span className="text-grad">{children}</span>;
}

export function Crumbs({ items }: { items: readonly CrumbTuple[] }) {
  return (
    <div className="wrap">
      <nav
        aria-label="Breadcrumb"
        className="text-n400 flex flex-wrap items-center gap-1.5 pt-[22px] text-[13px]"
      >
        <Link href="/" className="text-n500 hover:text-blue-500">
          Home
        </Link>
        {items.map(([label, href]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span aria-hidden="true">·</span>
            {href ? (
              <Link href={href} className="text-n500 hover:text-blue-500">
                {label}
              </Link>
            ) : (
              <span aria-current="page">{label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}

const DEFAULT_CTAS: Cta[] = [
  {
    label: "Book a demo",
    href: "/pricing#demo",
    variant: "primary",
    arrow: true,
  },
  { label: "Explore modules", href: "/modules/origination", variant: "ghost" },
];

export function Hero({
  pill,
  eyebrow,
  title,
  lede,
  ctas = DEFAULT_CTAS,
  stats,
  home = false,
}: {
  pill?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  ctas?: readonly Cta[];
  stats?: readonly StatTuple[];
  /** Larger type treatment, home page only. */
  home?: boolean;
}) {
  return (
    <header className="pt-[clamp(44px,7vw,84px)] pb-[clamp(24px,4vw,40px)]">
      <div className="wrap">
        {pill ? (
          <div className="text-n700 inline-flex items-center gap-[9px] rounded-full border border-[#D6DCEA] bg-white px-3.5 py-[7px] text-[13px] font-medium shadow-[0_1px_2px_rgb(1_39_86_/_0.05)]">
            <i
              aria-hidden="true"
              className="animate-fg-pulse bg-mint size-[7px] rounded-full not-italic"
            />
            {pill}
          </div>
        ) : null}

        {eyebrow ? (
          <Eyebrow className={pill ? "mt-[18px]" : undefined}>
            {eyebrow}
          </Eyebrow>
        ) : null}

        {/*
          Font size must precede leading in the class list: tailwind-merge
          treats `text-[…]` as a font-size utility that also carries
          line-height, so a leading-* written earlier gets dropped.
        */}
        <h1
          className={cn(
            "font-display mt-4 font-bold tracking-[-0.03em]",
            home
              ? "max-w-[17ch] text-[clamp(40px,6.6vw,76px)] leading-[1.02]"
              : "max-w-[22ch] text-[clamp(34px,5.4vw,60px)] leading-[1.02]",
          )}
        >
          {title}
        </h1>

        <p className="text-n500 mt-5 max-w-[62ch] text-[clamp(16.5px,1.8vw,19.5px)] leading-[1.55]">
          {lede}
        </p>

        <CtaRow ctas={ctas} className="mt-[30px]" />

        {stats?.length ? <Stats items={stats} /> : null}
      </div>
    </header>
  );
}

/** Hero stat row, with the hairline separators from the source design. */
function Stats({ items }: { items: readonly StatTuple[] }) {
  return (
    <dl className="mt-[42px] flex flex-wrap items-stretch gap-[30px]">
      {items.map(([num, label], i) => (
        <div key={label} className="flex items-stretch gap-[30px]">
          {i > 0 ? (
            <div aria-hidden="true" className="bg-n200 w-px shrink-0" />
          ) : null}
          <div>
            <dt className="text-navy-900 font-mono text-[28px] leading-tight font-semibold">
              {num}
            </dt>
            <dd className="text-n400 mt-0.5 text-[13px]">{label}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
