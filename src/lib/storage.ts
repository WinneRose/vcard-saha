import { emptyProfile, type Profile } from "@/types/profile";

const KEY = "vcard-saha:profile";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return { ...emptyProfile, ...parsed, socials: parsed.socials ?? emptyProfile.socials };
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
