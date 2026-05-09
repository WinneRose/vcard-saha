"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Download, Copy, Check, Share2 } from "lucide-react";
import type { Profile } from "@/types/profile";
import { buildVCard } from "@/lib/vcard";
import { downloadText, safeFilename } from "@/lib/download";
import { hasEditToken } from "@/lib/saved-profiles";

type Props = { slug: string; profile: Profile };

export function ProfileActions({ slug, profile }: Props) {
  const [canEdit, setCanEdit] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanEdit(hasEditToken(slug));
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [slug]);

  const handleVCard = () => {
    const vcf = buildVCard(profile);
    downloadText(`${safeFilename(profile.fullName) || slug}.vcf`, vcf, "text/vcard");
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: profile.fullName ? `${profile.fullName} — vCard` : "vCard",
      text: profile.title || "Dijital kartvizit",
      url,
    };
    if (canShare) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or unsupported
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-mist px-3 text-sm font-medium text-brand-navy hover:bg-brand-blue/10"
        title="Paylaş"
      >
        {copied ? <Check className="h-4 w-4 text-brand-blue" /> : canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="hidden sm:inline">{copied ? "Kopyalandı" : "Paylaş"}</span>
      </button>
      <button
        type="button"
        onClick={handleVCard}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-blue px-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-blueDark active:scale-[0.98]"
        title=".vcf indir"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">.vcf</span>
      </button>
      {canEdit && (
        <Link
          href={`/edit/${slug}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-red px-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98]"
          title="Düzenle"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Düzenle</span>
        </Link>
      )}
    </div>
  );
}
