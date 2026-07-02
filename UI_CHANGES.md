# UI Redesign Changelog

Tracks UI changes made during the redesign phase. All changes are UI/styling only — no existing functionality, API integrations, analytics, or business logic has been modified unless noted.

---

## Changes

### Redesign: People component (filmstrip layout)

File: src/components/people.js

Replaced the card-grid layout with an editorial filmstrip on desktop/tablet (`md:` and up): tall portrait panels (`clamp(520px, 78vh, 780px)`) sitting edge-to-edge in a single row, each `flex: 1 1 0` so they fill the section width evenly, capped at a 1800px max-width and centered so the outer panels keep breathing room from the viewport edge. Alternating panels (odd index) sit `clamp(40px, 6vw, 90px)` lower than the others for a staggered two-level look.

Each panel shows the photo edge-to-edge with no border chrome around the numbers — name/title/bio render directly inside the image over a bottom-anchored dark gradient overlay, the same two-layer `linear-gradient` treatment used in the Cards component (a base gradient always visible, a deeper one fading in on hover). On hover: the photo scales to 106%, the overlay deepens, the panel border turns gold, and the divider/title brighten to gold.

Below `md`, the filmstrip is replaced with normal vertically-stacked cards (one per row, 5:6 aspect ratio) reusing the same panel/overlay/caption treatment, so mobile gets a standard card list instead of the tall scrolling filmstrip.

Loading skeleton matches each breakpoint's layout (staggered placeholder blocks on desktop, stacked 5:6 blocks on mobile).

---

### Addition: PageHero feature strip

File: src/components/pageHero.js

Added a hardcoded feature strip anchored to the bottom of the PageHero. Dark semi-transparent bar (rgba 10,10,10 at 72% opacity) with a subtle gold top border and backdrop blur.

Three columns with Font Awesome icons, bold gold-accented labels in Montserrat, and short Raleway body copy: Mountain Sanctuary, Private Dining, and Wellness & Spa — each separated by faint gold vertical dividers.

Right side has a "Scroll to Discover" label in tiny all-caps Montserrat with a 28px animated gold dot that slides down a vertical line on a 1.6s loop.

The existing hero text block has its bottom padding increased to 120px so it never overlaps with the strip.

---

### Redesign: PageHero component

File: src/components/pageHero.js

Supports two modes — Full (full-bleed image or video with text overlay) and Half (split image/text layout) — both controlled by the CMS media_style field.

Full mode: image or video fills the frame at clamp(480px, 60vh, 760px) height. Dark overlay using the CMS overlay value. Text positioned left, center, or right per the CMS layout field. Gold Montserrat eyebrow with a short line, Cormorant italic headline, gold 32px rule, Raleway body copy.

Half mode: 50/50 split on desktop, stacked on mobile. Image side fills its half with object-cover. Text side on white background. Same Cormorant/Raleway/gold typography as the full mode. "Text Left" puts the image on the right; "Text Right" and "Center" put the image on the left.

Replaced: `text-[#005D94]` blue headline color, `text-[60px]` sizing, `bg-gray-300/500` placeholder fallbacks, and the duplicate mobile/desktop layout blocks from the original. All CMS field bindings and CSLP attributes preserved.

---

### Redesign: PDP page

File: src/app/[locale]/pdp/[id]/page.js

White background throughout. Loading state replaced with a centered gold spinner and small all-caps Montserrat "Loading" label.

Back button: gold Montserrat text with a left arrow, replaces the previous cyan button.

Image section: thumbnails on the left with gold border when active (previously gray/black border). Main image on the right in a light `#f5f5f5` container.

Product info column: gold Montserrat eyebrow with a short gold rule. Product name in large Cormorant italic (light weight). Price in Cormorant gold. Both replace the previous plain text with cyan color.

Buttons: pill-shaped (border-radius 9999px). "See All Variations" is an outlined gold pill, transparent background. "Add to Cart" is solid gold with black text.

Cart toast: white background with a gold top border, replaces the previous amber/dark style.

