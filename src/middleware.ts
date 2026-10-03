import { type NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get("maple_admin_session")?.value;
  const isAuthenticated = await verifyAdminSessionToken(adminCookie);

  // 1. Guard API Admin endpoints (except /api/admin/auth/*)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized access: Valid administrator session required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Guard Cloudinary media management API endpoints
  if (pathname.startsWith("/api/cloudinary")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized access: Valid administrator session required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 3. If already logged in and visiting /admin/login -> redirect to dashboard
  if (pathname === "/admin/login" && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // 4. Guard protected /admin UI pages (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
