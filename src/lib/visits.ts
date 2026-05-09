import { sql, ensureSchema } from "./db";

export async function getVisits(): Promise<number> {
  await ensureSchema();
  const q = sql();
  const rows = (await q`SELECT visits FROM site_stats WHERE id = 1`) as unknown as Array<{ visits: string | number }>;
  if (rows.length === 0) return 0;
  return Number(rows[0].visits);
}

export async function incrementVisits(): Promise<number> {
  await ensureSchema();
  const q = sql();
  const rows = (await q`
    UPDATE site_stats
    SET visits = visits + 1
    WHERE id = 1
    RETURNING visits
  `) as unknown as Array<{ visits: string | number }>;
  if (rows.length === 0) {
    const inserted = (await q`
      INSERT INTO site_stats (id, visits) VALUES (1, 1)
      ON CONFLICT (id) DO UPDATE SET visits = site_stats.visits + 1
      RETURNING visits
    `) as unknown as Array<{ visits: string | number }>;
    return Number(inserted[0]?.visits ?? 0);
  }
  return Number(rows[0].visits);
}
