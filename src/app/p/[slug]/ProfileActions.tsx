"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Download, Copy, Check } from "lucide-react";
import type { Profile } from "@/types/profile";
import { buildVCard } from "@/lib/vcard";
import { downloadText, safeFilename } from "@/lib/download";
import { hasEditToken } from "@/lib/saved-profiles";

type Props = { slug: string; profile: Profile };

export function ProfileActions({ slug, profile }: Props) {
  const [canEdit, setCanEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanEdit(hasEditToken(slug));
  }, [slug]);

  const handleVCard = () => {
    const vcf = buildVCard(profile);
    downloadText(`${safeFilename(profile.fullName) || slug}.vcf`, vcf, "text/vcard");
  };

  const handleCopy = async () => {
    if (typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        {copied ? "Kopyalandı" : "Linki Kopyala"}
      </button>
      <button
        type="button"
        onClick={handleVCard}
        className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        <Download className="h-4 w-4" />
        .vcf
      </button>
      {canEdit && (
        <Link
          href={`/edit/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Düzenle
        </Link>
      )}
    </div>
  );
}
