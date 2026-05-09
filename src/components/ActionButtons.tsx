"use client";

import { Download, FileText, QrCode } from "lucide-react";
import type { Profile } from "@/types/profile";
import { buildVCard } from "@/lib/vcard";
import { downloadDataUrl, downloadText, safeFilename } from "@/lib/download";

type Props = {
  profile: Profile;
  qrCanvas: HTMLCanvasElement | null;
};

export function ActionButtons({ profile, qrCanvas }: Props) {
  const baseName = safeFilename(profile.fullName);

  const handleVCard = () => {
    const vcf = buildVCard(profile);
    downloadText(`${baseName}.vcf`, vcf, "text/vcard");
  };

  const handleQR = () => {
    if (!qrCanvas) return;
    const url = qrCanvas.toDataURL("image/png");
    downloadDataUrl(`${baseName}-qr.png`, url);
  };

  const handlePDF = () => {
    window.open("/print", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleVCard}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98]"
      >
        <Download className="h-4 w-4" />
        .vcf İndir
      </button>
      <button
        type="button"
        onClick={handleQR}
        disabled={!qrCanvas}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-blue px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-blueDark active:scale-[0.98] disabled:opacity-50"
      >
        <QrCode className="h-4 w-4" />
        QR PNG
      </button>
      <button
        type="button"
        onClick={handlePDF}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-brand-navy ring-1 ring-slate-300 hover:bg-brand-mist active:scale-[0.98]"
      >
        <FileText className="h-4 w-4" />
        Yazdır / PDF
      </button>
    </div>
  );
}
