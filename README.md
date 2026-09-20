# Miguel Vila’s website

A personal portfolio and journal built with Astro, Tailwind, and Markdown/MDX. English lives at `/`; European Portuguese lives at `/pt/`. Content is stored in Git. Both languages use the same layouts, with optional article and project translations.

## Development

Use Bun 1.3.14 and Node.js 22 or later.

```sh
bun install --frozen-lockfile
bun run dev
```

The local development server includes drafts and future-dated entries, with preview labels and `noindex` metadata. The site starts with empty archives: no sample project or opinion is published on your behalf.

```sh
bun run check        # Astro and TypeScript diagnostics
bun run lint
bun run format:check
bun run test         # Publication and URL behavior
bun run build        # Static site, then Pagefind when content exists
bun run preview      # Preview the real production output
bun run test:site    # Isolated fixture build and generated-site checks
bun run verify       # All checks, production build, and fixture checks
```

Search indexes are generated after a production build. Use `bun run build` and `bun run preview` to test search. The development server does not have a search index; search shows a recoverable error if you search populated development content. Empty archives display an intentional empty state without requesting an index.

## Feature flags

Optional site areas are controlled at build time with environment variables. Home is always built.

```sh
FEATURE_FLAGS=landing bun run build  # home-only landing site
FEATURE_FLAGS=all bun run build      # full site, also the default
FEATURE_FLAGS=blog,projects bun run build
```

`FEATURE_FLAGS=landing` and `FEATURE_FLAGS=none` disable Blog, Projects, About, Search, entries, tags, feeds, and search indexing. Disabled routes are not generated, so production serves them as real 404s. Individual flags override the bulk value: `FEATURE_BLOG=false`, `FEATURE_PROJECTS=false`, `FEATURE_ABOUT=false`, and `FEATURE_SEARCH=false` also accept `true/false`, `1/0`, `yes/no`, and `on/off`. Search only builds when enabled and at least one searchable content area, Blog or Projects, is enabled.

## Docker deployment

The Docker setup builds the static Astro site with Bun, then serves the generated `dist/` directory from nginx.

```sh
cp .env.example .env
# Edit FEATURE_FLAGS, SITE_PORT, and optional individual feature flags.
docker compose up --build -d
```

Feature flags are build-time values because they control generated routes and the Pagefind search index. After changing `FEATURE_FLAGS`, `FEATURE_BLOG`, `FEATURE_PROJECTS`, `FEATURE_ABOUT`, or `FEATURE_SEARCH`, rebuild the image with `docker compose up --build -d`. The container listens on port 80; `SITE_PORT` controls the host port, defaulting to `8080`.

## Publish a post or project

Copy a template from `docs/templates/` into the appropriate collection. Both Markdown (`.md`) and MDX (`.mdx`) are supported.

```text
src/content/
  posts/
    en/my-article.md
    pt/o-meu-artigo.md
  projects/
    en/my-project.md
    pt/o-meu-projeto.md
  assets/
    project-cover.jpg
```

Filenames use lowercase ASCII letters, numbers, and hyphens. Use one file directly inside the language directory; nested content directories and the reserved slugs `index` and `page` are rejected. English posts retain `/posts/my-article/`; Portuguese posts use `/pt/posts/o-meu-artigo/`. The same convention applies to projects.

Required common fields: `title`, `description`, `language`, and `publishedDate`. Projects also require `status` (`in-progress`, `completed`, or `archived`). New entries default to `draft: true`, even if the field is omitted.

1. Write and review the content locally. Use `##` for the first section heading: the page already provides the article’s `h1`.
2. Set `draft: false` and choose the publication date.
3. Run `bun run verify`, review the production preview, and commit the content and its assets.
4. Deploy the generated `dist/` directory using the existing host.

Production includes an entry only when `draft` is false and `publishedDate` is at or before the build time. This rule governs page generation, archives, home, related content, feeds, topics, and search. A future-dated entry becomes public **after a new build**, not automatically when its date arrives. Use a date-only value for midnight UTC or an ISO timestamp with a timezone for an exact time. Optional `updatedDate` must be on or after `publishedDate` and should represent a substantial update.

The homepage shows up to three projects marked `featured: true`, sorted by `featuredOrder` (lowest first), then publication date and ID. Latest writing includes the five newest posts, regardless of `featured`. Blog and topic archives paginate at 12 entries; the project archive lists each project once and filters by technology.

### Translations

Each entry declares `language: en` or `language: pt`, matching its directory. To connect translations, give both entries the same `translationKey` within their collection. Their filenames and publication dates can differ. Only one entry per language may use a given translation key.

Translations are optional. The selector links directly to an available translation. Otherwise it explicitly offers the other-language archive; no missing translation URL or fabricated alternate is generated. Each translation has its own canonical URL and reciprocal `hreflang` metadata. Topic labels are author-defined, so equivalence between differently named topics is not inferred.

UI translations live in `src/lib/i18n.ts`; URL and publication conventions live in `src/lib/publishing.ts`. The shared page registry is in `src/lib/routes.ts`.

### Images and downloads

Keep content images in `src/content/assets/` and reference them relative to the Markdown file, for example `coverImage: ../../assets/project-cover.jpg`. Astro validates local image paths and generates dimensioned responsive images. A cover requires `coverImageAlt`. Entries without a cover render without a placeholder image.

Projects can include a gallery:

```yaml
gallery:
  - image: ../../assets/project-detail.jpg
    alt: A useful description of what the screenshot communicates.
    caption: Additional context for the reader.
```

