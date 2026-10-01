import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get("maple_admin_session")?.value;
  const isEnvAdmin = adminCookie === "authenticated_admin";

  // If already logged in via env admin and visiting /admin/login -> redirect to dashboard
  if (pathname === "/admin/login" && isEnvAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // If accessing protected /admin route and logged in via env admin -> allow through directly
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (isEnvAdmin) {
      return NextResponse.next();
    }
  }

  // Otherwise, fallback to Supabase session refresh and auth checks
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
