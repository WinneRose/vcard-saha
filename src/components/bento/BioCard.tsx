type Props = { bio: string };

export function BioCard({ bio }: Props) {
  if (!bio) return null;
  return (
    <div className="relative col-span-2 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <div className="absolute left-6 top-0 h-1 w-12 rounded-b-full bg-brand-cyan" />
      <p className="text-[11px] font-medium uppercase tracking-widest text-brand-cyan2">Hakkında</p>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{bio}</p>
    </div>
  );
}
