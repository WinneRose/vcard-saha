"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wizard } from "@/components/wizard/Wizard";
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
  const [slugInput, setSlugInput] = useState(slug);
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
          <div className="hidden h-[480px] animate-pulse rounded-3xl bg-white/60 lg:block" />
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

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-5 flex items-center justify-between gap-2 sm:mb-8">
          <Link
            href={`/p/${slug}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-mist px-3 text-sm font-medium text-brand-navy hover:bg-brand-blue/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Profile dön
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-red">Düzenle</p>
            <p className="font-mono text-xs text-brand-navy">/p/{slug}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <Wizard
            profile={profile}
            onChange={setProfile}
            slugInput={slugInput}
            onSlugInputChange={setSlugInput}
            onPublish={handleSave}
            publishing={saving}
            publishLabel="Değişiklikleri Kaydet"
            finalStepLabel="Kaydet"
          />

          <aside className="hidden lg:block">
            <VCardPreview profile={profile} />
          </aside>
        </div>
      </main>
    </>
  );
}
