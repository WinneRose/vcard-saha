import { NextRequest, NextResponse } from "next/server";
import { createProfile } from "@/lib/profiles";
import { sanitizeProfile } from "@/lib/profile-validate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { slug?: string; data?: unknown };
    const data = sanitizeProfile(body.data);
    if (!data.fullName) {
      return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    }
    const { slug, editToken } = await createProfile(body.slug, data);
    return NextResponse.json({ slug, editToken });
  } catch (err) {
    console.error("[POST /api/profiles]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
