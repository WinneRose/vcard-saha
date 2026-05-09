"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Trash2, Sparkles, ChevronRight } from "lucide-react";
import { VCardPreview } from "@/components/VCardPreview";
import { QRCodeBlock } from "@/components/QRCodeBlock";
import { ActionButtons } from "@/components/ActionButtons";
import { Toast } from "@/components/Toast";
import { Accordion } from "@/components/Accordion";
import { Wizard } from "@/components/wizard/Wizard";
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

  const handlePublish = async () => {
    if (!profile.fullName.trim()) {
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
      setToast({ msg: e instanceof Error ? e.message : "Bilinmeyen hata", variant: "error" });
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
      <Toast message={toast?.msg ?? null} variant={toast?.variant} onClose={() => setToast(null)} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-5 flex items-center gap-2.5 sm:mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy text-white">
            <Sparkles className="h-4 w-4 text-brand-orange" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-red">vCard Studio</p>
            <p className="text-sm font-semibold text-brand-navy">Dijital Kartvizit</p>
          </div>
        </header>

        {!hydrated ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="h-[480px] animate-pulse rounded-3xl bg-white/60" />
            <div className="hidden h-[480px] animate-pulse rounded-3xl bg-white/60 lg:block" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            <Wizard
              profile={profile}
              onChange={setProfile}
              slugInput={slugInput}
              onSlugInputChange={setSlugInput}
              onPublish={handlePublish}
              publishing={publishing}
            />

            <aside className="hidden space-y-5 lg:block">
              <VCardPreview profile={profile} />
              <div className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/80">
                <QRCodeBlock value={qrVCardString} onCanvasReady={setQrCanvas} />
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-slate-600">
                    Telefon kameranla QR&apos;ı tarat — kişilere otomatik eklensin.
                  </p>
                  <ActionButtons profile={profile} qrCanvas={qrCanvas} />
                </div>
              </div>
            </aside>
          </div>
        )}

        {hydrated && saved.length > 0 && (
          <section className="mt-6 lg:mt-10">
            <Accordion
              title="Yayınlanan Profillerin"
              description={`${saved.length} profil`}
              defaultOpen={false}
            >
              <ul className="divide-y divide-slate-100">
                {saved.map((s) => (
                  <li key={s.slug} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
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
                        title="Bu kayıttan unut"
                        className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-slate-400 hover:bg-red-50 hover:text-brand-red"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Accordion>
          </section>
        )}
      </main>
    </>
  );
}
