import Link from "next/link";
import { CtaRow, Eyebrow } from "./cta";
import type { Cta, LinkTuple, StatTuple } from "./types";

/** Full-bleed feature section with a light mint/blue radial wash. */
export function Band({
  eyebrow,
  title,
  ctas,
  mini,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  ctas?: readonly Cta[];
  /** Small stat trio beneath the copy. */
  mini?: readonly StatTuple[];
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-y border-blue-500/10 bg-[linear-gradient(115deg,#F4F8FF,#F3FFF9)]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2 bg-[radial-gradient(700px_380px_at_82%_8%,rgb(50_234_148_/_0.16),transparent_60%),radial-gradient(680px_400px_at_8%_100%,rgb(49_133_255_/_0.12),transparent_55%)]"
      />
      <div className="wrap relative grid items-center gap-10 py-[clamp(52px,7vw,84px)] lg:grid-cols-[1fr_.7fr]">
        <div>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="font-display text-navy-900 mt-3 text-[clamp(30px,4vw,48px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
            {title}
          </h2>
          <p className="text-n500 mt-4 max-w-[62ch] text-[16px] leading-[1.7]">
            {children}
          </p>
          <CtaRow ctas={ctas} className="mt-7" />
        </div>
        {mini?.length ? (
          <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {mini.map(([num, label], index) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-white bg-white/75 p-4 shadow-[0_10px_30px_rgb(1_39_86_/_0.06)] backdrop-blur-sm"
              >
                <dt className="bg-navy-900 font-display grid size-11 shrink-0 place-items-center rounded-xl text-[19px] font-bold text-white">
                  {num}
                </dt>
                <dd className="text-n700 text-[13px] font-medium">{label}</dd>
                <span className="text-n300 ml-auto font-mono text-[10px]">
                  0{index + 1}
                </span>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}

/** Pill links to sibling pages. */
export function Related({ links }: { links: readonly LinkTuple[] }) {
  return (
    <section className="pt-2 pb-[clamp(30px,4.6vw,52px)]">
      <div className="wrap">
        <Eyebrow>Related</Eyebrow>
        <nav
          aria-label="Related pages"
          className="mt-3.5 flex flex-wrap gap-2.5"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="border-n200 text-n700 rounded-full border bg-white px-[15px] py-2 text-[13.5px] font-semibold transition-colors hover:border-blue-500 hover:text-blue-500"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
