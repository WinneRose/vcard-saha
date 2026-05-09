"use client";

import Link from "next/link";
import type { SavedProfileEntry } from "@/lib/saved-profiles";

type Props = {
  saved: SavedProfileEntry[];
  onCreateNew: () => void;
};

export function ProfileChoice({ saved, onCreateNew }: Props) {
  const single = saved.length === 1;
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy2 to-brand-blue p-6 text-white sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">Tekrar hoş geldin</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
          Düzenlemek mi, yeni mi oluşturalım?
        </h1>
        <p className="mt-3 text-sm text-white/75">
          Bu tarayıcıdan {single ? "yayınladığın bir profil" : `${saved.length} yayınlanmış profil`} var.
        </p>
      </div>

      <ul className="space-y-2">
        {saved.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/edit/${s.slug}`}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200/80 transition active:scale-[0.99] hover:ring-brand-blue"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-navy">{s.fullName || s.slug}</p>
                <p className="truncate font-mono text-xs text-slate-500">/p/{s.slug}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-brand-blue">Düzenle</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        veya
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={onCreateNew}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand-red text-sm font-semibold text-white shadow-md hover:bg-brand-redDark active:scale-[0.99]"
      >
        Yeni Profil Oluştur
      </button>

      <p className="text-center text-xs text-slate-500">
        Yeni profile geçince formdaki taslak sıfırlanır.
      </p>
    </div>
  );
}
