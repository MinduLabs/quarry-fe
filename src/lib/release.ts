import snapshot from "@/data/release-snapshot.json";

const LATEST_URL = "https://api.github.com/repos/MinduLabs/quarry/releases/latest";

interface GithubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: GithubAsset[];
}

export interface ReleaseFile {
  name: string;
  url: string;
  size: number;
}

export interface Release {
  version: string;
  publishedAt: Date;
  notesUrl: string;
  appimage: ReleaseFile;
  deb: ReleaseFile;
  flatpak: ReleaseFile;
  dmg: ReleaseFile;
  /** Smallest and largest Linux driver, in bytes. */
  linuxDrivers: { min: number; max: number };
}

/**
 * The latest release, read once per build. If GitHub cannot be reached the committed snapshot is
 * used, so a build never ships without download links.
 */
export const release: Release = toRelease(await fetchLatest());

async function fetchLatest(): Promise<GithubRelease> {
  try {
    const res = await fetch(LATEST_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    return (await res.json()) as GithubRelease;
  } catch (err) {
    console.warn(`[release] using the snapshot in src/data: ${String(err)}`);
    return snapshot;
  }
}

function toRelease(gh: GithubRelease): Release {
  const find = (test: (name: string) => boolean, label: string): ReleaseFile => {
    const asset = gh.assets.find((a) => test(a.name));
    if (!asset) throw new Error(`release ${gh.tag_name} has no ${label} file`);
    return { name: asset.name, url: asset.browser_download_url, size: asset.size };
  };
  const driverSizes = gh.assets
    .filter((a) => a.name.startsWith("quarry-driver-") && a.name.includes("linux"))
    .map((a) => a.size);
  return {
    version: gh.tag_name.replace(/^v/, ""),
    publishedAt: new Date(gh.published_at),
    notesUrl: gh.html_url,
    appimage: find((n) => n.endsWith(".AppImage"), "AppImage"),
    deb: find((n) => n.endsWith(".deb"), ".deb"),
    flatpak: find((n) => n.endsWith(".flatpak"), "Flatpak"),
    dmg: find((n) => n.endsWith(".dmg"), "dmg"),
    linuxDrivers: { min: Math.min(...driverSizes), max: Math.max(...driverSizes) },
  };
}

/** Decimal megabytes with one digit, as file managers and GitHub show them. */
export function formatMB(bytes: number, lang: string): string {
  const mb = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${mb.format(bytes / 1_000_000)} MB`;
}

export function formatDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(date);
}
