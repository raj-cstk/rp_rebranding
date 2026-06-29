# UI Redesign Changelog

Tracks UI changes made during the redesign phase. All changes are UI/styling only — no existing functionality, API integrations, analytics, or business logic has been modified unless noted.

---

## Changes

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
