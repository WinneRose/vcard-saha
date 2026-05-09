"use client";

import Link from "next/link";
import { Pencil, Plus, Sparkles, ChevronRight } from "lucide-react";
import type { SavedProfileEntry } from "@/lib/saved-profiles";

type Props = {
  saved: SavedProfileEntry[];
  onCreateNew: () => void;
};

export function ProfileChoice({ saved, onCreateNew }: Props) {
  const single = saved.length === 1;
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy2 to-brand-blue p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-brand-sky/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-brand-orange" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Tekrar hoş geldin</h1>
          <p className="mt-2 text-sm text-white/80">
            Bu tarayıcıdan {single ? "yayınladığın bir profil" : `${saved.length} yayınlanmış profil`} var.
            Düzenlemek mi istersin, yoksa yeni bir profil mi oluşturalım?
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {saved.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/edit/${s.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200/80 transition active:scale-[0.99] hover:ring-brand-red"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                <Pencil className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-navy">{s.fullName || s.slug}</p>
                <p className="truncate font-mono text-xs text-slate-500">/p/{s.slug}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red">
                Düzenle
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="relative my-2 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        veya
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={onCreateNew}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-red text-sm font-semibold text-white shadow-md hover:bg-brand-redDark active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" />
        Yeni Profil Oluştur
      </button>

      <p className="text-center text-xs text-slate-500">
        Yeni profile geçince formdaki taslak sıfırlanır.
      </p>
    </div>
  );
}
