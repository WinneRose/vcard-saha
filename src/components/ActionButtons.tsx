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
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        .vcf İndir
      </button>
      <button
        type="button"
        onClick={handleQR}
        disabled={!qrCanvas}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
      >
        <QrCode className="h-4 w-4" />
        QR PNG İndir
      </button>
      <button
        type="button"
        onClick={handlePDF}
        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
      >
        <FileText className="h-4 w-4" />
        PDF (CV) İndir
      </button>
    </div>
  );
}
