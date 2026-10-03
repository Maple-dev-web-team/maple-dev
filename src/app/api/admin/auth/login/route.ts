import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionToken } from "@/lib/auth";

// In-memory rate limiting map for brute-force mitigation
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const now = Date.now();

  // Check rate limit status
  const attemptRecord = failedAttempts.get(clientIp);
  if (attemptRecord && attemptRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Temporarily locked for security. Please try again in ${remainingSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": remainingSeconds.toString() },
      }
    );
  }

  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@maple.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "maple@admin2026";

    // Normalize comparison
    if (
      email?.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password === expectedPassword
    ) {
      // Clear rate limiting on success
      failedAttempts.delete(clientIp);

      // Issue cryptographically signed HMAC-SHA256 session token
      const sessionToken = await createAdminSessionToken(expectedEmail);

      const response = NextResponse.json({
        success: true,
        user: { email: expectedEmail, role: "admin" },
      });

      // Set secure HTTP-only cookie with strict security flags
      response.cookies.set("maple_admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Record failed attempt
    const currentFailures = (attemptRecord?.count || 0) + 1;
    const isLocked = currentFailures >= 5;
    const lockedUntil = isLocked ? now + 5 * 60 * 1000 : 0; // Lock for 5 minutes after 5 failures

    failedAttempts.set(clientIp, { count: currentFailures, lockedUntil });

    return NextResponse.json(
      {
        error: isLocked
          ? "Too many failed attempts. Login locked for 5 minutes."
          : `Invalid email or password. Attempt ${currentFailures} of 5.`,
      },
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
