import { User } from "lucide-react";

type Props = {
  fullName: string;
  title: string;
  organization: string;
  photoDataUrl: string;
};

export function HeroCard({ fullName, title, organization, photoDataUrl }: Props) {
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

  return (
    <div className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-fuchsia-400/40 blur-3xl" />
      <div className="relative flex h-full flex-col">
        <div className="h-28 w-28 overflow-hidden rounded-full bg-white/20 ring-4 ring-white/40 backdrop-blur">
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/90">
              {initials || <User className="h-12 w-12" />}
            </div>
          )}
        </div>
        <div className="mt-auto pt-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">{fullName || "Adınız"}</h1>
          {title && <p className="mt-1 text-base text-white/90">{title}</p>}
          {organization && <p className="text-sm text-white/70">{organization}</p>}
        </div>
      </div>
    </div>
  );
}
