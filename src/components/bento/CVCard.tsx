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
      <div className="relative col-span-2 overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 transition hover:ring-brand-red">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-red/12 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-red text-white shadow-sm">
            <FileText className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-widest text-brand-red">CV / Özgeçmiş</p>
            <p className="mt-1 truncate text-sm font-semibold text-brand-navy">{name}</p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-red px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98]"
          >
            <Eye className="h-3.5 w-3.5" />
            Sitede Görüntüle
          </button>
          <button
            type="button"
            onClick={() => downloadDataUrl(name, cvFileDataUrl)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-xs font-medium text-brand-navy ring-1 ring-slate-300 hover:bg-brand-mist active:scale-[0.98]"
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
