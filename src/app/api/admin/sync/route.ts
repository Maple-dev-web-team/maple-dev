import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { publicSupabase } from "@/lib/supabase/public";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : publicSupabase;

export async function POST() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "content.json");
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: "content.json not found" }, { status: 404 });
    }

    const content = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    const results: Record<string, unknown> = {};

    // 1. Sync Site Settings
    if (content.site_settings) {
      const { error } = await supabaseAdmin
        .from("site_settings")
        .upsert([content.site_settings], { onConflict: "id" });
      results.site_settings = error ? error.message : "synced";
    }

    // 2. Sync Homepage Content
    if (content.homepage_content) {
      const { error } = await supabaseAdmin
        .from("homepage_content")
        .upsert([content.homepage_content], { onConflict: "id" });
      results.homepage_content = error ? error.message : "synced";
    }

    // 3. Sync Services
    if (Array.isArray(content.services)) {
      const { error } = await supabaseAdmin
        .from("services")
        .upsert(content.services, { onConflict: "id" });
      results.services = error ? error.message : `synced (${content.services.length})`;
    }

    // 4. Sync Team Members
    if (Array.isArray(content.team_members)) {
      const { error } = await supabaseAdmin
        .from("team_members")
        .upsert(content.team_members, { onConflict: "id" });
      results.team_members = error ? error.message : `synced (${content.team_members.length})`;
    }

    // 5. Sync Project Categories
    if (Array.isArray(content.project_categories)) {
      const { error } = await supabaseAdmin
        .from("project_categories")
        .upsert(content.project_categories, { onConflict: "id" });
      results.project_categories = error
        ? error.message
        : `synced (${content.project_categories.length})`;
    }

    // 6. Sync Projects
    if (Array.isArray(content.projects)) {
      const { error } = await supabaseAdmin
        .from("projects")
        .upsert(content.projects, { onConflict: "id" });
      results.projects = error ? error.message : `synced (${content.projects.length})`;
    }

    // 7. Sync Branches
    if (Array.isArray(content.branches)) {
      const { error } = await supabaseAdmin
        .from("branches")
        .upsert(content.branches, { onConflict: "id" });
      results.branches = error ? error.message : `synced (${content.branches.length})`;
    }

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
