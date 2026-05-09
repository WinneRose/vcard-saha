"use client";

import { QRCodeCanvas } from "qrcode.react";

type Props = { value: string };

const MAX_QR_BYTES = 2500;

export function QRCard({ value }: Props) {
  const bytes = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(value).length : value.length;
  const tooLong = bytes > MAX_QR_BYTES;

  return (
    <div className="relative col-span-2 overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-slate-200/80">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand-sky/40 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="rounded-2xl bg-brand-navy p-2">
          {tooLong ? (
            <div className="flex h-[120px] w-[120px] items-center justify-center text-center text-[10px] text-amber-300">
              İçerik çok uzun
            </div>
          ) : (
            <div className="rounded-md bg-white p-1.5">
              <QRCodeCanvas value={value} size={108} level="L" marginSize={0} fgColor="#003A70" />
            </div>
          )}
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-brand-red">Hızlı Ekle</p>
          <p className="mt-1 text-sm font-semibold text-brand-navy">Telefonunla taratın</p>
          <p className="mt-1 text-xs text-slate-500">Kişilere otomatik eklenir.</p>
        </div>
      </div>
    </div>
  );
}
