-- Verificacion de solo lectura posterior a 20260908_d01_migrate_existing.sql.
-- No consulta contraseñas, hashes ni contenido de negocio.
\set ON_ERROR_STOP on
BEGIN READ ONLY;

DO $verify$
DECLARE
  bad_count bigint;
  labels text[];
BEGIN
  IF to_regclass('public.winner_records') IS NULL OR to_regclass('public.prizes') IS NULL THEN
    RAISE EXCEPTION 'D01 no verificada: faltan tablas de compatibilidad oficiales.';
  END IF;

  SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder) INTO labels
    FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid
   WHERE t.typname='user_role' AND t.typnamespace='public'::regnamespace;
  IF labels IS DISTINCT FROM ARRAY['admin','leader'] THEN
    RAISE EXCEPTION 'D01 no verificada: user_role no coincide con el esquema oficial.';
  END IF;

  SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder) INTO labels
    FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid
   WHERE t.typname='record_status' AND t.typnamespace='public'::regnamespace;
  IF labels IS DISTINCT FROM ARRAY['pending','approved','rejected'] THEN
    RAISE EXCEPTION 'D01 no verificada: record_status no coincide con el esquema oficial.';
  END IF;

  IF (SELECT udt_name FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='role') <> 'user_role'
     OR (SELECT udt_name FROM information_schema.columns WHERE table_schema='public' AND table_name='recycling_records' AND column_name='status') <> 'record_status' THEN
    RAISE EXCEPTION 'D01 no verificada: users.role o recycling_records.status no usan los enum oficiales.';
  END IF;

  SELECT count(*) INTO bad_count FROM public.users
   WHERE password_hash IS NULL OR password_hash !~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$';
  IF bad_count > 0 THEN
    RAISE EXCEPTION 'D01 no verificada: % usuario(s) no tienen un password_hash bcrypt reconocible.', bad_count;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='users' AND column_name='password' AND is_nullable <> 'YES'
  ) THEN
    RAISE EXCEPTION 'D01 no verificada: users.password todavia obliga a las inserciones nuevas.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='points_catalog_identity_uidx') THEN
    RAISE EXCEPTION 'D01 no verificada: falta el indice normalizado de points_catalog.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.recycling_records
     WHERE user_id IS NULL OR team_id IS NULL OR material_type IS NULL OR quantity IS NULL
        OR unit IS NULL OR quality_level IS NULL OR criteria_count IS NULL OR record_date IS NULL OR status IS NULL
  ) THEN
    RAISE EXCEPTION 'D01 no verificada: recycling_records conserva nulos incompatibles.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='points_catalog'
       AND column_name='evidence_required' AND data_type='text'
  ) THEN
    RAISE EXCEPTION 'D01 no verificada: points_catalog.evidence_required no es TEXT.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='content_items' AND column_name='youtube_url'
  ) THEN
    RAISE EXCEPTION 'D01 no verificada: falta content_items.youtube_url.';
  END IF;
END
$verify$;

SELECT 'D01_OK' AS result,
  (SELECT count(*) FROM public.users) AS users,
  (SELECT count(*) FROM public.teams) AS teams,
  (SELECT count(*) FROM public.periods) AS periods,
  (SELECT count(*) FROM public.content_items) AS content_items,
  (SELECT count(*) FROM public.recycling_records) AS recycling_records,
  (SELECT count(*) FROM public.points_catalog) AS points_catalog,
  (SELECT count(*) FROM public.prizes) AS prizes,
  (SELECT count(*) FROM public.winner_records) AS winner_records;

-- Inventario que debe permanecer para una decision posterior. Solo muestra
-- existencia estructural y cantidades, nunca el contenido de las filas.
SELECT 'legacy_preserved' AS result,
  to_regclass('public.contents') IS NOT NULL AS contents_exists,
  (SELECT count(*) FROM public.contents) AS contents_rows,
  to_regclass('public.rewards') IS NOT NULL AS rewards_exists,
  (SELECT count(*) FROM public.rewards) AS rewards_rows,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='password') AS password_column,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teams' AND column_name='leader_id') AS leader_id_column,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recycling_records' AND column_name='quality_checked') AS quality_checked_column,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recycling_records' AND column_name='points') AS points_column;

COMMIT;
