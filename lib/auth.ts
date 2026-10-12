import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sm_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const DEV_FALLBACK_PASSWORD = "stea-masala";
const DEV_FALLBACK_SECRET = "dev-only-insecure-session-secret";

const BASE64_URL = /^[A-Za-z0-9_-]+$/;

type SessionPayload = {
  /** Issued-at, seconds since epoch. */
  iat: number;
  /** Expiry, seconds since epoch. */
  exp: number;
};

function getAdminPassword(): string {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to your environment before deploying, otherwise the admin panel cannot be opened.",
    );
  }

  console.warn(
    `[auth] ADMIN_PASSWORD is not set - falling back to the development password "${DEV_FALLBACK_PASSWORD}". Never do this in production.`,
  );
  return DEV_FALLBACK_PASSWORD;
}

function getSessionSecret(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured) {
    if (configured.length < 16) {
      throw new Error(
        "SESSION_SECRET must be at least 16 characters long. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"",
      );
    }
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is not set. Add it to your environment before deploying, otherwise admin sessions cannot be signed.",
    );
  }

  console.warn(
    "[auth] SESSION_SECRET is not set - using an insecure development secret. Sessions will reset when the dev server restarts.",
  );
  return DEV_FALLBACK_SECRET;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Constant-time comparison of the submitted password against ADMIN_PASSWORD.
 * Throws if the environment is not configured.
 */
export function verifyAdminPassword(candidate: unknown): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) return false;

  let expected: string;
  try {
    expected = getAdminPassword();
  } catch {
    return false;
  }

  const candidateBytes = Buffer.from(candidate, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");

  // Hash both sides first so the comparison never leaks the real length.
  const a = createHmac("sha256", "compare").update(candidateBytes).digest();
  const b = createHmac("sha256", "compare").update(expectedBytes).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const secret = getSessionSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

/**
 * Verifies signature and expiry. Returns null for anything tampered with.
 */
export function verifySessionToken(token: unknown): SessionPayload | null {
  if (typeof token !== "string") return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const encoded = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!BASE64_URL.test(encoded) || !BASE64_URL.test(signature)) return null;

  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  if (!safeEqual(signature, sign(encoded, secret))) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (
    typeof payload?.exp !== "number" ||
    typeof payload?.iat !== "number" ||
    payload.exp * 1000 <= Date.now()
  ) {
    return null;
  }

  return payload;
}

/** Fresh random value, used to make login responses unpredictable. */
export function createNonce(): string {
  return randomBytes(16).toString("base64url");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}