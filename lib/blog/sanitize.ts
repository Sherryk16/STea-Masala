/**
 * Allow-list HTML sanitizer for blog post bodies.
 *
 * The rich text editor stores HTML, and the public post page renders it. Even
 * though only the owner can reach the editor, the content is still untrusted
 * input at render time, so everything is filtered here on the way in.
 *
 * Strategy:
 *  - fully remove the *contents* of dangerous containers (script, style, ...)
 *  - drop any tag that is not on the allow-list (keeping its inner text)
 *  - drop any attribute that is not on the per-tag allow-list, including every
 *    `on*` handler, every `data-*` attribute and every `style` attribute
 *  - validate every URL against a scheme / host allow-list
 *  - balance tags so the output can never break out of the page structure
 */

const VOID_TAGS = new Set(["br", "hr", "img", "wbr"]);

type AttrKind = "url" | "videoUrl" | "imageUrl" | "text" | "bool" | "number" | "enum";

type AttrSpec = Record<string, AttrKind>;

const ALLOWED_TAGS: Record<string, AttrSpec> = {
  p: {},
  br: {},
  hr: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  strong: {},
  b: {},
  em: {},
  i: {},
  u: {},
  s: {},
  sup: {},
  sub: {},
  mark: {},
  small: {},
  ul: {},
  ol: {},
  li: {},
  blockquote: { cite: "url" },
  pre: {},
  code: {},
  a: { href: "url", title: "text" },
  img: { src: "imageUrl", alt: "text", title: "text", width: "number", height: "number" },
  figure: {},
  figcaption: {},
  iframe: { src: "videoUrl", title: "text", width: "number", height: "number" },
  video: { src: "videoUrl", poster: "imageUrl", controls: "bool", width: "number", height: "number" },
  table: {},
  thead: {},
  tbody: {},
  tr: {},
  th: {},
  td: {},
};

/** Tags whose contents must be discarded entirely, not just the tag itself. */
const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "noscript",
  "template",
  "object",
  "embed",
  "applet",
  "base",
  "link",
  "meta",
  "title",
  "head",
  "html",
  "body",
  "form",
  "input",
  "button",
  "select",
  "option",
  "textarea",
  "svg",
  "math",
  "canvas",
  "source",
  "track",
  "picture",
]);

const SAFE_LINK_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Hosts allowed to serve <iframe> video embeds. */
const VIDEO_EMBED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
  "www.vimeo.com",
  "geo.dailymotion.com",
  "www.dailymotion.com",
]);

/** Control characters plus whitespace, which can be used to smuggle schemes. */
const URL_NOISE = /[\u0000-\u0020\u007F]/g;

function isRelativeUrl(value: string): boolean {
  return !/^[a-z][a-z0-9+.-]*:/i.test(value) && !value.startsWith("//");
}

function parseUrl(value: string): URL | null {
  const cleaned = value.replace(URL_NOISE, "");
  if (!cleaned) return null;

  try {
    return new URL(cleaned, "https://steamasala.com");
  } catch {
    return null;
  }
}

/**
 * URL allow-list for `<a href>` and `<blockquote cite>`.
 * Returns the value to emit, or null to reject it.
 */
function sanitizeLinkUrl(rawValue: string): string | null {
  if (isRelativeUrl(rawValue)) {
    // Only allow site-relative paths, never protocol-relative "//evil.com".
    return rawValue.startsWith("/") ? rawValue : null;
  }

  const url = parseUrl(rawValue);
  if (!url || !SAFE_LINK_SCHEMES.has(url.protocol)) return null;
  return url.href;
}

/** Hosts allowed to serve <img src>. */
const OWN_HOSTS = new Set(["steamasala.com", "www.steamasala.com"]);

/** Any Supabase project host, e.g. abc.supabase.co / abc.supabase.in. */
const SUPABASE_HOST_SUFFIXES = [".supabase.co", ".supabase.in"];

function isAllowedImageHost(hostname: string): boolean {
  if (OWN_HOSTS.has(hostname)) return true;
  if (SUPABASE_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) return true;

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl) return false;

  try {
    return new URL(projectUrl).hostname === hostname;
  } catch {
    return false;
  }
}

/**
 * URL allow-list for `<img src>`. Images must live on the site's own origin or
 * on a Supabase host, which keeps `next/image` remote patterns small and stops
 * the blog from being used as a proxy for third-party tracking pixels.
 */
function sanitizeImageUrl(rawValue: string): string | null {
  const url = parseUrl(rawValue);
  if (!url) return null;
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  return isAllowedImageHost(url.hostname) ? url.href : null;
}

/**
 * Public form of the image URL check, used to validate a cover image before it
 * is ever written to the database.
 */
export function isAllowedImageUrl(rawValue: unknown): boolean {
  return typeof rawValue === "string" && sanitizeImageUrl(rawValue) !== null;
}

/**
 * URL allow-list for `<iframe src>` and `<video src>`: absolute https URLs on a
 * known video host, or an object on the configured Supabase project.
 */
function sanitizeVideoUrl(rawValue: string): string | null {
  if (isRelativeUrl(rawValue)) return null;

  const url = parseUrl(rawValue);
  if (!url || url.protocol !== "https:") return null;

  if (VIDEO_EMBED_HOSTS.has(url.hostname)) return url.href;

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (projectUrl) {
    try {
      const project = new URL(projectUrl);
      if (url.hostname === project.hostname) return url.href;
    } catch {
      /* fall through to the reject */
    }
  }

  return null;
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseAttributes(raw: string): Array<[string, string | true]> {
  const attributes: Array<[string, string | true]> = [];
  const pattern =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4];
    attributes.push([name, value === undefined ? true : value]);
  }

  return attributes;
}

