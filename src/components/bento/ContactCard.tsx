import { Mail, Phone, MapPin } from "lucide-react";
import clsx from "clsx";

type Props = { className?: string; email: string; phone: string; address: string };

export function ContactCard({ className, email, phone, address }: Props) {
  if (!email && !phone && !address) return null;
  return (
    <div className={clsx("relative overflow-hidden rounded-3xl bg-[#E8F4FD] p-6 ring-1 ring-brand-blue/15", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue">İletişim</p>
      <h3 className="mt-1 text-base font-semibold text-brand-navy">Bana ulaş</h3>

      <div className="mt-4 space-y-2">
        {email && (
          <a href={`mailto:${email}`} className="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition active:scale-[0.99] hover:shadow-md">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">E-posta</p>
              <p className="truncate text-sm font-medium text-brand-navy group-hover:text-brand-red">{email}</p>
            </div>
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition active:scale-[0.99] hover:shadow-md">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Phone className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Telefon</p>
              <p className="truncate text-sm font-medium text-brand-navy group-hover:text-brand-red">{phone}</p>
            </div>
          </a>
        )}
        {address && (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Adres</p>
              <p className="truncate text-sm font-medium text-brand-navy">{address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
