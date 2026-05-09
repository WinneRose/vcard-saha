import { Quote } from "lucide-react";
import clsx from "clsx";

type Props = { className?: string; bio: string };

export function BioCard({ className, bio }: Props) {
  if (!bio) return null;
  return (
    <div className={clsx("relative overflow-hidden rounded-3xl bg-[#FFE7E9] p-6 ring-1 ring-brand-red/10", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">Hakkında</p>
      <h3 className="mt-1 text-base font-semibold text-brand-redDark">Kısaca ben</h3>
      <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
        <Quote className="h-4 w-4 text-brand-red/60" />
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{bio}</p>
      </div>
    </div>
  );
}
