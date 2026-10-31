// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Absolute URLs (canonical, hreflang, Open Graph, sitemap) are built from this. Set SITE_URL in CI.
  site: process.env.SITE_URL ?? "https://example.com",
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
