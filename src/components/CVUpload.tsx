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
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 truncate">
          <p className="truncate text-sm font-medium text-brand-navy">{cvFileName || "cv.pdf"}</p>
          <p className="text-xs text-slate-500">PDF yüklendi</p>
        </div>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-medium text-brand-navy hover:bg-brand-mist"
            title="Önizle"
          >
            <Eye className="h-3.5 w-3.5" />
            Önizle
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange({ cvFileDataUrl: "", cvFileName: "" })}
          className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-xs text-slate-500 hover:bg-red-50 hover:text-brand-red"
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
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-blue/50 bg-brand-mist px-4 py-7 text-sm font-medium text-brand-navy transition hover:border-brand-red hover:bg-white active:scale-[0.99]"
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
      {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
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
