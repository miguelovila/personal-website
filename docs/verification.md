# Website verification

## Website audit — 2026-10-08

Completed the code, content organization, technical SEO, generated-site and deployment checks below. Changes are local; no commit, push, deployment or Search Console action was performed. Earlier dated sections describe earlier versions and are retained as history.

### Changes

- Grouped each project's English and Portuguese writing under `src/content/projects/<slug>/`, with shared images and data in its `assets/` directory. All 51 moved assets are byte-identical; all 16 articles retain their writing. Existing `en/<slug>` and `pt/<slug>` IDs, translation keys, related-project references and public URLs remain stable. Legacy language-first content is still supported. Aditus's public video and poster retain their existing direct URLs.
- Removed the obsolete Next.js declaration file, six unused import aliases, ten unused direct dependency declarations, obsolete footer/language CSS and two unused MDX imports. Kept future blog functionality, authoring components, shared UI primitives and original project source imagery.
- Gave topic archives topic-specific descriptions and paginated archives distinct descriptions. Added accurately scoped About-page `ProfilePage` data, real sharing-image dimensions and fallback-image descriptions, and large-image-preview permission. Extended checks for unique metadata within each language, actual sharing assets, profile identity, and agreement between HTML and sitemap language links.
- Added an nginx 308 redirect from `www.miguelovila.pt` to the apex, preserving the path and query string, plus a CI regression check. It takes effect after deployment when the upstream proxy forwards the original hostname.
- Updated authoring instructions, templates and current media/source notes to match the repository, including the AES YouTube demonstration.

### Validation

- Astro/TypeScript: 71 files, zero errors, warnings or hints. ESLint, Prettier, frozen dependency installation and all 23 unit tests pass (90 assertions).
- Production: 72 pages and 16 indexed articles across two languages. All 72 page URLs match the pre-change route list. The crawl passes 3,586 local references, 254 fragments, 16 tables and six diagrams, including metadata, responsive images, canonical URLs and reciprocal translations.
- Isolated fixtures: 37 full-site pages, four landing pages and 15 projects-only pages pass. Fixtures now exercise bundled and legacy translations together, related-project references, custom sharing images and paginated descriptions. The strengthened production checker also passes against the landing and projects-only outputs.
- Docker: clean frozen installation and production build succeed from the repository. The workflow's nginx smoke checks pass locally, including health, direct routes, verification metadata, directory redirects and genuine English/Portuguese 404 responses. Additional checks pass for the new `www` redirect with a query string, HTML/search cache headers and MP4 byte-range responses.
- Browser: all 16 project articles and both homepages load their images and fit a 320px viewport. Both About pages and project archives also pass at 1440px. Automated WCAG A/AA checks report no violations on those 22 pages in the dark theme; four representative pages also pass in the light theme at 390px. Desktop and mobile screenshots were inspected. These checks do not replace assistive-technology testing or field performance measurements.
- English `AES` and Portuguese `anemómetro` searches return the expected localized articles. Flutter filtering shows the two matching projects. Search and image dialogs release scroll locking and restore focus on dismissal. The Portuguese moving-average demo hydrates when scrolled into view; its last-sample control reaches address 255, and bypass at address 2 outputs −110.

### Remaining external work and dependency findings

- The anomaly-detection repository `src-project-2` still returns 404 anonymously. Miguel explicitly requested keeping its links for the planned public release. The other project repositories and linked reports respond publicly; LinkedIn blocks automated requests, so its status cannot be established by this check.
- Both live hostnames now have valid HTTPS. The apex serves the populated site, robots and sitemap; the sitemap contains 66 URLs, and a missing route returns 404. Live `www` still serves a duplicate page with an apex canonical until the redirect is deployed. The upstream HTTP-to-HTTPS redirects currently use 302; configure permanent 301/308 redirects there. Search Console ownership, sitemap submission and field Core Web Vitals remain owner/hosting tasks.
- Bun reports **15 advisory entries across four packages: one critical, six high, five moderate and three low**. They involve Astro (10), its nested Sharp (3), braces (1) and esbuild (1). Astro/Sharp image-decoding concerns remain build-time risks when processing untrusted images. The runtime image contains static files and nginx, without the JavaScript build dependencies. No major framework migration or dependency override was introduced.
- The compatible `http-cache-semantics` update from 4.2.0 to 4.3.0 removes its scanner entry, but it is **not a confirmed security fix**: an in-memory reproduction still permits `max-stale` reuse for shared responses containing `Set-Cookie` or `proxy-revalidate`. This site does not provide an authenticated shared-response cache. Keep that caveat when evaluating future server-side features.

