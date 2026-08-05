"use client";

import { useMemo, useState } from "react";

// Client-side paging for the Connect lists whose endpoints return the whole set with no
// page/limit params (matches, requests, partners). Directory and requirements page on the
// server instead — don't use this for those, it would only paginate one server page.
export function usePaged<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Clamped during render rather than corrected in an effect: deleting the last row on the
  // final page (accepting a request, closing a requirement) would otherwise strand the user on
  // an empty page for a frame, and an effect-based fix trips react-hooks/set-state-in-effect.
  const safePage = Math.min(page, pageCount);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  return { page: safePage, setPage, pageItems, pageSize, total: items.length };
}
