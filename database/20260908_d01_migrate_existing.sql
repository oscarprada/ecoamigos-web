-- D01: migracion controlada de una instalacion historica al esquema oficial.
-- Diseñada a partir de database/inspect_existing.sql sobre la base existente.
-- No elimina tablas, columnas ni filas. No muestra credenciales ni hashes.
-- Ejecutar con psql -X -v ON_ERROR_STOP=1 -f database/20260908_d01_migrate_existing.sql
\set ON_ERROR_STOP on

BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '5min';
SELECT pg_advisory_xact_lock(hashtextextended('ecoamigos:d01:20260908', 0));

-- La migracion solo reconoce las seis tablas de negocio inspeccionadas. Si falta
-- alguna, no intenta adivinar si debe crearla o recuperar datos desde otra tabla.
DO $preflight$
DECLARE
  required_table text;
BEGIN
  FOREACH required_table IN ARRAY ARRAY[
    'users', 'teams', 'periods', 'content_items',
    'recycling_records', 'points_catalog'
  ] LOOP
    IF to_regclass('public.' || required_table) IS NULL THEN
      RAISE EXCEPTION
        'D01 abortada: falta la tabla requerida public.%. No se modifico la base.',
        required_table;
    END IF;
  END LOOP;
END
$preflight$;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $types$
DECLARE
  labels text[];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'leader');
  ELSE
    SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder)
      INTO labels
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
     WHERE t.typname = 'user_role' AND t.typnamespace = 'public'::regnamespace;
    IF labels IS DISTINCT FROM ARRAY['admin', 'leader'] THEN
      RAISE EXCEPTION 'D01 abortada: public.user_role contiene etiquetas no oficiales (%).', labels;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_status' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.record_status AS ENUM ('pending', 'approved', 'rejected');
  ELSE
    SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder)
      INTO labels
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
     WHERE t.typname = 'record_status' AND t.typnamespace = 'public'::regnamespace;
    IF labels IS DISTINCT FROM ARRAY['pending', 'approved', 'rejected'] THEN
      RAISE EXCEPTION 'D01 abortada: public.record_status contiene etiquetas no oficiales (%).', labels;
    END IF;
  END IF;
END
$types$;

-- Columnas oficiales que pueden añadirse sin interpretar datos historicos.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name varchar(120);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS team_id integer;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS dependency varchar(150);
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS created_at timestamp;

ALTER TABLE public.periods ADD COLUMN IF NOT EXISTS created_at timestamp;

ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS category varchar(30);
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS youtube_url text;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'published';
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS created_by integer;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS created_at timestamp;

ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS period_id integer;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS quality_level varchar(10);
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS criteria_count integer;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS record_date date;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS review_notes text;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS points_awarded integer;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS reviewed_by integer;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS reviewed_at timestamp;
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS catalog_group_name varchar(100);
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS catalog_action_name varchar(150);
ALTER TABLE public.recycling_records ADD COLUMN IF NOT EXISTS catalog_action_level varchar(100);

