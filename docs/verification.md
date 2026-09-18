# Redevelopment verification

## Automated checks

`bun run verify` covers:

- Astro and TypeScript diagnostics: 56 files, zero errors, warnings, or hints.
- ESLint and Prettier.
- Seven publication/URL unit tests, with 22 assertions.
- A production build with 14 pages and intentional empty archives.
- An isolated fixture build with 37 pages and 17 indexed entries across English and Portuguese.
- A generated-site crawl checking links, assets, headings, landmarks, metadata, reciprocal translations, pagination, related content, feeds, and sitemap membership. Drafts and future entries stay private.

Fixtures also exercise posts and projects sharing a filename, chronological topic archives across both collections, and contents navigation with mixed heading levels. Fixtures remain outside the production output.

## UI components

The interactive UI uses the official shadcn components in `src/components/ui/`: Button, Input, Label, Select, Dialog, Dropdown Menu, and Sheet. Their theme tokens map to the existing orange palette. Element resets are scoped to Tailwind’s base layer; standard component animations come from `tw-animate-css` and respect reduced motion.

The desktop hero fills the page frame with left-aligned text and a larger portrait on the right. The mobile arrangement, original introduction, blinking underscore, and breathing glow are retained. Homepage copy has stronger contrast and larger type. Navbar control icons are 18–20px inside 44px targets at the default text size.

## Browser checks

Using the production fixture preview:

- English/Portuguese homepages and a long article fit at 320, 390, 768, 1024, and 1440px without horizontal overflow.
- At 320px with text doubled, the header wraps and both languages’ search dialogs fit without horizontal scrolling. The mobile Sheet remains scrollable.
- Search opens with the standard 200ms animation, focuses its input, and closes with Escape. Focus returns to its trigger after the closing animation.
- The Select popup uses themed HTML, rounded corners, and selected-item indicators. The native fallback select is visually hidden.
- Appearance changes persist. System follows emulated operating-system changes. The mobile Sheet animates and closes when switching to desktop.
- English and accented Portuguese queries return results in their respective languages. Type filtering, loading the next five of 15 results, and recovery after a simulated index outage work without leaving the page.
- Technology filtering updates the visible projects and accessible count.
- Light/dark Axe audits of the homepage and search dialog report no WCAG A/AA violations. The mobile Sheet also passes.
- With scripting disabled in a sandboxed browser frame, the native navigation disclosure and language links remain available.

## Review limits and release

The preview tool’s screenshot capture is unavailable, so a final visual review in a normal browser remains necessary. Automated accessibility checks do not replace assistive-technology testing.

At doubled text size, Axe flags the scrollable Select viewport because Radix manages option focus with `tabindex="-1"`. Keyboard testing confirmed that End scrolls and focuses the final option, Enter selects it, and Escape dismisses the popup. Screen-reader behavior remains a manual release check.

No production deployment or Search Console submission was performed. Follow [the README’s release checklist](../README.md), then measure the populated production site and verify HTTPS, direct URLs, redirects, assets, and genuine HTTP 404 responses.
