"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function dataUrlToBlobUrl(dataUrl: string): string | null {
  try {
    const [meta, b64] = dataUrl.split(",");
    if (!b64) return null;
    const mime = /:(.*?);/.exec(meta)?.[1] || "application/pdf";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return null;
  }
}

type Props = { src: string };

export default function PdfViewerInner({ src }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [err, setErr] = useState(false);

  const file = useMemo(() => {
    const blobUrl = dataUrlToBlobUrl(src);
    return blobUrl;
  }, [src]);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file);
    };
  }, [file]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => setWidth(Math.min(el.clientWidth - 16, 900));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!file) {
    return <FallbackMessage>PDF dosyası okunamadı.</FallbackMessage>;
  }

  if (err) {
    return <FallbackMessage>PDF açılamadı.</FallbackMessage>;
  }

  return (
    <div ref={wrapperRef} className="h-full w-full overflow-y-auto rounded-xl bg-white">
      <Document
        file={file}
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        onLoadError={() => setErr(true)}
        loading={<FallbackMessage>PDF yükleniyor…</FallbackMessage>}
        className="flex flex-col items-center gap-3 py-3"
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            width={width || undefined}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="overflow-hidden rounded-md shadow-sm ring-1 ring-slate-200"
          />
        ))}
      </Document>
    </div>
  );
}

function FallbackMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-white p-6 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}
