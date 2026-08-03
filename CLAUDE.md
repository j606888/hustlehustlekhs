# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server at localhost:3000
yarn build      # production build (runs TypeScript + ESLint)
yarn lint       # ESLint
```

No test suite is configured. Package manager is **yarn**; Node version is pinned in `.nvmrc` (v20.9.0).

## Architecture

Next.js 15 App Router site for **HustleHustle KHS**, a Hustle (social partner dance)
community/studio in **Kaohsiung**, Taiwan. All content — schedule dates, teacher bios,
pricing, the venue address — lives in **static TS data files**. There is no CMS, no database,
and no API routes. "Editing the site" means editing a TypeScript file.

The site was derived from the `bailamore-web` project, so the structure will look familiar,
but it has been reduced to a single venue and single dance style.

**Pages (`src/app/`):**
- `/` — home page composed of Hero, WhoWeAre, Testimonials, FAQ
- `/courses?tab=schedule|pricing|introduction` — tab-based layout; tab state is synced with
  the URL query param via `useSearchParams`
- `/teachers` — static teacher card grid (first teacher by `sortOrder` gets a wide banner card)
- `/teachers/[slug]` — teacher detail, statically generated (`dynamicParams = false`)
- `/location` — **the single venue's detail page**. There is no `/location/[city]`; if a
  second venue is ever added, this page becomes a list and per-venue subpages get added back
  (see the comments in `src/data/venues.ts` and `venueJsonLd()`).

**Key data locations:**
- Venue/address: `src/data/venues.ts` — **single source of truth for the address**. Never
  hardcode an address anywhere else; inconsistent NAP hurts local search ranking.
  `PRIMARY_VENUE` is the convenience export for the single-venue case.
- Course dates, tracks, pricing: `src/components/courses/schedule/data.ts`
  (`TRACKS`, `MONTH`, `PRICE_PLANS`, `THEMES`). A track's venue is `venueSlug`, resolved via
  `getVenue()`. `Track.sessionLabelEn` must be an English weekday — `jsonLd.ts` parses it to
  build `OpeningHoursSpecification`.
- Teacher data: `src/data/teachers.ts`
- FAQ: `src/data/faq.ts` · Testimonials: `src/data/testimonials.ts`
- Site identity (URL, name, default description): `src/constants/site.ts`
- External links (Instagram DM / LINE): `src/constants/links.ts`
- Hero media: `src/data/site.ts` (`HERO_MEDIA`) — both fields empty renders a placeholder block

**SEO:**
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- `src/lib/jsonLd.ts` builds schema.org structured data; render it with `<JsonLd data={...} />`
  (`src/components/JsonLd.tsx`). Organization is in the root layout, `/location` carries a
  `LocalBusiness`, the home page a `FAQPage`, teacher pages a `Person`.
- Every page sets `alternates.canonical`.

**UI conventions:**
- Styling: Tailwind CSS v4, mobile-first with `md:` breakpoints
- **Brand color: use `text-brand` / `bg-brand` / `border-brand`, never a hardcoded Tailwind
  color scale.** The single source is `--brand` in `src/app/globals.css`; `--primary` and
  `--ring` both point at it. `src/app/icon.svg` and `public/logo.svg` hardcode the hex
  (`#009689`) because SVG cannot read CSS variables — keep them in sync manually when the
  brand color changes.
  Note the schedule/introduction cards (`THEMES` in `schedule/data.ts` and `Introduction.tsx`)
  deliberately use their own hardcoded palette: they need several mutually-distinguishable
  colors, which is a different job from the brand color.
- Fonts: Poppins (`font-poppins`) and Roboto, loaded via `next/font/google` in `layout.tsx`
- UI primitives: shadcn/ui (`src/components/ui/`) backed by Radix UI
- Icons: SVGs in `public/icons/`, lucide-react for inline icons
- Analytics: `@vercel/analytics` injected in root layout
- Missing images point at `/placeholder.svg` rather than a broken path

All `page.tsx` files are Server Components (important for crawlability); only leaf interactive
components (`Navbar`, `FAQ`, `Testimonials`, `TrackCard`, `Introduction`, the courses tab shell)
use `'use client'`. Vercel is the deployment target.

## Current state: placeholder content

**Everything user-facing is placeholder copy.** Search `TODO` across `src/` for the full list;
`docs/content-guide.md` is the non-engineer-facing version of the same list. Notably still unset:
the real domain (`SITE_URL`), the Instagram handle, the venue address and coordinates, the real
schedule and prices, teacher bios and photos, and the logo.