const ENUM_VALUES: Record<string, Set<string>> = {
  target: new Set(["_blank", "_self"]),
  loading: new Set(["lazy", "eager"]),
};

function isSafeAttributeValue(
  name: string,
  value: string | true,
  kind: AttrKind,
): boolean {
  if (kind === "bool") return value === true || value === "true";

  if (typeof value !== "string") return false;

  switch (kind) {
    case "url":
      return sanitizeLinkUrl(value) !== null;
    case "imageUrl":
      return sanitizeImageUrl(value) !== null;
    case "videoUrl":
      return sanitizeVideoUrl(value) !== null;
    case "number":
      return /^\d{1,5}$/.test(value) && Number(value) > 0 && Number(value) <= 10000;
    case "text":
      return value.length <= 500 && !/[<>]/.test(value);
    case "enum":
      return ENUM_VALUES[name]?.has(value) ?? false;
  }
}

/**
 * Filters a tag's attributes and appends the hardening attributes we always
 * want. Returns null when the tag must be dropped entirely (rejected iframe).
 */
function buildAttributes(
  tag: string,
  attributes: Array<[string, string | true]>,
): string | null {
  const spec = ALLOWED_TAGS[tag];
  const kept: string[] = [];

  for (const [name, value] of attributes) {
    // Belt and braces: never keep a handler, a style, or a data-* attribute
    // even if something slips through the allow-list above.
    if (name.startsWith("on") || name.startsWith("data-") || name === "style") {
      continue;
    }

    const kind = spec[name];
    if (!kind) continue;
    if (!isSafeAttributeValue(name, value, kind)) continue;

    kept.push(
      value === true ? name : `${name}="${escapeAttributeValue(value as string)}"`,
    );
  }

  if (tag === "a") {
    // <a> hardening: new tab, no referrer leak, no endorsement of the target.
    kept.push('target="_blank"', 'rel="noopener noreferrer nofollow"');
  }

  if (tag === "iframe") {
    const src = attributes.find(([name]) => name === "src")?.[1];
    const safeSrc =
      typeof src === "string" ? sanitizeVideoUrl(src) : null;
    if (!safeSrc) return null;

    return [
      `src="${escapeAttributeValue(safeSrc)}"`,
      'loading="lazy"',
      'referrerpolicy="strict-origin-when-cross-origin"',
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"',
      "allowfullscreen",
      'title="Embedded video"',
    ].join(" ");
  }

  // A media tag without a usable source is broken markup, so drop it whole
  // rather than leaving an empty <img /> for the browser to complain about.
  if ((tag === "img" || tag === "video") && !kept.some((a) => a.startsWith("src="))) {
    return null;
  }

  if (tag === "video") kept.push("controls", 'playsinline');

  return kept.join(" ");
}

function stripDangerousBlocks(input: string): string {
  let output = input;

  for (const tag of DROP_WITH_CONTENT) {
    output = output.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, "gi"),
      "",
    );
    output = output.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
    output = output.replace(new RegExp(`<\\/${tag}\\s*>`, "gi"), "");
  }

  output = output.replace(/<!--[\s\S]*?-->/g, "");
  output = output.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
  output = output.replace(/<![^>]*>/g, "");
  output = output.replace(/<\?[\s\S]*?\?>/g, "");

  return output;
}

export function sanitizeHtml(input: unknown): string {
  if (typeof input !== "string" || input.length === 0) return "";

  const cleaned = stripDangerousBlocks(input);

  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  const stack: string[] = [];
  let result = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  const pushText = (text: string) => {
    if (text) result += escapeText(text);
  };

  while ((match = tagPattern.exec(cleaned)) !== null) {
    pushText(cleaned.slice(cursor, match.index));
    cursor = tagPattern.lastIndex;

    const isClosing = match[0].startsWith("</");
    const tag = match[1].toLowerCase();

    if (!(tag in ALLOWED_TAGS)) continue; // unknown tag: drop the tag, keep text

    if (isClosing) {
      if (VOID_TAGS.has(tag)) continue;
      const index = stack.lastIndexOf(tag);
      if (index === -1) continue; // stray closing tag
      // Close everything opened after it so nesting stays balanced.
      for (let i = stack.length - 1; i >= index; i--) {
        result += `</${stack[i]}>`;
      }
      stack.length = index;
      continue;
    }

    const attributes = buildAttributes(tag, parseAttributes(match[2] ?? ""));
    if (attributes === null) continue; // rejected (e.g. disallowed iframe src)

    if (VOID_TAGS.has(tag)) {
      result += `<${tag}${attributes ? ` ${attributes}` : ""} />`;
      continue;
    }

    result += `<${tag}${attributes ? ` ${attributes}` : ""}>`;
    stack.push(tag);
  }

  pushText(cleaned.slice(cursor));

  for (let i = stack.length - 1; i >= 0; i--) {
    result += `</${stack[i]}>`;
  }

  return result;
}

/**
 * Plain text version of HTML. Used for excerpts, meta descriptions and
 * reading-time estimates.
 */
export function htmlToPlainText(html: string, maxLength = Infinity): string {
  const text = html
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr|figure|pre)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

export function countWords(plainText: string): number {
  return plainText.split(/\s+/).filter(Boolean).length;
}

export function readingTimeMinutes(plainText: string): number {
  return Math.max(1, Math.round(countWords(plainText) / 220));
}