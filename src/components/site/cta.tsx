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
        "text-success font-mono text-[12.5px] font-semibold tracking-[0.16em] uppercase",
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
    <div>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display mt-3 mb-1.5 text-[clamp(25px,3.4vw,38px)] leading-[1.1] font-bold tracking-[-0.028em]">
        {title}
      </h2>
      {intro ? (
        <p className="text-n500 max-w-[64ch] text-[15.5px]">{intro}</p>
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
    <section className="mt-[clamp(36px,6vw,64px)]">
      <div className="wrap">
        <div className="border-n200 flex flex-wrap items-center justify-between gap-5 rounded-2xl border bg-[linear-gradient(120deg,#fff,#F0F6FF)] p-[clamp(28px,4vw,44px)]">
          <div>
            <h2 className="font-display text-[clamp(22px,3vw,32px)] font-bold tracking-[-0.025em]">
              {title}
            </h2>
            <p className="text-n500 mt-1.5 max-w-[52ch] text-[15px]">{body}</p>
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