-- password_hash se completa solo desde un bcrypt reconocible. Nunca se sustituye
-- un password_hash ya existente y nunca se muestra su valor.
DO $password_migration$
DECLARE
  has_legacy_password boolean;
  unsafe_count bigint;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
  ) INTO has_legacy_password;

  IF EXISTS (SELECT 1 FROM public.users WHERE password_hash IS NULL) AND NOT has_legacy_password THEN
    RAISE EXCEPTION
      'D01 abortada: hay usuarios sin password_hash y no existe users.password para migrarlos.';
  END IF;

  IF has_legacy_password THEN
    EXECUTE $sql$
      SELECT count(*) FROM public.users
       WHERE password_hash IS NULL
         AND (password IS NULL OR password !~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$')
    $sql$ INTO unsafe_count;
    IF unsafe_count > 0 THEN
      RAISE EXCEPTION
        'D01 abortada: % usuario(s) requieren migracion de password, pero el valor historico no es un bcrypt reconocible. No se copio ningun valor.',
        unsafe_count;
    END IF;

    EXECUTE $sql$
      UPDATE public.users SET password_hash = password WHERE password_hash IS NULL
    $sql$;
  END IF;

  SELECT count(*) INTO unsafe_count
    FROM public.users
   WHERE password_hash IS NULL
      OR password_hash !~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$';
  IF unsafe_count > 0 THEN
    RAISE EXCEPTION
      'D01 abortada: % usuario(s) tienen password_hash nulo o no reconocible.', unsafe_count;
  END IF;

  IF has_legacy_password THEN
    ALTER TABLE public.users ALTER COLUMN password DROP NOT NULL;
    COMMENT ON COLUMN public.users.password IS
      'LEGADO D01: no usada por la aplicacion; conservar hasta retiro manual autorizado.';
  END IF;
END
$password_migration$;

-- Toda conversion que pudiera truncar, redondear, inventar o desconectar datos
-- se valida antes de cambiar tipos y restricciones.
DO $data_safety$
DECLARE
  bad_count bigint;
BEGIN
  SELECT count(*) INTO bad_count FROM public.users
   WHERE name IS NULL OR btrim(name) = '' OR email IS NULL OR btrim(email) = ''
      OR role::text NOT IN ('admin', 'leader');
  IF bad_count > 0 THEN
    RAISE EXCEPTION 'D01 abortada: % usuario(s) no cumplen nombre/email/rol oficiales.', bad_count;
  END IF;

  SELECT count(*) INTO bad_count FROM public.users WHERE length(name) > 120 OR length(email) > 150;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % usuario(s) exceden las longitudes oficiales.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM public.teams
   WHERE name IS NULL OR btrim(name) = '' OR dependency IS NULL OR btrim(dependency) = ''
      OR length(name) > 100 OR length(dependency) > 150;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % equipo(s) no cumplen nombre/dependencia oficiales.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM (SELECT name FROM public.teams GROUP BY name HAVING count(*) > 1) d;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: existen % nombre(s) de equipo duplicados; no se deduplican automaticamente.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM public.periods
   WHERE name IS NULL OR btrim(name) = '' OR start_date IS NULL OR end_date IS NULL OR length(name) > 120;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % periodo(s) tienen campos obligatorios ausentes o demasiado largos.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM (SELECT name FROM public.periods GROUP BY name HAVING count(*) > 1) d;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: existen % nombre(s) de periodo duplicados; no se deduplican automaticamente.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM public.content_items
   WHERE title IS NULL OR category IS NULL OR type IS NULL
      OR category NOT IN ('agua', 'energia', 'papel', 'residuos')
      OR type NOT IN ('text', 'image', 'video', 'file')
      OR status IS NULL OR status NOT IN ('draft', 'published')
      OR length(title) > 180 OR length(category) > 30 OR length(type) > 20 OR length(status) > 20;
  IF bad_count > 0 THEN
    RAISE EXCEPTION 'D01 abortada: % elemento(s) de content_items requieren clasificacion/correccion manual.', bad_count;
  END IF;

  SELECT count(*) INTO bad_count FROM public.points_catalog
   WHERE group_name IS NULL OR action_name IS NULL OR points IS NULL
      OR length(source_code) > 50 OR length(group_name) > 100 OR length(action_name) > 150
      OR length(action_level) > 100 OR length(max_frequency) > 50;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % fila(s) del catalogo no caben en el esquema oficial.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM (
    SELECT lower(btrim(group_name)), lower(btrim(action_name)), lower(btrim(coalesce(action_level, '')))
      FROM public.points_catalog GROUP BY 1, 2, 3 HAVING count(*) > 1
  ) d;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: existen % identidades normalizadas duplicadas en points_catalog.', bad_count; END IF;

  SELECT count(*) INTO bad_count FROM public.recycling_records
   WHERE user_id IS NULL OR team_id IS NULL OR material_type IS NULL OR quantity IS NULL
      OR unit IS NULL OR quality_level IS NULL OR criteria_count IS NULL OR record_date IS NULL OR status IS NULL
      OR material_type NOT IN ('papel_carton', 'plastico', 'vidrio', 'metal', 'organico')
      OR quality_level NOT IN ('alta', 'media', 'baja')
      OR status::text NOT IN ('pending', 'approved', 'rejected')
      OR quantity <= 0 OR quantity <> round(quantity, 2) OR abs(quantity) >= 100000000
      OR criteria_count < 0 OR length(material_type) > 30 OR length(unit) > 20 OR length(quality_level) > 10;
  IF bad_count > 0 THEN
    RAISE EXCEPTION 'D01 abortada: % registro(s) de reciclaje no pueden convertirse sin perder o inventar informacion.', bad_count;
  END IF;

  SELECT count(*) INTO bad_count
    FROM public.recycling_records r LEFT JOIN public.users u ON u.id = r.user_id
   WHERE u.id IS NULL;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % registro(s) apuntan a usuarios inexistentes.', bad_count; END IF;

  SELECT count(*) INTO bad_count
    FROM public.recycling_records r LEFT JOIN public.teams t ON t.id = r.team_id
   WHERE t.id IS NULL;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % registro(s) apuntan a equipos inexistentes.', bad_count; END IF;

  SELECT count(*) INTO bad_count
    FROM public.recycling_records r LEFT JOIN public.periods p ON p.id = r.period_id
   WHERE r.period_id IS NOT NULL AND p.id IS NULL;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % registro(s) apuntan a periodos inexistentes.', bad_count; END IF;

  SELECT count(*) INTO bad_count
    FROM public.recycling_records r LEFT JOIN public.users u ON u.id = r.reviewed_by
   WHERE r.reviewed_by IS NOT NULL AND u.id IS NULL;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % registro(s) apuntan a revisores inexistentes.', bad_count; END IF;

  SELECT count(*) INTO bad_count
    FROM public.users u LEFT JOIN public.teams t ON t.id = u.team_id
   WHERE u.team_id IS NOT NULL AND t.id IS NULL;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % usuario(s) apuntan a equipos inexistentes.', bad_count; END IF;

  SELECT count(*) INTO bad_count
    FROM public.content_items c LEFT JOIN public.users u ON u.id = c.created_by
   WHERE c.created_by IS NOT NULL AND u.id IS NULL;
  IF bad_count > 0 THEN RAISE EXCEPTION 'D01 abortada: % contenido(s) apuntan a creadores inexistentes.', bad_count; END IF;
END
$data_safety$;

-- Si solo existia points, se copia a points_awarded. Cuando ambas columnas ya
-- tienen valor no se fuerza su igualdad: points_awarded es la fuente oficial y
-- points permanece intacta como evidencia historica.
DO $legacy_points$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'recycling_records' AND column_name = 'points'
  ) THEN
    UPDATE public.recycling_records
       SET points_awarded = points
     WHERE points_awarded IS NULL AND points IS NOT NULL;
    COMMENT ON COLUMN public.recycling_records.points IS
      'LEGADO D01: conservar; la aplicacion usa points_awarded.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'recycling_records' AND column_name = 'quality_checked'
  ) THEN
    COMMENT ON COLUMN public.recycling_records.quality_checked IS
      'LEGADO D01: conservar; no equivale automaticamente a quality_level.';
  END IF;
