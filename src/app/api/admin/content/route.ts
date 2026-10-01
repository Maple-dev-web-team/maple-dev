import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "content.json");

function readData() {
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
  const section = searchParams.get("section");
  const data = readData();

  if (section) {
    return NextResponse.json({ [section]: data[section] || null });
  }

  return NextResponse.json(data);
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

    return NextResponse.json({ success: true, [section]: payload });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
