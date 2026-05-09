"use client";

import { useEffect, useState } from "react";
import { X, Download, ExternalLink } from "lucide-react";
import { downloadDataUrl } from "@/lib/download";

type Props = {
  open: boolean;
  src: string;
  fileName?: string;
  onClose: () => void;
};

function dataUrlToBlobUrl(dataUrl: string): string | null {
  try {
    const [meta, b64] = dataUrl.split(",");
    if (!b64) return null;
    const mime = /:(.*?);/.exec(meta)?.[1] || "application/pdf";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return null;
  }
}

export function PdfViewer({ open, src, fileName, onClose }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !src) {
      setBlobUrl(null);
      return;
    }
    const url = dataUrlToBlobUrl(src);
    setBlobUrl(url);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [open, src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !src) return null;

  const handleNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } else {
      const win = window.open();
      if (win) win.document.write(`<iframe src="${src}" style="border:0;width:100vw;height:100vh"></iframe>`);
    }
  };

  const handleDownload = () => {
    downloadDataUrl(fileName || "cv.pdf", src);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-brand-navy/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="safe-top flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 text-white sm:px-4 sm:py-3">
        <p className="truncate text-sm font-medium">{fileName || "CV"}</p>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleNewTab}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-white/10 px-3 text-xs font-medium hover:bg-white/20"
            title="Yeni sekme"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Yeni sekme</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-white/10 px-3 text-xs font-medium hover:bg-white/20"
            title="İndir"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">İndir</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-brand-red px-3 text-xs font-semibold text-white hover:bg-brand-redDark"
            title="Kapat"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kapat</span>
          </button>
        </div>
      </div>
      <div className="safe-bottom flex-1 p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
        {blobUrl ? (
          <object
            data={blobUrl}
            type="application/pdf"
            className="h-full w-full rounded-xl bg-white"
          >
            <iframe src={blobUrl} title={fileName || "CV"} className="h-full w-full rounded-xl border-0 bg-white" />
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 text-center text-sm text-slate-600">
              <p>Tarayıcınız PDF&apos;yi gömülü gösteremiyor.</p>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white"
              >
                <Download className="h-4 w-4" /> PDF&apos;yi indir
              </button>
            </div>
          </object>
        ) : (
          <div className="flex h-full items-center justify-center text-white/70">
            <p className="text-sm">PDF yükleniyor…</p>
          </div>
        )}
      </div>
    </div>
  );
}
