"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import clsx from "clsx";
import { PdfViewer } from "@/components/PdfViewer";
import { downloadDataUrl } from "@/lib/download";

type Props = {
  className?: string;
  cvFileDataUrl: string;
  cvFileName: string;
};

export function CVCard({ className, cvFileDataUrl, cvFileName }: Props) {
  const [open, setOpen] = useState(false);
  if (!cvFileDataUrl) return null;
  const name = cvFileName || "cv.pdf";

  return (
    <>
      <div className={clsx("relative overflow-hidden rounded-3xl bg-[#FFF1DD] p-6 ring-1 ring-brand-orange/15", className)}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orangeDark">Belge</p>
        <h3 className="mt-1 text-base font-semibold text-brand-navy">CV / Özgeçmiş</h3>

        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-brand-navy text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-navy">{name}</p>
            <p className="text-xs text-slate-500">PDF dosyası</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center rounded-xl bg-brand-navy px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-navy2 active:scale-[0.98]"
          >
            Sitede Görüntüle
          </button>
          <button
            type="button"
            onClick={() => downloadDataUrl(name, cvFileDataUrl)}
            className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-xs font-medium text-brand-navy ring-1 ring-slate-300 hover:bg-brand-mist active:scale-[0.98]"
          >
            İndir
          </button>
        </div>
      </div>

      <PdfViewer open={open} src={cvFileDataUrl} fileName={name} onClose={() => setOpen(false)} />
    </>
  );
}
