"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Share2, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { VCardForm } from "@/components/VCardForm";
import { VCardPreview } from "@/components/VCardPreview";
import { QRCodeBlock } from "@/components/QRCodeBlock";
import { ActionButtons } from "@/components/ActionButtons";
import { emptyProfile, type Profile } from "@/types/profile";
import { loadProfile, saveProfile } from "@/lib/storage";
import { buildVCard } from "@/lib/vcard";
import { listSavedProfiles, rememberProfile, forgetProfile, type SavedProfileEntry } from "@/lib/saved-profiles";
import { slugify } from "@/lib/slug";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [hydrated, setHydrated] = useState(false);
  const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);
  const [saved, setSaved] = useState<SavedProfileEntry[]>([]);
  const [slugInput, setSlugInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setSaved(listSavedProfiles());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveProfile(profile), 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [profile, hydrated]);

  const qrVCardString = useMemo(() => buildVCard(profile, { includePhoto: false }), [profile]);

  const suggestedSlug = useMemo(() => slugify(slugInput || profile.fullName), [slugInput, profile.fullName]);

  const handlePublish = async () => {
    setError(null);
    if (!profile.fullName.trim()) {
      setError("Ad Soyad alanı zorunludur.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: suggestedSlug || undefined, data: profile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Yayınlama başarısız");
      rememberProfile({ slug: json.slug, editToken: json.editToken, fullName: profile.fullName });
      router.push(`/p/${json.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
    } finally {
      setPublishing(false);
    }
  };

  const handleForget = (slug: string) => {
    forgetProfile(slug);
    setSaved(listSavedProfiles());
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-1 rounded-full bg-brand-cyan" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-cyan2">vCard Studio</p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-brand-ink">Dijital Kartvizit Oluşturucu</h1>
        <p className="mt-1 text-sm text-slate-600">
          Bilgilerinizi girin, kendi paylaşılabilir bento profilinizi yayınlayın.
        </p>
      </header>

      {!hydrated ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VCardForm profile={profile} onChange={setProfile} />

            <div className="space-y-6">
              <VCardPreview profile={profile} />

              <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-brand-cyan2">Yayınla</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Profilinizi paylaşılabilir bir bento sayfasına çevirin.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <div className="flex flex-1 items-center gap-1 rounded-md border border-slate-300 px-3 text-sm text-slate-500 focus-within:border-brand-cyan focus-within:ring-1 focus-within:ring-brand-cyan">
                    <span className="hidden sm:inline">/p/</span>
                    <input
                      type="text"
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value)}
                      placeholder={slugify(profile.fullName) || "ayse-yilmaz"}
                      className="w-full bg-transparent py-2 text-brand-ink outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={publishing}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy2 disabled:opacity-60"
                  >
                    {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                    Yayınla & Paylaş
                  </button>
                </div>
                {suggestedSlug && (
                  <p className="mt-2 text-xs text-slate-500">
                    Önerilen URL: <span className="font-mono">/p/{suggestedSlug}</span>
                  </p>
                )}
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              </div>

              <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:flex-row sm:items-center">
                <QRCodeBlock value={qrVCardString} onCanvasReady={setQrCanvas} />
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-slate-600">
                    Telefon kameranızla QR kodu tarayın — bilgileriniz kişilere eklensin.
                  </p>
                  <ActionButtons profile={profile} qrCanvas={qrCanvas} />
                </div>
              </div>
            </div>
          </div>

          {saved.length > 0 && (
            <section className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-brand-cyan2">Yayınlanan Profilleriniz</h2>
              <ul className="mt-3 divide-y divide-slate-100">
                {saved.map((s) => (
                  <li key={s.slug} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.fullName || s.slug}</p>
                      <p className="font-mono text-xs text-slate-500">/p/{s.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/p/${s.slug}`}
                        className="inline-flex items-center gap-1 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-navy2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Görüntüle
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleForget(s.slug)}
                        title="Bu kayıttan unut (DB'den silinmez, sadece düzenleme yetkisi gider)"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
