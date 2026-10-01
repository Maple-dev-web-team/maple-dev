import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || "maple-consulting";
    const data = generateUploadSignature(folder);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to generate signature" },
      { status: 500 }
    );
  }
}
