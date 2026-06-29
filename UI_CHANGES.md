# UI Redesign Changelog

Tracks UI changes made during the redesign phase. All changes are UI/styling only — no existing functionality, API integrations, analytics, or business logic has been modified unless noted.

---

## Changes

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
