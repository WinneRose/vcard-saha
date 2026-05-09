"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";

type Props = {
  photoDataUrl: string;
  onChange: (dataUrl: string) => void;
};

const MAX_BYTES = 500_000;

export function PhotoUpload({ photoDataUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const dataUrl = await readAndCompress(file);
    onChange(dataUrl);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-brand-mist ring-2 ring-slate-200 transition hover:ring-brand-red"
        title="Fotoğraf seç"
      >
        {photoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoDataUrl} alt="Profil" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-blue">
            <Camera className="h-8 w-8" />
          </div>
        )}
      </button>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-red px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-redDark active:scale-[0.98]"
        >
          Fotoğraf Yükle
        </button>
        {photoDataUrl && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-red"
          >
            <X className="h-3 w-3" /> Kaldır
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

async function readAndCompress(file: File): Promise<string> {
  const original = await fileToDataUrl(file);
  if (file.size <= MAX_BYTES) return original;
  return compressDataUrl(original, 512, 0.8);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function compressDataUrl(src: string, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(src);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}
