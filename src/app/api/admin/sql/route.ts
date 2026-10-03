import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("maple_admin_session")?.value;
    const isAuth = await verifyAdminSessionToken(sessionCookie);
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const sqlPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "20261002_fix_uuid_and_rls.sql"
    );
    if (!fs.existsSync(sqlPath)) {
      return NextResponse.json({ error: "SQL file not found" }, { status: 404 });
    }
    const sql = fs.readFileSync(sqlPath, "utf-8");
    return new NextResponse(sql, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const e = err as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
