"use client";

import { useEffect } from "react";
import { X, Download, ExternalLink } from "lucide-react";
import { downloadDataUrl } from "@/lib/download";

type Props = {
  open: boolean;
  src: string;
  fileName?: string;
  onClose: () => void;
};

export function PdfViewer({ open, src, fileName, onClose }: Props) {
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
    const win = window.open();
    if (!win) return;
    win.document.write(
      `<iframe src="${src}" style="border:0;width:100vw;height:100vh" title="${fileName ?? "CV"}"></iframe>`,
    );
  };

  const handleDownload = () => {
    downloadDataUrl(fileName || "cv.pdf", src);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-brand-ink/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3 text-white">
        <p className="truncate text-sm font-medium">{fileName || "CV"}</p>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleNewTab}
            className="inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Yeni sekme
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
          >
            <Download className="h-3.5 w-3.5" />
            İndir
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md bg-brand-cyan px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-cyan2 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Kapat
          </button>
        </div>
      </div>
      <div className="flex-1 p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={src}
          title={fileName || "CV"}
          className="h-full w-full rounded-lg border-0 bg-white"
        />
      </div>
    </div>
  );
}
