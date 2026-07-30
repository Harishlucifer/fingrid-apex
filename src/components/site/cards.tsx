import Link from "next/link";
import { CardDots } from "@/components/brand/logo-mark";
import { SectionHeader } from "./cta";
import { cn } from "@/lib/utils";

const SHELL =
  "group/card relative flex min-h-[220px] flex-col gap-3 overflow-hidden rounded-[22px] border border-n200/90 bg-white p-[clamp(22px,2.6vw,28px)] shadow-[0_4px_18px_rgb(1_39_86_/_0.035)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-500/35 before:to-transparent";

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
      <span className="mb-2 grid size-10 place-items-center rounded-[13px] border border-blue-500/10 bg-[linear-gradient(145deg,#F2F7FF,#F4FFF9)]">
        <CardDots />
      </span>
      {tag ? (
        <span className="absolute top-6 right-6 rounded-full bg-n100 px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.08em] text-n500">
          {tag}
        </span>
      ) : null}
      <h3 className="font-display text-[20px] font-semibold tracking-[-0.025em] text-navy-900">
        {title}
      </h3>
      <p className="text-sm leading-[1.62] text-n500">{children}</p>
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
        "transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/25 hover:shadow-[0_22px_48px_rgb(1_39_86_/_0.11)]",
      )}
    >
      {body}
      <span className="mt-auto flex items-center gap-2 pt-2 text-[13px] font-semibold text-blue-600">
        Explore
        <span
          aria-hidden="true"
          className="grid size-6 place-items-center rounded-full bg-blue-500/10 transition-transform duration-300 group-hover/card:translate-x-1"
        >
          →
        </span>
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
    <section className="py-[clamp(42px,6vw,72px)]">
      <div className="wrap">
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} />
        <div className="mt-9 grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-4 xl:gap-5">
          {children}
        </div>
      </div>
    </section>
  );
}
