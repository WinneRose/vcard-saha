CREATE TABLE IF NOT EXISTS profiles (
  slug TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  edit_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON profiles (updated_at DESC);
