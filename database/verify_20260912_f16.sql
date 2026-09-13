-- Read-only verification; fails when mandatory F16 structure is absent.
\set ON_ERROR_STOP on
BEGIN READ ONLY;
DO $f16$
BEGIN
  IF (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='password_reset_tokens'
      AND column_name IN ('id','user_id','token_hash','expires_at','used_at','created_at')) <> 6 THEN
    RAISE EXCEPTION 'F16: missing columns';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.password_reset_tokens'::regclass
      AND confrelid='public.users'::regclass AND contype='f' AND confdeltype='r') THEN
    RAISE EXCEPTION 'F16: missing restrictive user FK';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='password_reset_tokens'
      AND indexname='password_reset_tokens_token_hash_key' AND indexdef LIKE 'CREATE UNIQUE INDEX%') OR
     NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='password_reset_tokens_user_id_idx') THEN
    RAISE EXCEPTION 'F16: missing indexes';
  END IF;
END
$f16$;
COMMIT;
