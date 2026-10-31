// The site can live under a sub-path (GitHub Pages serves it at /<repo>), set by `base` in astro.config.mjs.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** A root-relative path ("/img/logo.webp", "/") with the site's base path in front. */
export function asset(path: string): string {
  if (path === "/") return BASE || "/";
  return `${BASE}${path}`;
}
