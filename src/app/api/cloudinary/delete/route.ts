import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { verifyAdminSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("maple_admin_session")?.value;
    const isAuth = await verifyAdminSessionToken(sessionCookie);
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }

    const result = await deleteFromCloudinary(public_id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
