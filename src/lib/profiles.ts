import { nanoid } from "nanoid";
import { sql, ensureSchema } from "./db";
import { slugify, isValidSlug } from "./slug";
import type { Profile } from "@/types/profile";

export type ProfileRecord = {
  slug: string;
  data: Profile;
  createdAt: string;
  updatedAt: string;
};

const RESERVED = new Set(["api", "p", "print", "_next", "admin", "new", "edit"]);

export async function createProfile(rawSlug: string | undefined, data: Profile): Promise<{ slug: string; editToken: string }> {
  await ensureSchema();
  const base = (rawSlug && isValidSlug(rawSlug) ? rawSlug : slugify(rawSlug || data.fullName || "profil")) || "profil";
  const slug = await nextAvailableSlug(base);
  const editToken = nanoid(24);
  const q = sql();
  await q`
    INSERT INTO profiles (slug, data, edit_token)
    VALUES (${slug}, ${JSON.stringify(data)}, ${editToken})
  `;
  return { slug, editToken };
}

async function nextAvailableSlug(base: string): Promise<string> {
  const q = sql();
  let candidate = base;
  if (RESERVED.has(candidate)) candidate = `${base}-1`;
  for (let i = 0; i < 200; i++) {
    const rows = (await q`SELECT 1 FROM profiles WHERE slug = ${candidate}`) as unknown as Array<{ "?column?": number }>;
    if (rows.length === 0) return candidate;
    candidate = `${base}-${i + 2}`;
  }
  return `${base}-${nanoid(6).toLowerCase()}`;
}

export async function getProfile(slug: string): Promise<ProfileRecord | null> {
  if (!isValidSlug(slug)) return null;
  await ensureSchema();
  const q = sql();
  const rows = (await q`
    SELECT slug, data, created_at, updated_at FROM profiles WHERE slug = ${slug}
  `) as unknown as Array<{ slug: string; data: Profile; created_at: string; updated_at: string }>;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    slug: row.slug,
    data: row.data,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function incrementProfileViews(slug: string): Promise<number> {
  if (!isValidSlug(slug)) return 0;
  await ensureSchema();
  const q = sql();
  const rows = (await q`
    UPDATE profiles
    SET view_count = view_count + 1
    WHERE slug = ${slug}
    RETURNING view_count
  `) as unknown as Array<{ view_count: string | number }>;
  return rows.length > 0 ? Number(rows[0].view_count) : 0;
}

export async function updateProfile(slug: string, editToken: string, data: Profile): Promise<boolean> {
  if (!isValidSlug(slug)) return false;
  await ensureSchema();
  const q = sql();
  const rows = (await q`
    UPDATE profiles
    SET data = ${JSON.stringify(data)}, updated_at = NOW()
    WHERE slug = ${slug} AND edit_token = ${editToken}
    RETURNING slug
  `) as unknown as Array<{ slug: string }>;
  return rows.length > 0;
}
