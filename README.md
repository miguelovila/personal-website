# Miguel Vila’s website

A personal portfolio and journal built with Astro, Tailwind, and Markdown/MDX. English lives at `/`; European Portuguese lives at `/pt/`. Content is stored in Git. Both languages use the same layouts, with optional article and project translations.

## Development

Use Bun 1.3.14 and Node.js 22 or later.

```sh
bun install --frozen-lockfile
bun run dev
```

The local development server includes drafts and future-dated entries, with preview labels and `noindex` metadata. The project archive contains eight articles about my university work, each available in English and European Portuguese. The blog is empty, and synthetic content lives only in the test fixtures.

[Project source notes](docs/project-sources.md) record the evidence, contributions and asset origins for each article. Images, the Aditus recording and the moving-average demo's ROM samples live in this repository; sibling project directories are not required to build the site. Gestire and the AES gateway embed their demonstrations from YouTube, with direct viewing links. The build does not need to download those external videos.

```sh
bun run check        # Astro and TypeScript diagnostics
bun run lint
bun run format:check
bun run test         # Publication and URL behavior
bun run build        # Static site, then Pagefind when content exists
bun run preview      # Preview the real production output
bun run test:production # Crawl the real dist/ pages, links and media
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

`PUBLIC_GOOGLE_SITE_VERIFICATION` is also passed into the image at build time. Set it in `.env` when using Google's HTML-tag verification method, then rebuild. nginx revalidates HTML and search files after deployments; fingerprinted Astro assets retain immutable caching. Directory redirects are relative, so they preserve the public scheme and port behind a reverse proxy.

## Publish a post or project

Copy a template from `docs/templates/` into the appropriate collection. Both Markdown (`.md`) and MDX (`.mdx`) are supported.

```text
src/content/
  posts/
    my-article/
      en.md
      pt.md
      assets/
        article-cover.jpg
  projects/
    my-project/
      en.mdx
      pt.mdx
      assets/
        project-cover.jpg
```

Keep each entry's writing and assets in one directory. The directory name is its URL slug, using lowercase ASCII letters, numbers, and hyphens; translations are named `en.md` and `pt.md` (or `.mdx`). English posts retain `/posts/my-article/`; Portuguese posts use `/pt/posts/my-article/`. The same convention applies to projects. The reserved slugs `index` and `page` and deeper content nesting are rejected.

The older language-first layout, such as `posts/en/my-article.md` and `posts/pt/o-meu-artigo.md`, is also supported, including different translated slugs. Both layouts retain language-first content IDs such as `en/my-project`, so moving an entry into its own directory does not change its URL or related-content references. Use only one layout for each content ID. For the language names `en` or `pt` as URL slugs, use the language-first layout to avoid ambiguous paths.

Required common fields: `title`, `description`, `language`, and `publishedDate`. Projects also require `status` (`in-progress`, `completed`, or `archived`). New entries default to `draft: true`, even if the field is omitted.

1. Write and review the content locally. Use `##` for the first section heading: the page already provides the article’s `h1`.
2. Set `draft: false` and choose the publication date.
3. Run `bun run verify`, review the production preview, and commit the content and its assets.
4. Deploy the generated `dist/` directory using the existing host.

Production includes an entry only when `draft` is false and `publishedDate` is at or before the build time. This rule governs page generation, archives, home, related content, feeds, topics, and search. A future-dated entry becomes public **after a new build**, not automatically when its date arrives. Use a date-only value for midnight UTC or an ISO timestamp with a timezone for an exact time. Optional `updatedDate` must be on or after `publishedDate` and should represent a substantial update.

The homepage shows up to three projects marked `featured: true`, sorted by `featuredOrder` (lowest first), then publication date and ID. Latest writing includes the five newest posts, regardless of `featured`. Blog and topic archives paginate at 12 entries; the project archive lists each project once and filters by technology.

### Translations

Each entry declares `language: en` or `language: pt`, matching its filename (or language directory in the older layout). To connect translations, give both entries the same `translationKey` within their collection. Their slugs and publication dates can differ. Only one entry per language may use a given translation key.

Translations are optional. The selector links directly to an available translation. Otherwise it explicitly offers the other-language archive; no missing translation URL or fabricated alternate is generated. Each translation has its own canonical URL and reciprocal `hreflang` metadata. Topic labels are author-defined, so equivalence between differently named topics is not inferred.

UI translations live in `src/lib/i18n.ts`; URL and publication conventions live in `src/lib/publishing.ts`. The shared page registry is in `src/lib/routes.ts`.

The eight project pairs share a project directory, assets and `translationKey` values. Keep code identifiers, measured values, ownership and media consistent between versions. Translate titles, descriptions, figure captions, alternative text and diagram labels as well as the prose. Original project screenshots retain their original text; the recreated DNS chart has a separate Portuguese SVG.

`ProjectFigure`, `YouTubeEmbed` and `MermaidDiagram` select their interface labels from the page URL. For the interactive filter, pass the language explicitly: `<MovingAverageDemo language="pt" client:visible />`. Its default is English; the Portuguese version also uses a decimal comma in the calculation.

