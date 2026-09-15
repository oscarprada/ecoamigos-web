-- S01: apply only after backup/review. Never executed against the real DB by tests.
BEGIN;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.users'::regclass AND conname='users_session_version_check') THEN
    ALTER TABLE public.users ADD CONSTRAINT users_session_version_check CHECK (session_version >= 0);
  END IF;
END $$;
COMMIT;
