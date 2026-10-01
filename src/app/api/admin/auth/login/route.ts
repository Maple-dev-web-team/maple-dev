import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@maple.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "maple@admin2026";

    // Normalize comparison
    if (
      email?.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password === expectedPassword
    ) {
      const response = NextResponse.json({
        success: true,
        user: { email: expectedEmail, role: "admin" },
      });

      // Set secure HTTP-only cookie
      response.cookies.set("maple_admin_session", "authenticated_admin", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid email or password. Please verify credentials in .env.local." },
      { status: 401 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
