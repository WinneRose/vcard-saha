import { Mail, Phone, MapPin } from "lucide-react";

type Props = { email: string; phone: string; address: string };

export function ContactCard({ email, phone, address }: Props) {
  if (!email && !phone && !address) return null;
  return (
    <div className="relative col-span-2 overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200/80">
      <div className="absolute left-6 top-0 h-1.5 w-12 rounded-b-full bg-brand-blue" />
      <p className="text-[11px] font-medium uppercase tracking-widest text-brand-blue">İletişim</p>
      <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
        {email && (
          <li>
            <a href={`mailto:${email}`} className="flex items-center gap-2.5 hover:text-brand-red">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <span className="break-all">{email}</span>
            </a>
          </li>
        )}
        {phone && (
          <li>
            <a href={`tel:${phone}`} className="flex items-center gap-2.5 hover:text-brand-red">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <span>{phone}</span>
            </a>
          </li>
        )}
        {address && (
          <li className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span>{address}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
