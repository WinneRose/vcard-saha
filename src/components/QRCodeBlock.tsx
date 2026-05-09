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

  useEffect(() => {
    if (!onCanvasReady) return;
    const canvas = wrapperRef.current?.querySelector("canvas") ?? null;
    onCanvasReady(canvas);
  }, [value, onCanvasReady]);

  return (
    <div ref={wrapperRef} className="inline-flex flex-col items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <QRCodeCanvas value={value || " "} size={size} level="M" includeMargin={false} />
      <p className="text-xs text-slate-500">vCard QR kodu</p>
    </div>
  );
}
