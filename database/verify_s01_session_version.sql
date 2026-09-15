-- Read-only verification; expect zero invalid rows and the named CHECK constraint.
SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns
WHERE table_schema='public' AND table_name='users' AND column_name='session_version';
SELECT count(*) AS invalid_rows FROM public.users WHERE session_version IS NULL OR session_version < 0;
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
WHERE conrelid='public.users'::regclass AND conname='users_session_version_check';
