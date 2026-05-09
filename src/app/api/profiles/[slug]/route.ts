import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/profiles";
import { sanitizeProfile } from "@/lib/profile-validate";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const record = await getProfile(slug);
    if (!record) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ slug: record.slug, data: record.data, updatedAt: record.updatedAt });
  } catch (err) {
    console.error("[GET /api/profiles/:slug]", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = (await req.json()) as { editToken?: string; data?: unknown };
    if (!body.editToken) return NextResponse.json({ error: "editToken required" }, { status: 400 });
    const data = sanitizeProfile(body.data);
    if (!data.fullName) return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    const ok = await updateProfile(slug, body.editToken, data);
    if (!ok) return NextResponse.json({ error: "forbidden or not found" }, { status: 403 });
    return NextResponse.json({ slug });
  } catch (err) {
    console.error("[PUT /api/profiles/:slug]", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
