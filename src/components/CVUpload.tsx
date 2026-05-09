"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X, Eye } from "lucide-react";
import { MAX_CV_BYTES } from "@/types/profile";

type Props = {
  cvFileDataUrl: string;
  cvFileName: string;
  onChange: (next: { cvFileDataUrl: string; cvFileName: string }) => void;
  onPreview?: () => void;
};

export function CVUpload({ cvFileDataUrl, cvFileName, onChange, onPreview }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Yalnızca PDF dosyası yükleyebilirsiniz.");
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setError(`Dosya çok büyük (max ${(MAX_CV_BYTES / 1_000_000).toFixed(1)} MB).`);
      return;
    }
    const dataUrl = await readAsDataUrl(file);
    onChange({ cvFileDataUrl: dataUrl, cvFileName: file.name });
  };

  if (cvFileDataUrl) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan2">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 truncate">
          <p className="truncate text-sm font-medium text-brand-ink">{cvFileName || "cv.pdf"}</p>
          <p className="text-xs text-slate-500">PDF yüklendi</p>
        </div>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-brand-navy hover:bg-slate-100"
            title="Önizle"
          >
            <Eye className="h-3.5 w-3.5" />
            Önizle
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange({ cvFileDataUrl: "", cvFileName: "" })}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          <X className="h-3.5 w-3.5" />
          Kaldır
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-brand-cyan hover:text-brand-navy"
      >
        <Upload className="h-4 w-4" />
        CV / PDF Yükle (max 3 MB)
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
