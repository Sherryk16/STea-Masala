import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Optimistic gate for the admin area. It reads the signed cookie only - no
 * database calls - so it stays cheap even on prefetched requests.
 *
 * This is defence in depth, not the only check: every admin Server Action and
 * Route Handler independently calls verifyAdminSession() / readAdminSession()
 * before touching data.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Your admin session has expired. Please sign in again." },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};