Variants slideout: dark `#0a0a0a` background with gold-bordered title in Cormorant italic. Each variant card is dark `#111` with a gold hover border. Replaces the previous white/gray style.

Purchase slideout: white background. Cormorant italic success icon with gold border, gold "Complete Purchase" pill button. Email input field with gold focus border.

Bug fix: the `buyClick` function was referenced in the original code but never defined, which would cause a runtime error. It is now properly defined and includes jstag tracking for purchases.

Removed: `console.log(query)` from both content fetching paths. Removed `console.warn` for translation lookups.

Preserved: jstag useEffect for `product_viewed` and `product_viewed_category` tracking (this was in the original repo and intentionally kept). jstag `product_name` send on add to cart. All modular blocks, translation system, and commerce fallback logic unchanged.

---

### Redesign: Events page

File: src/app/[locale]/events/page.js

White background. Two sections: a page header and the event content below.

Page header: Same pattern as articles — gold eyebrow, Cormorant italic h1 from CMS `headline`, Raleway subtext from `details`. Below the heading, a compact dark/gold toggle switches between List and Calendar views.

List view: Each event renders as a horizontal card with a 3px gold left accent bar, a 220px image (hover scale), and a content column with Cormorant italic title, expanding gold rule, Montserrat date/time and location icons, 2-line-clamped Raleway description, and a fade-in "View Details" arrow link. Staggered scroll animation per card.

Calendar view: Dark `#0f0e0c` background section. 7-column grid (Sun–Sat) with gold "MON/TUE/..." headers and gold dividers. Each event tile is dark `#1a1814` with a gold border on hover. Shows time in Maldives timezone, Cormorant italic title, and muted location text.

Modal: Opens on list card click or calendar tile click. Framer Motion AnimatePresence with blur backdrop. Off-white `#faf9f7` panel — 320px hero image with gradient overlay, audience taxonomy tags and Cormorant italic title at the bottom of the image, then date/location meta and Raleway description body below.

jstag tracking preserved from the original — fires `topic_browsed` per taxonomy on modal open. All `console.log` calls removed.

---

### Redesign: Rewards page

File: src/app/[locale]/rewards/page.js

Dark `#0a0a0a` full-page background. Two sections:

Hero: Full-width 50/50 split. Left half is the CMS image with a pill-shaped right border (border-radius 9999px on the right side only) creating a curved edge against the dark background. Right half contains a gold "Membership" eyebrow, Cormorant italic h1, gold divider, and Raleway body text in muted white. Layout collapses to stacked on mobile via a `matchMedia` listener.

Form: White `#ffffff` background section below the hero. Centered narrow column (max-w-lg). Gold eyebrow "Enrol Now" flanked by gold rules, Cormorant italic h2, Raleway body. Three fields — name, email, category select — all full-width with gold focus border transition. Custom gold chevron on the select. Gold submit button. On submit: sets the Personalize cookie (`client_type`) and opens a success modal.

Success modal: Dark `#111` panel with a gold border, Cormorant italic headline, Raleway body, and a full-width gold close button. Overlay is near-black. Replaced the default Headlessui/Tailwind modal styling from the previous version.

Also removed a `console.log(entry)` that was present in the old version.

---

### Footer: Maldives map

Added an interactive map to the footer showing the Maldives location. Sits between the main link columns and the bottom copyright bar.

Layout: 1/3 location details + 2/3 map. Location column shows "Maldives" in Cormorant italic, "Indian Ocean" subtitle, coordinates in muted Montserrat, and a small pulsing gold dot labelled "Resort Location". Map column is 260px tall with a subtle border.

Map uses CartoDB Dark Matter tiles (free, no API key) via react-leaflet. A custom gold pulsing marker sits on coordinates pulled from the CMS. Default zoom is 1 (world-level view). Scroll-wheel zoom disabled; custom +/− buttons styled in the footer's dark gold palette replace the default Leaflet controls. Attribution overlay is minimal and near-invisible. Map is dynamically imported (ssr: false) to avoid SSR conflicts.

