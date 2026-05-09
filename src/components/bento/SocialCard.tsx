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
  linkedin: { label: "LinkedIn", accent: "#0A66C2", orb: "rgba(10, 102, 194, 0.18)" },
  github: { label: "GitHub", accent: "#0F1A2A", orb: "rgba(15, 26, 42, 0.18)" },
  twitter: { label: "Twitter", accent: "#0F1A2A", orb: "rgba(15, 26, 42, 0.18)" },
  website: { label: "Web", accent: "#00B5DB", orb: "rgba(0, 181, 219, 0.22)" },
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
      className="group relative col-span-2 overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTop: `2px solid ${meta.accent}` }}
    >
      <div
        className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full blur-3xl"
        style={{ background: meta.orb }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: meta.accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">{meta.label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-brand-ink">{handle || "Bağlantı"}</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-navy" />
      </div>
    </a>
  );
}
