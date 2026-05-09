"use client";

import { Linkedin, Github, Twitter, Globe } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/types/profile";

type Props = {
  socials: SocialLink[];
  onChange: (next: SocialLink[]) => void;
};

const META: Record<SocialPlatform, { label: string; placeholder: string; Icon: typeof Linkedin; bg: string }> = {
  linkedin: { label: "LinkedIn", placeholder: "https://linkedin.com/in/kullanici", Icon: Linkedin, bg: "bg-brand-blue/10 text-brand-blue" },
  github: { label: "GitHub", placeholder: "https://github.com/kullanici", Icon: Github, bg: "bg-brand-navy/10 text-brand-navy" },
  twitter: { label: "Twitter / X", placeholder: "https://twitter.com/kullanici", Icon: Twitter, bg: "bg-brand-navy/10 text-brand-navy" },
  website: { label: "Web Sitesi", placeholder: "https://siteniz.com", Icon: Globe, bg: "bg-brand-orange/15 text-brand-orange" },
};

export function SocialLinks({ socials, onChange }: Props) {
  const update = (idx: number, url: string) => {
    const next = socials.map((s, i) => (i === idx ? { ...s, url } : s));
    onChange(next);
  };

  return (
    <div className="space-y-2.5">
      {socials.map((s, idx) => {
        const meta = META[s.platform];
        const { Icon } = meta;
        return (
          <label key={s.platform} className="flex items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}>
              <Icon className="h-4 w-4" />
            </span>
            <input
              type="url"
              value={s.url}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={meta.placeholder}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-brand-navy focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
            />
          </label>
        );
      })}
    </div>
  );
}
