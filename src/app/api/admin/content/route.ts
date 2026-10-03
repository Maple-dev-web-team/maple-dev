import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { publicSupabase } from "@/lib/supabase/public";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const dataFilePath = path.join(process.cwd(), "data", "content.json");

const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : publicSupabase;

function readData(): Record<string, unknown> {
  try {
    if (fs.existsSync(dataFilePath)) {
      return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading content.json:", err);
  }
  return {};
}

function writeData(data: Record<string, unknown>) {
  try {
    if (process.env.NODE_ENV === "production") {
      // In serverless edge environments (Vercel), the local filesystem is read-only.
      // Supabase cloud database handles production persistence.
      return true;
    }
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (section) {
    // 1. Try Supabase cloud database first
    try {
      const { data, error } = await supabaseAdmin
        .from(section)
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json(
          { [section]: data },
          { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
        );
      }
    } catch (supaErr) {
      console.warn(`Supabase get notice for ${section}:`, supaErr);
    }

    // 2. Fallback to local content file
    const localData = readData();
    return NextResponse.json(
      { [section]: localData[section] || null },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }

  const localData = readData();
  return NextResponse.json(localData, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, payload } = body;

    if (!section || !payload) {
      return NextResponse.json(
        { error: "Missing section or payload" },
        { status: 400 }
      );
    }

    const current = readData();
    current[section] = payload;
    writeData(current);

    // Sync to Supabase cloud database
    try {
      if (payload.id) {
        await supabaseAdmin
          .from(section)
          .upsert([payload], { onConflict: "id" });
      } else {
        await supabaseAdmin.from(section).upsert([payload]);
      }
    } catch (supaErr) {
      console.warn(`Supabase content sync notice for ${section}:`, supaErr);
    }

    return NextResponse.json({ success: true, [section]: payload });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
