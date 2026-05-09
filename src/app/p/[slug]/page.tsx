import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProfile } from "@/lib/profiles";
import { BentoProfile } from "@/components/BentoProfile";
import { ProfileActions } from "./ProfileActions";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ slug: string }> };

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

      <main className="mx-auto max-w-5xl px-4 py-6 pb-12 sm:px-6 sm:py-10">
        <BentoProfile profile={record.data} />
        <footer className="mt-10 text-center text-xs text-slate-400">
          son güncelleme {new Date(record.updatedAt).toLocaleDateString("tr-TR")}
        </footer>
      </main>
    </>
  );
}
