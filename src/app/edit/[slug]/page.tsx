"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { VCardForm } from "@/components/VCardForm";
import { VCardPreview } from "@/components/VCardPreview";
import { Toast } from "@/components/Toast";
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
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    setToken(getEditToken(slug));
    (async () => {
      try {
        const res = await fetch(`/api/profiles/${slug}`);
        if (!res.ok) throw new Error("Profil bulunamadı");
        const json = await res.json();
        setProfile(json.data);
      } catch (e) {
        setToast({ msg: e instanceof Error ? e.message : "Hata", variant: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/profiles/${slug}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ editToken: token, data: profile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kayıt başarısız");
      setToast({ msg: "Kaydedildi", variant: "success" });
      setTimeout(() => router.push(`/p/${slug}`), 600);
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : "Bilinmeyen hata", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="h-[480px] animate-pulse rounded-3xl bg-white/60" />
          <div className="h-[480px] animate-pulse rounded-3xl bg-white/60" />
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-navy">Düzenleme yetkisi yok</h1>
        <p className="mt-3 text-sm text-slate-600">
          Bu profili düzenlemek için onu yayınlayan tarayıcıyı kullanmalısınız. Düzenleme anahtarı yalnızca o tarayıcının localStorage&apos;ında tutulur.
        </p>
        <Link href={`/p/${slug}`} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-red hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Profili görüntüle
        </Link>
      </main>
    );
  }

  return (
    <>
      <Toast message={toast?.msg ?? null} variant={toast?.variant} onClose={() => setToast(null)} />

      <header className="safe-top sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link
            href={`/p/${slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy hover:bg-brand-mist"
            aria-label="Profile dön"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">Düzenle</p>
            <p className="truncate text-sm font-semibold text-brand-navy">/p/{slug}</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="hidden h-10 items-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-60 sm:inline-flex"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Kaydet
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10 sm:pb-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <VCardForm profile={profile} onChange={setProfile} />
          <VCardPreview profile={profile} />
        </div>
      </main>

      {/* Mobile sticky save bar */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/40 bg-white/85 px-4 py-3 backdrop-blur-xl sm:hidden">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-red text-base font-semibold text-white shadow-md hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Değişiklikleri Kaydet
        </button>
      </div>
    </>
  );
}
