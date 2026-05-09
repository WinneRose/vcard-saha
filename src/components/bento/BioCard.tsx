type Props = { bio: string };

export function BioCard({ bio }: Props) {
  if (!bio) return null;
  return (
    <div className="col-span-2 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hakkında</p>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{bio}</p>
    </div>
  );
}
