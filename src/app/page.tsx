"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { VCardPreview } from "@/components/VCardPreview";
import { QRCodeBlock } from "@/components/QRCodeBlock";
import { ActionButtons } from "@/components/ActionButtons";
import { Toast } from "@/components/Toast";
import { Accordion } from "@/components/Accordion";
import { Wizard } from "@/components/wizard/Wizard";
import { ProfileChoice } from "@/components/ProfileChoice";
import { VisitCounter } from "@/components/VisitCounter";
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
  const [showChoice, setShowChoice] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const list = listSavedProfiles();
    setProfile(loadProfile());
    setSaved(list);
    setShowChoice(list.length > 0);
    setHydrated(true);
  }, []);

  const handleStartFresh = () => {
    setProfile(emptyProfile);
    saveProfile(emptyProfile);
    setSlugInput("");
    setShowChoice(false);
  };

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
        <header className="mb-6 sm:mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-blue">vCard Studio</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-brand-navy sm:text-2xl">
            Dijital Kartvizit
          </h1>
        </header>

        {!hydrated ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="h-[480px] animate-pulse rounded-3xl bg-white/60" />
            <div className="hidden h-[480px] animate-pulse rounded-3xl bg-white/60 lg:block" />
          </div>
        ) : showChoice ? (
          <ProfileChoice saved={saved} onCreateNew={handleStartFresh} />
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            <div>
              {saved.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowChoice(true)}
                  className="mb-3 inline-flex h-9 items-center rounded-xl bg-brand-mist px-3 text-xs font-medium text-brand-navy hover:bg-brand-blue/10"
                >
                  Profillerime dön
                </button>
              )}
              <Wizard
                profile={profile}
                onChange={setProfile}
                slugInput={slugInput}
                onSlugInputChange={setSlugInput}
                onPublish={handlePublish}
                publishing={publishing}
              />
            </div>

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

        {hydrated && !showChoice && saved.length > 0 && (
          <section className="mt-6 lg:mt-10">
            <Accordion
              title="Yayınlanan Profillerin"
              description={`${saved.length} profil`}
              defaultOpen={false}
            >
              <ul className="divide-y divide-slate-100">
                {saved.map((s) => (
                  <li key={s.slug} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <Link href={`/p/${s.slug}`} className="min-w-0 flex-1 active:scale-[0.99]">
                      <p className="truncate text-sm font-semibold text-brand-navy">{s.fullName || s.slug}</p>
                      <p className="truncate font-mono text-xs text-slate-500">/p/{s.slug}</p>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/p/${s.slug}`}
                        className="inline-flex h-9 items-center rounded-lg bg-brand-mist px-3 text-xs font-medium text-brand-navy hover:bg-brand-blue/10"
                      >
                        Görüntüle
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleForget(s.slug)}
                        title="Bu kayıttan unut"
                        className="inline-flex h-9 items-center rounded-lg px-2 text-xs text-slate-400 hover:bg-red-50 hover:text-brand-red"
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

        <footer className="mt-10 pb-6">
          <VisitCounter />
        </footer>
      </main>
    </>
  );
}
