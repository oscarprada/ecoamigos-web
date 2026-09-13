-- F16 incremental: run once after D01/F09, never against an unreviewed legacy schema.
-- Existing table causes a safe transaction failure; no IF NOT EXISTS masking drift.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '5min';
CREATE TABLE public.password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  token_hash VARCHAR(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CHECK (expires_at > created_at)
);
CREATE INDEX password_reset_tokens_user_id_idx ON public.password_reset_tokens(user_id);
COMMIT;
