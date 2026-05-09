"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Globe, User, Printer } from "lucide-react";
import { loadProfile } from "@/lib/storage";
import { emptyProfile, type Profile, type SocialPlatform } from "@/types/profile";

const SOCIAL_ICON: Record<SocialPlatform, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  website: Globe,
};

const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter",
  website: "Web",
};

export default function PrintPage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);

  const visibleSocials = profile.socials.filter((s) => s.url.trim());
  const fullName = profile.fullName || "Adınız Soyadınız";

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="no-print mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">Yazdırma diyaloğunda &quot;Save as PDF&quot; seçerek kaydedebilirsiniz.</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Printer className="h-4 w-4" /> Yazdır / PDF Kaydet
        </button>
      </div>

      <article className="print-card rounded-2xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <header className="flex items-center gap-6 border-b border-slate-200 pb-6">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <User className="h-14 w-14" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
            {profile.title && <p className="mt-1 text-lg text-slate-700">{profile.title}</p>}
            {profile.organization && <p className="text-sm text-slate-500">{profile.organization}</p>}
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {profile.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              {profile.email}
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              {profile.phone}
            </div>
          )}
          {profile.address && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              {profile.address}
            </div>
          )}
        </section>

        {profile.bio && (
          <section className="mt-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Hakkında</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{profile.bio}</p>
          </section>
        )}

        {visibleSocials.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Bağlantılar</h2>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {visibleSocials.map((s) => {
                const Icon = SOCIAL_ICON[s.platform];
                return (
                  <li key={s.platform} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{SOCIAL_LABEL[s.platform]}:</span>
                    <span className="break-all">{s.url}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {ready && !profile.fullName && (
          <p className="no-print mt-8 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Henüz profil doldurulmamış. Ana sayfaya dönüp formu doldurun.
          </p>
        )}
      </article>
    </main>
  );
}
