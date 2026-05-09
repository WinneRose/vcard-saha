"use client";

import { Linkedin, Github, Twitter, Globe } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/types/profile";

type Props = {
  socials: SocialLink[];
  onChange: (next: SocialLink[]) => void;
};

const META: Record<SocialPlatform, { label: string; placeholder: string; Icon: typeof Linkedin }> = {
  linkedin: { label: "LinkedIn", placeholder: "https://linkedin.com/in/kullanici", Icon: Linkedin },
  github: { label: "GitHub", placeholder: "https://github.com/kullanici", Icon: Github },
  twitter: { label: "Twitter / X", placeholder: "https://twitter.com/kullanici", Icon: Twitter },
  website: { label: "Web Sitesi", placeholder: "https://siteniz.com", Icon: Globe },
};

export function SocialLinks({ socials, onChange }: Props) {
  const update = (idx: number, url: string) => {
    const next = socials.map((s, i) => (i === idx ? { ...s, url } : s));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {socials.map((s, idx) => {
        const meta = META[s.platform];
        const { Icon } = meta;
        return (
          <label key={s.platform} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <Icon className="h-4 w-4" />
            </span>
            <input
              type="url"
              value={s.url}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={meta.placeholder}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
        );
      })}
    </div>
  );
}
