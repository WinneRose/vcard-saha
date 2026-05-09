"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VCardForm } from "@/components/VCardForm";
import { VCardPreview } from "@/components/VCardPreview";
import { QRCodeBlock } from "@/components/QRCodeBlock";
import { ActionButtons } from "@/components/ActionButtons";
import { emptyProfile, type Profile } from "@/types/profile";
import { loadProfile, saveProfile } from "@/lib/storage";
import { buildVCard } from "@/lib/vcard";

export default function Home() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [hydrated, setHydrated] = useState(false);
  const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
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

  const vcardString = useMemo(() => buildVCard(profile), [profile]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">vCard Oluşturucu</h1>
        <p className="mt-1 text-sm text-slate-600">
          Bilgilerinizi girin — kartınızı, QR kodunuzu ve CV PDF&apos;nizi anında alın. Veriler sadece tarayıcınızda saklanır.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VCardForm profile={profile} onChange={setProfile} />

        <div className="space-y-6">
          <VCardPreview profile={profile} />
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
            <QRCodeBlock value={vcardString} onCanvasReady={setQrCanvas} />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-600">
                Telefon kameranızla QR kodu tarayın — bilgileriniz kişilere eklensin.
              </p>
              <ActionButtons profile={profile} qrCanvas={qrCanvas} />
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-slate-400">
        Veriler tarayıcınızın localStorage&apos;ında saklanır. Backend yok.
      </footer>
    </main>
  );
}
