# quarry-web

The website of [Quarry](https://github.com/MinduLabs/quarry): home, download, FAQ and contact, in
English and Vietnamese. Static HTML built with Astro. No UI framework or animation library ships to
the browser.

## Commands

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # type check, then build into dist/
pnpm preview    # serve dist/
```

Needs Node 20 or newer. Set `SITE_URL` (for example `https://quarry.dev`) when building for
production; canonical, hreflang and Open Graph links are built from it.

## Layout

| Path | What it holds |
| --- | --- |
| `src/pages/` | One file per URL. `vi/` holds the Vietnamese pages. Each only picks a view and a language. |
| `src/views/` | The pages themselves, rendered in the language they are given. |
| `src/layouts/Base.astro` | `<head>`, header, footer, theme script. |
| `src/components/` | Header, footer, and `Shot`, a screenshot in both themes. |
| `src/i18n/` | `en.ts` and `vi.ts`. The type check fails if a key is missing in one of them. |
| `src/lib/release.ts` | Reads the latest release from GitHub at build time. |
| `src/lib/site.ts` | Shared links: GitHub, emails, community. Placeholders live here. |
| `src/scripts/site.ts` | The only JavaScript: theme switch, macOS detection, copy buttons, feature stories. |
| `public/img/` | Screenshots, `<name>-<theme>.webp` at 2x and `<name>-<theme>-1x.webp` at 1x. |

## Release data

File names, sizes, links and the version come from the GitHub API when the site is built, so a new
Quarry release needs only a rebuild. If GitHub cannot be reached, the build uses
`src/data/release-snapshot.json` and prints a warning. Refresh the snapshot after a release:

```bash
curl -s https://api.github.com/repos/MinduLabs/quarry/releases/latest | python3 -c "import json,sys; d=json.load(sys.stdin); json.dump({k: d[k] for k in ('tag_name','published_at','html_url')} | {'assets': [{k: a[k] for k in ('name','size','browser_download_url')} for a in d['assets']]}, sys.stdout, indent=2)" > src/data/release-snapshot.json
```

## SEO

- Each page sets its own title and description from `page.*` keys in `src/i18n/`.
- `robots.txt` and `sitemap-index.xml` (with hreflang pairs) are generated at build from `SITE_URL`.
- Home and download carry `SoftwareApplication` JSON-LD (`src/lib/schema.ts`), without ratings.
- `public/og.jpg` (1200 × 630) is the share image for every page.

## Rules

- Every number on the site has a source. Sizes come from the release; nothing is typed in by hand.
- Motion uses `opacity` and `transform` only, and stops for `prefers-reduced-motion`.
- Screenshots are taken from a release build against a demo database, never a real one.
- Before launch, replace the placeholders in `src/lib/site.ts` (emails, Discord, X, privacy, terms).
