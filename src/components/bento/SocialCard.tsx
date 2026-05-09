import { Linkedin, Github, Twitter, Globe, ArrowUpRight } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/types/profile";
import { PLATFORM_META, extractHandle } from "@/lib/social";

const ICONS: Record<SocialPlatform, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  website: Globe,
};

type Props = { link: SocialLink };

export function SocialCard({ link }: Props) {
  const meta = PLATFORM_META[link.platform];
  const Icon = ICONS[link.platform];
  const handle = extractHandle(link.platform, link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className={`group relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} p-6 text-white shadow-md transition hover:shadow-xl hover:-translate-y-0.5`}
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-black/30 blur-3xl" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-md">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">{meta.label}</p>
            <p className="mt-0.5 text-base font-semibold">{handle || "Bağlantı"}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-white/70 transition group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </a>
  );
}
