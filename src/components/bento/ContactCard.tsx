import { Mail, Phone, MapPin } from "lucide-react";

type Props = { email: string; phone: string; address: string };

export function ContactCard({ email, phone, address }: Props) {
  if (!email && !phone && !address) return null;
  return (
    <div className="col-span-2 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">İletişim</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {email && (
          <li>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-700">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="break-all">{email}</span>
            </a>
          </li>
        )}
        {phone && (
          <li>
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-blue-700">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{phone}</span>
            </a>
          </li>
        )}
        {address && (
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{address}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
