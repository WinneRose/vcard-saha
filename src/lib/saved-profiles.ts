const KEY = "vcard-saha:saved";

export type SavedProfileEntry = {
  slug: string;
  editToken: string;
  fullName: string;
  updatedAt: number;
};

function readAll(): SavedProfileEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((e) => e && typeof e.slug === "string" && typeof e.editToken === "string") : [];
  } catch {
    return [];
  }
}

function writeAll(entries: SavedProfileEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
}

export function listSavedProfiles(): SavedProfileEntry[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function rememberProfile(entry: { slug: string; editToken: string; fullName: string }): void {
  const all = readAll();
  const filtered = all.filter((e) => e.slug !== entry.slug);
  filtered.unshift({ ...entry, updatedAt: Date.now() });
  writeAll(filtered.slice(0, 50));
}

export function getEditToken(slug: string): string | null {
  return readAll().find((e) => e.slug === slug)?.editToken ?? null;
}

export function hasEditToken(slug: string): boolean {
  return getEditToken(slug) !== null;
}

export function forgetProfile(slug: string): void {
  writeAll(readAll().filter((e) => e.slug !== slug));
}
