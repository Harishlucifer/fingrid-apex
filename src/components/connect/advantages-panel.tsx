import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Fingerprint,
  Radar,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark, Wordmark } from "@/components/brand/logo-mark";

// "Advantages of Fingrid Connect". Two looks from one source of truth:
//   card — the right-hand rail on the wizard pages
//   hero — the full-bleed navy half of the full-screen sign-in split
// Deliberately reuses the marketing site's navy band + mint accent language so signing in
// doesn't feel like leaving fingrid.ai.

const ADVANTAGES = [
  {
    icon: Fingerprint,
    title: "One canonical identity",
    body: "Your company is verified once and recognised by every lender on the network — no duplicate onboarding packs.",
  },
  {
    icon: Radar,
    title: "Auto-matched partnerships",
    body: "Publish a requirement and candidates are ranked by fit on geography, scale and product mix.",
  },
  {
    icon: BadgeCheck,
    title: "Verified counterparties",
    body: "Verification tiers, empanelments and regulatory credentials are checked before a page goes live.",
  },
  {
    icon: Layers,
    title: "Connected to the lending fabric",
    body: "Partnerships flow straight into sourcing, origination and payouts across Fingrid's operating systems.",
  },
] as const;

const PROOF = [
  ["1", "Application, many lenders"],
  ["0", "Duplicate onboarding"],
  ["RBI", "Compliance-first"],
] as const;

export function AdvantagesPanel({
  variant = "card",
  className,
}: {
  variant?: "card" | "hero";
  className?: string;
}) {
  if (variant === "hero") return <AdvantagesHero className={className} />;

  return (
    <aside
      aria-label="Advantages of Fingrid Connect"
      className={cn(
        "ring-navy-900/5 overflow-hidden rounded-2xl border border-white shadow-[0_16px_44px_rgb(1_39_86_/_0.09)] ring-1",
        className,
      )}
    >
      <div className="bg-navy-900 relative overflow-hidden px-5 py-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_88%_-10%,rgb(50_234_148_/_0.22),transparent_45%),radial-gradient(circle_at_5%_105%,rgb(49_133_255_/_0.28),transparent_50%)]"
        />
        <div className="relative">
          <div className="text-mint flex items-center gap-2 font-mono text-[9.5px] font-semibold tracking-[0.14em] uppercase">
            <span className="animate-fg-pulse bg-mint size-1.5 rounded-full" />
            Why Fingrid Connect
          </div>
          <h2 className="font-display mt-2 text-[19px] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-white">
            Apply once. Partner everywhere.
          </h2>
          <p className="text-band-body mt-2 text-[12px] leading-[1.55]">
            The partnership marketplace where lenders, DSAs, LSPs and BCs meet on one shared
            identity layer.
          </p>
        </div>
      </div>

      <div className="bg-white p-4">
        <ul className="grid gap-3">
          {ADVANTAGES.map((item) => (
            <li key={item.title} className="flex gap-2.5">
              <span className="ring-n200 mt-[2px] grid size-7 shrink-0 place-items-center rounded-lg bg-blue-500/8 text-blue-600 ring-1">
                <item.icon size={14} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <div className="font-display text-navy-900 text-[12.5px] font-semibold tracking-[-0.01em]">
                  {item.title}
                </div>
                <p className="text-n500 mt-0.5 text-[11.5px] leading-[1.5]">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="border-n100 mt-4 grid grid-cols-3 gap-2 border-t pt-3.5">
          {PROOF.map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-navy-900 text-[17px] leading-none font-bold tracking-[-0.025em]">
                {value}
              </dt>
              <dd className="text-n400 mt-1 text-[10px] leading-[1.3]">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="text-n400 mt-3.5 flex items-center gap-1.5 text-[10.5px]">
          <ShieldCheck size={12} strokeWidth={2.2} className="text-success" />
          ISO/IEC 27001:2022 certified · Indian data residency
        </div>

        <Link
          href="/network/connect"
          className="border-n200 text-navy-900 hover:border-n300 hover:bg-n50 mt-3 flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition-colors"
        >
          How Fingrid Connect works
          <ArrowRight size={14} strokeWidth={2.2} className="text-blue-500" />
        </Link>
      </div>
    </aside>
  );
}

// Full-bleed navy half of the sign-in split. Carries the Fingrid wordmark, because the
// sign-in page has no site header for it to live in.
function AdvantagesHero({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Advantages of Fingrid Connect"
      className={cn(
        "bg-navy-900 relative flex-col justify-between overflow-hidden px-[clamp(24px,2.6vw,40px)] py-[clamp(28px,3.2vw,44px)] text-white",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-5%,rgb(50_234_148_/_0.2),transparent_45%),radial-gradient(circle_at_-5%_100%,rgb(49_133_255_/_0.3),transparent_52%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgb(255_255_255_/_0.14)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.14)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_50%_40%,black,transparent_78%)]"
      />

      <Link href="/" aria-label="Fingrid.ai home" className="relative inline-flex items-center gap-3">
        <LogoMark onDark />
        <Wordmark onDark className="text-[22px]" />
      </Link>

      <div className="relative my-9">
        <div className="text-mint flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          <span className="animate-fg-pulse bg-mint size-1.5 rounded-full" />
          Why Fingrid Connect
        </div>
        <h2 className="font-display mt-3 text-[clamp(26px,2.5vw,34px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance text-white">
          Apply once.
          <br />
          Partner everywhere.
        </h2>
        <p className="text-band-body mt-3.5 text-[13.5px] leading-[1.6]">
          The partnership marketplace where lenders, DSAs, LSPs and BCs meet on one shared identity
          layer.
        </p>

        <ul className="mt-7 grid gap-3.5">
          {ADVANTAGES.map((item) => (
            <li key={item.title} className="flex gap-2.5">
              <span className="text-mint mt-[2px] grid size-7 shrink-0 place-items-center rounded-lg bg-white/8 ring-1 ring-white/12">
                <item.icon size={14} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <div className="font-display text-[13px] font-semibold tracking-[-0.01em] text-white">
                  {item.title}
                </div>
                <p className="text-band-body mt-0.5 text-[12px] leading-[1.5]">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <dl className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          {PROOF.map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-[20px] leading-none font-bold tracking-[-0.025em] text-white">
                {value}
              </dt>
              <dd className="text-band-muted mt-1.5 text-[10.5px] leading-[1.35]">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="text-band-muted mt-4 grid gap-2 text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} strokeWidth={2.2} className="text-mint shrink-0" />
            ISO/IEC 27001:2022 certified · Indian data residency
          </span>
          <Link
            href="/network/connect"
            className="flex w-fit items-center gap-1.5 font-semibold text-white/85 transition-colors hover:text-white"
          >
            How Fingrid Connect works
            <ArrowRight size={12} strokeWidth={2.2} className="text-mint" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
