# Miguel Vila’s website

My personal website and project portfolio at [miguelovila.pt](https://miguelovila.pt), with project write-ups, an About page, and support for blog posts. Available in English at `/` and European Portuguese at `/pt/`.

## How it is built

- **Astro and TypeScript** generate the static pages.
- **Tailwind CSS** handles styling; **React and shadcn/ui** provide interactive controls.
- **Markdown and MDX** store posts and projects alongside their images.
- **Pagefind** provides search without a backend.

The production build outputs HTML, assets, feeds, sitemaps, and the search index to `dist/`. Docker packages the site with nginx.

## Development

Use **Bun 1.3.14** and **Node.js 22**.

```sh
bun install --frozen-lockfile
bun run dev
```

Open [localhost:4321](http://localhost:4321). The development server includes drafts and scheduled entries.

### Checks

```sh
bun run check          # Astro and TypeScript
bun run lint           # ESLint
bun run format:check   # Prettier
bun run test           # Unit tests
bun run verify         # All checks, production build, and site tests
```

To test search and the production output:

```sh
bun run build
bun run preview
```

Pagefind generates its index during the production build, so search requires the build and preview workflow.

### Content

Posts live in `src/content/posts/` and projects in `src/content/projects/`. Start with a template from [docs/templates/](docs/templates/). Keep each entry’s translations and images together:

```text
src/content/projects/my-project/
  en.mdx
  pt.mdx
  assets/
    cover.jpg
```

Both `.md` and `.mdx` are supported. Set `language` to match the filename and use the same `translationKey` for both translations. Reference images with relative paths such as `./assets/cover.jpg`.

To publish an entry, set `draft: false` and a `publishedDate` at or before the build time. Scheduled entries require a new build when their publication date arrives.

## Production

### Docker Compose

Requires Docker with Compose. For the initial setup, copy the example configuration:

```sh
cp .env.example .env
```

Edit `.env` as needed:

| Variable                           | Purpose                                                    |
| ---------------------------------- | ---------------------------------------------------------- |
| `SITE_PORT`                        | Host port; defaults to `8080`.                             |
| `FEATURE_FLAGS`                    | `all` by default; `landing` builds only the homepages.     |
| `FEATURE_BLOG`, `FEATURE_PROJECTS` | Optional `true` or `false` overrides for content areas.    |
| `FEATURE_ABOUT`, `FEATURE_SEARCH`  | Optional `true` or `false` overrides for About and search. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION`  | Optional Google Search Console verification token.         |

Build and start the site:

```sh
docker compose up --build -d
```

The site is available at [localhost:8080](http://localhost:8080) by default. nginx serves the generated files on container port 80. Configure HTTPS through the hosting provider or reverse proxy.

Feature flags and the verification token are applied at build time. Run the same command after changing them or updating the site.

### Static hosting

```sh
bun install --frozen-lockfile
bun run build
```

Deploy `dist/` to a static host. Enable directory indexes and serve unknown paths with HTTP status 404 using `404.html`, or `pt/404/index.html` for Portuguese paths. The included [nginx configuration](docker/nginx.conf) also handles caching and the redirect from `www.miguelovila.pt` to `miguelovila.pt`.

GitHub Actions runs the verification suite and Docker checks on pushes and pull requests. Deployment is configured separately on the host.
