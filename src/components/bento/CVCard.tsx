"use client";

import { useState } from "react";
import { FileText, Eye, Download } from "lucide-react";
import { PdfViewer } from "@/components/PdfViewer";
import { downloadDataUrl } from "@/lib/download";

type Props = {
  cvFileDataUrl: string;
  cvFileName: string;
};

export function CVCard({ cvFileDataUrl, cvFileName }: Props) {
  const [open, setOpen] = useState(false);
  if (!cvFileDataUrl) return null;
  const name = cvFileName || "cv.pdf";

  return (
    <>
      <div className="relative col-span-2 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200 transition hover:ring-brand-cyan">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-cyan/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-brand-navy/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white">
            <FileText className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-cyan2">CV / Özgeçmiş</p>
            <p className="mt-1 truncate text-sm font-semibold text-brand-ink">{name}</p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-navy2"
          >
            <Eye className="h-3.5 w-3.5" />
            Sitede Görüntüle
          </button>
          <button
            type="button"
            onClick={() => downloadDataUrl(name, cvFileDataUrl)}
            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-brand-navy ring-1 ring-slate-300 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            İndir
          </button>
        </div>
      </div>

      <PdfViewer open={open} src={cvFileDataUrl} fileName={name} onClose={() => setOpen(false)} />
    </>
  );
}
