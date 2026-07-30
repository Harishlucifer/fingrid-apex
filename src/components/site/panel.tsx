import { cn } from "@/lib/utils";

/** White bordered panel used for deep-dive prose sections. */
export function Panel({
  id,
  title,
  note,
  children,
}: {
  id?: string;
  title: React.ReactNode;
  /** Small uppercase label above the heading. */
  note?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 pt-1.5 pb-[clamp(30px,4.6vw,52px)]"
    >
      <div className="wrap">
        <div className="rounded-[22px] border border-n200/90 bg-white p-[clamp(24px,3.5vw,38px)] shadow-[0_8px_30px_rgb(1_39_86_/_0.045)]">
          {note ? (
            <div className="text-n400 font-mono text-[11px] tracking-[0.1em] uppercase">
              {note}
            </div>
          ) : null}
          <h3 className="font-display mb-2 text-[23px] font-semibold tracking-[-0.025em]">
            {title}
          </h3>
          <div className="[&>p]:mb-1.5 [&>p]:max-w-[76ch] [&>p]:text-[15px] [&>p]:leading-[1.7] [&>p]:text-n500">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Square-marker bullet list. `alt` switches the marker from mint to blue,
 * alternating down a page of panels.
 */
export function Bullets({
  alt = false,
  children,
}: {
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ul
      className={cn(
        "mt-3 grid list-none gap-[9px] p-0",
        "[&>li]:text-n700 [&>li]:relative [&>li]:pl-[22px] [&>li]:text-[14.5px]",
        "[&>li]:before:absolute [&>li]:before:top-[7px] [&>li]:before:left-0 [&>li]:before:size-2 [&>li]:before:rounded-[2px] [&>li]:before:content-['']",
        alt ? "[&>li]:before:bg-blue-500" : "[&>li]:before:bg-mint",
      )}
    >
      {children}
    </ul>
  );
}
