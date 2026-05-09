import { User } from "lucide-react";

type Props = {
  fullName: string;
  title: string;
  organization: string;
  photoDataUrl: string;
};

export function HeroCard({ fullName, title, organization, photoDataUrl }: Props) {
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <div className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy2 to-brand-blue p-7 text-white shadow-lg sm:p-8">
      <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-brand-sky/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-orange/25 blur-3xl" />
      <div className="absolute right-6 top-6 h-1.5 w-12 rounded-full bg-brand-red" />

      <div className="relative flex h-full flex-col">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/40 sm:h-28 sm:w-28">
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-wide text-white/90">
              {initials || <User className="h-12 w-12" />}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{fullName || "Adınız"}</h1>
          {title && <p className="mt-1 text-sm text-white/90 sm:text-base">{title}</p>}
          {organization && <p className="text-sm text-brand-orange">{organization}</p>}
        </div>
      </div>
    </div>
  );
}
