import { cn } from "@/lib/utils";

/**
 * The Fingrid 3x3 mark. Cell colours differ on light and dark surfaces.
 */
export function LogoMark({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const c1 = onDark ? "bg-blue-500" : "bg-navy-800";
  const c2 = "bg-mint";
  const c3 = onDark ? "bg-blue-300" : "bg-blue-500";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 grid-cols-[repeat(3,8px)] grid-rows-[repeat(3,8px)] gap-[2.5px]",
        className,
      )}
    >
      <span className={cn("rounded-[2px]", c1)} />
      <span className={cn("rounded-[2px]", c2)} />
      <span className={cn("rounded-[2px]", c2)} />
      <span className={cn("rounded-[2px]", c1)} />
      <span className={cn("rounded-[2px]", c3)} />
      <span className="rounded-[2px]" />
      <span className={cn("rounded-[2px]", c3)} />
      <span className="rounded-[2px]" />
      <span className="rounded-[2px]" />
    </span>
  );
}

export function Wordmark({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-display text-xl font-bold tracking-[-0.02em]",
        onDark ? "text-white" : "text-navy-900",
        className,
      )}
    >
      Fingrid<b className="font-bold text-blue-500">.ai</b>
    </span>
  );
}

/** The small 3x3 dot cluster that heads every card. */
export function CardDots() {
  return (
    <span
      aria-hidden="true"
      className="mb-1 grid grid-cols-[repeat(3,6px)] grid-rows-[repeat(3,6px)] gap-[2px]"
    >
      <span className="bg-navy-800 rounded-[1.5px]" />
      <span className="bg-mint rounded-[1.5px]" />
      <span className="bg-mint rounded-[1.5px]" />
      <span className="bg-navy-800 rounded-[1.5px]" />
      <span className="rounded-[1.5px] bg-blue-500" />
      <span className="rounded-[1.5px]" />
      <span className="rounded-[1.5px] bg-blue-500" />
      <span className="rounded-[1.5px]" />
      <span className="rounded-[1.5px]" />
    </span>
  );
}