Primary references: [Google descriptions](https://developers.google.com/search/docs/appearance/snippet), [ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [robots image-preview controls](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), [Astro AVIF advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2), [Sharp SVG advisory](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w), [cache advisory](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), [esbuild advisory](https://github.com/evanw/esbuild/security/advisories/GHSA-g7r4-m6w7-qqqr) and [braces issue](https://github.com/micromatch/braces/issues/70).

## Deployment readiness — 2026-10-04

The full static site builds and passes the checks below. No commit, push or production deployment was performed. The remaining hosting and dependency limitations are explicit; this is not a clean security audit.

### Fixes

- Search now creates a Pagefind instance for each panel/language. Previously an English search followed by an Astro navigation to Portuguese still returned English articles. Search URL updates also preserve Astro's history state, so Back restores the search page, query and results.
- Article author and RSS links respect disabled About/blog features. A projects-only fixture build now checks these combinations alongside the existing full and landing fixtures.
- Light-theme link text uses a darker orange with sufficient contrast. The original brand orange remains available for other uses and for the dark theme.
- Image-preview captions remain fully readable on narrow screens, without a nested scroll area that keyboard users could not focus. The filter demo's buttons wrap when text is enlarged to 200% at 320px.
- Docker and Compose pass the Google verification value into the static build. nginx uses relative directory redirects, preserving the public scheme and port, and revalidates HTML and Pagefind files after deployment. Hashed Astro assets retain immutable caching.
- `bun run verify` now crawls the actual production output as well as fixtures. CI also builds the deployment image and tests the running nginx container. MDX files are included in pre-commit formatting, and all isolated test outputs are excluded from linting, formatting and Docker's build context.

### Validation

- Astro/TypeScript: 71 files, zero errors, warnings or hints. ESLint, Prettier and all 22 unit tests pass (79 assertions). The build reports the intentionally empty blog collection; it does not publish cached or fixture posts.
- Production: 72 pages and 16 indexed articles in two languages. The persistent crawl checks 3,494 local URL references, 254 fragments, 16 table regions and six diagrams, including responsive images, React island assets, canonical URLs, reciprocal language links and sitemap membership.
- Isolated fixtures: 37 full-site pages, four landing pages and 15 projects-only pages pass publication, links, feeds, pagination and feature-flag checks.
- Docker: frozen installation of 853 packages succeeds from the repository alone. Full-site and landing images pass 26 and 38 runtime checks respectively: nginx configuration and health, direct URLs, both languages' genuine HTTP 404 responses, disabled routes, verification metadata, cache headers, relative redirects, gzip and MP4 byte-range requests. The runtime contains only the built site and nginx, without source code, `.env` or `node_modules`. The CI smoke script was also run locally; its GitHub-hosted execution remains for the eventual push.
- Browser: all 16 articles load their images and fit a 320px viewport. Automated WCAG A/AA checks found no violations on the 28 reviewed article and general pages in the light theme, or on six representative dark-theme pages. The mobile menu and image dialog also pass the checks. Keyboard dismissal restores focus and releases scrolling. Enlarged-text testing caught and verified the filter-button fix.
- Search was tested across a client-side English-to-Portuguese switch and through result → Back navigation. `anemómetro` returns the Portuguese weather-station article. The no-JavaScript Portuguese article retains readable content, the native navigation menu, language links and a hidden loading overlay.
- All project media references and translation pairs were reviewed. The social card is a valid 1200 × 630 PNG, the Apple icon is 180 × 180, and the favicon contains 16/32/48px images. The remaining public repository, report and YouTube links respond successfully apart from the four repositories below.

Browser checks do not replace testing with assistive technology or measurements on the final public host.

### External release steps

- Miguel confirmed that `mining-deti-coins`, `smart-weather-station`, `src-project-2` and `ua-bd-bud` will become public before deployment. Their links remain in the articles; anonymous requests currently return 404. Recheck the repository and linked report URLs after changing visibility.
- HTTPS on `miguelovila.pt` is valid, and the homepage, robots file and both sitemap files return 200. HTTP redirects to HTTPS. The public sitemap still contains only the older landing pages.
- `www.miguelovila.pt` already resolves, but HTTP returns 404 and HTTPS serves Traefik's default certificate. Configure its router, hostname-valid certificate and redirect to the apex at the hosting layer.
- Publish only the new `dist/` output or the built nginx image. Include all new content, components, scripts and media in the eventual commit; none of these files depends on the sibling project repositories. Search Console submission still requires the owner's account.

### Dependency audit

Compatible updates moved Astro from 5.14.1 to 5.18.2, MDX from 4.3.6 to 4.3.14, and the React integration from 4.4.0 to 4.4.2. Re-resolving stale transitive dependencies within the existing declared ranges reduced Bun's audit from 84 advisory entries across 23 packages to **15 across five packages: one critical, six high, five moderate and three low**. Frozen installation and the full validation above pass. No direct major migration or dependency override was introduced.

| Dependency                  | Entries | Exposure in this deployment                                                                                                                                                                                     |
| --------------------------- | ------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Astro 5.18.2                |      10 | Server routing, server islands and attacker-controlled rendering paths are absent from this static site. One entry concerns image decoding during a build.                                                      |
| Astro's nested Sharp 0.34.5 |       2 | Malicious image decoding remains a build risk. The direct Sharp 0.35.5 dependency does not replace Astro's copy. Current inputs are trusted local project images; there is no public image-processing endpoint. |
| braces 3.0.3                |       1 | Tooling uses fixed repository glob patterns. No public input accepts arbitrary patterns; no patched release was available at the audit.                                                                         |
| esbuild 0.27.7              |       1 | The reported issue affects its Windows development server. This deployment builds on Linux and serves static files with nginx.                                                                                  |
| http-cache-semantics 4.2.0  |       1 | The issue requires an authenticated shared-response cache, which this static site does not provide. No patched release was available at the audit.                                                              |

The critical image-processing advisory requires an attacker to supply an untrusted AVIF; its upstream Astro fix is in 7.2.8. The nested Sharp version also predates the libvips fix. These remain unresolved dependency warnings even though the serving container contains neither Astro nor Sharp. See the [Astro AVIF advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2), [Sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-f88m-g3jw-g9cj), [esbuild advisory](https://github.com/evanw/esbuild/security/advisories/GHSA-g7r4-m6w7-qqqr), [braces issue](https://github.com/micromatch/braces/issues/70) and [cache issue](https://github.com/kornelski/http-cache-semantics/issues/56).

An Astro major upgrade or separately validated Sharp override is follow-up maintenance. Reassess these advisories before accepting untrusted build content, enabling remote image processing or adding server-rendered routes.

## About page — 2026-10-04

- Replaced the introductory placeholder with complete English and European Portuguese biographies based on Miguel's interview and supplied résumé. Editorial review checked personal stories, education, research dates, GLUA contributions and hobbies against those sources. The unpublished ATtiny experiment is identified as such; the master's is ongoing, and its subject is omitted as requested.
- Both About pages retain a single main heading, localized metadata and reciprocal language links. The education sidebar uses the same degree titles as the prose. Contact links use the résumé's `me@miguelovila.pt` address throughout the site.
- Project mentions resolve only to available entries in the current language. Full-site output has three relevant project links per biography; About-only output has plain-text mentions and no broken project links. The existing fixture and landing-mode checks also pass.
- Both languages fit browser widths of 320, 390, 768, 1024 and 1440 pixels without horizontal page overflow. The portrait, education summary and contact links were reviewed in the collaborative browser, including the narrow-screen layout and dark theme.
- Astro/TypeScript checks pass for 69 files with zero errors, warnings or hints. ESLint, Prettier, all 19 unit tests (72 assertions), the production build and the 37-page fixture checks pass. No deployment was performed.

## European Portuguese projects — 2026-10-03

- All eight project articles have complete European Portuguese versions. Editorial review covered the technical explanations, ownership, historical measurements, caveats, captions, alternative text, tables and diagram labels. Code identifiers and executable snippets remain unchanged.
- Each pair has a shared translation key, reciprocal article links and `hreflang` metadata in both HTML and the sitemap. The Portuguese homepage now has its three featured projects, and its archive contains all eight translated entries.
- Production output contains 72 pages and 16 indexed articles across English and Portuguese. A separate comparison verifies matching section, table, code-block and media counts for every pair, unchanged executable snippets, correct canonical URLs and translated component labels. The recreated DNS chart has a Portuguese variant with the same data and geometry.
- The full production crawl passes: 3,502 local URL references, 254 fragment links, 276 responsive-image candidates, 16 table wrappers and 62 full-size figure links. All six inline and downloadable Mermaid diagrams have valid IDs, arrow references and scoped styles.
- Browser checks confirm that every Portuguese article fits a 320px viewport and loads all its images. The localized filter demo was also inspected at 390px and on desktop. Its last-sample and bypass controls update the Portuguese visible text, SVG description and accessible slider value; address 2 displays `−91,75` with filtering enabled and `−110` in bypass.
- Switching from the Portuguese filter article to English opens the matching article and restores English labels and decimal formatting. Searching for `anemómetro` returns the Portuguese weather-station article.
- Astro/TypeScript, ESLint and formatting checks pass. All 19 unit tests (72 assertions), the isolated 37-page fixture checks and landing-mode checks pass. The production build indexes eight articles per language.

## Project article expansion — 2026-10-03

- Aditus, the AES IoT gateway, Gestire and the moving-average filter now contain 35 original images including covers, three static Mermaid diagrams, two local videos and the embedded Gestire YouTube Short. The filter's interactive calculation remains available.
- The production crawl passes for all 43 pages and eight project articles: 2,005 local URL references, 137 fragment links, 138 responsive-image candidates and 12 CSS asset references. All 31 full-size figure links resolve locally.
- All three inline diagrams have unique IDs, valid arrow-marker references and scoped styles. Their downloadable SVGs parse as standalone XML, use fixed colors and contain no remote font imports. The renderer adds no browser JavaScript.
- Tables in Markdown and MDX have column headers and named, keyboard-focusable scroll regions. All eight rendered article tables use the new styling. Full-size image links sit below figures so they cannot cover waveform labels or numerical results.
- The four revised articles fit 320px and 390px browser viewports without page overflow. Portrait grids stack on small screens; wide tables and diagrams scroll within their own regions. Arrow keys scroll both regions. Desktop figures, tables, and diagram contrast were inspected in the collaborative browser, including light and dark themes.
- Gestire's YouTube embed played the original keypad and relay demonstration. The gateway's local MP4 loads and plays at 800 × 450 with a 2.83-second duration; it was converted from the original GIF. Both local videos have native controls and no autoplay.
- The moving-average timing, simultaneous register updates, RAM clearing and pause/reset caveats were independently checked against the VHDL. Other article claims and figure captions were reviewed against the archived implementation, distinguishing original design proposals from implemented behavior.
- Astro/TypeScript checks pass for 65 files with zero errors, warnings or hints; ESLint and Prettier pass. All 19 unit tests (72 assertions), the 37-page fixture checks and landing-mode checks pass. The final production build generates 43 pages and indexes eight articles.

No hardware measurements were repeated and no deployment was performed. Asset origins and conversions are recorded in [project sources](./project-sources.md).

## Project articles — 2026-10-03

- Astro/TypeScript: 61 files, zero errors, warnings or hints. ESLint and Prettier pass.
- All 19 publication and feature-flag tests pass (72 assertions).
- Production build: 43 pages and eight English project articles indexed by Pagefind. Three featured projects appear on the homepage; the blog has no published posts.
- A separate production-output check followed 1,092 local links and media references, checked headings and metadata, and verified that no seed content remained. Portuguese project pages link to the English archive.
- The existing isolated fixture and landing-mode checks pass. An additional build reused the fixture content cache after deleting every post; no cached article reappeared. The content loader now removes deleted source entries before invoking Astro's glob loader, including when a collection becomes empty.
- All 256 copied ROM samples and all 256 moving-average outputs match the original project's Python reference.
- In the collaborative production browser, all eight articles fit a 390px viewport without horizontal overflow or broken loaded images. The filter demo was inspected on desktop and mobile; its boundary buttons, bypass toggle and keyboard-operated range input produce the expected values.
- Production search for `AES` returns the gateway article. Technology filtering updates the visible project and result count. Aditus's local video loads and plays at its original 1360 × 766 resolution; it has native controls, a local poster and no autoplay.
- Original screenshots, extracted report figures and the recreated DNS comparison chart were visually reviewed. Article ownership and measurements were independently checked against repository evidence and Miguel's clarifications.

The source projects were not modified or rerun on hardware. Historical measurements are labelled in the articles. No deployment was performed. The sections below retain the earlier redevelopment checks for reference.

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

Screenshot capture was unavailable during the initial redevelopment review; the project-article pass above used the collaborative browser and screenshots. Automated accessibility checks do not replace assistive-technology testing.

At doubled text size, Axe flags the scrollable Select viewport because Radix manages option focus with `tabindex="-1"`. Keyboard testing confirmed that End scrolls and focuses the final option, Enter selects it, and Escape dismisses the popup. Screen-reader behavior remains a manual release check.

No production deployment or Search Console submission was performed. Follow [the README’s release checklist](../README.md), then measure the populated production site and verify HTTPS, direct URLs, redirects, assets, and genuine HTTP 404 responses.
