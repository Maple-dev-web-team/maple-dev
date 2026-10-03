import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("maple_admin_session");
  const isAuthenticated = await verifyAdminSessionToken(sessionCookie?.value);

  return NextResponse.json({
    authenticated: isAuthenticated,
    user: isAuthenticated
      ? { email: process.env.ADMIN_EMAIL || "admin@maple.com", role: "admin" }
      : null,
  });
}
