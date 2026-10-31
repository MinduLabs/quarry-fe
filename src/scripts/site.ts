const isMac = /Macintosh|Mac OS X/.test(navigator.userAgent);

// A manual theme overrides the system one, so each <source> stops following the media query.
function applyTheme(theme: string | undefined): void {
  const media = theme === "light" ? "all" : theme === "dark" ? "not all" : "(prefers-color-scheme: light)";
  for (const s of document.querySelectorAll<HTMLSourceElement>("source[data-theme-src]")) s.media = media;
}
applyTheme(document.documentElement.dataset.theme);
document.getElementById("theme")?.addEventListener("click", () => {
  const isLightNow = getComputedStyle(document.documentElement).colorScheme === "light";
  const next = isLightNow ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  applyTheme(next);
});

// Linux is the default in the HTML; a Mac swaps in its own file, label and shortcut keys.
if (isMac) {
  for (const a of document.querySelectorAll<HTMLAnchorElement>("[data-mac-href]")) a.href = a.dataset.macHref ?? a.href;
  for (const el of document.querySelectorAll<HTMLElement>("[data-mac-text]")) el.textContent = el.dataset.macText ?? "";
  for (const el of document.querySelectorAll(".js-mod")) el.textContent = "⌘";
  const radio = document.getElementById("os-mac");
  if (radio instanceof HTMLInputElement) radio.checked = true;
}

for (const btn of document.querySelectorAll<HTMLButtonElement>(".copy")) {
  btn.addEventListener("click", async () => {
    const text = btn.previousElementSibling?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    const label = btn.textContent;
    btn.textContent = btn.dataset.copied ?? label;
    setTimeout(() => {
      btn.textContent = label;
    }, 1400);
  });
}

// The story crossing the middle of the screen owns the stage; CSS fades between them over 500ms.
const stories = [...document.querySelectorAll(".story")];
const stageShots = [...document.querySelectorAll(".stage .shot")];
if (stories.length > 0 && stageShots.length > 0) {
  const activate = (i: number) => {
    stories.forEach((s, j) => s.classList.toggle("is-active", i === j));
    stageShots.forEach((s, j) => s.classList.toggle("is-active", i === j));
  };
  activate(0);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activate(stories.indexOf(e.target));
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );
  for (const s of stories) io.observe(s);
}
