"use client";

import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  value: string;
  size?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
};

export function QRCodeBlock({ value, size = 180, onCanvasReady }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const safeValue = value && value.trim().length > 0 ? value : "BEGIN:VCARD\r\nVERSION:3.0\r\nEND:VCARD";

  useEffect(() => {
    if (!onCanvasReady) return;
    const canvas = wrapperRef.current?.querySelector("canvas") ?? null;
    onCanvasReady(canvas);
  }, [safeValue, onCanvasReady]);

  return (
    <div ref={wrapperRef} className="inline-flex flex-col items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <QRCodeCanvas value={safeValue} size={size} level="M" marginSize={0} />
      <p className="text-xs text-slate-500">vCard QR kodu</p>
    </div>
  );
}
