import { NextResponse } from "next/server";
import { getVisits, incrementVisits } from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getVisits();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[GET /api/visits]", err);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const count = await incrementVisits();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[POST /api/visits]", err);
    return NextResponse.json({ count: 0 });
  }
}
