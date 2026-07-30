import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Cta, CtaVariant } from "./types";

/** Mono uppercase kicker above headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11.5px] font-semibold tracking-[0.15em] text-success uppercase before:h-px before:w-7 before:bg-mint",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Section heading + optional intro paragraph. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
}) {
  if (!title) return null;
  return (
    <div className="grid items-end gap-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,.7fr)] md:gap-10">
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="font-display mt-3 text-[clamp(28px,3.4vw,42px)] leading-[1.08] font-bold text-balance tracking-[-0.038em]">
          {title}
        </h2>
      </div>
      {intro ? (
        <p className="max-w-[58ch] text-[15px] leading-[1.7] text-n500 md:justify-self-end">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

const VARIANT: Record<
  CtaVariant,
  "fgPrimary" | "fgGhost" | "fgMint" | "fgBlue"
> = {
  primary: "fgPrimary",
  ghost: "fgGhost",
  mint: "fgMint",
  blue: "fgBlue",
};

export function CtaButton({ cta }: { cta: Cta }) {
  const variant = cta.variant ?? "primary";
  return (
    <Button asChild size="cta" variant={VARIANT[variant]}>
      <Link href={cta.href}>
        {cta.label}
        {cta.arrow ? (
          <em
            aria-hidden="true"
            className={cn(
              "not-italic",
              variant === "primary" || variant === "blue"
                ? "text-mint"
                : undefined,
            )}
          >
            →
          </em>
        ) : null}
      </Link>
    </Button>
  );
}

export function CtaRow({
  ctas,
  className,
}: {
  ctas?: readonly Cta[];
  className?: string;
}) {
  if (!ctas?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {ctas.map((c) => (
        <CtaButton key={`${c.label}-${c.href}`} cta={c} />
      ))}
    </div>
  );
}

/** Closing demo prompt. Rendered at the foot of most pages. */
export function ClosingCta({
  title = "See it on your own book.",
  body = "A working demo on your products, your hierarchy and your workflows — not a slide deck.",
}: {
  title?: React.ReactNode;
  body?: React.ReactNode;
}) {
  return (
    <section className="mt-[clamp(44px,7vw,78px)]">
      <div className="wrap">
        <div className="relative isolate flex flex-wrap items-center justify-between gap-7 overflow-hidden rounded-[28px] border border-blue-500/15 bg-[linear-gradient(120deg,#FFFFFF_10%,#F2F7FF_58%,#ECFFF6)] p-[clamp(30px,5vw,54px)] shadow-[0_20px_55px_rgb(1_39_86_/_0.08)]">
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-14 -z-10 size-64 rounded-full border-[42px] border-blue-500/5"
          />
          <div>
            <Eyebrow>Built around your business</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(25px,3vw,36px)] font-bold tracking-[-0.035em]">
              {title}
            </h2>
            <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.65] text-n500">
              {body}
            </p>
          </div>
          <CtaRow
            ctas={[
              {
                label: "Book a demo",
                href: "/pricing#demo",
                variant: "primary",
                arrow: true,
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