Location info column shows the address label in Cormorant italic and the lat/lng coordinates in muted Montserrat — all driven by CMS. Nothing in the map section is hardcoded.

Installed packages: react-leaflet, leaflet.

### CMS Changes — Footer map fields

Add three fields to the footer content type:

- `map_address` (Short Text) — the location label shown in Cormorant italic above the coordinates, e.g. "Maldives, Indian Ocean"
- `map_latitude` (Number) — decimal latitude used to position the map marker, e.g. 3.2028
- `map_longitude` (Number) — decimal longitude used to position the map marker, e.g. 73.2207

---

### Redesign: Articles pages

Files:
- src/app/[locale]/articles/page.js
- src/app/[locale]/articles/[title]/page.js
- src/app/[locale]/articles/entry/[title]/page.js
- src/app/[locale]/articles/categories/[title]/page.js

All four pages now use the same luxury design language as the rest of the site.

articles/page.js: White background. Page header with Montserrat gold eyebrow ("Red Panda Resort") and Cormorant italic h1 "Journal & Stories". Article count shown in muted Montserrat. 3-column responsive grid. `console.log` that was present in the old version has been removed.

articles/[title]/page.js: White background. Page header shows an Articles breadcrumb link and the current category name in gold. h1 pulls from the CMS `header` field with optional `subtext` description below. Grid of articles filtered by taxonomy. All jstag tracking and useDataContext preserved from the original.

