"use client";

import { QRCodeCanvas } from "qrcode.react";
import clsx from "clsx";

type Props = {
  className?: string;
  value: string;
  isUrl?: boolean;
  url?: string;
};

const MAX_QR_BYTES = 2500;

export function QRCard({ className, value, isUrl, url }: Props) {
  const bytes = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(value).length : value.length;
  const tooLong = bytes > MAX_QR_BYTES;
  const displayUrl = url ? url.replace(/^https?:\/\//, "") : "";

  return (
    <div className={clsx("relative overflow-hidden rounded-3xl bg-[#DCEEFB] p-6 ring-1 ring-brand-blue/15", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue">QR ile paylaş</p>
      <h3 className="mt-1 text-base font-semibold text-brand-navy">
        {isUrl ? "Profili paylaş" : "Hızlı kişi ekle"}
      </h3>

      <div className="mt-4 flex items-center gap-4">
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-brand-blue/15">
          {tooLong ? (
            <div className="flex h-[110px] w-[110px] items-center justify-center text-center text-[10px] text-amber-700">
              İçerik çok uzun
            </div>
          ) : (
            <QRCodeCanvas value={value} size={110} level="L" marginSize={0} fgColor="#003A70" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-600">Telefon kameranla taratın</p>
          {isUrl && displayUrl && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center break-all rounded-md bg-white px-2 py-1 font-mono text-[11px] text-brand-blue shadow-sm hover:text-brand-navy"
            >
              {displayUrl}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
