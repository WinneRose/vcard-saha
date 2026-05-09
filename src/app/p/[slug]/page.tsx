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
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="no-print mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" />
          Ana sayfa
        </Link>
        <ProfileActions slug={record.slug} profile={record.data} />
      </nav>

      <BentoProfile profile={record.data} />

      <footer className="mt-10 text-center text-xs text-slate-400">
        /p/{record.slug} — son güncelleme {new Date(record.updatedAt).toLocaleDateString("tr-TR")}
      </footer>
    </main>
  );
}
