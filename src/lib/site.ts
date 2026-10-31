/**
 * Links the whole site shares. Placeholders (example.com, "#") are filled in before launch.
 */
export const REPO = "https://github.com/MinduLabs/quarry";

export const LINKS = {
  repo: REPO,
  issues: `${REPO}/issues`,
  security: `${REPO}/security`,
  license: `${REPO}/blob/main/LICENSE`,
  changelog: `${REPO}/blob/main/CHANGELOG.md`,
  releases: `${REPO}/releases`,
  buildFromSource: `${REPO}#development-setup`,
  supportEmail: "support@example.com",
  businessEmail: "hello@example.com",
  discussions: "#",
  discord: "#",
  x: "#",
  xHandle: "@quarry",
  privacy: "#",
  terms: "#",
} as const;
