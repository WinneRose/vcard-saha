import { Linkedin, Github, Twitter, Globe, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { SocialLink, SocialPlatform } from "@/types/profile";
import { extractHandle } from "@/lib/social";

const ICONS: Record<SocialPlatform, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  website: Globe,
};

const META: Record<SocialPlatform, { label: string; bg: string; ring: string; pill: string; icon: string; title: string }> = {
  linkedin: {
    label: "LinkedIn",
    bg: "bg-[#E8F0FB]",
    ring: "ring-[#0071BC]/15",
    pill: "bg-[#0071BC]",
    icon: "text-white",
    title: "text-[#003A70]",
  },
  github: {
    label: "GitHub",
    bg: "bg-[#EEF1F5]",
    ring: "ring-[#003A70]/15",
    pill: "bg-[#003A70]",
    icon: "text-white",
    title: "text-[#003A70]",
  },
  twitter: {
    label: "Twitter / X",
    bg: "bg-[#EFF2F6]",
    ring: "ring-slate-300/40",
    pill: "bg-[#0F1A2A]",
    icon: "text-white",
    title: "text-[#0F1A2A]",
  },
  website: {
    label: "Web",
    bg: "bg-[#FFF1DD]",
    ring: "ring-brand-orange/20",
    pill: "bg-brand-orange",
    icon: "text-white",
    title: "text-brand-orangeDark",
  },
};

type Props = { className?: string; link: SocialLink };

export function SocialCard({ className, link }: Props) {
  const Icon = ICONS[link.platform];
  const meta = META[link.platform];
  const handle = extractHandle(link.platform, link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        "group relative overflow-hidden rounded-3xl p-5 ring-1 transition active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-md",
        meta.bg,
        meta.ring,
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl shadow-sm", meta.pill, meta.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-navy" />
        </div>
        <div className="mt-auto pt-4">
          <p className={clsx("text-[11px] font-semibold uppercase tracking-[0.18em]", meta.title, "opacity-70")}>{meta.label}</p>
          <p className={clsx("mt-1 truncate text-base font-semibold", meta.title)}>{handle || "Bağlantı"}</p>
        </div>
      </div>
    </a>
  );
}
