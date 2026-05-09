"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Share2, Loader2, ExternalLink, Trash2, Sparkles, ChevronRight } from "lucide-react";
import { VCardForm } from "@/components/VCardForm";
import { VCardPreview } from "@/components/VCardPreview";
import { QRCodeBlock } from "@/components/QRCodeBlock";
import { ActionButtons } from "@/components/ActionButtons";
import { Toast } from "@/components/Toast";
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
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);
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
  const canPublish = profile.fullName.trim().length > 0;

  const handlePublish = async () => {
    setError(null);
    if (!canPublish) {
      setError("Ad Soyad alanı zorunludur.");
      setToast({ msg: "Ad Soyad alanını doldurun", variant: "error" });
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
      setToast({ msg: "Profil yayınlandı", variant: "success" });
      router.push(`/p/${json.slug}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(msg);
      setToast({ msg, variant: "error" });
    } finally {
      setPublishing(false);
    }
  };

  const handleForget = (slug: string) => {
    forgetProfile(slug);
    setSaved(listSavedProfiles());
  };

  return (
    <>
      <Toast
        message={toast?.msg ?? null}
        variant={toast?.variant}
        onClose={() => setToast(null)}
      />

      <header className="safe-top sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy text-white">
              <Sparkles className="h-4 w-4 text-brand-orange" />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-red">vCard Studio</p>
              <p className="text-sm font-semibold text-brand-navy">Dijital Kartvizit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || !canPublish}
            className="hidden h-10 items-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-60 sm:inline-flex"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Yayınla
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10 sm:pb-10">
        <section className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-brand-navy sm:text-3xl">
            Bilgilerini gir, <span className="text-brand-red">paylaş</span>.
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Bento profilini saniyeler içinde yayınla. QR ile tara, .vcf indir, CV ekle.
          </p>
        </section>

        {!hydrated ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-[480px] animate-pulse rounded-3xl bg-white/60" />
            <div className="h-[480px] animate-pulse rounded-3xl bg-white/60" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
              <VCardForm profile={profile} onChange={setProfile} />

              <div className="space-y-5">
                <VCardPreview profile={profile} />

                <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1 w-4 rounded-full bg-brand-red" />
                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-brand-red">Yayınla</h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Profilini paylaşılabilir bir bento sayfasına çevir.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <div className="flex h-11 flex-1 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-500 focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/30">
                      <span className="text-slate-400">/p/</span>
                      <input
                        type="text"
                        value={slugInput}
                        onChange={(e) => setSlugInput(e.target.value)}
                        placeholder={slugify(profile.fullName) || "ayse-yilmaz"}
                        className="h-full w-full bg-transparent text-brand-navy outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={publishing || !canPublish}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-60"
                    >
                      {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                      Yayınla & Paylaş
                    </button>
                  </div>
                  {suggestedSlug && (
                    <p className="mt-2 text-xs text-slate-500">
                      Önerilen URL: <span className="font-mono text-brand-blue">/p/{suggestedSlug}</span>
                    </p>
                  )}
                  {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
                </div>

                <div className="flex flex-col items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 sm:flex-row sm:items-center sm:p-6">
                  <QRCodeBlock value={qrVCardString} onCanvasReady={setQrCanvas} />
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-slate-600">
                      Telefon kameranla QR&apos;ı tarat — kişilere otomatik eklensin.
                    </p>
                    <ActionButtons profile={profile} qrCanvas={qrCanvas} />
                  </div>
                </div>
              </div>
            </div>

            {saved.length > 0 && (
              <section className="mt-8 rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-1 w-4 rounded-full bg-brand-blue" />
                  <h2 className="text-[11px] font-semibold uppercase tracking-widest text-brand-blue">
                    Yayınlanan Profillerin
                  </h2>
                </div>
                <ul className="mt-3 divide-y divide-slate-100">
                  {saved.map((s) => (
                    <li key={s.slug} className="flex items-center justify-between gap-3 py-3">
                      <Link href={`/p/${s.slug}`} className="flex min-w-0 flex-1 items-center gap-3 active:scale-[0.99]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-brand-navy">{s.fullName || s.slug}</p>
                          <p className="truncate font-mono text-xs text-slate-500">/p/{s.slug}</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/p/${s.slug}`}
                          className="inline-flex h-9 items-center gap-1 rounded-lg bg-brand-mist px-3 text-xs font-medium text-brand-navy hover:bg-brand-blue/10"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="hidden sm:inline">Görüntüle</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleForget(s.slug)}
                          title="Bu kayıttan unut (DB'den silinmez)"
                          className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-slate-400 hover:bg-red-50 hover:text-brand-red"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Mobile sticky publish CTA */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/40 bg-white/85 px-4 py-3 backdrop-blur-xl sm:hidden">
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing || !canPublish}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-red text-base font-semibold text-white shadow-md hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-60"
        >
          {publishing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 className="h-5 w-5" />}
          {canPublish ? "Profili Yayınla" : "Önce ad-soyad gir"}
        </button>
      </div>
    </>
  );
}
