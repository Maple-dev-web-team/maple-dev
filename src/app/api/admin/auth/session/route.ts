import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("maple_admin_session");
  const isAuthenticated = sessionCookie?.value === "authenticated_admin";

  return NextResponse.json({
    authenticated: isAuthenticated,
    user: isAuthenticated
      ? { email: process.env.ADMIN_EMAIL || "admin@maple.com", role: "admin" }
      : null,
  });
}
