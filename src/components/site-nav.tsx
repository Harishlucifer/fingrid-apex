"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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

const TRIGGER =
  "rounded-lg bg-transparent px-[9px] py-[9px] text-sm font-medium text-n500 hover:bg-n100 hover:text-navy-900 data-[state=open]:bg-n100 data-[state=open]:text-navy-900 focus:bg-n100 focus:text-navy-900";

const PANEL_LINK =
  "block rounded-lg px-2.5 py-2 text-sm text-n700 hover:bg-n100 hover:text-navy-900";

const GROUP_HEADING =
  "px-2.5 pb-1 pt-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-n400";

function PanelLinks({ links }: { links: TNavLink[] }) {
  return (
    <>
      {links.map((l) => (
        <div key={l.href}>
          {l.heading ? <div className={GROUP_HEADING}>{l.heading}</div> : null}
          <NavigationMenuLink asChild>
            <Link href={l.href} className={PANEL_LINK}>
              {l.label}
            </Link>
          </NavigationMenuLink>
        </div>
      ))}
    </>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  if (item.kind === "link") {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href={item.href} className={TRIGGER}>
            {item.label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  if (item.kind === "mega") {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className={TRIGGER}>
          {item.label}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid w-[min(88vw,940px)] grid-cols-4 gap-x-[18px] gap-y-1.5 p-3.5">
            {item.columns.map((col) => (
              <div key={col.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={col.href}
                    className={cn(
                      PANEL_LINK,
                      "text-navy-900 hover:text-navy-900 font-semibold",
                    )}
                  >
                    {col.label}
                  </Link>
                </NavigationMenuLink>
                {col.links.map((l) => (
                  <NavigationMenuLink asChild key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(PANEL_LINK, "px-2.5 py-1.5 text-[13.5px]")}
                    >
                      {l.label}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={TRIGGER}>
        {item.label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[min(92vw,300px)] gap-0.5 p-3.5">
          <PanelLinks links={item.links} />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MobileNav() {
  const { mobileOpen, setMobileOpen, openSection, setOpenSection, close } =
    useNavStore();
  const pathname = usePathname();

  // Route changes come from tapping a link inside the drawer; dismiss it.
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button
          variant="fgGhost"
          className="text-n700 h-auto rounded-lg px-3 py-2 text-[13px] font-semibold xl:hidden"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(92vw,380px)] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2.5">
            <LogoMark />
            <Wordmark className="text-base" />
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-8">
          <Accordion
            type="single"
            collapsible
            value={openSection}
            onValueChange={setOpenSection}
          >
            {NAV.map((item) => {
              if (item.kind === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-navy-900 flex py-3.5 text-[15px] font-semibold"
                  >
                    {item.label}
                  </Link>
                );
              }

              const groups: {
                label: string;
                href?: string;
                links: TNavLink[];
              }[] =
                item.kind === "mega"
                  ? item.columns.map((c) => ({
                      label: c.label,
                      href: c.href,
                      links: c.links,
                    }))
                  : [{ label: "", links: item.links }];

              return (
                <AccordionItem key={item.label} value={item.label}>
                  <AccordionTrigger className="text-navy-900 text-[15px] font-semibold">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-1 pb-2">
                      {groups.map((g, gi) => (
                        <div key={g.label || gi}>
                          {g.href ? (
                            <Link
                              href={g.href}
                              className="text-navy-900 block py-1.5 text-sm font-semibold"
                            >
                              {g.label}
                            </Link>
                          ) : null}
                          {g.links.map((l) => (
                            <div key={l.href}>
                              {l.heading ? (
                                <div className="text-n400 pt-2 pb-0.5 font-mono text-[10.5px] font-semibold tracking-[0.14em] uppercase">
                                  {l.heading}
                                </div>
                              ) : null}
                              <Link
                                href={l.href}
                                className="text-n700 block py-1.5 pl-3 text-sm"
                              >
                                {l.label}
                              </Link>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mt-6 grid gap-2.5">
            <Button asChild size="cta" variant="fgPrimary">
              <Link href="/pricing#demo">
                Book a demo
                <em aria-hidden="true" className="text-mint not-italic">
                  →
                </em>
              </Link>
            </Button>
            <Button asChild size="cta" variant="fgGhost">
              <Link href="/pricing">Sign in</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SiteNav() {
  return (
    <header className="border-n200 bg-n50/85 sticky top-0 z-50 border-b backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-(--container-nav) items-center justify-between gap-3 px-[clamp(16px,2.5vw,32px)] py-3">
        <Link href="/" className="flex shrink-0 items-center gap-[11px]">
          <LogoMark />
          <Wordmark />
        </Link>

        <NavigationMenu className="hidden max-w-none xl:flex" delayDuration={0}>
          <NavigationMenuList className="gap-0">
            {NAV.map((item) => (
              <DesktopItem key={item.label} item={item} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/pricing"
            className="text-n700 hover:text-navy-900 hidden px-[9px] py-[9px] text-sm font-medium xl:inline-block"
          >
            Sign in
          </Link>
          <Button
            asChild
            size="cta"
            variant="fgPrimary"
            className="hidden px-4 py-2.5 text-sm xl:inline-flex"
          >
            <Link href="/pricing#demo">
              Book a demo
              <em aria-hidden="true" className="text-mint not-italic">
                →
              </em>
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