### About page

The English and European Portuguese stories live in `src/components/about/story-en.astro` and `story-pt.astro`. The shared layout is `src/components/pages/about.astro`; introductory copy and the education summary live in `src/lib/i18n.ts`. The biography is based on Miguel's interview and résumé, with an ongoing master's and research at Instituto de Telecomunicações during 2023–2026. Keep both versions consistent when updating these details.

Named projects link to published entries in the current language. If an entry is absent or projects are disabled, its name remains plain text. This also keeps the About page usable with fixture content and in About-only builds.

### Images and downloads

Keep images in the entry's `assets/` directory beside its translations and reference them relative to the Markdown file, for example `coverImage: ./assets/project-cover.jpg`. Astro validates local image paths and generates dimensioned responsive images. A cover requires `coverImageAlt`. Entries without a cover render without a placeholder image.

Projects can include a gallery:

```yaml
gallery:
  - image: ./assets/project-detail.jpg
    alt: A useful description of what the screenshot communicates.
    caption: Additional context for the reader.
```

Gallery images link to the full-size asset. Ordinary Markdown image syntax works inside prose. For a captioned figure with responsive sizing and a full-size link, use `ProjectFigure` in MDX as described below. Place figures beside the explanation they support and avoid repeating the same images in a gallery.

An optional `shareImage` supplies a dedicated raster social image. Otherwise the site uses the branded default in `public/images/social-card.png`. Its source and generator are included; run `bun run social-card` to regenerate it. A 1200 × 630 PNG or JPEG is recommended for custom share images.

For downloads, place the file in `public/downloads/` and link to it from Markdown, or import `src/components/DownloadButton.astro` in MDX. Content links must point to files that actually exist.

### Figures, video and diagrams in MDX

Use `.mdx` when an article needs these components. Put imports after the frontmatter. `ProjectFigure` takes an imported image, descriptive `alt` text and a `caption`; the optional `portrait` flag constrains tall phone screenshots. Astro generates responsive image variants, while the figure links to the original asset.

```mdx
import ProjectFigure from "@/components/content/ProjectFigure.astro";
import discovery from "./assets/nearby-doors.png";
import progress from "./assets/unlock-progress.png";

<div className="project-figure-grid">
  <ProjectFigure
    src={discovery}
    alt="Nearby doors with their Bluetooth signal strength."
    caption="Discovery orders the doors by received signal strength."
    portrait
  />
  <ProjectFigure
    src={progress}
    alt="The app showing authentication in progress."
    caption="The unlock controller reports each stage to the screen."
    portrait
  />
</div>
```

Use `project-figure-grid` for a related pair of figures; it stacks on narrow screens. A single `ProjectFigure` needs no wrapper. Original diagrams, screenshots and photos should retain clear source attribution in [project-sources.md](docs/project-sources.md). Label mockups, reconstructed charts and historical measurements in the article itself.

`YouTubeEmbed` takes `videoId`, `title` and `caption`. It embeds the player from `youtube-nocookie.com`, loads lazily and includes a direct YouTube link. Its default layout is portrait for Shorts; pass `portrait={false}` for a landscape recording.

```mdx
import YouTubeEmbed from "@/components/content/YouTubeEmbed.astro";

<YouTubeEmbed
  videoId="Ew3Ff9O0Odw"
  title="Gestire smart-locker hardware demonstration"
  caption="The original controller responding to a keypad code."
/>
```

For local recordings, use a native `<video controls playsInline preload="none">` element with a poster, dimensions, an accessible label and a nearby description or transcript appropriate to the recording. Keep a direct fallback link and omit autoplay. Import new recordings from the entry's `assets/` directory with `?url`. The existing Aditus recording and poster remain in `public/project-media/aditus/` to preserve their published direct URLs.

`MermaidDiagram` uses `beautiful-mermaid` to render SVG during the build. It takes `source`, `label` and `caption` and allows keyboard scrolling when the diagram is wide. Rendering needs no client-side diagram script or remote fonts.

```mdx
import MermaidDiagram from "@/components/content/MermaidDiagram.astro";

<MermaidDiagram
  label="A controller checking a pickup code"
  caption="The controller requests an operation from the API."
  source={`sequenceDiagram
    participant Locker as ESP32
    participant API as Flask API
    Locker->>API: Pickup code
    API-->>Locker: Compartment and operation`}
/>
```

Use simple flowchart or sequence-diagram syntax and validate it with `bun run build`. `beautiful-mermaid` supports a subset of Mermaid syntax, so advanced Mermaid directives or extensions may not work. Diagrams use this MDX component; fenced `mermaid` blocks remain code blocks.

### Tables and code

Write tables with normal Markdown syntax. The build's `rehype-tables` plugin automatically adds a labelled, keyboard-focusable horizontal scroll region and column-header scope. Shared styles provide cell spacing, row stripes and numeric alignment; authors do not need to add a scroll wrapper. Code blocks scroll independently on narrow screens as well.

### Related writing and topics

Posts can declare `relatedProjects: [en/my-project]`. IDs always begin with the project’s language, regardless of the source directory layout. Only visible projects are linked; a public post referencing a draft project will not reveal it. Project pages show posts in the same language that reference that project. Other related posts share at least one topic and are limited to three.

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

