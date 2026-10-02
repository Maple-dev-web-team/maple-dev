import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
