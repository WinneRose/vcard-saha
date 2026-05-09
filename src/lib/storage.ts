import { emptyProfile, type Profile, type SocialLink, type SocialPlatform } from "@/types/profile";

const KEY = "vcard-saha:profile";
const VALID_PLATFORMS: SocialPlatform[] = ["linkedin", "github", "twitter", "website"];

function sanitizeSocials(input: unknown): SocialLink[] {
  const valid = new Map<SocialPlatform, string>();
  if (Array.isArray(input)) {
    for (const item of input) {
      if (item && typeof item === "object") {
        const { platform, url } = item as { platform?: unknown; url?: unknown };
        if (typeof platform === "string" && (VALID_PLATFORMS as string[]).includes(platform)) {
          valid.set(platform as SocialPlatform, typeof url === "string" ? url : "");
        }
      }
    }
  }
  return VALID_PLATFORMS.map((p) => ({ platform: p, url: valid.get(p) ?? "" }));
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function loadProfile(): Profile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      fullName: asString(parsed.fullName),
      title: asString(parsed.title),
      organization: asString(parsed.organization),
      email: asString(parsed.email),
      phone: asString(parsed.phone),
      address: asString(parsed.address),
      bio: asString(parsed.bio),
      photoDataUrl: asString(parsed.photoDataUrl),
      socials: sanitizeSocials(parsed.socials),
    };
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // localStorage quota dolu olabilir (büyük foto). Sessizce yutuyoruz.
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
