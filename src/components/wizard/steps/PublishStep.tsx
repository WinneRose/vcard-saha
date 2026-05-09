"use client";

import type { Profile } from "@/types/profile";
import { SocialLinks } from "@/components/SocialLinks";
import { Accordion } from "@/components/Accordion";
import { slugify } from "@/lib/slug";

type Props = {
  profile: Profile;
  set: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
  slugInput: string;
  onSlugInputChange: (v: string) => void;
};

export function PublishStep({ profile, set, slugInput, onSlugInputChange }: Props) {
  const suggestedSlug = slugify(slugInput || profile.fullName);
  const filledSocials = profile.socials.filter((s) => s.url.trim()).length;

  return (
    <div className="space-y-5">
      <Accordion
        title="Sosyal Medya"
        description={filledSocials ? `${filledSocials} bağlantı eklendi` : "LinkedIn, GitHub, Twitter, web — opsiyonel"}
        defaultOpen={filledSocials > 0}
      >
        <SocialLinks socials={profile.socials} onChange={(s) => set("socials", s)} />
      </Accordion>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-600">Profil URL&apos;niz</label>
        <div className="flex h-12 items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3.5 text-base text-slate-500 focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/30">
          <span className="text-slate-400">/p/</span>
          <input
            type="text"
            value={slugInput}
            onChange={(e) => onSlugInputChange(e.target.value)}
            placeholder={slugify(profile.fullName) || "ayse-yilmaz"}
            className="h-full w-full bg-transparent text-brand-navy outline-none placeholder:text-slate-400"
          />
        </div>
        {suggestedSlug && (
          <p className="text-xs text-slate-500">
            Yayınlanacak: <span className="font-mono text-brand-blue">/p/{suggestedSlug}</span>
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-brand-mist p-4 text-xs text-brand-navy/80">
        Yayınladıktan sonra profile <strong>QR kod</strong>, <strong>.vcf</strong> ve <strong>paylaşım linki</strong> oluşacak.
      </div>
    </div>
  );
}
