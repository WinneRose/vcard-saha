import { emptyProfile, type Profile, type SocialLink, type SocialPlatform } from "@/types/profile";

const VALID_PLATFORMS: SocialPlatform[] = ["linkedin", "github", "twitter", "website"];

function asString(v: unknown, max = 2000): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max);
}

function sanitizeSocials(input: unknown): SocialLink[] {
  const map = new Map<SocialPlatform, string>();
  if (Array.isArray(input)) {
    for (const item of input) {
      if (item && typeof item === "object") {
        const { platform, url } = item as { platform?: unknown; url?: unknown };
        if (typeof platform === "string" && (VALID_PLATFORMS as string[]).includes(platform)) {
          map.set(platform as SocialPlatform, typeof url === "string" ? url.slice(0, 500) : "");
        }
      }
    }
  }
  return VALID_PLATFORMS.map((p) => ({ platform: p, url: map.get(p) ?? "" }));
}

function sanitizePhoto(v: unknown): string {
  if (typeof v !== "string") return "";
  if (!v.startsWith("data:image/")) return "";
  if (v.length > 200_000) return "";
  return v;
}

function sanitizeCv(v: unknown): string {
  if (typeof v !== "string") return "";
  if (!v.startsWith("data:application/pdf;base64,")) return "";
  if (v.length > 4_500_000) return "";
  return v;
}

export function sanitizeProfile(input: unknown): Profile {
  if (!input || typeof input !== "object") return emptyProfile;
  const p = input as Record<string, unknown>;
  return {
    fullName: asString(p.fullName, 120),
    title: asString(p.title, 160),
    organization: asString(p.organization, 160),
    email: asString(p.email, 200),
    phone: asString(p.phone, 40),
    address: asString(p.address, 200),
    bio: asString(p.bio, 1000),
    photoDataUrl: sanitizePhoto(p.photoDataUrl),
    cvFileDataUrl: sanitizeCv(p.cvFileDataUrl),
    cvFileName: asString(p.cvFileName, 200),
    socials: sanitizeSocials(p.socials),
  };
}
