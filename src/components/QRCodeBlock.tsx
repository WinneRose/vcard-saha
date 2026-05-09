"use client";

import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  value: string;
  size?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
};

// QR Version 40 / Level L holds ~2,953 bytes; keep a safety margin.
const MAX_QR_BYTES = 2500;

export function QRCodeBlock({ value, size = 180, onCanvasReady }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trimmed = value && value.trim().length > 0 ? value : "BEGIN:VCARD\r\nVERSION:3.0\r\nEND:VCARD";
  const byteLength = new TextEncoder().encode(trimmed).length;
  const tooLong = byteLength > MAX_QR_BYTES;

  useEffect(() => {
    if (!onCanvasReady) return;
    if (tooLong) {
      onCanvasReady(null);
      return;
    }
    const canvas = wrapperRef.current?.querySelector("canvas") ?? null;
    onCanvasReady(canvas);
  }, [trimmed, tooLong, onCanvasReady]);

  if (tooLong) {
    return (
      <div className="inline-flex max-w-[220px] flex-col items-center gap-2 rounded-xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
        <p className="text-xs font-medium text-amber-800">QR kodu için içerik çok uzun</p>
        <p className="text-[11px] leading-snug text-amber-700">
          Bio veya bağlantıları kısaltın ya da .vcf dosyasını paylaşın.
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="inline-flex flex-col items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <QRCodeCanvas value={trimmed} size={size} level="L" marginSize={0} />
      <p className="text-xs text-slate-500">vCard QR kodu</p>
    </div>
  );
}
