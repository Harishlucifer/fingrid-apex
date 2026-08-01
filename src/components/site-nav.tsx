"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Menu as MenuIcon,
  Sparkles,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/brand/logo-mark";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV, type NavItem, type NavLink as TNavLink } from "@/lib/nav";
import { useNavStore } from "@/stores/use-nav-store";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = NAV.filter((item) => item.label !== "Pricing");

const MENU_INTRO: Record<string, string> = {
  Products: "Purpose-built operating systems for every lending participant.",
  Solutions: "Configured playbooks for India’s most important asset classes.",
  Network: "One identity and partnership layer across the lending ecosystem.",
  AI: "Auditable agents embedded across lending, configuration and engineering.",
  Platform: "The secure, configurable foundation underneath every Fingrid OS.",
  Resources:
    "Ideas, compliance guidance and stories from modern lending teams.",
};

const TRIGGER =
  "relative h-10 rounded-xl bg-transparent px-3 text-[15px] font-medium text-n500 transition-colors hover:bg-n100 hover:text-navy-900 focus:bg-n100 focus:text-navy-900 data-open:bg-n100 data-open:text-navy-900";

const PANEL_LINK =
  "group/link flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] text-n700 transition-colors hover:bg-n100 hover:text-navy-900";

const GROUP_HEADING =
  "mb-1 px-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-n400";

function isHrefActive(pathname: string, href: string) {
  const route = href.split("#")[0] || "/";
  return (
    pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))
  );
}

function isItemActive(pathname: string, item: NavItem) {
  if (item.kind === "link") return isHrefActive(pathname, item.href);
  if (item.kind === "mega") {
    return item.columns.some(
      (column) =>
        isHrefActive(pathname, column.href) ||
        column.links.some((link) => isHrefActive(pathname, link.href)),
    );
  }
  return item.links.some((link) => isHrefActive(pathname, link.href));
}

function groupLinks(links: TNavLink[]) {
  const groups: { heading: string; links: TNavLink[] }[] = [];

  links.forEach((link) => {
    if (link.heading || groups.length === 0) {
      groups.push({ heading: link.heading ?? "", links: [link] });
    } else {
      groups[groups.length - 1].links.push(link);
    }
  });

  return groups;
}

function ActiveMark({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-3 -bottom-[11px] h-0.5 rounded-full bg-blue-500"
    />
  );
}

function PanelLink({
  link,
  pathname,
  compact = false,
  nowrap = false,
}: {
  link: TNavLink;
  pathname: string;
  compact?: boolean;
  nowrap?: boolean;
}) {
  const active = isHrefActive(pathname, link.href);

  return (
    <NavigationMenuLink asChild>
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          PANEL_LINK,
          compact && "px-2.5 py-2 text-[14.5px]",
          nowrap && "whitespace-nowrap",
          active && "bg-blue-500/8 font-semibold text-blue-600",
        )}
      >
        <span>{link.label}</span>
        <ChevronRight
          aria-hidden="true"
          className="text-n300 size-3.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:text-blue-500"
        />
      </Link>
    </NavigationMenuLink>
  );
}

