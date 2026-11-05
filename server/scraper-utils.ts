/**
 * Scraper utilities and URL builders for AniStream Hub
 */

export const SITE = process.env.SOURCE_SITE || "https://hanime.tv";

export const ANIME_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  Referer: `${SITE}/`,
};

/**
 * Normalizes slug by stripping prefixes
 */
export const cleanSlug = (slug: string): string => {
  if (!slug) return "";
  return slug
    .trim()
    .toLowerCase()
    .replace(/^series-|^movies-|^videos-|^anime-/, "")
    .replace(/[^\w-]/g, "");
};

/**
 * Builds watch page URL with consistent query params
 */
export const buildWatchUrl = (p: {
  slug: string;
  season?: number;
  ep?: number;
  server?: string;
  lang?: string;
}): string => {
  const slug = cleanSlug(p.slug);
  const q = new URLSearchParams({
    season: String(p.season ?? 1),
    ep: String(p.ep ?? 1),
    server: p.server ?? "multi-1",
    lang: p.lang ?? "hin",
  });
  return `${SITE}/videos/anime/${slug}?${q.toString()}`;
};

/**
 * Watch page URL for hentai/explicit or alternative endpoint
 */
export const buildAlternativeWatchUrl = (p: {
  slug: string;
  season?: number;
  ep?: number;
  server?: string;
  lang?: string;
}): string => {
  const slug = cleanSlug(p.slug);
  const q = new URLSearchParams({
    season: String(p.season ?? 1),
    ep: String(p.ep ?? 1),
    server: p.server ?? "multi-1",
    lang: p.lang ?? "hin",
  });
  return `${SITE}/videos/hentai/${slug}?${q.toString()}`;
};

/**
 * Upscales poster URLs from /wXXX/ to /w780/
 */
export const upscalePosterUrl = (imgUrl: string): string => {
  if (!imgUrl) return "";
  if (imgUrl.includes("/w")) {
    return imgUrl.replace(/\/w\d+\//, "/w780/");
  }
  return imgUrl;
};

/**
 * Filters out ad, tracker, and unwanted scripts from iframe sources
 */
export const isBadIframeUrl = (src: string): boolean => {
  if (!src) return true;
  const s = src.toLowerCase();
  const badPatterns = [
    "ads",
    "googletagmanager",
    "disqus",
    "google_ads",
    "/api/",
    "facebook",
    "analytics",
    "doubleclick",
    "popads",
    "adnxs",
    "track",
  ];
  if (badPatterns.some((pattern) => s.includes(pattern))) return true;
  if (s.endsWith(".json")) return true;
  return false;
};

/**
 * Extracts clean video iframe URLs (e.g. VidHide, StreamWish, FileLions, HGCloud)
 */
export const extractServersFromHtml = (
  html: string,
  cheerioInstance: any
): { name: string; url: string }[] => {
  if (!html) return [];
  const $ = cheerioInstance.load(html);
  const servers: { name: string; url: string }[] = [];
  const btnLabels: string[] = [];

  $("[data-server], .server-btn, .opt-server, button[class*='server']").each(
    (_: any, b: any) => {
      const text = $(b).text().replace(/\s+/g, " ").trim();
      if (text) btnLabels.push(text);
    }
  );

  $("iframe").each((i: number, el: any) => {
    const src = $(el).attr("src") || $(el).attr("data-src");
    if (!src) return;

    if (isBadIframeUrl(src)) return;

    const cleanSrc = src.startsWith("//") ? `https:${src}` : src;
    const label = btnLabels[i] || `Server ${i + 1}`;
    if (!servers.some((s) => s.url === cleanSrc)) {
      servers.push({ name: label, url: cleanSrc });
    }
  });

  return servers;
};
