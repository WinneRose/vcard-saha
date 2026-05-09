"use client";

import { QRCodeCanvas } from "qrcode.react";

type Props = { value: string };

const MAX_QR_BYTES = 2500;

export function QRCard({ value }: Props) {
  const bytes = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(value).length : value.length;
  const tooLong = bytes > MAX_QR_BYTES;

  return (
    <div className="relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-md">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-blue-400/30 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="rounded-2xl bg-white p-2">
          {tooLong ? (
            <div className="flex h-[120px] w-[120px] items-center justify-center text-center text-[10px] text-amber-700">
              İçerik çok uzun
            </div>
          ) : (
            <QRCodeCanvas value={value} size={120} level="L" marginSize={0} />
          )}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">Hızlı Ekle</p>
          <p className="mt-0.5 text-sm leading-snug text-white/90">
            Telefon kameranızla taratın — kişilere otomatik eklenir.
          </p>
        </div>
      </div>
    </div>
  );
}
