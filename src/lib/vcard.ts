import type { Profile } from "@/types/profile";

function escape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

export function buildVCard(p: Profile): string {
  const { first, last } = splitName(p.fullName);
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  if (p.fullName) {
    lines.push(`N:${escape(last)};${escape(first)};;;`);
    lines.push(`FN:${escape(p.fullName)}`);
  }
  if (p.organization) lines.push(`ORG:${escape(p.organization)}`);
  if (p.title) lines.push(`TITLE:${escape(p.title)}`);
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET:${p.email}`);
  if (p.phone) lines.push(`TEL;TYPE=CELL:${p.phone}`);
  if (p.address) lines.push(`ADR;TYPE=WORK:;;${escape(p.address)};;;;`);
  if (p.bio) lines.push(`NOTE:${escape(p.bio)}`);

  for (const s of p.socials) {
    if (!s.url) continue;
    lines.push(`URL;TYPE=${s.platform.toUpperCase()}:${s.url}`);
  }

  if (p.photoDataUrl && p.photoDataUrl.startsWith("data:image")) {
    const match = p.photoDataUrl.match(/^data:image\/([a-zA-Z]+);base64,(.*)$/);
    if (match) {
      const [, type, data] = match;
      lines.push(`PHOTO;ENCODING=b;TYPE=${type.toUpperCase()}:${data}`);
    }
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
