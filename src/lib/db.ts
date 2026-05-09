import { neon } from "@neondatabase/serverless";

let cachedSql: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

export function sql() {
  if (cachedSql) return cachedSql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to your environment (Vercel project settings).");
  }
  cachedSql = neon(url);
  return cachedSql;
}

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const q = sql();
      await q`
        CREATE TABLE IF NOT EXISTS profiles (
          slug TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          edit_token TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await q`CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON profiles (updated_at DESC)`;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
