export type CtaVariant = "primary" | "ghost" | "mint" | "blue";

export interface Cta {
  label: string;
  href: string;
  variant?: CtaVariant;
  /** Trailing mint arrow, used on primary calls to action. */
  arrow?: boolean;
}

/** `[value, label]` — e.g. `["40+", "Lending modules"]`. */
export type StatTuple = readonly [string, string];

/** `[label, href]`. */
export type LinkTuple = readonly [string, string];

/** `[label, href?]` — href omitted on the current page. */
export type CrumbTuple = readonly [string] | readonly [string, string];
