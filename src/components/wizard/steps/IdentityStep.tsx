"use client";

import type { Profile } from "@/types/profile";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Field } from "../fields";

type Props = {
  profile: Profile;
  set: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
};

export function IdentityStep({ profile, set }: Props) {
  return (
    <div className="space-y-5">
      <PhotoUpload photoDataUrl={profile.photoDataUrl} onChange={(d) => set("photoDataUrl", d)} />

      <Field
        label="Ad Soyad"
        value={profile.fullName}
        onChange={(v) => set("fullName", v)}
        placeholder="Ayşe Yılmaz"
        required
      />
      <Field
        label="Ünvan"
        value={profile.title}
        onChange={(v) => set("title", v)}
        placeholder="Senior Frontend Developer"
      />
      <Field
        label="Kurum"
        value={profile.organization}
        onChange={(v) => set("organization", v)}
        placeholder="Acme Inc."
      />
    </div>
  );
}