Gallery images link to the full-size asset and do not autoplay. Prefer ordinary Markdown image syntax for images inside prose. Keep tables and code blocks within the article; they scroll independently on narrow screens.

An optional `shareImage` supplies a dedicated raster social image. Otherwise the site uses the branded default in `public/images/social-card.png`. Its source and generator are included; run `bun run social-card` to regenerate it. A 1200 × 630 PNG or JPEG is recommended for custom share images.

For downloads, place the file in `public/downloads/` and link to it from Markdown, or import `src/components/DownloadButton.astro` in MDX. Content links must point to files that actually exist.

### Related writing and topics

Posts can declare `relatedProjects: [en/my-project]`. IDs include the project’s language directory. Only visible projects are linked; a public post referencing a draft project will not reveal it. Project pages show posts in the same language that reference that project. Other related posts share at least one topic and are limited to three.

Tags become locale-specific topic archives. Accents are normalized in their URLs, for example `Programação` becomes `programacao`. Use consistent tag names. Source-code and live-project links are optional.

## Navigation, accessibility, and appearance

Desktop navigation begins at 1024px. The header uses shadcn/ui’s Dialog for search, Dropdown Menu for appearance, and Sheet for mobile navigation. Search and project filters use the shared Input, Select, Label, and Button components. React hydrates these interactive controls; the page content stays in Astro. A native navigation disclosure and archive links remain available without JavaScript.

Use the components in `src/components/ui/` for new controls, menus, and overlays. They come from the official shadcn registry and use Radix primitives. Add components with `bunx shadcn@latest add <component>`; keep imports of `cn` pointed at `@/lib/utils`. The Tailwind theme tokens map to the existing site palette in `src/styles/global.css`. Keep element-level resets in `@layer base` so they do not override component utilities. `tw-animate-css` supplies the standard open/close animations.

Appearance supports Light, Dark, and a persistent System preference, including operating-system changes and cross-tab synchronization. Without JavaScript, CSS follows the operating-system theme.

The hero retains its Fira Code typography, pixel portrait, social links, and caffeine introduction. On desktop, its text aligns with the page frame and the portrait sits on the right; on mobile, it stays stacked. Homepage descriptions use larger, higher-contrast text. The logo underscore blinks, and the hero and 404 retain the breathing orange glow. The original orange is `oklch(0.7353 0.1825 52.7591)`; a darker shade of the same hue keeps small text readable on light backgrounds. Articles use Source Sans 3 for reading and Fira Code for technical details. Fonts are self-hosted. Decorative motion respects reduced-motion preferences. Article headings include static permalink anchors, and articles with at least three section headings (`h2` or `h3`) have a contents list.

## Search and feeds

The header’s search icon opens an animated shadcn Dialog in the current language. Escape, the close button, or a click on the backdrop closes it and returns focus to the trigger. Ctrl/Cmd+K opens search too. The query stays in the dialog without changing the current page URL. The `/search/` and `/pt/search/` routes remain available for direct links and the no-JavaScript archive fallback.

Pagefind indexes only published entry bodies. Header, footer, contents navigation, and related links are excluded. The index downloads only after a query, for the current document language (`en` or `pt-PT`). Search supports content-type filtering, query URLs, pagination of results, error recovery, and archive links when JavaScript is unavailable.

Feeds live at `/rss.xml` and `/pt/rss.xml`, containing article summaries and links. The sitemap index is `/sitemap-index.xml`; only public, indexable pages appear in `/sitemap-0.xml`. Entry modification dates come from content metadata. Search and error pages use `noindex`. Former prototype pages are not built.

## Test content and visual review

`tests/fixtures/` contains synthetic examples, clearly labeled as tests. `bun run test:site` copies them into ignored `.test-content/`, adds pagination fixtures, and builds to ignored `.test-dist/` using a separate cache. It never writes into `src/content/` or replaces the production `dist/` directory.

For a populated visual preview, first run the fixture check, then:

```sh
python3 -m http.server 4322 --directory .test-dist
```

This is a test preview; deploy **only `dist/`**. Never set `SITE_TEST_CONTENT=1` in deployment configuration. The test output includes an accessibility audit dependency under `/_test/` that is absent from production.

Generated-site checks cover links and image targets, one main heading/landmark, duplicate IDs, metadata, reciprocal translation links, pagination, draft/scheduled exclusion, related content, feeds, and sitemap membership. Browser review should cover 320, 390, 768, 1024, and 1440px; both languages and themes; reduced motion; enlarged text; keyboard, touch, and no-JavaScript navigation; and search recovery.

## Release

GitHub Actions runs `bun run verify` for pushes and pull requests. Deployment is intentionally independent of the checks workflow because this repository does not describe the existing hosting service.

Before launch:

- Publish real project write-ups and articles; review both interface languages and any translations you provide.
- Configure the existing host to build with `bun run build` and publish `dist/`.
- Serve directory indexes and static assets directly. Use `404.html` for unknown URLs with HTTP status 404; configure `/pt/404/index.html` for Portuguese paths if the host supports localized error handling.
- Redirect the `www` host to `https://miguelovila.pt/` and verify HTTPS on both hosts. Normalize directory URLs with trailing slashes.
- Confirm the homepage, direct article URLs, images, fonts, search index/WASM assets, feeds, robots file, and sitemap return successful responses. Check that missing URLs return a genuine 404.
- Measure the populated production site and inspect metadata/structured data.
- Verify ownership in Google Search Console and submit `https://miguelovila.pt/sitemap-index.xml`.

At the initial audit, the configured public host returned 404 for the root, robots file, and sitemap. Hosting access and Search Console ownership are not configured here; deployment and sitemap submission require those services.