END
$legacy_points$;

-- Conversiones sin perdida, ya protegidas por las validaciones anteriores.
ALTER TABLE public.users
  ALTER COLUMN name TYPE varchar(120),
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN email TYPE varchar(150),
  ALTER COLUMN password_hash TYPE text,
  ALTER COLUMN password_hash SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT true,
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
DO $convert_user_role$
BEGIN
  IF (SELECT udt_name FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='role') <> 'user_role' THEN
    ALTER TABLE public.users ALTER COLUMN role TYPE public.user_role USING role::text::public.user_role;
  END IF;
END
$convert_user_role$;
ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;

ALTER TABLE public.teams
  ALTER COLUMN name TYPE varchar(100),
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN dependency TYPE varchar(150),
  ALTER COLUMN dependency SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.periods
  ALTER COLUMN name TYPE varchar(120),
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN start_date SET NOT NULL,
  ALTER COLUMN end_date SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT false,
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.content_items
  ALTER COLUMN title TYPE varchar(180),
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN category TYPE varchar(30),
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN type TYPE varchar(20),
  ALTER COLUMN type SET NOT NULL,
  ALTER COLUMN status TYPE varchar(20),
  ALTER COLUMN status SET DEFAULT 'published',
  ALTER COLUMN created_at SET DEFAULT now();

