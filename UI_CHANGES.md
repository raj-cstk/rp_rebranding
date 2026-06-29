# UI Redesign Changelog

Tracks UI changes made during the redesign phase. All changes are UI/styling only — no existing functionality, API integrations, analytics, or business logic has been modified unless noted.

---

## Changes

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