function ProductsPanel({
  links,
  pathname,
}: {
  links: TNavLink[];
  pathname: string;
}) {
  const groups = groupLinks(links);

  return (
    <div className="w-[min(94vw,1060px)] p-3">
      <div className="grid gap-3 md:grid-cols-[320px_minmax(0,1fr)]">
        <div className="bg-navy-900 flex min-h-[290px] flex-col overflow-hidden rounded-2xl text-white">
          <div className="relative h-[200px] shrink-0 overflow-hidden">
            <Image
              src="/product-ecosystem-global.png"
              alt=""
              fill
              sizes="320px"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="from-navy-900 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
            />
          </div>
          <div className="flex flex-1 flex-col justify-end p-6 pt-3">
            <p className="font-display text-[22px] leading-tight font-semibold tracking-[-0.03em]">
              One operating fabric.
              <br />
              Every lending role.
            </p>
            <p className="text-band-body mt-3 max-w-[28ch] text-[12.5px] leading-[1.55]">
              Compose the right OS for lenders, BCs, LSPs, DSAs and specialist
              agencies.
            </p>
          </div>
        </div>

        <div className="bg-n50/75 grid gap-2 rounded-2xl p-3 sm:grid-cols-2">
          {groups.map((group) => (
            <div
              key={group.heading || "products"}
              className="rounded-xl bg-white p-1.5"
            >
              {group.heading ? (
                <div className={GROUP_HEADING}>{group.heading}</div>
              ) : null}
              {group.links.map((link) => (
                <PanelLink
                  key={link.href}
                  link={link}
                  pathname={pathname}
                  compact
                  nowrap
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModulesPanel({
  item,
  pathname,
}: {
  item: Extract<NavItem, { kind: "mega" }>;
  pathname: string;
}) {
  return (
    <div className="w-[min(94vw,1080px)] p-3">
      <div className="border-n100 flex items-center justify-between gap-6 border-b px-3 py-3">
        <div>
          <div className="font-display text-navy-900 text-[17px] font-semibold tracking-[-0.02em]">
            The complete lending lifecycle
          </div>
          <p className="text-n400 mt-0.5 text-[12px]">
            Eight connected stacks. Data entered once, carried end to end.
          </p>
        </div>
        <NavigationMenuLink asChild>
          <Link
            href="/modules/origination"
            className="hidden items-center gap-2 rounded-full bg-blue-500/10 px-3 py-2 text-[11.5px] font-semibold text-blue-600 sm:flex"
          >
            Explore modules
            <ArrowRight className="size-3.5" />
          </Link>
        </NavigationMenuLink>
      </div>

      <div className="grid max-h-[min(68vh,610px)] gap-2 overflow-y-auto p-2 sm:grid-cols-2 lg:grid-cols-4">
        {item.columns.map((column, index) => {
          const active =
            isHrefActive(pathname, column.href) ||
            column.links.some((link) => isHrefActive(pathname, link.href));

          return (
            <div
              key={column.href}
              className={cn(
                "bg-n50/70 rounded-2xl border border-transparent p-2.5",
                active && "border-blue-500/15 bg-blue-500/5",
              )}
            >
              <NavigationMenuLink asChild>
                <Link
                  href={column.href}
                  aria-current={
                    isHrefActive(pathname, column.href) ? "page" : undefined
                  }
                  className="font-display text-navy-900 flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[14.5px] font-semibold hover:bg-white"
                >
                  <span className="ring-n200 grid size-6 shrink-0 place-items-center rounded-lg bg-white font-mono text-[9px] text-blue-600 shadow-sm ring-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {column.label}
                </Link>
              </NavigationMenuLink>
              {column.links.length ? (
                <div className="mt-0.5">
                  {column.links.map((link) => (
                    <PanelLink
                      key={link.href}
                      link={link}
                      pathname={pathname}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <p className="text-n400 px-2.5 py-2 text-[11px] leading-[1.45]">
                  Dashboards and reporting across the entire lending book.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StandardPanel({
  item,
  pathname,
}: {
  item: Extract<NavItem, { kind: "menu" }>;
  pathname: string;
}) {
  return (
    <div className="w-[min(92vw,390px)] p-3">
      <div className="rounded-2xl bg-[linear-gradient(125deg,#F2F7FF,#F1FFF8)] px-4 py-4">
        <div className="text-success flex items-center gap-2 text-[10px] font-semibold tracking-[0.12em] uppercase">
          <Sparkles className="size-3.5" />
          Explore {item.label}
        </div>
        <p className="text-n500 mt-2 text-[12px] leading-[1.55]">
          {MENU_INTRO[item.label]}
        </p>
      </div>
      <div className="mt-2 grid gap-0.5">
        {item.links.map((link) => (
          <div key={link.href}>
            {link.heading ? (
              <div className={cn(GROUP_HEADING, "mt-2")}>{link.heading}</div>
            ) : null}
            <PanelLink link={link} pathname={pathname} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isItemActive(pathname, item);
  const viewportAnchored = item.kind === "mega" || item.label === "Products";

  if (item.kind === "link") {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(TRIGGER, active && "text-navy-900 font-semibold")}
          >
            {item.label}
            <ActiveMark active={active} />
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(TRIGGER, active && "text-navy-900 font-semibold")}
      >
        {item.label}
        <ActiveMark active={active} />
      </NavigationMenuTrigger>
      <NavigationMenuContent
        className={cn(
          "border-n200/80 z-50 rounded-[22px] border bg-white shadow-[0_24px_70px_rgb(1_39_86_/_0.16)]",
          !viewportAnchored && "left-1/2 -translate-x-1/2",
        )}
        style={
          viewportAnchored
            ? {
                position: "fixed",
                top: 68,
                left: "50%",
                translate: "-50% 0",
              }
            : undefined
        }
      >
        {item.kind === "mega" ? (
          <ModulesPanel item={item} pathname={pathname} />
        ) : item.label === "Products" ? (
          <ProductsPanel links={item.links} pathname={pathname} />
        ) : (
          <StandardPanel item={item} pathname={pathname} />
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MobileNav() {
  const { mobileOpen, setMobileOpen, openSection, setOpenSection, close } =
    useNavStore();
  const pathname = usePathname();

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button
          variant="fgGhost"
          aria-label="Open navigation menu"
          className="border-n200 text-n700 h-auto rounded-xl px-3.5 py-2.5 text-[14px] font-semibold xl:hidden"
        >
          <MenuIcon className="size-4" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-n200 w-[min(94vw,420px)] gap-0 overflow-y-auto bg-white p-0"
      >
        <SheetHeader className="border-n100 border-b px-5 py-5">
          <SheetTitle className="flex items-center gap-2.5">
            <LogoMark />
            <Wordmark className="text-lg" />
          </SheetTitle>
          <div className="bg-success-bg text-success-ink mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[10.5px] font-semibold">
            <BadgeCheck className="size-3.5" />
            AI-native infrastructure for regulated lending
          </div>
        </SheetHeader>

        <div className="px-5 py-3">
          <Accordion
            type="single"
            collapsible
            value={openSection}
            onValueChange={setOpenSection}
          >
            {NAV.map((item) => {
              const active = isItemActive(pathname, item);

              if (item.kind === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "border-n100 text-navy-900 flex items-center justify-between border-b py-4 text-[15px] font-semibold",
                      active && "text-blue-600",
                    )}
                  >
                    {item.label}
                    <ChevronRight className="text-n300 size-4" />
                  </Link>
                );
              }

              const groups: {
                label: string;
                href?: string;
                links: TNavLink[];
              }[] =
                item.kind === "mega"
                  ? item.columns.map((column) => ({
                      label: column.label,
                      href: column.href,
                      links: column.links,
                    }))
                  : groupLinks(item.links).map((group) => ({
                      label: group.heading,
                      links: group.links,
                    }));

              return (
                <AccordionItem
                  key={item.label}
                  value={item.label}
                  className="border-n100"
                >
                  <AccordionTrigger
                    className={cn(
                      "text-navy-900 py-4 text-[15px] font-semibold",
                      active && "text-blue-600",
                    )}
                  >
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 pb-4">
                      {groups.map((group, groupIndex) => (
                        <div
                          key={group.label || groupIndex}
                          className="bg-n50/80 rounded-xl p-2.5"
                        >
                          {group.href ? (
                            <Link
                              href={group.href}
                              className="text-navy-900 flex items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold"
                            >
                              {group.label}
                              <ArrowRight className="size-3.5 text-blue-500" />
                            </Link>
                          ) : group.label ? (
                            <div className="text-n400 px-2 pt-1 pb-1.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] uppercase">
                              {group.label}
                            </div>
                          ) : null}
                          {group.links.map((link) => {
                            const linkActive = isHrefActive(
                              pathname,
                              link.href,
                            );
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                aria-current={linkActive ? "page" : undefined}
                                className={cn(
                                  "text-n700 flex items-center justify-between rounded-lg px-2 py-2 text-[13.5px]",
                                  linkActive &&
                                    "bg-white font-semibold text-blue-600 shadow-sm",
                                )}
                              >
                                {link.label}
                                <ChevronRight className="text-n300 size-3.5" />
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="border-n100 mt-5 grid gap-2.5 border-t pt-5">
            {/* Entry point into Fingrid Connect — the signed-in partner app zone. */}
            <Button asChild size="cta" variant="fgGhost">
              <Link href="/connect/login">Community</Link>
            </Button>
            <Button asChild size="cta" variant="fgPrimary">
              <Link href="/pricing#demo">
                Book a tailored demo
                <ArrowRight className="text-mint size-4" />
              </Link>
            </Button>
          </div>
          <Link
            href="/company"
            className="text-n400 mt-5 flex items-center justify-center gap-2 py-2 text-[12px] font-medium"
          >
            About Inforvio
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="border-n200/80 sticky top-0 z-50 border-b bg-white/92 shadow-[0_8px_30px_rgb(1_39_86_/_0.045)] backdrop-blur-[18px]">
      <div className="mx-auto flex h-[68px] max-w-(--container-nav) items-center justify-between gap-4 px-[clamp(16px,2.5vw,32px)]">
        <Link href="/" className="flex shrink-0 items-center gap-[11px]">
          <LogoMark />
          <Wordmark />
          <span className="border-n200 text-n400 ml-1 hidden border-l pl-3 text-[9.5px] leading-[1.25] font-medium tracking-[0.04em] 2xl:block">
            LENDING
            <br />
            OPERATING FABRIC
          </span>
        </Link>

        <NavigationMenu
          viewport={false}
          className="hidden max-w-none xl:flex"
          delayDuration={80}
        >
          <NavigationMenuList className="gap-0.5">
            {PRIMARY_NAV.map((item) => (
              <DesktopItem key={item.label} item={item} pathname={pathname} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Entry point into Fingrid Connect — the signed-in partner app zone. */}
          <Button
            asChild
            size="cta"
            variant="ghost"
            className="text-navy-900 hidden rounded-xl px-4 py-2.5 text-[14px] xl:inline-flex"
          >
            <Link href="/connect/login">Community</Link>
          </Button>
          <Button
            asChild
            size="cta"
            variant="fgPrimary"
            className="hidden rounded-xl px-4 py-2.5 text-[14px] xl:inline-flex"
          >
            <Link href="/pricing#demo">
              Book a demo
              <ArrowRight className="text-mint size-4" />
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
