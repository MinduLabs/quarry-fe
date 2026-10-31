// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Absolute URLs (canonical, hreflang, Open Graph, sitemap) are built from this. Set SITE_URL in CI.
  site: process.env.SITE_URL ?? "https://example.com",
  // Sub-path the site is served under, e.g. "/quarry-fe" on GitHub Pages. Leave unset at a domain root.
  base: process.env.BASE_PATH || undefined,
  trailingSlash: "never",
  build: { format: "file" },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", vi: "vi" } },
    }),
  ],
});
