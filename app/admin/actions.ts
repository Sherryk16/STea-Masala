"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
  verifyAdminPassword,
} from "@/lib/auth";
import { readAdminSession } from "@/lib/dal";

export type LoginState = {
  error?: string;
};

/**
 * Best-effort in-memory brute-force throttle. Enough to make online guessing
 * painful; a durable store would be needed for a real multi-region deploy.
 */
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

async function clientKey(): Promise<string> {
  // headers() is async in Next.js 16. Forwarded headers are only trustworthy
  // when the app sits behind a proxy, which is the case in production here.
  const forwardedFor = (await headers()).get("x-forwarded-for");
  return forwardedFor?.split(",")[0].trim() || "local";
}

function throttle(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearThrottle(key: string): void {
  attempts.delete(key);
}

/** Only allow same-origin admin paths, so `from` cannot become an open redirect. */
function safeRedirectTarget(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin";
  if (!value.startsWith("/admin")) return "/admin";
  if (value.startsWith("//")) return "/admin";
  return value;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Already signed in? Skip straight through.
  if (await readAdminSession()) redirect("/admin");

  const key = await clientKey();

  if (throttle(key)) {
    return {
      error: "Too many attempts. Please wait a few minutes and try again.",
    };
  }

  const password = formData.get("password");

  if (!verifyAdminPassword(password)) {
    // Uniform delay so the response time does not reveal how wrong it was.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { error: "That password is not correct." };
  }

  clearThrottle(key);

  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());

  redirect(safeRedirectTarget(formData.get("from")));
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}