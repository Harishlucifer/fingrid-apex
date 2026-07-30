import Link from "next/link";
import { CtaRow, Eyebrow } from "./cta";
import type { Cta, LinkTuple, StatTuple } from "./types";

/** Full-bleed navy section with a mint/blue radial wash. */
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
    <section className="bg-navy-900 relative mt-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(700px_380px_at_82%_8%,rgb(50_234_148_/_0.14),transparent_60%),radial-gradient(680px_400px_at_6%_100%,rgb(49_133_255_/_0.22),transparent_55%)]"
      />
      <div className="wrap relative py-[clamp(44px,6vw,72px)]">
        {eyebrow ? <Eyebrow className="text-mint">{eyebrow}</Eyebrow> : null}
        <h2 className="font-display mt-3 mb-2 text-[clamp(27px,3.8vw,44px)] leading-[1.1] font-bold tracking-[-0.028em] text-white">
          {title}
        </h2>
        <p className="text-band-body max-w-[60ch] text-base">{children}</p>
        <CtaRow ctas={ctas} className="mt-6" />
        {mini?.length ? (
          <dl className="mt-8 flex flex-wrap gap-x-[26px] gap-y-4">
            {mini.map(([num, label]) => (
              <div key={label}>
                <dt className="font-mono text-[22px] font-semibold text-white">
                  {num}
                </dt>
                <dd className="text-band-muted text-[12.5px]">{label}</dd>
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
