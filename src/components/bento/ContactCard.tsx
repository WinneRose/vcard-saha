import { Mail, Phone, MapPin } from "lucide-react";

type Props = { email: string; phone: string; address: string };

export function ContactCard({ email, phone, address }: Props) {
  if (!email && !phone && !address) return null;
  return (
    <div className="relative col-span-2 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <div className="absolute left-6 top-0 h-1 w-12 rounded-b-full bg-brand-cyan" />
      <p className="text-[11px] font-medium uppercase tracking-widest text-brand-cyan2">İletişim</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {email && (
          <li>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-brand-navy">
              <Mail className="h-4 w-4 text-brand-cyan2" />
              <span className="break-all">{email}</span>
            </a>
          </li>
        )}
        {phone && (
          <li>
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-brand-navy">
              <Phone className="h-4 w-4 text-brand-cyan2" />
              <span>{phone}</span>
            </a>
          </li>
        )}
        {address && (
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-cyan2" />
            <span>{address}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
