"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Globe, User, FileText } from "lucide-react";
import type { Profile, SocialPlatform } from "@/types/profile";

type Props = { profile: Profile };

const SOCIAL_ICON: Record<SocialPlatform, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  website: Globe,
};

const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter",
  website: "Web",
};

export function VCardPreview({ profile }: Props) {
  const fullName = profile.fullName || "Adınız Soyadınız";
  const title = profile.title || "Ünvanınız";
  const visibleSocials = profile.socials.filter((s) => s.url.trim());

  return (
    <article className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80">
      <div className="relative h-28 bg-gradient-to-br from-brand-navy via-brand-navy2 to-brand-blue">
        <div className="absolute -top-10 right-4 h-32 w-32 rounded-full bg-brand-sky/40 blur-3xl" />
        <div className="absolute bottom-3 left-6 h-1.5 w-12 rounded-full bg-brand-red" />
      </div>
      <div className="px-6 pb-6">
        <div className="-mt-14 flex items-end gap-4">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-brand-mist ring-4 ring-white">
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-blue">
                <User className="h-12 w-12" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-brand-navy">{fullName}</h1>
          <p className="text-base text-slate-700">{title}</p>
          {profile.organization && <p className="text-sm text-brand-orange">{profile.organization}</p>}
        </div>

        {profile.bio && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{profile.bio}</p>}

        <div className="mt-5 space-y-2 text-sm text-slate-700">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-brand-red">
              <Mail className="h-4 w-4 text-brand-blue" />
              {profile.email}
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-brand-red">
              <Phone className="h-4 w-4 text-brand-blue" />
              {profile.phone}
            </a>
          )}
          {profile.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-blue" />
              {profile.address}
            </div>
          )}
        </div>

        {profile.cvFileDataUrl && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-red/8 px-3 py-2 text-xs text-brand-navy ring-1 ring-brand-red/20">
            <FileText className="h-3.5 w-3.5 text-brand-red" />
            <span className="truncate">{profile.cvFileName || "cv.pdf"}</span>
            <span className="ml-auto text-slate-400">eklendi</span>
          </div>
        )}

        {visibleSocials.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {visibleSocials.map((s) => {
              const Icon = SOCIAL_ICON[s.platform];
              return (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-mist px-3 py-1.5 text-xs font-medium text-brand-navy hover:bg-brand-red hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {SOCIAL_LABEL[s.platform]}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
