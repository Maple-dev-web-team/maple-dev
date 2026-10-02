import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { publicSupabase } from "@/lib/supabase/public";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const dataFilePath = path.join(process.cwd(), "data", "content.json");

// Service client if service role key is provided, else fallback to public
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : publicSupabase;

function readData(): Record<string, unknown[]> {
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
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing content.json:", err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");

  if (!table) {
    return NextResponse.json({ error: "Table name required" }, { status: 400 });
  }

  // 1. Try Supabase first (cloud database for production)
  try {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json(
        { data },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }
  } catch (supaErr) {
    console.warn(`Supabase fetch notice for ${table}:`, supaErr);
  }

  // 2. Fallback to local content file
  const localData = readData();
  const list = (localData[table] as unknown[]) || [];

  return NextResponse.json(
    { data: list },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, item, id } = body;

    if (!table || !item) {
      return NextResponse.json(
        { error: "Table name and item payload required" },
        { status: 400 }
      );
    }

    const current = readData();
    const list = (current[table] as Array<Record<string, unknown>>) || [];

    let savedItem: Record<string, unknown>;

    if (id) {
      // Update existing item
      const index = list.findIndex((x) => x.id === id);
      if (index >= 0) {
        list[index] = { ...list[index], ...item, id };
        savedItem = list[index];
      } else {
        savedItem = { ...item, id };
        list.push(savedItem);
      }
    } else {
      // Create new item with generated ID
      const newId = `${table.slice(0, 4)}-${Date.now()}`;
      savedItem = { ...item, id: newId };
      list.push(savedItem);
    }

    current[table] = list;

    // If a project is saved with a cover image, ensure its category also has a cover image
    if (table === "projects" && savedItem.category_id && savedItem.cover_image_url) {
      const categories = (current["project_categories"] as Array<Record<string, unknown>>) || [];
      const catIndex = categories.findIndex(
        (c) => c.id === savedItem.category_id || c.slug === savedItem.category_id
      );
      if (catIndex >= 0) {
        categories[catIndex].cover_image_url = savedItem.cover_image_url;
        categories[catIndex].cover_image_public_id = savedItem.cover_image_public_id;
        current["project_categories"] = categories;
      }
    }

    // Save to local file if writable
    writeData(current);

    // Sync to Supabase cloud database with upsert
    let supaNotice: string | null = null;
    try {
      const { error: supaErr } = await supabaseAdmin
        .from(table)
        .upsert([savedItem], { onConflict: "id" });

      if (supaErr) {
        console.warn(`Supabase upsert notice for ${table}:`, supaErr.message);
        supaNotice = supaErr.message;
      }
    } catch (err: unknown) {
      const e = err as Error;
      supaNotice = e.message;
    }

    return NextResponse.json({
      success: true,
      data: savedItem,
      supabaseNotice: supaNotice,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table");
    const id = searchParams.get("id");

    if (!table || !id) {
      return NextResponse.json(
        { error: "Table and ID required" },
        { status: 400 }
      );
    }

    const current = readData();
    const list = (current[table] as Array<Record<string, unknown>>) || [];
    current[table] = list.filter((x) => x.id !== id);
    writeData(current);

    // Also delete from Supabase
    try {
      await supabaseAdmin.from(table).delete().eq("id", id);
    } catch (supaErr) {
      console.warn(`Supabase delete notice for ${table}:`, supaErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
