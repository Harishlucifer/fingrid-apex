"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Page control for the Connect list views. Renders nothing for a single page, so a list that
// fits never grows a redundant footer.
//
// Two callers: server-paged lists (directory, requirements — the API takes page/limit and
// returns pagination.total) and client-paged ones (matches, requests, partners — those
// endpoints return the full set, so `usePaged` slices it locally).
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Window of page numbers around the current one, with the first/last always reachable.
  const pages: (number | "gap")[] = [];
  const push = (n: number) => !pages.includes(n) && pages.push(n);
  push(1);
  if (page - 2 > 2) pages.push("gap");
  for (let n = Math.max(2, page - 1); n <= Math.min(pageCount - 1, page + 1); n++) push(n);
  if (page + 2 < pageCount - 1) pages.push("gap");
  if (pageCount > 1) push(pageCount);

  const btn =
    "grid size-8 shrink-0 place-items-center rounded-lg border text-[12.5px] font-semibold transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "border-n100 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3.5",
        className,
      )}
    >
      <span className="text-n500 text-[11.5px]">
        Showing <b className="text-navy-900 font-semibold">{from}</b>–
        <b className="text-navy-900 font-semibold">{to}</b> of{" "}
        <b className="text-navy-900 font-semibold">{total}</b>
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(btn, "border-n200 text-n700 hover:bg-n50 disabled:opacity-40 disabled:hover:bg-transparent")}
        >
          <ChevronLeft size={15} strokeWidth={2.2} />
        </button>

        {pages.map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} className="text-n400 px-1 text-[12px]">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-current={n === page ? "page" : undefined}
              onClick={() => onPageChange(n)}
              className={cn(
                btn,
                n === page
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-n200 text-n700 hover:bg-n50",
              )}
            >
              {n}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={cn(btn, "border-n200 text-n700 hover:bg-n50 disabled:opacity-40 disabled:hover:bg-transparent")}
        >
          <ChevronRight size={15} strokeWidth={2.2} />
        </button>
      </div>
    </nav>
  );
}
