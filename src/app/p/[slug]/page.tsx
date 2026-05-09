import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProfile, incrementProfileViews } from "@/lib/profiles";
import { BentoProfile } from "@/components/BentoProfile";
import { ProfileActions } from "./ProfileActions";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ slug: string }> };

async function getProfileUrl(slug: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/p/${slug}`;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  try {
    const record = await getProfile(slug);
    if (!record) return { title: "Profil bulunamadı" };
    const p = record.data;
    const title = p.fullName ? `${p.fullName} — vCard` : `vCard / ${slug}`;
    const description = p.title && p.organization ? `${p.title} @ ${p.organization}` : p.bio || p.title || "Dijital kartvizit";
    return {
      title,
      description,
      openGraph: { title, description, type: "profile" },
      twitter: { card: "summary", title, description },
    };
  } catch {
    return { title: `vCard / ${slug}` };
  }
}

export default async function ProfilePage({ params }: RouteParams) {
  const { slug } = await params;
  const record = await getProfile(slug);
  if (!record) notFound();

  const profileUrl = await getProfileUrl(slug);
  const views = await incrementProfileViews(record.slug).catch(() => 0);

  return (
    <>
      <header className="safe-top sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy hover:bg-brand-mist"
            aria-label="Ana sayfa"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">Profil</p>
            <p className="truncate text-sm font-semibold text-brand-navy">/p/{record.slug}</p>
          </div>
          <ProfileActions slug={record.slug} profile={record.data} />
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-5 pb-12 sm:px-6 sm:py-10">
        <BentoProfile profile={record.data} profileUrl={profileUrl} />
        <footer className="mt-10 space-y-1 text-center text-xs text-slate-400">
          <p className="tabular-nums">
            {views.toLocaleString("tr-TR")} görüntülenme
          </p>
          <p>son güncelleme {new Date(record.updatedAt).toLocaleDateString("tr-TR")}</p>
          <p className="pt-2 font-medium text-brand-navy/80">Bartın Üniversitesi Teknofest Kulübü</p>
        </footer>
      </main>
    </>
  );
}