DO $catalog_evidence_type$
DECLARE
  current_type text;
BEGIN
  SELECT data_type INTO current_type FROM information_schema.columns
   WHERE table_schema='public' AND table_name='points_catalog' AND column_name='evidence_required';
  IF current_type IS NULL THEN
    ALTER TABLE public.points_catalog ADD COLUMN evidence_required text;
  ELSIF current_type <> 'text' THEN
    ALTER TABLE public.points_catalog ALTER COLUMN evidence_required TYPE text USING evidence_required::text;
  END IF;
END
$catalog_evidence_type$;

ALTER TABLE public.points_catalog
  ALTER COLUMN source_code TYPE varchar(50),
  ALTER COLUMN group_name TYPE varchar(100),
  ALTER COLUMN group_name SET NOT NULL,
  ALTER COLUMN action_name TYPE varchar(150),
  ALTER COLUMN action_name SET NOT NULL,
  ALTER COLUMN action_level TYPE varchar(100),
  ALTER COLUMN points SET DEFAULT 0,
  ALTER COLUMN points SET NOT NULL,
  ALTER COLUMN max_frequency TYPE varchar(50);

ALTER TABLE public.recycling_records DROP CONSTRAINT IF EXISTS recycling_records_status_check;
ALTER TABLE public.recycling_records ALTER COLUMN status DROP DEFAULT;
DO $convert_record_status$
BEGIN
  IF (SELECT udt_name FROM information_schema.columns WHERE table_schema='public' AND table_name='recycling_records' AND column_name='status') <> 'record_status' THEN
    ALTER TABLE public.recycling_records ALTER COLUMN status TYPE public.record_status USING status::text::public.record_status;
  END IF;
END
$convert_record_status$;

ALTER TABLE public.recycling_records
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN team_id SET NOT NULL,
  ALTER COLUMN material_type TYPE varchar(30),
  ALTER COLUMN material_type SET NOT NULL,
  ALTER COLUMN quantity TYPE numeric(10,2) USING quantity::numeric(10,2),
  ALTER COLUMN quantity SET NOT NULL,
  ALTER COLUMN unit TYPE varchar(20),
  ALTER COLUMN unit SET DEFAULT 'kg',
  ALTER COLUMN unit SET NOT NULL,
  ALTER COLUMN quality_level TYPE varchar(10),
  ALTER COLUMN quality_level SET NOT NULL,
  ALTER COLUMN criteria_count SET DEFAULT 0,
  ALTER COLUMN criteria_count SET NOT NULL,
  ALTER COLUMN record_date SET DEFAULT current_date,
  ALTER COLUMN record_date SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'pending'::public.record_status,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN points_awarded SET DEFAULT 0,
  ALTER COLUMN created_at SET DEFAULT now();

