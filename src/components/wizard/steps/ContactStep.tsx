"use client";

import type { Profile } from "@/types/profile";
import { Field } from "../fields";

type Props = {
  profile: Profile;
  set: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
};

export function ContactStep({ profile, set }: Props) {
  return (
    <div className="space-y-5">
      <Field
        label="E-posta"
        type="email"
        value={profile.email}
        onChange={(v) => set("email", v)}
        placeholder="ayse@ornek.com"
      />
      <Field
        label="Telefon"
        type="tel"
        value={profile.phone}
        onChange={(v) => set("phone", v)}
        placeholder="+90 5xx xxx xx xx"
      />
      <Field
        label="Adres"
        value={profile.address}
        onChange={(v) => set("address", v)}
        placeholder="İstanbul, Türkiye"
      />
    </div>
  );
}
