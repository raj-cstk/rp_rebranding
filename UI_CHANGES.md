# UI Redesign Changelog

Tracks UI changes made during the redesign phase. All changes are UI/styling only — no existing functionality, API integrations, analytics, or business logic has been modified unless noted.

---

## Changes

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
