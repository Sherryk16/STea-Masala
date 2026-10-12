import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export type AdminSession = {
  issuedAt: number;
  expiresAt: number;
};

/**
 * Reads and verifies the admin session from the request cookie.
 * Memoized for the duration of a single render pass.
 */
export const readAdminSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return { issuedAt: payload.iat, expiresAt: payload.exp };
});

/**
 * Data Access Layer guard for admin pages. Redirects to the login screen when
 * there is no valid session, so every admin page is protected by default.
 */
export const verifyAdminSession = cache(async (): Promise<AdminSession> => {
  const session = await readAdminSession();
  if (!session) redirect("/admin/login");
  return session;
});