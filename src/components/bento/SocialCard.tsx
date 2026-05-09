import { Linkedin, Github, Twitter, Globe, ArrowUpRight } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/types/profile";
import { extractHandle } from "@/lib/social";

const ICONS: Record<SocialPlatform, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  website: Globe,
};

const META: Record<SocialPlatform, { label: string; accent: string; orb: string }> = {
  linkedin: { label: "LinkedIn", accent: "#0071BC", orb: "rgba(0, 113, 188, 0.18)" },
  github: { label: "GitHub", accent: "#003A70", orb: "rgba(0, 58, 112, 0.18)" },
  twitter: { label: "Twitter", accent: "#003A70", orb: "rgba(0, 58, 112, 0.18)" },
  website: { label: "Web", accent: "#F39200", orb: "rgba(243, 146, 0, 0.22)" },
};

type Props = { link: SocialLink };

export function SocialCard({ link }: Props) {
  const Icon = ICONS[link.platform];
  const meta = META[link.platform];
  const handle = extractHandle(link.platform, link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative col-span-2 overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 transition active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTop: `3px solid ${meta.accent}` }}
    >
      <div
        className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full blur-3xl"
        style={{ background: meta.orb }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{ backgroundColor: meta.accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">{meta.label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-brand-navy">{handle || "Bağlantı"}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-red" />
      </div>
    </a>
  );
}
