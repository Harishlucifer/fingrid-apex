import Link from "next/link";
import { CardDots } from "@/components/brand/logo-mark";
import { SectionHeader } from "./cta";
import { cn } from "@/lib/utils";

const SHELL =
  "relative flex flex-col gap-[9px] rounded-xl border border-n200 bg-white p-6 shadow-[0_2px_4px_rgb(1_39_86_/_0.03)]";

/**
 * A card in a CardGrid. Renders as a link when `href` is given, otherwise as a
 * static tile (used for planned/unreleased items).
 */
export function Card({
  href,
  title,
  tag,
  children,
}: {
  href?: string;
  title: string;
  tag?: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <CardDots />
      {tag ? (
        <span className="text-n400 absolute top-5 right-5 font-mono text-[10.5px] tracking-[0.1em]">
          {tag}
        </span>
      ) : null}
      <h3 className="font-display text-navy-900 text-[18.5px] font-semibold tracking-[-0.015em]">
        {title}
      </h3>
      <p className="text-n500 text-sm leading-[1.5]">{children}</p>
    </>
  );

  if (!href) {
    return <div className={SHELL}>{body}</div>;
  }

  return (
    <Link
      href={href}
      className={cn(
        SHELL,
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgb(1_39_86_/_0.10)]",
      )}
    >
      {body}
      <span className="mt-auto pt-2 text-[13.5px] font-semibold text-blue-500">
        Explore →
      </span>
    </Link>
  );
}

/** A titled section wrapping a responsive grid of Cards. */
export function CardsSection({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-[clamp(30px,4.6vw,52px)]">
      <div className="wrap">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-[18px]">
          {children}
        </div>
      </div>
    </section>
  );
}
