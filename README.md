# Fingrid.ai website

The Fingrid.ai marketing site — 75 pages covering products, module stacks,
solutions, the partner network, platform and AI positioning.

## Stack

| Concern      | Choice                             |
| ------------ | ---------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack) |
| Language     | TypeScript (strict)                |
| Styling      | Tailwind CSS v4                    |
| Components   | shadcn/ui (Radix primitives)       |
| Client state | Zustand                            |
| Server state | TanStack Query                     |
| Forms        | react-hook-form + Zod              |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all 75 pages prerendered)
npx tsc --noEmit   # typecheck
npx eslint src     # lint
npx prettier --write "src/**/*.{ts,tsx}"
```

## How pages work

Every page is a normal App Router route with its own file, its own `metadata`
export, and its own markup:

```
src/app/products/lenderos/page.tsx            ->  /products/lenderos
src/app/modules/lms/fldg-management/page.tsx  ->  /modules/lms/fldg-management
```

Page files hold the copy and the structure; the design system lives in
`src/components/site/`. A typical page reads:

```tsx
export const metadata: Metadata = { title: "LenderOS", description: "…" };

export default function ProductsLenderosPage() {
  return (
    <>
      <Crumbs items={[["Products", "/products"], ["LenderOS"]]} />
      <Hero
        eyebrow="LenderOS"
        title={
          <>
            The complete operating system for <Grad>regulated lenders.</Grad>
          </>
        }
        lede="…"
        stats={[["8/8", "Module stacks included"]]}
      />
      <CardsSection
        eyebrow="What's inside"
        title="All eight stacks, wired together"
      >
        <Card href="/modules/origination" title="Origination">
          File login, CAM, verification, FI-PD…
        </Card>
      </CardsSection>
      <Related links={[["BcOS", "/products/bcos"]]} />
      <ClosingCta />
    </>
  );
}
```

To change wording on a page, edit that page's file. To change how a card or a
panel looks everywhere, edit the component in `src/components/site/`.

## Layout

```
src/
  app/
    layout.tsx              root layout: fonts, nav, footer, providers
    page.tsx                /
    <segment>/page.tsx      one file per route (75 total)
    api/demo-request/       demo form endpoint
    sitemap.ts              built from src/lib/routes.ts
    not-found.tsx
  components/
    site/                   the design system: Hero, Card, Panel, Band, …
    ui/                     shadcn primitives
    brand/logo-mark.tsx     the Fingrid 3x3 mark and wordmark
    site-nav.tsx            sticky nav: mega-menu + mobile drawer
    site-footer.tsx
    demo-form.tsx           TanStack Query mutation
    deployment-table.tsx    pricing page only
  lib/
    nav.ts                  nav + footer information architecture
    routes.ts               every route, for the sitemap
    demo-request.ts         Zod schema + fetch wrapper
  stores/                   Zustand stores
```

## Design system

The Fingrid Design System v1.0 tokens live in `src/app/globals.css` under
`@theme`: brand colours (`navy-900`, `blue-500`, `mint`), the `n50`–`n950`
neutral ramp, the three typefaces (Space Grotesk display, IBM Plex Sans body,
JetBrains Mono for numerals and eyebrows), and the `wrap` / `text-grad`
utilities. shadcn's semantic tokens (`--primary`, `--muted`, …) are mapped onto
the same palette so its primitives look native.

The source design system is light-only, so no dark variants are defined.

## Notes

- Legacy `.html` URLs from the previous static site redirect (308) to their
  clean equivalents — see `next.config.ts`.
- `POST /api/demo-request` validates and acknowledges with a reference; wiring
  it to a CRM or mailer is a deployment step.
- One deliberate copy change: the pricing page's `#demo` anchor is now a working
  form rather than a "write to us" panel. The original guidance is kept beside
  it.
