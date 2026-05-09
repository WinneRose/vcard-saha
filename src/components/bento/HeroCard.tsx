import { User, MapPin } from "lucide-react";
import clsx from "clsx";

type Props = {
  className?: string;
  fullName: string;
  title: string;
  organization: string;
  photoDataUrl: string;
};

export function HeroCard({ className, fullName, title, organization, photoDataUrl }: Props) {
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl bg-[#DCEEFB] p-6 ring-1 ring-brand-blue/10 sm:p-8",
        className,
      )}
    >
      <div className="relative flex h-full flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-white shadow-sm ring-2 ring-white sm:h-28 sm:w-28">
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoDataUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-blue text-2xl font-semibold text-white sm:text-3xl">
              {initials || <User className="h-12 w-12" />}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue">vCard</p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl">
            {fullName || "Adınız"}
          </h1>
          {title && <p className="mt-1 text-sm text-brand-navy/80 sm:text-base">{title}</p>}
          {organization && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-navy">
              <MapPin className="h-3 w-3 text-brand-red" />
              {organization}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
