import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, ShieldCheck } from "lucide-react";
import { LogoMark, Wordmark } from "@/components/brand/logo-mark";
import { FOOTER } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="text-band-body bg-navy-900 mt-[clamp(60px,8vw,96px)] border-t border-white/10">
      <div className="border-b border-white/10 bg-[#031F46]">
        <div className="wrap grid gap-10 py-[clamp(42px,5vw,64px)] sm:grid-cols-2 lg:grid-cols-[1.45fr_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">
            <Link
              href="/"
              aria-label="Fingrid.ai home"
              className="inline-flex items-center gap-3"
            >
              <LogoMark onDark />
              <Wordmark onDark className="text-[24px]" />
            </Link>
            <p className="text-band-body mt-5 max-w-[34ch] text-[15px] leading-[1.7]">
              The AI-native operating fabric for regulated lending—modular,
              connected and ready to scale across markets.
            </p>
            <div className="mt-6 grid gap-2.5 text-[13px] font-medium text-white/90">
              <span className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <BadgeCheck className="text-mint size-3.5" />
                </span>
                Compliance-ready by design
              </span>
              <span className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Globe2 className="size-3.5 text-blue-300" />
                </span>
                Built for multi-market operations
              </span>
              <span className="flex items-center gap-2.5">
                <span className="bg-mint/10 ring-mint/20 grid size-7 place-items-center rounded-lg ring-1">
                  <ShieldCheck className="text-mint size-3.5" />
                </span>
                ISO/IEC 27001:2022 Certified
              </span>
            </div>
          </div>

          {FOOTER.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="mb-4 font-mono text-[14px] font-semibold tracking-[0.12em] text-blue-300 uppercase">
                {column.heading}
              </h3>
              <div className="grid gap-1">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-band-body group flex w-fit items-center gap-1.5 py-1.5 text-[15px] transition-colors hover:text-white focus-visible:text-white"
                  >
                    {link.label}
                    <ArrowRight className="text-mint size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </div>

      <div className="wrap text-band-muted flex flex-col gap-3 py-6 text-[15px] sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Inforvio Technologies Pvt. Ltd.</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <span>Privacy-first</span>
          <span>Secure by design</span>
          <span>Compliance-ready</span>
        </div>
      </div>
    </footer>
  );
}
