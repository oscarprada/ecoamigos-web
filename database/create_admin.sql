-- psql -X -n: no historial ni archivo de inicio. Datos dados por el responsable.
-- Requiere variables admin_name, admin_email y admin_password_hash.
-- No acepta una password plana ni modifica usuarios existentes.
\set ON_ERROR_STOP on
\if :{?admin_name}
\else
  DO $$ BEGIN RAISE EXCEPTION 'Falta admin_name. No se ha creado ninguna cuenta.'; END $$;
\endif
\if :{?admin_email}
\else
  DO $$ BEGIN RAISE EXCEPTION 'Falta admin_email. No se ha creado ninguna cuenta.'; END $$;
\endif
\if :{?admin_password_hash}
\else
  DO $$ BEGIN RAISE EXCEPTION 'Falta admin_password_hash bcrypt. No se ha creado ninguna cuenta.'; END $$;
\endif

BEGIN;
CREATE TEMP TABLE bootstrap_admin_input (
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  email TEXT NOT NULL CHECK (length(trim(email)) BETWEEN 1 AND 150),
  password_hash TEXT NOT NULL CHECK (password_hash ~ '^\$2[aby]\$10\$[./A-Za-z0-9]{53}$')
) ON COMMIT DROP;
INSERT INTO bootstrap_admin_input VALUES (:'admin_name', :'admin_email', :'admin_password_hash');
-- Conflictos no actualizan claves, roles ni identidad; se informa y se aborta.
INSERT INTO users (name, email, password_hash, role, is_active)
SELECT name, email, password_hash, 'admin', true FROM bootstrap_admin_input
RETURNING id, name, email, role;
COMMIT;
