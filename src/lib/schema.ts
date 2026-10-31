import type { Lang } from "@/i18n";
import { localePath, useT } from "@/i18n";
import { asset } from "@/lib/base";
import { release } from "@/lib/release";
import { LINKS } from "@/lib/site";

/**
 * schema.org description of the app. It carries no rating: Google shows a rich result for
 * software only with real reviews, and this markup never invents them.
 */
export function softwareApp(lang: Lang, site: URL): Record<string, unknown> {
  const t = useT(lang);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Quarry",
    description: t("meta.description"),
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Database client",
    operatingSystem: "Linux, macOS",
    softwareVersion: release.version,
    datePublished: release.publishedAt.toISOString().slice(0, 10),
    downloadUrl: new URL(localePath(lang, "/download"), site).href,
    image: new URL(asset("/og.jpg"), site).href,
    screenshot: new URL(asset("/img/hero-dark.webp"), site).href,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    sameAs: [LINKS.repo],
    inLanguage: lang,
  };
}
