"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { VCardForm } from "@/components/VCardForm";
import { VCardPreview } from "@/components/VCardPreview";
import { emptyProfile, type Profile } from "@/types/profile";
import { getEditToken } from "@/lib/saved-profiles";

type Props = { params: Promise<{ slug: string }> };

export default function EditPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToken(getEditToken(slug));
    (async () => {
      try {
        const res = await fetch(`/api/profiles/${slug}`);
        if (!res.ok) throw new Error("Profil bulunamadı");
        const json = await res.json();
        setProfile(json.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hata");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleSave = async () => {
    if (!token) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/profiles/${slug}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ editToken: token, data: profile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kayıt başarısız");
      router.push(`/p/${slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Düzenleme yetkisi yok</h1>
        <p className="mt-3 text-sm text-slate-600">
          Bu profili düzenlemek için onu yayınlayan tarayıcıyı kullanmalısınız. Düzenleme anahtarı yalnızca o tarayıcının localStorage&apos;ında tutulur.
        </p>
        <Link href={`/p/${slug}`} className="mt-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Profili görüntüle
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center justify-between">
        <Link href={`/p/${slug}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" />
          Profile dön
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Değişiklikleri Kaydet
        </button>
      </nav>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VCardForm profile={profile} onChange={setProfile} />
        <VCardPreview profile={profile} />
      </div>
    </main>
  );
}
