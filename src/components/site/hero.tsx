import Image from "next/image";
import { CtaRow, Eyebrow } from "./cta";
import { cn } from "@/lib/utils";
import type { CrumbTuple, Cta, StatTuple } from "./types";

/** Gradient phrase inside a headline. */
export function Grad({ children }: { children: React.ReactNode }) {
  return <span className="text-grad">{children}</span>;
}

export function Crumbs({ items: _items }: { items: readonly CrumbTuple[] }) {
  return null;
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
    <header
      className={cn(
        "relative overflow-hidden",
        home
          ? "py-[clamp(36px,6vw,64px)] lg:flex lg:min-h-[calc(100svh-68px)] lg:items-center lg:py-[clamp(24px,4.5vh,48px)]"
          : "pt-[clamp(48px,7vw,88px)] pb-[clamp(34px,5vw,58px)]",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-[760px] w-full max-w-[1440px] bg-[radial-gradient(circle_at_16%_10%,rgb(50_234_148_/_0.12),transparent_31%),radial-gradient(circle_at_82%_16%,rgb(49_133_255_/_0.13),transparent_34%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-[620px] w-full max-w-[1440px] [background-image:linear-gradient(rgb(49_133_255_/_0.1)_1px,transparent_1px),linear-gradient(90deg,rgb(49_133_255_/_0.1)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent_34%,black_72%,transparent_100%)] [background-size:56px_56px] opacity-35"
      />

      <div
        className={cn(
          "wrap",
          home &&
            "grid items-center gap-[clamp(32px,4vw,60px)] lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,.96fr)]",
        )}
      >
        <div>
          {pill ? (
            <div className="text-n700 inline-flex items-center gap-2.5 rounded-full border border-blue-500/15 bg-white/90 px-3.5 py-2 text-[12.5px] font-semibold tracking-[-0.005em] shadow-[0_8px_30px_rgb(1_39_86_/_0.06)] backdrop-blur-sm">
              <i
                aria-hidden="true"
                className="animate-fg-pulse bg-mint size-2 rounded-full not-italic shadow-[0_0_0_4px_rgb(50_234_148_/_0.15)]"
              />
              {pill}
            </div>
          ) : null}

          {eyebrow ? (
            <Eyebrow className={pill ? "mt-6" : undefined}>{eyebrow}</Eyebrow>
          ) : null}

          {/*
            Font size must precede leading in the class list: tailwind-merge
            treats `text-[…]` as a font-size utility that also carries
            line-height, so a leading-* written earlier gets dropped.
          */}
          <h1
            className={cn(
              "font-display mt-4 font-bold tracking-[-0.045em] text-balance",
              home
                ? "max-w-[15ch] text-[clamp(42px,5.2vw,64px)] leading-[1.01]"
                : "max-w-[22ch] text-[clamp(36px,5vw,58px)] leading-[1.03]",
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "text-n500 mt-6 max-w-[62ch] leading-[1.65]",
              home
                ? "mt-5 text-[clamp(16px,1.4vw,17.5px)] leading-[1.6]"
                : "text-[clamp(16px,1.6vw,18px)]",
            )}
          >
            {lede}
          </p>

          <CtaRow ctas={ctas} className={home ? "mt-7" : "mt-8"} />

          {stats?.length ? <Stats items={stats} compact={home} /> : null}
        </div>

        {home ? <HomeProductVisual /> : null}
      </div>
    </header>
  );
}

function HomeProductVisual() {
  return (
    <figure className="relative mx-auto w-full max-w-[540px] lg:mx-0">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[44px] bg-[linear-gradient(135deg,rgb(49_133_255_/_0.16),rgb(50_234_148_/_0.13))] blur-3xl"
      />

      <div className="ring-navy-900/5 relative aspect-[1277/1232] overflow-hidden rounded-[32px] border border-white/90 bg-white/80 shadow-[0_28px_80px_rgb(1_39_86_/_0.14),0_2px_8px_rgb(1_39_86_/_0.05)] ring-1">
        <Image
          src="/hero-lending-fabric.png"
          alt="Connected lending platform with security, workflow, data, mobile and analytics modules"
          fill
          priority
          sizes="(min-width: 1024px) 540px, 90vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="text-navy-900 absolute inset-0 hidden text-[10.5px] font-semibold sm:block"
        >
          <span className="absolute top-[17%] left-[4%] rounded-full border border-white/90 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgb(1_39_86_/_0.1)] backdrop-blur-md">
            Insights
          </span>
          <span className="absolute top-[5%] left-[43%] rounded-full border border-white/90 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgb(1_39_86_/_0.1)] backdrop-blur-md">
            Security
          </span>
          <span className="absolute top-[18%] right-[3%] rounded-full border border-white/90 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgb(1_39_86_/_0.1)] backdrop-blur-md">
            Workflow
          </span>
          <span className="absolute right-[2%] bottom-[35%] rounded-full border border-white/90 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgb(1_39_86_/_0.1)] backdrop-blur-md">
            Portals
          </span>
          <span className="absolute right-[17%] bottom-[7%] rounded-full border border-white/90 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgb(1_39_86_/_0.1)] backdrop-blur-md">
            Analytics
          </span>
          <span className="absolute bottom-[35%] left-[2%] rounded-full border border-white/90 bg-white/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgb(1_39_86_/_0.1)] backdrop-blur-md">
            Data
          </span>
        </div>
      </div>

      <div className="absolute bottom-5 left-3 flex items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-[0_16px_44px_rgb(1_39_86_/_0.14)] backdrop-blur-md sm:-left-4">
        <span className="bg-navy-900 grid size-8 place-items-center rounded-xl">
          <span className="bg-mint size-2.5 rounded-full shadow-[0_0_0_5px_rgb(50_234_148_/_0.14)]" />
        </span>
        <div>
          <div className="font-display text-navy-900 text-[12px] font-semibold">
            One connected platform
          </div>
          <div className="text-n400 mt-0.5 text-[10px]">
            Every lending workflow, working together
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        Fingrid&apos;s connected operating fabric linking lending workflows,
        security, data, mobile experiences and analytics.
      </figcaption>
    </figure>
  );
}

/** Hero stat row, with subtle separators between each measure. */
function Stats({
  items,
  compact = false,
}: {
  items: readonly StatTuple[];
  compact?: boolean;
}) {
  return (
    <dl
      className={cn(
        "flex flex-wrap items-stretch gap-x-6 gap-y-4",
        compact ? "mt-8" : "mt-10",
      )}
    >
      {items.map(([num, label], i) => (
        <div key={label} className="flex items-stretch gap-6">
          {i > 0 ? (
            <div
              aria-hidden="true"
              className="bg-n200 hidden w-px shrink-0 sm:block"
            />
          ) : null}
          <div>
            <dt className="font-display text-navy-900 text-[24px] leading-tight font-bold tracking-[-0.025em]">
              {num}
            </dt>
            <dd className="text-n400 mt-0.5 text-[11.5px]">{label}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
