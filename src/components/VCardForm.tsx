"use client";

import type { Profile } from "@/types/profile";
import { PhotoUpload } from "./PhotoUpload";
import { SocialLinks } from "./SocialLinks";

type Props = {
  profile: Profile;
  onChange: (next: Profile) => void;
};

export function VCardForm({ profile, onChange }: Props) {
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    onChange({ ...profile, [key]: value });
  };

  return (
    <form
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      onSubmit={(e) => e.preventDefault()}
    >
      <Section title="Profil Fotoğrafı">
        <PhotoUpload photoDataUrl={profile.photoDataUrl} onChange={(d) => set("photoDataUrl", d)} />
      </Section>

      <Section title="Kişisel Bilgiler">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Ad Soyad" value={profile.fullName} onChange={(v) => set("fullName", v)} placeholder="Ayşe Yılmaz" />
          <Field label="Ünvan" value={profile.title} onChange={(v) => set("title", v)} placeholder="Senior Frontend Developer" />
          <Field
            label="Kurum"
            value={profile.organization}
            onChange={(v) => set("organization", v)}
            placeholder="Acme Inc."
          />
          <Field label="Adres" value={profile.address} onChange={(v) => set("address", v)} placeholder="İstanbul, Türkiye" />
        </div>
      </Section>

      <Section title="İletişim">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="E-posta"
            type="email"
            value={profile.email}
            onChange={(v) => set("email", v)}
            placeholder="ayse@ornek.com"
          />
          <Field label="Telefon" type="tel" value={profile.phone} onChange={(v) => set("phone", v)} placeholder="+90 5xx xxx xx xx" />
        </div>
      </Section>

      <Section title="Hakkında">
        <textarea
          value={profile.bio}
          onChange={(e) => set("bio", e.target.value)}
          rows={4}
          placeholder="Kendinizden kısaca bahsedin..."
          className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </Section>

      <Section title="Sosyal Medya">
        <SocialLinks socials={profile.socials} onChange={(s) => set("socials", s)} />
      </Section>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}
