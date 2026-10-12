/**
 * Converts a watch URL into a privacy-friendly embed URL for YouTube, Vimeo
 * and Dailymotion. Used by the editor so the author can paste a normal share
 * link and still get a no-cookie, tracker-free embed.
 *
 * The returned host is always one the sanitizer allows for <iframe src>.
 */

const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;

function youtubeEmbedId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id && YOUTUBE_ID.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const paramId = url.searchParams.get("v");
    if (paramId && YOUTUBE_ID.test(paramId)) return paramId;

    const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return null;
}

function vimeoEmbedId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;

  const pathId = url.pathname.match(/\/(?:video\/)?(\d{6,12})/)?.[1];
  if (pathId) return pathId;

  // Channel / showcase links do not expose the video id in the path.
  const paramId = url.searchParams.get("v") ?? url.searchParams.get("video");
  return paramId && /^\d{6,12}$/.test(paramId) ? paramId : null;
}

function dailymotionEmbedId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "dailymotion.com" && host !== "geo.dailymotion.com") return null;

  const pathId = url.pathname.match(/\/video\/([a-zA-Z0-9]+)/)?.[1];
  if (pathId) return pathId;

  const paramId = url.searchParams.get("video");
  return paramId && /^[a-zA-Z0-9]+$/.test(paramId) ? paramId : null;
}

/**
 * Returns an embeddable URL, or null when the link is not a supported video.
 */
export function toEmbedUrl(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const startTime = url.searchParams.get("t") ?? url.searchParams.get("start");

  const youtubeId = youtubeEmbedId(url);
  if (youtubeId) {
    const query = new URLSearchParams({ rel: "0", modestbranding: "1" });
    if (startTime && /^\d+s?$/.test(startTime)) {
      query.set("start", startTime.replace(/s$/, ""));
    }
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${query.toString()}`;
  }

  const vimeoId = vimeoEmbedId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  const dailymotionId = dailymotionEmbedId(url);
  if (dailymotionId) return `https://geo.dailymotion.com/player.html?video=${dailymotionId}`;

  return null;
}