## Google Search Console and SEO

The technical pieces Google needs are generated with the site:

- `https://miguelovila.pt/robots.txt` allows crawling and points to the sitemap index.
- `https://miguelovila.pt/sitemap-index.xml` points to the concrete URL sitemap.
- `https://miguelovila.pt/sitemap-0.xml` lists public, indexable URLs and their language alternates.
- Every generated page has a canonical URL, a unique title and description, and reciprocal `hreflang` links when translations exist.
- Topic descriptions name the topic, and later archive pages include their page number. Open Graph and Twitter metadata use the same page title and description, with the sharing image’s dimensions and alternative text.
- Indexable pages allow large image previews with `max-image-preview:large`; search, error and development pages remain `noindex`.
- The About pages describe Miguel as the main entity of a `ProfilePage`, linked to the existing `Person` and `WebSite` data. Project entries use `CreativeWork` and blog entries use `BlogPosting`.

These choices follow Google’s guidance on [page-specific descriptions](https://developers.google.com/search/docs/appearance/snippet), [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [profile pages](https://developers.google.com/search/docs/appearance/structured-data/profile-page), and [image-preview controls](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag). Structured data and preview permissions help describe the site; they do not guarantee enhanced search results or higher rankings.

To register the site in Google Search Console:

1. Add a Domain property for `miguelovila.pt` when you can edit DNS. This covers HTTPS, HTTP, `www`, and any subdomains.
2. If DNS is not convenient, add a URL-prefix property for `https://miguelovila.pt/`.
3. For the HTML tag verification method, copy only the token from the tag’s `content` attribute into `PUBLIC_GOOGLE_SITE_VERIFICATION`, then rebuild and deploy. Leave this unset if you verify by DNS.
4. Submit `https://miguelovila.pt/sitemap-index.xml` in the Sitemaps report.
5. Use URL Inspection for `https://miguelovila.pt/` and any important new pages after deployment. Check that the live fetch succeeds and the canonical URL is the one you expect.

Search Console helps Google discover and diagnose the site; it does not guarantee ranking. Ranking depends mostly on useful, specific pages, clear internal links, freshness where relevant, and reputable external links. If production is built with `FEATURE_FLAGS=landing`, only `/` and `/pt/` are discoverable, so publish the blog, projects, or about pages before expecting visibility beyond name searches.

## Test content and visual review

`tests/fixtures/` contains synthetic examples, clearly labeled as tests. `bun run test:site` copies them into ignored `.test-content/`, adds pagination fixtures, and builds to ignored `.test-dist/` using a separate cache. It never writes into `src/content/` or replaces the production `dist/` directory.

For a populated visual preview, first run the fixture check, then:

```sh
python3 -m http.server 4322 --directory .test-dist
```

This is a test preview; deploy **only `dist/`**. Never set `SITE_TEST_CONTENT=1` in deployment configuration. The test output includes an accessibility audit dependency under `/_test/` that is absent from production.

Generated-site checks cover links and image targets, one main heading/landmark, duplicate IDs, metadata, reciprocal translation links, pagination, draft/scheduled exclusion, related content, feeds, and sitemap membership. Browser review should cover 320, 390, 768, 1024, and 1440px; both languages and themes; reduced motion; enlarged text; keyboard, touch, and no-JavaScript navigation; and search recovery.

## Release

GitHub Actions runs `bun run verify`, builds the Docker image and tests its health, routes, redirects, verification tag and bilingual 404 responses for pushes and pull requests. Deployment is independent of the checks workflow because this repository does not describe the existing hosting service. The latest audit, including remaining dependency advisories, is recorded in [verification notes](docs/verification.md).

Before launch:

- Make the DETI coins, Weather Station, anomaly-detection and BUD repositories public, as planned. Their source and report links currently return 404 to anonymous visitors.
- Configure the existing host to build with `bun run build` and publish `dist/`.
- Serve directory indexes and static assets directly. Use `404.html` for unknown URLs with HTTP status 404; configure `/pt/404/index.html` for Portuguese paths if the host supports localized error handling.
- Redirect the `www` host to `https://miguelovila.pt/` and verify HTTPS on both hosts. Normalize directory URLs with trailing slashes.
- Confirm the homepage, direct article URLs, images, fonts, search index/WASM assets, feeds, robots file, and sitemap return successful responses. Check that missing URLs return a genuine 404.
- Measure the populated production site and inspect metadata/structured data.
- Verify ownership in Google Search Console and submit `https://miguelovila.pt/sitemap-index.xml`.

The public-host check on 2026-10-04 returned HTTP 200 for the HTTPS apex homepage, robots file and both sitemap files; HTTP redirects to HTTPS. The public sitemap still describes the older landing deployment. `http://www.miguelovila.pt/` returns 404, and HTTPS `www` serves Traefik's default certificate rather than a certificate valid for that hostname. DNS already resolves: configure the `www` router, certificate and redirect at the hosting layer. Search Console ownership and sitemap submission require access to Google Search Console.