articles/entry/[title]/page.js: 75vh hero section with the banner image or video filling the full viewport height. A gradient overlay runs from transparent at the top to near-black at the bottom. Breadcrumb + taxonomy tags sit above the Cormorant italic headline at the lower-left of the hero. For events, FontAwesome date/time, event type, and venue icons appear below the title. Article body renders on a warm off-white (#faf9f7) background in a centered 720px column with `.article-body` typographic styles (Raleway body, Cormorant headings, gold links). All jstag tracking, useDataContext, and the full video controls logic (Show Controls / Autoplay / loop) preserved from the original.

articles/categories/[title]/page.js: White background. Same page header pattern as the articles/[title] page with the category slug as the h1. Same 3-column card grid. jstag tracking preserved from the original.

All four pages share the same ArticleCard component pattern: 4:3 aspect ratio media block (image or video) with a hover scale effect, gold taxonomy tag links, Cormorant italic title, an expanding gold rule (24px → 48px on hover), 3-line-clamped Raleway teaser, and a fade-in "Read More" link with arrow. Staggered scroll-triggered animation per card (Framer Motion whileInView).

---

### Redesign: FAQ pages

Files:
- src/app/[locale]/faq/[title]/page.js
- src/app/[locale]/faqs/[title]/page.js
- src/app/[locale]/faqs/[title]/section/[id]/page.js
- src/app/[locale]/faqs/[title]/section/[id]/[qid]/page.js

All four pages now use a dark `#0a0a0a` background with the shared design language used across the rest of the site.

faq/[title]: Hero image with dark gradient overlay, Header overlaid at the top, Montserrat gold eyebrow, Cormorant italic h1. Categories render with a gold line + Cormorant italic heading. Accordion rows use Raleway — question turns gold and bolds when open, answer fades in with AnimatePresence height animation. Gold chevron rotates on open.

faqs/[title]: Same hero treatment with a glass search input (semi-transparent dark bg, white text) and a gold search button. "Browse Topics" eyebrow section below with category tiles: faint gold border that brightens on hover. Removed `styled-components` and `@emotion/is-prop-valid` dependencies — tile styling is now consistent inline CSS. All search and navigation logic preserved.

faqs/[title]/section/[id]: Montserrat breadcrumb (gold home link, muted current category), Cormorant h1 with "Category" eyebrow, 3-column question grid with gold arrow icons and hover gold-tint background.

faqs/[title]/section/[id]/[qid]: Two-column layout — main answer on the left (gold dividers flanking the Cormorant italic question, Raleway body), sidebar on the right with a gold left border showing all other questions in the category as links. Both columns animate in on load (main fades up, sidebar slides in from right).

`<Footer locale={params.locale} />` cleaned up to `<Footer />` across all pages — locale is now read internally by the Footer component.

---

### Redesign: Footer component

Files: src/components/footer.js, src/components/ui/animated-tooltip.jsx (new)

Complete redesign replacing the old plain white footer. Now uses a dark `#0a0a0a` background with a 12-column grid: a brand column on the left (4 cols) and link columns on the right (8 cols).

Brand column: Cormorant Garamond italic brand name, gold 32px divider, Raleway description, and a "Follow Us" label above the social icon row. Social links (Facebook, Instagram, X, YouTube) are rendered with an `AnimatedTooltip` component — overlapping circular icon buttons that lift and scale on hover and show a colored tooltip with the platform name.

Link columns are driven by the `column[]` CMS field — each column renders a Montserrat gold header and a list of Raleway links. `Link` elements use `href` + `title` from the CMS link field. External vs internal routing is handled transparently by Next.js `<Link>`.

Bottom bar: copyright text is pulled from the `copyright_text` CMS field (falls back to a year-stamped default). Clicking it still triggers `resetModalFlags()` and `resetSegment()` as before. Privacy/Terms/Cookie links remain hardcoded in the bottom bar.

The `AnimatedTooltip` component is a new file at `src/components/ui/animated-tooltip.jsx`. It uses framer-motion `AnimatePresence` for the tooltip pop and `motion.a` for the lift-and-scale hover on each icon circle.

Footer fetches its own CMS data via `ContentstackClient.getElementByTypeWithRefs('footer', locale, [], null)` inside a `useEffect`, using `useParams()` to get the locale. Live preview updates are wired via `onEntryChange`.

---

### Redesign: ArticleBanner component

File: src/components/articleBanner.js

Added `'use client'`, `framer-motion`, and `useState`. Cards are now full image-background tiles (520px tall) in a 3-column grid, replacing the old layout where the image sat above the text in a bordered card.

Section header reworked: animated gold line + Montserrat eyebrow using the `heading` field slides in on scroll.

Each card has a CSS background-image div that scales up on hover. If the article has a video (`video_options.video.url`), a muted autoplay `<video>` is rendered as the background instead. Two gradient overlays are stacked — the second deepens on hover. A gold rule expands on hover. Article teaser and "Read Article" link are hidden by default and revealed with a height animation on hover.

Headline styled in Cormorant Garamond italic weight 300, clamped to one line. Teaser in Raleway weight 300.

Taxonomy tags are rendered as Next.js `<Link>` elements pointing to `/articles/categories/[term_uid]`, styled with a gold Montserrat label and a faint gold border. If no taxonomy tags are present, a numbered fallback (`01`, `02`, etc.) is shown instead. This replaces the old approach where tags were plain `<span>` elements.

The old empty state with three placeholder boxes was replaced with a single `visual-builder__empty-block-parent` div.

---

### Redesign: Reviews component

File: src/components/reviews.js

Added `AnimatePresence` from framer-motion. Removed `next/image` import — the decorative quote mark is now a CSS `&ldquo;` character in Cormorant Garamond at 9rem.

Layout changed from a flat flex row to a two-column grid (`lg:grid-cols-2`). Left column slides in on scroll with a fade+translate animation and shows the eyebrow label, Cormorant italic headline, Raleway body, and star ratings. Right column shows the rotating review quote with `AnimatePresence` crossfade (up/down) instead of the old CSS opacity toggle.

Review quote uses Cormorant italic, clamped to 4 lines. Reviewer attribution redesigned: gold line separator, Montserrat bold uppercase name, Raleway light city. Dot nav updated to expanding pill style matching the carousel.

Auto-advance interval reduced from 10s to 7s. `review_title` field is no longer rendered.

Background changed from hardcoded `#F0F9FF` to `var(--color-section-bg)`.

Sticky supported via `block.review?.sticky` in `src/app/[locale]/page.js`.

---

### Redesign: ProductFeature component

File: src/components/productFeature.js

Section wrapped in a full-width `<section>` with warm cream background `#f5f1e3`. Container constrained to `max-w-7xl`.

Header reworked into a flex row (stacks on mobile): left side has a Montserrat gold eyebrow "The Collection" and a Cormorant Garamond italic headline; right side shows the description in Raleway weight 300. Both separated by a bottom border.

Product cards gain an `overflow-hidden` container with a `group-hover:scale-105` zoom on the image and a dark overlay with a centred "View" label that fades and slides up on hover.

Product name restyled to Cormorant italic. Price restyled to Montserrat with letter-spacing. `large_cards` field behaviour unchanged.

CTA link restyled: gold Montserrat with `ArrowRightIcon` that nudges right on hover. `plp_link_text` field now falls back to "View All" if empty.

---

### Redesign: Tabs component

File: src/components/tabs.js

Added `AnimatePresence` from framer-motion. Added direction tracking (`dir` state) so panels slide in from the correct side based on which tab was clicked.

Tab bar moved from below the content to above it. Active tab indicator replaced with a shared animated underline (`layoutId="tab-underline"`, spring physics) in gold `#D1A261`. Inactive tabs are muted `#9a9590`, active tabs go bold `#0a0a0a`.

Panel fills `calc(100vh - 73px)` with a `-73px` top margin so it slides behind the tab bar. Background colour transitions smoothly between tabs (0.3s ease) using the per-tab `background_color` field.

Image side gets a pill/stadium border radius (direction mirrors the layout field) and a Ken-burns scale-in entrance. Text side: Montserrat gold eyebrow using `tab_text`, Cormorant italic headline, 36px gold divider, Raleway body.

Note: `text_dark` field is present in the CMS but has no effect in this version — headline colour is fixed at `#0a0a0a`.

---

### Redesign: HalfSquares component

File: src/components/halfSquares.js

Added framer-motion. Both panels now span full viewport height (`min-height: 100vh`) in a flex row, replacing the old `aspect-square` 50/50 layout.

Media side: image now uses a CSS `background-image` div with a scale-in entrance animation (`scale 1.08 → 1`) instead of a plain `<img>` tag. A subtle edge vignette overlay added. Video behaviour unchanged.

Text panel: dark `#111` background. Content animates in from the side (direction inverted based on `media_align`). Ghost Cormorant number accent (`01`) added above the eyebrow. Eyebrow label in Montserrat all-caps gold. Headline changed to Cormorant Garamond italic `clamp(2.8rem, 5vw, 4.2rem)` white. Gold 40px divider. Body in Raleway weight 300 at 55% white opacity. CTA replaced with gold underline link and animated arrow SVG.

`vertical_margin` CMS field no longer used — component is always full height.

---

### Redesign: ImageGrid component

File: src/components/imageGrid.js

Complete architectural replacement — the old multi-layout static grid (1/2/3/4+ image arrangements) is gone. Replaced with a full-screen carousel (`clamp(420px, 72vh, 860px)` tall).

Carousel features: Ken-burns slow zoom per slide, clip-path wipe transition between slides, auto-advance every 5s with pause-on-hover, keyboard arrow key navigation, touch/pointer swipe support, image preloading for the next slide, and prefers-reduced-motion fallback (crossfade instead of slide).

Custom SVG arrow buttons with a draw-in ring animation on hover. Dot indicators (active dot expands to a pill) and a slide counter bottom-right. Per-slide caption rendered as plain text (Raleway weight 200, `#E8D5B0`) at bottom-left when a `text` field is set on the image.

---

### Redesign: Cards component

File: src/components/cards.js

Added `'use client'`, `framer-motion`, and `useState`. Cards are now full image-background tiles (540px tall) in a 2-column grid, replacing the old flex-row layout with bordered card boxes.

Section background now reads from `content?.background_color?.hex` (CMS-driven) instead of being hardcoded. Falls back to `#0a0a0a` if not set.

Section eyebrow added: animated gold line + "Our Experiences" label slides in on scroll.

Each card has a CSS background-image with a scale-up on hover, two gradient overlays (second one deepens on hover), and a gold rule that expands width on hover. Body text and CTA link are hidden by default and revealed with Framer Motion height animation on hover. Tags field is supported — falls back to a numbered index if no tags are present.

Note: the old `card_background_color` per-card field is no longer used — cards are now image-background based.

Sticky support added via the same pattern as TextBlock — handled in `src/app/[locale]/page.js` by checking `block.cards?.sticky`.

---

### Redesign: TextBlock component

File: src/components/textBlock.js

Added `"use client"` directive and framer-motion import. Added null guard — returns null if both headline and body are empty.

Outer container is now full-width with `py-22`, `var(--color-section-bg)` background, and a scroll-triggered fade-in animation. When the `sticky` CMS field is true, the container gets `sticky top-0 z-0` so subsequent sections (which carry their own background) scroll over it.

Animated gold eyebrow added: two 48px `#D1A261` lines flanking "Red Panda Resort" in Montserrat, with a scale-in entrance animation.

Headline changed from `h1` to `h2` (semantic fix — this is a section component, not a page title). Styled with Cormorant Garamond italic weight 300, `clamp(1.6rem, 2.8vw, 2.4rem)`, dark `#1a1410`.

Animated 40px gold divider added between headline and body.

Body restyled: Raleway weight 300, `clamp(0.85rem, 1.3vw, 0.98rem)`, muted `#4a4540`, `pre-wrap` preserved.

---

### Redesign: Hero component

File: src/components/hero.js

Text block is now hidden on mobile (`hidden md:block`) — only renders from md breakpoint up.

Added a gold eyebrow above the headline: a 32px `#D1A261` line + "Red Panda Resort" label in Montserrat bold, all-caps.

Headline restyled to Raleway weight 200 with `clamp(1.4rem, 3.5vw, 3rem)` font size, tight line-height (1.1), and a soft text-shadow. Removed the old `mt-8` margin.

Added a 40px gold horizontal rule between headline and body (desktop only, `hidden lg:block`).

Body text is now hidden on mobile (`hidden lg:block`), `text-white/85`, Raleway weight 300 with `clamp(0.8rem, 1.2vw, 0.95rem)`. Removed old `mt-8 text-left`.

CTA button redesigned: gold `#D1A261` border, Montserrat 0.7rem, all-caps, with an animated arrow SVG and inline hover that fills the button gold and turns text black.

The Contentstack CSLP spread `{...hero?.$?.video_options?.video}` on the `<video>` tag (previously fixed bug) was intentionally kept — it was missing from the reference version.

---

### Redesign: Header component

File: src/components/header.js

Mobile menu replaced with a full-screen dark overlay rendered via createPortal into document.body. The old version was a plain white slide-in panel. The new version uses a dark (#0a0a0a) background with gold (#D1A261) accents for nav items, separators, and the cart button. A new `mounted` state guards the portal so it only renders client-side. Import for `createPortal` from `react-dom` was added.

Desktop nav got an inline font style (Raleway, 0.82rem, letter-spacing 0.1em) applied directly on the nav wrapper div, and `font-paragraph` was removed from the dropdown PopoverButton since the parent now handles typography.

The `logout` function had a duplicate `window.location.reload()` removed — the first call already triggers the reload so the second never ran.

No new dependencies.

### Fix: Contentstack Visual Builder spread misplaced on video element

File: src/components/hero.js (around line 123)

The `{...hero?.$?.video_options?.video}` spread was placed as a child between the `<video>` tags instead of as a prop on the opening tag. JSX only allows spreads on opening tags, so this caused a compile error.

Moved it to the `<video>` opening tag alongside the existing props (className, style, autoPlay, etc.). This is part of the Contentstack Visual Builder integration and needed to be a prop, not a child element.

No new dependencies.

---

## CMS Changes

### Footer content type

Content type UID: `footer`
Type: Singleton

Fields used in the component:

- `title` (text) — brand name rendered in Cormorant italic in the brand column. Falls back to "Red Panda Resort".
- `description` (multiline text) — tagline rendered in Raleway beneath the gold divider. Falls back to a default description.
- `column[]` (group, multiple) — each group has a `column_header` (Montserrat gold label) and a `link[]` array (each link has `title` + `href`). Renders as the nav columns in the right 8 cols of the footer grid.
- `copyright_text` (text) — rendered in the bottom bar in Cormorant italic gold. Falls back to a year-stamped copyright string.

Social links are hardcoded in the component and are not driven by CMS.

---

### ArticleBanner global field — Background color

Field label: Background
Field UID: `background`
Field type: Custom (color picker)
Global field: ArticleBanner

Controls the section background. Reads `content?.background?.hex`, falls back to `var(--color-section-bg)` if not set.

---

### ProductFeature global field — Background color

Field label: Background
Field UID: `background`
Field type: Custom (color picker)
Global field: ProductFeature

Controls the section background. Reads `content?.background?.hex`, falls back to `#f5f1e3` if not set.

---

### Text and Image modular block — Sticky toggle

Field label: Sticky
Field UID: `sticky`
Field type: Boolean
Default value: false
Location: text_and_image modular block on homepage content type

Handled in `src/app/[locale]/page.js` via `block.text_and_image?.sticky`.

---

### Text and Image modular block — Background color

Field label: Background
Field UID: `background`
Field type: Custom (color picker)
Location: text_and_image modular block on homepage content type

Controls the background color of the text panel in the HalfSquares component. Reads `content?.background?.hex`, falls back to `#111` if not set.

---

### Reviews global field — Background color + Sticky

Background color field:
Field label: Background
Field UID: `background`
Field type: Custom (color picker)
Global field: Reviews

The component reads `content?.background?.hex` and applies it as the section background, falling back to `var(--color-section-bg)` if not set.

Sticky field:
Field label: Sticky
Field UID: `sticky`
Field type: Boolean
Default value: false
Global field: Reviews (added via modular block on homepage content type)

Handled in `src/app/[locale]/page.js` via `block.review?.sticky`.

---

### Cards global field — Sticky toggle

Field label: Sticky
Field UID: `sticky`
Field type: Boolean
Default value: false
Global field: Cards

Same behavior as TextBlock sticky — when true, the cards section sticks at the top while subsequent sections scroll over it. Handled in `src/app/[locale]/page.js` via `block.cards?.sticky`.

---

### TextBlock global field — Sticky toggle

Field label: Sticky
Field UID: `sticky`
Field type: Boolean
Default value: false
Global field: TextBlock

When set to true, the TextBlock section becomes sticky so that subsequent page sections scroll over it.

Two things were needed to make this work correctly:

1. The sticky class (`sticky top-0`) is applied to the modular block wrapper div in `src/app/[locale]/page.js`, not inside the TextBlock component itself. Sticky only works within its containing block — putting it on the component's own inner div does nothing because that div's parent is exactly the same height as itself (zero room to stick). The wrapper div's parent is the full modular blocks container, which spans the entire page, so it has room to stick.

2. Every modular block wrapper is assigned `style={{ zIndex: index + 1 }}` — the first block gets z-index 1, the second gets 2, and so on. Non-sticky blocks also get `position: relative` since z-index has no effect on statically positioned elements. This ensures every section always sits above all sections that came before it, so the sticky TextBlock (at whatever index it appears) is always covered by every section below it as they scroll up.

Side effect to be aware of: `position: relative` combined with an explicit `z-index` creates a new stacking context per block. Any popovers, dropdowns, or tooltips rendered inside a block are confined to that block's stacking layer. If z-index issues appear in other components, this is the likely cause.
