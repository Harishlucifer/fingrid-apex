import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/logo-mark";
import { FOOTER } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="bg-n950 text-band-muted mt-[clamp(44px,7vw,80px)]">
      <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,40px)] pt-11 pb-[30px]">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="md:col-span-2 lg:col-span-1">
            <span className="flex items-center gap-2.5">
              <LogoMark onDark />
              <Wordmark onDark className="text-base" />
            </span>
            <p className="mt-3 max-w-[30ch] text-[13px] leading-[1.55]">
              The AI-first lending operating system for India's NBFCs, banks,
              BCs, LSPs and DSAs.
            </p>
          </div>

          {FOOTER.map((col) => (
            <div key={col.heading}>
              <h4 className="text-band-head mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">
                {col.heading}
              </h4>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-band-body block py-1 text-[13.5px] hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-[34px] flex flex-wrap justify-between gap-2.5 border-t border-white/10 pt-5 text-[12.5px]">
          <span>
            © 2026 Inforvio Technologies Pvt. Ltd. · Coimbatore, India
          </span>
          <span>Built on the Fingrid Design System v1.0</span>
        </div>
      </div>
    </footer>
  );
}
