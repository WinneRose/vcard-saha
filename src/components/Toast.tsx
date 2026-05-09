"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type Props = {
  message: string | null;
  variant?: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export function Toast({ message, variant = "success", onClose, duration = 3000 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  const bg = variant === "success" ? "bg-brand-blue" : "bg-brand-red";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2 px-4 sm:top-6"
    >
      <div
        className={`pointer-events-auto flex items-center gap-2 rounded-2xl ${bg} px-4 py-3 text-sm font-medium text-white shadow-lg animate-fade-in-up`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{message}</span>
        <button type="button" onClick={onClose} aria-label="Kapat" className="ml-2 opacity-80 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