-- Restricciones CHECK y UNIQUE oficiales. Se agregan solo si no existen por nombre.
DO $constraints$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.teams'::regclass AND conname='teams_name_key') THEN
    ALTER TABLE public.teams ADD CONSTRAINT teams_name_key UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.periods'::regclass AND conname='periods_name_key') THEN
    ALTER TABLE public.periods ADD CONSTRAINT periods_name_key UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.content_items'::regclass AND conname='content_items_category_check') THEN
    ALTER TABLE public.content_items ADD CONSTRAINT content_items_category_check CHECK (category IN ('agua','energia','papel','residuos'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.content_items'::regclass AND conname='content_items_type_check') THEN
    ALTER TABLE public.content_items ADD CONSTRAINT content_items_type_check CHECK (type IN ('text','image','video','file'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.content_items'::regclass AND conname='content_items_status_check') THEN
    ALTER TABLE public.content_items ADD CONSTRAINT content_items_status_check CHECK (status IN ('draft','published'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.recycling_records'::regclass AND conname='recycling_records_material_type_check') THEN
    ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_material_type_check CHECK (material_type IN ('papel_carton','plastico','vidrio','metal','organico'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.recycling_records'::regclass AND conname='recycling_records_quantity_check') THEN
    ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_quantity_check CHECK (quantity > 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.recycling_records'::regclass AND conname='recycling_records_quality_level_check') THEN
    ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_quality_level_check CHECK (quality_level IN ('alta','media','baja'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.recycling_records'::regclass AND conname='recycling_records_criteria_count_check') THEN
    ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_criteria_count_check CHECK (criteria_count >= 0);
  END IF;
END
$constraints$;

-- Sustituye solo las FK de las columnas oficiales para obtener las acciones ON
-- DELETE del esquema canonico. Los datos ya fueron validados contra huerfanos.
DO $foreign_keys$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT conrelid::regclass AS relation_name, conname
      FROM pg_constraint c
     WHERE c.contype='f' AND (
       (c.conrelid='public.users'::regclass AND c.conkey=ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.users'::regclass AND attname='team_id')]) OR
       (c.conrelid='public.content_items'::regclass AND c.conkey=ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.content_items'::regclass AND attname='created_by')]) OR
       (c.conrelid='public.recycling_records'::regclass AND c.conkey && ARRAY[
          (SELECT attnum FROM pg_attribute WHERE attrelid='public.recycling_records'::regclass AND attname='user_id'),
          (SELECT attnum FROM pg_attribute WHERE attrelid='public.recycling_records'::regclass AND attname='team_id'),
          (SELECT attnum FROM pg_attribute WHERE attrelid='public.recycling_records'::regclass AND attname='period_id'),
          (SELECT attnum FROM pg_attribute WHERE attrelid='public.recycling_records'::regclass AND attname='reviewed_by')
       ])
     )
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', item.relation_name, item.conname);
  END LOOP;

  ALTER TABLE public.users ADD CONSTRAINT users_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;
  ALTER TABLE public.content_items ADD CONSTRAINT content_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
  ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
  ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.periods(id) ON DELETE SET NULL;
  ALTER TABLE public.recycling_records ADD CONSTRAINT recycling_records_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;
END
$foreign_keys$;

CREATE UNIQUE INDEX IF NOT EXISTS points_catalog_identity_uidx ON public.points_catalog (
  lower(btrim(group_name)), lower(btrim(action_name)), lower(btrim(coalesce(action_level, '')))
);

-- Compatibilidad oficial conservada. No se copian rewards a prizes porque no
-- existe una equivalencia autorizada, y no se toca contents.
CREATE TABLE IF NOT EXISTS public.prizes (
  id serial PRIMARY KEY,
  name varchar(150) NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.winner_records (
  id serial PRIMARY KEY,
  period_id integer NOT NULL REFERENCES public.periods(id) ON DELETE CASCADE,
  team_id integer NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  prize_id integer REFERENCES public.prizes(id) ON DELETE SET NULL,
  final_score integer NOT NULL,
  created_at timestamp DEFAULT now(),
  UNIQUE (period_id, team_id)
);

DO $legacy_inventory$
BEGIN
  IF to_regclass('public.contents') IS NOT NULL THEN
    COMMENT ON TABLE public.contents IS 'LEGADO D01: contenido historico; conservar hasta clasificacion y migracion manual autorizada.';
  END IF;
  IF to_regclass('public.rewards') IS NOT NULL THEN
    COMMENT ON TABLE public.rewards IS 'LEGADO D01: recompensas historicas; conservar hasta conciliacion manual con prizes.';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teams' AND column_name='leader_id') THEN
    COMMENT ON COLUMN public.teams.leader_id IS 'LEGADO D01: conservar; no equivale automaticamente a users.team_id.';
  END IF;
END
$legacy_inventory$;

COMMIT;
