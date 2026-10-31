import { type Dict, type Key, en } from "./en";
import { vi } from "./vi";

export const LOCALES = ["en", "vi"] as const;
export type Lang = (typeof LOCALES)[number];

const DICTS: Record<Lang, Dict> = { en, vi };

/** A translator bound to one language. `{name}` placeholders are filled from `vars`. */
export function useT(lang: Lang) {
  const dict = DICTS[lang];
  return (key: Key, vars: Record<string, string | number> = {}): string =>
    dict[key].replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** The URL of a page in a language: "/download" stays as is in English, becomes "/vi/download". */
export function localePath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  return path === "/" ? "/vi" : `/vi${path}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "vi" : "en";
}
